const euro = {
  it: new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }),
  en: new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }),
};

export function formatPrice(cents: number, lang: "it" | "en" = "it") {
  return euro[lang].format(cents / 100);
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 4900;
export const SHIPPING_CENTS = 690;

export function shippingFor(subtotalCents: number) {
  return subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
}

export const orderStatusLabel: Record<string, string> = {
  ricevuto: "Ricevuto",
  in_preparazione: "In preparazione",
  spedito: "Spedito",
  in_consegna: "In consegna",
  consegnato: "Consegnato",
  annullato: "Annullato",
};

export const orderStatusLabelEn: Record<string, string> = {
  ricevuto: "Received",
  in_preparazione: "Being prepared",
  spedito: "Shipped",
  in_consegna: "Out for delivery",
  consegnato: "Delivered",
  annullato: "Cancelled",
};

export function formatDateTime(iso: string, lang: "it" | "en" = "it") {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(iso));
}
