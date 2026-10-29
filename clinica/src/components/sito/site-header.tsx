"use client";

import { MenuIcon, PhoneIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { clinica } from "@/data/clinica";
import { cn } from "@/lib/utils";

const main = [
  { href: "/specialita", label: "Specialità" },
  { href: "/prestazioni", label: "Visite ed esami" },
  { href: "/medici", label: "Medici" },
  { href: "/prenota", label: "Prenota" },
];

const secondary = [
  { href: "/prenotazioni", label: "Le mie prenotazioni" },
  { href: "/referti", label: "Referti" },
  { href: "/informazioni", label: "Informazioni" },
  { href: "/dove-siamo", label: "Dove siamo" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="bg-enamel-deep px-4 py-1.5 text-center text-xs text-white">
        <strong>Esempio didattico</strong>: una clinica inventata per mostrare un assistente che prenota.{" "}
        <Link href="/come-funziona" className="underline underline-offset-2">
          Com&apos;è fatta questa demo
        </Link>
        {" · "}
        <a href="https://chat-bot.giuseppebosi.com" className="font-semibold underline underline-offset-2">
          Prova la demo del negozio →
        </a>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 leading-none" onClick={() => setMenuOpen(false)}>
          <span className="font-display block text-2xl leading-none tracking-tight">Vallenova</span>
          <span className="text-muted-foreground text-[11px] tracking-wide uppercase">Poliambulatorio</span>
        </Link>

        <nav aria-label="Sezioni principali" className="hidden flex-1 items-center gap-5 text-sm md:flex">
          {main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-enamel whitespace-nowrap transition-colors",
                pathname.startsWith(item.href) && "text-enamel font-semibold",
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="bg-border h-4 w-px" aria-hidden />
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors", pathname === item.href && "text-foreground")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${clinica.telefono.replace(/\s/g, "")}`}
          className="text-enamel ml-auto hidden items-center gap-1.5 text-sm font-semibold md:flex"
        >
          <PhoneIcon className="size-4" aria-hidden /> {clinica.telefono}
        </a>

        <button
          type="button"
          className="ml-auto md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav aria-label="Menu" className="border-t px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1 text-[15px]">
            {[...main, ...secondary].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:bg-enamel-soft block rounded px-2 py-2" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`tel:${clinica.telefono.replace(/\s/g, "")}`} className="text-enamel block px-2 py-2 font-semibold">
                Chiama {clinica.telefono}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
