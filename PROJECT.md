# Chat-Bot

> The agent reads this before every task. Write `TBD` for anything undecided — never invent it.

## Goal
A public **demo shop** whose point is the **AI shopping assistant** ("il Barista"): it helps visitors
choose products, compares them, adds to the cart, tracks orders and opens support requests.
Live at **https://chat-bot.giuseppebosi.com** (shop "Crema & Ferro": products, orders and payments are invented).
The same assistant is embeddable in any site with one `<script>` (`/widget.js` + `/embed`), and
`/tutorial` teaches a reader to build and install it from zero. Two more long-form pages:
`/manutenzione` (content owner: fix answers, add/remove knowledge, tone, weekly routine) and
`/operatore` (runbook: deploy/rollback, backup, key rotation, model swap, limits, incidents).

Two sites share this folder and the same engine:
- `web/` — the shop (above), port 3040, `chat-bot.giuseppebosi.com`.
- `clinica/` — **Poliambulatorio Vallenova**, a demo outpatient clinic where the assistant books
  appointments: port 3050, `chatbot-clinica.giuseppebosi.com`, own compose project/volume.
  Born 2026-10-07 because the coffee-gear shop is too niche to show to anyone: everybody has
  booked a medical appointment. Engine reused on purpose (owner's words: "recupera il più
  possibile"); domain model, UI and content are new. See `clinica/README.md`.

## Current state
2026-10-07: both sites are **open to everyone** — the basic auth on the shop (19/09) was removed on
the owner's request; the clinic never had it. Defences stay application-side: public API key, origin
checks, per-visitor and global limits.
2026-10-07: the clinic demo is **live** at https://chatbot-clinica.giuseppebosi.com (DNS A added by the owner, Caddy block appended, backup `Caddyfile.bak.20261007-*`). Hard rules there, not style choices: the assistant gives **no
medical advice of any kind** (no symptom→exam mapping tool exists) and sends alarm symptoms to 112;
bookings and cancellations need the patient's click; appointments are real rows on real computed
slots (shifts − closures − taken), protected by a partial unique index on (doctor, start), but no
clinic exists behind them. Visitor bookings are deleted after 7 days, conversations after 30.
2026-09-19: content in `src/data/*` is **synced into the database on every app start**
(`src/lib/db/sync.ts`): seeding only ran on an empty database, so edited texts never reached the
assistant. Only rows whose embedding text changed are re-embedded. Preview with
`npm run content:check`; read what visitors asked with `npm run chats:report`; both also runnable in
production through the compose profile `tools` (throwaway container, source mounted read-only, the
only way in because the database is not published). `./rollback.sh` restores the image tagged
`:prev` that `./deploy.sh` keeps before each build.
2026-09-19: the site is behind HTTP basic auth (user `giuseppe`, password known to the owner, bcrypt
hash in the Caddy block). Open on purpose, or the embedded widget would ask third-party visitors for
the password: `/widget.js /embed /embed/* /api/chat /api/cart /api/health /_next/* /favicon.ico`.
2026-09-17: v1 online. 28 products, 10 help docs, 5 demo orders (`demo@cremaeferro.it`), cart and
fake checkout, assistant with 8 tools. E2E 8/8 green on the public URL. First chatbot built by the
owner: explain choices briefly. Why this architecture (vs SaaS assistants, Shopify, ChatKit…):
`/come-funziona` page and [`docs/research/2026-09-17-assistente-acquisti.md`](docs/research/2026-09-17-assistente-acquisti.md).

## Stack and constraints
Rationale, versions and sources: [`docs/research/2026-09-17-stack-widget-chat.md`](docs/research/2026-09-17-stack-widget-chat.md).
- TypeScript, Next.js 16.3 App Router (`output: 'standalone'`), React 19.2
- LLM: Vercel **AI SDK 7** (`streamText` + tools + tool approval, `useChat`), provider
  **OpenRouter** with model **`openrouter/free`** (zero cost, random free tool-capable model).
  Owner's rule: stay on the free router. Switchable via `AI_PROVIDER`/`AI_MODEL` (openai supported).
- Search: PostgreSQL 18 + pgvector, Drizzle 0.45; hybrid full-text (Italian) + vectors with RRF.
  Embeddings **local** (`Xenova/multilingual-e5-small`, q8, 384 dims) via `@huggingface/transformers`.
- UI: shadcn/ui + AI Elements (conversation, message/Streamdown) + Tailwind 4
- Widget: `public/widget.js` (plain JS, shadow-DOM bubble, lazy iframe) → `/embed`; `postMessage`
  with origin checks; cart cookie switches to `SameSite=None; Secure; Partitioned` on `x-cf-embed`
- Tests: Playwright E2E in `web/tests/e2e` (real model: assertions on tool results, not wording);
  `widget.spec.ts` runs from a fake host site on another origin (`tests/fixtures/host`, port 8099)
- Deploy: `web/docker-compose.yml` (app `node:24-slim` on `127.0.0.1:3040`, `pgvector/pgvector:pg18`
  not published), Caddy host block `chat-bot.giuseppebosi.com` (no compression on `/api/chat`, SSE flush)
- AI SDK 7 names: `instructions`, `onEnd`, `stream`, `isStepCount`, `toolApproval` (tutorials show v5/v6)

## Safety
- Data: visitor chat messages are stored in `chats` (hashed IP). Demo: users are told not to enter real data.
  Daily maintenance (`maintainDemoData`): carts and chats older than 30 days deleted, stock reset to catalog.
- Secrets: `web/.env.local` (dev) and `web/.env.production` (compose), both 600 and never committed.
  Names: `OPENROUTER_API_KEY`, `TOOL_APPROVAL_SECRET`, `IP_HASH_SALT`, `POSTGRES_PASSWORD`,
  `DATABASE_URL` (dev), `AI_PROVIDER`, `AI_MODEL`, `PUBLIC_SITE_URL`, `CHAT_DAILY_LIMIT`.
- Assistant guard rails: tools only read catalog/help, edit the visitor's own cookie cart, read an order
  only with number **and** email, and a support ticket needs the user's click (signed tool approval).
  `POST /api/chat` and `/api/cart` refuse a foreign `Origin` and non-JSON bodies (CSRF); the widget
  uses its own cart cookie (`cf_cart_embed`, SameSite=None + Partitioned).
  `/api/chat` and `/api/cart` also require the header `x-cf-key` = `WIDGET_PUBLIC_KEY`
  (set in compose, `cfdemo_pub_2026`), else 401. It is **public on purpose**: printed in `/tutorial`
  and shipped to every browser — a speed bump for crawlers and a knob that can be rotated, not a secret.
  Unset (dev) means not required.
  Chat history from the browser is sanitized (user: text only; every request counts against the quota;
  assistant-last only when resuming an approval). Ticket creation is idempotent per `toolCallId`.
  Checkout 5/h and cart edits 60/min per IP; Caddy caps bodies at 512 KB; container read-only, `cap_drop: ALL`.
  Rate limits: 8 msg/min and 40/day per visitor, 40 per 10 min for the whole site, global `CHAT_DAILY_LIMIT=300` msg/day (set in compose; the free router allows 1000 model requests/day); 1000 chars per message; 1200 output tokens.
- Always ask before: editing the Caddyfile beyond this site's block, DNS, ufw, systemd;
  `docker compose down -v` or anything deleting volumes; pushing; paid models or API spend.

## Definition of done
`npm run lint` and `npm run typecheck` green in `web/`; the changed flow exercised for real
(`BASE_URL=... npm run test:e2e` or curl, output shown); after deploy `./deploy.sh` prints `healthy`;
`docs/JOURNAL.md` has an entry for non-trivial decisions.

## Useful commands
```bash
./bootstrap.sh                                   # restore skills, point auto memory to .claude/memory
cd web && ./deploy.sh                            # build + restart production (keeps the DB volume)
cd web && BASE_URL=https://chat-bot.giuseppebosi.com BASIC_AUTH=giuseppe:<password> npm run test:e2e
docker start chatbot-db-dev && cd web && npm run dev   # http://127.0.0.1:3041, DB on 55432
docker compose -f web/docker-compose.yml --env-file web/.env.production logs -f app
```
Dev note: `allowedDevOrigins: ['127.0.0.1']` in `next.config.ts` is required, otherwise HMR is blocked and the page reloads in a loop.
