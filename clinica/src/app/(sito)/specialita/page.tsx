import type { Metadata } from "next";
import Link from "next/link";

import { listDoctors, listServices, listSpecialities } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/specialita", {
  title: "Le specialità",
  description: "Le dieci specialità del poliambulatorio, con le prestazioni e i medici di ognuna.",
});

export default async function SpecialitaPage() {
  const [specialities, services, doctors] = await Promise.all([listSpecialities(), listServices(), listDoctors()]);

  const serviceCount = new Map<string, number>();
  for (const s of services) serviceCount.set(s.specialitySlug, (serviceCount.get(s.specialitySlug) ?? 0) + 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Le specialità</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        Dieci ambulatori nello stesso edificio. Per ognuno trovi le visite e gli esami che si possono prenotare e i
        medici che ricevono. Quale specialista serve lo decide il medico di base: qui ci sono solo le informazioni
        organizzative.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {specialities.map((s) => {
          const medici = doctors.filter((d) => d.specialities.some((sp) => sp.slug === s.slug));
          const n = serviceCount.get(s.slug) ?? 0;
          return (
            <li key={s.slug} className="bg-card flex flex-col rounded-lg border p-5">
              <h2 className="font-display text-2xl leading-tight">
                <Link href={`/specialita/${s.slug}`} className="hover:text-enamel">
                  {s.name}
                </Link>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.summary}</p>

              <p className="mt-3 text-sm">
                <strong>
                  {n} {n === 1 ? "prestazione prenotabile" : "prestazioni prenotabili"}
                </strong>{" "}
                ·{" "}
                <Link href={`/prestazioni?specialita=${s.slug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                  vedi l&apos;elenco
                </Link>
              </p>

              <div className="mt-3 flex-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
                  {medici.length === 1 ? "Medico" : "Medici"}
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {medici.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/medici/${d.slug}`} className="hover:text-enamel underline decoration-dotted underline-offset-4">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/specialita/${s.slug}`}
                className="text-enamel mt-4 text-sm font-semibold underline decoration-dotted underline-offset-4"
              >
                Apri la scheda di {s.name.toLowerCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
