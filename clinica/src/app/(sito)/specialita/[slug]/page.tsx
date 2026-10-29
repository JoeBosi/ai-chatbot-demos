import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { durata, iniziali, prezzo, refertoLabel, tipoLabel } from "@/app/(sito)/_shared";
import { Button } from "@/components/ui/button";
import { doctorSchedule } from "@/lib/agenda";
import { getSpeciality, listDoctors, listServices } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/specialita/[slug]">): Promise<Metadata> {
  const speciality = await getSpeciality((await params).slug);
  return speciality ? pageMeta(`/specialita/${speciality.slug}`, { title: speciality.name, description: speciality.summary }) : {};
}

export default async function SpecialitaDetailPage({ params }: PageProps<"/specialita/[slug]">) {
  const { slug } = await params;
  const speciality = await getSpeciality(slug);
  if (!speciality) notFound();

  const [services, doctors] = await Promise.all([listServices({ speciality: slug }), listDoctors({ speciality: slug })]);
  const schedules = await Promise.all(doctors.map((d) => doctorSchedule(d.slug)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Percorso" className="text-muted-foreground text-sm">
        <Link href="/specialita" className="hover:text-foreground">
          Specialità
        </Link>
        {" / "}
        <span>{speciality.name}</span>
      </nav>

      <h1 className="font-display mt-4 text-4xl md:text-5xl">{speciality.name}</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">{speciality.summary}</p>
      <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">{speciality.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/prestazioni?specialita=${speciality.slug}`}>Vedi le prestazioni</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/prenota">Prenota un appuntamento</Link>
        </Button>
      </div>

      <section className="mt-12" aria-labelledby="prestazioni">
        <h2 id="prestazioni" className="font-display text-3xl">
          Visite ed esami di {speciality.name.toLowerCase()}
        </h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground mt-3">Per questa specialità non c&apos;è ancora nulla di prenotabile online.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
              <caption className="sr-only">Prestazioni di {speciality.name} con durata, costo e tempi di referto</caption>
              <thead>
                <tr className="text-muted-foreground text-left text-xs tracking-[0.12em] uppercase">
                  <th scope="col" className="border-b py-2 pr-3 font-semibold">
                    Prestazione
                  </th>
                  <th scope="col" className="border-b py-2 pr-3 font-semibold">
                    Tipo
                  </th>
                  <th scope="col" className="border-b py-2 pr-3 font-semibold">
                    Durata
                  </th>
                  <th scope="col" className="border-b py-2 pr-3 font-semibold">
                    Costo
                  </th>
                  <th scope="col" className="border-b py-2 font-semibold">
                    Referto
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.slug} className="align-top">
                    <td className="border-b py-3 pr-3">
                      <Link href={`/prestazioni/${s.slug}`} className="hover:text-enamel font-semibold underline decoration-dotted underline-offset-4">
                        {s.name}
                      </Link>
                    </td>
                    <td className="text-muted-foreground border-b py-3 pr-3">{tipoLabel[s.kind] ?? s.kind}</td>
                    <td className="border-b py-3 pr-3 whitespace-nowrap">{durata(s.durationMinutes)}</td>
                    <td className="border-b py-3 pr-3 whitespace-nowrap">{prezzo(s.priceCents)}</td>
                    <td className="text-muted-foreground border-b py-3">{refertoLabel(s.reportDays)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="medici">
        <h2 id="medici" className="font-display text-3xl">
          Chi riceve
        </h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {doctors.map((d, i) => (
            <li key={d.slug} className="bg-card flex gap-4 rounded-lg border p-5">
              <span
                aria-hidden
                style={{ backgroundColor: d.color }}
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
              >
                {iniziali(d.name)}
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl leading-tight">
                  <Link href={`/medici/${d.slug}`} className="hover:text-enamel">
                    {d.name}
                  </Link>
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {schedules[i].length === 0
                    ? "Orari non pubblicati."
                    : schedules[i].map((t) => `${t.weekdayName} ${t.from}-${t.to}`).join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
