import Link from "next/link";

import { clinica } from "@/data/clinica";
import { AUTHOR, RELATED_SITES, SOURCE_URL } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="bg-enamel-deep mt-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl leading-none">{clinica.nome}</p>
          <p className="mt-2 text-sm text-white/70">
            {clinica.indirizzo}
            <br />
            {clinica.cap} {clinica.citta} ({clinica.provincia})
          </p>
          <p className="mt-2 text-sm text-white/70">
            <a href={`tel:${clinica.telefono.replace(/\s/g, "")}`} className="hover:text-white">
              {clinica.telefono}
            </a>
            <br />
            <a href={`mailto:${clinica.email}`} className="hover:text-white">
              {clinica.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Prenotazioni</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <li>
              <Link href="/prestazioni" className="hover:text-white">
                Visite ed esami
              </Link>
            </li>
            <li>
              <Link href="/prenota" className="hover:text-white">
                Prenota un appuntamento
              </Link>
            </li>
            <li>
              <Link href="/prenotazioni" className="hover:text-white">
                Le mie prenotazioni
              </Link>
            </li>
            <li>
              <Link href="/medici" className="hover:text-white">
                Medici e orari
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Informazioni</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <li>
              <Link href="/referti" className="hover:text-white">
                Ritiro dei referti
              </Link>
            </li>
            <li>
              <Link href="/informazioni" className="hover:text-white">
                Orari, pagamenti, documenti
              </Link>
            </li>
            <li>
              <Link href="/dove-siamo" className="hover:text-white">
                Dove siamo e piani
              </Link>
            </li>
            <li>
              <Link href="/crediti" className="hover:text-white">
                Crediti e licenze
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Orari della reception</p>
          <ul className="mt-2 flex flex-col gap-0.5 text-sm text-white/70">
            {clinica.orari.map((o) => (
              <li key={o.giorno} className="flex justify-between gap-3">
                <span>{o.nome}</span>
                <span>{o.dalle && o.alle ? `${o.dalle}-${o.alle}` : "chiuso"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs leading-relaxed text-white/70">
          <p>
            Un sito didattico: la clinica, i medici, le prestazioni e i prezzi sono inventati per mostrare come lavora un
            assistente conversazionale, e le prenotazioni restano un esercizio. L&apos;assistente dà informazioni
            organizzative, non pareri medici: per un problema di salute il riferimento è il medico, in emergenza il{" "}
            <strong>112</strong>.
          </p>
          <p>
            <a href={AUTHOR.url} className="font-semibold text-white/90 underline hover:text-white">Giuseppe Bosi</a>, Dottore in Ingegneria Elettronica (V.O.), Professore di
            Scienze e Tecnologie Informatiche. Testi con licenza{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/deed.it" className="underline hover:text-white" rel="noreferrer noopener" target="_blank">
              CC BY 4.0
            </a>
            , codice con licenza{" "}
            <a href="https://opensource.org/license/mit" className="underline hover:text-white" rel="noreferrer noopener" target="_blank">
              MIT
            </a>
            .{" "}
            <Link href="/crediti" className="underline hover:text-white">
              Crediti
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/come-funziona" className="underline hover:text-white">
              Com&apos;è fatta questa demo
            </Link>
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
