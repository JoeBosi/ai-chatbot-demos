// Comandi del manuale dell'operatore. Sono gli stessi che girano su questo VPS: se cambia il
// deploy o il compose, vanno riallineati qui.

export const snippetMappa = `Internet
   │  HTTPS (certificati automatici)
   ▼
Caddy (sul VPS, porta 443)
   │  password sul sito, NON su /widget.js /embed /api/*
   │  niente compressione su /api/chat (è uno stream)
   ▼
container "app"  →  127.0.0.1:3040   (Next.js, sola lettura, senza privilegi)
   │                                  qui gira anche il calcolo degli embedding
   ▼
container "db"   →  Postgres 18 + pgvector, NON pubblicato su internet
                     volume "dbdata": catalogo, centro assistenza, carrelli, ordini, chat

Fuori dal VPS: solo il fornitore del modello (OpenRouter). Gli embedding sono in casa.`;

export const snippetOgniGiorno = `# 1. il sito risponde e il database è raggiungibile
curl -fsS https://chat-bot.giuseppebosi.com/api/health     # {"status":"ok"}

# 2. i container sono su e non si riavviano in continuazione
docker compose --env-file .env.production ps

# 3. errori nelle ultime ore
docker compose --env-file .env.production logs --since 24h app | grep -iE "error|fail|429|503"

# spazio su disco (le immagini Docker crescono a ogni deploy)
df -h / && docker system df`;

export const snippetDeploy = `# pubblicare (ricostruisce, riavvia, aspetta che /api/health risponda)
./deploy.sh

# tornare all'immagine precedente, se il deploy ha rotto qualcosa (pochi secondi)
./rollback.sh

# cosa fa davvero: prima di ricostruire, deploy.sh marca l'immagine in uso come :prev
docker images chat-bot-web        # latest = in produzione, prev = quella prima, broken = l'ultima annullata

# ATTENZIONE: il rollback riporta indietro il CODICE, mai i dati. Una migrazione già applicata
# resta applicata: se il problema è una migrazione, serve il ripristino del backup.`;

export const snippetStrumenti = `# I comandi di manutenzione girano dentro la rete di Docker, perché il database non è
# raggiungibile da fuori. Il profilo "tools" esiste solo per questo e non tiene su niente.

# anteprima: cosa cambierebbe nel database rispetto ai file src/data/*
docker compose --env-file .env.production --profile tools run --rm tools \\
  scripts/content.ts --dry-run

# applicarlo subito senza ricostruire l'immagine (di solito basta ./deploy.sh)
docker compose --env-file .env.production --profile tools run --rm tools scripts/content.ts

# cosa hanno chiesto i clienti negli ultimi 7 giorni (sola lettura, niente IP in chiaro)
docker compose --env-file .env.production --profile tools run --rm tools scripts/chats.ts

# la stessa sincronizzazione gira da sola a ogni avvio del container:
docker compose --env-file .env.production logs app | grep "contenuti aggiornati"`;

export const snippetBackup = `# BACKUP (da mettere in cron: ci mette due secondi e pesa qualche centinaio di KB)
cd /root/Developer/Chat-Bot/web
docker compose --env-file .env.production exec -T db \\
  pg_dump -U chatbot -d chatbot --no-owner | gzip > ~/backup/chatbot-$(date +%F).sql.gz

# esempio di riga di cron: ogni notte alle 3:20, tenendo 14 giorni
# 20 3 * * * cd /root/Developer/Chat-Bot/web && docker compose --env-file .env.production exec -T db pg_dump -U chatbot -d chatbot --no-owner | gzip > ~/backup/chatbot-$(date +\\%F).sql.gz && find ~/backup -name 'chatbot-*.sql.gz' -mtime +14 -delete

# RIPRISTINO (cancella e riscrive i dati: fermare prima l'app)
docker compose --env-file .env.production stop app
gunzip -c ~/backup/chatbot-2026-09-19.sql.gz | \\
  docker compose --env-file .env.production exec -T db psql -U chatbot -d chatbot
docker compose --env-file .env.production start app

# MAI: docker compose down -v   ← la -v cancella il volume "dbdata", cioè tutto il database.
# Per riavviare i container basta: docker compose --env-file .env.production restart`;

