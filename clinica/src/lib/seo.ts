import type { Metadata } from "next";

// One place for what search engines and AI crawlers read: site identity, author, canonical URLs.
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://chatbot-clinica.giuseppebosi.com";
export const SITE_NAME = "Poliambulatorio Vallenova";
export const SITE_SUMMARY =
  "Poliambulatorio inventato, costruito per mostrare un assistente AI che cerca nei documenti, calcola gli orari liberi e prenota solo dopo la conferma. Dà informazioni organizzative, mai pareri medici. Dati di fantasia.";

export const AUTHOR = {
  name: "Giuseppe Bosi",
  titles: "Dottore in Ingegneria Elettronica (V.O.), Professore di Scienze e Tecnologie Informatiche",
  url: "https://www.giuseppebosi.com",
  linkedin: "https://www.linkedin.com/in/giuseppebosi",
};

export const SOURCE_URL = "https://github.com/JoeBosi/ai-chatbot-demos";

// Sibling sites by the same author, linked from the footer, llms.txt and the structured data.
export const RELATED_SITES = [
  { name: "Crema & Ferro", url: "https://chat-bot.giuseppebosi.com", note: "lo stesso assistente in un negozio inventato, con il tutorial del codice" },
  { name: "Corso pratico di llama.cpp", url: "https://corso-llamacpp.giuseppebosi.com", note: "modelli linguistici in locale" },
  { name: "Corso JSON & API", url: "https://corso-api-json.giuseppebosi.com", note: "formati di dati e API web" },
  { name: "Claude Code Tutorial", url: "https://claude-tutorial.giuseppebosi.com", note: "programmare con un agente" },
  { name: "Costruisci la tua memoria AI", url: "https://corso-rag.giuseppebosi.com", note: "ricerca nei documenti (RAG)" },
];

// Per-page metadata: Open Graph is replaced, not merged, between layout and page, so every page
// gets the full object together with its canonical URL.
export function pageMeta(path: string, meta: { title: string | { absolute: string }; description: string }): Metadata {
  const title = typeof meta.title === "string" ? meta.title : meta.title.absolute;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "it_IT", siteName: SITE_NAME, url: path, title, description: meta.description },
  };
}

export function jsonLd() {
  const author = {
    "@type": "Person",
    name: AUTHOR.name,
    honorificPrefix: "Prof.",
    jobTitle: AUTHOR.titles,
    url: AUTHOR.url,
    sameAs: [AUTHOR.linkedin],
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_SUMMARY,
        inLanguage: "it",
        author,
        isPartOf: { "@type": "WebSite", url: AUTHOR.url },
      },
      {
        "@type": "Course",
        name: "Un assistente AI che prenota: l'esempio della clinica",
        description: "Un esempio da provare di assistente conversazionale con strumenti: ricerca nei documenti, calcolo delle disponibilità, prenotazione con conferma, rifiuto dei pareri medici.",
        url: `${SITE_URL}/come-funziona`,
        inLanguage: "it",
        isAccessibleForFree: true,
        author,
        provider: author,
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT2H" },
      },
    ],
  };
}
