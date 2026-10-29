import type { Metadata } from "next";
import Link from "next/link";

import {
  Attenzione,
  Indice,
  Nota,
  Prova,
  Sezione,
  Tabella,
} from "@/components/tutorial/blocks";
import { CodeBlock } from "@/components/tutorial/code-block";

import {
  snippetChats,
  snippetDiagnosi,
  snippetFonti,
  snippetGiro,
  snippetProdotto,
  snippetProve,
  snippetRimuovi,
  snippetRoutine,
  snippetSezione,
  snippetTono,
  snippetVocabolario,
} from "./snippets";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/manutenzione", {
  title: "Mantenere l’assistente: correggere, ampliare, cambiare tono",
  description:
    "Guida pratica per chi cura il chatbot ogni settimana: correggere una risposta sbagliata, aggiungere o togliere informazioni, definire i concetti, cambiare il tono e provare prima di pubblicare.",
});

const indice = [
  { id: "fonti", titolo: "1 · Da dove viene una risposta", livello: "base" },
  {
    id: "giro",
    titolo: "2 · Il giro di una modifica, dall’inizio alla fine",
    livello: "base",
  },
  {
    id: "sbagliata",
    titolo: "3 · Ha risposto male: come si capisce dove intervenire",
    livello: "base",
  },
  {
    id: "ampliare",
    titolo: "4 · Ampliare: insegnargli qualcosa di nuovo",
    livello: "base",
  },
  {
    id: "ridurre",
    titolo: "5 · Ridurre: togliere o correggere informazioni",
    livello: "base",
  },
  {
    id: "vocabolario",
    titolo: "6 · Farsi trovare con le parole dei clienti",
    livello: "intermedio",
  },
  {
    id: "tono",
    titolo: "7 · Tono, lunghezza e modalità di risposta",
    livello: "intermedio",
  },
  {
    id: "prodotti",
    titolo: "8 · Prezzi, scorte e prodotti nuovi",
    livello: "intermedio",
  },
  {
    id: "limiti",
    titolo: "9 · Cosa non si risolve scrivendo istruzioni",
    livello: "intermedio",
  },
  {
    id: "provare",
    titolo: "10 · Provare prima di pubblicare",
    livello: "intermedio",
  },
  {
    id: "ascoltare",
    titolo: "11 · Leggere cosa chiedono i clienti",
    livello: "intermedio",
  },
  {
    id: "routine",
    titolo: "12 · La routine, e gli errori che costano di più",
    livello: "base",
  },
];

