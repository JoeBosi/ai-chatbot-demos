# Assistente agli acquisti per un negozio online — 2026-09-17

Domanda: qual è oggi (settembre 2026) la soluzione migliore per un assistente che aiuta a comprare,
informa e fa assistenza su un sito e-commerce? Vincoli del proprietario: tutto sul VPS, modello a
**costo zero** (router gratuito di OpenRouter), nessuna domanda durante la realizzazione.

## Alternative valutate

| Famiglia | Esempi | Verdetto |
|---|---|---|
| SaaS di customer service con AI | Intercom Fin, Gorgias, Tidio Lyro, Zendesk AI | Pronti subito, ticketing e operatore umano; costo a conversazione, widget poco personalizzabile, niente schede prodotto né carrello modificabile |
| Assistenti di piattaforma | Shopify Sidekick, storefront agentici | Legano a Shopify; Sidekick serve il commerciante, non il cliente |
| Commercio dentro i chatbot | Agentic Commerce Protocol (OpenAI), Universal Commerce Protocol (Google) | Per farsi trovare dentro ChatGPT/Gemini, non per assistere chi è già sul sito. Passo successivo, non alternativa |
| Kit di un fornitore | OpenAI ChatKit + Agent Builder | Legati a OpenAI; Agent Builder chiude il 30/11/2026 |
| **Su misura (scelta)** | Next.js 16 + AI SDK 7 + AI Elements + Postgres/pgvector | Strumenti tipizzati sul catalogo vero, UI con prodotti/confronti/ordini, modello sostituibile da configurazione |

## Architettura scelta
- `streamText` con 8 strumenti: `searchProducts`, `getProduct`, `compareProducts`, `addToCart`, `getCart`,
  `trackOrder` (numero **e** email), `searchHelp` (RAG sul centro assistenza), `createSupportTicket`
  (con `toolApproval: 'user-approval'` firmata da `experimental_toolApprovalSecret`).
- Ricerca ibrida in SQL: `websearch_to_tsquery('italian')` + distanza coseno pgvector, fusione RRF (k=60).
- Embedding locali `Xenova/multilingual-e5-small` q8 (384 dim, prefissi `query:`/`passage:`): nessuna
  chiave né costo; il modello (~118 MB) è incluso nell'immagine Docker (`EMBEDDINGS_OFFLINE=1`).
- UI: ogni tool part ha il suo componente (card prodotto, tabella confronto, timeline ordine, conferma ticket).
- Contesto pagina (prodotto visualizzato) inviato con ogni messaggio.

## OpenRouter `openrouter/free`
- Sceglie a ogni richiesta un modello gratuito compatibile con le funzioni richieste (qui: tools);
  il modello effettivo arriva in `response.modelId` e la UI lo mostra sotto la risposta.
- Limiti dei modelli free: 20 richieste/minuto, 1000/giorno se sull'account sono stati acquistati almeno
  10 crediti (la chiave usata ha `is_free_tier: false`, verificato su `/api/v1/key` il 2026-09-17).
  Ogni turno di chat con strumenti fa 2–6 richieste al modello → `CHAT_DAILY_LIMIT=300` messaggi/giorno.
- La chiave è la stessa di Hermes e non ha tetto di spesa: il costo resta zero solo finché `AI_MODEL`
  è `openrouter/free` (o un modello `:free`). `usage_daily` era 0 dopo tutti i test.
- `provider.require_parameters: true` per non finire su provider che ignorano i tools; `reasoning.exclude`.
- I modelli gratuiti possono registrare i prompt: avviso in UI di non inserire dati reali.
- Qualità variabile: alcuni modelli chiedono conferma a parole prima del tool con approvazione →
  istruzione esplicita "non chiedere conferma a parole, c'è il pulsante".

## Trappole incontrate
- **Cookie durante lo streaming**: un tool che crea il carrello imposta il cookie quando gli header sono
  già partiti → cookie perso. Soluzione: `ensureCartId()` nella route prima di `streamText`.
- `next build` valuta i moduli delle route: nessun `throw` all'import se manca `DATABASE_URL`.
- Lo standalone non traccia i `.so` di `onnxruntime-node`: stage Docker dedicato con
  `npm install @huggingface/transformers` e rimozione dei binari darwin/win32/arm64/CUDA (immagine 770 MB).
- Streamdown usa classi Tailwind in `node_modules`: serve `@source` in `globals.css` (altrimenti elenchi senza pallini).
- Dev server aperto su `127.0.0.1`: senza `allowedDevOrigins` Next blocca l'HMR e ricarica la pagina in loop.
- Caddy: niente `encode` su `/api/chat` e `flush_interval -1` per lo streaming.
- Server Action con `redirect`: il layout radice (badge del carrello) non si aggiorna senza `revalidatePath("/", "layout")`.
- Lo storico della chat arriva dal browser: senza pulizia si aggira la quota (ultimo messaggio "assistant")
  e un'approvazione firmata si può rispedire → ticket duplicati. Vedi `sanitizeMessages` e `tool_call_id` unico.
- Streamdown carica immagini da qualsiasi origine: `components.img` sostituito col testo alternativo + CSP `img-src 'self'`.
- Alcuni modelli gratuiti scrivono la chiamata allo strumento come JSON nel testo invece di eseguirla:
  limite del router gratuito, i test E2E hanno 1 retry.

## Fonti
- https://openrouter.ai/docs/guides/routing/routers/free-router.md · https://openrouter.ai/openrouter/free
- https://openrouter.ai/docs/api/reference/limits · https://openrouter.ai/docs/guides/routing/provider-selection
- https://openrouter.ai/docs/guides/privacy/provider-logging
- https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/
- https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/
- https://theaieconomy.substack.com/p/shopify-sidekick-upgrade-agentic-storefronts
- https://developers.openai.com/api/docs/guides/chatkit
- https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling · https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage
