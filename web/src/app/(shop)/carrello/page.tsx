import type { Metadata } from "next";
import Link from "next/link";

import { AskChip } from "@/components/assistant/ask";
import { CartLines } from "@/components/shop/cart-lines";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/cart";
import { getI18n } from "@/lib/i18n-server";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/format";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/carrello", {
  it: {
    title: "Carrello",
    description:
      "Il carrello del negozio dimostrativo: l'assistente può aggiungere e togliere prodotti su richiesta.",
  },
  en: {
    title: "Cart",
    description:
      "The demo shop's cart: the assistant can add and remove products when you ask.",
  },
});

export default async function CartPage() {
  const [cart, { t, href, lang }] = await Promise.all([getCart(), getI18n()]);

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 text-center">
        <h1 className="font-display text-5xl">{t("Il carrello è vuoto", "Your cart is empty")}</h1>
        <p className="text-muted-foreground mt-3">
          {t(
            "Sfoglia il catalogo o chiedi al Barista di consigliarti qualcosa: può anche aggiungerlo qui per te.",
            "Browse the catalogue or ask the Barista for a suggestion: it can even add it here for you.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={href("/prodotti")}>{t("Sfoglia i prodotti", "Browse the products")}</Link>
          </Button>
          <AskChip
            question={t("Consigliami un regalo sotto i 50 euro per chi ama il caffè", "Suggest a gift under 50 euros for a coffee lover")}
            label={t("Chiedi un consiglio", "Ask for advice")}
          />
        </div>
      </div>
    );
  }

  const missingForFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">{t("Carrello", "Cart")}</h1>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-label={t("Articoli", "Items")}>
          <CartLines lines={cart.lines} />
        </section>
        <section aria-labelledby="riepilogo" className="h-fit rounded-xl border bg-white p-6">
          <h2 id="riepilogo" className="font-display text-3xl">{t("Riepilogo", "Summary")}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>{t("Subtotale", "Subtotal")}</dt>
              <dd className="tabular-nums">{formatPrice(cart.subtotalCents, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("Spedizione", "Shipping")}</dt>
              <dd className="tabular-nums">{cart.shippingCents === 0 ? t("Gratuita", "Free") : formatPrice(cart.shippingCents, lang)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>{t("Totale", "Total")}</dt>
              <dd className="price">{formatPrice(cart.totalCents, lang)}</dd>
            </div>
          </dl>
          {missingForFree > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">
              {t(`Aggiungi ${formatPrice(missingForFree)} per la spedizione gratuita.`, `Add ${formatPrice(missingForFree, lang)} for free shipping.`)}
            </p>
          )}
          <CheckoutForm />
        </section>
      </div>
    </div>
  );
}
