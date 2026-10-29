import { products } from "@/data/catalog";
import { productsEn } from "@/data/en/catalog";
import { AUTHOR, RELATED_SITES, SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a Markdown map of the site for language models, with an English
// section that points to the /en pages.
export function GET() {
  const link = (path: string, title: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY.it}`,
    "",
    `Autore: ${AUTHOR.signature.it}, ${AUTHOR.titles.it} (${AUTHOR.url.it}).`,
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
    "## English",
    "",
    `> ${SITE_SUMMARY.en}`,
    "",
    `Author: ${AUTHOR.signature.en}, ${AUTHOR.titles.en} (${AUTHOR.url.en}).`,
    "",
    link("/en", "Home", "the shop and the assistant"),
    link("/en/prodotti", "Products", "catalogue with category filters"),
    link("/en/assistenza", "Help centre", "shipping, returns, payments, warranty"),
    link("/en/come-funziona", "How this demo works", "what is real and what is made up"),
    link("/en/tutorial", "Tutorial", "the assistant's code explained step by step"),
    link("/en/manutenzione", "Maintaining the assistant", "how the content is kept up to date"),
    link("/en/operatore", "Operator's manual", "deploy, checks and recovery"),
    ...products.map((p) => link(`/en/prodotti/${p.slug}`, productsEn[p.slug]?.name ?? p.name, productsEn[p.slug]?.summary ?? p.summary)),
    "",
    "## Optional",
    "",
    `- [Testo completo / Full text](${SITE_URL}/llms-full.txt): schede di tutti i prodotti, in italiano e in inglese`,
    ...RELATED_SITES.map((s) => `- [${s.name}](${s.url.it}): ${s.note.it} / ${s.note.en}`),
    `- [Giuseppe Bosi](${AUTHOR.url.it}): sito dell'autore / author's website (${AUTHOR.url.en})`,
    `- [LinkedIn](${AUTHOR.linkedin}): profilo dell'autore / author's profile`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
