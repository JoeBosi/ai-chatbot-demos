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
      default:
        lang === "en"
          ? "Poliambulatorio Vallenova — visits, tests and bookings (demo)"
          : "Poliambulatorio Vallenova — visite, esami e prenotazioni (demo)",
      template: "%s · Poliambulatorio Vallenova",
    },
    description:
      lang === "en"
        ? "A demo outpatient clinic with an AI assistant: specialties, services, doctors, hours, reports and appointment booking. Clinic and data are made up."
        : "Poliambulatorio dimostrativo con un assistente AI: specialità, prestazioni, medici, orari, referti e prenotazione degli appuntamenti. Struttura e dati inventati.",
    authors: [{ name: AUTHOR.name, url: AUTHOR.url[lang] }],
    openGraph: { type: "website", locale: lang === "en" ? "en_GB" : "it_IT", siteName: SITE_NAME },
  };
}

export const viewport: Viewport = { themeColor: "#0f3d4e" };

// The site chrome lives in (sito)/layout.tsx: /embed must render the chat alone, inside someone
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
