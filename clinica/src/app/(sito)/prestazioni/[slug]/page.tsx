import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fmt } from "@/app/(sito)/_shared";
import { AskBox, AssistantPageContext } from "@/components/assistant/ask";
import { Button } from "@/components/ui/button";
import { lService, roomNameEn } from "@/data/en/localize";
import { findSlots } from "@/lib/agenda";
import { getService } from "@/lib/clinica";
import { getI18n, getLang } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/prestazioni/[slug]">): Promise<Metadata> {
  const [found, lang] = await Promise.all([getService((await params).slug), getLang()]);
  if (!found) return {};
  const service = lService(lang, found);
  return pageMeta(lang, `/prestazioni/${service.slug}`, { title: service.name, description: service.description.slice(0, 160) });
}

export default async function PrestazioneDetailPage({ params }: PageProps<"/prestazioni/[slug]">) {
  const { slug } = await params;
  const [found, { t, href, lang }] = await Promise.all([getService(slug), getI18n()]);
  if (!found) notFound();
  const service = lService(lang, found);
  const { durata, prezzo, refertoLabel, tipoLabel, data } = fmt(lang);
  const lower = lang === "en" ? service.name : service.name.toLowerCase();

  const { slots } = await findSlots({ serviceSlug: service.slug, limit: 6 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AssistantPageContext path={href(`/prestazioni/${service.slug}`)} serviceSlug={service.slug} serviceName={service.name} />
      <nav aria-label={t("Percorso", "Breadcrumb")} className="text-muted-foreground text-sm">
        <Link href={href("/prestazioni")} className="hover:text-foreground">
          {t("Visite ed esami", "Visits and tests")}
        </Link>
        {" / "}
        <Link href={href(`/prestazioni?specialita=${service.specialitySlug}`)} className="hover:text-foreground">
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
                <h2 className="font-display text-xl leading-none">{t("Come prepararsi", "How to prepare")}</h2>
                <p className="mt-2 leading-relaxed">{service.preparation}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-6 text-sm">{t("Non serve nessuna preparazione particolare.", "No special preparation is needed.")}</p>
          )}

          <section className="mt-10" aria-labelledby="chi-la-esegue">
            <h2 id="chi-la-esegue" className="font-display text-2xl">
              {t("Chi la esegue", "Who performs it")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {service.doctors.map((d) => (
                <li key={d.slug}>
                  <Link href={href(`/medici/${d.slug}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="disponibilita">
            <h2 id="disponibilita" className="font-display text-2xl">
              {t("Prossime disponibilità", "Next available slots")}
            </h2>
            {slots.length === 0 ? (
              <p className="text-muted-foreground mt-3">
                {t("In questo momento non ci sono orari liberi nei prossimi giorni. Puoi", "There are no free slots in the coming days right now. You can")}{" "}
                <Link href={href("/prenota")} className="text-enamel underline decoration-dotted underline-offset-4">
                  {t("guardare le altre prestazioni", "look at the other services")}
                </Link>{" "}
                {t("o chiamare la reception.", "or call reception.")}
              </p>
            ) : (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {slots.map((slot) => (
                  <li key={`${slot.doctorSlug}-${slot.startsAt}`}>
                    <Link
                      href={href(`/prenota?prestazione=${service.slug}&medico=${slot.doctorSlug}&quando=${encodeURIComponent(slot.startsAt)}`)}
                      className="bg-card hover:border-enamel flex flex-col rounded-lg border p-4 transition-colors"
                    >
                      <span className="font-semibold">
                        {data(slot.date)} {t("alle", "at")} {slot.time}
                      </span>
                      <span className="text-muted-foreground mt-1 text-sm">
                        {slot.doctorName} · {roomNameEn(lang, slot.roomName)}, {t("piano", "floor")} {slot.floor}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild className="mt-4">
              <Link href={href(`/prenota?prestazione=${service.slug}`)}>{t("Vedi tutti gli orari liberi", "See all free slots")}</Link>
            </Button>
          </section>
        </div>

        <aside className="lg:pt-10">
          <div className="bg-card rounded-lg border p-5">
            <h2 className="font-display text-xl leading-none">{t("In breve", "At a glance")}</h2>
            <dl className="mt-4 divide-y border-y text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Specialità", "Specialty")}</dt>
                <dd>
                  <Link href={href(`/specialita/${service.specialitySlug}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                    {service.specialityName}
                  </Link>
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Durata", "Duration")}</dt>
                <dd>{durata(service.durationMinutes)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Costo", "Cost")}</dt>
                <dd className="font-semibold">{prezzo(service.priceCents)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Referto", "Report")}</dt>
                <dd>{refertoLabel(service.reportDays)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Impegnativa", "GP referral")}</dt>
                <dd>
                  {service.referralNeeded
                    ? t(
                        "Serve l'impegnativa del medico di base per il servizio pubblico; in privato no.",
                        "A GP referral is needed for the public health service; not for private visits.",
                      )
                    : t("Non serve.", "Not needed.")}
                </dd>
              </div>
            </dl>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              {t("Prezzi e tempi sono inventati: è un sito dimostrativo.", "Prices and times are made up: this is a demo site.")}
            </p>
          </div>

          <AskBox
            className="mt-6"
            placeholder={t(`Es. «quanto dura ${lower}?»`, `E.g. «how long does the ${lower} take?»`)}
            suggestions={
              lang === "en"
                ? [`How do I prepare for the ${lower}?`, `I'd like to book the ${lower}`, `What are the next free slots for the ${lower}?`]
                : [`Come mi preparo per ${lower}?`, `Vorrei prenotare ${lower}`, `Quali sono le prossime disponibilità per ${lower}?`]
            }
          />
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            {t(
              "L'assistente risponde su orari, costi, preparazione e stanze. Non dice se questo esame serve nel tuo caso: quello lo decide un medico.",
              "The assistant answers about times, costs, preparation and rooms. It does not say whether this test is right for you: a doctor decides that.",
            )}
          </p>
        </aside>
      </div>
    </div>
  );
}
