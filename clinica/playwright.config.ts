import { defineConfig, devices } from "@playwright/test";

// Runs against an already running site: BASE_URL=https://chatbot-clinica.giuseppebosi.com npx playwright test
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [["list"]],
  // Serves the fake host site on another origin: embedding must be tested cross-origin.
  webServer: {
    command: "python3 -m http.server 8099 --bind 127.0.0.1 --directory tests/fixtures/host",
    url: "http://127.0.0.1:8099/index.html",
    reuseExistingServer: true,
    stdout: "ignore",
  },
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3041",
    // The public site is behind a password: BASIC_AUTH="utente:password" npx playwright test
    httpCredentials: process.env.BASIC_AUTH
      ? {
          username: process.env.BASIC_AUTH.split(":")[0],
          password: process.env.BASIC_AUTH.slice(process.env.BASIC_AUTH.indexOf(":") + 1),
        }
      : undefined,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
});
