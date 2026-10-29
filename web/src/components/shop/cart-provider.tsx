"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { useApiHeaders } from "@/components/assistant/embed-context";
import type { Cart } from "@/lib/cart";

type CartContextValue = {
  cart: Cart;
  refresh: () => Promise<void>;
  update: (slug: string, quantity: number, mode: "add" | "set") => Promise<string | null>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ initialCart, children }: { initialCart: Cart; children: ReactNode }) {
  const [cart, setCart] = useState(initialCart);
  const [serverCart, setServerCart] = useState(initialCart);
  const router = useRouter();
  const headers = useApiHeaders();

  // The server layout is the source of truth after navigations and refreshes (e.g. after checkout).
  if (initialCart !== serverCart) {
    setServerCart(initialCart);
    setCart(initialCart);
  }

  const refresh = useCallback(async () => {
    const res = await fetch("/api/cart", { cache: "no-store", headers });
    if (res.ok) setCart(await res.json());
    router.refresh();
  }, [router, headers]);

  const update = useCallback(
    async (slug: string, quantity: number, mode: "add" | "set") => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ slug, quantity, mode }),
      });
      const data = await res.json();
      if (!res.ok) return (data.error as string) ?? "Operazione non riuscita";
      setCart(data);
      router.refresh();
      return null;
    },
    [router, headers],
  );

  const value = useMemo(() => ({ cart, refresh, update }), [cart, refresh, update]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
