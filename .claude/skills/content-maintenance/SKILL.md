---
name: content-maintenance
description: Aggiornare quello che l'assistente sa e come risponde (catalogo, centro assistenza, tono) e far arrivare davvero le modifiche in produzione. Usare quando si chiede di correggere una risposta, aggiungere/togliere informazioni, cambiare tono o capire perché una modifica ai testi non ha effetto.
---

# Manutenzione dei contenuti dell'assistente

## Dove si cambia cosa
| Sintomo | File |
|---|---|
| prezzo, scorte, descrizione, prodotto nuovo | `web/src/data/catalog.ts` |
| spedizioni, resi, garanzia, guide, orari, FAQ | `web/src/data/help.ts` (una sezione = un `## `) |
| tono, lunghezza, regole di comportamento | `web/src/lib/ai/instructions.ts` (max ~25 righe) |
| cosa l'assistente *può fare* | `web/src/lib/ai/tools.ts` (serve codice) |

I dati non si correggono nelle istruzioni e le regole di comportamento non si correggono nei dati:
sbagliare lato rompe le altre risposte.

## Il giro completo
```bash
cd web
npm run content:check     # anteprima (+ aggiunto, ~ modificato, - rimosso), non scrive niente
./deploy.sh               # pubblica; all'avvio il container sincronizza src/data/* nel database
```
In produzione, senza ricostruire l'immagine (il DB non è raggiungibile da fuori):
```bash
docker compose --env-file .env.production --profile tools run --rm tools scripts/content.ts --dry-run
docker compose --env-file .env.production --profile tools run --rm tools scripts/content.ts
```

## Da sapere
- Il seed originale gira **solo a database vuoto**: senza `syncContent()` (`src/lib/db/sync.ts`) una
  modifica ai testi non arriverebbe mai all'assistente. È la trappola numero uno.
- Si ricalcola l'embedding **solo** se cambia il testo che lo genera (nome, brand, summary,
  description, tags per i prodotti; titolo, sezione e corpo per l'assistenza). Cambiare un prezzo
  non ricalcola niente.
- Confronti su colonne `jsonb` con chiavi ordinate (`stable()`), se no Postgres fa sembrare
  modificate tutte le righe.
- Cancellare una sezione non fa dire "non lo so": l'assistente pesca la più simile. Meglio riscriverla.
- Dopo ogni modifica: rifare le domande di prova elencate in `/manutenzione` cap. 10 e, se è
  importante, `npm run test:e2e`.
- Cosa chiedono i visitatori (per sapere cosa scrivere): `npm run chats:report` o lo stesso script
  via profilo `tools`.

Le pagine pubbliche che spiegano tutto questo agli umani: `/manutenzione` (contenuti) e `/operatore`
(servizio). Se cambia il codice, vanno riallineate anche quelle e i loro `snippets.ts`.
