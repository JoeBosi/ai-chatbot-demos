# Crema & Ferro — negozio demo con assistente AI

Sito pubblicato su https://chat-bot.giuseppebosi.com. Decisioni, sicurezza e comandi: `../PROJECT.md`.

## Mappa
- `src/app/api/chat/route.ts` — endpoint dell'assistente (AI SDK 7 `streamText`, strumenti, limiti, log in `chats`)
- `src/lib/ai/` — provider (OpenRouter `openrouter/free`), istruzioni del Barista, strumenti
- `src/lib/{catalog,help,cart,orders}.ts` — ricerca ibrida, carrello via cookie, ordini
- `src/lib/db/` — schema Drizzle, migrazioni (`drizzle/`) e seed eseguiti all'avvio da `src/instrumentation.ts`
- `src/data/` — catalogo, centro assistenza e ordini demo (inventati)
- `src/components/assistant/` — pannello chat e rendering delle parti degli strumenti
- `public/widget.js` + `src/app/embed/` — il widget incorporabile in siti terzi
- `src/app/(shop)/tutorial/` — tutorial pubblico (testo nella pagina, codice in `snippets.ts`)
- `tests/e2e/` — Playwright contro un sito in esecuzione (`BASE_URL`); `widget.spec.ts` parte da
  un'altra origine (pagina finta in `tests/fixtures/host`, servita da `webServer`)

## Comandi
```bash
npm run dev          # http://127.0.0.1:3041 (serve il DB di sviluppo: docker start chatbot-db-dev)
npm run lint && npm run typecheck
BASE_URL=https://chat-bot.giuseppebosi.com BASIC_AUTH=giuseppe:<password> npm run test:e2e

npm run content:check   # anteprima: cosa cambierebbe nel DB rispetto a src/data/* (niente scritture)
npm run content:sync    # applica (la stessa sincronizzazione gira a ogni avvio del container)
npm run chats:report    # cosa hanno chiesto i visitatori (sola lettura, IP solo come impronta)

# in produzione il DB non è pubblicato: gli stessi comandi passano dal profilo "tools"
docker compose --env-file .env.production --profile tools run --rm tools scripts/content.ts --dry-run
docker compose --env-file .env.production --profile tools run --rm tools scripts/chats.ts

./deploy.sh             # build + riavvio + attesa di /api/health
./rollback.sh           # rimette l'immagine chat-bot-web:prev (solo codice, mai i dati)
./deploy.sh          # build e riavvio in produzione, il volume del DB resta
```
