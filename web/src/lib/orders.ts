import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";

import { clearCart, getCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { orders, products, supportTickets, type OrderEvent } from "@/lib/db/schema";

export type PublicOrder = {
  number: string;
  status: string;
  customerFirstName: string;
  city: string;
  createdAt: string;
  items: { name: string; quantity: number; priceCents: number }[];
  totalCents: number;
  shippingCents: number;
  carrier: string | null;
  trackingCode: string | null;
  estimatedDelivery: string | null;
  events: OrderEvent[];
};

export function normalizeOrderNumber(input: string) {
  const digits = input.replace(/\D/g, "");
  return digits ? `CF-${digits}` : input.trim().toUpperCase();
}

// An order is only disclosed when number and email match, so guessing
// order numbers reveals nothing.
export async function findOrder(orderNumber: string, email: string): Promise<PublicOrder | null> {
  const [order] = await db.select().from(orders).where(eq(orders.number, normalizeOrderNumber(orderNumber)));
  if (!order || order.email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return {
    number: order.number,
    status: order.status,
    customerFirstName: order.customerName.split(" ")[0],
    city: order.city,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, priceCents: i.priceCents })),
    totalCents: order.totalCents,
    shippingCents: order.shippingCents,
    carrier: order.carrier,
    trackingCode: order.trackingCode,
    estimatedDelivery: order.estimatedDelivery,
    events: order.events,
  };
}

async function nextNumber(prefix: string, table: "orders" | "support_tickets") {
  const rows = await db.execute<{ n: number }>(
    sql`select coalesce(max(substring(number from '[0-9]+$')::int), 0) + 1 as n from ${sql.identifier(table)}`,
  );
  const n = Math.max(Number(rows[0].n), prefix === "CF" ? 10500 : 2400);
  return `${prefix}-${n}`;
}

export class CheckoutError extends Error {}

export async function placeOrder(input: { name: string; email: string; city: string }) {
  const cart = await getCart();
  if (cart.lines.length === 0) throw new CheckoutError("Il carrello è vuoto");
  for (const line of cart.lines) {
    if (line.quantity > line.stock) throw new CheckoutError(`${line.name}: disponibili solo ${line.stock} pezzi`);
  }
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + 2);

  const order = await db.transaction(async (tx) => {
    for (const line of cart.lines) {
      // Conditional decrement: concurrent checkouts cannot push stock below zero.
      const updated = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${line.quantity}` })
        .where(and(eq(products.slug, line.slug), gte(products.stock, line.quantity)))
        .returning({ id: products.id });
      if (updated.length === 0) throw new CheckoutError(`${line.name}: non ci sono più abbastanza pezzi disponibili`);
    }
    const [created] = await tx
      .insert(orders)
      .values({
        number: await nextNumber("CF", "orders"),
        email: input.email.trim().toLowerCase(),
        customerName: input.name.trim(),
        city: input.city.trim(),
        status: "ricevuto",
        items: cart.lines.map((l) => ({ slug: l.slug, name: l.name, quantity: l.quantity, priceCents: l.priceCents })),
        subtotalCents: cart.subtotalCents,
        shippingCents: cart.shippingCents,
        totalCents: cart.totalCents,
        estimatedDelivery: delivery.toISOString().slice(0, 10),
        events: [{ at: now.toISOString(), status: "ricevuto", note: "Ordine demo ricevuto: nessun pagamento reale" }],
      })
      .returning();
    return created;
  });
  await clearCart();
  return order;
}

export async function createTicket(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  orderNumber?: string;
  toolCallId?: string;
}) {
  if (input.toolCallId) {
    const [existing] = await db.select().from(supportTickets).where(eq(supportTickets.toolCallId, input.toolCallId));
    if (existing) return existing;
  }
  const [ticket] = await db
    .insert(supportTickets)
    .values({
      toolCallId: input.toolCallId,
      number: await nextNumber("AS", "support_tickets"),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      topic: input.topic,
      message: input.message.trim(),
      orderNumber: input.orderNumber ? normalizeOrderNumber(input.orderNumber) : null,
    })
    .returning();
  return ticket;
}
