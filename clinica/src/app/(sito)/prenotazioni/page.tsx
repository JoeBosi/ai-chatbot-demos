import type { Metadata } from "next";
import Link from "next/link";

import { durata, firstParam, prezzo, qs, refertoLabel } from "@/app/(sito)/_shared";
import { cancelBooking } from "@/app/(sito)/prenotazioni/actions";
import { Button } from "@/components/ui/button";
import { findAppointment, localTime, prettyDate, localDate } from "@/lib/agenda";
import { getDoctor, getRoom, getService } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/prenotazioni", {
  title: "Le mie prenotazioni",
  description: "Cerca un appuntamento con il codice e l'email usati per prenotarlo, e disdicilo se serve.",
});

const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

export default async function PrenotazioniPage({ searchParams }: PageProps<"/prenotazioni">) {
  const params = await searchParams;
  const codice = firstParam(params.codice, 20) ?? "";
  const email = firstParam(params.email, 120) ?? "";
  const conferma = firstParam(params.conferma, 2) === "1";
  const errore = firstParam(params.errore, 200);

  const searched = Boolean(codice && email);
  const appointment = searched ? await findAppointment(codice, email) : null;

  const [service, doctor, room] = appointment
    ? await Promise.all([
        getService(appointment.serviceSlug),
        getDoctor(appointment.doctorSlug),
        getRoom(appointment.roomSlug),
      ])
    : [undefined, undefined, undefined];

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-4xl md:text-5xl">Le mie prenotazioni</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Inserisci il codice che ti è stato dato quando hai prenotato (tipo PR-12345) e l&apos;email che hai usato. Il
          codice da solo non basta.
        </p>

        <form method="get" className="mt-6 space-y-3">
          <label className="block text-sm">
            Codice prenotazione
            <input name="codice" required maxLength={20} defaultValue={codice} placeholder="PR-12345" className={field} />
          </label>
          <label className="block text-sm">
            Email usata per prenotare
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
            Cerca la prenotazione
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
          Non trovi il codice? In una struttura vera chiameresti la reception. Qui è una demo: se hai perso il codice,{" "}
          <Link href="/prenota" className="text-enamel underline decoration-dotted underline-offset-4">
            fai un&apos;altra prenotazione di prova
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
            Non risulta nessuna prenotazione con questo codice e questa email. Controlla di aver scritto entrambi come
            li hai usati al momento di prenotare.
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
                {appointment.status === "disdetta" ? "Disdetta" : "Confermata"}
              </span>
            </div>

            <dl className="mt-5 divide-y border-y text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Codice</dt>
                <dd className="font-semibold">{appointment.code}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Quando</dt>
                <dd className="font-semibold">
                  {prettyDate(localDate(appointment.startsAt))} alle {localTime(appointment.startsAt)} (fino alle{" "}
                  {localTime(appointment.endsAt)})
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Medico</dt>
                <dd>{doctor?.name ?? appointment.doctorSlug}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Dove</dt>
                <dd>
                  {room ? `${room.name}, piano ${room.floor} (${room.wing})` : appointment.roomSlug}
                  {room && <span className="text-muted-foreground block text-xs">{room.directions}</span>}
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Durata e costo</dt>
                <dd>
                  {durata(service.durationMinutes)} · {prezzo(service.priceCents)}
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Referto</dt>
                <dd>{refertoLabel(service.reportDays)}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">Intestata a</dt>
                <dd>
                  {appointment.patientName}
                  <span className="text-muted-foreground block text-xs">
                    {appointment.patientEmail} · {appointment.patientPhone}
                  </span>
                </dd>
              </div>
              {appointment.note && (
                <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                  <dt className="text-muted-foreground">Nota</dt>
                  <dd>{appointment.note}</dd>
                </div>
              )}
            </dl>

            {service.preparation && appointment.status === "confermata" && (
              <p className="mt-5 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed">
                <strong>Preparazione:</strong> {service.preparation}
              </p>
            )}

            {appointment.status === "confermata" &&
              (conferma ? (
                <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm leading-relaxed">
                    Confermi di voler disdire l&apos;appuntamento <strong>{appointment.code}</strong> del{" "}
                    {prettyDate(localDate(appointment.startsAt))} alle {localTime(appointment.startsAt)}? L&apos;orario
                    torna libero per gli altri e l&apos;operazione non si può annullare.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <form action={cancelBooking}>
                      <input type="hidden" name="codice" value={appointment.code} />
                      <input type="hidden" name="email" value={appointment.patientEmail} />
                      <input type="hidden" name="conferma" value="1" />
                      <Button type="submit" variant="destructive">
                        Sì, disdici l&apos;appuntamento
                      </Button>
                    </form>
                    <Link
                      href={`/prenotazioni${qs({ codice: appointment.code, email })}`}
                      className="text-sm underline decoration-dotted underline-offset-4"
                    >
                      No, lascia tutto com&apos;è
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={`/prenotazioni${qs({ codice: appointment.code, email, conferma: "1" })}`}>
                      Disdici l&apos;appuntamento
                    </Link>
                  </Button>
                </div>
              ))}

            {appointment.status === "disdetta" && (
              <p className="mt-6 text-sm leading-relaxed">
                Questo appuntamento è stato disdetto e l&apos;orario è tornato libero. Puoi{" "}
                <Link href={`/prenota${qs({ prestazione: service.slug })}`} className="text-enamel underline decoration-dotted underline-offset-4">
                  prenotarne un altro
                </Link>
                .
              </p>
            )}

            <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
              Prenotazione dimostrativa: nessuna struttura reale l&apos;ha ricevuta.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
