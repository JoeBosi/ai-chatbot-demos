import "server-only";

import type { SeedProduct } from "@/data/catalog";
import { helpDocs } from "@/data/help";

/**
 * The shape of the content, in one place: the first seed of an empty database (`setup.ts`) and the
 * re-sync of an existing one (`sync.ts`) must build rows and embedding texts in exactly the same
 * way, or every deploy would think half the catalogue changed and re-embed it.
 */
export const cents = (euros: number) => Math.round(euros * 100);

/** Help documents are one Markdown file per topic; each "## " heading becomes a searchable chunk. */
export function helpSections() {
  return helpDocs.flatMap((doc) =>
    doc.body
      .split(/^## /m)
      .filter(Boolean)
      .map((block, position) => {
        const [heading, ...rest] = block.split("\n");
        return {
          docSlug: doc.slug,
          docTitle: doc.title,
          section: heading.trim(),
          content: rest.join("\n").trim(),
          position,
        };
      }),
  );
}

export type HelpSection = ReturnType<typeof helpSections>[number];

/** What gets turned into a vector: title, heading and body — nothing else. */
export function helpEmbedText(
  s: Pick<HelpSection, "docTitle" | "section" | "content">,
) {
  return `${s.docTitle} - ${s.section}: ${s.content}`;
}

export function productEmbedText(
  p: Pick<SeedProduct, "name" | "brand" | "summary" | "description" | "tags">,
) {
  return `${p.name} (${p.brand}). ${p.summary} ${p.description} ${p.tags.join(", ")}`;
}

/** Seed product → database columns (everything except the embedding, which is computed in batch). */
export function productRow(p: SeedProduct) {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    categorySlug: p.category,
    priceCents: cents(p.price),
    compareAtCents: p.compareAt ? cents(p.compareAt) : null,
    stock: p.stock,
    rating: p.rating,
    reviewsCount: p.reviews,
    summary: p.summary,
    description: p.description,
    specs: p.specs,
    tags: p.tags,
    art: p.art,
    color: p.color,
  };
}
