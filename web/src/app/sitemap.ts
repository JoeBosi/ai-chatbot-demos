import type { MetadataRoute } from "next";

import { products } from "@/data/catalog";
import { SITE_URL } from "@/lib/seo";

// Date of the last content change: update it when pages or data change.
const LAST_MODIFIED = "2026-10-29";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/prodotti", "/assistenza", "/come-funziona", "/tutorial", "/manutenzione", "/operatore"];
  const details = [...products.map((p) => `/prodotti/${p.slug}`)];
  return [...pages, ...details].map((path) => ({ url: path === "/" ? SITE_URL : `${SITE_URL}${path}`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" }));
}
