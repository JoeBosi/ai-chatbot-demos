import { prestazioniEn } from "@/data/en/prestazioni";
import { prestazioni } from "@/data/prestazioni";
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
    `Autore: ${AUTHOR.signature.it}, ${AUTHOR.titles.it} (${AUTHOR.url.it}). Testi CC BY 4.0, codice MIT.`,
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
    "## English",
    "",
    `> ${SITE_SUMMARY.en}`,
    "",
    `Author: ${AUTHOR.signature.en}, ${AUTHOR.titles.en} (${AUTHOR.url.en}). Texts CC BY 4.0, code MIT.`,
    "",
    link("/en", "Home", "the clinic and the assistant"),
    link("/en/specialita", "Specialties", "the clinic's areas"),
    link("/en/prestazioni", "Visits and tests", "prices, durations, preparation"),
    link("/en/medici", "Doctors and hours", "the specialists and their shifts"),
    link("/en/prenota", "Book", "test booking form"),
    link("/en/referti", "Collecting reports", "timing and how"),
    link("/en/dove-siamo", "Where we are", "floors and rooms"),
    link("/en/informazioni", "Information", "hours, payments, documents, accessibility"),
    link("/en/come-funziona", "How this demo works", "what is real, what is made up, what the assistant does not do"),
    link("/en/crediti", "Credits and licences", "author, tools, licences"),
    link("/en/privacy", "Privacy", "what data is kept and for how long"),
    ...prestazioni.map((p) => link(`/en/prestazioni/${p.slug}`, prestazioniEn[p.slug]?.nome ?? p.nome, `${p.durataMinuti} minutes, ${p.prezzoEuro} €`)),
    "",
    "## Optional",
    "",
    `- [Testo completo / Full text](${SITE_URL}/llms-full.txt): specialità, prestazioni e medici, in italiano e in inglese`,
    ...RELATED_SITES.map((s) => `- [${s.name}](${s.url.it}): ${s.note.it} / ${s.note.en}`),
    `- [Giuseppe Bosi](${AUTHOR.url.it}): sito dell'autore / author's website (${AUTHOR.url.en})`,
    `- [LinkedIn](${AUTHOR.linkedin}): profilo dell'autore / author's profile`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
