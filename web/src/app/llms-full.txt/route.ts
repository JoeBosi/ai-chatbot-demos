import { categories, products } from "@/data/catalog";
import { categoriesEn, productsEn } from "@/data/en/catalog";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// The long form of llms.txt: the same data the pages show, as plain Markdown, Italian then English.
export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY.it}`,
    "",
    ...categories.flatMap((c) => [
      `## ${c.name}`,
      "",
      c.description,
      "",
      ...products
        .filter((p) => p.category === c.slug)
        .flatMap((p) => [`### ${p.name} (${p.brand})`, "", `${SITE_URL}/prodotti/${p.slug}`, "", p.description, ""]),
    ]),
    "# English",
    "",
    `> ${SITE_SUMMARY.en}`,
    "",
    ...categories.flatMap((c) => [
      `## ${categoriesEn[c.slug]?.name ?? c.name}`,
      "",
      categoriesEn[c.slug]?.description ?? c.description,
      "",
      ...products
        .filter((p) => p.category === c.slug)
        .flatMap((p) => [
          `### ${productsEn[p.slug]?.name ?? p.name} (${p.brand})`,
          "",
          `${SITE_URL}/en/prodotti/${p.slug}`,
          "",
          productsEn[p.slug]?.description ?? p.description,
          "",
        ]),
    ]),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
