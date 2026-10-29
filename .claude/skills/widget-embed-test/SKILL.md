---
name: widget-embed-test
description: End-to-end check that the Chat-Bot widget really works when embedded in a third-party site - loader script, lazy iframe, frame-ancestors, postMessage open/close, third-party cart cookie, style isolation and a streaming reply, all from another origin. Use after any change to widget.js, the /embed page, /api/chat, CSP/headers or site settings, before a deploy, and whenever someone asks whether the widget "works on a site".
---

# Widget embed test

The widget runs on other people's origins, so testing `/embed` directly on the app origin proves
little. Always test from a **different origin** that plays the host site.

## Setup
1. App running: the container on `http://127.0.0.1:3040`, or `npm run dev` on `:3041`.
2. Host page on **another origin**. It is already in the repo and Playwright starts it by itself
   (`webServer` in `playwright.config.ts`):
   ```bash
   python3 -m http.server 8099 --bind 127.0.0.1 --directory tests/fixtures/host
   # open http://localhost:8099/index.html?app=http://127.0.0.1:3040
   ```
   The fixture loads `<app>/widget.js` from the `?app=` parameter and forces
   `button { background: red !important }`, which is the isolation check.
3. This project has **no per-site id**: `/embed` is open to every origin on purpose, and the host
   origin only arrives as `?host=` to aim the postMessage. If a site allow-list is ever added,
   checks 3 and 6 below go back to the stricter form (`frame-ancestors <origins>`, foreign origin
   refused).

## Checks — `tests/e2e/widget.spec.ts` covers them; run it, do not re-do it by hand
```bash
BASE_URL=http://127.0.0.1:3040 npx playwright test tests/e2e/widget.spec.ts
BASE_URL=https://chat-bot.giuseppebosi.com BASIC_AUTH=giuseppe:<password> npx playwright test tests/e2e/widget.spec.ts
```
| # | Check | Pass when |
|---|---|---|
| 1 | Loader | host page loads `widget.js` with no console error; bubble visible |
| 2 | Lazy iframe | no iframe before the click; one iframe to `/embed?host=<host origin>` after it |
| 3 | Headers | `/embed` has **no** `frame-ancestors`; every other path keeps `frame-ancestors 'self'` |
| 4 | Chat | a message inside the iframe gets a real streamed answer |
| 5 | postMessage | the close button closes the frame; a `cf-widget` message from the host origin is ignored |
| 6 | Cart | POST+GET `/api/cart` from inside the frame keeps the line (cookie `SameSite=None; Partitioned`) |
| 7 | Isolation | the host page's `!important` button styles do not reach the bubble (shadow DOM) |
| 8 | Mobile | 390×844: no horizontal scroll, the frame fills the screen |

The widget paths must stay out of the Caddy basic-auth matcher (`/widget.js /embed /embed/*
/api/chat /api/cart /_next/*`), otherwise a third-party site shows a password box inside the iframe.

## Report
One line per check: pass/fail with the real evidence (test output, header line, screenshot path).
Any failure on 3, 5 or 6 is a security bug: hand it to the `widget-security-reviewer` subagent.
