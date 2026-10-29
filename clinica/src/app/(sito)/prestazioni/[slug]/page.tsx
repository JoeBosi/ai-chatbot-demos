import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { durata, prezzo, refertoLabel, tipoLabel } from "@/app/(sito)/_shared";
import { AskBox, AssistantPageContext } from "@/components/assistant/ask";
import { Button } from "@/components/ui/button";
import { findSlots, prettyDate } from "@/lib/agenda";
import { getService } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/prestazioni/[slug]">): Promise<Metadata> {
  const service = await getService((await params).slug);
  return service ? pageMeta(`/prestazioni/${service.slug}`, { title: service.name, description: service.description.slice(0, 160) }) : {};
}

export default async function PrestazioneDetailPage({ params }: PageProps<"/prestazioni/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const { slots } = await findSlots({ serviceSlug: service.slug, limit: 6 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AssistantPageContext path={`/prestazioni/${service.slug}`} serviceSlug={service.slug} serviceName={service.name} />
      <nav aria-label="Percorso" className="text-muted-foreground text-sm">
        <Link href="/prestazioni" className="hover:text-foreground">
          Visite ed esami
        </Link>
        {" / "}
        <Link href={`/prestazioni?specialita=${service.specialitySlug}`} className="hover:text-foreground">
          {service.specialityName}
        </Link>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
            {tipoLabel[service.kind] ?? service.kind}
          </p>
          <h1 className="font-display mt-1 text-4xl md:text-5xl">{service.name}</h1>
          <p className="mt-4 max-w-prose text-lg leading-relaxed">{service.description}</p>

          {service.preparation ? (
            <div className="mt-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5">
              <InfoIcon className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
              <div>
                <h2 className="font-display text-xl leading-none">Come prepararsi</h2>
                <p className="mt-2 leading-relaxed">{service.preparation}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-6 text-sm">Non serve nessuna preparazione particolare.</p>
          )}

          <section className="mt-10" aria-labelledby="chi-la-esegue">
            <h2 id="chi-la-esegue" className="font-display text-2xl">
              Chi la esegue
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {service.doctors.map((d) => (
                <li key={d.slug}>
                  <Link href={`/medici/${d.slug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="disponibilita">
            <h2 id="disponibilita" className="font-display text-2xl">
              Prossime disponibilità
            </h2>
            {slots.length === 0 ? (
              <p className="text-muted-foreground mt-3">
                In questo momento non ci sono orari liberi nei prossimi giorni. Puoi{" "}
                <Link href="/prenota" className="text-enamel underline decoration-dotted underline-offset-4">
                  guardare le altre prestazioni
                </Link>{" "}
                o chiamare la reception.
              </p>
            ) : (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {slots.map((slot) => (
                  <li key={`${slot.doctorSlug}-${slot.startsAt}`}>
                    <Link
                      href={`/prenota?prestazione=${service.slug}&medico=${slot.doctorSlug}&quando=${encodeURIComponent(slot.startsAt)}`}
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
            <Button asChild className="mt-4">
              <Link href={`/prenota?prestazione=${service.slug}`}>Vedi tutti gli orari liberi</Link>
            </Button>
          </section>
        </div>

        <aside className="lg:pt-10">
          <div className="bg-card rounded-lg border p-5">
            <h2 className="font-display text-xl leading-none">In breve</h2>
            <dl className="mt-4 divide-y border-y text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Specialità</dt>
                <dd>
                  <Link href={`/specialita/${service.specialitySlug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                    {service.specialityName}
                  </Link>
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Durata</dt>
                <dd>{durata(service.durationMinutes)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Costo</dt>
                <dd className="font-semibold">{prezzo(service.priceCents)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Referto</dt>
                <dd>{refertoLabel(service.reportDays)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Impegnativa</dt>
                <dd>
                  {service.referralNeeded
                    ? "Serve l'impegnativa del medico di base per il servizio pubblico; in privato no."
                    : "Non serve."}
                </dd>
              </div>
            </dl>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              Prezzi e tempi sono inventati: è un sito dimostrativo.
            </p>
          </div>

          <AskBox
            className="mt-6"
            placeholder={`Es. «quanto dura ${service.name.toLowerCase()}?»`}
            suggestions={[
              `Come mi preparo per ${service.name.toLowerCase()}?`,
              `Vorrei prenotare ${service.name.toLowerCase()}`,
              `Quali sono le prossime disponibilità per ${service.name.toLowerCase()}?`,
            ]}
          />
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            L&apos;assistente risponde su orari, costi, preparazione e stanze. Non dice se questo esame serve nel tuo
            caso: quello lo decide un medico.
          </p>
        </aside>
      </div>
    </div>
  );
}
