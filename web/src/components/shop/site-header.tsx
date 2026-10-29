"use client";

import { MenuIcon, ShoppingBagIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LangSwitch, useI18n } from "@/components/lang-provider";
import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/prodotti?categoria=macchine-espresso", it: "Macchine", en: "Machines" },
  { href: "/prodotti?categoria=macinacaffe", it: "Macinacaffè", en: "Grinders" },
  { href: "/prodotti?categoria=caffe", it: "Caffè", en: "Coffee" },
  { href: "/prodotti?categoria=moka-e-filtro", it: "Moka e filtro", en: "Moka and filter" },
  { href: "/prodotti?categoria=accessori", it: "Accessori", en: "Accessories" },
];

const service = [
  { href: "/ordini", it: "I miei ordini", en: "My orders" },
  { href: "/assistenza", it: "Assistenza", en: "Support" },
  { href: "/tutorial", it: "Tutorial", en: "Tutorial" },
  { href: "/manutenzione", it: "Manutenzione", en: "Maintenance" },
  { href: "/come-funziona", it: "Come funziona la demo", en: "How this demo works" },
];

export function SiteHeader() {
  const { cart } = useCart();
  const { t, href, lang } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 sticky top-0 z-30 border-b backdrop-blur">
      <p className="bg-enamel-deep px-4 py-1.5 text-center text-xs text-white/85">
        {t(
          "Negozio dimostrativo: prodotti, prezzi e ordini sono inventati e nessun pagamento è reale.",
          "Demo shop: products, prices and orders are made up and no payment is real.",
        )}{" "}
        <Link href={href("/come-funziona")} className="underline underline-offset-2">
          {t("Come è fatto", "How it is built")}
        </Link>
        {" · "}
        <a href={`https://chatbot-clinica.giuseppebosi.com${lang === "en" ? "/en" : ""}`} className="font-semibold underline underline-offset-2">
          {t("Prova la demo della clinica →", "Try the clinic demo →")}
        </a>
        {" · "}
        <LangSwitch className="font-semibold underline underline-offset-2" />
      </p>
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href={href("/")} className="font-display shrink-0 text-2xl leading-none tracking-tight" onClick={() => setMenuOpen(false)}>
          Crema <span aria-hidden>&amp;</span>
          <span className="sr-only">e</span> Ferro
        </Link>
        <nav aria-label={t("Categorie", "Categories")} className="hidden flex-1 items-center gap-5 text-sm lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={href(item.href)} className="hover:text-enamel whitespace-nowrap transition-colors">
              {item[lang]}
            </Link>
          ))}
        </nav>
        <nav aria-label={t("Servizi", "Services")} className="text-muted-foreground ml-auto hidden items-center gap-5 text-sm md:flex">
          {service.slice(0, 2).map((item) => (
            <Link key={item.href} href={href(item.href)} className={cn("hover:text-foreground transition-colors", pathname === href(item.href) && "text-foreground")}>
              {item[lang]}
            </Link>
          ))}
        </nav>
        <LangSwitch className="hover:bg-enamel-soft ml-auto rounded-full border px-3 py-1.5 text-sm font-medium md:ml-0" />
        <Link
          href={href("/carrello")}
          className="hover:bg-enamel-soft relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
          aria-label={t(`Carrello, ${cart.itemCount} articoli`, `Cart, ${cart.itemCount} items`)}
        >
          <ShoppingBagIcon className="size-4" aria-hidden />
          <span className="tabular-nums">{cart.itemCount}</span>
        </Link>
        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? t("Chiudi il menu", "Close the menu") : t("Apri il menu", "Open the menu")}
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
                <Link href={href(item.href)} className="hover:bg-enamel-soft block rounded px-2 py-2" onClick={() => setMenuOpen(false)}>
                  {item[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
