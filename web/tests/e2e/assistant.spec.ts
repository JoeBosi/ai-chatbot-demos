import { expect, test, type Page } from "@playwright/test";

// These tests talk to a real (free, non-deterministic) model: assertions target tool results, not wording.
const ANSWER = 120_000;

async function openAssistant(page: Page) {
  await page.getByRole("button", { name: /Chiedi al Barista|Torna al Barista/ }).click();
  return page.getByRole("dialog", { name: /Il Barista/ });
}

async function send(page: Page, text: string) {
  const input = page.getByLabel("Scrivi al Barista");
  await input.fill(text);
  await input.press("Enter");
}

test("consiglia prodotti del catalogo @mobile", async ({ page }) => {
  await page.goto("/");
  const panel = await openAssistant(page);
  await send(page, "Cerca una macchina espresso sotto i 400 euro");
  await expect(panel.locator('a[href^="/prodotti/"]').first()).toBeVisible({ timeout: ANSWER });
});

test("aggiunge al carrello e aggiorna il contatore", async ({ page }) => {
  await page.goto("/");
  const panel = await openAssistant(page);
  await send(page, "Aggiungi al carrello una Moka Inox 6 tazze (slug moka-inox-6)");
  await expect(panel.getByRole("link", { name: /carrello/i }).first()).toBeVisible({ timeout: ANSWER });
  await expect(page.getByRole("link", { name: /Carrello, [1-9]\d* articol/ })).toBeVisible();
});

test("traccia un ordine demo", async ({ page }) => {
  await page.goto("/");
  const panel = await openAssistant(page);
  await send(page, "Dov'è il mio ordine CF-10482? Email demo@cremaeferro.it");
  await expect(panel.getByText("Ordine CF-10482")).toBeVisible({ timeout: ANSWER });
});

test("apre una richiesta di assistenza solo dopo conferma", async ({ page }) => {
  await page.goto("/");
  const panel = await openAssistant(page);
  await send(
    page,
    "Apri subito una richiesta di assistenza: nome Mario Demo, email mario.demo@example.com, argomento guasto, messaggio: la Vapora Classica perde acqua dal gruppo. Non ho un numero d'ordine.",
  );
  const confirm = panel.getByRole("button", { name: "Invia richiesta" });
  // Some free models still ask "confermi?" in text before calling the tool: answer once and wait again.
  await expect(confirm.or(panel.getByText(/confermi|conferma|procedo/i).last())).toBeVisible({ timeout: ANSWER });
  if (!(await confirm.isVisible())) {
    await expect(panel.getByRole("button", { name: "Invia", exact: true })).toBeVisible({ timeout: ANSWER });
    await send(page, "Sì, procedi.");
  }
  await expect(confirm).toBeVisible({ timeout: ANSWER });
  await confirm.click();
  await expect(panel.getByText(/Richiesta AS-\d+ inviata/)).toBeVisible({ timeout: ANSWER });
});