export const snippetChiavi = `# I segreti stanno in web/.env.production (permessi 600, mai nel repository).
# Nomi, non valori:
#   OPENROUTER_API_KEY     chiave del fornitore del modello — l'unica che costa soldi se esce
#   TOOL_APPROVAL_SECRET   firma le approvazioni ("Invia richiesta"): 64 caratteri casuali
#   IP_HASH_SALT           sale dell'impronta dell'IP: senza, gli hash sarebbero indovinabili
#   POSTGRES_PASSWORD      password del database (usata anche dal compose)
#   PUBLIC_SITE_URL        indirizzo pubblico, usato nei link
# In docker-compose.yml, in chiaro perché non sono segreti:
#   CHAT_DAILY_LIMIT       tetto giornaliero di messaggi per tutto il sito
#   WIDGET_PUBLIC_KEY      chiave pubblica delle API, scritta anche nel tutorial

# generare un valore casuale nuovo
openssl rand -hex 32

# dopo ogni modifica del file:
./deploy.sh        # oppure: docker compose --env-file .env.production up -d

# Cosa succede ruotando ciascuna:
#   OPENROUTER_API_KEY    → nessun effetto sui clienti (revoca subito la vecchia sul sito del fornitore)
#   TOOL_APPROVAL_SECRET  → le approvazioni aperte in quel momento vanno rifatte dal cliente
#   IP_HASH_SALT          → i contatori per visitatore ripartono da zero
#   POSTGRES_PASSWORD     → va cambiata ANCHE nel database, se no l'app non entra più:
#       docker compose --env-file .env.production exec db \\
#         psql -U chatbot -d chatbot -c "alter user chatbot with password 'nuova'"`;

export const snippetModello = `# Il modello si sceglie con due variabili (in .env.production):
#   AI_PROVIDER=openrouter        openrouter | openai
#   AI_MODEL=openrouter/free      gratuito: pesca un modello libero capace di usare gli strumenti

# Alternative a pagamento, in ordine di costo (prezzi di settembre 2026, ~1.000 messaggi):
#   mistralai/mistral-small-3.2-24b-instruct   ~0,34 $   risposte costanti
#   z-ai/glm-5.3-flash                          ~0,35 $   molto affidabile con gli strumenti
#   openai/gpt-oss-120b                         ~0,62 $   il migliore sui testi lunghi

# chi ha risposto davvero, conversazione per conversazione:
docker compose --env-file .env.production exec -T db psql -U chatbot -d chatbot \\
  -c "select model, count(*) from chats where updated_at > now() - interval '2 days' group by 1 order by 2 desc;"

# Sintomi tipici del router gratuito, e cosa fare:
#   "Nessun modello gratuito disponibile" o risposte troncate  → siamo oltre i 1000 al giorno: aspetta o passa a pagamento
#   scrive la chiamata allo strumento come testo JSON          → modello scadente pescato a caso: riprova, o fissa un modello
#   risposte lentissime (>30 s)                                 → fornitore sovraccarico: fissa un modello a pagamento`;

export const snippetLimiti = `// src/lib/rate-limit.ts — le manopole dei limiti (richiedono un deploy)
const perVisitorBurst = new RateLimiterMemory({ points: 8, duration: 60 });     // 8 messaggi/minuto
const perVisitorDaily = new RateLimiterMemory({ points: 40, duration: 86400 }); // 40 messaggi/giorno
const globalBurst = new RateLimiterMemory({ points: 40, duration: 600 });       // 40 ogni 10 minuti, tutto il sito
const globalDaily = ... process.env.CHAT_DAILY_LIMIT                            // tetto del giorno (compose)

# I contatori stanno in memoria: si azzerano al riavvio del container.
docker compose --env-file .env.production restart app

# Quanti rifiuti ci sono stati (429) nelle ultime 24 ore, visti da Caddy:
journalctl -u caddy --since "24 hours ago" | grep -c '"status":429'`;

