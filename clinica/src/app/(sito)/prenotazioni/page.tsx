import type { Metadata } from "next";
import Link from "next/link";

import { firstParam, fmt, qs } from "@/app/(sito)/_shared";
import { cancelBooking } from "@/app/(sito)/prenotazioni/actions";
import { Button } from "@/components/ui/button";
import { lDoctor, lRoom, lService } from "@/data/en/localize";
import { findAppointment, localTime, localDate } from "@/lib/agenda";
import { getI18n } from "@/lib/i18n-server";
import { getDoctor, getRoom, getService } from "@/lib/clinica";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/prenotazioni", {
  it: {
    title: "Le mie prenotazioni",
    description:
      "Cerca un appuntamento con il codice e l'email usati per prenotarlo, e disdicilo se serve.",
  },
  en: {
    title: "My bookings",
    description:
      "Find an appointment with the code and email used to book it, and cancel it if needed.",
  },
});

const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

export default async function PrenotazioniPage({ searchParams }: PageProps<"/prenotazioni">) {
  const params = await searchParams;
  const codice = firstParam(params.codice, 20) ?? "";
  const email = firstParam(params.email, 120) ?? "";
  const conferma = firstParam(params.conferma, 2) === "1";
  const errore = firstParam(params.errore, 200);

  const searched = Boolean(codice && email);
  const [appointment, { t, href, lang }] = await Promise.all([searched ? findAppointment(codice, email) : null, getI18n()]);
  const { durata, prezzo, refertoLabel, data } = fmt(lang);

  const [itService, itDoctor, itRoom] = appointment
    ? await Promise.all([
        getService(appointment.serviceSlug),
        getDoctor(appointment.doctorSlug),
        getRoom(appointment.roomSlug),
      ])
    : [undefined, undefined, undefined];
  const service = itService && lService(lang, itService);
  const doctor = itDoctor && lDoctor(lang, itDoctor);
  const room = itRoom && lRoom(lang, itRoom);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">{t("Le mie prenotazioni", "My bookings")}</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {t(
            "Inserisci il codice che ti è stato dato quando hai prenotato (tipo PR-12345) e l'email che hai usato. Il codice da solo non basta.",
            "Enter the code you were given when you booked (like PR-12345) and the email you used. The code alone is not enough.",
          )}
        </p>

        <form method="get" className="mt-6 space-y-3">
          <label className="block text-sm">
            {t("Codice prenotazione", "Booking code")}
            <input name="codice" required maxLength={20} defaultValue={codice} placeholder="PR-12345" className={field} />
          </label>
          <label className="block text-sm">
            {t("Email usata per prenotare", "Email used to book")}
            <input
              name="email"
              type="email"
              required
              maxLength={120}
              defaultValue={email}
              placeholder="mario@example.com"
              className={field}
            />
          </label>
          <Button type="submit" size="lg">
            {t("Cerca la prenotazione", "Find the booking")}
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
          {t(
            "Non trovi il codice? In una struttura vera chiameresti la reception. Qui è una demo: se hai perso il codice,",
            "Can't find the code? In a real clinic you would call reception. Here it is a demo: if you have lost the code,",
          )}{" "}
          <Link href={href("/prenota")} className="text-enamel underline decoration-dotted underline-offset-4">
            {t("fai un'altra prenotazione di prova", "make another test booking")}
          </Link>
          .
        </p>
      </div>

      <div>
        {errore && (
          <p role="alert" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
            {errore}
          </p>
        )}

        {searched && !appointment && (
          <p role="alert" className="bg-card rounded-lg border p-6 leading-relaxed">
            {t(
              "Non risulta nessuna prenotazione con questo codice e questa email. Controlla di aver scritto entrambi come li hai usati al momento di prenotare.",
              "There is no booking with this code and this email. Check that you wrote both exactly as you used them when booking.",
            )}
          </p>
        )}

        {appointment && service && (
          <article className="bg-card rounded-lg border p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl leading-none">{service.name}</h2>
              <span
                className={
                  appointment.status === "disdetta"
                    ? "rounded-full border px-3 py-1 text-xs font-semibold"
                    : "bg-enamel rounded-full px-3 py-1 text-xs font-semibold text-white"
                }
              >
                {appointment.status === "disdetta" ? t("Disdetta", "Cancelled") : t("Confermata", "Confirmed")}
              </span>
            </div>

            <dl className="mt-5 divide-y border-y text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Codice", "Code")}</dt>
                <dd className="font-semibold">{appointment.code}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Quando", "When")}</dt>
                <dd className="font-semibold">
                  {data(localDate(appointment.startsAt))} {t("alle", "at")} {localTime(appointment.startsAt)} ({t("fino alle", "until")}{" "}
                  {localTime(appointment.endsAt)})
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Medico", "Doctor")}</dt>
                <dd>{doctor?.name ?? appointment.doctorSlug}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Dove", "Where")}</dt>
                <dd>
                  {room ? `${room.name}, ${t("piano", "floor")} ${room.floor} (${room.wing})` : appointment.roomSlug}
                  {room && <span className="text-muted-foreground block text-xs">{room.directions}</span>}
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Durata e costo", "Duration and cost")}</dt>
                <dd>
                  {durata(service.durationMinutes)} · {prezzo(service.priceCents)}
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Referto", "Report")}</dt>
                <dd>{refertoLabel(service.reportDays)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{t("Intestata a", "In the name of")}</dt>
                <dd>
                  {appointment.patientName}
                  <span className="text-muted-foreground block text-xs">
                    {appointment.patientEmail} · {appointment.patientPhone}
                  </span>
                </dd>
              </div>
              {appointment.note && (
                <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                  <dt className="text-muted-foreground">{t("Nota", "Note")}</dt>
                  <dd>{appointment.note}</dd>
                </div>
              )}
            </dl>

            {service.preparation && appointment.status === "confermata" && (
              <p className="mt-5 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed">
                <strong>{t("Preparazione:", "Preparation:")}</strong> {service.preparation}
              </p>
            )}

            {appointment.status === "confermata" &&
              (conferma ? (
                <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm leading-relaxed">
                    {t("Confermi di voler disdire l'appuntamento", "Do you confirm you want to cancel appointment")}{" "}
                    <strong>{appointment.code}</strong> {t("del", "on")} {data(localDate(appointment.startsAt))} {t("alle", "at")}{" "}
                    {localTime(appointment.startsAt)}?{" "}
                    {t(
                      "L'orario torna libero per gli altri e l'operazione non si può annullare.",
                      "The time becomes free for others and the operation cannot be undone.",
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <form action={cancelBooking}>
                      <input type="hidden" name="codice" value={appointment.code} />
                      <input type="hidden" name="email" value={appointment.patientEmail} />
                      <input type="hidden" name="conferma" value="1" />
                      <Button type="submit" variant="destructive">
                        {t("Sì, disdici l'appuntamento", "Yes, cancel the appointment")}
                      </Button>
                    </form>
                    <Link
                      href={href(`/prenotazioni${qs({ codice: appointment.code, email })}`)}
                      className="text-sm underline decoration-dotted underline-offset-4"
                    >
                      {t("No, lascia tutto com'è", "No, leave everything as it is")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={href(`/prenotazioni${qs({ codice: appointment.code, email, conferma: "1" })}`)}>
                      {t("Disdici l'appuntamento", "Cancel the appointment")}
                    </Link>
                  </Button>
                </div>
              ))}

            {appointment.status === "disdetta" && (
              <p className="mt-6 text-sm leading-relaxed">
                {t("Questo appuntamento è stato disdetto e l'orario è tornato libero. Puoi", "This appointment has been cancelled and the time is free again. You can")}{" "}
                <Link href={href(`/prenota${qs({ prestazione: service.slug })}`)} className="text-enamel underline decoration-dotted underline-offset-4">
                  {t("prenotarne un altro", "book another one")}
                </Link>
                .
              </p>
            )}

            <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
              {t("Prenotazione dimostrativa: nessuna struttura reale l'ha ricevuta.", "Demo booking: no real clinic has received it.")}
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
