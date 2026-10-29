import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { durata, iniziali, prezzo, tipoLabel } from "@/app/(sito)/_shared";
import { AssistantPageContext } from "@/components/assistant/ask";
import { doctorSchedule, findSlots, prettyDate } from "@/lib/agenda";
import { getDoctor, servicesForDoctor } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/medici/[slug]">): Promise<Metadata> {
  const doctor = await getDoctor((await params).slug);
  return doctor
    ? pageMeta(`/medici/${doctor.slug}`, { title: doctor.name, description: `${doctor.name}: specialità, orari e prestazioni al Poliambulatorio Vallenova.` })
    : {};
}

export default async function MedicoDetailPage({ params }: PageProps<"/medici/[slug]">) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) notFound();

  const [schedule, services] = await Promise.all([doctorSchedule(doctor.slug), servicesForDoctor(doctor.slug)]);
  const firstService = services[0];
  // Le disponibilità mostrate sono quelle della prima prestazione, con questo medico.
  const { slots } = firstService
    ? await findSlots({ serviceSlug: firstService.slug, doctorSlug: doctor.slug, limit: 4 })
    : { slots: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AssistantPageContext path={`/medici/${doctor.slug}`} doctorSlug={doctor.slug} doctorName={doctor.name} />
      <nav aria-label="Percorso" className="text-muted-foreground text-sm">
        <Link href="/medici" className="hover:text-foreground">
          Medici
        </Link>
        {" / "}
        <span>{doctor.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span
          aria-hidden
          style={{ backgroundColor: doctor.color }}
          className="flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
        >
          {iniziali(doctor.name)}
        </span>
        <div>
          <h1 className="font-display text-4xl md:text-5xl">{doctor.name}</h1>
          <p className="text-enamel mt-1 font-semibold">
            {doctor.specialities.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && " · "}
                <Link href={`/specialita/${s.slug}`} className="underline decoration-dotted underline-offset-4">
                  {s.name}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="max-w-prose text-lg leading-relaxed">{doctor.bio}</p>
          <dl className="mt-6 divide-y border-y text-sm">
            <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Albo</dt>
              <dd>{doctor.register}</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">Lingue</dt>
              <dd>{doctor.languages.join(", ")}</dd>
            </div>
          </dl>

          <section className="mt-10" aria-labelledby="prestazioni">
            <h2 id="prestazioni" className="font-display text-2xl">
              Prestazioni che esegue
            </h2>
            {services.length === 0 ? (
              <p className="text-muted-foreground mt-3">Nessuna prestazione prenotabile online.</p>
            ) : (
              <ul className="mt-3 divide-y border-y">
                {services.map((s) => (
                  <li key={s.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
                    <Link href={`/prestazioni/${s.slug}`} className="hover:text-enamel font-semibold underline decoration-dotted underline-offset-4">
                      {s.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {tipoLabel[s.kind] ?? s.kind} · {durata(s.durationMinutes)} · {prezzo(s.priceCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside>
          <div className="bg-card rounded-lg border p-5">
            <h2 className="font-display text-xl leading-none">Quando riceve</h2>
            {schedule.length === 0 ? (
              <p className="text-muted-foreground mt-3 text-sm">Orari non pubblicati.</p>
            ) : (
              <ul className="mt-3 divide-y border-y text-sm">
                {schedule.map((t, i) => (
                  <li key={`${t.weekday}-${t.startMin}-${i}`} className="py-2.5">
                    <span className="font-semibold capitalize">{t.weekdayName}</span> {t.from}-{t.to}
                    <span className="text-muted-foreground block text-xs">
                      {t.roomName}, piano {t.floor}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {firstService && (
            <div className="bg-enamel-soft/60 mt-6 rounded-lg border p-5">
              <h2 className="font-display text-xl leading-none">Prossime disponibilità</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Per <strong>{firstService.name}</strong>, con questo medico.
              </p>
              {slots.length === 0 ? (
                <p className="mt-3 text-sm">Nessun orario libero nei prossimi giorni.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {slots.map((slot) => (
                    <li key={slot.startsAt}>
                      <Link
                        href={`/prenota?prestazione=${firstService.slug}&medico=${doctor.slug}&quando=${encodeURIComponent(slot.startsAt)}`}
                        className="hover:border-enamel block rounded-md border bg-white p-3 text-sm transition-colors"
                      >
                        <span className="font-semibold">
                          {prettyDate(slot.date)} alle {slot.time}
                        </span>
                        <span className="text-muted-foreground block text-xs">
                          {slot.roomName}, piano {slot.floor}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/prenota?prestazione=${firstService.slug}&medico=${doctor.slug}`}
                className="text-enamel mt-3 inline-block text-sm font-semibold underline decoration-dotted underline-offset-4"
              >
                Tutti gli orari liberi
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
