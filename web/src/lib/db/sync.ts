import "server-only";

import { eq, inArray, notInArray } from "drizzle-orm";

import {
  categories as seedCategories,
  products as seedProducts,
} from "@/data/catalog";
import { db } from "@/lib/db";
import { cartItems, categories, kbChunks, products } from "@/lib/db/schema";
import { embedPassages } from "@/lib/embeddings";
import {
  helpSections,
  helpEmbedText,
  productEmbedText,
  productRow,
} from "@/lib/db/seed-data";

/**
 * Brings the database back in line with `src/data/*` — the files a maintainer actually edits.
 * Seeding only happens once, on an empty database, so without this a corrected price or a new
 * help section would never reach the running site.
 *
 * Embeddings are the expensive part (~40 ms each on CPU), so a row is re-embedded only when the
 * text that feeds the embedding changed: fixing a typo in a price does not recompute anything.
 * `dryRun` makes it report what it would do without writing, which is what `npm run content:check`
 * uses before a deploy.
 */
export type SyncPlan = {
  added: string[];
  updated: string[];
  reembedded: string[];
  removed: string[];
};

export type SyncReport = {
  categories: SyncPlan;
  products: SyncPlan;
  help: SyncPlan;
  dryRun: boolean;
};

const empty = (): SyncPlan => ({
  added: [],
  updated: [],
  reembedded: [],
  removed: [],
});

/**
 * Postgres stores `jsonb` with its own key order, so a plain JSON.stringify would report every
 * product as changed on every deploy (and re-save 27 rows for nothing). Sorting the keys first
 * compares the content, not the storage order.
 */
