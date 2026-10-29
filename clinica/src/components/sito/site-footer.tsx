import Link from "next/link";

import { clinica } from "@/data/clinica";
import { getI18n } from "@/lib/i18n-server";
import { AUTHOR, RELATED_SITES, SOURCE_URL } from "@/lib/seo";

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function SiteFooter() {
  const { t, href, lang } = await getI18n();
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
          <p className="text-sm font-semibold">{t("Prenotazioni", "Bookings")}</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <li>
              <Link href={href("/prestazioni")} className="hover:text-white">
                {t("Visite ed esami", "Visits and tests")}
              </Link>
            </li>
            <li>
              <Link href={href("/prenota")} className="hover:text-white">
                {t("Prenota un appuntamento", "Book an appointment")}
              </Link>
            </li>
            <li>
              <Link href={href("/prenotazioni")} className="hover:text-white">
                {t("Le mie prenotazioni", "My bookings")}
              </Link>
            </li>
            <li>
              <Link href={href("/medici")} className="hover:text-white">
                {t("Medici e orari", "Doctors and hours")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">{t("Informazioni", "Information")}</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <li>
              <Link href={href("/referti")} className="hover:text-white">
                {t("Ritiro dei referti", "Collecting reports")}
              </Link>
            </li>
            <li>
              <Link href={href("/informazioni")} className="hover:text-white">
                {t("Orari, pagamenti, documenti", "Hours, payments, documents")}
              </Link>
            </li>
            <li>
              <Link href={href("/dove-siamo")} className="hover:text-white">
                {t("Dove siamo e piani", "Where we are and floors")}
              </Link>
            </li>
            <li>
              <Link href={href("/crediti")} className="hover:text-white">
                {t("Crediti e licenze", "Credits and licences")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">{t("Orari della reception", "Reception hours")}</p>
          <ul className="mt-2 flex flex-col gap-0.5 text-sm text-white/70">
            {clinica.orari.map((o) => (
              <li key={o.giorno} className="flex justify-between gap-3">
                <span>{lang === "en" ? DAYS_EN[o.giorno] : o.nome}</span>
                <span>{o.dalle && o.alle ? `${o.dalle}-${o.alle}` : t("chiuso", "closed")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs leading-relaxed text-white/70">
          <p>
            {t(
              "Un sito didattico: la clinica, i medici, le prestazioni e i prezzi sono inventati per mostrare come lavora un assistente conversazionale, e le prenotazioni restano un esercizio. L'assistente dà informazioni organizzative, non pareri medici: per un problema di salute il riferimento è il medico, in emergenza il",
              "A teaching site: the clinic, the doctors, the services and the prices are made up to show how a chat assistant works, and bookings remain an exercise. The assistant gives organisational information, not medical advice: for a health problem, see a doctor; in an emergency call",
            )}{" "}
            <strong>112</strong>.
          </p>
          <p>
            <a href={AUTHOR.url[lang]} className="font-semibold text-white/90 underline hover:text-white">
              {AUTHOR.signature[lang]}
            </a>
            , {AUTHOR.titles[lang]}. {t("Testi con licenza", "Texts under licence")}{" "}
            <a href={`https://creativecommons.org/licenses/by/4.0/${lang === "en" ? "" : "deed.it"}`} className="underline hover:text-white" rel="noreferrer noopener" target="_blank">
              CC BY 4.0
            </a>
            {t(", codice con licenza", ", code under licence")}{" "}
            <a href="https://opensource.org/license/mit" className="underline hover:text-white" rel="noreferrer noopener" target="_blank">
              MIT
            </a>
            .{" "}
            <Link href={href("/crediti")} className="underline hover:text-white">
              {t("Crediti", "Credits")}
            </Link>{" "}
            ·{" "}
            <Link href={href("/privacy")} className="underline hover:text-white">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href={href("/come-funziona")} className="underline hover:text-white">
              {t("Com'è fatta questa demo", "How this demo works")}
            </Link>
          </p>
          <p>
            {t("Altri lavori dell'autore:", "More by the author:")}{" "}
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
