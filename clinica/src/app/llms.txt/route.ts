import { prestazioni } from "@/data/prestazioni";
import { AUTHOR, RELATED_SITES, SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a Markdown map of the site for language models.
export function GET() {
  const link = (path: string, title: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
    "",
    `Autore: ${AUTHOR.name}, ${AUTHOR.titles} (${AUTHOR.url}). Testi CC BY 4.0, codice MIT.`,
    "",
    "## Pagine principali",
    "",
    link("/", "Home", "il poliambulatorio e l'assistente"),
    link("/specialita", "Specialità", "le aree della clinica"),
    link("/prestazioni", "Visite ed esami", "prezzi, durate, preparazione"),
    link("/medici", "Medici e orari", "gli specialisti e i loro turni"),
    link("/prenota", "Prenota", "form di prenotazione di prova"),
    link("/referti", "Ritiro dei referti", "tempi e modalità"),
    link("/dove-siamo", "Dove siamo", "piani e stanze"),
    link("/informazioni", "Informazioni", "orari, pagamenti, documenti, accessibilità"),
    link("/come-funziona", "Com'è fatta questa demo", "cosa è vero, cosa è inventato, cosa l'assistente non fa"),
    link("/crediti", "Crediti e licenze", "autore, strumenti, licenze"),
    link("/privacy", "Privacy", "quali dati restano e per quanto"),
    "",
    "## Visite ed esami",
    "",
    ...prestazioni.map((p) => link(`/prestazioni/${p.slug}`, p.nome, `${p.durataMinuti} minuti, ${p.prezzoEuro} €`)),
    "",
    "## Optional",
    "",
    `- [Testo completo](${SITE_URL}/llms-full.txt): specialità, prestazioni e medici`,
    ...RELATED_SITES.map((s) => `- [${s.name}](${s.url}): ${s.note}`),
    `- [Giuseppe Bosi](${AUTHOR.url}): sito dell'autore`,
    `- [LinkedIn](${AUTHOR.linkedin}): profilo dell'autore`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
