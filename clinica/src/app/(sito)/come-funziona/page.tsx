import { AlertTriangleIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLang } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

import { ComeFunzionaEn } from "./contenuto-en";

export const generateMetadata: () => Promise<Metadata> = metaFor("/come-funziona", {
  it: {
    title: "Com'è fatta questa demo",
    description:
      "Cosa è vero e cosa è inventato in questo poliambulatorio dimostrativo, cosa l'assistente non fa e che dati vengono conservati.",
  },
  en: {
    title: "How this demo works",
    description:
      "What is real and what is made up in this demo clinic, what the assistant does not do and what data is kept.",
  },
});

const veri = [
  ["Il sito", "Pagine, elenchi, filtri e schede sono un’applicazione Next.js vera, con i dati letti da un database Postgres."],
  [
    "Il calcolo delle disponibilità",
    "Gli orari liberi non sono una lista scritta a mano: vengono calcolati ogni volta dai turni settimanali dei medici, meno le chiusure, meno gli appuntamenti già presi, con 24 ore di preavviso minimo.",
  ],
  [
    "Il database",
    "Le prenotazioni vengono scritte davvero, con un vincolo di unicità che impedisce a due persone di prendere lo stesso orario con lo stesso medico. Se ci provano, la seconda riceve un errore onesto.",
  ],
  [
    "L’assistente che usa strumenti",
    "Non recita un copione: cerca le prestazioni, legge le pagine informative, calcola le disponibilità e prenota chiamando le stesse funzioni che usa il sito.",
  ],
];

const finti = [
  ["La struttura", "Il Poliambulatorio Vallenova non esiste. Indirizzo, telefoni ed email sono inventati e non raggiungono nessuno."],
  ["I medici", "I quattordici specialisti, le loro biografie e i numeri di albo sono inventati. Non ci sono fotografie perché non ci sono persone."],
  ["Prezzi e tempi", "Costi, durate e giorni di referto sono plausibili ma inventati: non sono il tariffario di nessuna struttura."],
  [
    "Le prenotazioni",
    "Un appuntamento confermato qui non arriva a nessuna reception, non genera email e non impegna nessuno. Nessuno ti aspetta.",
  ],
];

function ComeFunzionaPageIt() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Com&apos;è fatta questa demo</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Questo è un poliambulatorio inventato, costruito per mostrare come lavora un assistente che non si limita a
        chiacchierare ma usa i dati e gli strumenti del sito. Vale la pena dire con precisione cosa, qui dentro, è vero
        e cosa no.
      </p>

      <section className="mt-12" aria-labelledby="vero">
        <h2 id="vero" className="font-display text-3xl">
          Cosa è vero
        </h2>
        <dl className="mt-5 divide-y border-y">
          {veri.map(([t, d]) => (
            <div key={t} className="py-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="finto">
        <h2 id="finto" className="font-display text-3xl">
          Cosa è finto
        </h2>
        <dl className="mt-5 divide-y border-y">
          {finti.map(([t, d]) => (
            <div key={t} className="py-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="limiti">
        <h2 id="limiti" className="font-display text-3xl">
          Cosa l&apos;assistente non fa
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong>Non dà pareri medici</strong> e non dice quale visita o esame serve in un caso particolare: quella
            è una decisione clinica e la prende un medico.
          </li>
          <li>
            <strong>Non fa diagnosi</strong> e non interpreta referti, valori o sintomi, nemmeno in forma dubitativa.
          </li>
          <li>
            <strong>Non gestisce le urgenze.</strong> Davanti a un problema urgente la risposta è una sola: chiamare il{" "}
            <strong>112</strong> o andare al pronto soccorso.
          </li>
          <li>
            Si occupa di organizzazione: cosa si prenota, quanto costa, quanto dura, come si arriva, quando è pronto il
            referto, come si disdice.
          </li>
        </ul>
        <div className="mt-6 flex gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5">
          <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
          <p className="text-sm leading-relaxed">
            Questo non è un pronto soccorso e non sostituisce il medico di base. In caso di emergenza chiama il{" "}
            <strong>112</strong>.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="modello">
        <h2 id="modello" className="font-display text-3xl">
          Che modello usa
        </h2>
        <p className="mt-4 leading-relaxed">
          Le risposte arrivano da modelli linguistici gratuiti di{" "}
          <a
            href="https://openrouter.ai"
            className="text-enamel underline decoration-dotted underline-offset-4"
            rel="noreferrer noopener"
            target="_blank"
          >
            OpenRouter
          </a>
          : prima <code>nvidia/nemotron-3-ultra-550b-a55b:free</code>, e quando è occupato un modello di riserva e poi il
          router gratuito. Sono gratuiti e con un tetto di richieste giornaliere: se la demo è molto visitata l&apos;assistente
          può rallentare o rifiutare di rispondere, e il modello effettivo può cambiare.
        </p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Un modello linguistico <strong>può sbagliare</strong>: può capire male una richiesta o riassumere in modo
          imperfetto. Per questo le informazioni importanti — disponibilità, prezzi, stanze — le prende dagli strumenti
          del sito invece di inventarle, e per questo ogni pagina resta navigabile anche senza l&apos;assistente: tutto
          si può prenotare da soli, con i soli link.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="privacy">
        <h2 id="privacy" className="font-display text-3xl">
          Privacy
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            I dati del sito sono <strong>finti</strong>: nessun paziente reale, nessuna cartella clinica, nessun
            referto vero.
          </li>
          <li>
            Nel form di prenotazione non vanno scritti dati veri. Serve una spunta esplicita per confermare di averlo
            capito.
          </li>
          <li>
            Le <strong>conversazioni</strong> con l&apos;assistente vengono conservate per <strong>30 giorni</strong>,
            per capire cosa chiede la gente e correggere le risposte sbagliate, poi vengono cancellate.
          </li>
          <li>
            Le <strong>prenotazioni dei visitatori</strong> vengono cancellate dopo <strong>7 giorni</strong>, così
            l&apos;agenda della demo resta pulita.
          </li>
          <li>
            Nessun indirizzo IP viene salvato in chiaro: per i limiti di traffico si conserva solo un{" "}
            <strong>hash</strong>, da cui l&apos;indirizzo non si ricostruisce.
          </li>
          <li>
            Il quadro completo, compreso dove vanno le domande, è nella pagina{" "}
            <Link href="/privacy" className="text-enamel underline decoration-dotted underline-offset-4">
              Privacy
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="altro">
        <h2 id="altro" className="font-display text-3xl">
          Per saperne di più
        </h2>
        <ul className="mt-5 space-y-2 leading-relaxed">
          <li>
            <Link href="/informazioni" className="text-enamel underline decoration-dotted underline-offset-4">
              Le pagine informative del poliambulatorio
            </Link>{" "}
            — orari, pagamenti, documenti, accessibilità, privacy in versione demo.
          </li>
          <li>
            <Link href="/crediti" className="text-enamel underline decoration-dotted underline-offset-4">
              Crediti e licenze
            </Link>{" "}
            — chi l&apos;ha fatto, con quali strumenti, e come riusare testi e codice.
          </li>
          <li>
            <a
              href="https://chat-bot.giuseppebosi.com/tutorial"
              className="text-enamel underline decoration-dotted underline-offset-4"
              rel="noreferrer noopener"
              target="_blank"
            >
              Come è stato costruito
            </a>{" "}
            — il tutorial del sito gemello, una caffetteria con lo stesso assistente, dove è spiegato il codice passo
            per passo.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default async function ComeFunzionaPage() {
  return (await getLang()) === "en" ? <ComeFunzionaEn /> : <ComeFunzionaPageIt />;
}
