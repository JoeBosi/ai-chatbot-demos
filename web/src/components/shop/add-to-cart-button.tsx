"use client";

import { CheckIcon, ShoppingBagIcon } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/lang-provider";
import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  slug,
  inStock,
  size = "default",
  className,
  label,
}: {
  slug: string;
  inStock: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
  label?: string;
}) {
  const { update } = useCart();
  const { t } = useI18n();
  const [pending, start] = useTransition();
  const [state, setState] = useState<"idle" | "added" | string>("idle");

  if (!inStock) {
    return (
      <Button size={size} variant="secondary" disabled className={className}>
        Esaurito
      </Button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        size={size}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const error = await update(slug, 1, "add");
            setState(error ?? "added");
            if (!error) setTimeout(() => setState("idle"), 2200);
          })
        }
      >
        {state === "added" ? <CheckIcon /> : <ShoppingBagIcon />}
        {state === "added" ? t("Aggiunto", "Added") : (label ?? t("Aggiungi al carrello", "Add to cart"))}
      </Button>
      {state !== "idle" && state !== "added" && (
        <p role="alert" className="text-destructive text-xs">
          {state}
        </p>
      )}
    </div>
  );
}
