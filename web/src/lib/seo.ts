import type { Metadata } from "next";

import { localPath, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

// One place for what search engines and AI crawlers read: site identity, author, canonical URLs.
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://chat-bot.giuseppebosi.com";
export const SITE_NAME = "Crema & Ferro";
export const SITE_SUMMARY: Record<Lang, string> = {
  it: "Negozio inventato di attrezzatura per il caffè, costruito per mostrare un assistente AI che consiglia prodotti, gestisce il carrello e risponde sugli ordini. Con un tutorial che spiega il codice passo per passo.",
  en: "A fictional coffee-gear shop built to show an AI assistant that recommends products, manages the cart and answers questions about orders. With a tutorial that explains the code step by step.",
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
    name: "Poliambulatorio Vallenova",
    url: { it: "https://chatbot-clinica.giuseppebosi.com", en: "https://chatbot-clinica.giuseppebosi.com/en" },
    note: { it: "lo stesso assistente in una clinica inventata, che prenota visite", en: "the same assistant in a fictional clinic that books appointments" },
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
        name: lang === "en" ? "An AI assistant inside a website: the tutorial" : "Un assistente AI dentro un sito: il tutorial",
        description:
          lang === "en"
            ? "How to build an assistant that uses a website's own data and put it on the site: streaming, tools, hybrid search, an embeddable widget and abuse protection."
            : "Come si costruisce e si mette in un sito un assistente conversazionale che usa i dati del sito: streaming, strumenti, ricerca ibrida, widget e difese contro l'abuso.",
        url: `${site}/tutorial`,
        inLanguage: lang,
        isAccessibleForFree: true,
        author,
        provider: author,
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT2H" },
      },
    ],
  };
}
