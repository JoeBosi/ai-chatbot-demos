# AI Chatbot Demos

**Two working websites where an AI assistant does real work — it searches the site's own data, fills a cart, books an appointment — instead of just chatting.**

[Italiano](README.it.md)

Both sites are fictional and open to everyone. They share one architecture and do two very different jobs:

| Demo | What the assistant does | Live |
|---|---|---|
| **Crema & Ferro** (`web/`) | A coffee-gear shop: recommends and compares products, adds them to the cart, tracks orders, answers from the help center. Includes a step-by-step tutorial of the code. | https://chat-bot.giuseppebosi.com |
| **Poliambulatorio Vallenova** (`clinica/`) | A medical clinic: finds services and doctors, computes free slots, books and cancels only after the patient clicks *Confirm*, and refuses to give medical advice. | https://chatbot-clinica.giuseppebosi.com |

The sites, their content and some internal notes are in Italian; this README is the English entry point.

## What is inside

- **Next.js 16** (App Router), **React 19**, **Tailwind CSS**, **shadcn/ui**, **AI Elements**
- **Vercel AI SDK 7**: streaming chat, typed tools, user approval for every action that changes data
- **OpenRouter** free models: a preferred model, fallbacks, and a stream guard that never shows an empty reply or the model "thinking out loud"
- **PostgreSQL + pgvector** with **Drizzle ORM**: hybrid search (full text + vectors, fused with RRF)
- Local embeddings (**multilingual-e5-small** via Transformers.js): no external embedding service
- An embeddable **widget** (`<script>` + lazy iframe) for third-party sites
- Abuse protection: per-visitor and site-wide rate limits, public widget key, origin and content-type checks, body size limits
- **Playwright** end-to-end tests and **Vitest** unit tests
- Deployment with **Docker Compose** behind **Caddy**: `deploy.sh` and `rollback.sh`
- Search and AI friendliness: `sitemap.xml`, `robots.txt`, `llms.txt`, Open Graph, JSON-LD

## Run it

Requirements: Docker and a free [OpenRouter](https://openrouter.ai) API key.

```bash
cd web            # or: cd clinica
# create .env.production with:
#   OPENROUTER_API_KEY=...      POSTGRES_PASSWORD=...
#   TOOL_APPROVAL_SECRET=...    IP_HASH_SALT=...
./deploy.sh       # builds the image, starts app + Postgres, waits for /api/health
```

Migrations and seed data run when the app starts. The app listens on `127.0.0.1` only: put a reverse proxy (Caddy) in front of it. `./rollback.sh` returns to the previous image without touching the data. Each app's `README.md` lists the development commands.

## Structure

```
web/        Crema & Ferro shop + tutorial (Next.js app, own database and compose file)
clinica/    Vallenova clinic (same stack, different tools and rules)
.claude/    Agent setup used to build the project: skills, reviewers, rules
docs/       Research notes written before each technical choice
```

## License

- **Texts and content** (pages, catalog, clinic information, tutorial): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Code**: [MIT](LICENSE)

Names, people, prices and orders are invented; any resemblance to real businesses or people is coincidental.

## Author

**Giuseppe Bosi** — Master's-level degree in Electronic Engineering (5-year Italian Laurea, pre-reform, EQF level 7); teacher of Computer Science and Technology in Italian secondary schools.
[www.giuseppebosi.com](https://www.giuseppebosi.com) · [LinkedIn](https://www.linkedin.com/in/giuseppebosi)
