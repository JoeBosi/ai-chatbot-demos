import { z } from "zod";

import { CartError, getCart, setQuantity } from "@/lib/cart";
import { clientIp, consumeActionQuota, hashIp } from "@/lib/rate-limit";
import { hasWidgetKey, isForeignOrigin, isNotJson } from "@/lib/request";

export async function GET(req: Request) {
  if (!hasWidgetKey(req)) return Response.json({ error: "Chiave mancante." }, { status: 401 });
  return Response.json(await getCart(), { headers: { "Cache-Control": "no-store" } });
}

const updateSchema = z.object({
  slug: z.string().min(1).max(80),
  quantity: z.number().int().min(0).max(10),
  mode: z.enum(["add", "set"]).default("add"),
});

export async function POST(req: Request) {
  if (!hasWidgetKey(req)) return Response.json({ error: "Chiave mancante." }, { status: 401 });
  if (isForeignOrigin(req) || isNotJson(req)) {
    return Response.json({ error: "Richiesta non valida." }, { status: 403 });
  }
  const quota = await consumeActionQuota("cart", hashIp(clientIp(req.headers)));
  if (!quota.ok) {
    return Response.json({ error: quota.reason }, { status: 429, headers: { "Retry-After": String(quota.retryAfterSeconds) } });
  }
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  try {
    const { cart } = await setQuantity(parsed.data.slug, parsed.data.quantity, parsed.data.mode);
    return Response.json(cart);
  } catch (err) {
    if (err instanceof CartError) return Response.json({ error: err.message }, { status: 409 });
    throw err;
  }
}
