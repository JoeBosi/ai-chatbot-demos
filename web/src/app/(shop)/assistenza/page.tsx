import type { Metadata } from "next";

import { AskBox } from "@/components/assistant/ask";
import { helpDocs } from "@/data/help";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/assistenza", {
  title: "Centro assistenza",
  description:
    "Spedizioni, resi, pagamenti e garanzia del negozio dimostrativo Crema & Ferro, le stesse informazioni che usa l'assistente AI.",
});

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">Centro assistenza</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Queste sono le stesse pagine che il Barista consulta per risponderti: se preferisci, chiedi a lui.
      </p>
      <AskBox className="mt-6 max-w-xl" placeholder="Es. quanto costa la spedizione in Sardegna?" suggestions={["Come faccio un reso?", "Pagate in 3 rate?"]} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Argomenti" className="lg:sticky lg:top-32 lg:h-fit">
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
