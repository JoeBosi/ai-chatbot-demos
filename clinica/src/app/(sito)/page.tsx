import type { Metadata } from "next";
import { AlertTriangleIcon, CalendarCheckIcon, ClockIcon, FileTextIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { AskBox } from "@/components/assistant/ask";
import { Button } from "@/components/ui/button";
import { clinica } from "@/data/clinica";
import { listSpecialities } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/", {
  title: { absolute: "Poliambulatorio Vallenova — visite, esami e prenotazioni (demo)" },
  description:
    "Poliambulatorio dimostrativo con un assistente AI: specialità, prestazioni, medici, orari, referti e prenotazione degli appuntamenti. Struttura e dati inventati.",
});

export default async function HomePage() {
  const specialities = await listSpecialities();

  return (
    <div>
      <section className="bg-enamel-soft/60 border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
              {clinica.citta} · {clinica.indirizzo}
            </p>
            <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">{clinica.claim}</h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Dieci specialità, quattordici specialisti, un&apos;unica accettazione. Puoi prenotare da solo, scegliendo
              fra gli orari liberi, o chiedere all&apos;assistente: ti dice cosa facciamo, come prepararti, in quanti
              giorni è pronto il referto e dove si trova la stanza.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/prenota">Prenota un appuntamento</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/prestazioni">Vedi visite ed esami</Link>
              </Button>
            </div>
          </div>

          <AskBox
            className="mt-10 max-w-2xl"
            placeholder="Es. «vorrei prenotare un'ecografia»"
            suggestions={[
              "Che visite ed esami si possono prenotare?",
              "Vorrei prenotare una visita cardiologica",
              "Come mi preparo per un'ecografia all'addome?",
              "Dove si ritirano i referti?",
            ]}
          />
          <p className="text-muted-foreground mt-3 max-w-2xl text-xs leading-relaxed">
            L&apos;assistente si occupa di organizzazione: non dà indicazioni mediche e non dice quale esame serve per un
            sintomo. Per quello serve il medico di base o uno specialista.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl">Le specialità</h2>
          <Link href="/specialita" className="text-enamel text-sm underline decoration-dotted underline-offset-4">
            Tutte le specialità
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specialities.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/specialita/${s.slug}`}
                className="bg-card hover:border-enamel flex h-full flex-col rounded-lg border p-4 transition-colors"
              >
                <span className="font-display text-xl leading-tight">{s.name}</span>
                <span className="text-muted-foreground mt-1 text-sm leading-snug">{s.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-3xl">Prenotare, in tre passaggi</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              ["Scegli la prestazione", "Cerca la visita o l'esame per nome, o parti dalla specialità. Trovi durata, costo e come prepararti."],
              ["Scegli giorno e ora", "Vedi gli orari davvero liberi, calcolati sugli orari dei medici. Puoi scegliere anche il medico."],
              ["Conferma", "Ti serve nome, email e telefono. Ricevi un codice tipo PR-12345: con quello e la tua email ritrovi o disdici l'appuntamento."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="bg-enamel flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <strong className="block">{t}</strong>
                  <span className="text-muted-foreground text-sm leading-snug">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: FileTextIcon,
            title: "Referti",
            text: `Ritiro al piano 0. ${clinica.orariRitiroReferti}`,
            href: "/referti",
            cta: "Come si ritirano",
          },
          {
            icon: ClockIcon,
            title: "Orari",
            text: "Reception aperta dal lunedì al venerdì 08:00-19:00, sabato mattina.",
            href: "/informazioni",
            cta: "Tutte le informazioni",
          },
          {
            icon: MapPinIcon,
            title: "Dove siamo",
            text: `${clinica.indirizzo}, ${clinica.citta}. Tre piani, ascensore, parcheggio interno.`,
            href: "/dove-siamo",
            cta: "Come arrivare",
          },
          {
            icon: CalendarCheckIcon,
            title: "Le mie prenotazioni",
            text: "Con codice ed email puoi rivedere o disdire un appuntamento.",
            href: "/prenotazioni",
            cta: "Cerca la prenotazione",
          },
        ].map((c) => (
          <div key={c.title} className="bg-card flex flex-col rounded-lg border p-4">
            <c.icon className="text-enamel size-5" aria-hidden />
            <p className="font-display mt-2 text-xl leading-none">{c.title}</p>
            <p className="text-muted-foreground mt-1 flex-1 text-sm leading-snug">{c.text}</p>
            <Link href={c.href} className="text-enamel mt-3 text-sm underline decoration-dotted underline-offset-4">
              {c.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex flex-col gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 sm:flex-row sm:items-center">
          <AlertTriangleIcon className="size-6 shrink-0 text-amber-700" aria-hidden />
          <p className="flex-1 text-sm leading-relaxed">
            <strong>Non siamo un pronto soccorso.</strong> Per un problema urgente — dolore al petto, difficoltà a
            respirare, perdita di forza o della parola, trauma importante — chiama il <strong>112</strong> o va al pronto
            soccorso. Qui si prenotano visite ed esami programmati.
          </p>
          <a
            href="tel:112"
            className="bg-enamel hover:bg-enamel-deep flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <PhoneIcon className="size-4" aria-hidden /> Chiama il 112
          </a>
        </div>
      </section>
    </div>
  );
}
