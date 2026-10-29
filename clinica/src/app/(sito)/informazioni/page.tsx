import type { Metadata } from "next";
import Link from "next/link";

import { infoSectionsEn } from "@/data/en/localize";
import { listInfoDocs } from "@/lib/clinica";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/informazioni", {
  it: {
    title: "Informazioni",
    description:
      "Orari, pagamenti, documenti, preparazione agli esami, accessibilità e privacy: tutte le pagine informative.",
  },
  en: {
    title: "Information",
    description:
      "Hours, payments, documents, test preparation, accessibility and privacy: all the information pages.",
  },
});

export default async function InformazioniPage() {
  const { t, href, lang } = await getI18n();
  // Italian from the database; English from the translated pages, in the same order.
  const rows = lang === "en" ? infoSectionsEn().sort((a, b) => a.docSlug.localeCompare(b.docSlug)) : await listInfoDocs();

  // Le righe arrivano già ordinate per documento e posizione: basta raggrupparle.
  const docs: { slug: string; title: string; sections: typeof rows }[] = [];
  for (const row of rows) {
    const last = docs.at(-1);
    if (last?.slug === row.docSlug) last.sections.push(row);
    else docs.push({ slug: row.docSlug, title: row.docTitle, sections: [row] });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("Informazioni", "Information")}</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        {t(
          "Tutto quello che serve sapere prima di venire: orari, pagamenti, documenti, preparazione agli esami, accessibilità. Sono le stesse pagine che consulta l'assistente.",
          "Everything you need to know before coming: hours, payments, documents, test preparation, accessibility. These are the same pages the assistant reads (in their Italian original).",
        )}
      </p>

      <nav aria-labelledby="indice" className="bg-card mt-8 rounded-lg border p-5">
        <h2 id="indice" className="font-display text-xl leading-none">
          {t("Indice", "Contents")}
        </h2>
        <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <a href={`#${doc.slug}`} className="text-enamel underline decoration-dotted underline-offset-4">
                {doc.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-14">
        {docs.map((doc) => (
          <section key={doc.slug} id={doc.slug} aria-labelledby={`${doc.slug}-titolo`} className="scroll-mt-28">
            <h2 id={`${doc.slug}-titolo`} className="font-display border-b pb-2 text-3xl">
              {doc.title}
            </h2>
            <div className="mt-5 space-y-6">
              {doc.sections.map((s) => (
                <div key={`${s.docSlug}-${s.position}`}>
                  <h3 className="font-display text-xl">{s.section}</h3>
                  <p className="mt-1 max-w-prose leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
            <a href="#indice" className="text-muted-foreground mt-5 inline-block text-xs underline decoration-dotted underline-offset-4">
              {t("Torna all'indice", "Back to contents")}
            </a>
          </section>
        ))}
      </div>

      <p className="text-muted-foreground mt-12 text-sm leading-relaxed">
        {t("Queste pagine descrivono una struttura inventata.", "These pages describe a made-up clinic.")}{" "}
        <Link href={href("/come-funziona")} className="text-enamel underline decoration-dotted underline-offset-4">
          {t("Com'è fatta questa demo", "How this demo works")}
        </Link>
      </p>
    </div>
  );
}
