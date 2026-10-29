import { expect, test, type Page } from "@playwright/test";

const WIDGET_KEY = process.env.WIDGET_PUBLIC_KEY ?? "cfdemo_pub_2026";

// The widget lives on other people's sites, so every check here starts from a different origin
// (the fake host site on 127.0.0.1:8099) and never from the app itself.
const HOST = "http://localhost:8099/index.html";
const ANSWER = 120_000;

function hostPage(baseURL: string | undefined) {
  return `${HOST}?app=${encodeURIComponent(baseURL ?? "")}`;
}

async function openWidget(page: Page) {
  const bubble = page.locator("button.bolla");
  await expect(bubble).toBeVisible();
  await bubble.click();
  const frame = page.locator('iframe[src*="/embed"]');
  await expect(frame).toBeVisible();
  return page.frameLocator('iframe[src*="/embed"]');
}

test("il caricatore disegna la bolla e apre l'iframe solo al clic", async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(hostPage(baseURL));
  await expect(page.locator("button.bolla")).toBeVisible();
  expect(await page.locator("iframe").count()).toBe(0);

  await openWidget(page);
  const src = await page.locator("iframe").first().getAttribute("src");
  expect(src).toContain("/embed?host=");
  expect(src).toContain(encodeURIComponent("http://localhost:8099"));
  expect(errors).toEqual([]);
});

test("gli stili del sito ospite non entrano nel widget", async ({ page, baseURL }) => {
  await page.goto(hostPage(baseURL));
  const bubble = page.locator("button.bolla");
  const color = await bubble.evaluate((el) => getComputedStyle(el).backgroundColor);
  const size = await bubble.evaluate((el) => getComputedStyle(el).fontSize);
  // The host page forces every button red/yellow/30px with !important.
  expect(color).toBe("rgb(18, 58, 47)");
  expect(size).toBe("15px");
});

test("/embed può essere incorniciato da chiunque, il resto del sito no", async ({ request, baseURL }) => {
  const embed = await request.get(`${baseURL}/embed`);
  const site = await request.get(`${baseURL}/`);
  expect(embed.headers()["content-security-policy"] ?? "").not.toContain("frame-ancestors");
  expect(site.headers()["content-security-policy"] ?? "").toContain("frame-ancestors 'self'");
});

test("la chat risponde dentro il widget e i messaggi estranei sono ignorati", async ({ page, baseURL }) => {
  await page.goto(hostPage(baseURL));
  const chat = await openWidget(page);

  const input = chat.getByLabel("Scrivi al Barista");
  await input.fill("Quanto costa la spedizione?");
  await input.press("Enter");
  await expect(chat.getByRole("button", { name: "Invia", exact: true })).toBeVisible({ timeout: ANSWER });
  // Free shipping over 49 euro is in the help docs the assistant searches.
  await expect(chat.locator("body")).toContainText(/spedizion|49/i);

  // A close message from the host page itself (wrong origin) must not close the widget.
  await page.evaluate(() => window.postMessage({ type: "cf-widget", action: "close" }, "*"));
  await page.waitForTimeout(300);
  await expect(page.locator('iframe[src*="/embed"]')).toBeVisible();

  // The close button inside the chat asks the host page to close the frame.
  await chat.getByRole("button", { name: "Chiudi l'assistente" }).click();
  await expect(page.locator('iframe[src*="/embed"]')).toBeHidden();
  await expect(page.locator("button.bolla")).toBeVisible();
});

test("su telefono il widget occupa lo schermo senza scorrimento laterale @mobile", async ({ page, baseURL }) => {
  await page.goto(hostPage(baseURL));
  const chat = await openWidget(page);
  await expect(chat.getByLabel("Scrivi al Barista")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const box = await page.locator('iframe[src*="/embed"]').boundingBox();
  expect(box?.width).toBeGreaterThan(300);
});

test("il carrello funziona anche nel widget (cookie di terza parte)", async ({ page, baseURL }) => {
  await page.goto(hostPage(baseURL));
  await openWidget(page);
  const frame = page.frames().find((f) => f.url().includes("/embed"));
  expect(frame).toBeTruthy();

  // Same calls the chat makes: without SameSite=None + Partitioned the cookie would be dropped here.
  // `x-cf-key` is the public key printed in /tutorial: the API answers 401 without it.
  const result = await frame!.evaluate(async (key) => {
    const headers = { "Content-Type": "application/json", "x-cf-embed": "1", "x-cf-key": key };
    await fetch("/api/cart", { method: "POST", headers, body: JSON.stringify({ slug: "moka-inox-6", quantity: 1, mode: "set" }) });
    const res = await fetch("/api/cart", { cache: "no-store", headers: { "x-cf-embed": "1", "x-cf-key": key } });
    return (await res.json()) as { itemCount: number; lines: { slug: string }[] };
  }, WIDGET_KEY);
  expect(result.itemCount).toBe(1);
  expect(result.lines[0].slug).toBe("moka-inox-6");
});
