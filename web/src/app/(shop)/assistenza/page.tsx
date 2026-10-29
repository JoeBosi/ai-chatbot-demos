import type { Metadata } from "next";

import { AskBox } from "@/components/assistant/ask";
import { helpDocsEn } from "@/data/en/help";
import { helpDocs as helpDocsIt } from "@/data/help";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/assistenza", {
  it: {
    title: "Centro assistenza",
    description:
      "Spedizioni, resi, pagamenti e garanzia del negozio dimostrativo Crema & Ferro, le stesse informazioni che usa l'assistente AI.",
  },
  en: {
    title: "Help centre",
    description:
      "Shipping, returns, payments and warranty of the Crema & Ferro demo shop: the same information the AI assistant uses.",
  },
});

export default async function HelpPage() {
  const { t, lang } = await getI18n();
  const helpDocs = lang === "en" ? helpDocsEn : helpDocsIt;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">{t("Centro assistenza", "Help centre")}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        {t(
          "Queste sono le stesse pagine che il Barista consulta per risponderti: se preferisci, chiedi a lui.",
          "These are the same pages the Barista reads to answer you: if you prefer, just ask.",
        )}
      </p>
      <AskBox
        className="mt-6 max-w-xl"
        placeholder={t("Es. quanto costa la spedizione in Sardegna?", "E.g. how much is shipping to Sardinia?")}
        suggestions={lang === "en" ? ["How do I make a return?", "Can I pay in 3 instalments?"] : ["Come faccio un reso?", "Pagate in 3 rate?"]}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[14rem_1fr]">
        <nav aria-label={t("Argomenti", "Topics")} className="lg:sticky lg:top-32 lg:h-fit">
          <ul className="flex flex-wrap gap-2 text-sm lg:flex-col lg:gap-1">
            {helpDocs.map((d) => (
              <li key={d.slug}>
                <a href={`#${d.slug}`} className="hover:text-enamel block rounded py-1 lg:px-0">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14">
          {helpDocs.map((doc) => (
            <section key={doc.slug} id={doc.slug} aria-labelledby={`${doc.slug}-title`}>
              <h2 id={`${doc.slug}-title`} className="font-display text-3xl">
                {doc.title}
              </h2>
              <div className="mt-4 max-w-prose space-y-5">
                {doc.body
                  .split(/^## /m)
                  .filter(Boolean)
                  .map((block) => {
                    const [heading, ...rest] = block.split("\n");
                    return (
                      <div key={heading}>
                        <h3 className="font-semibold">{heading}</h3>
                        <p className="mt-1 leading-relaxed">{rest.join(" ").trim()}</p>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
