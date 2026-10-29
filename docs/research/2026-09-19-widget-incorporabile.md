# Widget incorporabile in siti terzi — 2026-09-19

Obiettivo: chiunque deve poter incollare una riga nel proprio sito e avere la chat del Barista,
e la pagina `/tutorial` deve insegnare a rifarlo da zero. Scelte di Giuseppe: widget aperto a tutti
(con i limiti già esistenti) e sito protetto da password.

## Struttura scelta

- `public/widget.js` — JavaScript puro, nessuna dipendenza, ~130 righe. Legge la propria origine da
  `document.currentScript.src`, quindi non c'è nessun indirizzo da configurare. Disegna la bollicina
  dentro uno **Shadow DOM** (isolamento degli stili nei due versi) e crea l'**iframe solo al primo
  clic**: chi non apre la chat non scarica nulla.
- `/embed` — pagina con dentro solo il pannello della chat. L'app è stata divisa in gruppi di route:
  `(shop)` tiene intestazione, piè di pagina, carrello e assistente flottante; `embed` no.
- `postMessage` — l'iframe chiede al sito ospite di chiudersi; il widget accetta messaggi **solo**
  dall'origine dell'app, il `?host=` viene validato con una regex di sola origine prima di essere
  usato come destinatario.

## Le tre trappole vere (visibili solo provando da un'altra origine)

1. **`frame-ancestors`.** L'intestazione globale `frame-ancestors 'self'` impediva qualsiasi
   incorporamento. Due intestazioni CSP sullo stesso percorso vengono **intersecate** dal browser,
   quindi non basta aggiungerne una per `/embed`: serve escludere `/embed` dalla regola generale
   (`source: "/((?!embed).*)"`).
2. **Cookie di terza parte.** Dentro l'iframe il cookie del carrello è di terza parte: con
   `SameSite=Lax` il browser non lo rimanda mai. Serve `SameSite=None; Secure; Partitioned` (CHIPS),
   e solo in quel caso: in prima parte resta `Lax`. Il client segnala il contesto con l'intestazione
   `x-cf-embed: 1`, e la route crea il cookie **prima** di iniziare lo streaming (a intestazioni
   inviate non si possono più impostare cookie).
3. **Link dentro l'iframe.** Un `next/link` porterebbe una pagina del negozio dentro il riquadro di
   1 cm: nel contesto incorporato i link diventano `<a target="_blank">` (componente `ShopLink`),
   e l'iframe ha `allow-popups allow-popups-to-escape-sandbox`.

## Prove (skill `widget-embed-test`)

`tests/e2e/widget.spec.ts`, sempre da **un'altra origine**: pagina ospite finta servita da
`python3 -m http.server 8099` (avviata da `webServer` in `playwright.config.ts`), che carica il
widget da `?app=<BASE_URL>`. Controlli: bollicina disegnata senza errori in console; nessun iframe
prima del clic; `frame-ancestors` assente su `/embed` e presente sul resto; risposta reale della
chat dentro l'iframe; messaggio `cf-widget` da origine estranea ignorato; chiusura dal pulsante
interno; nessuno scorrimento laterale a 390 px; carrello funzionante nell'iframe (prova diretta del
cookie partizionato). 6 test, verdi in locale e sul sito pubblico.

## Barriera d'accesso

`basic_auth` di Caddy su tutto il sito tranne `/widget.js /embed /embed/* /api/chat /api/cart
/api/health /_next/* /favicon.ico`: senza queste esclusioni il widget incorporato mostrerebbe la
richiesta di password dentro il sito di chi lo installa. Conseguenza accettata: chi conosce gli
indirizzi può usare la chat (e quindi leggere catalogo e centro assistenza) senza password; valgono
i limiti per IP e il tetto giornaliero.

## Revisione di sicurezza del 2026-09-19 (sub-agente) e correzioni

- **CSRF sulle API**: `POST /api/cart` accettava una richiesta con `Origin: https://evil.example` e
  perfino `Content-Type: text/plain` (modulo HTML da un altro sito). Ora entrambe le route rifiutano
  origini estranee e corpi non JSON (`src/lib/request.ts`); l'iframe del widget non è toccato perché
  gira sulla nostra stessa origine.
- **Cookie del carrello**: `x-cf-embed` è un'intestazione che chiunque può scrivere, e su un browser
  che ignora `Partitioned` (Safari vecchi, webview) il carrello sarebbe diventato uno solo, condiviso
  fra negozio e siti ospiti. Ora il contesto incorporato usa **un cookie con un altro nome**
  (`cf_cart_embed`) e il contesto si riconosce anche da `Sec-Fetch-Dest: iframe`, che il browser
  scrive e una pagina non può falsificare.
- **Quota bruciabile**: bastavano 4 indirizzi IP per zittire l'assistente per tutti fino al giorno
  dopo. Aggiunto un tetto globale a finestra breve (40 messaggi ogni 10 minuti), ridotto il limite
  giornaliero per visitatore (80 → 40) e lo storico di testo accettato (60.000 → 24.000 caratteri).
- **CSP su `/embed/qualsiasi-cosa`**: la regola con `(?!embed)` escludeva tutti i percorsi che
  iniziano per "embed" ma ne copriva solo uno; aggiunta la regola `"/embed/:path*"`.
- **`TOOL_APPROVAL_SECRET`**: verificato presente nel container (64 caratteri), quindi le
  approvazioni dei ticket restano firmate.
## Chiave pubblica sulle API (scelta di Giuseppe, 19/09)

`/api/chat` e `/api/cart` rispondono `401` senza l'intestazione `x-cf-key` uguale a
`WIDGET_PUBLIC_KEY` (`cfdemo_pub_2026`, in `environment:` del compose perché i file `.env*` sono
bloccati da una regola di deny). La chiave è **volutamente pubblica**: sta scritta nel tutorial
(capitoli 1 e 11) e arriva nel browser di chiunque apra il sito. Non protegge nulla di segreto —
serve a tenere fuori crawler e script di passaggio e a poterla ruotare senza toccare altro.

Dove viene messa: il server la passa ai provider React (`ClientConfigProvider apiKey={...}` in
`(shop)/layout.tsx` e in `embed/page.tsx`), e `useApiHeaders()` la aggiunge a ogni chiamata del
transport di `useChat` e del carrello. Chi incolla soltanto lo `<script>` del widget non deve fare
niente: la pagina `/embed` è servita dal nostro server. Chi chiama le API a mano deve aggiungere
l'intestazione (il tutorial mostra sia il `curl` sia un `fetch`).

Verifica: `401` senza chiave, `401` con chiave sbagliata, `200` con chiave, sull'URL pubblico;
16/16 test E2E in locale e in pubblico (il test del carrello nell'iframe ora manda la chiave).

- **Restano aperti, per scelta**: `/api/chat` senza password (serve al widget) espone catalogo,
  centro assistenza e ordini dimostrativi a chi conosce l'indirizzo; e `/embed` senza
  `frame-ancestors` è incorniciabile da chiunque, quindi in teoria sovrapponibile (clickjacking).
  La chiave pubblica qui sopra alza il gradino ma non chiude nessuna delle due cose.
  Alternative pronte se Giuseppe le vuole: elenco di origini autorizzate, oppure un gettone firmato
  richiesto dalle API.

## Fonti
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors
- https://developers.google.com/privacy-sandbox/cookies/chips (cookie `Partitioned`)
- https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
- https://caddyserver.com/docs/caddyfile/directives/basic_auth
- https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
