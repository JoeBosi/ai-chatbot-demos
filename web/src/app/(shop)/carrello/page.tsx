import type { Metadata } from "next";
import Link from "next/link";

import { AskChip } from "@/components/assistant/ask";
import { CartLines } from "@/components/shop/cart-lines";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/carrello", {
  title: "Carrello",
  description:
    "Il carrello del negozio dimostrativo: l'assistente può aggiungere e togliere prodotti su richiesta.",
});

export default async function CartPage() {
  const cart = await getCart();

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 text-center">
        <h1 className="font-display text-5xl">Il carrello è vuoto</h1>
        <p className="text-muted-foreground mt-3">Sfoglia il catalogo o chiedi al Barista di consigliarti qualcosa: può anche aggiungerlo qui per te.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/prodotti">Sfoglia i prodotti</Link>
          </Button>
          <AskChip question="Consigliami un regalo sotto i 50 euro per chi ama il caffè" label="Chiedi un consiglio" />
        </div>
      </div>
    );
  }

  const missingForFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-5xl">Carrello</h1>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-label="Articoli">
          <CartLines lines={cart.lines} />
        </section>
        <section aria-labelledby="riepilogo" className="h-fit rounded-xl border bg-white p-6">
          <h2 id="riepilogo" className="font-display text-3xl">Riepilogo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotale</dt>
              <dd className="tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Spedizione</dt>
              <dd className="tabular-nums">{cart.shippingCents === 0 ? "Gratuita" : formatPrice(cart.shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Totale</dt>
              <dd className="price">{formatPrice(cart.totalCents)}</dd>
            </div>
          </dl>
          {missingForFree > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">Aggiungi {formatPrice(missingForFree)} per la spedizione gratuita.</p>
          )}
          <CheckoutForm />
        </section>
      </div>
    </div>
  );
}
