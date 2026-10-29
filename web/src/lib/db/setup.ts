import path from "node:path";

import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { categories as seedCategories, products as seedProducts } from "@/data/catalog";
import { demoOrders, eventsFor } from "@/data/demo-orders";
import { db } from "@/lib/db";
import { carts, categories, chats, kbChunks, orders, products } from "@/lib/db/schema";
import { embedPassages } from "@/lib/embeddings";
import { cents, helpEmbedText, helpSections, productEmbedText, productRow } from "@/lib/db/seed-data";
import { describe as describeSync, planIsEmpty, syncContent } from "@/lib/db/sync";
import { shippingFor } from "@/lib/format";

async function seedCatalog() {
  await db.insert(categories).values(seedCategories.map((c, position) => ({ ...c, position })));
  const vectors = await embedPassages(seedProducts.map(productEmbedText));
  await db.insert(products).values(seedProducts.map((p, i) => ({ ...productRow(p), embedding: vectors[i] })));
}

async function seedHelp() {
  const sections = helpSections();
  const vectors = await embedPassages(sections.map(helpEmbedText));
  await db.insert(kbChunks).values(sections.map((s, i) => ({ ...s, embedding: vectors[i] })));
}

async function seedOrders() {
  const now = new Date();
  const priceBySlug = new Map(seedProducts.map((p) => [p.slug, p]));
  await db.insert(orders).values(
    demoOrders.map((o) => {
      const items = o.items.map((i) => {
        const p = priceBySlug.get(i.slug)!;
        return { slug: i.slug, name: p.name, quantity: i.quantity, priceCents: cents(p.price) };
      });
      const subtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
      const shipping = shippingFor(subtotal);
      const created = new Date(now);
      created.setDate(created.getDate() - o.createdDaysAgo);
      const events = eventsFor(o, now);
      let estimated: string | null = null;
      if (o.estimatedDeliveryInDays != null) {
        const d = new Date(now);
        d.setDate(d.getDate() + o.estimatedDeliveryInDays);
        estimated = d.toISOString().slice(0, 10);
      }
      return {
        number: o.number,
        email: o.email,
        customerName: o.customerName,
        city: o.city,
        status: o.status,
        items,
        subtotalCents: subtotal,
        shippingCents: shipping,
        totalCents: subtotal + shipping,
        carrier: o.carrier ?? null,
        trackingCode: o.trackingCode ?? null,
        estimatedDelivery: estimated,
        events,
        isDemo: 1,
        createdAt: new Date(events[0]?.at ?? created),
      };
    }),
  );
}

// Demo orders drift into the past; they are rebuilt on every start so the timeline stays believable.
export async function refreshDemoOrders() {
  await db.delete(orders).where(sql`${orders.isDemo} = 1`);
  await seedOrders();
}

// Daily reset of what visitors can change: stock goes back to the catalog values (demo checkouts
// must not sell out the shop), and old carts and conversations are deleted (30-day retention).
export async function maintainDemoData() {
  for (const p of seedProducts) {
    await db.update(products).set({ stock: p.stock }).where(eq(products.slug, p.slug));
  }
  await db.delete(carts).where(sql`${carts.updatedAt} < now() - interval '30 days'`);
  await db.delete(chats).where(sql`${chats.updatedAt} < now() - interval '30 days'`);
  await refreshDemoOrders();
}

export async function setupDatabase() {
  const started = Date.now();
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  const [{ count }] = await db.execute<{ count: number }>(sql`select count(*)::int as count from products`);
  if (count === 0) {
    await seedCatalog();
    await seedHelp();
    await seedOrders();
    console.log(`[setup] database seeded in ${Date.now() - started} ms`);
  } else {
    // The catalogue and the help centre live in `src/data/*`: whoever maintains the assistant edits
    // those files and deploys. Without this the new text would sit in the image and never reach the
    // database the assistant actually reads.
    const report = await syncContent();
    if (!planIsEmpty(report)) console.log(`[setup] contenuti aggiornati — ${describeSync(report)}`);
    await maintainDemoData();
    console.log(`[setup] migrations applied, demo data refreshed in ${Date.now() - started} ms`);
  }
}
