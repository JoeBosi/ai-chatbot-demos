import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

// Provider and model are chosen by environment, so moving from the free router
// to a paid model or another vendor is a configuration change, not a code change.
//   AI_PROVIDER=openrouter  AI_MODEL=openrouter/free   (default: zero cost)
//   AI_PROVIDER=openai      AI_MODEL=<model id>
export function chatModel(): { model: LanguageModel; label: string } {
  const provider = process.env.AI_PROVIDER ?? "openrouter";
  const modelId = process.env.AI_MODEL ?? "openrouter/free";

  if (provider === "openai") {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return { model: openai(modelId), label: modelId };
  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
      "HTTP-Referer": process.env.PUBLIC_SITE_URL ?? "https://chat-bot.giuseppebosi.com",
      "X-Title": "Crema & Ferro demo",
    },
  });
  return {
    model: openrouter.chat(modelId, {
      // Only route to models that support every parameter we send (tools included),
      // skip Liquid (its 2.6B free model often ends a turn with no text after a tool call),
      // and keep hidden reasoning out of the message history.
      // AI_FALLBACK_MODELS (comma separated) are tried in order when the main model is busy or down.
      extraBody: { ...fallbacks(modelId), provider: { require_parameters: true, ignore: ["liquid"] }, reasoning: { exclude: true } },
    }),
    label: modelId,
  };
}

// OpenRouter tries `models` in order; the main model goes first so it stays the preferred one.
function fallbacks(modelId: string) {
  const extra = (process.env.AI_FALLBACK_MODELS ?? "").split(",").map((m) => m.trim()).filter(Boolean);
  return extra.length > 0 ? { models: [modelId, ...extra] } : {};
}
