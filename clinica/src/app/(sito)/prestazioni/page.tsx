import type { Metadata } from "next";
import Link from "next/link";

import { firstParam, fmt, qs, tipi } from "@/app/(sito)/_shared";
import { lService, lSpeciality } from "@/data/en/localize";
import { getI18n } from "@/lib/i18n-server";
import { listServices, listSpecialities } from "@/lib/clinica";
import { cn } from "@/lib/utils";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/prestazioni", {
  it: {
    title: "Visite ed esami",
    description:
      "Tutte le prestazioni prenotabili, con durata, costo, tempi di referto e impegnativa.",
  },
  en: {
    title: "Visits and tests",
    description:
      "All the services you can book, with duration, cost, report times and GP referral.",
  },
});

export default async function PrestazioniPage({ searchParams }: PageProps<"/prestazioni">) {
  const params = await searchParams;
  const [itSpecialities, { t, href: local, lang }] = await Promise.all([listSpecialities(), getI18n()]);
  const specialities = itSpecialities.map((s) => lSpeciality(lang, s));
  const { durata, prezzo, refertoLabel, tipoLabel } = fmt(lang);

  // I filtri arrivano dalla query string: accetto solo i valori che esistono davvero.
  const wantedSpeciality = firstParam(params.specialita, 60);
  const speciality = specialities.find((s) => s.slug === wantedSpeciality)?.slug;
  const wantedKind = firstParam(params.tipo, 20);
  const kind = tipi.find((k) => k === wantedKind);

  const services = (await listServices({ speciality, kind })).map((s) => lService(lang, s));

  const href = (next: { specialita?: string; tipo?: string }) =>
    local(`/prestazioni${qs({
      specialita: "specialita" in next ? next.specialita : speciality,
      tipo: "tipo" in next ? next.tipo : kind,
    })}`);

  const chip = (active: boolean) =>
    cn(
      "hover:border-enamel block rounded-full border px-3 py-1.5 transition-colors",
      active && "bg-enamel border-enamel text-white hover:border-white",
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("Visite ed esami", "Visits and tests")}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        {t(
          "Tutto quello che si può prenotare, con durata, costo e tempi di referto. Puoi restringere l'elenco per specialità e per tipo.",
          "Everything you can book, with duration, cost and report times. You can narrow the list by specialty and by type.",
        )}
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y py-4">
        <nav aria-label={t("Filtra per specialità", "Filter by specialty")}>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{t("Specialità", "Specialty")}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ specialita: undefined })} aria-current={!speciality ? "page" : undefined} className={chip(!speciality)}>
                {t("Tutte", "All")}
              </Link>
            </li>
            {specialities.map((s) => (
              <li key={s.slug}>
                <Link
                  href={href({ specialita: s.slug })}
                  aria-current={speciality === s.slug ? "page" : undefined}
                  className={chip(speciality === s.slug)}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("Filtra per tipo", "Filter by type")}>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{t("Tipo", "Type")}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ tipo: undefined })} aria-current={!kind ? "page" : undefined} className={chip(!kind)}>
                {t("Tutti", "All")}
              </Link>
            </li>
            {tipi.map((k) => (
              <li key={k}>
                <Link href={href({ tipo: k })} aria-current={kind === k ? "page" : undefined} className={chip(kind === k)}>
                  {tipoLabel[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {services.length === 0
          ? t("Nessuna prestazione con questi filtri.", "No services match these filters.")
          : `${services.length} ${services.length === 1 ? t("prestazione", "service") : t("prestazioni", "services")}`}
      </p>

      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug} className="bg-card flex flex-col rounded-lg border p-5">
            <p className="text-enamel text-xs font-semibold tracking-[0.14em] uppercase">
              {s.specialityName} · {tipoLabel[s.kind] ?? s.kind}
            </p>
            <h2 className="font-display mt-1 text-2xl leading-tight">
              <Link href={local(`/prestazioni/${s.slug}`)} className="hover:text-enamel">
                {s.name}
              </Link>
            </h2>
            <dl className="mt-3 grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">{t("Durata", "Duration")}</dt>
                <dd className="font-semibold">{durata(s.durationMinutes)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Costo", "Cost")}</dt>
                <dd className="font-semibold">{prezzo(s.priceCents)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Referto", "Report")}</dt>
                <dd>{refertoLabel(s.reportDays)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Impegnativa", "GP referral")}</dt>
                <dd>{s.referralNeeded ? t("Sì, per il servizio pubblico", "Yes, for the public health service") : t("Non serve", "Not needed")}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href={local(`/prestazioni/${s.slug}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                {t("Scheda e disponibilità", "Details and availability")}
              </Link>
              <Link href={local(`/prenota?prestazione=${s.slug}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                {t("Prenota", "Book")}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
