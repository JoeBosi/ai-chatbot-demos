"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { useCart } from "@/components/shop/cart-provider";
import { useI18n } from "@/components/lang-provider";
import { ProductArt } from "@/components/shop/product-art";
import { productsEn } from "@/data/en/catalog";
import { Button } from "@/components/ui/button";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartLines({ lines }: { lines: CartLine[] }) {
  const { update } = useCart();
  const { t, href, lang } = useI18n();
  const nameOf = (l: CartLine) => (lang === "en" && productsEn[l.slug]?.name) || l.name;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (slug: string, quantity: number) =>
    start(async () => {
      setError(await update(slug, quantity, "set"));
    });

  return (
    <>
      {error && (
        <p role="alert" className="text-destructive mb-3 text-sm">
          {error}
        </p>
      )}
      <ul className="divide-y border-y" aria-busy={pending}>
        {lines.map((l) => (
          <li key={l.slug} className="flex gap-4 py-4">
            <Link href={href(`/prodotti/${l.slug}`)} className="w-24 shrink-0 overflow-hidden rounded-md">
              <ProductArt art={l.art} color={l.color} title={nameOf(l)} />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">{l.brand}</p>
                  <Link href={href(`/prodotti/${l.slug}`)} className="font-semibold hover:underline">
                    {nameOf(l)}
                  </Link>
                </div>
                <p className="price font-semibold tabular-nums">{formatPrice(l.lineTotalCents, lang)}</p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-3">
                <Button size="icon-sm" variant="outline" disabled={pending} onClick={() => change(l.slug, l.quantity - 1)} aria-label={t(`Togli un ${l.name}`, `Remove one ${nameOf(l)}`)}>
                  <MinusIcon />
                </Button>
                <span className="w-6 text-center tabular-nums" aria-label={t("Quantità", "Quantity")}>
                  {l.quantity}
                </span>
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={pending || l.quantity >= Math.min(l.stock, 10)}
                  onClick={() => change(l.slug, l.quantity + 1)}
                  aria-label={t(`Aggiungi un ${l.name}`, `Add one ${nameOf(l)}`)}
                >
                  <PlusIcon />
                </Button>
                <Button size="sm" variant="ghost" className="ml-auto" disabled={pending} onClick={() => change(l.slug, 0)}>
                  <Trash2Icon />
                  {t("Rimuovi", "Remove")}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
