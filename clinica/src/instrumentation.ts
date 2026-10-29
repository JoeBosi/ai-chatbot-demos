export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { maintainDemoData, setupDatabase } = await import("@/lib/db/setup");
  await setupDatabase();
  const daily = setInterval(() => {
    maintainDemoData().catch((err) => console.error("[setup] daily maintenance failed", err));
  }, 24 * 60 * 60 * 1000);
  daily.unref();
}
