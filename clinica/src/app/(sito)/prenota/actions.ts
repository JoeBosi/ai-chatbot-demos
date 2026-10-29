"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { qs } from "@/app/(sito)/_shared";
import { BookingError, bookAppointment } from "@/lib/agenda";
import { clientIp, consumeActionQuota, hashIp } from "@/lib/rate-limit";

const schema = z.object({
  prestazione: z.string().trim().min(1).max(80),
  medico: z.string().trim().min(1).max(80),
  quando: z.string().trim().min(1).max(40),
  nome: z.string().trim().min(2, "Inserisci nome e cognome.").max(80),
  email: z.string().trim().max(120).email("Inserisci un'email valida."),
  telefono: z
    .string()
    .trim()
    .min(6, "Inserisci un numero di telefono.")
    .max(30)
    .regex(/^[0-9+\s().-]+$/, "Il telefono può contenere solo cifre, spazi e i simboli + ( ) - ."),
  note: z.string().trim().max(300).optional(),
  // Una checkbox non spuntata non viene nemmeno inviata: qui deve valere "on".
  demo: z.literal("on", { message: "Devi confermare di aver capito che è una demo." }),
});

/**
 * Prenota lo slot. I parametri arrivano dalla query string e dai campi nascosti, quindi non sono
 * affidabili: `bookAppointment` ricontrolla turni, chiusure, preavviso e doppie prenotazioni.
 * Gli errori tornano in pagina come query string, così il form resta un Server Component.
 */
export async function createBooking(formData: FormData) {
  const raw = {
    prestazione: String(formData.get("prestazione") ?? ""),
    medico: String(formData.get("medico") ?? ""),
    quando: String(formData.get("quando") ?? ""),
    nome: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    note: String(formData.get("note") ?? ""),
    demo: String(formData.get("demo") ?? ""),
  };

  function back(errore: string): never {
    redirect(`/prenota${qs({ prestazione: raw.prestazione, medico: raw.medico, quando: raw.quando, errore })}`);
  }

  const parsed = schema.safeParse({ ...raw, note: raw.note || undefined });
  if (!parsed.success) back(parsed.error.issues[0].message);
  const data = parsed.data;

  const quota = await consumeActionQuota("prenotazione", hashIp(clientIp(await headers())));
  if (!quota.ok) back("Hai già fatto diverse prenotazioni di prova: riprova più tardi.");

  let code: string;
  try {
    const appointment = await bookAppointment({
      serviceSlug: data.prestazione,
      doctorSlug: data.medico,
      startsAt: data.quando,
      patientName: data.nome,
      patientEmail: data.email,
      patientPhone: data.telefono,
      note: data.note,
    });
    code = appointment.code;
  } catch (err) {
    if (err instanceof BookingError) back(err.message);
    throw err;
  }

  redirect(`/prenota/confermato${qs({ codice: code })}`);
}
