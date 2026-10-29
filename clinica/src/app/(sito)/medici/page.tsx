import type { Metadata } from "next";
import Link from "next/link";

import { iniziali } from "@/app/(sito)/_shared";
import { doctorSchedule } from "@/lib/agenda";
import { listDoctors } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/medici", {
  title: "I medici",
  description: "I quattordici specialisti del poliambulatorio, con specialità, lingue e giorni in cui ricevono.",
});

export default async function MediciPage() {
  const doctors = await listDoctors();
  const schedules = await Promise.all(doctors.map((d) => doctorSchedule(d.slug)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">I medici</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        Quattordici specialisti, tutti inventati per questa demo. Per ognuno trovi le specialità, le lingue parlate e i
        giorni in cui riceve.
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
                <Link href={`/medici/${d.slug}`} className="hover:text-enamel">
                  {d.name}
                </Link>
              </h2>
            </div>

            <p className="text-enamel mt-3 text-sm font-semibold">{d.specialities.map((s) => s.name).join(" · ")}</p>

            <dl className="mt-3 flex-1 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs tracking-[0.14em] uppercase">Riceve</dt>
                <dd>
                  {schedules[i].length === 0
                    ? "Orari non pubblicati."
                    : schedules[i].map((t) => `${t.weekdayName} ${t.from}-${t.to}`).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs tracking-[0.14em] uppercase">Lingue</dt>
                <dd>{d.languages.join(", ")}</dd>
              </div>
            </dl>

            <Link
              href={`/medici/${d.slug}`}
              className="text-enamel mt-4 text-sm font-semibold underline decoration-dotted underline-offset-4"
            >
              Scheda e prestazioni
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
