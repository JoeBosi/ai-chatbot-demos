"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { qs } from "@/app/(sito)/_shared";
import { cancelAppointment } from "@/lib/agenda";
import { localPath } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
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

  const lang = await getLang();
  const back = (query: Record<string, string | undefined>): never => redirect(localPath(lang, `/prenotazioni${qs(query)}`));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return back({ codice: raw.codice, email: raw.email, errore: lang === "en" ? "Invalid request." : "Richiesta non valida." });
  }
  const { codice, email } = parsed.data;

  const quota = await consumeActionQuota("prenotazione", hashIp(clientIp(await headers())));
  if (!quota.ok) {
    back({ codice, email, errore: lang === "en" ? "Too many operations in a short time: try again later." : "Troppe operazioni ravvicinate: riprova più tardi." });
  }

  // `cancelAppointment` ritorna null se codice ed email non combaciano: non lo diciamo in chiaro,
  // la pagina mostra lo stesso messaggio neutro di una ricerca a vuoto.
  await cancelAppointment(codice, email);
  back({ codice, email });
}
