"use client";

import { MenuIcon, PhoneIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LangSwitch, useI18n } from "@/components/lang-provider";
import { clinica } from "@/data/clinica";
import { cn } from "@/lib/utils";

const main = [
  { href: "/specialita", it: "Specialità", en: "Specialties" },
  { href: "/prestazioni", it: "Visite ed esami", en: "Visits and tests" },
  { href: "/medici", it: "Medici", en: "Doctors" },
  { href: "/prenota", it: "Prenota", en: "Book" },
];

const secondary = [
  { href: "/prenotazioni", it: "Le mie prenotazioni", en: "My bookings" },
  { href: "/referti", it: "Referti", en: "Reports" },
  { href: "/informazioni", it: "Informazioni", en: "Information" },
  { href: "/dove-siamo", it: "Dove siamo", en: "Where we are" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { t, href, lang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="bg-enamel-deep px-4 py-1.5 text-center text-xs text-white">
        <strong>{t("Esempio didattico", "Teaching example")}</strong>
        {t(": una clinica inventata per mostrare un assistente che prenota.", ": a made-up clinic that shows an assistant that books appointments.")}{" "}
        <Link href={href("/come-funziona")} className="underline underline-offset-2">
          {t("Com'è fatta questa demo", "How this demo works")}
        </Link>
        {" · "}
        <a href={`https://chat-bot.giuseppebosi.com${lang === "en" ? "/en" : ""}`} className="font-semibold underline underline-offset-2">
          {t("Prova la demo del negozio →", "Try the shop demo →")}
        </a>
        {" · "}
        <LangSwitch className="font-semibold underline underline-offset-2" />
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href={href("/")} className="shrink-0 leading-none" onClick={() => setMenuOpen(false)}>
          <span className="font-display block text-2xl leading-none tracking-tight">Vallenova</span>
          <span className="text-muted-foreground text-[11px] tracking-wide uppercase">{t("Poliambulatorio", "Outpatient clinic")}</span>
        </Link>

        <nav aria-label={t("Sezioni principali", "Main sections")} className="hidden flex-1 items-center gap-5 text-sm md:flex">
          {main.map((item) => (
            <Link
              key={item.href}
              href={href(item.href)}
              className={cn(
                "hover:text-enamel whitespace-nowrap transition-colors",
                pathname.startsWith(href(item.href)) && "text-enamel font-semibold",
              )}
            >
              {item[lang]}
            </Link>
          ))}
          <span className="bg-border h-4 w-px" aria-hidden />
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={href(item.href)}
              className={cn("text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors", pathname === href(item.href) && "text-foreground")}
            >
              {item[lang]}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${clinica.telefono.replace(/\s/g, "")}`}
          className="text-enamel ml-auto hidden items-center gap-1.5 text-sm font-semibold lg:flex"
        >
          <PhoneIcon className="size-4" aria-hidden /> {clinica.telefono}
        </a>

        <LangSwitch className="hover:bg-enamel-soft ml-auto rounded-full border px-3 py-1.5 text-sm font-medium lg:ml-0" />

        <button
          type="button"
          className="md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("Chiudi il menu", "Close the menu") : t("Apri il menu", "Open the menu")}
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
                <Link href={href(item.href)} className="hover:bg-enamel-soft block rounded px-2 py-2" onClick={() => setMenuOpen(false)}>
                  {item[lang]}
                </Link>
              </li>
            ))}
            <li>
              <a href={`tel:${clinica.telefono.replace(/\s/g, "")}`} className="text-enamel block px-2 py-2 font-semibold">
                {t("Chiama", "Call")} {clinica.telefono}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
