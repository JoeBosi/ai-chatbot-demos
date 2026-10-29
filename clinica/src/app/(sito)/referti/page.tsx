import { ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { clinicaFor, infoSectionsEn } from "@/data/en/localize";
import { listInfoDocs } from "@/lib/clinica";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/referti", {
  it: {
    title: "Referti: tempi, ritiro e invio",
    description:
      "Quando è pronto il referto, come si ritira, chi può ritirarlo con delega e come si riceve via email.",
  },
  en: {
    title: "Reports: timing, collection and delivery",
    description:
      "When the report is ready, how to collect it, who can collect it with a proxy and how to receive it by email.",
  },
});

export default async function RefertiPage() {
  // Le sezioni arrivano dallo stesso documento che legge l'assistente, così sito e chat non si
  // contraddicono mai. Filtro per docSlug invece di usare la ricerca: qui il documento è noto.
  const { t, href, lang } = await getI18n();
  const clinica = clinicaFor(lang);
  const sections = (lang === "en" ? infoSectionsEn() : await listInfoDocs()).filter((s) => s.docSlug === "referti");
  const title = sections[0]?.docTitle ?? t("Referti", "Reports");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        {t(
          "Tempi di consegna, ritiro allo sportello, delega a un'altra persona e invio in PDF. Sono informazioni organizzative: il contenuto del referto lo commenta il medico.",
          "Delivery times, collection at the desk, proxy collection by another person and delivery as a PDF. This is organisational information: the doctor discusses what the report says.",
        )}
      </p>

      <div className="bg-enamel-soft/60 mt-8 flex gap-4 rounded-lg border p-5">
        <ClockIcon className="text-enamel mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <h2 className="font-display text-xl leading-none">{t("Sportello referti, piano 0", "Reports desk, floor 0")}</h2>
          <p className="mt-2 leading-relaxed">{clinica.orariRitiroReferti}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("Telefono dedicato:", "Dedicated phone:")}{" "}
            <a href={`tel:${clinica.telefonoReferti.replace(/\s/g, "")}`} className="text-enamel underline decoration-dotted underline-offset-4">
              {clinica.telefonoReferti}
            </a>{" "}
            · email{" "}
            <a href={`mailto:${clinica.emailReferti}`} className="text-enamel underline decoration-dotted underline-offset-4">
              {clinica.emailReferti}
            </a>
          </p>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="mt-10">{t("Le informazioni sui referti non sono disponibili in questo momento.", "Information about reports is not available right now.")}</p>
      ) : (
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={`${s.docSlug}-${s.position}`} aria-labelledby={`referti-${s.position}`}>
              <h2 id={`referti-${s.position}`} className="font-display text-2xl">
                {s.section}
              </h2>
              <p className="mt-2 max-w-prose leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      )}

      <p className="text-muted-foreground mt-10 text-sm leading-relaxed">
        {t("Altre informazioni pratiche — orari, pagamenti, documenti da portare — sono in", "More practical information (hours, payments, documents to bring) is in")}{" "}
        <Link href={href("/informazioni")} className="text-enamel underline decoration-dotted underline-offset-4">
          {t("Informazioni", "Information")}
        </Link>
        .{" "}
        {t("Per trovare l'appuntamento a cui si riferisce un referto serve il codice e l'email:", "To find the appointment a report refers to you need the code and the email:")}{" "}
        <Link href={href("/prenotazioni")} className="text-enamel underline decoration-dotted underline-offset-4">
          {t("Le mie prenotazioni", "My bookings")}
        </Link>
        .
      </p>
    </div>
  );
}