export const snippetPronto = `# log in diretta (Ctrl-C per uscire)
docker compose --env-file .env.production logs -f app

# ultime 200 righe, solo errori
docker compose --env-file .env.production logs --tail 200 app | grep -iE "error|unhandled|fatal"

# riavviare solo l'applicazione (riallinea anche i contenuti e azzera i limiti)
docker compose --env-file .env.production restart app

# entrare nel database
docker compose --env-file .env.production exec db psql -U chatbot -d chatbot

# conteggi utili una volta dentro:
#   select count(*) from products;    -- 27 se il catalogo è a posto
#   select count(*) from kb_chunks;   -- le sezioni del centro assistenza
#   select count(*) from chats where updated_at > now() - interval '1 day';

# spazio: le immagini vecchie si accumulano a ogni deploy
docker image prune -f            # toglie le immagini senza nome (NON tocca latest/prev)`;

export const snippetCaddy = `# Il Caddyfile è condiviso con gli altri siti del VPS: backup, verifica, ricarica. Sempre in
# quest'ordine, e mai un riavvio secco (butterebbe giù anche gli altri siti).
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%Y%m%d-%H%M%S)
sudo nano /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile      # se non è valido, NON ricaricare
sudo systemctl reload caddy                            # ricarica senza interrompere le connessioni
systemctl status caddy --no-pager

# cambiare la password del sito (basic_auth): si scrive l'impronta, mai la password
caddy hash-password --plaintext 'la-nuova-password'
# → incollare l'hash nella riga dell'utente, poi validate + reload

# i percorsi esclusi dalla password devono restare esclusi, o il widget smette di funzionare
# nei siti di chi l'ha installato:
#   @protetto not path /widget.js /embed /embed/* /api/chat /api/cart /api/health /_next/* /favicon.ico`;

export const snippetPrivacy = `# Cosa viene conservato
#   chats        i messaggi delle conversazioni + un'IMPRONTA dell'IP (sha256 con sale) + il modello
#   carts        i carrelli dei visitatori
#   orders       ordini dimostrativi (isDemo=1) e quelli creati durante le prove
# Cancellazione automatica: carrelli e conversazioni più vecchi di 30 giorni, una volta al giorno.

# Cancellare subito tutte le conversazioni (per esempio dopo una dimostrazione pubblica):
docker compose --env-file .env.production exec -T db psql -U chatbot -d chatbot \\
  -c "delete from chats;"

# Non viene registrato: indirizzi IP in chiaro, nomi, email dei visitatori (se non le scrivono loro
# nella chat). Il sito avvisa che è una demo e di non inserire dati veri.`;

export const snippetChecklist = `PRIMA di toccare qualcosa
  [ ] backup del database (due secondi, vedi capitolo 5)
  [ ] so com'è adesso: docker compose ps, curl /api/health
  [ ] se tocco il Caddyfile: copia di sicurezza + caddy validate

DOPO ogni intervento
  [ ] curl -fsS https://chat-bot.giuseppebosi.com/api/health   → {"status":"ok"}
  [ ] una domanda vera all'assistente sul sito
  [ ] il widget su una pagina esterna si apre ancora
  [ ] docker compose logs --since 10m app | grep -i error   → vuoto
  [ ] annotato cosa ho fatto e quando (in docs/JOURNAL.md)

SE È GIÙ E NON SO PERCHÉ
  1. ./rollback.sh          (torna all'immagine di prima)
  2. logs dell'app e di Caddy
  3. se il database non risponde: docker compose --env-file .env.production restart db
  4. ripristino del backup solo come ultima spiaggia, e dopo aver fermato l'app`;
