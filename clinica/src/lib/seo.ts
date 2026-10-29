import type { Metadata } from "next";

import { localPath, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

// One place for what search engines and AI crawlers read: site identity, author, canonical URLs.
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://chatbot-clinica.giuseppebosi.com";
export const SITE_NAME = "Poliambulatorio Vallenova";
export const SITE_SUMMARY: Record<Lang, string> = {
  it: "Poliambulatorio inventato, costruito per mostrare un assistente AI che cerca nei documenti, calcola gli orari liberi e prenota solo dopo la conferma. Dà informazioni organizzative, mai pareri medici. Dati di fantasia.",
  en: "A fictional outpatient clinic built to show an AI assistant that searches documents, works out free slots and books only after confirmation. It gives organisational information, never medical advice. All data is made up.",
};

export const AUTHOR = {
  name: "Giuseppe Bosi",
  signature: { it: "Prof. Giuseppe Bosi", en: "by Prof. Giuseppe Bosi" } as Record<Lang, string>,
  titles: {
    it: "Dottore in Ingegneria Elettronica (V.O.), Professore di Scienze e Tecnologie Informatiche",
    en: "Master's-level degree in Electronic Engineering (5-year Italian Laurea, pre-reform, EQF level 7), Teacher of Computer Science and Technology",
  } as Record<Lang, string>,
  url: { it: "https://www.giuseppebosi.com", en: "https://www.giuseppebosi.com/en/" } as Record<Lang, string>,
  linkedin: "https://www.linkedin.com/in/giuseppebosi",
};

export const SOURCE_URL = "https://github.com/JoeBosi/ai-chatbot-demos";

// Sibling sites by the same author, linked from the footer, llms.txt and the structured data.
export const RELATED_SITES: { name: string; url: Record<Lang, string>; note: Record<Lang, string> }[] = [
  {
    name: "Crema & Ferro",
    url: { it: "https://chat-bot.giuseppebosi.com", en: "https://chat-bot.giuseppebosi.com/en" },
    note: { it: "lo stesso assistente in un negozio inventato, con il tutorial del codice", en: "the same assistant in a made-up shop, with the code tutorial" },
  },
  {
    name: "Corso pratico di llama.cpp",
    url: { it: "https://corso-llamacpp.giuseppebosi.com", en: "https://corso-llamacpp.giuseppebosi.com" },
    note: { it: "modelli linguistici in locale", en: "running language models locally" },
  },
  {
    name: "Corso JSON & API",
    url: { it: "https://corso-api-json.giuseppebosi.com", en: "https://corso-api-json.giuseppebosi.com" },
    note: { it: "formati di dati e API web", en: "data formats and web APIs" },
  },
  {
    name: "Claude Code Tutorial",
    url: { it: "https://claude-tutorial.giuseppebosi.com", en: "https://claude-tutorial.giuseppebosi.com" },
    note: { it: "programmare con un agente", en: "programming with an agent" },
  },
  {
    name: "Costruisci la tua memoria AI",
    url: { it: "https://corso-rag.giuseppebosi.com", en: "https://corso-rag.giuseppebosi.com" },
    note: { it: "ricerca nei documenti (RAG)", en: "document search (RAG)" },
  },
];

type Text = { title: string | { absolute: string }; description: string };

// Per-page metadata in the visitor's language. Open Graph is replaced, not merged, between layout
// and page, so every page gets the full object, its canonical URL and the hreflang alternates.
export function pageMeta(lang: Lang, path: string, meta: Text): Metadata {
  const title = typeof meta.title === "string" ? meta.title : meta.title.absolute;
  const url = localPath(lang, path);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { it: path, en: localPath("en", path), "x-default": path },
    },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_GB" : "it_IT",
      alternateLocale: lang === "en" ? "it_IT" : "en_GB",
      siteName: SITE_NAME,
      url,
      title,
      description: meta.description,
    },
  };
}

// For a page's `generateMetadata`: both texts side by side, the language picked per request.
export function metaFor(path: string, text: Record<Lang, Text>) {
  return async (): Promise<Metadata> => {
    const lang = await getLang();
    return pageMeta(lang, path, text[lang]);
  };
}

export function jsonLd(lang: Lang) {
  const author = {
    "@type": "Person",
    name: AUTHOR.name,
    honorificPrefix: "Prof.",
    jobTitle: AUTHOR.titles[lang],
    url: AUTHOR.url[lang],
    sameAs: [AUTHOR.linkedin],
  };
  const site = lang === "en" ? `${SITE_URL}/en` : SITE_URL;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: SITE_NAME,
        description: SITE_SUMMARY[lang],
        inLanguage: lang,
        author,
        isPartOf: { "@type": "WebSite", url: AUTHOR.url[lang] },
      },
      {
        "@type": "Course",
        name: lang === "en" ? "An AI assistant that books: the clinic example" : "Un assistente AI che prenota: l'esempio della clinica",
        description:
          lang === "en"
            ? "A working example of a chat assistant with tools: document search, availability calculation, booking with confirmation, refusal of medical advice."
            : "Un esempio da provare di assistente conversazionale con strumenti: ricerca nei documenti, calcolo delle disponibilità, prenotazione con conferma, rifiuto dei pareri medici.",
        url: `${site}/come-funziona`,
        inLanguage: lang,
        isAccessibleForFree: true,
        author,
        provider: author,
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT2H" },
      },
    ],
  };
}
