# Poliambulatorio Vallenova — demo con assistente che prenota

Secondo sito dimostrativo del progetto Chat-Bot, nato dalla stessa base del negozio
(`../web`): stesso motore (Next.js 16 + AI SDK 7 + Postgres/pgvector, widget incorporabile,
limiti e difese), dominio applicativo completamente diverso.

**Online:** https://chatbot-clinica.giuseppebosi.com — aperto a tutti, nessuna password.

Tutto è **inventato**: struttura, indirizzo, medici, prestazioni, prezzi. Le prenotazioni
vengono salvate nel database della demo e non raggiungono nessuna struttura reale.

## Cosa fa l'assistente

Orientarsi fra specialità e prestazioni, dire come prepararsi a un esame, chi lo esegue e in
che giorni, mostrare le **disponibilità vere** (calcolate dai turni dei medici meno le assenze
e meno gli appuntamenti già presi), **prenotare** dopo il clic di conferma del paziente,
ritrovare o **disdire** una prenotazione con codice + email, dire dov'è una stanza.

Cosa non fa, per scelta e con regole esplicite nelle istruzioni: **nessun parere medico**, nessuna
diagnosi, nessuna indicazione su quale esame serva per un sintomo; davanti a sintomi d'allarme
rimanda al **112**.

## Mappa

```
src/data/            i contenuti inventati (specialità, medici, prestazioni, stanze, turni, informazioni)
src/lib/agenda.ts    il motore dell'agenda: slot, prenotazione, disdetta
src/lib/clinica.ts   ricerca ibrida (testo + significato) su prestazioni e informazioni
src/lib/ai/          istruzioni (i divieti) e attrezzi dell'assistente
src/lib/db/          schema, primo popolamento e sincronizzazione dei contenuti
src/app/(sito)/      il sito pubblico
src/app/embed/       la chat da sola, per il widget
public/widget.js     la riga da incollare in un altro sito
```

## Comandi

```bash
npm run dev            # http://127.0.0.1:3051
npm run lint && npm run typecheck
npm run content:check  # cosa cambierebbe nel database rispetto a src/data/*
npm run chats:report   # cosa hanno chiesto i visitatori

./deploy.sh            # build + riavvio + attesa di /api/health (porta 3050)
./rollback.sh          # rimette l'immagine chatbot-clinica:prev

BASE_URL=https://chatbot-clinica.giuseppebosi.com npm run test:e2e
```

In produzione il database non è pubblicato: i comandi che devono parlarci passano dal profilo
`tools` del compose, come nel progetto del negozio.

## Differenze rispetto al negozio

| | negozio (`../web`) | clinica (qui) |
|---|---|---|
| transazione | carrello e ordine finto | appuntamento su slot reali, con vincolo anti-doppia-prenotazione |
| dati sensibili | nessuno | nome/email/telefono: conservati 7 giorni, nessun dato clinico richiesto |
| limiti dell'assistente | non inventa prezzi | **non dà pareri medici**, emergenze al 112 |
| chiave pubblica API | `cfdemo_pub_2026` | `vndemo_pub_2026` |
| porta | 3040 | 3050 |
| modello | router gratuito OpenRouter | uguale |
