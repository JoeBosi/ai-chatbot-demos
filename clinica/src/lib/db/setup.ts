import path from "node:path";

import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "@/lib/db";
import { appointments, chats } from "@/lib/db/schema";
import { describe as describeSync, planIsEmpty, seedAll, syncContent } from "@/lib/db/sync";

/**
 * Runs on every container start (`src/instrumentation.ts`): migrations, then the content of
 * `src/data/*` into the database. An empty database is seeded; an existing one is re-synced, so
 * editing a service or a doctor's hours and deploying is all it takes.
 */
export async function setupDatabase() {
  const started = Date.now();
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  const [{ count }] = await db.execute<{ count: number }>(sql`select count(*)::int as count from services`);
  if (count === 0) {
    await seedAll();
    console.log(`[setup] database popolato in ${Date.now() - started} ms`);
  } else {
    const report = await syncContent();
    if (!planIsEmpty(report)) console.log(`[setup] contenuti aggiornati — ${describeSync(report)}`);
  }
  await maintainDemoData();
  console.log(`[setup] pronto in ${Date.now() - started} ms`);
}

/**
 * Daily housekeeping for a public demo: the invented appointments are kept plausible (always a few
 * in the next days), the ones visitors created are dropped after a week, and conversations after
 * 30 days. Nothing here touches the content, which comes from the files.
 */
export async function maintainDemoData() {
  await db.delete(appointments).where(sql`${appointments.isDemo} = 0 and ${appointments.createdAt} < now() - interval '7 days'`);
  await db.delete(chats).where(sql`${chats.updatedAt} < now() - interval '30 days'`);
  await db.delete(appointments).where(sql`${appointments.isDemo} = 1`);
  const { seedDemoAppointments } = await import("@/lib/db/sync");
  await seedDemoAppointments();
}
