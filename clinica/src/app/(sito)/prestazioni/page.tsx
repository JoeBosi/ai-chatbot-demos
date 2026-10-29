import type { Metadata } from "next";
import Link from "next/link";

import { durata, firstParam, prezzo, qs, refertoLabel, tipi, tipoLabel } from "@/app/(sito)/_shared";
import { listServices, listSpecialities } from "@/lib/clinica";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/prestazioni", {
  title: "Visite ed esami",
  description: "Tutte le prestazioni prenotabili, con durata, costo, tempi di referto e impegnativa.",
});

export default async function PrestazioniPage({ searchParams }: PageProps<"/prestazioni">) {
  const params = await searchParams;
  const specialities = await listSpecialities();

  // I filtri arrivano dalla query string: accetto solo i valori che esistono davvero.
  const wantedSpeciality = firstParam(params.specialita, 60);
  const speciality = specialities.find((s) => s.slug === wantedSpeciality)?.slug;
  const wantedKind = firstParam(params.tipo, 20);
  const kind = tipi.find((t) => t === wantedKind);

  const services = await listServices({ speciality, kind });

  const href = (next: { specialita?: string; tipo?: string }) =>
    `/prestazioni${qs({
      specialita: "specialita" in next ? next.specialita : speciality,
      tipo: "tipo" in next ? next.tipo : kind,
    })}`;

  const chip = (active: boolean) =>
    cn(
      "hover:border-enamel block rounded-full border px-3 py-1.5 transition-colors",
      active && "bg-enamel border-enamel text-white hover:border-white",
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Visite ed esami</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        Tutto quello che si può prenotare, con durata, costo e tempi di referto. Puoi restringere l&apos;elenco per
        specialità e per tipo.
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y py-4">
        <nav aria-label="Filtra per specialità">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">Specialità</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ specialita: undefined })} aria-current={!speciality ? "page" : undefined} className={chip(!speciality)}>
                Tutte
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

        <nav aria-label="Filtra per tipo">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">Tipo</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            <li>
              <Link href={href({ tipo: undefined })} aria-current={!kind ? "page" : undefined} className={chip(!kind)}>
                Tutti
              </Link>
            </li>
            {tipi.map((t) => (
              <li key={t}>
                <Link href={href({ tipo: t })} aria-current={kind === t ? "page" : undefined} className={chip(kind === t)}>
                  {tipoLabel[t]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {services.length === 0
          ? "Nessuna prestazione con questi filtri."
          : `${services.length} ${services.length === 1 ? "prestazione" : "prestazioni"}`}
      </p>

      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug} className="bg-card flex flex-col rounded-lg border p-5">
            <p className="text-enamel text-xs font-semibold tracking-[0.14em] uppercase">
              {s.specialityName} · {tipoLabel[s.kind] ?? s.kind}
            </p>
            <h2 className="font-display mt-1 text-2xl leading-tight">
              <Link href={`/prestazioni/${s.slug}`} className="hover:text-enamel">
                {s.name}
              </Link>
            </h2>
            <dl className="mt-3 grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Durata</dt>
                <dd className="font-semibold">{durata(s.durationMinutes)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Costo</dt>
                <dd className="font-semibold">{prezzo(s.priceCents)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Referto</dt>
                <dd>{refertoLabel(s.reportDays)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Impegnativa</dt>
                <dd>{s.referralNeeded ? "Sì, per il servizio pubblico" : "Non serve"}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href={`/prestazioni/${s.slug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                Scheda e disponibilità
              </Link>
              <Link href={`/prenota?prestazione=${s.slug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                Prenota
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
