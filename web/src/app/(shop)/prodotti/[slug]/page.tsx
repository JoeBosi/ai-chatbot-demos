import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AskChip, AssistantPageContext } from "@/components/assistant/ask";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductArt } from "@/components/shop/product-art";
import { Rating } from "@/components/shop/rating";
import { getCategory, getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { localizeCategory, localizeProduct } from "@/data/en/catalog";
import { getI18n, getLang } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/prodotti/[slug]">): Promise<Metadata> {
  const [found, lang] = await Promise.all([getProduct((await params).slug), getLang()]);
  if (!found) return {};
  const product = localizeProduct(lang, found);
  return pageMeta(lang, `/prodotti/${product.slug}`, { title: product.name, description: product.summary });
}

function questionsFor(category: string, name: string, lang: "it" | "en") {
  if (lang === "en") {
    switch (category) {
      case "macchine-espresso":
        return [`Which grinder goes with the ${name}?`, `Is the ${name} good for cappuccino?`, `Compare the ${name} with a similar alternative`];
      case "macinacaffe":
        return [`Is the ${name} good for espresso?`, `Which machine should I pair it with?`];
      case "caffe":
        return [`Which method brings out the best in ${name}?`, `How do I store coffee once it is open?`];
      case "moka-e-filtro":
        return [`How do I use the ${name}?`, `What grind does the ${name} need?`];
      default:
        return [`What is this accessory for (${name})?`, `Which machines does it work with?`];
    }
  }
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
  const [found, { t, href, lang }] = await Promise.all([getProduct(slug), getI18n()]);
  if (!found) notFound();
  const product = localizeProduct(lang, found);
  const itCategory = await getCategory(product.categorySlug);
  const category = itCategory && localizeCategory(lang, itCategory);
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <AssistantPageContext path={href(`/prodotti/${product.slug}`)} productSlug={product.slug} productName={product.name} />
      <nav aria-label={t("Percorso", "Breadcrumb")} className="text-muted-foreground text-sm">
        <Link href={href("/prodotti")} className="hover:text-foreground">{t("Prodotti", "Products")}</Link>
        {category && (
          <>
            {" / "}
            <Link href={href(`/prodotti?categoria=${category.slug}`)} className="hover:text-foreground">{category.name}</Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductArt art={product.art} color={product.color} title={product.name} className="rounded-2xl" />
        <div>
          <p className="text-muted-foreground">{product.brand}</p>
          <h1 className="font-display mt-1 text-5xl leading-tight">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewsCount} lang={lang} />
          </div>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="price text-3xl font-semibold">{formatPrice(product.priceCents, lang)}</span>
            {product.compareAtCents && <s className="text-muted-foreground">{formatPrice(product.compareAtCents, lang)}</s>}
          </p>
          <p className="mt-1 text-sm">
            {inStock
              ? product.stock <= 5
                ? t(`Solo ${product.stock} disponibili`, `Only ${product.stock} left`)
                : t("Disponibile, spedito in 24 ore", "In stock, ships within 24 hours")
              : t("Esaurito", "Sold out")}
          </p>
          <p className="mt-5 text-lg">{product.summary}</p>
          <AddToCartButton slug={product.slug} inStock={inStock} size="lg" className="mt-6 w-full sm:w-auto" />

          <div className="bg-enamel-soft mt-8 rounded-xl p-5">
            <p className="font-semibold">{t("Hai un dubbio su questo prodotto?", "A question about this product?")}</p>
            <p className="text-muted-foreground text-sm">
              {t(`Il Barista sa che stai guardando la ${product.name}.`, `The Barista knows you are looking at the ${product.name}.`)}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {questionsFor(product.categorySlug, product.name, lang).map((q) => (
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
          <h2 id="descrizione" className="font-display text-3xl">{t("Descrizione", "Description")}</h2>
          <p className="mt-4 max-w-prose leading-relaxed">{product.description}</p>
        </section>
        <section aria-labelledby="scheda">
          <h2 id="scheda" className="font-display text-3xl">{t("Scheda tecnica", "Specifications")}</h2>
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
