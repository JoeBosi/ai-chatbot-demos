import type { DocInfo } from "./types";

// Dieci pagine informative in Markdown. Ogni "## " è una sezione autonoma: l'assistente ne
// recupera una alla volta, quindi ciascuna deve stare in piedi da sola e contenere dati
// espliciti. Contenuti solo organizzativi, nessuna indicazione clinica.

export const documenti: DocInfo[] = [
  {
    slug: "prenotare-e-disdire",
    titolo: "Come prenotare e come disdire",
    corpo: `## Questo sito è una dimostrazione
Il Poliambulatorio Vallenova non esiste: è una struttura inventata per mostrare come funziona
un assistente di prenotazione. Nessun appuntamento preso qui arriva a una struttura reale,
nessun medico viene avvisato e nessun pagamento viene richiesto. Non inserire dati personali
veri: né nome e cognome reali, né codice fiscale, né numero di telefono, né indirizzo email
che usi davvero. Negli esempi usiamo l'email demo@vallenova.example e il codice prenotazione
PR-20481. Tutto quello che scrivi serve solo a far vedere il percorso a schermo.

## Come si prenota
Si può prenotare in tre modi: da questo sito, scegliendo prestazione, medico e orario fra
quelli liberi; per telefono allo 0521 000 000, da lunedì a venerdì dalle 08:00 alle 19:00 e il
sabato dalle 08:00 alle 13:00; oppure di persona in accettazione, al piano 0. Per prenotare
servono nome, cognome, data di nascita, un numero di telefono e un indirizzo email. Al termine
arriva un'email con il codice prenotazione, il giorno, l'ora, il nome del medico e la stanza.

## Il giorno dell'appuntamento
Conviene arrivare 10 minuti prima per la registrazione in accettazione, al piano 0. Chi arriva
con più di 15 minuti di ritardo potrebbe non riuscire a essere ricevuto, perché l'agenda del
medico è a fasce fisse: in quel caso l'appuntamento viene spostato alla prima data utile. Le
sale d'attesa sono ai piani 0, 1 e 2, vicino agli ambulatori.

## Come si disdice o si sposta
La disdetta è gratuita fino a 24 ore prima dell'appuntamento e si può fare dal link contenuto
nell'email di conferma, per telefono allo 0521 000 000 o in accettazione. Per spostare
l'appuntamento vale la stessa procedura: si cerca il primo orario libero con lo stesso medico.
Se la disdetta arriva oltre quel termine o il paziente non si presenta, viene addebitata una
penale di 20 euro, che diventa 35 euro per gli esami strumentali.

## Promemoria e liste di attesa
Un promemoria via email parte 48 ore prima e un SMS 24 ore prima dell'appuntamento. Se la data
proposta è troppo lontana si può chiedere di essere inseriti nella lista di richiamo: in caso
di disdetta altrui l'accettazione telefona per proporre il posto liberato, di solito con uno o
due giorni di preavviso.`,
  },
  {
    slug: "referti",
    titolo: "Referti: tempi, ritiro e invio",
    corpo: `## In quanti giorni è pronto
Le visite specialistiche hanno il referto immediato: viene consegnato stampato e firmato alla
fine della visita. Gli esami strumentali richiedono da 2 a 4 giorni lavorativi: 2 giorni per
elettrocardiogramma sotto sforzo, ecocardiogramma, radiografia del torace e campo visivo, 3
giorni per le ecografie, la mappatura dei nei, il prelievo del sangue e il tampone faringeo, 4
giorni per l'Holter pressorio. Il pap test richiede fino a 7 giorni lavorativi e il breath test
5, perché passano dal laboratorio esterno. I giorni si contano dal primo giorno lavorativo
successivo all'esame.

## Ritiro allo sportello del piano 0
Lo sportello referti è al piano 0: dall'ingresso principale si tiene la sinistra fino in fondo
al corridoio, insegna verde. È aperto da lunedì a venerdì dalle 08:30 alle 13:00 e dalle 14:30
alle 18:00, il sabato dalle 08:30 alle 12:30. Per ritirare serve un documento di identità e il
codice prenotazione, per esempio PR-20481. I referti restano disponibili allo sportello per 90
giorni, poi vengono archiviati e vanno richiesti per telefono allo 0521 000 001.

## Ritiro da parte di un'altra persona
Un familiare o un conoscente può ritirare il referto al posto del paziente, se porta tre cose:
la delega scritta e firmata dal paziente, una fotocopia del documento di identità del paziente
e il proprio documento di identità. Il modulo di delega si scarica dal sito o si chiede in
accettazione. Per i minori la delega non serve se ritira un genitore, che però deve mostrare il
proprio documento.

## Invio via email o per posta
Chi lo chiede al momento della prenotazione riceve il referto in PDF all'indirizzo email
indicato, con un link protetto da password che scade dopo 30 giorni. L'invio via email è
gratuito. La spedizione cartacea all'indirizzo di casa costa 6 euro e arriva in genere entro 5
giorni lavorativi. Le immagini radiologiche si consegnano su CD oppure con un link di download,
senza costi aggiuntivi.

## Copie e referti smarriti
Una copia di un referto già consegnato si richiede allo sportello del piano 0 o scrivendo a
referti@vallenova.example, indicando nome, data di nascita e data dell'esame. La copia costa 3
euro se cartacea ed è gratuita in PDF, e viene preparata entro 2 giorni lavorativi. Trattandosi
di una demo, i referti di questo sito sono documenti fittizi generati a scopo di esempio.`,
  },
  {
    slug: "preparazione-esami",
    titolo: "Preparazione agli esami: regole generali",
    corpo: `## Digiuno
Quando la prestazione richiede il digiuno, il conteggio parte dall'ultimo pasto o bevanda
diversa dall'acqua. Il prelievo del sangue e il breath test richiedono 8 ore di digiuno,
l'ecografia dell'addome 6 ore. L'acqua è sempre consentita, in quantità moderata. Caffè, tè,
chewing gum, caramelle e fumo interrompono il digiuno e vanno evitati nello stesso intervallo.

## Vescica piena, pelle pulita, collo libero
Alcuni esami hanno una preparazione diversa dal digiuno. Per l'ecografia pelvica sull'addome
serve la vescica piena: mezzo litro di acqua circa un'ora prima, senza andare in bagno. Per la
visita dermatologica e la mappatura dei nei la pelle va lasciata libera da creme, autoabbronzanti,
fondotinta e smalto. Per l'ecografia della tiroide meglio evitare collane e maglioni a collo
alto, perché la sonda lavora sul collo.

## Documenti ed esami precedenti da portare
Per quasi tutte le prestazioni conviene portare gli esami già eseguiti sullo stesso problema:
referti, radiografie, risonanze anche su CD, analisi del sangue degli ultimi due anni. Serve
anche l'elenco scritto dei farmaci e degli integratori assunti, con i dosaggi. Per le visite
endocrinologiche e diabetologiche questa documentazione è la parte più importante
dell'appuntamento.

## Abbigliamento e tempi di permanenza
Per la fisioterapia, la tecarterapia e l'elettrocardiogramma sotto sforzo servono abbigliamento
sportivo e scarpe da ginnastica; per la fisioterapia anche un telo personale. Alcune prestazioni
richiedono di restare in sede più del previsto: il breath test circa un'ora, l'infiltrazione
articolare un quarto d'ora di osservazione dopo la procedura, la visita oculistica con gocce due
o tre ore di vista annebbiata, durante le quali non è possibile guidare.

## Se la preparazione non è stata rispettata
Se il digiuno o la preparazione non sono stati rispettati, l'esame di norma non si può eseguire
e viene riprogrammato. Conviene telefonare allo 0521 000 000 prima di venire: lo spostamento
fatto in anticipo non comporta penale. La preparazione specifica di ciascuna prestazione è
indicata nella sua scheda sul sito e nell'email di conferma.`,
  },
  {
    slug: "pagamenti-e-ticket",
    titolo: "Pagamenti, ticket e convenzioni",
    corpo: `## Privato e convenzione
Le prestazioni si possono eseguire in regime privato, pagando il prezzo di listino indicato
nella scheda di ogni prestazione, oppure in convenzione con il servizio pubblico, pagando il
ticket. In regime privato non serve l'impegnativa del medico di base; in convenzione sì, e va
portata in originale il giorno dell'appuntamento. I prezzi privati di questa demo vanno da 40
euro per una medicazione o un prelievo a 160 euro per la mappatura dei nei.

## Ticket ed esenzioni
Il ticket di una visita specialistica in convenzione è di 23 euro, quello di un esame
strumentale di 36 euro. Chi ha un'esenzione deve portare il codice di esenzione e il documento
che la attesta: in questo caso il ticket non viene richiesto. Senza impegnativa valida la
prestazione viene erogata in regime privato al prezzo di listino.

## Come si paga
Il pagamento si effettua in accettazione, al piano 0, prima della prestazione. Accettiamo
contanti fino a 500 euro, bancomat, carte di credito Visa e Mastercard, e pagamento digitale
da smartphone. Non accettiamo assegni. La ricevuta o la fattura viene stampata subito e, se
richiesto, inviata anche via email.

## Fattura, detrazioni e pacchetti
La fattura riporta il codice fiscale del paziente, necessario per la detrazione fiscale: va
quindi comunicato al momento del pagamento. Per le sedute di fisioterapia esistono pacchetti da
cinque sedute a 250 euro e da dieci a 480 euro, acquistabili in accettazione e validi 12 mesi.
I pacchetti sono nominativi e non cedibili.

## In questa demo non si paga nulla
Essendo un sito dimostrativo, qui non viene incassato alcun importo e non vengono chiesti dati
di pagamento: nessun numero di carta, nessun IBAN. I prezzi servono solo a rendere realistico
l'esempio. Se una schermata chiedesse dati di pagamento, non inserirli.`,
  },
  {
    slug: "documenti-da-portare",
    titolo: "Documenti da portare",
    corpo: `## Sempre, per qualsiasi prestazione
Servono un documento di identità valido, la tessera sanitaria e il codice prenotazione ricevuto
per email, per esempio PR-20481. Il documento viene controllato in accettazione al momento
della registrazione. Senza documento di identità non è possibile ritirare referti.

## Se la prestazione è in convenzione
Oltre ai documenti di base serve l'impegnativa del medico di base in originale, con la
prestazione richiesta e la data. Chi ha un'esenzione deve portare anche l'attestato di
esenzione con il relativo codice. L'impegnativa viene trattenuta dalla struttura.

## Esami e referti precedenti
Conviene portare tutto quello che riguarda lo stesso problema: referti di visite precedenti,
radiografie e risonanze anche su CD, analisi del sangue degli ultimi due anni, lettere di
dimissione. Per le visite endocrinologiche e diabetologiche questo materiale è indispensabile,
perché la visita si basa in gran parte sulla sua lettura. Portare anche l'elenco scritto dei
farmaci e degli integratori assunti, con i dosaggi.

## Minori e persone con delega
Per i pazienti minorenni serve la presenza di un genitore o di un tutore con il proprio
documento di identità; per i certificati sportivi serve inoltre il modulo della società
sportiva firmato. Chi accompagna un adulto per ritirare un referto deve avere la delega scritta
e firmata, la fotocopia del documento del paziente e il proprio documento.

## Documenti nella versione demo
In questo sito dimostrativo nessun documento viene richiesto, caricato o conservato: l'elenco
qui sopra descrive come funzionerebbe una struttura reale. Non caricare fotografie di documenti
veri e non scrivere codici fiscali o numeri di tessera sanitaria reali nelle schermate di
prenotazione.`,
  },
  {
    slug: "orari-e-contatti",
    titolo: "Orari e contatti",
    corpo: `## Orari di apertura
Il poliambulatorio è aperto da lunedì a venerdì dalle 08:00 alle 19:00 e il sabato dalle 08:00
alle 13:00. La domenica è chiuso. Il sabato mattina è attivo solo un gruppo ridotto di
ambulatori: cardiologia con la Dott.ssa Ferraro, dermatologia con la Dott.ssa Moretti,
radiologia con il Dott. Tarasconi e fisioterapia con la Dott.ssa Costa.

## Fasce degli ambulatori e dei prelievi
Gli ambulatori lavorano su due fasce: 09:00-13:00 la mattina e 14:30-18:30 il pomeriggio. La
sala prelievi del piano 0 riceve su appuntamento dalle 07:30 alle 09:30, da lunedì a sabato.
Le ecografie e le radiografie si eseguono al piano 0 nelle fasce dei rispettivi turni, che si
vedono in fase di prenotazione.

## Telefono ed email
Il numero principale è 0521 000 000, attivo negli orari di apertura: serve per prenotare,
disdire, spostare un appuntamento e per le informazioni generali. Per i referti c'è una linea
dedicata, 0521 000 001, attiva da lunedì a venerdì dalle 09:00 alle 17:00. Gli indirizzi email
sono info@vallenova.example per le informazioni e referti@vallenova.example per le copie dei
referti; rispondiamo entro 2 giorni lavorativi.

## Chiusure previste
La struttura resta chiusa dal 24 dicembre 2026 al 3 gennaio 2027 per le festività, con
riapertura lunedì 4 gennaio 2027. Le chiusure e le assenze dei singoli medici sono già visibili
nel calendario di prenotazione: gli orari non disponibili non compaiono fra quelli
selezionabili. In caso di chiusura improvvisa l'accettazione telefona ai pazienti già
prenotati.

## Numeri e indirizzi di questa demo
Telefono, email e indirizzo di questa pagina sono inventati: 0521 000 000 non è un numero
attivo, gli indirizzi @vallenova.example non ricevono posta e Via delle Camelie 12 non esiste.
Per le emergenze reali esistono i numeri pubblici del servizio sanitario, che questo sito
dimostrativo non sostituisce in alcun modo.`,
  },
  {
    slug: "come-arrivare",
    titolo: "Come arrivare e dove parcheggiare",
    corpo: `## L'indirizzo e l'edificio
Il Poliambulatorio Vallenova è in Via delle Camelie 12, 43121 Parma, nel quartiere Vallenova.
L'edificio ha tre piani: al piano 0 stanno accettazione, sportello referti, sala prelievi,
ecografia e radiologia; al piano 1 tre ambulatori e la palestra della fisioterapia; al piano 2
quattro ambulatori e lo Studio 2.5. L'ingresso pazienti è quello con la porta automatica e la
pensilina.

## In auto
Dalla tangenziale si prende l'uscita Parma Centro e si segue la direzione quartiere Vallenova;
Via delle Camelie si imbocca dalla rotonda di Via dei Pioppi. Il tragitto dall'uscita
all'ingresso è di circa 6 minuti senza traffico. Nelle ore di punta, tra le 08:00 e le 09:00,
conviene calcolare 10 minuti in più.

## Parcheggio
Il parcheggio interno è gratuito per i pazienti e ha 40 posti, di cui 4 riservati alle persone
con disabilità proprio davanti all'ingresso principale. Si entra dal cancello a destra del
civico 12 e l'uscita è automatica. Quando è pieno, il parcheggio pubblico a strisce blu di Via
dei Pioppi è a 200 metri e costa 1,20 euro all'ora.

## Autobus, treno e bicicletta
Le linee 7 e 14 fermano alla fermata Camelie, a 80 metri dall'ingresso, con una corsa ogni 15
minuti circa. Dalla stazione ferroviaria di Parma si arriva in circa 15 minuti con la linea 7.
Per chi viene in bicicletta c'è una rastrelliera coperta per 20 biciclette a sinistra
dell'ingresso principale.

## Orientarsi dentro l'edificio
Dall'ingresso, l'accettazione è il bancone subito a destra; lo sportello referti è in fondo al
corridoio di sinistra, con l'insegna verde. Due ascensori servono tutti i piani: l'ascensore A
porta ai corridoi Nord e Centro, l'ascensore B all'ala Sud e alla palestra del piano 1. Sul
pavimento del piano 0 una striscia azzurra conduce alle sale di ecografia e radiologia, nell'ala
Sud.`,
  },
  {
    slug: "accessibilita-e-assistenza",
    titolo: "Accessibilità e assistenza",
    corpo: `## Ingresso, ascensori e servizi
L'ingresso principale è a livello strada, senza gradini, con porta automatica larga abbastanza
per una carrozzina. Due ascensori, A e B, servono i piani 0, 1 e 2 e hanno cabina ampia e
pulsantiera con i numeri in rilievo. I servizi igienici accessibili sono al piano 0, accanto
alla sala d'attesa grande, e al piano 1, di fronte all'ascensore A. Nel parcheggio interno ci
sono 4 posti riservati davanti all'ingresso.

## L'unica stanza non accessibile
Tutte le stanze sono raggiungibili in carrozzina tranne una: lo Studio 2.5, in fondo al
corridoio Sud del piano 2, si raggiunge solo salendo una scaletta interna di sei gradini, senza
ascensore. È la stanza usata di norma per la gastroenterologia. Chi non può usare la scaletta lo
segnala in prenotazione o in accettazione: la visita viene spostata in un ambulatorio del piano
1, senza cambiare medico né costo.

## Assistenza in sede
In accettazione è disponibile una carrozzina di cortesia, che si può prenotare in anticipo
telefonando allo 0521 000 000. Il personale accompagna fino all'ambulatorio chi lo chiede. Per
chi ha difficoltà a stare in piedi, in ogni sala d'attesa ci sono sedute con braccioli e, nelle
sale dei piani 1 e 2, due posti riservati vicino all'ingresso.

## Accompagnatori, cani guida e lingue
Un accompagnatore può restare in sala d'attesa e, se il paziente lo chiede, entrare anche in
ambulatorio; per i pazienti minorenni la presenza di un genitore o di un tutore è obbligatoria.
I cani guida sono ammessi in tutti gli spazi, comprese le sale di ecografia e radiologia. Fra i
professionisti dell'équipe si parlano, oltre all'italiano, inglese, francese, spagnolo e
tedesco: la lingua di ciascuno è indicata nella sua scheda.

## Come segnalare un'esigenza
Qualsiasi esigenza particolare va segnalata al momento della prenotazione, così da riservare la
stanza e il tempo adeguati: appuntamento in orario meno affollato, stanza al piano 1, tempi più
lunghi, presenza di un interprete organizzato dal paziente. Si può scrivere a
info@vallenova.example o telefonare allo 0521 000 000. Nella versione demo queste segnalazioni
non vengono registrate da nessuna parte.`,
  },
  {
    slug: "privacy-demo",
    titolo: "Privacy e trattamento dei dati (versione demo)",
    corpo: `## Non inserire dati personali veri
Questo sito è una dimostrazione e i dati che vengono digitati nelle schermate non hanno alcuna
tutela da struttura sanitaria. Non inserire nome e cognome reali, codice fiscale, numero di
tessera sanitaria, data di nascita esatta, indirizzo di casa, numero di telefono o email che si
usa davvero. Per gli esempi si possono usare un nome di fantasia, l'email
demo@vallenova.example e il codice PR-20481. Non caricare fotografie di documenti né referti
reali.

## Cosa viene conservato e per quanto
Le prenotazioni di esempio create in questa demo restano in un database di prova e vengono
cancellate automaticamente dopo 7 giorni; le conversazioni con l'assistente dopo 30 giorni. Non esiste alcun fascicolo sanitario, nessun referto
reale e nessun collegamento con laboratori o enti esterni. I testi delle conversazioni con
l'assistente vengono conservati in forma tecnica per il tempo necessario a far funzionare la
demo e non vengono usati per profilare nessuno.

## Nessun dato sanitario reale
La struttura, i medici, le prestazioni, i prezzi e gli orari di questo sito sono inventati:
nessuna informazione presente nelle pagine proviene da una cartella clinica o da un paziente
reale. L'assistente non ha accesso a dati sanitari di persone esistenti e non può consultare
archivi esterni. Quello che risponde si basa solo sui contenuti dimostrativi di queste pagine.

## Niente consigli medici
L'assistente di questo sito dà informazioni organizzative: orari, sedi, costi, preparazione
agli esami, modalità di ritiro dei referti. Non formula diagnosi, non interpreta sintomi, non
suggerisce quale esame fare e non commenta terapie. Per qualsiasi questione di salute il
riferimento è il proprio medico e, nelle urgenze, i numeri pubblici del servizio sanitario.

## Chi gestisce questa demo
Il sito è un progetto didattico di Giuseppe Bosi: non esiste una struttura sanitaria dietro, e
non viene trattato alcun dato sanitario reale. L'email info@vallenova.example è il contatto
fittizio della clinica inventata. Chi ha realizzato il sito, con quali strumenti e con quali
licenze, è nella pagina Crediti; cosa viene conservato e per quanto, nella pagina Privacy del
sito (entrambe in fondo a ogni pagina).`,
  },
  {
    slug: "domande-frequenti",
    titolo: "Domande frequenti",
    corpo: `## Serve l'impegnativa del medico di base?
In regime privato non serve: si paga il prezzo di listino indicato nella scheda della
prestazione e si prenota direttamente. In convenzione con il servizio pubblico serve
l'impegnativa in originale, da portare il giorno dell'appuntamento, e si paga il ticket: 23 euro
per una visita specialistica, 36 euro per un esame strumentale. Nella scheda di ogni prestazione
è indicato se l'impegnativa è prevista.

## Quanto dura l'appuntamento e quanto si aspetta?
Le visite durano tra 25 e 45 minuti, gli esami tra 15 e 60. Conviene arrivare 10 minuti prima
per la registrazione in accettazione. Alcune prestazioni richiedono di restare in sede più a
lungo: il breath test circa un'ora, l'infiltrazione articolare un quarto d'ora di osservazione
dopo la procedura.

## Posso scegliere il medico e cambiarlo?
Sì: in prenotazione si vedono i professionisti che eseguono quella prestazione e i loro orari
disponibili. Cambiare medico equivale a una nuova prenotazione, da fare entro le 24 ore
precedenti per evitare la penale. Se un medico è assente per ferie, il sistema non mostra i suoi
orari in quel periodo.

## Posso portare un accompagnatore o venire con un bambino?
Un accompagnatore può restare in sala d'attesa e, se il paziente lo chiede, entrare in
ambulatorio. Per i pazienti minorenni la presenza di un genitore o di un tutore con documento è
obbligatoria. Non c'è un servizio di custodia bambini, ma le sale d'attesa dei piani 0 e 1 hanno
un angolo con tavolino e sedie piccole.

## Si può prenotare qui per davvero?
No. Questo sito è una dimostrazione: nessuna prenotazione raggiunge una struttura reale, nessun
medico riceve il tuo appuntamento e nessun pagamento viene incassato. Indirizzo, telefono, email
e medici sono inventati, e non vanno inseriti dati personali veri. Serve a mostrare come
funzionerebbe un assistente di prenotazione, non a prenotare una visita.`,
  },
];
