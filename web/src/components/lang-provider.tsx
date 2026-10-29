"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

import { i18n, stripLang, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>("it");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const lang = useContext(LangContext);
  return useMemo(() => i18n(lang), [lang]);
}

// Link to the same page in the other language.
export function LangSwitch({ className }: { className?: string }) {
  const { lang } = useI18n();
  const base = stripLang(usePathname() ?? "/");
  const target = lang === "en" ? base : base === "/" ? "/en" : `/en${base}`;
  return (
    <Link href={target} hrefLang={lang === "en" ? "it" : "en"} lang={lang === "en" ? "it" : "en"} className={className}>
      {lang === "en" ? "Italiano" : "English"}
    </Link>
  );
}
