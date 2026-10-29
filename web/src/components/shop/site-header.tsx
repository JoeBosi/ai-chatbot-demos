"use client";

import { MenuIcon, ShoppingBagIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/prodotti?categoria=macchine-espresso", label: "Macchine" },
  { href: "/prodotti?categoria=macinacaffe", label: "Macinacaffè" },
  { href: "/prodotti?categoria=caffe", label: "Caffè" },
  { href: "/prodotti?categoria=moka-e-filtro", label: "Moka e filtro" },
  { href: "/prodotti?categoria=accessori", label: "Accessori" },
];

const service = [
  { href: "/ordini", label: "I miei ordini" },
  { href: "/assistenza", label: "Assistenza" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/manutenzione", label: "Manutenzione" },
  { href: "/come-funziona", label: "Come funziona la demo" },
];

export function SiteHeader() {
  const { cart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 sticky top-0 z-30 border-b backdrop-blur">
      <p className="bg-enamel-deep px-4 py-1.5 text-center text-xs text-white/85">
        Negozio dimostrativo: prodotti, prezzi e ordini sono inventati e nessun pagamento è reale.{" "}
        <Link href="/come-funziona" className="underline underline-offset-2">
          Come è fatto
        </Link>
        {" · "}
        <a href="https://chatbot-clinica.giuseppebosi.com" className="font-semibold underline underline-offset-2">
          Prova la demo della clinica →
        </a>
      </p>
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-display shrink-0 text-2xl leading-none tracking-tight" onClick={() => setMenuOpen(false)}>
          Crema <span aria-hidden>&amp;</span>
          <span className="sr-only">e</span> Ferro
        </Link>
        <nav aria-label="Categorie" className="hidden flex-1 items-center gap-5 text-sm lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-enamel whitespace-nowrap transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Servizi" className="text-muted-foreground ml-auto hidden items-center gap-5 text-sm md:flex">
          {service.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className={cn("hover:text-foreground transition-colors", pathname === item.href && "text-foreground")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/carrello"
          className="hover:bg-enamel-soft relative ml-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm md:ml-0"
          aria-label={`Carrello, ${cart.itemCount} articoli`}
        >
          <ShoppingBagIcon className="size-4" aria-hidden />
          <span className="tabular-nums">{cart.itemCount}</span>
        </Link>
        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>
      {menuOpen && (
        <nav id="menu-mobile" aria-label="Menu" className="border-t px-4 py-3 lg:hidden">
          <ul className="grid gap-1">
            {[...nav, ...service].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:bg-enamel-soft block rounded px-2 py-2" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
