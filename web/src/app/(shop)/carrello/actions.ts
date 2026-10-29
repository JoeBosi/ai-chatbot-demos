"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { localPath } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { CheckoutError, placeOrder } from "@/lib/orders";
import { clientIp, consumeActionQuota, hashIp } from "@/lib/rate-limit";

export type CheckoutState = { error?: string; fields?: { name: string; email: string; city: string } };

const messages = {
  it: { name: "Inserisci nome e cognome", email: "Inserisci un'email valida", city: "Inserisci la città", quota: "Hai già fatto diversi ordini demo: riprova più tardi." },
  en: { name: "Enter your first and last name", email: "Enter a valid email", city: "Enter your city", quota: "You have already placed several demo orders: try again later." },
};

const schemaFor = (m: (typeof messages)["it"]) =>
  z.object({
    name: z.string().trim().min(2, m.name).max(80),
    email: z.string().trim().email(m.email).max(120),
    city: z.string().trim().min(2, m.city).max(80),
  });

export async function checkout(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const fields = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    city: String(formData.get("city") ?? ""),
  };
  const lang = await getLang();
  const parsed = schemaFor(messages[lang]).safeParse(fields);
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  const quota = await consumeActionQuota("checkout", hashIp(clientIp(await headers())));
  if (!quota.ok) return { error: messages[lang].quota, fields };

  let number: string;
  try {
    const order = await placeOrder(parsed.data);
    number = order.number;
  } catch (err) {
    if (err instanceof CheckoutError) return { error: err.message, fields };
    throw err;
  }
  // The cart badge lives in the root layout, which a redirect alone does not re-render.
  revalidatePath("/", "layout");
  redirect(localPath(lang, `/ordini/confermato?numero=${encodeURIComponent(number)}&email=${encodeURIComponent(parsed.data.email)}`));
}
