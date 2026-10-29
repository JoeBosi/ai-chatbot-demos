import { CheckCircle2Icon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { firstParam, qs } from "@/app/(sito)/_shared";
import { Button } from "@/components/ui/button";
import { clinicaFor } from "@/data/en/localize";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

const meta = metaFor("/prenota/confermato", {
  it: {
    title: "Prenotazione confermata",
    description:
      "Riepilogo di una prenotazione di prova al Poliambulatorio Vallenova.",
  },
  en: {
    title: "Booking confirmed",
    description:
      "Summary of a test booking at Poliambulatorio Vallenova.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await meta()), robots: { index: false } };
}

export default async function ConfermatoPage({ searchParams }: PageProps<"/prenota/confermato">) {
  const params = await searchParams;
  const codice = firstParam(params.codice, 20);
  // Il codice da solo non basta a leggere la prenotazione (serve anche l'email): qui mostro solo
  // il codice e le istruzioni, i dettagli si rileggono da /prenotazioni.
  if (!codice || !/^PR-\d{4,6}$/.test(codice)) notFound();
  const { t, href, lang } = await getI18n();
  const clinica = clinicaFor(lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <CheckCircle2Icon className="text-enamel size-10" aria-hidden />
      <h1 className="font-display mt-3 text-4xl md:text-5xl">{t("Appuntamento registrato", "Appointment recorded")}</h1>
      <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
        {t(
          "L'appuntamento è salvato nel database della demo. Nessuna email è stata spedita e nessuna struttura reale l'ha ricevuto.",
          "The appointment is saved in the demo database. No email has been sent and no real clinic has received it.",
        )}
      </p>

      <div className="bg-enamel-soft/60 mt-8 rounded-lg border p-6">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">{t("Codice prenotazione", "Booking code")}</p>
        <p className="font-display mt-1 text-4xl tracking-wide">{codice}</p>
        <p className="mt-3 text-sm leading-relaxed">
          {t(
            "Annotalo. Con questo codice e l'email che hai scritto nel form puoi rivedere o disdire l'appuntamento in «Le mie prenotazioni». Il codice da solo non apre niente: serve anche l'email.",
            "Write it down. With this code and the email you entered in the form you can review or cancel the appointment in «My bookings». The code alone opens nothing: you also need the email.",
          )}
        </p>
        <Button asChild className="mt-4">
          <Link href={href(`/prenotazioni${qs({ codice })}`)}>{t("Vedi i dettagli in Le mie prenotazioni", "See the details in My bookings")}</Link>
        </Button>
      </div>

      <section className="mt-10" aria-labelledby="cosa-portare">
        <h2 id="cosa-portare" className="font-display text-2xl">
          {t("Cosa portare", "What to bring")}
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
          {(lang === "en"
            ? [
                "An identity document and your health card.",
                "Your GP's referral, if the service requires one.",
                "Previous tests or reports about the same service, if you have them.",
                "Any preparation instructions shown on the service page.",
              ]
            : [
                "Un documento d'identità e la tessera sanitaria.",
                "L'impegnativa del medico di base, se la prestazione la richiede.",
                "Esami o referti precedenti che riguardano la stessa prestazione, se li hai.",
                "Eventuali indicazioni di preparazione riportate nella scheda della prestazione.",
              ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="quando-arrivare">
        <h2 id="quando-arrivare" className="font-display text-2xl">
          {t("Quando arrivare", "When to arrive")}
        </h2>
        <p className="mt-3 leading-relaxed">
          {lang === "en" ? (
            <>
              Go to reception, on floor 0, <strong>10 minutes early</strong>: the time is used to register the appointment and show you
              the room. Reception is at {clinica.indirizzo}, {clinica.citta}.
            </>
          ) : (
            <>
              Presentati in accettazione, al piano 0, <strong>10 minuti prima</strong> dell&apos;orario: il tempo serve a registrare
              l&apos;appuntamento e a indicarti la stanza. La reception è in {clinica.indirizzo}, {clinica.citta}.
            </>
          )}
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          <Link href={href("/dove-siamo")} className="text-enamel underline decoration-dotted underline-offset-4">
            {t("Come arrivare e piantina dei piani", "How to get here and floor plan")}
          </Link>
        </p>
      </section>

      <p className="mt-10 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 text-sm leading-relaxed">
        <strong>{t("È una demo.", "It is a demo.")}</strong>{" "}
        {t(
          "Struttura, medici, prezzi e appuntamenti sono inventati; nessuno ti aspetta e nessuno leggerà questa prenotazione. Le prenotazioni dei visitatori vengono cancellate dopo pochi giorni.",
          "Clinic, doctors, prices and appointments are made up; nobody is expecting you and nobody will read this booking. Visitors' bookings are deleted after a few days.",
        )}{" "}
        <Link href={href("/come-funziona")} className="text-enamel underline decoration-dotted underline-offset-4">
          {t("Com'è fatta questa demo", "How this demo works")}
        </Link>
      </p>
    </div>
  );
}
