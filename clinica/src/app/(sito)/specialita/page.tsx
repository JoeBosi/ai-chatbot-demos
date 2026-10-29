import type { Metadata } from "next";
import Link from "next/link";

import { listDoctors, listServices, listSpecialities } from "@/lib/clinica";
import { lDoctor, lSpeciality } from "@/data/en/localize";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/specialita", {
  it: {
    title: "Le specialità",
    description:
      "Le dieci specialità del poliambulatorio, con le prestazioni e i medici di ognuna.",
  },
  en: {
    title: "Our specialties",
    description:
      "The clinic's ten specialties, with the services and doctors of each.",
  },
});

export default async function SpecialitaPage() {
  const [itSpecialities, services, itDoctors, { t, href, lang }] = await Promise.all([listSpecialities(), listServices(), listDoctors(), getI18n()]);
  const specialities = itSpecialities.map((s) => lSpeciality(lang, s));
  const doctors = itDoctors.map((d) => lDoctor(lang, d));

  const serviceCount = new Map<string, number>();
  for (const s of services) serviceCount.set(s.specialitySlug, (serviceCount.get(s.specialitySlug) ?? 0) + 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("Le specialità", "Our specialties")}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        {t(
          "Dieci ambulatori nello stesso edificio. Per ognuno trovi le visite e gli esami che si possono prenotare e i medici che ricevono. Quale specialista serve lo decide il medico di base: qui ci sono solo le informazioni organizzative.",
          "Ten clinics in the same building. For each one you will find the visits and tests you can book and the doctors who see patients. Your GP decides which specialist you need: here there is only organisational information.",
        )}
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {specialities.map((s) => {
          const medici = doctors.filter((d) => d.specialities.some((sp) => sp.slug === s.slug));
          const n = serviceCount.get(s.slug) ?? 0;
          return (
            <li key={s.slug} className="bg-card flex flex-col rounded-lg border p-5">
              <h2 className="font-display text-2xl leading-tight">
                <Link href={href(`/specialita/${s.slug}`)} className="hover:text-enamel">
                  {s.name}
                </Link>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.summary}</p>

              <p className="mt-3 text-sm">
                <strong>
                  {n} {n === 1 ? t("prestazione prenotabile", "bookable service") : t("prestazioni prenotabili", "bookable services")}
                </strong>{" "}
                ·{" "}
                <Link href={href(`/prestazioni?specialita=${s.slug}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                  {t("vedi l'elenco", "see the list")}
                </Link>
              </p>

              <div className="mt-3 flex-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
                  {medici.length === 1 ? t("Medico", "Doctor") : t("Medici", "Doctors")}
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {medici.map((d) => (
                    <li key={d.slug}>
                      <Link href={href(`/medici/${d.slug}`)} className="hover:text-enamel underline decoration-dotted underline-offset-4">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={href(`/specialita/${s.slug}`)}
                className="text-enamel mt-4 text-sm font-semibold underline decoration-dotted underline-offset-4"
              >
                {t(`Apri la scheda di ${s.name.toLowerCase()}`, `Open the ${s.name} page`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
