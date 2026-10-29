import type { Metadata } from "next";
import { AlertTriangleIcon, CalendarCheckIcon, ClockIcon, FileTextIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { AskBox } from "@/components/assistant/ask";
import { Button } from "@/components/ui/button";
import { lSpeciality, clinicaFor } from "@/data/en/localize";
import { getI18n } from "@/lib/i18n-server";
import { listSpecialities } from "@/lib/clinica";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/", {
  it: {
    title: { absolute: "Poliambulatorio Vallenova — visite, esami e prenotazioni (demo)" },
    description:
      "Poliambulatorio dimostrativo con un assistente AI: specialità, prestazioni, medici, orari, referti e prenotazione degli appuntamenti. Struttura e dati inventati.",
  },
  en: {
    title: { absolute: "Poliambulatorio Vallenova — visits, tests and bookings (demo)" },
    description:
      "A demo outpatient clinic with an AI assistant: specialties, services, doctors, hours, reports and appointment booking. Clinic and data are made up.",
  },
});

export default async function HomePage() {
  const [itSpecialities, { t, href, lang }] = await Promise.all([listSpecialities(), getI18n()]);
  const specialities = itSpecialities.map((s) => lSpeciality(lang, s));
  const clinica = clinicaFor(lang);
  const en = lang === "en";

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
              {t(
                "Dieci specialità, quattordici specialisti, un'unica accettazione. Puoi prenotare da solo, scegliendo fra gli orari liberi, o chiedere all'assistente: ti dice cosa facciamo, come prepararti, in quanti giorni è pronto il referto e dove si trova la stanza.",
                "Ten specialties, fourteen specialists, one reception. You can book on your own, choosing among the free slots, or ask the assistant: it tells you what we do, how to prepare, how many days the report takes and where the room is.",
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={href("/prenota")}>{t("Prenota un appuntamento", "Book an appointment")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={href("/prestazioni")}>{t("Vedi visite ed esami", "See visits and tests")}</Link>
              </Button>
            </div>
          </div>

          <AskBox
            className="mt-10 max-w-2xl"
            placeholder={t("Es. «vorrei prenotare un'ecografia»", "E.g. «I'd like to book an ultrasound»")}
            suggestions={
              en
                ? [
                    "Which visits and tests can I book?",
                    "I'd like to book a cardiology consultation",
                    "How do I prepare for an abdominal ultrasound?",
                    "Where do I collect my reports?",
                  ]
                : [
                    "Che visite ed esami si possono prenotare?",
                    "Vorrei prenotare una visita cardiologica",
                    "Come mi preparo per un'ecografia all'addome?",
                    "Dove si ritirano i referti?",
                  ]
            }
          />
          <p className="text-muted-foreground mt-3 max-w-2xl text-xs leading-relaxed">
            {t(
              "L'assistente si occupa di organizzazione: non dà indicazioni mediche e non dice quale esame serve per un sintomo. Per quello serve il medico di base o uno specialista.",
              "The assistant deals with organisation: it gives no medical advice and does not say which test a symptom needs. For that you need your GP or a specialist.",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl">{t("Le specialità", "Our specialties")}</h2>
          <Link href={href("/specialita")} className="text-enamel text-sm underline decoration-dotted underline-offset-4">
            {t("Tutte le specialità", "All specialties")}
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specialities.map((s) => (
            <li key={s.slug}>
              <Link
                href={href(`/specialita/${s.slug}`)}
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
          <h2 className="font-display text-3xl">{t("Prenotare, in tre passaggi", "Booking, in three steps")}</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {(en
              ? [
                  ["Choose the service", "Look for the visit or test by name, or start from the specialty. You will find duration, cost and how to prepare."],
                  ["Choose day and time", "See the slots that are really free, worked out from the doctors' hours. You can also choose the doctor."],
                  ["Confirm", "You need a name, email and phone. You get a code like PR-12345: with it and your email you can find or cancel the appointment."],
                ]
              : [
                  ["Scegli la prestazione", "Cerca la visita o l'esame per nome, o parti dalla specialità. Trovi durata, costo e come prepararti."],
                  ["Scegli giorno e ora", "Vedi gli orari davvero liberi, calcolati sugli orari dei medici. Puoi scegliere anche il medico."],
                  ["Conferma", "Ti serve nome, email e telefono. Ricevi un codice tipo PR-12345: con quello e la tua email ritrovi o disdici l'appuntamento."],
                ]
            ).map(([title, d], i) => (
              <li key={title} className="flex gap-3">
                <span className="bg-enamel flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <strong className="block">{title}</strong>
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
            title: t("Referti", "Reports"),
            text: t(`Ritiro al piano 0. ${clinica.orariRitiroReferti}`, `Collection on floor 0. ${clinica.orariRitiroReferti}`),
            href: "/referti",
            cta: t("Come si ritirano", "How to collect them"),
          },
          {
            icon: ClockIcon,
            title: t("Orari", "Hours"),
            text: t("Reception aperta dal lunedì al venerdì 08:00-19:00, sabato mattina.", "Reception open Monday to Friday 08:00-19:00, Saturday morning."),
            href: "/informazioni",
            cta: t("Tutte le informazioni", "All the information"),
          },
          {
            icon: MapPinIcon,
            title: t("Dove siamo", "Where we are"),
            text: t(
              `${clinica.indirizzo}, ${clinica.citta}. Tre piani, ascensore, parcheggio interno.`,
              `${clinica.indirizzo}, ${clinica.citta}. Three floors, lift, on-site parking.`,
            ),
            href: "/dove-siamo",
            cta: t("Come arrivare", "How to get here"),
          },
          {
            icon: CalendarCheckIcon,
            title: t("Le mie prenotazioni", "My bookings"),
            text: t("Con codice ed email puoi rivedere o disdire un appuntamento.", "With the code and email you can review or cancel an appointment."),
            href: "/prenotazioni",
            cta: t("Cerca la prenotazione", "Find the booking"),
          },
        ].map((c) => (
          <div key={c.title} className="bg-card flex flex-col rounded-lg border p-4">
            <c.icon className="text-enamel size-5" aria-hidden />
            <p className="font-display mt-2 text-xl leading-none">{c.title}</p>
            <p className="text-muted-foreground mt-1 flex-1 text-sm leading-snug">{c.text}</p>
            <Link href={href(c.href)} className="text-enamel mt-3 text-sm underline decoration-dotted underline-offset-4">
              {c.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex flex-col gap-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 sm:flex-row sm:items-center">
          <AlertTriangleIcon className="size-6 shrink-0 text-amber-700" aria-hidden />
          <p className="flex-1 text-sm leading-relaxed">
            <strong>{t("Non siamo un pronto soccorso.", "We are not an emergency department.")}</strong>{" "}
            {t(
              "Per un problema urgente — dolore al petto, difficoltà a respirare, perdita di forza o della parola, trauma importante — chiama il",
              "For an urgent problem (chest pain, difficulty breathing, loss of strength or speech, a serious injury) call",
            )}{" "}
            <strong>112</strong>{" "}
            {t(
              "o va al pronto soccorso. Qui si prenotano visite ed esami programmati.",
              "or go to the emergency department. Here you book planned visits and tests.",
            )}
          </p>
          <a
            href="tel:112"
            className="bg-enamel hover:bg-enamel-deep flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <PhoneIcon className="size-4" aria-hidden /> {t("Chiama il 112", "Call 112")}
          </a>
        </div>
      </section>
    </div>
  );
}
