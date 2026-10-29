import type { Metadata } from "next";

import { getLang } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

import { TutorialEn } from "./contenuto-en";
import { TutorialIt } from "./contenuto-it";

export const generateMetadata: () => Promise<Metadata> = metaFor("/tutorial", {
  it: {
    title: "Tutorial: il chatbot di assistenza sul tuo sito",
    description:
      "Dalla riga da incollare nel tuo sito fino al codice completo: come è fatto un assistente AI per un negozio, come si prova e come si mette online.",
  },
  en: {
    title: "Tutorial: a support chatbot on your website",
    description:
      "From the line you paste into your site to the complete code: how an AI assistant for a shop is built, tested and put online.",
  },
});

export default async function TutorialPage() {
  return (await getLang()) === "en" ? <TutorialEn /> : <TutorialIt />;
}
