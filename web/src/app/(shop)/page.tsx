import type { Metadata } from "next";
import Link from "next/link";

import { AskBox, AskChip } from "@/components/assistant/ask";
import { ProductArt } from "@/components/shop/product-art";
import { ProductCard } from "@/components/shop/product-card";
import { categories } from "@/data/catalog";
import { searchProducts } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/", {
  title: { absolute: "Crema & Ferro — attrezzatura per il caffè (demo)" },
  description:
    "Negozio dimostrativo con un assistente AI per gli acquisti: consigli sui prodotti, carrello, stato degli ordini e assistenza.",
});

const categoryArt: Record<string, { art: string; color: string }> = {
  "macchine-espresso": { art: "espresso", color: "#1f5c4a" },
  macinacaffe: { art: "grinder", color: "#8c9396" },
  caffe: { art: "beans", color: "#7a4b2a" },
  "moka-e-filtro": { art: "moka", color: "#b9c0c2" },
  accessori: { art: "scale", color: "#2b2f33" },
};

const questionGroups = [
  {
    title: "Scegliere",
    questions: [
      "Ho 400 € e bevo soprattutto cappuccini: cosa mi consigli?",
      "Un caffè fruttato per il filtro?",
    ],
  },
  {
    title: "Confrontare",
    questions: ["Differenze tra Brenta PID e Brenta Duo?", "Macinaverde Micro o Brenta Piatta 64 per l'espresso?"],
  },
  {
    title: "Ordini",
    questions: ["Dov'è l'ordine CF-10482? Email demo@cremaeferro.it", "Aggiungi al carrello una Moka Inox 6 tazze"],
  },
  {
    title: "Assistenza",
    questions: ["Posso restituire una macchina già usata?", "La mia macchina perde acqua dal gruppo, cosa faccio?"],
  },
];

export default async function Home() {
  const bestSellers = await searchProducts({ sort: "rating", inStockOnly: true, limit: 8 });

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-[1.15fr_1fr] md:pt-16">
        <div>
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-balance md:text-7xl">
            Il caffè di casa, come al banco.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg">
            Macchine, macinacaffè e tostature fresche. Se non sai da dove partire, chiedi al Barista: conosce il catalogo, i tuoi ordini e le regole del negozio.
          </p>
          <AskBox
            className="mt-8 max-w-xl"
            placeholder="Chiedi al Barista…"
            suggestions={["Mi serve un macinacaffè?", "Spedite in Sicilia?", "Qual è il caffè più dolce?"]}
          />
        </div>
        <div className="bg-enamel-deep relative overflow-hidden rounded-2xl p-6 text-white md:p-8">
          <ProductArt art="espresso-dual" color="#1f5c4a" className="rounded-xl bg-white/95" title="Macchina espresso a doppia caldaia" />
          <figure className="mt-5 space-y-3 text-sm">
            <figcaption className="sr-only">Esempio di conversazione con il Barista</figcaption>
            <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-white/15 px-3 py-2">Faccio tre cappuccini al giorno, la Vapora Mini basta?</p>
            <p className="w-fit max-w-[90%] rounded-lg rounded-bl-sm bg-white px-3 py-2 text-ink">
              Per il latte la sua lancia panarello funziona, ma non fa latte art. Se vuoi una schiuma setosa guarda la Vapora Classica: 349 €, lancia a doppio foro.
            </p>
          </figure>
        </div>
      </section>

      <section aria-labelledby="categorie" className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 id="categorie" className="sr-only">
            Categorie
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/prodotti?categoria=${c.slug}`} className="group flex items-center gap-3">
                  <div className="w-16 shrink-0 overflow-hidden rounded-md">
                    <ProductArt art={categoryArt[c.slug].art} color={categoryArt[c.slug].color} title={c.name} />
                  </div>
                  <div>
                    <p className="group-hover:text-enamel font-semibold">{c.name}</p>
                    <p className="text-muted-foreground line-clamp-2 text-xs">{c.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="piu-scelti" className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 id="piu-scelti" className="font-display text-4xl">
            I più apprezzati
          </h2>
          <Link href="/prodotti" className="text-enamel text-sm font-medium underline-offset-4 hover:underline">
            Tutto il catalogo
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="domande" className="mx-auto mt-20 max-w-6xl px-4">
        <div className="bg-enamel-soft rounded-2xl px-6 py-10 md:px-10">
          <h2 id="domande" className="font-display max-w-2xl text-4xl leading-tight">
            Chiedi quello che chiederesti al banco
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Il Barista cerca nel catalogo, confronta, aggiunge al carrello, controlla gli ordini e apre richieste di assistenza. Prova una di queste domande.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {questionGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-enamel-deep mb-3 font-semibold">{g.title}</h3>
                <ul className="flex flex-col gap-2">
                  {g.questions.map((q) => (
                    <li key={q}>
                      <AskChip question={q} className="w-full rounded-md bg-white" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Servizi" className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
        {[
          { title: "Spedizione gratuita da 49 €", text: "Consegna in 24-48 ore nel Centro-Nord, 48-72 ore al Sud e nelle isole." },
          { title: "30 giorni per il reso", text: "Anche con la confezione aperta, purché il prodotto sia integro." },
          { title: "Garanzia fino a 3 anni", text: "Ritiro e riconsegna gratuiti per le riparazioni in garanzia." },
        ].map((s) => (
          <Link key={s.title} href="/assistenza" className="group border-t-2 border-ink pt-4">
            <p className="group-hover:text-enamel font-semibold">{s.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{s.text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
