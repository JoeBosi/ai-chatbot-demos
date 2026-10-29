import type { MetadataRoute } from "next";

import { medici } from "@/data/medici";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { localPath, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

// Date of the last content change: update it when pages or data change.
const LAST_MODIFIED = "2026-10-29";

const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

// Every page twice, Italian and English, each listing the other as its alternate (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/specialita", "/prestazioni", "/medici", "/prenota", "/referti", "/dove-siamo", "/informazioni", "/come-funziona", "/crediti", "/privacy"];
  const details = [
    ...specialita.map((s) => `/specialita/${s.slug}`),
    ...prestazioni.map((p) => `/prestazioni/${p.slug}`),
    ...medici.map((m) => `/medici/${m.slug}`),
  ];
  const langs: Lang[] = ["it", "en"];
  return [...pages, ...details].flatMap((path) =>
    langs.map((lang) => ({
      url: abs(localPath(lang, path)),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      alternates: { languages: { it: abs(path), en: abs(localPath("en", path)), "x-default": abs(path) } },
    })),
  );
}
