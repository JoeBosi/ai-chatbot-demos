// Piccoli aiuti condivisi dalle pagine del sito. Vivono qui dentro perché servono solo alle pagine.

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

export function prezzo(priceCents: number) {
  return euro.format(priceCents / 100);
}

export const tipoLabel: Record<string, string> = {
  visita: "Visita",
  esame: "Esame strumentale",
  analisi: "Analisi",
  certificato: "Certificato",
  terapia: "Terapia",
};

export const tipi = ["visita", "esame", "analisi", "certificato", "terapia"] as const;

export function refertoLabel(reportDays: number) {
  if (reportDays === 0) return "Consegnato subito, a fine visita";
  if (reportDays === 1) return "Pronto in 1 giorno lavorativo";
  return `Pronto in ${reportDays} giorni lavorativi`;
}

/** Iniziali per la pastiglia colorata: il titolo ("Dott.ssa") fa parte del nome, va scartato. */
export function iniziali(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter((w) => !w.endsWith("."))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function durata(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Costruisce una query string saltando i valori vuoti. */
export function qs(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function firstParam(value: string | string[] | undefined, maxLength = 120) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.slice(0, maxLength) : undefined;
}
