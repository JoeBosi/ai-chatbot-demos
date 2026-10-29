# Demo di chatbot AI

**Due siti funzionanti in cui un assistente AI lavora davvero: cerca nei dati del sito, riempie il carrello, prenota una visita, invece di limitarsi a chiacchierare.**

[English](README.md)

Entrambi i siti sono inventati e aperti a tutti. Stessa architettura, due compiti molto diversi:

| Demo | Cosa fa l'assistente | Online |
|---|---|---|
| **Crema & Ferro** (`web/`) | Negozio di attrezzatura per il caffè: consiglia e confronta prodotti, li mette nel carrello, segue gli ordini, risponde dal centro assistenza. Con un tutorial del codice passo per passo. | https://chat-bot.giuseppebosi.com |
| **Poliambulatorio Vallenova** (`clinica/`) | Clinica: trova prestazioni e medici, calcola gli orari liberi, prenota e disdice solo dopo il clic su *Conferma*, rifiuta di dare pareri medici. | https://chatbot-clinica.giuseppebosi.com |

## Cosa c'è dentro

Next.js 16, AI SDK 7 con strumenti e conferma delle azioni, modelli gratuiti di OpenRouter con riserve e protezione contro le risposte vuote, PostgreSQL con pgvector e ricerca ibrida, embedding calcolati sul server, widget da incorporare in altri siti, limiti contro l'abuso, test Playwright e Vitest, pubblicazione con Docker e Caddy, sitemap, robots.txt, llms.txt e dati strutturati.

## Avvio

Servono Docker e una chiave gratuita di [OpenRouter](https://openrouter.ai).

```bash
cd web            # oppure: cd clinica
# creare .env.production con:
#   OPENROUTER_API_KEY=...      POSTGRES_PASSWORD=...
#   TOOL_APPROVAL_SECRET=...    IP_HASH_SALT=...
./deploy.sh       # costruisce l'immagine, avvia app e Postgres, aspetta /api/health
```

Migrazioni e dati di esempio partono all'avvio. L'app ascolta solo su `127.0.0.1`: davanti serve un reverse proxy (Caddy). `./rollback.sh` torna all'immagine precedente senza toccare i dati.

## Struttura

```
web/        negozio Crema & Ferro e tutorial
clinica/    Poliambulatorio Vallenova
.claude/    configurazione dell'agente usata per costruire il progetto
docs/       note di ricerca scritte prima di ogni scelta tecnica
```

## Licenza

- **Testi e contenuti**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it)
- **Codice**: [MIT](LICENSE)

Nomi, persone, prezzi e ordini sono inventati.

## Autore

**Giuseppe Bosi**, Dottore in Ingegneria Elettronica (V.O.), Professore di Scienze e Tecnologie Informatiche.
[www.giuseppebosi.com](https://www.giuseppebosi.com) · [LinkedIn](https://www.linkedin.com/in/giuseppebosi)
