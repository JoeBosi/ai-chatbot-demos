import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (url) return url;
  // `next build` evaluates route modules; postgres.js connects lazily, so a placeholder is never dialed.
  if (process.env.NEXT_PHASE === "phase-production-build") return "postgres://build@127.0.0.1:1/build";
  throw new Error("DATABASE_URL is not set");
}

// One pool per process; reused across hot reloads in development.
export const client = globalForDb.sql ?? postgres(connectionString(), { max: 10, onnotice: () => {} });
if (process.env.NODE_ENV !== "production") globalForDb.sql = client;

export const db = drizzle(client, { schema });
export { schema };
