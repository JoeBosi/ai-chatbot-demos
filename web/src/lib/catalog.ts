import "server-only";

import { and, asc, desc, eq, gte, inArray, lte, sql, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { embedQuery } from "@/lib/embeddings";

export type Product = typeof products.$inferSelect;
export type ProductCard = Pick<
  Product,
  "slug" | "name" | "brand" | "categorySlug" | "priceCents" | "compareAtCents" | "stock" | "rating" | "reviewsCount" | "summary" | "art" | "color"
>;

const cardColumns = {
  slug: products.slug,
  name: products.name,
  brand: products.brand,
  categorySlug: products.categorySlug,
  priceCents: products.priceCents,
  compareAtCents: products.compareAtCents,
  stock: products.stock,
  rating: products.rating,
  reviewsCount: products.reviewsCount,
  summary: products.summary,
  art: products.art,
  color: products.color,
};

export function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.position));
}

export async function getCategory(slug: string) {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug));
  return row;
}

export async function getProduct(slug: string) {
  const [row] = await db.select().from(products).where(eq(products.slug, slug));
  return row;
}

export function getProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return Promise.resolve([] as Product[]);
  return db.select().from(products).where(inArray(products.slug, slugs));
}

export type ProductFilters = {
  query?: string;
  category?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "rating";
  limit?: number;
};

function filterConditions(f: ProductFilters) {
  const conds: SQL[] = [];
  if (f.category) conds.push(eq(products.categorySlug, f.category));
  if (f.minPriceCents != null) conds.push(gte(products.priceCents, f.minPriceCents));
  if (f.maxPriceCents != null) conds.push(lte(products.priceCents, f.maxPriceCents));
  if (f.inStockOnly) conds.push(sql`${products.stock} > 0`);
  return conds.length ? and(...conds) : undefined;
}

function sortOrder(sort: ProductFilters["sort"]) {
  switch (sort) {
    case "price_asc":
      return [asc(products.priceCents)];
    case "price_desc":
      return [desc(products.priceCents)];
    default:
      return [desc(products.rating), desc(products.reviewsCount)];
  }
}

// Hybrid search: Italian full-text rank and vector similarity fused with
// reciprocal rank fusion, so exact names and loose descriptions both match.
export async function searchProducts(f: ProductFilters): Promise<ProductCard[]> {
  const limit = Math.min(f.limit ?? 6, 12);
  const where = filterConditions(f);
  const query = f.query?.trim();

  if (!query) {
    return db.select(cardColumns).from(products).where(where).orderBy(...sortOrder(f.sort)).limit(limit);
  }

  const vector = JSON.stringify(await embedQuery(query));
  const filterSql = where ? sql`and ${where}` : sql``;
  const rows = await db.execute<{ slug: string }>(sql`
    with text_hits as (
      select id, row_number() over (
        order by ts_rank_cd(search_vector, websearch_to_tsquery('italian', ${query})) desc
      ) as r
      from products
      where search_vector @@ websearch_to_tsquery('italian', ${query}) ${filterSql}
      limit 30
    ),
    vector_hits as (
      select id, row_number() over (order by embedding <=> ${vector}::vector) as r,
        1 - (embedding <=> ${vector}::vector) as similarity
      from products
      where embedding is not null ${filterSql}
      order by embedding <=> ${vector}::vector
      limit 30
    ),
    fused as (
      select coalesce(t.id, v.id) as id,
        coalesce(1.0 / (60 + t.r), 0) + coalesce(1.0 / (60 + v.r), 0) as score,
        t.id is not null as text_match,
        coalesce(v.similarity, 0) as similarity
      from text_hits t full outer join vector_hits v on t.id = v.id
    )
    select p.slug from fused f join products p on p.id = f.id
    where f.text_match or f.similarity > 0.8
    order by f.score desc
    limit ${limit}
  `);

  const slugs = rows.map((r) => r.slug);
  if (slugs.length === 0) return [];
  const found = await db.select(cardColumns).from(products).where(inArray(products.slug, slugs));
  const bySlug = new Map(found.map((p) => [p.slug, p]));
  const ranked = slugs.map((s) => bySlug.get(s)).filter((p): p is ProductCard => Boolean(p));

  if (f.sort && f.sort !== "relevance") {
    const key = f.sort;
    ranked.sort((a, b) =>
      key === "price_asc" ? a.priceCents - b.priceCents : key === "price_desc" ? b.priceCents - a.priceCents : b.rating - a.rating,
    );
  }
  return ranked;
}
