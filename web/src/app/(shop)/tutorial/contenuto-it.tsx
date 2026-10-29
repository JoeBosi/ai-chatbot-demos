import Link from "next/link";

import { Indice, Nota, Prova, Sezione } from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetApiWidget,
  snippetCaddy,
  snippetChiave,
  snippetChiaveHtml,
  snippetCompose,
  snippetComposeProd,
  snippetCookie,
  snippetCurl,
  snippetDockerfile,
  snippetEmbedPage,
  snippetEmbeddings,
  snippetEsegui,
  snippetIncolla,
  snippetIntestazioni,
  snippetIstruzioni,
  snippetLimiti,
  snippetParti,
  snippetProgetto,
  snippetProvaLocale,
  snippetProvider,
  snippetRicerca,
  snippetRoute,
  snippetSchema,
  snippetTestChat,
  snippetTestWidget,
  snippetTools,
  snippetUseChat,
  snippetWidget,
} from "./snippets";


const indice = [
  {
    id: "provalo",
    titolo: "1 · Provalo sul tuo sito in 5 minuti",
    livello: "principiante",
  },
  {
    id: "come-funziona",
    titolo: "2 · Cosa succede quando scrivi una domanda",
    livello: "principiante",
  },
  {
    id: "progetto",
    titolo: "3 · Il progetto e il database",
    livello: "intermedio",
  },
  {
    id: "ricerca",
    titolo: "4 · Far trovare i prodotti giusti",
    livello: "intermedio",
  },
  {
    id: "attrezzi",
    titolo: "5 · Gli attrezzi: far agire il modello",
    livello: "intermedio",
  },
  {
    id: "endpoint",
    titolo: "6 · L’endpoint della chat",
    livello: "intermedio",
  },
  {
    id: "interfaccia",
    titolo: "7 · L’interfaccia che mostra prodotti, non JSON",
    livello: "intermedio",
  },
  {
    id: "widget",
    titolo: "8 · Il widget: farlo entrare in qualsiasi sito",
    livello: "avanzato",
  },
  {
    id: "prove",
    titolo: "9 · Provarlo davvero (curl e Playwright)",
    livello: "avanzato",
  },
  { id: "online", titolo: "10 · Metterlo online", livello: "avanzato" },
  {
    id: "sicurezza",
    titolo: "11 · Sicurezza, limiti e costi",
    livello: "avanzato",
  },
  {
    id: "esercizi",
    titolo: "12 · Esercizi, da qui in poi",
    livello: "esperto",
  },
  { id: "dopo", titolo: "13 · E dopo? Mantenerlo", livello: "esperto" },
];

