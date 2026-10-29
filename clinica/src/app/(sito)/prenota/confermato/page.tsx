import { CheckCircle2Icon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { firstParam, qs } from "@/app/(sito)/_shared";
import { Button } from "@/components/ui/button";
import { clinica } from "@/data/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = { ...pageMeta("/prenota/confermato", {
  title: "Prenotazione confermata",
  description:
    "Riepilogo di una prenotazione di prova al Poliambulatorio Vallenova.",
}), robots: { index: false } };

export default async function ConfermatoPage({ searchParams }: PageProps<"/prenota/confermato">) {
  const params = await searchParams;
  const codice = firstParam(params.codice, 20);
  // Il codice da solo non basta a leggere la prenotazione (serve anche l'email): qui mostro solo
  // il codice e le istruzioni, i dettagli si rileggono da /prenotazioni.
  if (!codice || !/^PR-\d{4,6}$/.test(codice)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <CheckCircle2Icon className="text-enamel size-10" aria-hidden />
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Appuntamento registrato</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        L&apos;appuntamento è salvato nel database della demo. Nessuna email è stata spedita e nessuna struttura reale
        l&apos;ha ricevuto.
      </p>

      <div className="bg-enamel-soft/60 mt-8 rounded-lg border p-6">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">Codice prenotazione</p>
        <p className="font-display mt-1 text-4xl tracking-wide">{codice}</p>
        <p className="mt-3 text-sm leading-relaxed">
          Annotalo. Con questo codice e l&apos;email che hai scritto nel form puoi rivedere o disdire
          l&apos;appuntamento in <strong>Le mie prenotazioni</strong>. Il codice da solo non apre niente: serve anche
          l&apos;email.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/prenotazioni${qs({ codice })}`}>Vedi i dettagli in Le mie prenotazioni</Link>
        </Button>
      </div>

      <section className="mt-10" aria-labelledby="cosa-portare">
        <h2 id="cosa-portare" className="font-display text-2xl">
          Cosa portare
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
          <li>Un documento d&apos;identità e la tessera sanitaria.</li>
          <li>L&apos;impegnativa del medico di base, se la prestazione la richiede.</li>
          <li>Esami o referti precedenti che riguardano la stessa prestazione, se li hai.</li>
          <li>Eventuali indicazioni di preparazione riportate nella scheda della prestazione.</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="quando-arrivare">
        <h2 id="quando-arrivare" className="font-display text-2xl">
          Quando arrivare
        </h2>
        <p className="mt-3 leading-relaxed">
          Presentati in accettazione, al piano 0, <strong>10 minuti prima</strong> dell&apos;orario: il tempo serve a
          registrare l&apos;appuntamento e a indicarti la stanza. La reception è in {clinica.indirizzo},{" "}
          {clinica.citta}.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          <Link href="/dove-siamo" className="text-enamel underline decoration-dotted underline-offset-4">
            Come arrivare e piantina dei piani
          </Link>
        </p>
      </section>

      <p className="mt-10 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 text-sm leading-relaxed">
        <strong>È una demo.</strong> Struttura, medici, prezzi e appuntamenti sono inventati; nessuno ti aspetta e
        nessuno leggerà questa prenotazione. Le prenotazioni dei visitatori vengono cancellate dopo pochi giorni.{" "}
        <Link href="/come-funziona" className="text-enamel underline decoration-dotted underline-offset-4">
          Com&apos;è fatta questa demo
        </Link>
      </p>
    </div>
  );
}
