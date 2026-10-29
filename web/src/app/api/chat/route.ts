import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  pruneMessages,
  RetryError,
  streamText,
  toUIMessageStream,
  APICallError,
} from "ai";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { products as catalog } from "@/data/catalog";
import { chatModel } from "@/lib/ai/provider";
import { guardEmptyReply } from "@/lib/ai/empty-reply";
import { buildInstructions, type PageContext } from "@/lib/ai/instructions";
import { tools, type ShopUIMessage } from "@/lib/ai/tools";
import { ensureCartId } from "@/lib/cart";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { clientIp, consumeChatQuota, hashIp } from "@/lib/rate-limit";
import { hasWidgetKey, isForeignOrigin, isNotJson } from "@/lib/request";

export const maxDuration = 120;

const MAX_BODY = 400_000;
const MAX_MESSAGES = 40;
const MAX_TEXT = 1000;
const MAX_ASSISTANT_TEXT = 8000;
const MAX_TOTAL_TEXT = 24_000;
const PAGE_PATH = /^\/[a-z0-9/-]{0,120}$/;

const bodySchema = z.object({
  id: z.string().min(1).max(100),
  messages: z.array(z.looseObject({ id: z.string(), role: z.enum(["user", "assistant"]), parts: z.array(z.looseObject({ type: z.string() })) })).min(1).max(200),
  context: z
    .object({
      path: z.string().max(200).optional(),
      productSlug: z.string().max(80).optional(),
      productName: z.string().max(120).optional(),
    })
    .optional(),
});

function jsonError(status: number, message: string, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers });
}

type Body = z.infer<typeof bodySchema>;

// The history comes from the browser, so all of it is untrusted: keep only the part types the
// assistant itself produces (users send plain text) and bound every text.
function sanitizeMessages(input: Body["messages"]): { messages: ShopUIMessage[] } | { error: string } {
  let total = 0;
  const messages: Body["messages"] = [];
  for (const m of input) {
    const parts = m.parts.filter((p) =>
      m.role === "user"
        ? p.type === "text"
        : p.type === "text" || p.type === "step-start" || (p.type.startsWith("tool-") && p.type.slice(5) in tools),
    );
    for (const p of parts) {
      if (p.type !== "text") continue;
      const length = typeof p.text === "string" ? p.text.length : 0;
      if (m.role === "user" && length > MAX_TEXT) return { error: `Il messaggio è troppo lungo (massimo ${MAX_TEXT} caratteri).` };
      if (length > MAX_ASSISTANT_TEXT) return { error: "Richiesta non valida." };
      total += length;
    }
    if (parts.length > 0) messages.push({ ...m, parts });
  }
  if (total > MAX_TOTAL_TEXT) return { error: "Conversazione troppo lunga: iniziane una nuova." };
  return { messages: messages as unknown as ShopUIMessage[] };
}

// Only the slug is trusted from the client; the product name comes from the catalog.
function pageContext(context: Body["context"]): PageContext {
  const product = context?.productSlug ? catalog.find((p) => p.slug === context.productSlug) : undefined;
  return {
    path: context?.path && PAGE_PATH.test(context.path) ? context.path : undefined,
    productSlug: product?.slug,
    productName: product?.name,
  };
}

export async function POST(req: Request) {
  if (!hasWidgetKey(req)) return jsonError(401, "Chiave mancante: vedi /tutorial.");
  if (isForeignOrigin(req) || isNotJson(req)) return jsonError(403, "Richiesta non valida.");
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) {
    return jsonError(413, "Conversazione troppo lunga: iniziane una nuova.");
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) return jsonError(413, "Conversazione troppo lunga: iniziane una nuova.");

  let parsed: Body;
  try {
    parsed = bodySchema.parse(JSON.parse(raw));
  } catch {
    return jsonError(400, "Richiesta non valida.");
  }
  const sanitized = sanitizeMessages(parsed.messages);
  if ("error" in sanitized) return jsonError(400, sanitized.error);
  const { messages } = sanitized;

  // A turn starts from a user message, or resumes after the user answered a tool approval.
  const last = messages.at(-1);
  const resumesApproval = last?.role === "assistant" && last.parts.some((p) => "state" in p && p.state === "approval-responded");
  if (!last || (last.role !== "user" && !resumesApproval)) return jsonError(400, "Richiesta non valida.");

  // Every request that reaches the model counts, approval resumptions included.
  const ipHash = hashIp(clientIp(req.headers));
  const quota = await consumeChatQuota(ipHash);
  if (!quota.ok) return jsonError(429, quota.reason, { "Retry-After": String(quota.retryAfterSeconds) });

  // Tools such as addToCart run while the response is streaming, when headers are already sent.
  await ensureCartId();

  const { model, label } = chatModel();
  const modelMessages = pruneMessages({
    messages: await convertToModelMessages(messages.slice(-MAX_MESSAGES), { tools, ignoreIncompleteToolCalls: true }),
    reasoning: "all",
  });

  const result = streamText({
    model,
    instructions: buildInstructions(pageContext(parsed.context)),
    messages: modelMessages,
    tools,
    toolApproval: { createSupportTicket: "user-approval" },
    experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET,
    stopWhen: isStepCount(6),
    // Tetto duro alla lunghezza: le risposte devono stare in 2-3 frasi (vedi le istruzioni).
    maxOutputTokens: 600,
    temperature: 0.3,
    maxRetries: 2,
    timeout: { totalMs: 110_000, firstChunkMs: 45_000 },
    providerOptions: { openrouter: { user: ipHash } },
  });

  let servedBy: string | undefined;

  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof tools, ShopUIMessage>({
      stream: result.stream.pipeThrough(guardEmptyReply()),
      tools,
      originalMessages: messages,
      messageMetadata: ({ part }) => {
        if (part.type === "finish-step") servedBy = part.response.modelId;
        if (part.type === "finish") return { model: servedBy ?? label };
      },
      onError: (error) => {
        console.error("[chat] stream error", error);
        const cause = error instanceof RetryError ? error.lastError : error;
        if (APICallError.isInstance(cause) && cause.statusCode === 429) {
          return "I modelli gratuiti sono molto richiesti in questo momento. Riprova tra un minuto.";
        }
        return "Il Barista non riesce a rispondere in questo momento. Riprova tra poco.";
      },
      onEnd: async ({ messages: finalMessages }) => {
        try {
          await db
            .insert(chats)
            .values({ id: parsed.id, messages: finalMessages, model: servedBy ?? label, ipHash })
            .onConflictDoUpdate({
              target: chats.id,
              set: { messages: finalMessages, model: servedBy ?? label, updatedAt: sql`now()` },
              // The id is chosen by the browser: never let another visitor overwrite a conversation.
              setWhere: eq(chats.ipHash, ipHash),
            });
        } catch (err) {
          console.error("[chat] could not save conversation", err);
        }
      },
    }),
  });
}
