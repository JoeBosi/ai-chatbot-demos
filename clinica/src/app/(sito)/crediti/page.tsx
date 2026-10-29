import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/crediti", {
  title: "Crediti e licenze",
  description: "Chi ha realizzato questo sito didattico, con quali strumenti liberi, e con quali licenze si possono riusare testi e codice.",
});

const strumenti: [string, string, string][] = [
  ["Next.js e React", "il sito, le pagine e il form di prenotazione", "https://nextjs.org/docs"],
  ["Vercel AI SDK", "lo streaming della chat e gli strumenti che l'assistente può chiamare", "https://ai-sdk.dev/docs"],
  ["PostgreSQL con pgvector", "il database: prestazioni, turni, prenotazioni e l'indice per la ricerca per significato", "https://github.com/pgvector/pgvector"],
  ["Drizzle ORM", "le tabelle e le migrazioni del database", "https://orm.drizzle.team/docs"],
  ["Transformers.js (modello multilingual-e5-small)", "gli embedding calcolati sul server, senza servizi esterni", "https://huggingface.co/docs/transformers.js"],
  ["OpenRouter", "il modello linguistico che scrive le risposte, attraverso il router gratuito", "https://openrouter.ai/docs"],
  ["Tailwind CSS, shadcn/ui e AI Elements", "l'aspetto delle pagine e della chat", "https://ui.shadcn.com/docs"],
  ["Lucide", "le icone", "https://lucide.dev"],
  ["Bodoni Moda e Hanken Grotesk", "i caratteri, incorporati nel sito al momento della compilazione: il browser non contatta servizi di terzi", "https://fonts.google.com/knowledge"],
  ["Playwright", "le prove automatiche: prenotazione, disdetta, widget, limiti dell'assistente", "https://playwright.dev/docs/intro"],
  ["Docker e Caddy", "la pubblicazione: due container su un server in Europa, HTTPS automatico", "https://caddyserver.com/docs"],
];

export default function CreditiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Crediti e licenze</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Questo sito è un progetto didattico di <strong>Giuseppe Bosi</strong>, Dottore in Ingegneria
        Elettronica (V.O.) e Professore di Scienze e Tecnologie Informatiche. Serve a far vedere, con un esempio che si può
        provare, come un assistente conversazionale lavora dentro un sito: cerca nei documenti, calcola le disponibilità,
        prenota solo dopo la conferma di chi scrive, e rifiuta di fare ciò che non gli compete.
      </p>

      <section className="mt-12" aria-labelledby="licenze">
        <h2 id="licenze" className="font-display text-3xl">
          Come si possono riusare
        </h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed">
          <li>
            <strong>Testi e contenuti</strong> di queste pagine (specialità, prestazioni, pagine informative, spiegazioni):
            licenza{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/deed.it" className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
              Creative Commons Attribuzione 4.0 (CC BY 4.0)
            </a>
            . Si possono copiare, adattare e riusare anche a scopo commerciale, citando «Giuseppe Bosi».
          </li>
          <li>
            <strong>Codice</strong> del sito, dell&apos;assistente e del widget: licenza{" "}
            <a href="https://opensource.org/license/mit" className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
              MIT
            </a>
            . Si può usare, modificare e ridistribuire, mantenendo la nota di copyright.
          </li>
          <li>
            I nomi della clinica, dei medici e i prezzi sono <strong>inventati</strong> per l&apos;esempio: qualsiasi somiglianza con strutture o persone reali è casuale.
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="strumenti">
        <h2 id="strumenti" className="font-display text-3xl">
          Con cosa è fatto
        </h2>
        <p className="mt-4 leading-relaxed">
          Tutto il software usato è libero o gratuito. Per ogni pezzo, il link porta alla documentazione ufficiale.
        </p>
        <dl className="mt-5 divide-y border-y">
          {strumenti.map(([nome, cosa, url]) => (
            <div key={nome} className="py-3">
              <dt className="font-semibold">
                <a href={url} className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
                  {nome}
                </a>
              </dt>
              <dd className="text-muted-foreground mt-0.5 leading-relaxed">{cosa}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" aria-labelledby="altro">
        <h2 id="altro" className="font-display text-3xl">
          Per approfondire
        </h2>
        <ul className="mt-5 space-y-2 leading-relaxed">
          <li>
            <Link href="/come-funziona" className="text-enamel underline decoration-dotted underline-offset-4">
              Com&apos;è fatta questa demo
            </Link>{" "}
            — cosa è vero, cosa è inventato, cosa l&apos;assistente non fa.
          </li>
          <li>
            <Link href="/privacy" className="text-enamel underline decoration-dotted underline-offset-4">
              Privacy
            </Link>{" "}
            — quali dati passano di qui, dove vanno e per quanto restano.
          </li>
          <li>
            <a href="https://chat-bot.giuseppebosi.com/tutorial" className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
              Il tutorial
            </a>{" "}
            — il codice spiegato passo per passo sul sito gemello, e come mettere lo stesso assistente in un altro sito.
          </li>
        </ul>
      </section>
    </div>
  );
}
