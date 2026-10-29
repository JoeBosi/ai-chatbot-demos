import type { Metadata } from "next";
import Link from "next/link";

import { fmt, iniziali } from "@/app/(sito)/_shared";
import { doctorSchedule } from "@/lib/agenda";
import { listDoctors } from "@/lib/clinica";
import { lDoctor } from "@/data/en/localize";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/medici", {
  it: {
    title: "I medici",
    description:
      "I quattordici specialisti del poliambulatorio, con specialità, lingue e giorni in cui ricevono.",
  },
  en: {
    title: "Our doctors",
    description:
      "The clinic's fourteen specialists, with their specialties, languages and the days they see patients.",
  },
});

export default async function MediciPage() {
  const [itDoctors, { t, href, lang }] = await Promise.all([listDoctors(), getI18n()]);
  const doctors = itDoctors.map((d) => lDoctor(lang, d));
  const { giorno } = fmt(lang);
  const schedules = await Promise.all(doctors.map((d) => doctorSchedule(d.slug)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("I medici", "Our doctors")}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        {t(
          "Quattordici specialisti, tutti inventati per questa demo. Per ognuno trovi le specialità, le lingue parlate e i giorni in cui riceve.",
          "Fourteen specialists, all made up for this demo. For each one you will find the specialties, the languages spoken and the days they see patients.",
        )}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d, i) => (
          <li key={d.slug} className="bg-card flex flex-col rounded-lg border p-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                style={{ backgroundColor: d.color }}
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
              >
                {iniziali(d.name)}
              </span>
              <h2 className="font-display text-xl leading-tight">
                <Link href={href(`/medici/${d.slug}`)} className="hover:text-enamel">
                  {d.name}
                </Link>
              </h2>
            </div>

            <p className="text-enamel mt-3 text-sm font-semibold">{d.specialities.map((s) => s.name).join(" · ")}</p>

            <dl className="mt-3 flex-1 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs tracking-[0.14em] uppercase">{t("Riceve", "Sees patients")}</dt>
                <dd>
                  {schedules[i].length === 0
                    ? t("Orari non pubblicati.", "Hours not published.")
                    : schedules[i].map((sh) => `${giorno(sh.weekday)} ${sh.from}-${sh.to}`).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs tracking-[0.14em] uppercase">{t("Lingue", "Languages")}</dt>
                <dd>{d.languages.join(", ")}</dd>
              </div>
            </dl>

            <Link
              href={href(`/medici/${d.slug}`)}
              className="text-enamel mt-4 text-sm font-semibold underline decoration-dotted underline-offset-4"
            >
              {t("Scheda e prestazioni", "Profile and services")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
