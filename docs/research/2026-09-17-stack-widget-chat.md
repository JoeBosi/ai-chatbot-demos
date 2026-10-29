# Stack per il widget chat web — 2026-09-17

Domanda: stack moderno e professionale per un widget chat incorporabile (bolla + snippet `<script>`),
LLM multi-provider (OpenAI e altri, non solo Anthropic), self-hosted sul VPS con Docker.
Versioni verificate con `npm view <pkg> version` il 2026-09-17.

## Decisione

| Livello | Scelta | Versione | Perché |
|---|---|---|---|
| Runtime | Node.js, `node:24-alpine` | Node ≥ 22 | AI SDK 7 richiede Node 22+ ed è solo ESM |
| Framework | Next.js App Router, `output: 'standalone'` | next 16.3.5, react 19.3.0 | UI, API e pagina embed in un solo processo/container |
| LLM | Vercel AI SDK | ai 7.0.105, @ai-sdk/react 4.0.108, @ai-sdk/openai 4.0.69, @ai-sdk/google 4.0.74, @ai-sdk/openai-compatible 3.0.51 | multi-provider, streaming, `useChat`. Gateway Vercel NON necessario: passare un'istanza provider (`openai('…')`); un id stringa `"vendor/model"` passa invece dal gateway |
| UI chat | AI Elements + shadcn/ui + Tailwind | ai-elements 1.9.0, shadcn 4.21.0, tailwindcss 4.3.3 | componenti ufficiali per AI SDK, codice copiato nel progetto |
| Validazione | zod | 4.6.5 | input API |
| DB | PostgreSQL 18 + pgvector (`pgvector/pgvector:pg18`) | pgvector 0.8.x | storico + RAG in un solo DB |
| ORM | Drizzle | drizzle-orm 0.45.2, drizzle-kit 0.31.10 | leggero, tipizzato, pgvector; v1 ancora RC → restare su 0.45 |
| Rate limit | rate-limiter-flexible | 11.2.0 | nessun servizio esterno |
| Auth admin | Better Auth | 1.7.5 | solo pannello gestore |
| Test | Vitest, Playwright, `MockLanguageModelV4` (`ai/test`) | vitest 5.0.1, @playwright/test 1.63.0 | test deterministici senza LLM reale |
| Eval risposte | promptfoo | 0.123.0 | open source, multi-provider |

## Trappole AI SDK 7 (molti tutorial sono ancora v5/v6)
- `system` → `instructions`; `onFinish` → `onEnd`; `fullStream` → `stream`.
- `result.toUIMessageStreamResponse()` deprecato → `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`.
- `createProviderRegistry` per più provider: da ricontrollare sulla doc v7 prima di usarlo.

## Scartati
- FastAPI + LiteLLM / OpenAI Agents SDK: due linguaggi/container; LiteLLM compromesso su PyPI a marzo 2026 (1.82.7–1.82.8).
- OpenAI ChatKit: Agent Builder chiude il 30/11/2026, legato a OpenAI.
- assistant-ui 0.15: valido ma 0.x e un livello di runtime in più.
- CopilotKit / AG-UI: pensato per copiloti in-app, eccessivo per una bolla.
- Prisma: più pesante, canale latest in RC.

## Embedding e sicurezza
- `widget.js` (JS puro) crea il bottone e, su apertura, un **iframe** verso `/embed/{siteId}`: isolamento vero di DOM/JS/storage (Shadow DOM isola solo lo stile).
- Pagina ↔ iframe via `postMessage`, controllando sempre `event.origin`.
- `/embed`: `Content-Security-Policy: frame-ancestors <origini consentite del sito>` letto dal DB. Non coprirlo con un `frame-ancestors 'none'` globale nel reverse proxy.
- `/api/chat` è same-origin con l'iframe → CORS chiuso; verificare siteId + Origin/Referer (falsificabili fuori dal browser).
- Rate limit per IP (`X-Real-IP` dal proxy) e per sito, lunghezza max messaggio, `maxOutputTokens`, budget giornaliero per sito.
- Chiavi provider solo in env server. Nessun tool con azioni all'inizio (limita la prompt injection).
- Id conversazione nel localStorage dell'iframe (partizionato per sito ospite).
- Schema minimo: `sites(allowed_origins[], instructions, model)`, `conversations`, `messages(parts jsonb)`, opz. `chunks(embedding vector)`.

## Convenzioni VPS (da Klarnus e dal contesto del VPS_Controller)
- Caddy sull'host come reverse proxy (HTTPS automatico), blocco in coda al Caddyfile, poi `caddy validate` + reload. È **configurazione condivisa** → solo con conferma (R7).
- Porta pubblicata **solo su loopback** (`127.0.0.1:<porta>:<porta interna>`): su 0.0.0.0 Docker scavalca ufw. Candidata libera il 2026-09-17: 3040.
- Compose: `restart: unless-stopped`, volume con nome, healthcheck su `/api/health`, Dockerfile multi-stage con utente `node`; Postgres non pubblicato sull'host.
- Standalone: copiare `public` e `.next/static`, avviare `node server.js` con `HOSTNAME=0.0.0.0`.
- Sottodominio: record A verso l'IP del VPS (fallback `nip.io`). Nome del dominio: TBD.

## Fonti
- https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0
- https://ai-sdk.dev/docs/ai-sdk-core/testing
- https://ai-sdk.dev/providers/ai-sdk-providers/openai
- https://elements.ai-sdk.dev/ · https://github.com/vercel/ai-elements
- https://ui.shadcn.com/docs/changelog/2026-06-chat-components
- https://www.assistant-ui.com/docs/integrations/frameworks/ai-sdk
- https://developers.openai.com/api/docs/guides/chatkit · https://platform.openai.com/docs/guides/custom-chatkit
- https://github.com/copilotkit/copilotkit
- https://docs.litellm.ai/blog/security-update-march-2026
- https://orm.drizzle.team/roadmap
- https://hub.docker.com/r/pgvector/pgvector
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- https://nextjs.org/docs/app/guides/content-security-policy
- https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors
- https://www.promptfoo.dev/blog/promptfoo-joining-openai/
