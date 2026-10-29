import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { durata, firstParam, prezzo, qs, refertoLabel, tipoLabel } from "@/app/(sito)/_shared";
import { createBooking } from "@/app/(sito)/prenota/actions";
import { Button } from "@/components/ui/button";
import { findSlots, localDate, prettyDate } from "@/lib/agenda";
import { getService, listServices, listSpecialities } from "@/lib/clinica";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/prenota", {
  title: "Prenota un appuntamento",
  description: "Scegli la prestazione, l'orario libero e conferma. Prenotazione dimostrativa, senza dati veri.",
});

const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const labels = ["Prestazione", "Giorno e ora", "Conferma"];
  return (
    <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Passaggi della prenotazione">
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

  const service = serviceSlug ? await getService(serviceSlug) : undefined;

  // Passo 1: non so ancora cosa vuole prenotare.
  if (!service) {
    const [specialities, services] = await Promise.all([
      listSpecialities(),
      listServices({ speciality: specialitaFilter }),
    ]);
    const active = specialities.find((s) => s.slug === specialitaFilter)?.slug;

    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl">Prenota un appuntamento</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
          Scegli la visita o l&apos;esame: al passaggio dopo vedi gli orari davvero liberi. È un sito dimostrativo, non
          inserire dati veri.
        </p>
        <Steps current={1} />

        <nav aria-label="Filtra per specialità" className="mt-8 border-y py-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">Specialità</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link
                href="/prenota"
                aria-current={!active ? "page" : undefined}
                className={cn("hover:border-enamel block rounded-full border px-3 py-1.5", !active && "bg-enamel border-enamel text-white")}
              >
                Tutte
              </Link>
            </li>
            {specialities.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/prenota${qs({ specialita: s.slug })}`}
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
                href={`/prenota${qs({ prestazione: s.slug })}`}
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
        <h1 className="font-display text-4xl md:text-5xl">Scegli giorno e ora</h1>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          {service.name} · {durata(service.durationMinutes)} · {prezzo(service.priceCents)}
        </p>
        <Steps current={2} />

        {errore && (
          <p role="alert" className="mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <AlertCircleIcon className="size-5 shrink-0 text-amber-700" aria-hidden />
            <span>{errore}</span>
          </p>
        )}

        <nav aria-label="Filtra per medico" className="mt-8 border-y py-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">Medico</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link
                href={`/prenota${qs({ prestazione: service.slug })}`}
                aria-current={!doctor ? "page" : undefined}
                className={cn("hover:border-enamel block rounded-full border px-3 py-1.5", !doctor && "bg-enamel border-enamel text-white")}
              >
                Chiunque
              </Link>
            </li>
            {service.doctors.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/prenota${qs({ prestazione: service.slug, medico: d.slug })}`}
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
            Non ci sono orari liberi nei prossimi giorni con questa scelta. Prova a{" "}
            <Link href={`/prenota${qs({ prestazione: service.slug })}`} className="text-enamel underline decoration-dotted underline-offset-4">
              togliere il filtro sul medico
            </Link>{" "}
            o chiama la reception.
          </p>
        ) : (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {slots.map((slot) => (
              <li key={`${slot.doctorSlug}-${slot.startsAt}`}>
                <Link
                  href={`/prenota${qs({ prestazione: service.slug, medico: slot.doctorSlug, quando: slot.startsAt })}`}
                  className="bg-card hover:border-enamel flex flex-col rounded-lg border p-4 transition-colors"
                >
                  <span className="font-semibold">
                    {prettyDate(slot.date)} alle {slot.time}
                  </span>
                  <span className="text-muted-foreground mt-1 text-sm">
                    {slot.doctorName} · {slot.roomName}, piano {slot.floor}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-muted-foreground mt-6 text-sm">
          Cambiato idea?{" "}
          <Link href="/prenota" className="text-enamel underline decoration-dotted underline-offset-4">
            Scegli un&apos;altra prestazione
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
      <h1 className="font-display text-4xl md:text-5xl">Conferma la prenotazione</h1>
      <Steps current={3} />

      {errore && (
        <p role="alert" className="mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <AlertCircleIcon className="size-5 shrink-0 text-amber-700" aria-hidden />
          <span>{errore}</span>
        </p>
      )}

      {!chosen && (
        <p role="alert" className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Quell&apos;orario non risulta più libero.{" "}
          <Link
            href={`/prenota${qs({ prestazione: service.slug, medico: doctor.slug })}`}
            className="text-enamel underline decoration-dotted underline-offset-4"
          >
            Scegline un altro
          </Link>
          .
        </p>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="riepilogo" className="bg-enamel-soft/60 rounded-lg border p-5">
          <h2 id="riepilogo" className="font-display text-2xl leading-none">
            Riepilogo
          </h2>
          <dl className="mt-4 divide-y border-y text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Prestazione</dt>
              <dd className="font-semibold">{service.name}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Quando</dt>
              <dd className="font-semibold">
                {chosen ? `${prettyDate(chosen.date)} alle ${chosen.time}` : "da riscegliere"}
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Medico</dt>
              <dd>{doctor.name}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Dove</dt>
              <dd>{chosen ? `${chosen.roomName}, piano ${chosen.floor}` : "—"}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Durata</dt>
              <dd>{durata(service.durationMinutes)}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Costo</dt>
              <dd className="font-semibold">{prezzo(service.priceCents)}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Referto</dt>
              <dd>{refertoLabel(service.reportDays)}</dd>
            </div>
          </dl>
          {service.preparation && (
            <p className="mt-4 text-sm leading-relaxed">
              <strong>Prima dell&apos;appuntamento:</strong> {service.preparation}
            </p>
          )}
          <Link
            href={`/prenota${qs({ prestazione: service.slug, medico: doctor.slug })}`}
            className="text-enamel mt-4 inline-block text-sm underline decoration-dotted underline-offset-4"
          >
            Cambia orario
          </Link>
        </section>

        <section aria-labelledby="dati">
          <h2 id="dati" className="font-display text-2xl">
            I tuoi dati
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Servono solo a ritrovare l&apos;appuntamento. Non scrivere dati veri: usa un nome e un&apos;email di
            fantasia.
          </p>
          <form action={createBooking} className="mt-4 space-y-4">
            <input type="hidden" name="prestazione" value={service.slug} />
            <input type="hidden" name="medico" value={doctor.slug} />
            <input type="hidden" name="quando" value={chosen?.startsAt ?? when} />

            <label className="block text-sm">
              Nome e cognome
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
              Telefono
              <input name="telefono" required maxLength={30} autoComplete="off" placeholder="340 0000000" className={field} />
            </label>
            <label className="block text-sm">
              Nota per la reception (facoltativa)
              <textarea name="note" maxLength={300} rows={3} className={field} />
            </label>

            <label className="flex items-start gap-3 text-sm leading-snug">
              <input type="checkbox" name="demo" required className="mt-0.5 size-4 shrink-0" />
              <span>Ho capito che è una demo e non sto inserendo dati veri.</span>
            </label>

            <Button type="submit" size="lg" disabled={!chosen}>
              Conferma la prenotazione
            </Button>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Riceverai un codice tipo PR-12345 da usare con la tua email per ritrovare o disdire l&apos;appuntamento.
              Nessuna email viene spedita: è una demo.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