function stable(value: unknown): string {
  if (value === null || typeof value !== "object")
    return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(
    ([a], [b]) => a.localeCompare(b),
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(",")}}`;
}

export function planIsEmpty(report: SyncReport) {
  return [report.categories, report.products, report.help].every(
    (p) =>
      !p.added.length &&
      !p.updated.length &&
      !p.reembedded.length &&
      !p.removed.length,
  );
}

export function describe(report: SyncReport) {
  const line = (name: string, p: SyncPlan) =>
    `${name}: +${p.added.length} ~${p.updated.length} (${p.reembedded.length} ricalcolati) -${p.removed.length}`;
  return [
    line("categorie", report.categories),
    line("prodotti", report.products),
    line("assistenza", report.help),
  ].join(" · ");
}

async function syncCategories(dryRun: boolean) {
  const plan = empty();
  const rows = await db.select().from(categories);
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  for (const [position, seed] of seedCategories.entries()) {
    const row = bySlug.get(seed.slug);
    if (!row) {
      plan.added.push(seed.slug);
      if (!dryRun) await db.insert(categories).values({ ...seed, position });
      continue;
    }
    if (
      row.name !== seed.name ||
      row.description !== seed.description ||
      row.position !== position
    ) {
      plan.updated.push(seed.slug);
      if (!dryRun)
        await db
          .update(categories)
          .set({ ...seed, position })
          .where(eq(categories.slug, seed.slug));
    }
  }

  const keep = seedCategories.map((c) => c.slug);
  const orphans = rows.filter((r) => !keep.includes(r.slug)).map((r) => r.slug);
  plan.removed.push(...orphans);
  // A category is only dropped once its products are gone (the product sync runs right after),
  // so an orphan category with products still attached is left alone and reported next time.
  if (!dryRun && orphans.length) {
    const used = await db
      .select({ slug: products.categorySlug })
      .from(products)
      .where(inArray(products.categorySlug, orphans));
    const free = orphans.filter((slug) => !used.some((u) => u.slug === slug));
    if (free.length)
      await db.delete(categories).where(inArray(categories.slug, free));
  }
  return plan;
}

async function syncProducts(dryRun: boolean) {
  const plan = empty();
  const rows = await db.select().from(products);
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  // Everything that needs an embedding is collected first and computed in one batch: the model is
  // loaded once and the whole catalogue costs about as much as a handful of single calls.
  const toEmbed: { slug: string; text: string }[] = [];
  const updates: { slug: string; values: Record<string, unknown> }[] = [];
  const inserts: { slug: string; values: Record<string, unknown> }[] = [];

  for (const seed of seedProducts) {
    const values = productRow(seed);
    const row = bySlug.get(seed.slug);
    const text = productEmbedText(seed);
    if (!row) {
      plan.added.push(seed.slug);
      plan.reembedded.push(seed.slug);
      inserts.push({ slug: seed.slug, values });
      toEmbed.push({ slug: seed.slug, text });
      continue;
    }
    const changed = Object.entries(values).filter(([key, value]) => {
      const current = (row as Record<string, unknown>)[key];
      return stable(current) !== stable(value);
    });
    const embedChanged =
      productEmbedText({ ...seed }) !== productEmbedText(rowAsSeed(row));
    if (!changed.length && !embedChanged) continue;
    plan.updated.push(seed.slug);
    updates.push({ slug: seed.slug, values });
    if (embedChanged) {
      plan.reembedded.push(seed.slug);
      toEmbed.push({ slug: seed.slug, text });
    }
  }

  const keep = seedProducts.map((p) => p.slug);
  plan.removed.push(
    ...rows.filter((r) => !keep.includes(r.slug)).map((r) => r.slug),
  );

  if (dryRun) return plan;

  const vectors = toEmbed.length
    ? await embedPassages(toEmbed.map((t) => t.text))
    : [];
  const vectorBySlug = new Map(toEmbed.map((t, i) => [t.slug, vectors[i]]));

  for (const { slug, values } of inserts) {
    await db
      .insert(products)
      .values({
        ...values,
        embedding: vectorBySlug.get(slug),
      } as typeof products.$inferInsert);
  }
  for (const { slug, values } of updates) {
    const embedding = vectorBySlug.get(slug);
    await db
      .update(products)
      .set({ ...values, ...(embedding ? { embedding } : {}) } as Partial<
        typeof products.$inferInsert
      >)
      .where(eq(products.slug, slug));
  }
  if (plan.removed.length) {
    // cart_items points at products without ON DELETE CASCADE: the carts of visitors who were
    // holding a discontinued product are cleaned first, otherwise the delete fails.
    const gone = await db
      .select({ id: products.id })
      .from(products)
      .where(notInArray(products.slug, keep));
    const ids = gone.map((g) => g.id);
    if (ids.length) {
      await db.delete(cartItems).where(inArray(cartItems.productId, ids));
      await db.delete(products).where(inArray(products.id, ids));
    }
  }
  return plan;
}

/** The subset of a database row that the embedding text is built from. */
function rowAsSeed(row: typeof products.$inferSelect) {
  return {
    name: row.name,
    brand: row.brand,
    summary: row.summary,
    description: row.description,
    tags: row.tags,
  };
}

async function syncHelp(dryRun: boolean) {
  const plan = empty();
  const sections = helpSections();
  const rows = await db.select().from(kbChunks);
  const key = (s: { docSlug: string; position: number }) =>
    `${s.docSlug}#${s.position}`;
  const byKey = new Map(rows.map((r) => [key(r), r]));

  const toEmbed: { key: string; text: string }[] = [];
  const inserts: typeof sections = [];
  const updates: { id: number; section: (typeof sections)[number] }[] = [];

  for (const s of sections) {
    const row = byKey.get(key(s));
    if (!row) {
      plan.added.push(`${s.docSlug} · ${s.section}`);
      inserts.push(s);
      toEmbed.push({ key: key(s), text: helpEmbedText(s) });
      continue;
    }
    if (
      row.docTitle === s.docTitle &&
      row.section === s.section &&
      row.content === s.content
    )
      continue;
    plan.updated.push(`${s.docSlug} · ${s.section}`);
    updates.push({ id: row.id, section: s });
    // Title, heading and body are exactly what the embedding is made of: any change re-embeds.
    plan.reembedded.push(`${s.docSlug} · ${s.section}`);
    toEmbed.push({ key: key(s), text: helpEmbedText(s) });
  }

  const keep = new Set(sections.map(key));
  const orphans = rows.filter((r) => !keep.has(key(r)));
  plan.removed.push(...orphans.map((r) => `${r.docSlug} · ${r.section}`));

  if (dryRun) return plan;

  const vectors = toEmbed.length
    ? await embedPassages(toEmbed.map((t) => t.text))
    : [];
  const vectorByKey = new Map(toEmbed.map((t, i) => [t.key, vectors[i]]));

  for (const s of inserts) {
    await db
      .insert(kbChunks)
      .values({ ...s, embedding: vectorByKey.get(key(s)) });
  }
  for (const { id, section } of updates) {
    await db
      .update(kbChunks)
      .set({ ...section, embedding: vectorByKey.get(key(section)) })
      .where(eq(kbChunks.id, id));
  }
  if (orphans.length) {
    await db.delete(kbChunks).where(
      inArray(
        kbChunks.id,
        orphans.map((o) => o.id),
      ),
    );
  }
  return plan;
}

export async function syncContent({
  dryRun = false,
} = {}): Promise<SyncReport> {
  return {
    categories: await syncCategories(dryRun),
    products: await syncProducts(dryRun),
    help: await syncHelp(dryRun),
    dryRun,
  };
}
