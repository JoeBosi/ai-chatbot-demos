import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/privacy", {
  title: "Privacy",
  description: "Quali dati passano da questo sito didattico, dove vanno e per quanto tempo restano. Breve e senza giri di parole.",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Privacy</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Questo è un sito didattico: la clinica è inventata e nessuna prenotazione arriva a nessuno. Qui sotto c&apos;è
        esattamente cosa succede ai dati che scrivi, perché anche in un esempio vale la pena saperlo.
      </p>

      <section className="mt-10" aria-labelledby="cosa">
        <h2 id="cosa" className="font-display text-3xl">
          Cosa viene conservato
        </h2>
        <dl className="mt-5 divide-y border-y">
          <div className="py-4">
            <dt className="font-semibold">Le conversazioni con l&apos;assistente</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              Restano nel database del sito per <strong>30 giorni</strong>, poi vengono cancellate in automatico. Servono a
              leggere cosa chiede la gente e a correggere le risposte sbagliate. Non sono collegate a un nome: al posto
              dell&apos;indirizzo IP viene salvata un&apos;impronta (hash con sale) da cui l&apos;indirizzo non si ricostruisce.
            </dd>
          </div>
          <div className="py-4">
            <dt className="font-semibold">Le prenotazioni di prova</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              Nome, email e telefono scritti nel form restano <strong>7 giorni</strong> e poi vengono cancellati. Per questo il
              form chiede di usare dati inventati: l&apos;esempio funziona ugualmente.
            </dd>
          </div>
          <div className="py-4">
            <dt className="font-semibold">La cronologia della chat nel browser</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              Per ritrovare la conversazione dopo un ricaricamento, il browser la tiene nella propria memoria locale
              (localStorage) sul tuo dispositivo. Si cancella con il pulsante «Nuova conversazione» o svuotando i dati del sito.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10" aria-labelledby="dove">
        <h2 id="dove" className="font-display text-3xl">
          Dove vanno le domande
        </h2>
        <p className="mt-4 leading-relaxed">
          Il testo che scrivi all&apos;assistente, insieme ai documenti del sito che servono a rispondere, viene inviato a{" "}
          <a href="https://openrouter.ai/privacy" className="text-enamel underline decoration-dotted underline-offset-4" rel="noreferrer noopener" target="_blank">
            OpenRouter
          </a>
          , il servizio che fa girare il modello linguistico: è l&apos;unico destinatario esterno. Anche per questo la
          chat non va usata per dati personali veri. La ricerca per significato nei documenti, invece, avviene sul server
          del sito.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="no">
        <h2 id="no" className="font-display text-3xl">
          Cosa non c&apos;è
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed">
          <li>Nessun cookie di profilazione e nessun servizio di statistiche: il sito non usa strumenti di analisi del traffico.</li>
          <li>Nessuna risorsa caricata da terzi mentre navighi: caratteri, icone e script sono serviti dal sito stesso.</li>
          <li>Nessun collegamento a registri, archivi sanitari o servizi esterni: l&apos;assistente conosce solo le pagine di questo sito.</li>
          <li>Nessuna raccolta di nome o email per usare la chat: si scrive e basta.</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="chi">
        <h2 id="chi" className="font-display text-3xl">
          Chi risponde
        </h2>
        <p className="mt-4 leading-relaxed">
          Il sito è un progetto didattico di Giuseppe Bosi (vedi{" "}
          <Link href="/crediti" className="text-enamel underline decoration-dotted underline-offset-4">
            Crediti
          </Link>
          ). Per far cancellare subito una prenotazione o una conversazione di prova, basta chiederlo attraverso i
          contatti indicati nella home page dei suoi progetti: le righe si trovano con il codice della prenotazione o con
          la data e l&apos;ora della chat.
        </p>
      </section>
    </div>
  );
}
