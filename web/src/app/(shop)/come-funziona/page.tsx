import type { Metadata } from "next";

import { getI18n } from "@/lib/i18n-server";
import type { Lang } from "@/lib/i18n";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/come-funziona", {
  it: {
    title: "Come funziona la demo",
    description:
      "Cosa è vero e cosa è inventato in questo negozio dimostrativo, cosa fa l'assistente AI e che dati conserva.",
  },
  en: {
    title: "How this demo works",
    description:
      "What is real and what is made up in this demo shop, what the AI assistant does and what data it keeps.",
  },
});

const options: Record<Lang, { name: string; examples: string; verdict: string }[]> = {
  it: [
    {
      name: "Assistenti SaaS per e-commerce",
      examples: "Intercom Fin, Gorgias, Tidio Lyro, Zendesk AI",
      verdict: "Pronti in poche ore, con ticketing e passaggio all'operatore. Si pagano a conversazione, il widget non si personalizza e non possono mostrare schede prodotto o modificare il carrello.",
    },
    {
      name: "Assistenti della piattaforma",
      examples: "Shopify Sidekick e storefront agentici",
      verdict: "Ottimi se il negozio è già su Shopify, ma legano alla piattaforma. Sidekick aiuta il commerciante, non il cliente.",
    },
    {
      name: "Commercio dentro i chatbot",
      examples: "Agentic Commerce Protocol (OpenAI), Universal Commerce Protocol (Google)",
      verdict: "Servono a farsi trovare dentro ChatGPT o Gemini, non ad assistere chi è già sul proprio sito. Sono il passo successivo, non l'alternativa.",
    },
    {
      name: "Kit di un singolo fornitore",
      examples: "OpenAI ChatKit e Agent Builder",
      verdict: "Belle interfacce, ma legate ai modelli di un solo fornitore; Agent Builder chiude a novembre 2026.",
    },
    {
      name: "Soluzione su misura (scelta)",
      examples: "Next.js 16, Vercel AI SDK 7, AI Elements, PostgreSQL con pgvector",
      verdict: "Controllo completo: il modello usa strumenti tipizzati sul vero catalogo, l'interfaccia mostra prodotti, confronti e ordini, e il fornitore del modello si cambia da configurazione.",
    },
  ],
  en: [
    {
      name: "SaaS e-commerce assistants",
      examples: "Intercom Fin, Gorgias, Tidio Lyro, Zendesk AI",
      verdict: "Ready in a few hours, with ticketing and hand-over to a human. You pay per conversation, the widget cannot be customised and they cannot show product cards or change the cart.",
    },
    {
      name: "Platform assistants",
      examples: "Shopify Sidekick and agentic storefronts",
      verdict: "Great if the shop already runs on Shopify, but they tie you to the platform. Sidekick helps the merchant, not the customer.",
    },
    {
      name: "Shopping inside chatbots",
      examples: "Agentic Commerce Protocol (OpenAI), Universal Commerce Protocol (Google)",
      verdict: "They help you be found inside ChatGPT or Gemini, not assist people who are already on your site. They are the next step, not the alternative.",
    },
    {
      name: "Single-vendor kits",
      examples: "OpenAI ChatKit and Agent Builder",
      verdict: "Nice interfaces, but tied to one vendor's models; Agent Builder shuts down in November 2026.",
    },
    {
      name: "Custom build (chosen)",
      examples: "Next.js 16, Vercel AI SDK 7, AI Elements, PostgreSQL with pgvector",
      verdict: "Full control: the model uses typed tools on the real catalogue, the interface shows products, comparisons and orders, and the model vendor is a configuration change.",
    },
  ],
};

const tools: Record<Lang, [string, string][]> = {
  it: [
    ["searchProducts", "Ricerca ibrida nel catalogo: testo in italiano più similarità semantica, con filtri su categoria e prezzo."],
    ["getProduct / compareProducts", "Scheda tecnica e confronto affiancato, letti dal database."],
    ["addToCart / getCart", "Modificano il carrello vero del visitatore, lo stesso mostrato nell'intestazione."],
    ["trackOrder", "Stato dell'ordine solo se numero ed email corrispondono."],
    ["searchHelp", "Recupera le sezioni pertinenti del centro assistenza (RAG) e il Barista cita la fonte."],
    ["createSupportTicket", "Apre una richiesta per un operatore solo dopo la conferma del cliente, con approvazione firmata lato server."],
  ],
  en: [
    ["searchProducts", "Hybrid catalogue search: Italian full text plus semantic similarity, with category and price filters."],
    ["getProduct / compareProducts", "Spec sheet and side-by-side comparison, read from the database."],
    ["addToCart / getCart", "They change the visitor's real cart, the same one shown in the header."],
    ["trackOrder", "Order status, only if the number and the email match."],
    ["searchHelp", "Retrieves the relevant help-centre sections (RAG) and the Barista cites the source."],
    ["createSupportTicket", "Opens a request for a human only after the customer confirms, with a server-signed approval."],
  ],
};

