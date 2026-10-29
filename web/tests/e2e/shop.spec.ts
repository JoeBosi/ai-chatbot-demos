import { expect, test } from "@playwright/test";

test("il catalogo e il carrello funzionano senza assistente @mobile", async ({ page }) => {
  await page.goto("/prodotti/moka-inox-6");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Moka");
  await page.getByRole("button", { name: /Aggiungi al carrello/ }).click();
  await expect(page.getByRole("link", { name: /Carrello, [1-9]\d* articol/ })).toBeVisible();
  await page.goto("/carrello");
  await expect(page.getByText("Moka Inox").first()).toBeVisible();
});

test("lo stato dell'ordine richiede l'email giusta", async ({ page }) => {
  await page.goto("/ordini?numero=CF-10482&email=demo@cremaeferro.it");
  await expect(page.getByText(/CF-10482/).first()).toBeVisible();
  await page.goto("/ordini?numero=CF-10482&email=altro@example.com");
  await expect(page.getByText(/Spedito/i)).toHaveCount(0);
});

test("checkout demo: dal carrello alla conferma", async ({ page }) => {
  await page.goto("/prodotti/lattiera-350");
  await page.getByRole("button", { name: /Aggiungi al carrello/ }).click();
  await expect(page.getByRole("link", { name: /Carrello, [1-9]\d* articol/ })).toBeVisible();
  await page.goto("/carrello");
  await page.locator('input[name="name"]').fill("Prova Checkout");
  await page.locator('input[name="email"]').fill("checkout.demo@example.com");
  await page.locator('input[name="city"]').fill("Parma");
  await page.getByRole("button", { name: /ordin|conferma/i }).click();
  await expect(page.getByRole("heading", { name: "Grazie, ordine ricevuto" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Carrello, 0 articoli/ })).toBeVisible();
});
