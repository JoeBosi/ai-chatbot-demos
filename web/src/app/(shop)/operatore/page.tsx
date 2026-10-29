import type { Metadata } from "next";
import Link from "next/link";

import {
  Attenzione,
  Indice,
  Nota,
  Sezione,
  Tabella,
} from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetBackup,
  snippetCaddy,
  snippetChecklist,
  snippetChiavi,
  snippetDeploy,
  snippetLimiti,
  snippetMappa,
  snippetModello,
  snippetOgniGiorno,
  snippetPrivacy,
  snippetPronto,
  snippetStrumenti,
} from "./snippets";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/operatore", {
  title: "Manuale dell’operatore: tenere in piedi l’assistente",
  description:
    "Runbook per chi gestisce il servizio: controlli quotidiani, deploy e rollback, backup del database, rotazione delle chiavi, cambio del modello, limiti e pronto soccorso ai guasti.",
});

const indice = [
  { id: "mappa", titolo: "1 · La mappa, in un minuto", livello: "orientarsi" },
  {
    id: "ogni-giorno",
    titolo: "2 · I tre controlli quotidiani",
    livello: "routine",
  },
  {
    id: "deploy",
    titolo: "3 · Pubblicare e tornare indietro",
    livello: "routine",
  },
  {
    id: "contenuti",
    titolo: "4 · Far arrivare i contenuti nuovi",
    livello: "routine",
  },
  {
    id: "database",
    titolo: "5 · Backup, ripristino e cosa non fare mai",
    livello: "critico",
  },
  {
    id: "chiavi",
    titolo: "6 · Segreti e rotazione delle chiavi",
    livello: "critico",
  },
  {
    id: "modello",
    titolo: "7 · Cambiare il modello o il fornitore",
    livello: "critico",
  },
  { id: "limiti", titolo: "8 · Limiti, quote e i 429", livello: "routine" },
  {
    id: "guasti",
    titolo: "9 · Pronto soccorso: sintomo, causa, comando",
    livello: "emergenza",
  },
  {
    id: "proxy",
    titolo: "10 · Caddy: HTTPS, password, altri siti",
    livello: "critico",
  },
  {
    id: "privacy",
    titolo: "11 · Dati conservati e cancellazione",
    livello: "critico",
  },
  {
    id: "checklist",
    titolo: "12 · Le due liste da seguire sempre",
    livello: "routine",
  },
];

