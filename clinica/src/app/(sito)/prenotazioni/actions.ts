"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { qs } from "@/app/(sito)/_shared";
import { cancelAppointment } from "@/lib/agenda";
import { clientIp, consumeActionQuota, hashIp } from "@/lib/rate-limit";

const schema = z.object({
  codice: z.string().trim().min(3).max(20),
  email: z.string().trim().max(120).email(),
  // Secondo passaggio: il bottone "disdici" porta a una pagina di conferma, non disdice da solo.
  conferma: z.literal("1"),
});

export async function cancelBooking(formData: FormData) {
  const raw = {
    codice: String(formData.get("codice") ?? ""),
    email: String(formData.get("email") ?? ""),
    conferma: String(formData.get("conferma") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/prenotazioni${qs({ codice: raw.codice, email: raw.email, errore: "Richiesta non valida." })}`);
  }
  const { codice, email } = parsed.data;

  const quota = await consumeActionQuota("prenotazione", hashIp(clientIp(await headers())));
  if (!quota.ok) {
    redirect(`/prenotazioni${qs({ codice, email, errore: "Troppe operazioni ravvicinate: riprova più tardi." })}`);
  }

  // `cancelAppointment` ritorna null se codice ed email non combaciano: non lo diciamo in chiaro,
  // la pagina mostra lo stesso messaggio neutro di una ricerca a vuoto.
  await cancelAppointment(codice, email);
  redirect(`/prenotazioni${qs({ codice, email })}`);
}
