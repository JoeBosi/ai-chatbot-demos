import type { Metadata } from "next";
import Link from "next/link";

import { AskChip } from "@/components/assistant/ask";
import { ProductCard } from "@/components/shop/product-card";
import { getCategory, listCategories, searchProducts, type ProductFilters } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/prodotti", {
  title: "Prodotti",
  description:
    "Catalogo di macchine espresso, macinacaffè, caffè e accessori del negozio dimostrativo, con filtri per categoria e prezzo.",
});

const sorts: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "rating", label: "Più apprezzati" },
  { value: "price_asc", label: "Prezzo crescente" },
  { value: "price_desc", label: "Prezzo decrescente" },
];

export default async function ProductsPage({ searchParams }: PageProps<"/prodotti">) {
  const params = await searchParams;
  const categorySlug = typeof params.categoria === "string" ? params.categoria : undefined;
  const sortParam = typeof params.ordina === "string" ? params.ordina : "rating";
  const sort = sorts.some((s) => s.value === sortParam) ? (sortParam as ProductFilters["sort"]) : "rating";

  const [allCategories, category] = await Promise.all([listCategories(), categorySlug ? getCategory(categorySlug) : undefined]);
  const products = await searchProducts({ category: category?.slug, sort, limit: 12 });

  const href = (next: { categoria?: string; ordina?: string }) => {
    const q = new URLSearchParams();
    const c = "categoria" in next ? next.categoria : category?.slug;
    const o = "ordina" in next ? next.ordina : sort;
    if (c) q.set("categoria", c);
    if (o && o !== "rating") q.set("ordina", o);
    const s = q.toString();
    return s ? `/prodotti?${s}` : "/prodotti";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">{category?.name ?? "Tutti i prodotti"}</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        {category?.description ?? "Macchine espresso, macinacaffè, caffè della nostra torrefazione e accessori."}
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filtra per categoria">
          <ul className="flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ categoria: undefined })} aria-current={!category ? "page" : undefined} className={cn("rounded-full border px-3 py-1.5", !category && "bg-ink text-white border-ink")}>
                Tutti
              </Link>
            </li>
            {allCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={href({ categoria: c.slug })}
                  aria-current={category?.slug === c.slug ? "page" : undefined}
                  className={cn("hover:border-enamel rounded-full border px-3 py-1.5", category?.slug === c.slug && "bg-ink text-white border-ink")}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Ordina" className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Ordina:</span>
          {sorts.map((s) => (
            <Link key={s.value} href={href({ ordina: s.value })} aria-current={sort === s.value ? "true" : undefined} className={cn("hover:text-enamel", sort === s.value && "font-semibold underline underline-offset-4")}>
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span>Indeciso?</span>
        <AskChip
          question={category ? `Aiutami a scegliere tra ${category.name.toLowerCase()}: fammi una domanda alla volta` : "Aiutami a scegliere cosa comprare: fammi una domanda alla volta"}
          label="Fatti consigliare dal Barista"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
