import type { Metadata } from "next";

import { getLang } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

import { ManutenzioneEn } from "./contenuto-en";
import { ManutenzioneIt } from "./contenuto-it";

export const generateMetadata: () => Promise<Metadata> = metaFor("/manutenzione", {
  it: {
    title: "Mantenere l’assistente: correggere, ampliare, cambiare tono",
    description:
      "Guida pratica per chi cura il chatbot ogni settimana: correggere una risposta sbagliata, aggiungere o togliere informazioni, definire i concetti, cambiare il tono e provare prima di pubblicare.",
  },
  en: {
    title: "Maintaining the assistant: fix, extend, change the tone",
    description:
      "A practical guide for whoever looks after the chatbot every week: fix a wrong answer, add or remove information, define concepts, change the tone and test before publishing.",
  },
});

export default async function ManutenzionePage() {
  return (await getLang()) === "en" ? <ManutenzioneEn /> : <ManutenzioneIt />;
}
