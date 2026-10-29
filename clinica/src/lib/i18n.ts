// Two languages: Italian at the current URLs, English under /en. The proxy rewrites /en/x to /x and
// passes the language in a request header, so each page exists once and picks its text here.
export type Lang = "it" | "en";
export const LANG_HEADER = "x-lang";

// Path of a page in a language: "/prodotti" → "/en/prodotti" (query strings and anchors kept).
export function localPath(lang: Lang, href: string) {
  if (lang === "it" || !href.startsWith("/") || href.startsWith("/en/") || href === "/en") return href;
  return href === "/" ? "/en" : `/en${href}`;
}

// The same page in the other language, for the language switch and hreflang.
export function stripLang(pathname: string) {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

// Text helpers: the Italian original sits next to its translation where it is used.
export function i18n(lang: Lang) {
  return {
    lang,
    t: (it: string, en: string) => (lang === "en" ? en : it),
    href: (path: string) => localPath(lang, path),
  };
}
