import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AskChip, AssistantPageContext } from "@/components/assistant/ask";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductArt } from "@/components/shop/product-art";
import { Rating } from "@/components/shop/rating";
import { getCategory, getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/prodotti/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? pageMeta(`/prodotti/${product.slug}`, { title: product.name, description: product.summary }) : {};
}

function questionsFor(category: string, name: string) {
  switch (category) {
    case "macchine-espresso":
      return [`Che macinacaffè abbino alla ${name}?`, `La ${name} va bene per il cappuccino?`, `Confronta la ${name} con un'alternativa simile`];
    case "macinacaffe":
      return [`Il ${name} va bene per l'espresso?`, `Con quale macchina lo abbino?`];
    case "caffe":
      return [`Con che metodo rende meglio il caffè ${name}?`, `Come conservo il caffè dopo averlo aperto?`];
    case "moka-e-filtro":
      return [`Come si usa: ${name}?`, `Che macinatura serve per ${name}?`];
    default:
      return [`A cosa serve questo accessorio (${name})?`, `Con quali macchine è compatibile?`];
  }
}

export default async function ProductPage({ params }: PageProps<"/prodotti/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const category = await getCategory(product.categorySlug);
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <AssistantPageContext path={`/prodotti/${product.slug}`} productSlug={product.slug} productName={product.name} />
      <nav aria-label="Percorso" className="text-muted-foreground text-sm">
        <Link href="/prodotti" className="hover:text-foreground">Prodotti</Link>
        {category && (
          <>
            {" / "}
            <Link href={`/prodotti?categoria=${category.slug}`} className="hover:text-foreground">{category.name}</Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductArt art={product.art} color={product.color} title={product.name} className="rounded-2xl" />
        <div>
          <p className="text-muted-foreground">{product.brand}</p>
          <h1 className="font-display mt-1 text-5xl leading-tight">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewsCount} />
          </div>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="price text-3xl font-semibold">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && <s className="text-muted-foreground">{formatPrice(product.compareAtCents)}</s>}
          </p>
          <p className="mt-1 text-sm">
            {inStock ? (product.stock <= 5 ? `Solo ${product.stock} disponibili` : "Disponibile, spedito in 24 ore") : "Esaurito"}
          </p>
          <p className="mt-5 text-lg">{product.summary}</p>
          <AddToCartButton slug={product.slug} inStock={inStock} size="lg" className="mt-6 w-full sm:w-auto" />

          <div className="bg-enamel-soft mt-8 rounded-xl p-5">
            <p className="font-semibold">Hai un dubbio su questo prodotto?</p>
            <p className="text-muted-foreground text-sm">Il Barista sa che stai guardando la {product.name}.</p>
            <ul className="mt-3 flex flex-col gap-2">
              {questionsFor(product.categorySlug, product.name).map((q) => (
                <li key={q}>
                  <AskChip question={q} className="w-full rounded-md bg-white" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <section aria-labelledby="descrizione">
          <h2 id="descrizione" className="font-display text-3xl">Descrizione</h2>
          <p className="mt-4 max-w-prose leading-relaxed">{product.description}</p>
        </section>
        <section aria-labelledby="scheda">
          <h2 id="scheda" className="font-display text-3xl">Scheda tecnica</h2>
          <dl className="mt-4 divide-y border-y">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
