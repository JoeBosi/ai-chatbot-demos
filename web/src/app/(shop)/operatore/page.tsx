import type { Metadata } from "next";

import { getLang } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

import { OperatoreEn } from "./contenuto-en";
import { OperatoreIt } from "./contenuto-it";

export const generateMetadata: () => Promise<Metadata> = metaFor("/operatore", {
  it: {
    title: "Manuale dell’operatore: tenere in piedi l’assistente",
    description:
      "Runbook per chi gestisce il servizio: controlli quotidiani, deploy e rollback, backup del database, rotazione delle chiavi, cambio del modello, limiti e pronto soccorso ai guasti.",
  },
  en: {
    title: "Operator's manual: keeping the assistant running",
    description:
      "Runbook for whoever runs the service: daily checks, deploy and rollback, database backups, key rotation, changing the model, limits and first aid for failures.",
  },
});

export default async function OperatorePage() {
  return (await getLang()) === "en" ? <OperatoreEn /> : <OperatoreIt />;
}
