"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { qs } from "@/app/(sito)/_shared";
import { BookingError, bookAppointment } from "@/lib/agenda";
import { localPath } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { clientIp, consumeActionQuota, hashIp } from "@/lib/rate-limit";

const messages = {
  it: {
    nome: "Inserisci nome e cognome.",
    email: "Inserisci un'email valida.",
    telefono: "Inserisci un numero di telefono.",
    telefonoFormato: "Il telefono può contenere solo cifre, spazi e i simboli + ( ) - .",
    demo: "Devi confermare di aver capito che è una demo.",
    quota: "Hai già fatto diverse prenotazioni di prova: riprova più tardi.",
  },
  en: {
    nome: "Enter your first and last name.",
    email: "Enter a valid email.",
    telefono: "Enter a phone number.",
    telefonoFormato: "The phone number can contain only digits, spaces and the symbols + ( ) - .",
    demo: "Please confirm that you understand this is a demo.",
    quota: "You have already made several test bookings: try again later.",
  },
};

// Booking errors come from the agenda in Italian (the assistant reads them too).
const bookingErrorEn: Record<string, string> = {
  "Orario non valido.": "Invalid time.",
  "Prestazione non trovata.": "Service not found.",
  "Quell'orario non è più disponibile: chiedi le prossime disponibilità.": "That time is no longer available: ask for the next free slots.",
  "Quell'orario è stato appena prenotato da qualcun altro: scegline un altro.": "Someone has just booked that time: choose another one.",
};

const schemaFor = (m: (typeof messages)["it"]) =>
  z.object({
    prestazione: z.string().trim().min(1).max(80),
    medico: z.string().trim().min(1).max(80),
    quando: z.string().trim().min(1).max(40),
    nome: z.string().trim().min(2, m.nome).max(80),
    email: z.string().trim().max(120).email(m.email),
    telefono: z
      .string()
      .trim()
      .min(6, m.telefono)
      .max(30)
      .regex(/^[0-9+\s().-]+$/, m.telefonoFormato),
    note: z.string().trim().max(300).optional(),
    // Una checkbox non spuntata non viene nemmeno inviata: qui deve valere "on".
    demo: z.literal("on", { message: m.demo }),
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

  const lang = await getLang();
  function back(errore: string): never {
    redirect(localPath(lang, `/prenota${qs({ prestazione: raw.prestazione, medico: raw.medico, quando: raw.quando, errore })}`));
  }

  const parsed = schemaFor(messages[lang]).safeParse({ ...raw, note: raw.note || undefined });
  if (!parsed.success) back(parsed.error.issues[0].message);
  const data = parsed.data;

  const quota = await consumeActionQuota("prenotazione", hashIp(clientIp(await headers())));
  if (!quota.ok) back(messages[lang].quota);

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
    if (err instanceof BookingError) back(lang === "en" ? (bookingErrorEn[err.message] ?? err.message) : err.message);
    throw err;
  }

  redirect(localPath(lang, `/prenota/confermato${qs({ codice: code })}`));
}
