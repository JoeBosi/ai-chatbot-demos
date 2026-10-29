/*!
 * Crema & Ferro — widget dell'assistente "il Barista".
 *
 * Si incolla in qualsiasi sito con una riga:
 *   <script src="https://chat-bot.giuseppebosi.com/widget.js" defer
 *           data-colore="#123a2f" data-posizione="destra" data-etichetta="Chiedi al Barista"></script>
 *
 * Cosa fa: disegna la bollicina in basso e, solo al primo clic, apre un iframe con la chat.
 * Perché un iframe: il CSS e il JavaScript del sito ospite non possono toccare la chat, e la chat
 * non può leggere la pagina ospite. La bollicina vive in uno Shadow DOM, così nemmeno i fogli di
 * stile del sito la deformano.
 */
(function () {
  "use strict";

  // Evita di caricarsi due volte se lo snippet finisse in due punti della pagina.
  if (window.__cremaFerroWidget) return;
  window.__cremaFerroWidget = true;

  var script = document.currentScript;
  if (!script) return;

  // L'origine dell'app si ricava dallo <script> stesso: nessun indirizzo da scrivere a mano.
  var appOrigin = new URL(script.src, window.location.href).origin;
  var dati = script.dataset || {};
  var colore = dati.colore || "#123a2f";
  var etichetta = dati.etichetta || "Chiedi al Barista";
  var aSinistra = (dati.posizione || "destra").toLowerCase() === "sinistra";

  var host = document.createElement("div");
  host.setAttribute("data-crema-ferro", "");
  // Lo Shadow DOM isola gli stili nei due versi: il sito non entra, il widget non esce.
  var radice = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var stile = document.createElement("style");
  stile.textContent = [
    ":host { all: initial; }",
    ".bolla {",
    "  position: fixed; bottom: 16px; " + (aSinistra ? "left" : "right") + ": 16px; z-index: 2147483000;",
    "  display: flex; align-items: center; gap: 8px; padding: 12px 20px 12px 16px;",
    "  border: 0; border-radius: 999px; cursor: pointer; color: #fff; background: " + colore + ";",
    "  font: 500 15px/1.2 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;",
    "  box-shadow: 0 12px 30px -10px rgba(0,0,0,.5);",
    "}",
    ".bolla:hover { filter: brightness(1.12); }",
    ".bolla:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }",
    ".telaio {",
    "  position: fixed; bottom: 16px; " + (aSinistra ? "left" : "right") + ": 16px; z-index: 2147483001;",
    "  width: 420px; height: min(720px, calc(100dvh - 32px));",
    "  border: 0; border-radius: 14px; overflow: hidden; background: #fff;",
    "  box-shadow: 0 24px 60px -20px rgba(0,0,0,.55);",
    "}",
    ".nascosto { display: none; }",
    "@media (max-width: 560px) {",
    "  .telaio { inset: 0; width: 100%; height: 100dvh; border-radius: 0; }",
    "}",
    "@media (prefers-reduced-motion: no-preference) {",
    "  .telaio { animation: entra .2s ease-out; }",
    "  @keyframes entra { from { transform: translateY(12px); opacity: 0 } to { transform: none; opacity: 1 } }",
    "}",
  ].join("\n");

  var bolla = document.createElement("button");
  bolla.type = "button";
  bolla.className = "bolla";
  bolla.setAttribute("aria-haspopup", "dialog");
  bolla.setAttribute("aria-expanded", "false");
  bolla.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>' +
    "<span></span>";
  bolla.lastChild.textContent = etichetta;

  var telaio = null;

  function apri() {
    if (!telaio) {
      telaio = document.createElement("iframe");
      // L'origine della pagina ospite serve solo perché la chat sappia a chi mandare "chiudimi".
      telaio.src = appOrigin + "/embed?host=" + encodeURIComponent(window.location.origin);
      telaio.className = "telaio";
      telaio.title = etichetta;
      telaio.setAttribute("allow", "clipboard-write");
      // allow-popups serve ai link "apri la scheda prodotto" che escono in una scheda nuova.
      telaio.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");
      radice.appendChild(telaio);
    }
    telaio.classList.remove("nascosto");
    bolla.classList.add("nascosto");
    bolla.setAttribute("aria-expanded", "true");
    // L'iframe è su un'altra origine: il focus si sposta sul riquadro, poi la chat mette a fuoco il campo.
    telaio.focus();
  }

  function chiudi() {
    if (telaio) telaio.classList.add("nascosto");
    bolla.classList.remove("nascosto");
    bolla.setAttribute("aria-expanded", "false");
    bolla.focus();
  }

  bolla.addEventListener("click", apri);

  // Si accettano messaggi SOLO dall'origine dell'app: qualsiasi altra pagina viene ignorata.
  window.addEventListener("message", function (evento) {
    if (evento.origin !== appOrigin) return;
    var dato = evento.data;
    if (!dato || dato.type !== "cf-widget") return;
    if (dato.action === "close") chiudi();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && telaio && !telaio.classList.contains("nascosto")) chiudi();
  });

  radice.appendChild(stile);
  radice.appendChild(bolla);
  (document.body || document.documentElement).appendChild(host);

  // Piccola API per chi vuole aprire la chat da un proprio bottone:
  //   CremaFerroWidget.apri()
  window.CremaFerroWidget = { apri: apri, chiudi: chiudi };
})();
