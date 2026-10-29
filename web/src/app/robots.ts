import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

// Everyone may read the site, AI crawlers included; only the API and the widget iframe are skipped.
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/embed"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
