import Link from "next/link";

import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductArt } from "@/components/shop/product-art";
import { Rating } from "@/components/shop/rating";
import type { ProductCard as ProductCardData } from "@/lib/catalog";
import { localizeProduct } from "@/data/en/catalog";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";

export async function ProductCard({ product: original }: { product: ProductCardData }) {
  const { t, href, lang } = await getI18n();
  const product = localizeProduct(lang, original);
  const inStock = product.stock > 0;
  return (
    <article className="group flex flex-col">
      <Link href={href(`/prodotti/${product.slug}`)} className="block overflow-hidden rounded-md">
        <ProductArt art={product.art} color={product.color} title={product.name} className="transition-transform duration-300 group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <p className="text-muted-foreground text-sm">{product.brand}</p>
        <h3 className="text-lg leading-snug font-semibold">
          <Link href={href(`/prodotti/${product.slug}`)} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{product.summary}</p>
        <Rating value={product.rating} count={product.reviewsCount} lang={lang} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="flex items-baseline gap-2">
            <span className="price text-xl font-semibold">{formatPrice(product.priceCents, lang)}</span>
            {product.compareAtCents && (
              <s className="text-muted-foreground text-sm">{formatPrice(product.compareAtCents, lang)}</s>
            )}
          </p>
          <AddToCartButton slug={product.slug} inStock={inStock} size="sm" label={t("Aggiungi", "Add")} />
        </div>
      </div>
    </article>
  );
}
