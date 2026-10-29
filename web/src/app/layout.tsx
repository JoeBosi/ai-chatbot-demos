import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

import { LangProvider } from "@/components/lang-provider";
import { getLang } from "@/lib/i18n-server";
import { AUTHOR, jsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";

import "./globals.css";

const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap" });
const hanken = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: lang === "en" ? "Crema & Ferro — coffee gear (demo)" : "Crema & Ferro — attrezzatura per il caffè (demo)",
      template: "%s · Crema & Ferro",
    },
    description:
      lang === "en"
        ? "A demo shop with an AI shopping assistant: product advice, cart, order status and support."
        : "Negozio dimostrativo con un assistente AI per gli acquisti: consigli sui prodotti, carrello, stato degli ordini e assistenza.",
    authors: [{ name: AUTHOR.name, url: AUTHOR.url[lang] }],
    openGraph: { type: "website", locale: lang === "en" ? "en_GB" : "it_IT", siteName: SITE_NAME },
  };
}

export const viewport: Viewport = { themeColor: "#123a2f" };

// The shop chrome lives in (shop)/layout.tsx: /embed must render the chat alone, inside someone
// else's page, with no header, footer or launcher around it.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${bodoni.variable} ${hanken.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LangProvider lang={lang}>{children}</LangProvider>
        {/* Structured data for search engines: the site, its author and what it teaches. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