const steps: Record<Lang, string[]> = {
  it: [
    "Il messaggio parte dal pannello (React, useChat) verso /api/chat insieme alla pagina che stai guardando.",
    "Il server controlla dimensione e limiti di frequenza, poi chiama il modello con le istruzioni del negozio e sei strumenti.",
    "Il modello decide quali strumenti usare; ogni chiamata legge o modifica il database PostgreSQL.",
    "Testo e risultati tornano in streaming: i risultati diventano schede prodotto, tabelle di confronto, stato dell'ordine.",
    "Le azioni delicate, come aprire una richiesta di assistenza, aspettano la tua conferma.",
  ],
  en: [
    "The message leaves the panel (React, useChat) for /api/chat, together with the page you are looking at.",
    "The server checks size and rate limits, then calls the model with the shop's instructions and six tools.",
    "The model decides which tools to use; each call reads or changes the PostgreSQL database.",
    "Text and results stream back: results become product cards, comparison tables and order status.",
    "Sensitive actions, such as opening a support request, wait for your confirmation.",
  ],
};

const security: Record<Lang, string[]> = {
  it: [
    "Le chiavi dei modelli restano sul server; il browser parla solo con questo sito.",
    "Limiti per visitatore e giornalieri, lunghezza massima dei messaggi e dei turni del modello.",
    "Il modello non sceglie prezzi né dati: li legge dagli strumenti, e gli ordini richiedono l'email giusta.",
    "Le conversazioni vengono salvate con un identificativo anonimo dell'IP (hash) per migliorare la demo. I fornitori dei modelli gratuiti possono registrare i messaggi: non scrivere dati personali reali.",
  ],
  en: [
    "The model keys stay on the server; the browser only talks to this site.",
    "Per-visitor and daily limits, maximum length of messages and of the model's turns.",
    "The model does not choose prices or data: it reads them from the tools, and orders require the right email.",
    "Conversations are saved with an anonymous identifier of the IP (a hash) to improve the demo. Providers of free models may log messages: do not write real personal data.",
  ],
};

export default async function HowItWorksPage() {
  const { t, lang } = await getI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="font-display text-5xl leading-tight">{t("Come funziona questa demo", "How this demo works")}</h1>
      <p className="mt-4 text-lg">
        {t(
          "Crema & Ferro è un negozio inventato costruito attorno a un assistente agli acquisti. Questa pagina spiega quali alternative sono state valutate a settembre 2026 e come è fatta quella scelta.",
          "Crema & Ferro is a made-up shop built around a shopping assistant. This page explains which alternatives were considered in September 2026 and how the chosen one is built.",
        )}
      </p>

      <section aria-labelledby="alternative" className="mt-12">
        <h2 id="alternative" className="font-display text-3xl">{t("Le alternative valutate", "The alternatives considered")}</h2>
        <dl className="mt-6 divide-y border-y">
          {options[lang].map((o) => (
            <div key={o.name} className="py-5">
              <dt className="font-semibold">{o.name}</dt>
              <dd className="text-muted-foreground text-sm">{o.examples}</dd>
              <dd className="mt-2">{o.verdict}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="architettura" className="mt-12">
        <h2 id="architettura" className="font-display text-3xl">{t("Cosa succede quando scrivi al Barista", "What happens when you write to the Barista")}</h2>
        <ol className="mt-6 space-y-4">
          {steps[lang].map((step, i) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-display text-enamel text-2xl leading-none">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="strumenti" className="mt-12">
        <h2 id="strumenti" className="font-display text-3xl">{t("Gli strumenti del Barista", "The Barista's tools")}</h2>
        <dl className="mt-6 divide-y border-y">
          {tools[lang].map(([name, text]) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
              <dt className="font-mono text-sm">{name}</dt>
              <dd className="text-sm">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="modelli" className="mt-12">
        <h2 id="modelli" className="font-display text-3xl">{t("Modelli e costi", "Models and costs")}</h2>
        <p className="mt-4">
          {lang === "en" ? (
            <>
              Answers come from free models on OpenRouter: first <code>nvidia/nemotron-3-ultra-550b-a55b:free</code>, and when it is busy
              a backup model and then the free router <code>openrouter/free</code>. Below each answer you can see which one replied. The
              cost is zero; in exchange quality and speed vary and there is a daily message limit. With a paid key you only change two
              environment variables.
            </>
          ) : (
            <>
              Le risposte arrivano da modelli gratuiti di OpenRouter: prima <code>nvidia/nemotron-3-ultra-550b-a55b:free</code>, e quando è
              occupato un modello di riserva e poi il router gratuito <code>openrouter/free</code>. Sotto ogni risposta vedi quale ha
              risposto. Il costo è zero, in cambio la qualità e la velocità variano e c&apos;è un limite giornaliero di messaggi. Con una
              chiave a pagamento basta cambiare due variabili d&apos;ambiente.
            </>
          )}
        </p>
        <p className="mt-4">
          {t(
            "La ricerca semantica usa un modello di embedding multilingue che gira sul server stesso (multilingual-e5-small), quindi non costa nulla per richiesta. Catalogo, ordini e centro assistenza sono in PostgreSQL con l'estensione pgvector.",
            "Semantic search uses a multilingual embedding model that runs on the server itself (multilingual-e5-small), so it costs nothing per request. Catalogue, orders and help centre live in PostgreSQL with the pgvector extension.",
          )}
        </p>
        {lang === "en" && (
          <p className="mt-4">
            The shop&apos;s data is written in Italian. The English pages show translated text, and the Barista answers in the language you
            write in, translating what the tools return.
          </p>
        )}
      </section>

      <section aria-labelledby="sicurezza" className="mt-12">
        <h2 id="sicurezza" className="font-display text-3xl">{t("Sicurezza e privacy", "Security and privacy")}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {security[lang].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
