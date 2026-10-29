import type { MetadataRoute } from "next";

import { medici } from "@/data/medici";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { SITE_URL } from "@/lib/seo";

// Date of the last content change: update it when pages or data change.
const LAST_MODIFIED = "2026-10-29";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/specialita", "/prestazioni", "/medici", "/prenota", "/referti", "/dove-siamo", "/informazioni", "/come-funziona", "/crediti", "/privacy"];
  const details = [...specialita.map((s) => `/specialita/${s.slug}`),
    ...prestazioni.map((p) => `/prestazioni/${p.slug}`),
    ...medici.map((m) => `/medici/${m.slug}`),
  ];
  return [...pages, ...details].map((path) => ({ url: path === "/" ? SITE_URL : `${SITE_URL}${path}`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" }));
}
