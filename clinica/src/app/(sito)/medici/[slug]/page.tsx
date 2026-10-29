import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fmt, iniziali } from "@/app/(sito)/_shared";
import { AssistantPageContext } from "@/components/assistant/ask";
import { lDoctor, lService, roomNameEn } from "@/data/en/localize";
import { doctorSchedule, findSlots } from "@/lib/agenda";
import { getDoctor, servicesForDoctor } from "@/lib/clinica";
import { getI18n, getLang } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/medici/[slug]">): Promise<Metadata> {
  const [doctor, lang] = await Promise.all([getDoctor((await params).slug), getLang()]);
  if (!doctor) return {};
  return pageMeta(lang, `/medici/${doctor.slug}`, {
    title: doctor.name,
    description:
      lang === "en"
        ? `${doctor.name}: specialties, hours and services at Poliambulatorio Vallenova.`
        : `${doctor.name}: specialità, orari e prestazioni al Poliambulatorio Vallenova.`,
  });
}

export default async function MedicoDetailPage({ params }: PageProps<"/medici/[slug]">) {
  const { slug } = await params;
  const [found, { t, href, lang }] = await Promise.all([getDoctor(slug), getI18n()]);
  if (!found) notFound();
  const doctor = lDoctor(lang, found);
  const { durata, prezzo, tipoLabel, giorno, data } = fmt(lang);

  const [schedule, itServices] = await Promise.all([doctorSchedule(doctor.slug), servicesForDoctor(doctor.slug)]);
  const services = itServices.map((s) => lService(lang, s));
  const firstService = services[0];
  // Le disponibilità mostrate sono quelle della prima prestazione, con questo medico.
  const { slots } = firstService
    ? await findSlots({ serviceSlug: firstService.slug, doctorSlug: doctor.slug, limit: 4 })
    : { slots: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AssistantPageContext path={href(`/medici/${doctor.slug}`)} doctorSlug={doctor.slug} doctorName={doctor.name} />
      <nav aria-label={t("Percorso", "Breadcrumb")} className="text-muted-foreground text-sm">
        <Link href={href("/medici")} className="hover:text-foreground">
          {t("Medici", "Doctors")}
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
                <Link href={href(`/specialita/${s.slug}`)} className="underline decoration-dotted underline-offset-4">
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
              <dt className="text-muted-foreground">{t("Albo", "Medical register")}</dt>
              <dd>{doctor.register}</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
              <dt className="text-muted-foreground">{t("Lingue", "Languages")}</dt>
              <dd>{doctor.languages.join(", ")}</dd>
            </div>
          </dl>

          <section className="mt-10" aria-labelledby="prestazioni">
            <h2 id="prestazioni" className="font-display text-2xl">
              {t("Prestazioni che esegue", "Services provided")}
            </h2>
            {services.length === 0 ? (
              <p className="text-muted-foreground mt-3">{t("Nessuna prestazione prenotabile online.", "No services bookable online.")}</p>
            ) : (
              <ul className="mt-3 divide-y border-y">
                {services.map((s) => (
                  <li key={s.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
                    <Link href={href(`/prestazioni/${s.slug}`)} className="hover:text-enamel font-semibold underline decoration-dotted underline-offset-4">
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
            <h2 className="font-display text-xl leading-none">{t("Quando riceve", "When they see patients")}</h2>
            {schedule.length === 0 ? (
              <p className="text-muted-foreground mt-3 text-sm">{t("Orari non pubblicati.", "Hours not published.")}</p>
            ) : (
              <ul className="mt-3 divide-y border-y text-sm">
                {schedule.map((sh, i) => (
                  <li key={`${sh.weekday}-${sh.startMin}-${i}`} className="py-2.5">
                    <span className="font-semibold capitalize">{giorno(sh.weekday)}</span> {sh.from}-{sh.to}
                    <span className="text-muted-foreground block text-xs">
                      {roomNameEn(lang, sh.roomName)}, {t("piano", "floor")} {sh.floor}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {firstService && (
            <div className="bg-enamel-soft/60 mt-6 rounded-lg border p-5">
              <h2 className="font-display text-xl leading-none">{t("Prossime disponibilità", "Next available slots")}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("Per", "For")} <strong>{firstService.name}</strong>, {t("con questo medico.", "with this doctor.")}
              </p>
              {slots.length === 0 ? (
                <p className="mt-3 text-sm">{t("Nessun orario libero nei prossimi giorni.", "No free slots in the coming days.")}</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {slots.map((slot) => (
                    <li key={slot.startsAt}>
                      <Link
                        href={href(`/prenota?prestazione=${firstService.slug}&medico=${doctor.slug}&quando=${encodeURIComponent(slot.startsAt)}`)}
                        className="hover:border-enamel block rounded-md border bg-white p-3 text-sm transition-colors"
                      >
                        <span className="font-semibold">
                          {data(slot.date)} {t("alle", "at")} {slot.time}
                        </span>
                        <span className="text-muted-foreground block text-xs">
                          {roomNameEn(lang, slot.roomName)}, {t("piano", "floor")} {slot.floor}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={href(`/prenota?prestazione=${firstService.slug}&medico=${doctor.slug}`)}
                className="text-enamel mt-3 inline-block text-sm font-semibold underline decoration-dotted underline-offset-4"
              >
                {t("Tutti gli orari liberi", "All free slots")}
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
