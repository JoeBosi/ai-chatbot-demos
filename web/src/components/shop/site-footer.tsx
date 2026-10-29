import Link from "next/link";
import { AUTHOR, RELATED_SITES, SOURCE_URL } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="bg-ink mt-24 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-white">Crema &amp; Ferro</p>
          <p className="mt-3 max-w-sm text-sm">
            Un negozio inventato per mostrare un assistente AI agli acquisti. Nessun prodotto è in vendita e nessun dato di pagamento viene richiesto.
          </p>
        </div>
        <nav aria-label="Negozio" className="text-sm">
          <p className="mb-3 font-semibold text-white">Negozio</p>
          <ul className="space-y-2">
            <li><Link href="/prodotti" className="hover:text-white">Tutti i prodotti</Link></li>
            <li><Link href="/carrello" className="hover:text-white">Carrello</Link></li>
            <li><Link href="/ordini" className="hover:text-white">Stato dell&apos;ordine</Link></li>
          </ul>
        </nav>
        <nav aria-label="Informazioni" className="text-sm">
          <p className="mb-3 font-semibold text-white">Informazioni</p>
          <ul className="space-y-2">
            <li><Link href="/assistenza" className="hover:text-white">Centro assistenza</Link></li>
            <li><Link href="/come-funziona" className="hover:text-white">Come funziona la demo</Link></li>
            <li><Link href="/tutorial" className="hover:text-white">Tutorial: mettilo sul tuo sito</Link></li>
            <li><Link href="/manutenzione" className="hover:text-white">Mantenere l&apos;assistente</Link></li>
            <li><Link href="/operatore" className="hover:text-white">Manuale dell&apos;operatore</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs leading-relaxed text-white/70">
          <p>
            Un progetto didattico di{" "}
            <a href={AUTHOR.url} className="font-semibold text-white/90 underline hover:text-white">
              Giuseppe Bosi
            </a>
            , {AUTHOR.titles}.
          </p>
          <p>
            Altri lavori dell&apos;autore:{" "}
            <a href={AUTHOR.url} className="underline hover:text-white">
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
              <span key={s.url}>
                {" · "}
                <a href={s.url} className="underline hover:text-white">
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
