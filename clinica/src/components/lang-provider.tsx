"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useId, useMemo } from "react";

import { cn } from "@/lib/utils";
import { i18n, stripLang, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>("it");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const lang = useContext(LangContext);
  return useMemo(() => i18n(lang), [lang]);
}

// Link to the same page in the other language, with the flag as on www.giuseppebosi.com:
// UK flag on Italian pages, Italian flag on English pages, then the language code.
export function LangSwitch({ className }: { className?: string }) {
  const { lang } = useI18n();
  const id = useId();
  const base = stripLang(usePathname() ?? "/");
  const target = lang === "en" ? base : base === "/" ? "/en" : `/en${base}`;
  const other = lang === "en" ? "it" : "en";
  return (
    <Link
      href={target}
      hrefLang={other}
      lang={other}
      title={lang === "en" ? "Versione italiana" : "English version"}
      className={cn("text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold", className)}
    >
      {lang === "en" ? (
        <svg viewBox="0 0 3 2" width="17" height="11" aria-hidden className="rounded-[2px] shadow-[0_0_0_1px_#0002]">
          <path fill="#009246" d="M0 0h1v2H0z" />
          <path fill="#fff" d="M1 0h1v2H1z" />
          <path fill="#CE2B37" d="M2 0h1v2H2z" />
        </svg>
      ) : (
        <svg viewBox="0 0 60 30" width="22" height="11" aria-hidden className="rounded-[2px] shadow-[0_0_0_1px_#0002]">
          <clipPath id={`${id}g`}>
            <path d="M0,0v30h60V0z" />
          </clipPath>
          <clipPath id={`${id}h`}>
            <path d="M30,15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <g clipPath={`url(#${id}g)`}>
            <path d="M0,0v30h60V0z" fill="#012169" />
            <path d="M0,0 60,30M60,0 0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 60,30M60,0 0,30" clipPath={`url(#${id}h)`} stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0v30M0,15h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0v30M0,15h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      )}
      {other.toUpperCase()}
    </Link>
  );
}
