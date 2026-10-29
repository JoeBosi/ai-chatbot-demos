/**
 * Applica al database i contenuti di `src/data/*` (specialità, medici, stanze, prestazioni, turni, informazioni).
 *
 *   npm run content:check   → dice cosa cambierebbe, senza scrivere niente
 *   npm run content:sync    → applica le modifiche e ricalcola solo gli embedding necessari
 *
 * In produzione la stessa sincronizzazione gira da sola a ogni avvio del container (`deploy.sh`),
 * quindi questo comando serve soprattutto per vedere l'anteprima prima di pubblicare.
 */
import { client } from "@/lib/db";
import {
  describe,
  planIsEmpty,
  syncContent,
  type SyncPlan,
} from "@/lib/db/sync";

const dryRun = process.argv.includes("--dry-run");

function stampa(nome: string, piano: SyncPlan) {
  const righe = [
    ...piano.added.map((v) => `  + ${v}`),
    ...piano.updated.map((v) => `  ~ ${v}`),
    ...piano.removed.map((v) => `  - ${v}`),
  ];
  if (!righe.length) return;
  console.log(`\n${nome}`);
  for (const r of righe) console.log(r);
}

async function main() {
  const report = await syncContent({ dryRun });
  if (planIsEmpty(report)) {
    console.log("Database già allineato ai file in src/data: niente da fare.");
    return;
  }
  stampa("Specialità", report.specialita);
  stampa("Medici", report.medici);
  stampa("Stanze", report.stanze);
  stampa("Prestazioni", report.prestazioni);
  stampa("Turni", report.turni);
  stampa("Informazioni", report.informazioni);
  console.log(`\n${describe(report)}`);
  console.log(
    dryRun
      ? "\nAnteprima: non è stato scritto niente. Per applicare: npm run content:sync (oppure ./deploy.sh)."
      : "\nFatto. Le risposte dell'assistente usano già i contenuti nuovi.",
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