export function TutorialIt() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
          Tutorial
        </p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">
          Un assistente che aiuta a comprare, sul tuo sito
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Questa pagina parte da una riga da incollare nel tuo sito e arriva al
          codice completo dell’assistente che vedi qui: ricerca nel catalogo,
          carrello, stato degli ordini, richieste di assistenza. Tutto il codice
          è commentato e ogni capitolo finisce con qualcosa da provare, per
          capire davvero cosa succede.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Serve sapere",
              "Un po’ di HTML per il capitolo 1. Per il resto, JavaScript o TypeScript di base.",
            ],
            [
              "Serve avere",
              "Un computer con Node 24 e Docker. Nessuna carta di credito: il modello usato è gratuito.",
            ],
            [
              "Tempo",
              "5 minuti il primo capitolo, mezza giornata per rifare tutto con calma.",
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
      </header>

      <Indice voci={indice} />

      <div className="mt-12 flex flex-col gap-12">
        <Sezione
          id="provalo"
          occhiello="Principiante"
          titolo="1 · Provalo sul tuo sito in 5 minuti"
        >
          <p>
            L’assistente di questo negozio si può incollare in qualsiasi pagina
            web: un blog, un sito fatto a mano, WordPress, Shopify. Serve una
            riga sola, prima della chiusura del <code>&lt;/body&gt;</code>.
          </p>
          <CodeBlock file="il tuo sito · index.html" code={snippetIncolla} />
          <p>
            Non c’è nessuna registrazione: lo script si accorge da solo da quale
            indirizzo è stato caricato e parla con quello, e la chiave delle API
            la mette la pagina servita dal nostro server. Le opzioni sono tre,
            tutte facoltative:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3 font-semibold">Attributo</th>
                  <th className="py-2 pr-3 font-semibold">Cosa fa</th>
                  <th className="py-2 font-semibold">Valore predefinito</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {[
                  [
                    "data-etichetta",
                    "Il testo scritto sulla bollicina",
                    "Chiedi al Barista",
                  ],
                  [
                    "data-colore",
                    "Colore della bollicina (qualsiasi colore CSS)",
                    "#123a2f",
                  ],
                  [
                    "data-posizione",
                    "«destra» o «sinistra» in fondo alla pagina",
                    "destra",
                  ],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">{a}</td>
                    <td className="py-2 pr-3">{b}</td>
                    <td className="py-2 font-mono text-xs">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Prova titolo="mettilo in una pagina vuota">
            <p>
              Aprire il file con un doppio clic non basta: il browser rifiuta di
              incorniciare la chat dentro un indirizzo <code>file://</code>.
              Serve un indirizzo vero, anche solo sul tuo computer.
            </p>
            <CodeBlock code={snippetProvaLocale} />
            <p>
              Funziona se: compare la bollicina, al clic si apre il riquadro, e
              scrivendo «Quanto costa la spedizione?» arriva una risposta con la
              regola dei 49 €. Se la bollicina non compare, apri la console del
              browser: quasi sempre è un errore di indirizzo nello{" "}
              <code>src</code>.
            </p>
          </Prova>
          <p>
            Se preferisci aprire la chat da un bottone tuo, c’è una piccola API:
          </p>
          <CodeBlock file="il tuo sito · index.html" code={snippetApiWidget} />
          <Nota>
            Se invece vuoi chiamare le API a mano (con <code>curl</code>, o da
            un tuo script), serve un’intestazione:{" "}
            <code>x-cf-key: cfdemo_pub_2026</code>. È una chiave{" "}
            <strong>pubblica</strong> — è scritta qui, arriva nel browser di
            chiunque apra il sito, e non protegge nulla di segreto: tiene solo
            fuori i robot di passaggio e si può cambiare in un minuto se
            qualcuno ne abusa. Il vero segreto, la chiave del modello, resta sul
            server.
          </Nota>
          <Nota>
            Questo widget risponde sul catalogo di questo negozio dimostrativo:
            serve a far vedere come si comporta, non a vendere i tuoi prodotti.
            Per il tuo negozio il catalogo lo metti tu — è il resto del
            tutorial.
          </Nota>
        </Sezione>

        <Sezione
          id="come-funziona"
          occhiello="Principiante"
          titolo="2 · Cosa succede quando scrivi una domanda"
        >
          <p>
            Un chatbot utile non «sa» il tuo catalogo: gli si danno degli{" "}
            <strong>attrezzi</strong> (in inglese
            <em> tools</em>), cioè funzioni del tuo sito che lui può chiamare.
            Il modello decide quale chiamare, il tuo codice la esegue, e il
            risultato torna al modello che scrive la risposta. Così i prezzi
            sono quelli veri e il carrello è quello vero.
          </p>
          <ol className="flex flex-col gap-3">
            {[
              [
                "Scrivi «una macchina sotto i 400 euro»",
                "Il browser manda il messaggio al tuo server, non al fornitore del modello: la chiave resta a casa tua.",
              ],
              [
                "Il server aggiunge le istruzioni e l’elenco degli attrezzi",
                "Le istruzioni sono il carattere del Barista e le regole: cosa può fare, cosa non deve fare mai.",
              ],
              [
                "Il modello risponde «voglio searchProducts con query: macchina espresso, maxPrice: 400»",
                "Non ha cercato niente: ha solo chiesto di cercare.",
              ],
              [
                "Il tuo codice esegue la ricerca sul database",
                "Qui succede la parte seria: parole in italiano più significato (capitolo 4).",
              ],
              [
                "I risultati tornano al modello, che scrive la risposta",
                "E l’interfaccia, invece del JSON, disegna le schede prodotto vere.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="bg-enamel flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <strong>{t}.</strong>{" "}
                  <span className="text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p>
            Il testo arriva a pezzi mentre il modello lo scrive (
            <em>streaming</em>): è quello che rende la chat viva invece di farti
            guardare un puntino per dieci secondi.
          </p>
          <Prova titolo="guarda i pezzi arrivare">
            <p>
              Questa è la stessa chiamata che fa il browser, vista dal
              terminale:
            </p>
            <CodeBlock code={snippetCurl} />
          </Prova>
        </Sezione>

        <Sezione
          id="progetto"
          occhiello="Intermedio"
          titolo="3 · Il progetto e il database"
        >
          <p>
            Il progetto è un’unica applicazione Next.js: le pagine del negozio,
            l’endpoint della chat e la pagina del widget stanno insieme, così il
            browser parla sempre con la stessa origine e non servono permessi
            CORS.
          </p>
          <CodeBlock code={snippetProgetto} />
          <p>
            Il database è PostgreSQL con <strong>pgvector</strong>, l’estensione
            che sa confrontare i significati. Un solo contenitore, mai esposto
            su internet:
          </p>
          <CodeBlock file="docker-compose.yml" code={snippetCompose} />
          <p>
            Nella tabella dei prodotti, oltre ai campi normali, ce ne sono due
            speciali: uno con le <strong>parole</strong> e uno con il{" "}
            <strong>significato</strong>.
          </p>
          <CodeBlock file="src/lib/db/schema.ts" code={snippetSchema} />
          <p>
            Il «significato» sono 384 numeri che descrivono il testo. Si
            calcolano in casa, con un modellino che gira sulla CPU: nessuna API,
            nessun costo, nessun dato che esce.
          </p>
          <CodeBlock file="src/lib/embeddings.ts" code={snippetEmbeddings} />
        </Sezione>

        <Sezione
          id="ricerca"
          occhiello="Intermedio"
          titolo="4 · Far trovare i prodotti giusti"
        >
          <p>
            La ricerca solo a parole non capisce «qualcosa per il cappuccino»;
            la ricerca solo a significato sbaglia sui nomi propri e sui codici.
            Si fanno tutte e due e si fondono le classifiche: è la{" "}
            <strong>ricerca ibrida</strong>, e il metodo per fondere si chiama
            Reciprocal Rank Fusion.
          </p>
          <CodeBlock file="src/lib/catalog.ts" code={snippetRicerca} />
          <p>
            La stessa identica tecnica serve per le pagine di aiuto (spedizioni,
            resi, garanzia): si spezzano i documenti in sezioni, si salvano con
            il loro significato e l’assistente cita la sezione giusta. È quello
            che di solito si chiama RAG, e nella pratica è questo: una ricerca
            fatta bene prima di rispondere.
          </p>
        </Sezione>

        <Sezione
          id="attrezzi"
          occhiello="Intermedio"
          titolo="5 · Gli attrezzi: far agire il modello"
        >
          <p>
            Ogni attrezzo è una funzione con tre cose: una{" "}
            <strong>descrizione</strong> che spiega al modello quando usarla,
            uno <strong>schema</strong> zod che valida ciò che il modello passa,
            e il codice che fa il lavoro. Lo schema non è burocrazia: è il
            confine oltre il quale il modello non decide più niente.
          </p>
          <CodeBlock file="src/lib/ai/tools.ts" code={snippetTools} />
          <p>
            Regola pratica: gli attrezzi che <em>leggono</em> possono partire da
            soli; quelli che <strong>scrivono</strong> (aprire un ticket, fare
            un ordine, mandare una mail) chiedono un clic. L’AI SDK ha
            l’approvazione già pronta e la firma, così nessuno può fingere un
            permesso dal browser.
          </p>
          <p>
            Le istruzioni, infine, sono il carattere e i paletti
            dell’assistente:
          </p>
          <CodeBlock
            file="src/lib/ai/instructions.ts"
            code={snippetIstruzioni}
          />
        </Sezione>

        <Sezione
          id="endpoint"
          occhiello="Intermedio"
          titolo="6 · L’endpoint della chat"
        >
          <p>
            Qui si incontrano tutte le parti: controllo di ciò che arriva,
            limiti, istruzioni, attrezzi, streaming della risposta. Sono una
            quarantina di righe.
          </p>
          <CodeBlock file="src/app/api/chat/route.ts" code={snippetRoute} />
          <p>
            Tre punti che sembrano dettagli e non lo sono.{" "}
            <strong>Lo storico arriva dal browser</strong>: chi vuole può
            riscriverlo, quindi si ripulisce e si contano i caratteri.{" "}
            <strong>La quota si consuma sempre</strong>, anche quando la
            conversazione riparte dopo un’approvazione, altrimenti si aggira il
            limite. <strong>Il numero di giri è limitato</strong> (
            <code>isStepCount(6)</code>): senza, un modello confuso chiama
            attrezzi all’infinito.
          </p>
          <p>
            Il modello si sceglie in un punto solo, e si cambia con una
            variabile d’ambiente:
          </p>
          <CodeBlock file="src/lib/ai/provider.ts" code={snippetProvider} />
        </Sezione>

        <Sezione
          id="interfaccia"
          occhiello="Intermedio"
          titolo="7 · L’interfaccia che mostra prodotti, non JSON"
        >
          <p>
            Lato browser il lavoro lo fa <code>useChat</code>: tiene i messaggi,
            li manda, riceve i pezzi in streaming e ridisegna.
          </p>
          <CodeBlock
            file="src/components/assistant/assistant-provider.tsx"
            code={snippetUseChat}
          />
          <p>
            La differenza fra un chatbot qualunque e un assistente per gli
            acquisti è tutta qui: ogni chiamata a un attrezzo ha una sua faccia.
            Chi legge vede una scheda prodotto con foto e prezzo, una tabella di
            confronto, la timeline dell’ordine — non un blocco di JSON.
          </p>
          <CodeBlock
            file="src/components/assistant/assistant-panel.tsx"
            code={snippetParti}
          />
        </Sezione>

        <Sezione
          id="widget"
          occhiello="Avanzato"
          titolo="8 · Il widget: farlo entrare in qualsiasi sito"
        >
          <p>
            Il widget è fatto di due pezzi: una pagina <code>/embed</code> con
            dentro solo la chat, e un file <code>widget.js</code> che sul sito
            ospite disegna la bollicina e, al primo clic, apre un iframe su
            quella pagina.
          </p>
          <p>
            Perché un iframe e non il componente direttamente nella pagina?
            Perché il sito ospite non è casa tua: il suo CSS deformerebbe la
            chat, il suo JavaScript potrebbe leggerla, e una libreria vecchia
            potrebbe rompere la tua. Dentro l’iframe la chat è isolata davvero.
          </p>
          <CodeBlock file="src/app/embed/page.tsx" code={snippetEmbedPage} />
          <CodeBlock file="public/widget.js" code={snippetWidget} />
          <p>
            Tre trappole che scoprirai solo provando su un sito diverso dal tuo
            (e che qui sono già risolte):
          </p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>Chi può incorniciarti.</strong> L’intestazione{" "}
              <code>frame-ancestors</code> decide quali siti possono metterti in
              un iframe. Deve valere per <code>/embed</code> in modo diverso dal
              resto del sito.
            </li>
            <li>
              <strong>I cookie di terza parte.</strong> Dentro l’iframe il
              cookie del carrello è «di terza parte»: senza
              <code> SameSite=None</code> e <code>Partitioned</code> il browser
              lo butta via e il carrello si svuota a ogni messaggio. E va usato
              un <strong>nome diverso</strong> dal cookie del negozio: su un
              browser che ignora <code>Partitioned</code>, altrimenti, i
              visitatori di due siti diversi si ritroverebbero nello stesso
              carrello.
            </li>
            <li>
              <strong>I messaggi fra le due pagine.</strong> Quando il cliente
              chiude la chat, l’iframe deve chiedere al sito ospite di chiudere
              il riquadro. Si controlla sempre l’origine di chi scrive,
              altrimenti qualsiasi pagina può comandare il widget.
            </li>
          </ul>
          <CodeBlock file="next.config.ts" code={snippetIntestazioni} />
          <CodeBlock file="src/lib/cart.ts" code={snippetCookie} />
        </Sezione>

        <Sezione
          id="prove"
          occhiello="Avanzato"
          titolo="9 · Provarlo davvero (curl e Playwright)"
        >
          <p>
            Con un modello non puoi controllare le parole: oggi dice «certo,
            ecco tre macchine», domani «volentieri!». Quindi si controllano i{" "}
            <strong>fatti</strong>: ha chiamato l’attrezzo giusto? il carrello è
            cambiato? la richiesta di assistenza parte solo dopo il clic?
          </p>
          <CodeBlock
            file="tests/e2e/assistant.spec.ts"
            code={snippetTestChat}
          />
          <p>
            Il widget va provato <strong>da un’altra origine</strong>: provarlo
            sul sito stesso non dimostra niente, perché i problemi veri (iframe
            bloccato, cookie buttati, stili che si scontrano) nascono solo da
            fuori.
          </p>
          <CodeBlock file="tests/e2e/widget.spec.ts" code={snippetTestWidget} />
          <Prova titolo="la lista di controllo prima di consegnare">
            <CodeBlock code={snippetEsegui} />
            <p>
              Se un test fallisce perché il modello gratuito ha sbagliato
              (capita: a volte scrive la chiamata all’attrezzo come testo invece
              di eseguirla), non cambiare il test per farlo passare: lascia un
              secondo tentativo e scrivilo nelle note. Un test che si adatta al
              modello non prova più niente.
            </p>
          </Prova>
        </Sezione>

        <Sezione id="online" occhiello="Avanzato" titolo="10 · Metterlo online">
          <p>
            L’immagine si costruisce in tre fasi, così quella finale contiene
            solo ciò che serve a rispondere. Il modello degli embedding viene
            scaricato durante la costruzione: in produzione l’applicazione non
            scarica niente da internet.
          </p>
          <CodeBlock file="Dockerfile" code={snippetDockerfile} />
          <CodeBlock file="docker-compose.yml" code={snippetComposeProd} />
          <p>
            Davanti c’è un reverse proxy (qui Caddy, che fa da solo i
            certificati HTTPS). Due righe fanno la differenza fra una chat che
            scorre e una che sembra bloccata:
          </p>
          <CodeBlock file="/etc/caddy/Caddyfile" code={snippetCaddy} />
          <p>
            Nel blocco c’è anche, facoltativa, una <strong>password sul sito</strong>{" "}
            (<code>basic_auth</code>: questa demo l’ha avuta per qualche settimana, ora è aperta). Se la
            metti, attenzione all’ordine dei
            percorsi: se la password vale anche per <code>/widget.js</code>,{" "}
            <code>/embed</code> e le API, chi installa il widget si vede
            comparire la finestrella di autenticazione dentro il proprio sito.
            L’hash si genera con <code>caddy hash-password</code>: nel file non
            va mai la password in chiaro.
          </p>
          <Nota>
            Il primo avvio fa da solo le migrazioni del database e mette i dati
            di esempio. Un
            <code> /api/health</code> che interroga il database dice al
            container se è davvero pronto: senza, il proxy manda visitatori a
            un’applicazione che sta ancora partendo.
          </Nota>
        </Sezione>

        <Sezione
          id="sicurezza"
          occhiello="Avanzato"
          titolo="11 · Sicurezza, limiti e costi"
        >
          <p>
            Un assistente che può agire è una superficie nuova. Le difese che
            contano, in ordine di importanza:
          </p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>Gli attrezzi non si fidano del modello.</strong> Lo stato
              di un ordine si legge solo con numero <em>e</em> email; il
              carrello è quello del visitatore, legato al suo cookie; il ticket
              parte solo dopo un clic. Anche se qualcuno convince il modello a
              «fare come dico io», gli attrezzi non glielo permettono.
            </li>
            <li>
              <strong>Il testo di terzi è dato, non comando.</strong> Una
              descrizione prodotto o una recensione può contenere «ignora le
              istruzioni precedenti». Si dice al modello di ignorarlo e non si
              costruiscono attrezzi che eseguono ciò che leggono.
            </li>
            <li>
              <strong>Limiti ovunque.</strong> Lunghezza del messaggio,
              dimensione della richiesta, messaggi al minuto e al giorno per
              visitatore, tetto giornaliero per tutto il sito.
            </li>
            <li>
              <strong>Niente segreti nel browser.</strong> La chiave del modello
              sta solo sul server. Nel database finisce un’impronta dell’IP, non
              l’indirizzo.
            </li>
            <li>
              <strong>Una chiave pubblica sulle API.</strong> Le rotte{" "}
              <code>/api/chat</code> e <code>/api/cart</code> rispondono{" "}
              <code>401</code> senza l’intestazione <code>x-cf-key</code>. Non è
              una difesa vera — la chiave è nel browser di tutti — ma alza il
              gradino per i robot e permette di cambiarla senza toccare altro.
            </li>
          </ul>
          <CodeBlock file="src/lib/request.ts" code={snippetChiave} />
          <CodeBlock code={snippetChiaveHtml} />
          <CodeBlock file="src/lib/rate-limit.ts" code={snippetLimiti} />
          <p className="font-semibold">Quanto costa, in pratica</p>
          <p>
            Un messaggio completo consuma circa 2.500 token in ingresso e 400 in
            uscita, perché ogni turno fa due chiamate al modello (una per
            scegliere l’attrezzo, una per scrivere la risposta). Con i prezzi di
            settembre 2026:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3 font-semibold">Modello</th>
                  <th className="py-2 pr-3 font-semibold">1.000 messaggi</th>
                  <th className="py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {[
                  [
                    "openrouter/free",
                    "0 €",
                    "quello usato qui: gratis, qualità variabile, limiti giornalieri",
                  ],
                  [
                    "mistral-small-3.2-24b",
                    "~0,34 $",
                    "buon equilibrio, risposte costanti",
                  ],
                  [
                    "glm-5.3-flash",
                    "~0,35 $",
                    "veloce, molto affidabile con gli attrezzi",
                  ],
                  [
                    "gpt-oss-120b",
                    "~0,62 $",
                    "il più bravo dei tre nelle risposte lunghe",
                  ],
                ].map(([m, c, n]) => (
                  <tr key={m} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">{m}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{c}</td>
                    <td className="text-muted-foreground py-2">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Gli embedding non costano nulla perché girano sul tuo server.
            Affittare una GPU per farci girare un modello tutto tuo ha senso per
            la riservatezza dei dati, non per il prezzo: il pareggio con l’API
            arriva intorno al mezzo milione di messaggi al mese.
          </p>
        </Sezione>

        <Sezione
          id="esercizi"
          occhiello="Esperto"
          titolo="12 · Esercizi, da qui in poi"
        >
          <ol className="flex flex-col gap-3">
            {[
              [
                "Cambia il catalogo",
                "Sostituisci i prodotti di esempio con i tuoi (bastano un nome, un prezzo e due righe di descrizione) e rigenera gli embedding. È il passo che trasforma la demo nel tuo negozio.",
              ],
              [
                "Aggiungi un attrezzo che legge",
                "Per esempio «disponibilità in negozio»: schema zod, descrizione chiara, risultato corto. Poi guarda quante volte il modello lo usa da solo.",
              ],
              [
                "Aggiungi un attrezzo che scrive",
                "Una prenotazione, un preventivo. Obbligati a passare dall’approvazione e scrivi il test che verifica che senza clic non succede niente.",
              ],
              [
                "Collega il tuo e-commerce vero",
                "Gli attrezzi diventano chiamate alle API di Shopify, WooCommerce o del tuo gestionale. Il resto dell’impianto non cambia.",
              ],
              [
                "Misura la qualità",
                "Scrivi venti domande tipiche con la risposta attesa (quale attrezzo, quale prodotto) e falle girare a ogni cambio di modello: è il modo per accorgersi di un peggioramento prima dei clienti.",
              ],
              [
                "Apri il widget solo ai tuoi clienti",
                "Metti un elenco di siti autorizzati in frame-ancestors, uno per cliente, e un identificativo nello snippet per sapere chi sta chiedendo.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="border-enamel text-enamel flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                  {i + 1}
                </span>
                <span>
                  <strong>{t}.</strong>{" "}
                  <span className="text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Sezione>
        <Sezione id="dopo" occhiello="Esperto" titolo="13 · E dopo? Mantenerlo">
          <p>
            Costruirlo è la parte breve. La parte lunga è tenerlo aggiornato
            quando cambiano prezzi, regole e domande dei clienti — e sapere cosa
            fare quando alle tre di notte la chat non risponde. Sono due
            mestieri diversi e hanno due pagine:{" "}
            <Link
              href="/manutenzione"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Manutenzione
            </Link>{" "}
            (contenuti, tono, correzioni) e{" "}
            <Link
              href="/operatore"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Manuale dell’operatore
            </Link>{" "}
            (deploy, backup, chiavi, guasti).
          </p>
        </Sezione>
      </div>

      <footer className="mt-12 border-t pt-8">
        <p className="text-muted-foreground text-sm">
          Le scelte tecniche dietro questo progetto — e le alternative scartate
          — sono raccontate in{" "}
          <Link
            href="/come-funziona"
            className="text-foreground underline decoration-dotted underline-offset-4"
          >
            Come funziona la demo
          </Link>
          . Per vedere l’assistente all’opera, apri il Barista in basso a destra
          e chiedigli una macchina per il cappuccino.
        </p>
      </footer>
    </div>
  );
}
