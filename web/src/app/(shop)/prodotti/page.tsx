import type { Metadata } from "next";
import Link from "next/link";

import { AskChip } from "@/components/assistant/ask";
import { ProductCard } from "@/components/shop/product-card";
import { localizeCategory } from "@/data/en/catalog";
import { getCategory, listCategories, searchProducts, type ProductFilters } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n-server";
import { cn } from "@/lib/utils";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/prodotti", {
  it: {
    title: "Prodotti",
    description:
      "Catalogo di macchine espresso, macinacaffè, caffè e accessori del negozio dimostrativo, con filtri per categoria e prezzo.",
  },
  en: {
    title: "Products",
    description:
      "Catalogue of espresso machines, grinders, coffee and accessories in the demo shop, with filters by category and price.",
  },
});

const sorts: { value: NonNullable<ProductFilters["sort"]>; label: string; en: string }[] = [
  { value: "rating", label: "Più apprezzati", en: "Top rated" },
  { value: "price_asc", label: "Prezzo crescente", en: "Price: low to high" },
  { value: "price_desc", label: "Prezzo decrescente", en: "Price: high to low" },
];

export default async function ProductsPage({ searchParams }: PageProps<"/prodotti">) {
  const params = await searchParams;
  const categorySlug = typeof params.categoria === "string" ? params.categoria : undefined;
  const sortParam = typeof params.ordina === "string" ? params.ordina : "rating";
  const sort = sorts.some((s) => s.value === sortParam) ? (sortParam as ProductFilters["sort"]) : "rating";

  const [itCategories, itCategory, { t, href: local, lang }] = await Promise.all([listCategories(), categorySlug ? getCategory(categorySlug) : undefined, getI18n()]);
  const allCategories = itCategories.map((c) => localizeCategory(lang, c));
  const category = itCategory && localizeCategory(lang, itCategory);
  const products = await searchProducts({ category: category?.slug, sort, limit: 12 });

  const href = (next: { categoria?: string; ordina?: string }) => {
    const q = new URLSearchParams();
    const c = "categoria" in next ? next.categoria : category?.slug;
    const o = "ordina" in next ? next.ordina : sort;
    if (c) q.set("categoria", c);
    if (o && o !== "rating") q.set("ordina", o);
    const s = q.toString();
    return local(s ? `/prodotti?${s}` : "/prodotti");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">{category?.name ?? t("Tutti i prodotti", "All products")}</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        {category?.description ?? t("Macchine espresso, macinacaffè, caffè della nostra torrefazione e accessori.", "Espresso machines, grinders, coffee from our roastery and accessories.")}
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label={t("Filtra per categoria", "Filter by category")}>
          <ul className="flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ categoria: undefined })} aria-current={!category ? "page" : undefined} className={cn("rounded-full border px-3 py-1.5", !category && "bg-ink text-white border-ink")}>
                {t("Tutti", "All")}
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
        <nav aria-label={t("Ordina", "Sort")} className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{t("Ordina:", "Sort:")}</span>
          {sorts.map((s) => (
            <Link key={s.value} href={href({ ordina: s.value })} aria-current={sort === s.value ? "true" : undefined} className={cn("hover:text-enamel", sort === s.value && "font-semibold underline underline-offset-4")}>
              {lang === "en" ? s.en : s.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span>{t("Indeciso?", "Not sure?")}</span>
        <AskChip
          question={
            lang === "en"
              ? category
                ? `Help me choose among ${category.name.toLowerCase()}: ask me one question at a time`
                : "Help me choose what to buy: ask me one question at a time"
              : category
                ? `Aiutami a scegliere tra ${category.name.toLowerCase()}: fammi una domanda alla volta`
                : "Aiutami a scegliere cosa comprare: fammi una domanda alla volta"
          }
          label={t("Fatti consigliare dal Barista", "Get advice from the Barista")}
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
