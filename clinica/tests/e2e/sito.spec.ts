import { expect, test } from "@playwright/test";

/** The site has to work without the assistant: booking by hand is the baseline. */

test("la home mostra le specialità e l'avviso della demo @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(/inventat/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Cardiologia/i }).first()).toBeVisible();
  await expect(page.getByText(/112/).first()).toBeVisible();
});

test("una prestazione mostra preparazione e disponibilità calcolate", async ({ page }) => {
  await page.goto("/prestazioni");
  await page.getByRole("link", { name: /visita cardiologica/i }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/cardiologic/i);
  await expect(page.getByText(/\d+ min/).first()).toBeVisible();
  // At least one bookable slot, and every slot links to the booking flow.
  const slot = page.locator('a[href*="/prenota?prestazione="][href*="quando="]').first();
  await expect(slot).toBeVisible();
});

test("prenota, ritrova e disdice un appuntamento senza assistente", async ({ page }) => {
  const email = `prova.${Date.now()}@example.com`;

  await page.goto("/prestazioni");
  await page.getByRole("link", { name: /visita dermatologica/i }).first().click();
  // Il link di uno slot preciso: la scheda ha anche un "prenota" generico che porta al passo 2.
  await page.locator('a[href*="/prenota?prestazione="][href*="quando="]').first().click();

  await page.getByLabel(/nome/i).fill("Prova Automatica");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/telefono/i).fill("0521 000 123");
  await page.getByRole("checkbox").check();
  // Nome esatto: "Prenota o chiedi" del lanciatore dell'assistente è un altro bottone.
  await page.getByRole("button", { name: "Conferma la prenotazione" }).click();

  await expect(page).toHaveURL(/\/prenota\/confermato/);
  const code = (await page.getByText(/PR-\d+/).first().innerText()).match(/PR-\d+/)?.[0];
  expect(code).toBeTruthy();

  // Found again only with code *and* email.
  await page.goto("/prenotazioni");
  await page.getByLabel(/codice/i).fill(code!);
  await page.getByLabel(/email/i).fill(email);
  await page.getByRole("button", { name: /cerca/i }).click();
  await expect(page.getByText(code!)).toBeVisible();

  // La disdetta è in due passaggi: un link porta alla conferma, poi il form vero.
  await page.getByRole("link", { name: /disdici/i }).first().click();
  await page.getByRole("button", { name: /sì, disdici/i }).click();
  await expect(page.getByText(/disdett/i).first()).toBeVisible();
});

test("il codice senza l'email non rivela niente", async ({ page }) => {
  await page.goto("/prenotazioni");
  await page.getByLabel(/codice/i).fill("PR-20481");
  await page.getByLabel(/email/i).fill("sconosciuto@example.com");
  await page.getByRole("button", { name: /cerca/i }).click();
  await expect(page.getByText(/non.*trovat|nessuna prenotazione/i).first()).toBeVisible();
  await expect(page.getByText(/Mario Demo/)).toHaveCount(0);
});

test("i medici mostrano giorni e stanze", async ({ page }) => {
  await page.goto("/medici");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(/luned|marted|mercoled|gioved|venerd|sabato/i).first()).toBeVisible();
  await page.getByRole("link", { name: /Ferraro|Bellani/ }).first().click();
  await expect(page.getByText(/piano \d/i).first()).toBeVisible();
});

test("dove siamo elenca le stanze per piano", async ({ page }) => {
  await page.goto("/dove-siamo");
  await expect(page.getByText(/Piano 0/i).first()).toBeVisible();
  await expect(page.getByText(/sportello referti/i).first()).toBeVisible();
});

test("nessuno scorrimento orizzontale a 390 px @mobile", async ({ page }) => {
  for (const path of ["/", "/prestazioni", "/medici", "/informazioni", "/prenota"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `scorrimento orizzontale su ${path}`).toBeLessThanOrEqual(1);
  }
});
