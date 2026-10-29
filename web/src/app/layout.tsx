import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

import { AUTHOR, jsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";

import "./globals.css";

const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap" });
const hanken = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Crema & Ferro — attrezzatura per il caffè (demo)", template: "%s · Crema & Ferro" },
  description:
    "Negozio dimostrativo con un assistente AI per gli acquisti: consigli sui prodotti, carrello, stato degli ordini e assistenza.",
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  openGraph: { type: "website", locale: "it_IT", siteName: SITE_NAME },
};

export const viewport: Viewport = { themeColor: "#123a2f" };

// The shop chrome lives in (shop)/layout.tsx: /embed must render the chat alone, inside someone
// else's page, with no header, footer or launcher around it.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${bodoni.variable} ${hanken.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        {/* Structured data for search engines: the site, its author and what it teaches. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