export default function OperatorePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
          Operatore
        </p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">
          Manuale dell’operatore
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Questa pagina è per chi tiene in piedi il servizio: pubblicare una
          versione, tornare indietro quando va storta, salvare e ripristinare il
          database, ruotare le chiavi, cambiare il modello, capire perché la
          chat non risponde. Ogni comando qui sotto è quello che gira davvero su
          questo VPS.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Serve sapere",
              "Terminale, Docker e un po’ di SQL. Non serve conoscere il codice dell’applicazione.",
            ],
            [
              "Serve avere",
              "Accesso SSH al server e i permessi su /etc/caddy.",
            ],
            [
              "Tempo",
              "Controlli quotidiani: 2 minuti. Un ripristino completo: 15 minuti.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="bg-card rounded-lg border p-3">
              <dt className="text-xs font-semibold tracking-wide uppercase">
                {t}
              </dt>
              <dd className="text-muted-foreground mt-1 text-sm leading-snug">
                {d}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-muted-foreground mt-4 text-sm">
          Per i contenuti e il comportamento dell’assistente (correggere
          risposte, tono, nuove informazioni) la pagina è{" "}
          <Link
            href="/manutenzione"
            className="hover:text-enamel underline decoration-dotted underline-offset-4"
          >
            Manutenzione
          </Link>
          . Per com’è costruito:{" "}
          <Link
            href="/tutorial"
            className="hover:text-enamel underline decoration-dotted underline-offset-4"
          >
            il tutorial
          </Link>
          .
        </p>
      </header>

      <Indice voci={indice} />

      <div className="mt-12 flex flex-col gap-12">
        <Sezione
          id="mappa"
          occhiello="Orientarsi"
          titolo="1 · La mappa, in un minuto"
        >
          <p>
            Due container e un proxy. Nient’altro: niente servizi gestiti,
            niente code, niente cache esterne. Il pezzo che sta fuori è solo il
            fornitore del modello.
          </p>
          <CodeBlock code={snippetMappa} />
          <Tabella
            intestazioni={["Dove", "Cosa c’è", "Chi lo può raggiungere"]}
            righe={[
              [
                <code key="a">/etc/caddy/Caddyfile</code>,
                "proxy, HTTPS (ed eventuale password)",
                "root sul VPS",
              ],
              [
                <code key="b">web/docker-compose.yml</code>,
                "i due container e i loro limiti",
                "root sul VPS",
              ],
              [
                <code key="c">web/.env.production</code>,
                "i segreti (permessi 600)",
                "solo root, mai nel repository",
              ],
              ["volume dbdata", "tutto il database", "solo il container db"],
              [
                <code key="e">127.0.0.1:3040</code>,
                "l’applicazione",
                "solo il proxy, non internet",
              ],
            ]}
          />
        </Sezione>

        <Sezione
          id="ogni-giorno"
          occhiello="Routine"
          titolo="2 · I tre controlli quotidiani"
        >
          <p>
            Due minuti, e coprono il 90% dei guai prima che li segnali qualcun
            altro.
          </p>
          <CodeBlock code={snippetOgniGiorno} />
          <Nota>
            <code>/api/health</code> non dice solo «il sito è su»: interroga
            davvero il database. Se risponde <code>503 db_unavailable</code>,
            l’applicazione sta girando ma non ha più il database — è la
            situazione in cui la chat risponde «non riesco a rispondere» a
            tutti.
          </Nota>
        </Sezione>

        <Sezione
          id="deploy"
          occhiello="Routine"
          titolo="3 · Pubblicare e tornare indietro"
        >
          <p>
            Il deploy ricostruisce l’immagine, riavvia e aspetta che il sito
            risponda prima di dichiararsi finito. Se qualcosa va storto, si
            torna indietro con un comando: l’immagine precedente resta sempre
            sul server.
          </p>
          <CodeBlock code={snippetDeploy} />
          <Attenzione>
            Il rollback riporta indietro il codice, <strong>non</strong> il
            database. Se il problema è una migrazione già applicata, il rollback
            non basta: serve il ripristino del backup (capitolo 5). Per questo
            il backup si fa <em>prima</em> del deploy, non dopo.
          </Attenzione>
        </Sezione>

        <Sezione
          id="contenuti"
          occhiello="Routine"
          titolo="4 · Far arrivare i contenuti nuovi"
        >
          <p>
            Catalogo e centro assistenza vivono in due file di testo e vengono
            riversati nel database a ogni avvio dell’applicazione. Chi cura i
            contenuti lavora sui file (vedi{" "}
            <Link
              href="/manutenzione"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Manutenzione
            </Link>
            ); all’operatore serve sapere come vedere e forzare quel passaggio.
          </p>
          <CodeBlock code={snippetStrumenti} />
          <p>
            Il profilo <code>tools</code> è un container usa e getta che monta
            il progetto in sola lettura e parla con il database attraverso la
            rete interna di Docker: è l’unico modo per lanciare comandi sul
            database, che non è pubblicato su internet. Non resta acceso e non
            tocca il container dell’applicazione.
          </p>
        </Sezione>

        <Sezione
          id="database"
          occhiello="Critico"
          titolo="5 · Backup, ripristino e cosa non fare mai"
        >
          <p>
            Il database è l’unica cosa non ricostruibile: il codice si
            ricompila, i contenuti stanno nei file, ma carrelli, ordini e
            conversazioni no. Un dump completo di questa installazione pesa
            poche centinaia di KB.
          </p>
          <CodeBlock code={snippetBackup} />
          <Attenzione>
            <code>docker compose down -v</code> cancella il volume{" "}
            <code>dbdata</code>, cioè tutto il database, senza chiedere
            conferma. Non serve mai: per riavviare basta <code>restart</code>,
            per aggiornare <code>up -d</code>. Se qualcuno te lo suggerisce «per
            pulire», è la volta che perdi i dati.
          </Attenzione>
        </Sezione>

        <Sezione
          id="chiavi"
          occhiello="Critico"
          titolo="6 · Segreti e rotazione delle chiavi"
        >
          <p>
            I segreti stanno in un unico file, con permessi <code>600</code> e
            fuori dal repository. Vanno ruotati se qualcuno li ha visti, se
            cambia chi ha accesso al server, o per abitudine una volta l’anno.
          </p>
          <CodeBlock code={snippetChiavi} />
          <Nota>
            La chiave pubblica del widget (<code>WIDGET_PUBLIC_KEY</code>) è un
            caso a parte: sta in chiaro nel compose e nel{" "}
            <Link href="/tutorial">tutorial</Link>, perché arriva comunque nel
            browser di chiunque. Cambiarla ferma gli script che la usavano; chi
            ha incollato solo il <code>&lt;script&gt;</code> non se ne accorge,
            perché la pagina del widget la serve il server.
          </Nota>
        </Sezione>

        <Sezione
          id="modello"
          occhiello="Critico"
          titolo="7 · Cambiare il modello o il fornitore"
        >
          <p>
            Qui gira il router gratuito di OpenRouter: costo zero, ma qualità
            variabile e un tetto di richieste giornaliere. È la scelta giusta
            per una dimostrazione e quella sbagliata per un negozio vero, dove
            una risposta sbagliata costa più di mezzo euro al mese.
          </p>
          <CodeBlock code={snippetModello} />
          <Tabella
            intestazioni={["Cosa vedi", "Cosa sta succedendo", "Cosa fare"]}
            righe={[
              [
                "Risposte lente o mozzate",
                "fornitore gratuito sovraccarico",
                "fissare un modello a pagamento in AI_MODEL",
              ],
              [
                "Scrive il JSON dello strumento invece di usarlo",
                "modello scadente pescato dal router",
                "riprovare; se ricapita, modello fisso",
              ],
              [
                "429 dal fornitore",
                "superati i 1000 al giorno del piano gratuito",
                "aspettare il giorno dopo o passare a pagamento",
              ],
              [
                "Errore 401 dal fornitore",
                "chiave revocata o scaduta",
                "nuova chiave in .env.production, poi ./deploy.sh",
              ],
            ]}
          />
        </Sezione>

        <Sezione
          id="limiti"
          occhiello="Routine"
          titolo="8 · Limiti, quote e i 429"
        >
          <p>
            I limiti servono a due cose: non far esaurire a una persona sola la
            quota di tutti, e non far pagare al proprietario il traffico di un
            robot. Sono tutti in memoria, senza servizi esterni.
          </p>
          <CodeBlock code={snippetLimiti} />
          <Tabella
            intestazioni={["Codice", "Significato", "Dove si cambia"]}
            righe={[
              [
                "429",
                "troppi messaggi (visitatore o sito intero)",
                "src/lib/rate-limit.ts, CHAT_DAILY_LIMIT nel compose",
              ],
              [
                "401",
                "manca o è sbagliata la chiave x-cf-key",
                "WIDGET_PUBLIC_KEY nel compose",
              ],
              [
                "403",
                "origine estranea o corpo non JSON (difesa CSRF)",
                "src/lib/request.ts",
              ],
              [
                "413",
                "richiesta troppo grande",
                "MAX_BODY nella route, request_body in Caddy",
              ],
              ["503", "database non raggiungibile", "capitolo 9"],
            ]}
          />
        </Sezione>

        <Sezione
          id="guasti"
          occhiello="Emergenza"
          titolo="9 · Pronto soccorso: sintomo, causa, comando"
        >
          <Tabella
            intestazioni={["Sintomo", "Causa più probabile", "Primo comando"]}
            righe={[
              [
                "Il sito non si apre",
                "Caddy fermo o certificato",
                "systemctl status caddy · journalctl -u caddy -n 50",
              ],
              [
                "502 dal proxy",
                "container app non in piedi",
                "docker compose ps · logs --tail 100 app",
              ],
              [
                "La chat non risponde, il sito sì",
                "fornitore del modello o quota",
                "logs -f app mentre si fa una domanda",
              ],
              [
                "«Non riesco a rispondere» a tutti",
                "database giù",
                "curl /api/health · restart db",
              ],
              [
                "Tutti ricevono 429",
                "tetto globale raggiunto",
                "restart app (azzera i contatori) e alzare i limiti",
              ],
              [
                "Il widget sparisce dai siti esterni",
                "password estesa ai percorsi del widget",
                "capitolo 10: rimettere le esclusioni",
              ],
              [
                "L’app non riparte dopo un deploy",
                "migrazione fallita o build rotta",
                "./rollback.sh, poi leggere i log",
              ],
              [
                "Disco pieno",
                "immagini Docker vecchie",
                "docker system df · docker image prune -f",
              ],
            ]}
          />
          <CodeBlock code={snippetPronto} />
        </Sezione>

        <Sezione
          id="proxy"
          occhiello="Critico"
          titolo="10 · Caddy: HTTPS, password, altri siti"
        >
          <p>
            Il Caddyfile di questo server ospita anche altri siti: un errore di
            sintassi li butta giù tutti insieme. Backup, <code>validate</code>,{" "}
            <code>reload</code> — in quest’ordine, sempre.
          </p>
          <CodeBlock code={snippetCaddy} />
          <Attenzione>
            I percorsi <code>/widget.js</code>, <code>/embed</code> e le API
            devono restare fuori dalla password: sono quelli che il widget usa
            dentro i siti di chi l’ha installato. Se li proteggi, i loro
            visitatori si vedono comparire una richiesta di password che non
            possono soddisfare.
          </Attenzione>
        </Sezione>

        <Sezione
          id="privacy"
          occhiello="Critico"
          titolo="11 · Dati conservati e cancellazione"
        >
          <p>
            Poche tabelle, una retention corta e nessun indirizzo IP in chiaro.
            È il minimo per poter rispondere alla domanda «cosa tenete di me?»
            senza andare a leggere il codice.
          </p>
          <CodeBlock code={snippetPrivacy} />
          <Nota>
            In un negozio vero questa pagina va accompagnata da un’informativa e
            da un modo per cancellare i dati di una persona su richiesta. Qui i
            dati sono di prova, e il sito lo dice a chi entra.
          </Nota>
        </Sezione>

        <Sezione
          id="checklist"
          occhiello="Routine"
          titolo="12 · Le due liste da seguire sempre"
        >
          <CodeBlock code={snippetChecklist} />
          <p>
            L’ultima riga è quella che fa la differenza fra un servizio
            mantenuto e uno che si degrada: scrivere cosa è stato fatto e
            quando. Tra sei mesi, l’unica persona che vorrà saperlo sarai tu.
          </p>
        </Sezione>
      </div>

      <div className="bg-card mt-12 rounded-lg border p-5">
        <p className="font-display text-xl">Le altre due pagine</p>
        <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
          <li>
            <Link
              href="/manutenzione"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Manutenzione
            </Link>{" "}
            — contenuti, tono, correzioni: il lavoro settimanale.
          </li>
          <li>
            <Link
              href="/tutorial"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Tutorial
            </Link>{" "}
            — come è costruito l’assistente, dal database al widget.
          </li>
        </ul>
      </div>
    </div>
  );
}
