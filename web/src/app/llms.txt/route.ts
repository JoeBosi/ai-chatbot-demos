import { products } from "@/data/catalog";
import { AUTHOR, RELATED_SITES, SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a Markdown map of the site for language models.
export function GET() {
  const link = (path: string, title: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
    "",
    `Autore: ${AUTHOR.name}, ${AUTHOR.titles} (${AUTHOR.url}). `,
    "",
    "## Pagine principali",
    "",
    link("/", "Home", "il negozio e l'assistente"),
    link("/prodotti", "Prodotti", "catalogo con filtri per categoria"),
    link("/assistenza", "Centro assistenza", "spedizioni, resi, pagamenti, garanzia"),
    link("/come-funziona", "Come funziona la demo", "cosa è vero e cosa è inventato"),
    link("/tutorial", "Tutorial", "il codice dell'assistente spiegato passo per passo"),
    link("/manutenzione", "Mantenere l'assistente", "come si aggiornano i contenuti"),
    link("/operatore", "Manuale dell'operatore", "pubblicazione, controlli e ripristino"),
    "",
    "## Prodotti",
    "",
    ...products.map((p) => link(`/prodotti/${p.slug}`, p.name, p.summary)),
    "",
    "## Optional",
    "",
    `- [Testo completo](${SITE_URL}/llms-full.txt): schede di tutti i prodotti`,
    ...RELATED_SITES.map((s) => `- [${s.name}](${s.url}): ${s.note}`),
    `- [Giuseppe Bosi](${AUTHOR.url}): sito dell'autore`,
    `- [LinkedIn](${AUTHOR.linkedin}): profilo dell'autore`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
