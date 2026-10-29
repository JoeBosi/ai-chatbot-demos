import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/come-funziona", {
  title: "Come funziona la demo",
  description:
    "Cosa è vero e cosa è inventato in questo negozio dimostrativo, cosa fa l'assistente AI e che dati conserva.",
});

const options = [
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
];

const tools = [
  ["searchProducts", "Ricerca ibrida nel catalogo: testo in italiano più similarità semantica, con filtri su categoria e prezzo."],
  ["getProduct / compareProducts", "Scheda tecnica e confronto affiancato, letti dal database."],
  ["addToCart / getCart", "Modificano il carrello vero del visitatore, lo stesso mostrato nell'intestazione."],
  ["trackOrder", "Stato dell'ordine solo se numero ed email corrispondono."],
  ["searchHelp", "Recupera le sezioni pertinenti del centro assistenza (RAG) e il Barista cita la fonte."],
  ["createSupportTicket", "Apre una richiesta per un operatore solo dopo la conferma del cliente, con approvazione firmata lato server."],
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="font-display text-5xl leading-tight">Come funziona questa demo</h1>
      <p className="mt-4 text-lg">
        Crema &amp; Ferro è un negozio inventato costruito attorno a un assistente agli acquisti. Questa pagina spiega quali alternative sono state valutate a settembre 2026 e come è fatta quella scelta.
      </p>

      <section aria-labelledby="alternative" className="mt-12">
        <h2 id="alternative" className="font-display text-3xl">Le alternative valutate</h2>
        <dl className="mt-6 divide-y border-y">
          {options.map((o) => (
            <div key={o.name} className="py-5">
              <dt className="font-semibold">{o.name}</dt>
              <dd className="text-muted-foreground text-sm">{o.examples}</dd>
              <dd className="mt-2">{o.verdict}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="architettura" className="mt-12">
        <h2 id="architettura" className="font-display text-3xl">Cosa succede quando scrivi al Barista</h2>
        <ol className="mt-6 space-y-4">
          {[
            "Il messaggio parte dal pannello (React, useChat) verso /api/chat insieme alla pagina che stai guardando.",
            "Il server controlla dimensione e limiti di frequenza, poi chiama il modello con le istruzioni del negozio e sei strumenti.",
            "Il modello decide quali strumenti usare; ogni chiamata legge o modifica il database PostgreSQL.",
            "Testo e risultati tornano in streaming: i risultati diventano schede prodotto, tabelle di confronto, stato dell'ordine.",
            "Le azioni delicate, come aprire una richiesta di assistenza, aspettano la tua conferma.",
          ].map((step, i) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-display text-enamel text-2xl leading-none">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="strumenti" className="mt-12">
        <h2 id="strumenti" className="font-display text-3xl">Gli strumenti del Barista</h2>
        <dl className="mt-6 divide-y border-y">
          {tools.map(([name, text]) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
              <dt className="font-mono text-sm">{name}</dt>
              <dd className="text-sm">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="modelli" className="mt-12">
        <h2 id="modelli" className="font-display text-3xl">Modelli e costi</h2>
        <p className="mt-4">
          Le risposte arrivano dal router gratuito di OpenRouter (<code>openrouter/free</code>), che sceglie di volta in volta un modello open con supporto agli strumenti: sotto ogni risposta vedi quale. Il costo è zero, in cambio la qualità e la velocità variano e c&apos;è un limite giornaliero di messaggi. Con una chiave a pagamento basta cambiare due variabili d&apos;ambiente.
        </p>
        <p className="mt-4">
          La ricerca semantica usa un modello di embedding multilingue che gira sul server stesso (multilingual-e5-small), quindi non costa nulla per richiesta. Catalogo, ordini e centro assistenza sono in PostgreSQL con l&apos;estensione pgvector.
        </p>
      </section>

      <section aria-labelledby="sicurezza" className="mt-12">
        <h2 id="sicurezza" className="font-display text-3xl">Sicurezza e privacy</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Le chiavi dei modelli restano sul server; il browser parla solo con questo sito.</li>
          <li>Limiti per visitatore e giornalieri, lunghezza massima dei messaggi e dei turni del modello.</li>
          <li>Il modello non sceglie prezzi né dati: li legge dagli strumenti, e gli ordini richiedono l&apos;email giusta.</li>
          <li>Le conversazioni vengono salvate con un identificativo anonimo dell&apos;IP (hash) per migliorare la demo. I fornitori dei modelli gratuiti possono registrare i messaggi: non scrivere dati personali reali.</li>
        </ul>
      </section>
    </div>
  );
}
