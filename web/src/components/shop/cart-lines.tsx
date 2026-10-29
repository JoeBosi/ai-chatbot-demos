"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { useCart } from "@/components/shop/cart-provider";
import { ProductArt } from "@/components/shop/product-art";
import { Button } from "@/components/ui/button";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartLines({ lines }: { lines: CartLine[] }) {
  const { update } = useCart();
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
            <Link href={`/prodotti/${l.slug}`} className="w-24 shrink-0 overflow-hidden rounded-md">
              <ProductArt art={l.art} color={l.color} title={l.name} />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">{l.brand}</p>
                  <Link href={`/prodotti/${l.slug}`} className="font-semibold hover:underline">
                    {l.name}
                  </Link>
                </div>
                <p className="price font-semibold tabular-nums">{formatPrice(l.lineTotalCents)}</p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-3">
                <Button size="icon-sm" variant="outline" disabled={pending} onClick={() => change(l.slug, l.quantity - 1)} aria-label={`Togli un ${l.name}`}>
                  <MinusIcon />
                </Button>
                <span className="w-6 text-center tabular-nums" aria-label="Quantità">
                  {l.quantity}
                </span>
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={pending || l.quantity >= Math.min(l.stock, 10)}
                  onClick={() => change(l.slug, l.quantity + 1)}
                  aria-label={`Aggiungi un ${l.name}`}
                >
                  <PlusIcon />
                </Button>
                <Button size="sm" variant="ghost" className="ml-auto" disabled={pending} onClick={() => change(l.slug, 0)}>
                  <Trash2Icon />
                  Rimuovi
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
