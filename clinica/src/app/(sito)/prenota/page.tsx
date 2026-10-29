import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { firstParam, fmt, qs } from "@/app/(sito)/_shared";
import { createBooking } from "@/app/(sito)/prenota/actions";
import { Button } from "@/components/ui/button";
import { lService, lSpeciality, roomNameEn } from "@/data/en/localize";
import { findSlots, localDate } from "@/lib/agenda";
import { getService, listServices, listSpecialities } from "@/lib/clinica";
import { getI18n } from "@/lib/i18n-server";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/prenota", {
  it: {
    title: "Prenota un appuntamento",
    description:
      "Scegli la prestazione, l'orario libero e conferma. Prenotazione dimostrativa, senza dati veri.",
  },
  en: {
    title: "Book an appointment",
    description:
      "Choose the service, a free slot and confirm. Demo booking, no real data.",
  },
});

const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

function Steps({ current, lang }: { current: 1 | 2 | 3; lang: Lang }) {
  const labels = lang === "en" ? ["Service", "Day and time", "Confirm"] : ["Prestazione", "Giorno e ora", "Conferma"];
  return (
    <ol
      className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
      aria-label={lang === "en" ? "Booking steps" : "Passaggi della prenotazione"}
    >
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        return (
          <li key={label} className="flex items-center gap-2" aria-current={n === current ? "step" : undefined}>
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                n === current ? "bg-enamel border-enamel text-white" : n < current ? "border-enamel text-enamel" : "text-muted-foreground",
              )}
            >
              {n}
            </span>
            <span className={cn(n === current ? "font-semibold" : "text-muted-foreground")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default async function PrenotaPage({ searchParams }: PageProps<"/prenota">) {
  const params = await searchParams;
  const serviceSlug = firstParam(params.prestazione, 80);
  const doctorSlug = firstParam(params.medico, 80);
  const when = firstParam(params.quando, 40);
  const errore = firstParam(params.errore, 200);
  const specialitaFilter = firstParam(params.specialita, 60);

  const [found, { t, href, lang }] = await Promise.all([serviceSlug ? getService(serviceSlug) : undefined, getI18n()]);
  const service = found && lService(lang, found);
  const { durata, prezzo, refertoLabel, tipoLabel, data } = fmt(lang);
  const where = (room: string, floor: number) => `${roomNameEn(lang, room)}, ${t("piano", "floor")} ${floor}`;

  // Passo 1: non so ancora cosa vuole prenotare.
  if (!service) {
    const [itSpecialities, itServices] = await Promise.all([
      listSpecialities(),
      listServices({ speciality: specialitaFilter }),
    ]);
    const specialities = itSpecialities.map((s) => lSpeciality(lang, s));
    const services = itServices.map((s) => lService(lang, s));
    const active = specialities.find((s) => s.slug === specialitaFilter)?.slug;

    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl">{t("Prenota un appuntamento", "Book an appointment")}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
          {t(
            "Scegli la visita o l'esame: al passaggio dopo vedi gli orari davvero liberi. È un sito dimostrativo, non inserire dati veri.",
            "Choose the visit or test: at the next step you will see the slots that are really free. This is a demo site, do not enter real data.",
          )}
        </p>
        <Steps current={1} lang={lang} />

        <nav aria-label={t("Filtra per specialità", "Filter by specialty")} className="mt-8 border-y py-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{t("Specialità", "Specialty")}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link
                href={href("/prenota")}
                aria-current={!active ? "page" : undefined}
                className={cn("hover:border-enamel block rounded-full border px-3 py-1.5", !active && "bg-enamel border-enamel text-white")}
              >
                {t("Tutte", "All")}
              </Link>
            </li>
            {specialities.map((s) => (
              <li key={s.slug}>
                <Link
                  href={href(`/prenota${qs({ specialita: s.slug })}`)}
                  aria-current={active === s.slug ? "page" : undefined}
                  className={cn(
                    "hover:border-enamel block rounded-full border px-3 py-1.5",
                    active === s.slug && "bg-enamel border-enamel text-white",
                  )}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={href(`/prenota${qs({ prestazione: s.slug })}`)}
                className="bg-card hover:border-enamel flex h-full flex-col rounded-lg border p-4 transition-colors"
              >
                <span className="text-enamel text-xs font-semibold tracking-[0.14em] uppercase">
                  {s.specialityName} · {tipoLabel[s.kind] ?? s.kind}
                </span>
                <span className="font-display mt-1 text-xl leading-tight">{s.name}</span>
                <span className="text-muted-foreground mt-1 text-sm">
                  {durata(s.durationMinutes)} · {prezzo(s.priceCents)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const doctor = doctorSlug ? service.doctors.find((d) => d.slug === doctorSlug) : undefined;

  // Passo 2: so la prestazione, scelgo l'orario.
  if (!when || !doctor) {
    const { slots } = await findSlots({ serviceSlug: service.slug, doctorSlug: doctor?.slug, limit: 12 });

    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl">{t("Scegli giorno e ora", "Choose day and time")}</h1>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          {service.name} · {durata(service.durationMinutes)} · {prezzo(service.priceCents)}
        </p>
        <Steps current={2} lang={lang} />

        {errore && (
          <p role="alert" className="mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <AlertCircleIcon className="size-5 shrink-0 text-amber-700" aria-hidden />
            <span>{errore}</span>
          </p>
        )}

        <nav aria-label={t("Filtra per medico", "Filter by doctor")} className="mt-8 border-y py-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{t("Medico", "Doctor")}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link
                href={href(`/prenota${qs({ prestazione: service.slug })}`)}
                aria-current={!doctor ? "page" : undefined}
                className={cn("hover:border-enamel block rounded-full border px-3 py-1.5", !doctor && "bg-enamel border-enamel text-white")}
              >
                {t("Chiunque", "Anyone")}
              </Link>
            </li>
            {service.doctors.map((d) => (
              <li key={d.slug}>
                <Link
                  href={href(`/prenota${qs({ prestazione: service.slug, medico: d.slug })}`)}
                  aria-current={doctor?.slug === d.slug ? "page" : undefined}
                  className={cn(
                    "hover:border-enamel block rounded-full border px-3 py-1.5",
                    doctor?.slug === d.slug && "bg-enamel border-enamel text-white",
                  )}
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {slots.length === 0 ? (
          <p className="mt-6">
            {t("Non ci sono orari liberi nei prossimi giorni con questa scelta. Prova a", "There are no free slots in the coming days with this choice. Try")}{" "}
            <Link href={href(`/prenota${qs({ prestazione: service.slug })}`)} className="text-enamel underline decoration-dotted underline-offset-4">
              {t("togliere il filtro sul medico", "removing the doctor filter")}
            </Link>{" "}
            {t("o chiama la reception.", "or call reception.")}
          </p>
        ) : (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {slots.map((slot) => (
              <li key={`${slot.doctorSlug}-${slot.startsAt}`}>
                <Link
                  href={href(`/prenota${qs({ prestazione: service.slug, medico: slot.doctorSlug, quando: slot.startsAt })}`)}
                  className="bg-card hover:border-enamel flex flex-col rounded-lg border p-4 transition-colors"
                >
                  <span className="font-semibold">
                    {data(slot.date)} {t("alle", "at")} {slot.time}
                  </span>
                  <span className="text-muted-foreground mt-1 text-sm">
                    {slot.doctorName} · {where(slot.roomName, slot.floor)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-muted-foreground mt-6 text-sm">
          {t("Cambiato idea?", "Changed your mind?")}{" "}
          <Link href={href("/prenota")} className="text-enamel underline decoration-dotted underline-offset-4">
            {t("Scegli un'altra prestazione", "Choose another service")}
          </Link>
          .
        </p>
      </div>
    );
  }

  // Passo 3: riepilogo e form. Lo slot viene ricontrollato dalla Server Action, non qui.
  const wanted = new Date(when);
  const chosen = Number.isNaN(wanted.getTime())
    ? undefined
    : (
        await findSlots({
          serviceSlug: service.slug,
          doctorSlug: doctor.slug,
          fromDate: localDate(wanted),
          days: 1,
          limit: 200,
        })
      ).slots.find((s) => new Date(s.startsAt).getTime() === wanted.getTime());

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("Conferma la prenotazione", "Confirm the booking")}</h1>
      <Steps current={3} lang={lang} />

      {errore && (
        <p role="alert" className="mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <AlertCircleIcon className="size-5 shrink-0 text-amber-700" aria-hidden />
          <span>{errore}</span>
        </p>
      )}

      {!chosen && (
        <p role="alert" className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          {t("Quell'orario non risulta più libero.", "That time is no longer free.")}{" "}
          <Link
            href={href(`/prenota${qs({ prestazione: service.slug, medico: doctor.slug })}`)}
            className="text-enamel underline decoration-dotted underline-offset-4"
          >
            {t("Scegline un altro", "Choose another one")}
          </Link>
          .
        </p>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="riepilogo" className="bg-enamel-soft/60 rounded-lg border p-5">
          <h2 id="riepilogo" className="font-display text-2xl leading-none">
            {t("Riepilogo", "Summary")}
          </h2>
          <dl className="mt-4 divide-y border-y text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Prestazione", "Service")}</dt>
              <dd className="font-semibold">{service.name}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Quando", "When")}</dt>
              <dd className="font-semibold">
                {chosen ? `${data(chosen.date)} ${t("alle", "at")} ${chosen.time}` : t("da riscegliere", "to be chosen again")}
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Medico", "Doctor")}</dt>
              <dd>{doctor.name}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Dove", "Where")}</dt>
              <dd>{chosen ? where(chosen.roomName, chosen.floor) : "—"}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Durata", "Duration")}</dt>
              <dd>{durata(service.durationMinutes)}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Costo", "Cost")}</dt>
              <dd className="font-semibold">{prezzo(service.priceCents)}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Referto", "Report")}</dt>
              <dd>{refertoLabel(service.reportDays)}</dd>
            </div>
          </dl>
          {service.preparation && (
            <p className="mt-4 text-sm leading-relaxed">
              <strong>{t("Prima dell'appuntamento:", "Before the appointment:")}</strong> {service.preparation}
            </p>
          )}
          <Link
            href={href(`/prenota${qs({ prestazione: service.slug, medico: doctor.slug })}`)}
            className="text-enamel mt-4 inline-block text-sm underline decoration-dotted underline-offset-4"
          >
            {t("Cambia orario", "Change time")}
          </Link>
        </section>

        <section aria-labelledby="dati">
          <h2 id="dati" className="font-display text-2xl">
            {t("I tuoi dati", "Your details")}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {t(
              "Servono solo a ritrovare l'appuntamento. Non scrivere dati veri: usa un nome e un'email di fantasia.",
              "They are only used to find the appointment again. Do not write real data: use a made-up name and email.",
            )}
          </p>
          <form action={createBooking} className="mt-4 space-y-4">
            <input type="hidden" name="prestazione" value={service.slug} />
            <input type="hidden" name="medico" value={doctor.slug} />
            <input type="hidden" name="quando" value={chosen?.startsAt ?? when} />

            <label className="block text-sm">
              {t("Nome e cognome", "Full name")}
              <input name="nome" required maxLength={80} autoComplete="off" placeholder="Mario Demo" className={field} />
            </label>
            <label className="block text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={120}
                autoComplete="off"
                placeholder="mario@example.com"
                className={field}
              />
            </label>
            <label className="block text-sm">
              {t("Telefono", "Phone")}
              <input name="telefono" required maxLength={30} autoComplete="off" placeholder="340 0000000" className={field} />
            </label>
            <label className="block text-sm">
              {t("Nota per la reception (facoltativa)", "Note for reception (optional)")}
              <textarea name="note" maxLength={300} rows={3} className={field} />
            </label>

            <label className="flex items-start gap-3 text-sm leading-snug">
              <input type="checkbox" name="demo" required className="mt-0.5 size-4 shrink-0" />
              <span>{t("Ho capito che è una demo e non sto inserendo dati veri.", "I understand this is a demo and I am not entering real data.")}</span>
            </label>

            <Button type="submit" size="lg" disabled={!chosen}>
              {t("Conferma la prenotazione", "Confirm the booking")}
            </Button>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "Riceverai un codice tipo PR-12345 da usare con la tua email per ritrovare o disdire l'appuntamento. Nessuna email viene spedita: è una demo.",
                "You will get a code like PR-12345 to use with your email to find or cancel the appointment. No email is sent: it is a demo.",
              )}
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
