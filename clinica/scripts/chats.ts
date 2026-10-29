/**
 * Cosa hanno chiesto i clienti, per capire dove l'assistente va migliorato.
 *
 *   npm run chats:report            → ultimi 7 giorni
 *   npm run chats:report -- 30      → ultimi 30 giorni
 *
 * Sola lettura. Non stampa indirizzi IP (nel database c'è solo un'impronta) e taglia i testi:
 * serve a vedere gli argomenti, non a leggere le conversazioni una per una.
 */
import { desc, gte, sql } from "drizzle-orm";

import { client, db } from "@/lib/db";
import { chats } from "@/lib/db/schema";

const giorni = Number(process.argv[2] ?? 7);
const da = new Date(Date.now() - giorni * 24 * 60 * 60 * 1000);

type Parte = { type?: string; text?: string; state?: string };
type Messaggio = { role?: string; parts?: Parte[] };

const testo = (m: Messaggio) =>
  (m.parts ?? [])
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!.replace(/\s+/g, " ").trim())
    .join(" ");

const taglia = (s: string, n = 90) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

async function main() {
  const righe = await db
    .select({
      id: chats.id,
      messages: chats.messages,
      model: chats.model,
      updatedAt: chats.updatedAt,
    })
    .from(chats)
    .where(gte(chats.updatedAt, da))
    .orderBy(desc(chats.updatedAt));

  const [{ totale }] = await db.execute<{ totale: number }>(
    sql`select count(*)::int as totale from chats`,
  );

  console.log(
    `Conversazioni negli ultimi ${giorni} giorni: ${righe.length} (in archivio: ${totale}, si cancellano dopo 30 giorni)\n`,
  );
  if (!righe.length) return;

  // Quali attrezzi vengono usati: se searchHelp non compare mai, o il centro assistenza non serve
  // a niente o le istruzioni non lo fanno usare.
  const attrezzi = new Map<string, number>();
  let senzaAttrezzi = 0;
  const domande: string[] = [];

  for (const riga of righe) {
    const messaggi = (riga.messages as Messaggio[]) ?? [];
    const usati = new Set<string>();
    for (const m of messaggi) {
      for (const p of m.parts ?? []) {
        if (p.type?.startsWith("tool-")) usati.add(p.type.slice(5));
      }
    }
    if (!usati.size) senzaAttrezzi++;
    for (const t of usati) attrezzi.set(t, (attrezzi.get(t) ?? 0) + 1);
    for (const m of messaggi.filter((m) => m.role === "user")) {
      const t = testo(m);
      if (t) domande.push(t);
    }
  }

  console.log("Attrezzi usati (in quante conversazioni)");
  for (const [nome, n] of [...attrezzi.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${nome}`);
  }
  console.log(
    `  ${String(senzaAttrezzi).padStart(4)}  (nessun attrezzo: solo chiacchiere o risposte inventate?)`,
  );

  console.log(
    `\nUltime domande dei clienti (${Math.min(domande.length, 40)} di ${domande.length})`,
  );
  for (const d of domande.slice(0, 40)) console.log(`  · ${taglia(d)}`);

  const modelli = new Map<string, number>();
  for (const r of righe)
    modelli.set(r.model ?? "?", (modelli.get(r.model ?? "?") ?? 0) + 1);
  console.log("\nModelli che hanno risposto");
  for (const [m, n] of [...modelli.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    console.log(`  ${String(n).padStart(4)}  ${m}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
