import "server-only";

import { createHash } from "node:crypto";

import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

// In-memory limits are enough for a single container. The free LLM router allows
// about 1000 requests a day for the whole account, so the global cap protects the demo.
const perVisitorBurst = new RateLimiterMemory({ keyPrefix: "burst", points: 8, duration: 60 });
const perVisitorDaily = new RateLimiterMemory({ keyPrefix: "day", points: 40, duration: 60 * 60 * 24 });
// A handful of IPs could otherwise eat the whole day's budget in a minute and leave the assistant
// mute for everyone: this spreads the daily allowance over the day.
const globalBurst = new RateLimiterMemory({ keyPrefix: "global-burst", points: 40, duration: 60 * 10 });
const globalDaily = new RateLimiterMemory({
  keyPrefix: "global",
  points: Number(process.env.CHAT_DAILY_LIMIT ?? 600),
  duration: 60 * 60 * 24,
});

// Le operazioni che scrivono nel database hanno un tetto a parte: una prenotazione occupa un posto
// in agenda, quindi un visitatore non può riempire l'agenda della demo da solo.
const actionLimits = {
  prenotazione: new RateLimiterMemory({ keyPrefix: "prenotazione", points: 6, duration: 60 * 60 }),
  ricerca: new RateLimiterMemory({ keyPrefix: "ricerca", points: 30, duration: 60 }),
};

export function clientIp(headers: Headers) {
  // Caddy sets X-Real-IP; the app port is bound to 127.0.0.1 so clients cannot bypass it.
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? "dev"}:${ip}`)
    .digest("hex")
    .slice(0, 24);
}

export type LimitResult = { ok: true } | { ok: false; retryAfterSeconds: number; reason: string };

export async function consumeChatQuota(ipHash: string): Promise<LimitResult> {
  try {
    await perVisitorBurst.consume(ipHash);
  } catch (e) {
    return blocked(e, "Stai scrivendo molto velocemente: aspetta qualche secondo e riprova.");
  }
  try {
    await perVisitorDaily.consume(ipHash);
  } catch (e) {
    return blocked(e, "Hai raggiunto il limite giornaliero di messaggi della demo. Torna domani.");
  }
  try {
    await globalBurst.consume("all");
  } catch (e) {
    return blocked(e, "In questo momento l’assistente ha troppe richieste. Riprovi tra qualche minuto.");
  }
  try {
    await globalDaily.consume("all");
  } catch (e) {
    return blocked(e, "La demo ha esaurito i messaggi gratuiti di oggi. Riprova domani.");
  }
  return { ok: true };
}

export async function consumeActionQuota(action: keyof typeof actionLimits, ipHash: string): Promise<LimitResult> {
  try {
    await actionLimits[action].consume(ipHash);
    return { ok: true };
  } catch (e) {
    return blocked(e, "Troppe operazioni ravvicinate: aspetta un momento e riprova.");
  }
}

function blocked(e: unknown, reason: string): LimitResult {
  const ms = e instanceof RateLimiterRes ? e.msBeforeNext : 60_000;
  return { ok: false, retryAfterSeconds: Math.ceil(ms / 1000), reason };
}