export default function ManutenzionePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
          Manutenzione
        </p>
        <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">
          Tenere l’assistente sveglio, settimana dopo settimana
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Un chatbot non si «finisce»: cambia un prezzo, arriva una domanda a
          cui non sa rispondere, il tono non è quello giusto. Questa pagina è
          per chi cura l’assistente — non serve saper programmare, servono un
          editor di testo e tre comandi. Il lavoro vero è decidere <em>cosa</em>{" "}
          deve sapere e <em>come</em> deve parlare.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Serve sapere",
              "Scrivere in italiano chiaro. Nessun codice: si modificano testi dentro due file.",
            ],
            [
              "Serve avere",
              "Accesso ai file del progetto e il permesso di lanciare ./deploy.sh.",
            ],
            [
              "Tempo",
              "Una modifica: 10 minuti. La routine settimanale: 20 minuti.",
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
          Se invece devi tenere in piedi il <em>servizio</em> — deploy, log,
          backup, chiavi, guasti — la pagina è{" "}
          <Link
            href="/operatore"
            className="hover:text-enamel underline decoration-dotted underline-offset-4"
          >
            Manuale dell’operatore
          </Link>
          . Per capire com’è costruito tutto:{" "}
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
          id="fonti"
          occhiello="Base"
          titolo="1 · Da dove viene una risposta"
        >
          <p>
            Il modello di intelligenza artificiale non sa nulla del tuo negozio:
            non conosce i prezzi, non ha letto le condizioni di reso, non sa che
            esisti. Tutto quello che dice di concreto arriva da file di testo
            che puoi modificare tu. Sapere quale file guardare è metà del lavoro
            di manutenzione.
          </p>
          <CodeBlock code={snippetFonti} />
          <Tabella
            intestazioni={[
              "Se l’assistente…",
              "Si corregge in",
              "Quanto ci vuole",
            ]}
            righe={[
              [
                "dice un prezzo o una scorta sbagliata",
                <code key="a">src/data/catalog.ts</code>,
                "2 minuti",
              ],
              [
                "sbaglia su spedizioni, resi, garanzia, orari",
                <code key="b">src/data/help.ts</code>,
                "5 minuti",
              ],
              [
                "non sa rispondere a una domanda frequente",
                <code key="c">src/data/help.ts</code>,
                "10 minuti",
              ],
              [
                "è troppo prolisso, insistente, formale",
                <code key="d">src/lib/ai/instructions.ts</code>,
                "2 minuti",
              ],
              [
                "non trova un prodotto che esiste",
                <span key="e">
                  tag e descrizione in <code>src/data/catalog.ts</code>
                </span>,
                "5 minuti",
              ],
              [
                "dovrebbe poter fare qualcosa che non fa",
                <code key="f">src/lib/ai/tools.ts</code>,
                "serve uno sviluppatore",
              ],
            ]}
          />
          <Nota>
            I testi del centro assistenza sono gli stessi che i clienti leggono
            su <Link href="/assistenza">/assistenza</Link>: si scrivono una
            volta sola e valgono per le persone e per l’assistente. È voluto —
            due copie della stessa regola finiscono sempre per contraddirsi.
          </Nota>
        </Sezione>

        <Sezione
          id="giro"
          occhiello="Base"
          titolo="2 · Il giro di una modifica, dall’inizio alla fine"
        >
          <p>
            Modificare il testo non basta: i contenuti vivono anche nel
            database, dove l’assistente li cerca. Il passaggio è automatico, ma
            succede solo quando pubblichi.
          </p>
          <CodeBlock code={snippetGiro} />
          <p>
            <code>npm run content:check</code> è un’anteprima: dice cosa
            cambierebbe (<code>+</code> aggiunto, <code>~</code> modificato,{" "}
            <code>-</code> rimosso) senza toccare niente.{" "}
            <code>./deploy.sh</code> ricostruisce il sito e, all’avvio, allinea
            da solo catalogo e centro assistenza. Vengono ricalcolati solo i
            testi cambiati: correggere un prezzo non ricalcola nulla, riscrivere
            una descrizione ricalcola quel prodotto e basta.
          </p>
          <Prova titolo="cambia una virgola e guarda cosa succede">
            <p>
              Apri <code>src/data/help.ts</code>, nella sezione «Costi di
              spedizione» aggiungi una frase (per esempio «Le consegne il sabato
              hanno un supplemento di 3 €»), poi lancia{" "}
              <code>npm run content:check</code>: deve comparire una riga{" "}
              <code>~ spedizioni · Costi di spedizione</code>. Pubblica con{" "}
              <code>./deploy.sh</code> e chiedi all’assistente «si può farsi
              consegnare di sabato?».
            </p>
          </Prova>
          <Attenzione>
            Fino a poco fa i contenuti finivano nel database <em>solo</em> al
            primo avvio: chi modificava un testo e ripubblicava non vedeva
            cambiare niente e pensava che il chatbot «non ascoltasse». Ora la
            sincronizzazione c’è, ma vale solo per i file in{" "}
            <code>src/data/</code>: quello che scrivi altrove non arriva
            all’assistente.
          </Attenzione>
        </Sezione>

        <Sezione
          id="sbagliata"
          occhiello="Base"
          titolo="3 · Ha risposto male: come si capisce dove intervenire"
        >
          <p>
            La tentazione è sempre la stessa: aprire le istruzioni e aggiungere
            una riga «non dire più che la spedizione costa 9 euro». Quasi sempre
            è la cura sbagliata: le istruzioni servono per il{" "}
            <strong>comportamento</strong>, non per i <strong>dati</strong>.
            Prima di toccarle, tre domande.
          </p>
          <CodeBlock code={snippetDiagnosi} />
          <Tabella
            intestazioni={["Sintomo", "Causa quasi sempre", "Cosa fare"]}
            righe={[
              [
                "Inventa un prezzo",
                "non ha usato gli strumenti",
                "rendi esplicita la regola «usa SEMPRE searchProducts»; se ricapita, cambia modello",
              ],
              [
                "Dà una regola vecchia",
                "il testo nel centro assistenza è vecchio",
                "correggi la sezione e ripubblica",
              ],
              [
                "Dice «non lo so» su cose che sai",
                "manca la sezione, o è scritta con parole diverse",
                "aggiungi la sezione (cap. 4) o le parole (cap. 6)",
              ],
              [
                "Risponde con muri di testo",
                "istruzioni troppo vaghe",
                "«massimo 3 frasi» funziona meglio di «sii conciso»",
              ],
              [
                "Consiglia sempre il più caro",
                "descrizioni squilibrate",
                "scrivi per chi è ogni prodotto, anche quelli economici",
              ],
              [
                "Una volta sbaglia e una volta no",
                "è il modello gratuito",
                "riprova due volte prima di cambiare i testi",
              ],
            ]}
          />
        </Sezione>

        <Sezione
          id="ampliare"
          occhiello="Base"
          titolo="4 · Ampliare: insegnargli qualcosa di nuovo"
        >
          <p>
            Ampliare la base di informazioni significa aggiungere una sezione al
            centro assistenza. Ogni titolo che comincia con <code>##</code>{" "}
            diventa un pezzo cercabile a sé: è l’unità che l’assistente trova e
            cita.
          </p>
          <CodeBlock file="src/data/help.ts" code={snippetSezione} />
          <p>
            La differenza fra un assistente che aiuta e uno che gira a vuoto sta
            quasi tutta nella scrittura di queste sezioni. Una sezione lunga che
            parla di cinque argomenti viene trovata per tutti e cinque e citata
            male; le stesse informazioni divise in cinque sezioni brevi vengono
            trovate con precisione.
          </p>
          <Nota>
            Vale anche per le informazioni che non stanno in una pagina del
            sito: «i corsi si tengono il sabato», «richiamiamo entro 24 ore»,
            «non spediamo in Svizzera». Se un cliente può chiederlo, deve
            esserci scritto.
          </Nota>
        </Sezione>

        <Sezione
          id="ridurre"
          occhiello="Base"
          titolo="5 · Ridurre: togliere o correggere informazioni"
        >
          <p>
            Ridurre non vuol dire cancellare. Se togli una sezione, l’assistente
            non risponde «non lo so»: pesca il testo più vicino che trova e
            risponde con quello, cioè sbaglia con sicurezza.
          </p>
          <CodeBlock file="src/data/help.ts" code={snippetRimuovi} />
          <p>
            Si cancella solo ciò che non esiste più davvero: un prodotto
            ritirato, una promozione finita, un servizio chiuso. Tutto il resto
            si <strong>riscrive</strong>, così l’assistente ha sempre una
            risposta corretta da dare. E quando un prodotto sparisce dal
            catalogo, sparisce anche dalle risposte al primo deploy: non serve
            fare altro.
          </p>
        </Sezione>

        <Sezione
          id="vocabolario"
          occhiello="Intermedio"
          titolo="6 · Farsi trovare con le parole dei clienti"
        >
          <p>
            La ricerca funziona in due modi insieme: le{" "}
            <strong>parole esatte</strong> e il <strong>significato</strong>. Il
            significato copre molto («caffettiera» trova la moka), ma non copre
            il gergo, i modi di dire locali, i nomi commerciali e gli errori di
            ortografia. Quelli si insegnano.
          </p>
          <CodeBlock code={snippetVocabolario} />
          <p>
            Il posto migliore per i sinonimi è una sezione del centro assistenza
            scritta per i clienti («Parole del caffè, spiegate»): serve a loro,
            e intanto insegna all’assistente che «macinino» e «macinacaffè» sono
            la stessa cosa.
          </p>
        </Sezione>

        <Sezione
          id="tono"
          occhiello="Intermedio"
          titolo="7 · Tono, lunghezza e modalità di risposta"
        >
          <p>
            Il carattere dell’assistente sta in un unico testo, letto a ogni
            messaggio. Lì si decide se dà del tu o del lei, quanto è lungo,
            quante domande fa, quando propone un operatore, cosa non deve mai
            dire.
          </p>
          <CodeBlock file="src/lib/ai/instructions.ts" code={snippetTono} />
          <Tabella
            intestazioni={["Vuoi che…", "Scrivi questo", "Non scrivere"]}
            righe={[
              [
                "sia più breve",
                "«Massimo 3 frasi per risposta.»",
                "«Sii conciso.»",
              ],
              [
                "non sia invadente",
                "«Aggiungi al carrello solo se il cliente lo chiede.»",
                "«Non essere troppo commerciale.»",
              ],
              [
                "ammetta di non sapere",
                "«Se non lo trovi negli strumenti, dillo e proponi l’assistenza.»",
                "«Non inventare.» da solo",
              ],
              [
                "faccia una domanda per volta",
                "«Al massimo una domanda per messaggio.»",
                "«Fai domande mirate.»",
              ],
              [
                "dia del lei",
                "«Dai del lei, tono professionale.»",
                "«Sii formale.»",
              ],
            ]}
          />
          <Attenzione>
            Ogni regola aggiunta ruba attenzione alle altre. Oltre le venti
            righe circa il modello comincia a dimenticarne qualcuna, e il primo
            sintomo è che «ogni tanto» ignora una regola vecchia. Quando
            aggiungi una riga, chiediti quale puoi togliere.
          </Attenzione>
        </Sezione>

        <Sezione
          id="prodotti"
          occhiello="Intermedio"
          titolo="8 · Prezzi, scorte e prodotti nuovi"
        >
          <p>
            Il catalogo è un elenco di schede in un file. Prezzi in euro, scorte
            come numero: la conversione e il resto li fa il codice.
          </p>
          <CodeBlock file="src/data/catalog.ts" code={snippetProdotto} />
          <p>
            Lo <code>slug</code> non si cambia mai: è l’indirizzo della scheda
            prodotto e il riferimento usato da carrello e ordini. Se un prodotto
            cambia nome, cambia il <code>name</code> e lascia stare lo slug.
          </p>
          <Nota>
            In questa demo le scorte vengono riportate ai valori del file una
            volta al giorno, perché gli acquisti di prova non devono esaurire il
            negozio. In un negozio vero le scorte arrivano dal gestionale: è il
            punto in cui, prima o poi, serve uno sviluppatore.
          </Nota>
        </Sezione>

        <Sezione
          id="limiti"
          occhiello="Intermedio"
          titolo="9 · Cosa non si risolve scrivendo istruzioni"
        >
          <p>
            Tre cose non si aggiustano con le parole, e insistere fa solo danni:
            allunga le istruzioni e peggiora tutto il resto.
          </p>
          <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-steel">
            <li>
              <strong>Quello che l’assistente può fare.</strong> Cercare,
              confrontare, mettere nel carrello, controllare un ordine, aprire
              una richiesta: sono funzioni scritte nel codice (
              <code>src/lib/ai/tools.ts</code>). Chiedergli nelle istruzioni di
              «applicare uno sconto» non gli dà il potere di farlo.
            </li>
            <li>
              <strong>I dati che non ha.</strong> Se il gestionale non è
              collegato, nessuna istruzione gli farà sapere quante confezioni
              sono rimaste davvero.
            </li>
            <li>
              <strong>La qualità del modello.</strong> Qui gira un modello
              gratuito: a volte sbaglia un passaggio o scrive una chiamata come
              testo. Se la stessa domanda va storta più volte, il problema non è
              il tuo testo — è il modello, e si cambia (vedi la{" "}
              <Link
                href="/operatore#modello"
                className="hover:text-enamel underline decoration-dotted underline-offset-4"
              >
                pagina dell’operatore
              </Link>
              ).
            </li>
          </ul>
        </Sezione>

        <Sezione
          id="provare"
          occhiello="Intermedio"
          titolo="10 · Provare prima di pubblicare"
        >
          <p>
            Con un modello non esiste il «l’ho corretto, quindi ora è giusto»:
            la stessa modifica può risolvere una domanda e romperne un’altra.
            Per questo si tiene una lista fissa di domande e la si rifà ogni
            volta.
          </p>
          <CodeBlock code={snippetProve} />
          <p>
            Falle in una conversazione <strong>nuova</strong> (chiudi e riapri
            la chat): l’assistente ricorda il contesto, e una risposta giusta
            ottenuta dopo tre messaggi di aiuto non dimostra niente.
          </p>
          <Prova titolo="il controllo che non salta mai">
            <p>
              Dopo ogni modifica al centro assistenza, chiedi la stessa cosa con
              parole diverse da quelle che hai scritto: se hai scritto
              «confezione regalo», chiedi «si può incartare?». Se non trova, il
              problema sono le parole — torna al capitolo 6.
            </p>
          </Prova>
        </Sezione>

        <Sezione
          id="ascoltare"
          occhiello="Intermedio"
          titolo="11 · Leggere cosa chiedono i clienti"
        >
          <p>
            La lista delle cose da migliorare non la inventi: te la scrivono i
            clienti. Le conversazioni restano 30 giorni, senza indirizzi IP in
            chiaro, e si leggono con un comando.
          </p>
          <CodeBlock code={snippetChats} />
          <p>
            Le due righe che contano: quante conversazioni finiscono{" "}
            <em>senza</em> che l’assistente usi uno strumento (segno che ha
            risposto a vuoto) e quante finiscono in una richiesta di assistenza
            (segno che non sapeva rispondere). Da lì escono le sezioni da
            scrivere la settimana dopo.
          </p>
          <Nota>
            Sono dati di persone: si guardano per migliorare il servizio, non
            per profilare. In questa demo sono anche finti — chi la usa sa che
            non deve scrivere dati veri.
          </Nota>
        </Sezione>

        <Sezione
          id="routine"
          occhiello="Base"
          titolo="12 · La routine, e gli errori che costano di più"
        >
          <CodeBlock code={snippetRoutine} />
          <p className="font-semibold">
            I cinque errori che vedrai fare (o farai)
          </p>
          <ol className="ml-5 flex list-decimal flex-col gap-2 marker:text-steel">
            <li>
              <strong>Correggere nelle istruzioni un problema di dati.</strong>{" "}
              Funziona per una domanda e rompe le altre. I numeri stanno in{" "}
              <code>src/data/</code>.
            </li>
            <li>
              <strong>
                Aggiungere una sezione senza togliere quella vecchia.
              </strong>{" "}
              Due regole diverse sullo stesso argomento = risposte a caso.
            </li>
            <li>
              <strong>Scrivere per il modello invece che per i clienti.</strong>{" "}
              I testi si vedono anche su{" "}
              <Link href="/assistenza">/assistenza</Link>: se sono brutti da
              leggere, sono brutti per tutti.
            </li>
            <li>
              <strong>Provare una volta sola.</strong> Il modello varia: due
              prove, in conversazioni diverse.
            </li>
            <li>
              <strong>Modificare e non pubblicare.</strong> Finché non lanci{" "}
              <code>./deploy.sh</code>, il sito vero risponde come prima.
            </li>
          </ol>
          <Nota>
            Un’ultima cosa, la più importante: l’assistente parla ai tuoi
            clienti con la tua voce. Vale la pena rileggerlo ogni tanto come se
            fossi un cliente — è più utile di qualsiasi regola in più nelle
            istruzioni.
          </Nota>
        </Sezione>
      </div>

      <div className="bg-card mt-12 rounded-lg border p-5">
        <p className="font-display text-xl">Le altre due pagine</p>
        <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
          <li>
            <Link
              href="/tutorial"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Tutorial
            </Link>{" "}
            — come è costruito l’assistente e come metterlo sul tuo sito.
          </li>
          <li>
            <Link
              href="/operatore"
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              Manuale dell’operatore
            </Link>{" "}
            — deploy, log, backup, chiavi, limiti, guasti.
          </li>
        </ul>
      </div>
    </div>
  );
}
