import "server-only";

import { and, asc, eq, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";

import { db } from "@/lib/db";
import { cartItems, carts, products } from "@/lib/db/schema";
import { shippingFor } from "@/lib/format";

export const CART_COOKIE = "cf_cart";
// A separate name for the widget: its cookie must be SameSite=None to survive inside someone
// else's iframe, and a browser that ignores "Partitioned" would otherwise turn the shop cart into
// one cart shared with every site that embeds the widget.
export const EMBED_CART_COOKIE = "cf_cart_embed";
const MAX_QUANTITY = 10;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CartLine = {
  slug: string;
  name: string;
  brand: string;
  art: string;
  color: string;
  priceCents: number;
  quantity: number;
  stock: number;
  lineTotalCents: number;
};

export type Cart = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export class CartError extends Error {}

/**
 * Which cart this request is about. `x-cf-embed` comes from the widget's own fetches (it can be
 * forged, but that only picks the other cookie name, which is harmless); `Sec-Fetch-Dest: iframe`
 * is set by the browser on the /embed document itself and cannot be forged from a page.
 */
async function cartCookieName() {
  const h = await headers();
  const embedded = h.get("x-cf-embed") === "1" || h.get("sec-fetch-dest") === "iframe";
  return embedded ? EMBED_CART_COOKIE : CART_COOKIE;
}

async function readCartId() {
  const id = (await cookies()).get(await cartCookieName())?.value;
  return id && UUID.test(id) ? id : undefined;
}

// Creating a cart sets a cookie, so it is only allowed in Route Handlers and Server Functions,
// and only before a streamed response starts (the chat route calls this up front for its tools).
export async function ensureCartId() {
  const existing = await readCartId();
  if (existing) {
    const [row] = await db.select({ id: carts.id }).from(carts).where(eq(carts.id, existing));
    if (row) return existing;
  }
  const name = await cartCookieName();
  const embedded = name === EMBED_CART_COOKIE;
  const [created] = await db.insert(carts).values({}).returning({ id: carts.id });
  const production = process.env.NODE_ENV === "production";
  (await cookies()).set(name, created.id, {
    httpOnly: true,
    // In the widget the chat is a third-party iframe: a "lax" cookie would never come back.
    // "None" + Partitioned keeps that cart inside the host site's partition, separate from the shop.
    sameSite: embedded && production ? "none" : "lax",
    secure: embedded ? true : production,
    partitioned: embedded && production ? true : undefined,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return created.id;
}

async function loadCart(cartId: string | undefined): Promise<Cart> {
  const lines: CartLine[] = cartId
    ? (
        await db
          .select({
            slug: products.slug,
            name: products.name,
            brand: products.brand,
            art: products.art,
            color: products.color,
            priceCents: products.priceCents,
            stock: products.stock,
            quantity: cartItems.quantity,
          })
          .from(cartItems)
          .innerJoin(products, eq(products.id, cartItems.productId))
          .where(eq(cartItems.cartId, cartId))
          .orderBy(asc(cartItems.addedAt))
      ).map((l) => ({ ...l, lineTotalCents: l.priceCents * l.quantity }))
    : [];
  const subtotalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);
  const shippingCents = shippingFor(subtotalCents);
  return {
    lines,
    itemCount: lines.reduce((s, l) => s + l.quantity, 0),
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

export async function getCart() {
  return loadCart(await readCartId());
}

export async function setQuantity(slug: string, quantity: number, mode: "add" | "set") {
  const [product] = await db.select().from(products).where(eq(products.slug, slug));
  if (!product) throw new CartError(`Prodotto "${slug}" non trovato`);
  const cartId = await ensureCartId();
  const [current] = await db
    .select({ quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, product.id)));

  const target = Math.min(mode === "add" ? (current?.quantity ?? 0) + quantity : quantity, MAX_QUANTITY);
  if (target <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, product.id)));
  } else {
    if (product.stock === 0) throw new CartError(`${product.name} è esaurito`);
    if (target > product.stock) throw new CartError(`Disponibili solo ${product.stock} pezzi di ${product.name}`);
    await db
      .insert(cartItems)
      .values({ cartId, productId: product.id, quantity: target })
      .onConflictDoUpdate({ target: [cartItems.cartId, cartItems.productId], set: { quantity: target } });
  }
  await db.update(carts).set({ updatedAt: sql`now()` }).where(eq(carts.id, cartId));
  return { product, quantity: Math.max(target, 0), cart: await loadCart(cartId) };
}

export async function clearCart() {
  const cartId = await readCartId();
  if (cartId) await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
