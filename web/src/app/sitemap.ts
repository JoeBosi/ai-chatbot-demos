import type { MetadataRoute } from "next";

import { products } from "@/data/catalog";
import { localPath, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

// Date of the last content change: update it when pages or data change.
const LAST_MODIFIED = "2026-10-29";

const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

// Every page twice, Italian and English, each listing the other as its alternate (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/prodotti", "/assistenza", "/come-funziona", "/tutorial", "/manutenzione", "/operatore"];
  const details = [...products.map((p) => `/prodotti/${p.slug}`)];
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
