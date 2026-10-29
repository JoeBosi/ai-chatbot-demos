import Link from "next/link";

import { getI18n } from "@/lib/i18n-server";
import { AUTHOR, RELATED_SITES, SOURCE_URL } from "@/lib/seo";

export async function SiteFooter() {
  const { t, href, lang } = await getI18n();
  return (
    <footer className="bg-ink mt-24 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-white">Crema &amp; Ferro</p>
          <p className="mt-3 max-w-sm text-sm">
            {t(
              "Un negozio inventato per mostrare un assistente AI agli acquisti. Nessun prodotto è in vendita e nessun dato di pagamento viene richiesto.",
              "A made-up shop that shows an AI shopping assistant at work. Nothing is for sale and no payment details are ever requested.",
            )}
          </p>
        </div>
        <nav aria-label={t("Negozio", "Shop")} className="text-sm">
          <p className="mb-3 font-semibold text-white">{t("Negozio", "Shop")}</p>
          <ul className="space-y-2">
            <li><Link href={href("/prodotti")} className="hover:text-white">{t("Tutti i prodotti", "All products")}</Link></li>
            <li><Link href={href("/carrello")} className="hover:text-white">{t("Carrello", "Cart")}</Link></li>
            <li><Link href={href("/ordini")} className="hover:text-white">{t("Stato dell'ordine", "Order status")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("Informazioni", "Information")} className="text-sm">
          <p className="mb-3 font-semibold text-white">{t("Informazioni", "Information")}</p>
          <ul className="space-y-2">
            <li><Link href={href("/assistenza")} className="hover:text-white">{t("Centro assistenza", "Help centre")}</Link></li>
            <li><Link href={href("/come-funziona")} className="hover:text-white">{t("Come funziona la demo", "How this demo works")}</Link></li>
            <li><Link href={href("/tutorial")} className="hover:text-white">{t("Tutorial: mettilo sul tuo sito", "Tutorial: put it on your site")}</Link></li>
            <li><Link href={href("/manutenzione")} className="hover:text-white">{t("Mantenere l'assistente", "Maintaining the assistant")}</Link></li>
            <li><Link href={href("/operatore")} className="hover:text-white">{t("Manuale dell'operatore", "Operator's manual")}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs leading-relaxed text-white/70">
          <p>
            {t("Un progetto didattico di ", "A teaching project ")}
            <a href={AUTHOR.url[lang]} className="font-semibold text-white/90 underline hover:text-white">
              {AUTHOR.signature[lang]}
            </a>
            , {AUTHOR.titles[lang]}.
          </p>
          <p>
            {t("Altri lavori dell'autore: ", "More by the author: ")}
            <a href={AUTHOR.url[lang]} className="underline hover:text-white">
              www.giuseppebosi.com
            </a>
            {" · "}
            <a href={AUTHOR.linkedin} className="underline hover:text-white" rel="noreferrer noopener">
              LinkedIn
            </a>
            {" · "}
            <a href={SOURCE_URL} className="underline hover:text-white" rel="noreferrer noopener">
              Source code on GitHub
            </a>
            {RELATED_SITES.map((s) => (
              <span key={s.name}>
                {" · "}
                <a href={s.url[lang]} className="underline hover:text-white">
                  {s.name}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
