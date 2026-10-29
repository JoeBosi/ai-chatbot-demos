import { ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { clinica } from "@/data/clinica";
import { listInfoDocs } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/referti", {
  title: "Referti: tempi, ritiro e invio",
  description: "Quando è pronto il referto, come si ritira, chi può ritirarlo con delega e come si riceve via email.",
});

export default async function RefertiPage() {
  // Le sezioni arrivano dallo stesso documento che legge l'assistente, così sito e chat non si
  // contraddicono mai. Filtro per docSlug invece di usare la ricerca: qui il documento è noto.
  const sections = (await listInfoDocs()).filter((s) => s.docSlug === "referti");
  const title = sections[0]?.docTitle ?? "Referti";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        Tempi di consegna, ritiro allo sportello, delega a un&apos;altra persona e invio in PDF. Sono informazioni
        organizzative: il contenuto del referto lo commenta il medico.
      </p>

      <div className="bg-enamel-soft/60 mt-8 flex gap-4 rounded-lg border p-5">
        <ClockIcon className="text-enamel mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <h2 className="font-display text-xl leading-none">Sportello referti, piano 0</h2>
          <p className="mt-2 leading-relaxed">{clinica.orariRitiroReferti}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Telefono dedicato:{" "}
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
        <p className="mt-10">Le informazioni sui referti non sono disponibili in questo momento.</p>
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
        Altre informazioni pratiche — orari, pagamenti, documenti da portare — sono in{" "}
        <Link href="/informazioni" className="text-enamel underline decoration-dotted underline-offset-4">
          Informazioni
        </Link>
        . Per trovare l&apos;appuntamento a cui si riferisce un referto serve il codice e l&apos;email:{" "}
        <Link href="/prenotazioni" className="text-enamel underline decoration-dotted underline-offset-4">
          Le mie prenotazioni
        </Link>
        .
      </p>
    </div>
  );
}
