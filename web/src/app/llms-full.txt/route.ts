import { categories, products } from "@/data/catalog";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// The long form of llms.txt: the same data the pages show, as plain Markdown.
export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
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
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
