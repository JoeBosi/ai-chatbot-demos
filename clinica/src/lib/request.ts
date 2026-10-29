import "server-only";

/**
 * A browser sends `Origin` on every cross-site POST it makes, and cannot forge it. Refusing a
 * foreign origin stops a hostile page from driving these endpoints with the visitor's cookies
 * (CSRF) — the widget itself is not affected, because its iframe runs on this same origin.
 * Requests with no `Origin` at all (curl, a server) are let through: they carry nobody's session.
 */
export function isForeignOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("host");
  if (!host) return true;
  return origin !== `https://${host}` && origin !== `http://${host}`;
}

/** A cross-site HTML form can only send urlencoded/plain bodies: requiring JSON blocks that path. */
export function isNotJson(req: Request) {
  return !(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json");
}

/**
 * A public key, not a secret: it is printed in the tutorial and reaches every visitor's browser.
 * It exists so that crawlers and stray scripts cannot poke the endpoints for free, and so the key
 * can be changed if someone abuses it. When the variable is unset (local development) it is not
 * required, which keeps `npm run dev` working with no configuration.
 */
export function hasWidgetKey(req: Request) {
  const expected = process.env.WIDGET_PUBLIC_KEY;
  if (!expected) return true;
  return req.headers.get("x-cf-key") === expected;
}
