import type { Prestazione } from "./types";

// 32 prestazioni distribuite sulle 10 specialità, comprese alcune prestazioni di servizio
// (prelievo, certificato sportivo, tampone, medicazione). In `medici` compaiono solo slug di
// medici che hanno la specialità della prestazione. Prezzi e durate sono inventati ma
// plausibili per il privato. I testi restano organizzativi: nessuna indicazione clinica.

export const prestazioni: Prestazione[] = [
  // ——— Cardiologia ———
  {
    slug: "visita-cardiologica",
    nome: "Visita cardiologica",
    specialita: "cardiologia",
    medici: ["marco-bellani", "elena-ferraro"],
    durataMinuti: 30,
    prezzoEuro: 120,
    tipo: "visita",
    descrizione:
      "Colloquio con il cardiologo, misurazione della pressione e ascolto del cuore. Nella " +
      "maggior parte dei casi comprende un elettrocardiogramma a riposo eseguito nello stesso " +
      "appuntamento. Il referto viene consegnato stampato alla fine della visita.",
    preparazione:
      "Portare le analisi del sangue più recenti, gli eventuali referti cardiologici precedenti " +
      "e l'elenco dei farmaci in corso.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["cuore", "pressione", "visita specialistica", "cardiologo", "controllo", "colesterolo"],
  },
  {
    slug: "elettrocardiogramma",
    nome: "Elettrocardiogramma a riposo",
    specialita: "cardiologia",
    medici: ["marco-bellani", "elena-ferraro"],
    durataMinuti: 15,
    prezzoEuro: 45,
    tipo: "esame",
    descrizione:
      "Registrazione dell'attività elettrica del cuore con alcuni elettrodi adesivi applicati su " +
      "torace, braccia e gambe. L'esame si svolge da sdraiati, dura pochi minuti e non comporta " +
      "alcun fastidio. Il tracciato viene refertato dal cardiologo lo stesso giorno.",
    preparazione: "",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["ecg", "elettrocardiogramma", "tracciato", "cuore", "battito", "esame rapido"],
  },
  {
    slug: "elettrocardiogramma-sotto-sforzo",
    nome: "Elettrocardiogramma sotto sforzo",
    specialita: "cardiologia",
    medici: ["elena-ferraro"],
    durataMinuti: 45,
    prezzoEuro: 150,
    tipo: "esame",
    descrizione:
      "Registrazione del tracciato cardiaco mentre il paziente pedala su una cyclette, con " +
      "aumento graduale della resistenza. Il cardiologo resta presente per tutta la durata e " +
      "monitora pressione e battito. Alla fine è previsto un periodo di recupero di alcuni " +
      "minuti prima di rivestirsi.",
    preparazione:
      "Portare abbigliamento sportivo e scarpe da ginnastica. Evitare un pasto abbondante " +
      "nelle due ore precedenti.",
    giorniReferto: 2,
    impegnativa: true,
    tags: ["sotto sforzo", "cyclette", "ecg da sforzo", "cuore", "sport", "prova sotto sforzo"],
  },
  {
    slug: "holter-pressorio-24h",
    nome: "Holter pressorio 24 ore",
    specialita: "cardiologia",
    medici: ["marco-bellani"],
    durataMinuti: 20,
    prezzoEuro: 110,
    tipo: "esame",
    descrizione:
      "Applicazione di un piccolo apparecchio con bracciale che misura la pressione a intervalli " +
      "regolari nell'arco di una giornata. L'appuntamento serve a montare lo strumento e a " +
      "spiegare come comportarsi; il giorno dopo si torna in sede per riconsegnarlo. Il referto " +
      "viene preparato dopo lo scarico dei dati.",
    preparazione:
      "Indossare una maglietta a maniche larghe. Portare un foglio o un blocchetto per annotare " +
      "gli orari di sonno e di attività, come spiegato al momento del montaggio.",
    giorniReferto: 4,
    impegnativa: true,
    tags: ["holter", "pressione", "24 ore", "monitoraggio", "bracciale", "cuore"],
  },
  {
    slug: "certificato-idoneita-sportiva-non-agonistica",
    nome: "Certificato di idoneità sportiva non agonistica",
    specialita: "cardiologia",
    medici: ["elena-ferraro"],
    durataMinuti: 25,
    prezzoEuro: 60,
    tipo: "certificato",
    descrizione:
      "Visita con misurazione di pressione, altezza e peso ed elettrocardiogramma a riposo, al " +
      "termine della quale viene rilasciato il certificato per l'attività sportiva non " +
      "agonistica. È la prestazione richiesta di solito da palestre, piscine e società " +
      "dilettantistiche. Il certificato viene consegnato subito, firmato e timbrato.",
    preparazione:
      "Portare un documento di identità, la tessera sanitaria e, per i minori, il modulo della " +
      "società sportiva firmato da un genitore.",
    giorniReferto: 0,
    impegnativa: false,
    tags: [
      "certificato",
      "sport",
      "palestra",
      "piscina",
      "non agonistica",
      "idoneità",
      "scuola",
    ],
  },

  // ——— Dermatologia ———
  {
    slug: "visita-dermatologica",
    nome: "Visita dermatologica",
    specialita: "dermatologia",
    medici: ["giulia-moretti", "sandro-lippi"],
    durataMinuti: 25,
    prezzoEuro: 100,
    tipo: "visita",
    descrizione:
      "Colloquio e osservazione della pelle, dei capelli e delle unghie, con l'uso del " +
      "dermatoscopio dove serve. Può riguardare una zona precisa o l'intera superficie cutanea, " +
      "secondo quanto concordato in prenotazione. Il referto viene consegnato a fine visita.",
    preparazione:
      "Presentarsi senza creme, fondotinta o smalto sulle zone da osservare e senza trucco sul " +
      "viso.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["pelle", "dermatologo", "nei", "macchie", "acne", "prurito", "visita"],
  },
  {
    slug: "mappatura-dei-nei",
    nome: "Mappatura dei nei in dermatoscopia digitale",
    specialita: "dermatologia",
    medici: ["giulia-moretti"],
    durataMinuti: 40,
    prezzoEuro: 160,
    tipo: "esame",
    descrizione:
      "Osservazione sistematica dei nei su tutto il corpo con un dermatoscopio collegato a una " +
      "telecamera. Le immagini vengono archiviate per poter essere confrontate nei controlli " +
      "degli anni successivi. L'esame richiede di spogliarsi progressivamente; nella stanza è " +
      "presente un paravento.",
    preparazione:
      "Niente creme, autoabbronzanti o smalto. Se sono già state fatte mappature altrove, " +
      "portare le immagini o il referto precedente.",
    giorniReferto: 3,
    impegnativa: false,
    tags: [
      "mappatura nei",
      "dermatoscopio",
      "nei",
      "controllo pelle",
      "immagini",
      "nevi",
      "confronto",
    ],
  },
  {
    slug: "crioterapia-lesioni-cutanee",
    nome: "Crioterapia di lesioni cutanee",
    specialita: "dermatologia",
    medici: ["sandro-lippi"],
    durataMinuti: 20,
    prezzoEuro: 90,
    tipo: "terapia",
    descrizione:
      "Trattamento ambulatoriale in cui il dermatologo applica azoto liquido su lesioni " +
      "superficiali della pelle, già valutate in una visita precedente. La seduta dura pochi " +
      "minuti e si svolge nello stesso ambulatorio della visita. Al termine vengono spiegate a " +
      "voce e per iscritto le indicazioni per la medicazione.",
    preparazione:
      "Portare il referto della visita dermatologica in cui è stata indicata la crioterapia. " +
      "Non applicare creme sulla zona nelle ore precedenti.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["crioterapia", "azoto liquido", "verruche", "pelle", "trattamento", "ambulatoriale"],
  },

  // ——— Ginecologia ———
  {
    slug: "visita-ginecologica",
    nome: "Visita ginecologica",
    specialita: "ginecologia",
    medici: ["chiara-venturi", "anna-rinaldi"],
    durataMinuti: 30,
    prezzoEuro: 110,
    tipo: "visita",
    descrizione:
      "Colloquio ed esame ginecologico, con possibilità di eseguire l'ecografia nella stessa " +
      "stanza quando l'appuntamento lo prevede. L'ambulatorio è dotato di spogliatoio separato. " +
      "Il referto viene consegnato alla fine.",
    preparazione:
      "Portare gli esami e le ecografie precedenti. Se si assume una terapia ormonale, portare " +
      "il nome del prodotto.",
    giorniReferto: 0,
    impegnativa: false,
    tags: [
      "visita ginecologica",
      "ginecologo",
      "controllo annuale",
      "ciclo",
      "contraccezione",
      "menopausa",
    ],
  },
  {
    slug: "pap-test",
    nome: "Pap test",
    specialita: "ginecologia",
    medici: ["anna-rinaldi", "chiara-venturi"],
    durataMinuti: 15,
    prezzoEuro: 55,
    tipo: "analisi",
    descrizione:
      "Prelievo di cellule del collo dell'utero con uno spatolino, eseguito in pochi minuti " +
      "durante una visita o come appuntamento a sé. Il campione viene inviato al laboratorio " +
      "esterno convenzionato. L'esito viene caricato nell'area referti quando il laboratorio lo " +
      "trasmette.",
    preparazione:
      "Non eseguirlo durante il ciclo mestruale: in quel caso basta spostare l'appuntamento " +
      "telefonando in accettazione. Nelle 48 ore precedenti non usare ovuli, creme o lavande " +
      "vaginali.",
    giorniReferto: 7,
    impegnativa: false,
    tags: ["pap test", "prelievo", "collo dell'utero", "screening", "laboratorio", "referto"],
  },
  {
    slug: "ecografia-pelvica",
    nome: "Ecografia pelvica",
    specialita: "ginecologia",
    medici: ["chiara-venturi"],
    durataMinuti: 25,
    prezzoEuro: 95,
    tipo: "esame",
    descrizione:
      "Esame con ultrasuoni degli organi pelvici, eseguito dalla ginecologa nella sala di " +
      "ecografia del piano 0. La sonda viene appoggiata sull'addome con un gel, oppure usata per " +
      "via transvaginale secondo quanto indicato in prenotazione. Le immagini vengono salvate e " +
      "allegate al referto.",
    preparazione:
      "Per l'esame sull'addome presentarsi con la vescica piena: bere mezzo litro di acqua " +
      "circa un'ora prima e non andare in bagno.",
    giorniReferto: 2,
    impegnativa: true,
    tags: [
      "ecografia",
      "pelvica",
      "ultrasuoni",
      "vescica piena",
      "utero",
      "ovaie",
      "ginecologia",
    ],
  },

  // ——— Ortopedia ———
  {
    slug: "visita-ortopedica",
    nome: "Visita ortopedica",
    specialita: "ortopedia",
    medici: ["paolo-de-stefani"],
    durataMinuti: 30,
    prezzoEuro: 120,
    tipo: "visita",
    descrizione:
      "Colloquio e valutazione del movimento delle articolazioni interessate, con lettura delle " +
      "immagini radiologiche già disponibili. La visita si svolge al piano 2 e richiede di " +
      "scoprire la zona da esaminare, quindi conviene un abbigliamento comodo. Il referto, con " +
      "l'eventuale proposta di percorso fisioterapico, viene consegnato alla fine.",
    preparazione:
      "Portare radiografie, risonanze o TAC già eseguite, anche su CD, e i referti " +
      "corrispondenti.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["ortopedico", "ginocchio", "spalla", "schiena", "anca", "visita", "movimento"],
  },
  {
    slug: "infiltrazione-articolare",
    nome: "Infiltrazione articolare",
    specialita: "ortopedia",
    medici: ["paolo-de-stefani"],
    durataMinuti: 25,
    prezzoEuro: 140,
    tipo: "terapia",
    descrizione:
      "Trattamento ambulatoriale in cui l'ortopedico inietta un prodotto all'interno " +
      "dell'articolazione, dopo averlo concordato in una visita precedente. La procedura dura " +
      "pochi minuti; dopo l'infiltrazione si resta in sala d'attesa circa un quarto d'ora. Le " +
      "indicazioni per le ore successive vengono consegnate per iscritto.",
    preparazione:
      "Portare il referto della visita ortopedica in cui è stata indicata l'infiltrazione e il " +
      "prodotto, se è stato acquistato in farmacia. Prevedere di non guidare subito dopo.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["infiltrazione", "articolazione", "ginocchio", "ambulatoriale", "ortopedia", "iniezione"],
  },
  {
    slug: "medicazione-semplice",
    nome: "Medicazione semplice",
    specialita: "ortopedia",
    medici: ["paolo-de-stefani"],
    durataMinuti: 15,
    prezzoEuro: 40,
    tipo: "terapia",
    descrizione:
      "Pulizia e rifacimento della medicazione di una ferita o di una sutura, su prestazione " +
      "ambulatoriale programmata. Dura pochi minuti e si svolge al piano 2. Le medicazioni " +
      "ripetute si possono prenotare in blocco in accettazione.",
    preparazione:
      "Portare la lettera di dimissione o il referto dell'intervento, se la medicazione segue " +
      "un ricovero.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["medicazione", "ferita", "punti", "bendaggio", "ambulatoriale", "sutura"],
  },

  // ——— Oculistica ———
  {
    slug: "visita-oculistica",
    nome: "Visita oculistica completa",
    specialita: "oculistica",
    medici: ["silvia-boschi"],
    durataMinuti: 35,
    prezzoEuro: 110,
    tipo: "visita",
    descrizione:
      "Misurazione della vista, controllo della pressione oculare ed esame del fondo oculare. " +
      "Quando è previsto il fondo oculare vengono instillate gocce che dilatano la pupilla e " +
      "annebbiano la vista per due o tre ore. La prescrizione per occhiali o lenti, se serve, " +
      "viene consegnata a fine visita.",
    preparazione:
      "Portare gli occhiali in uso o la scatola delle lenti a contatto, e prevedere di non " +
      "guidare dopo la visita se sono previste le gocce.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["vista", "oculista", "occhiali", "fondo oculare", "gocce", "pressione oculare"],
  },
  {
    slug: "esame-del-campo-visivo",
    nome: "Esame del campo visivo",
    specialita: "oculistica",
    medici: ["silvia-boschi"],
    durataMinuti: 30,
    prezzoEuro: 85,
    tipo: "esame",
    descrizione:
      "Esame in cui si guarda dentro una cupola luminosa e si premono un pulsante ogni volta che " +
      "si percepisce un puntino di luce. Si esegue un occhio alla volta e richiede attenzione " +
      "costante per alcuni minuti. Il referto comprende i grafici stampati dallo strumento.",
    preparazione:
      "Portare gli occhiali da vista in uso. Se possibile presentarsi riposati, perché l'esame " +
      "richiede concentrazione.",
    giorniReferto: 2,
    impegnativa: true,
    tags: ["campo visivo", "perimetria", "occhi", "esame", "grafico", "oculistica"],
  },

  // ——— Otorinolaringoiatria ———
  {
    slug: "visita-otorinolaringoiatrica",
    nome: "Visita otorinolaringoiatrica",
    specialita: "otorinolaringoiatria",
    medici: ["davide-nardi"],
    durataMinuti: 25,
    prezzoEuro: 105,
    tipo: "visita",
    descrizione:
      "Colloquio e osservazione di orecchie, naso e gola con strumenti luminosi e specchietti. " +
      "La visita si svolge al piano 2, nell'ambulatorio accanto alla cabina silente. Il referto " +
      "viene consegnato alla fine.",
    preparazione:
      "Portare eventuali esami audiometrici precedenti e, se ci sono, i referti di altre visite " +
      "specialistiche sulla stessa zona.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["otorino", "orecchie", "naso", "gola", "visita", "voce", "sinusite"],
  },
  {
    slug: "esame-audiometrico",
    nome: "Esame audiometrico",
    specialita: "otorinolaringoiatria",
    medici: ["davide-nardi"],
    durataMinuti: 30,
    prezzoEuro: 70,
    tipo: "esame",
    descrizione:
      "Prova dell'udito in cabina silente: si indossano delle cuffie e si segnala ogni volta che " +
      "si sente un suono, a volumi e frequenze diverse. Si esegue un orecchio alla volta. Il " +
      "risultato è un grafico che viene allegato al referto.",
    preparazione: "",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["udito", "audiometria", "cuffie", "cabina silente", "orecchie", "grafico"],
  },
  {
    slug: "lavaggio-auricolare",
    nome: "Lavaggio auricolare",
    specialita: "otorinolaringoiatria",
    medici: ["davide-nardi"],
    durataMinuti: 20,
    prezzoEuro: 50,
    tipo: "terapia",
    descrizione:
      "Prestazione ambulatoriale in cui l'orecchio viene irrigato con acqua tiepida per " +
      "rimuovere il cerume. Dura pochi minuti per orecchio e si conclude con un controllo " +
      "visivo. Si prenota di norma dopo una visita otorinolaringoiatrica.",
    preparazione:
      "Se è stato consigliato un prodotto emolliente, usarlo nei giorni precedenti secondo le " +
      "indicazioni ricevute in visita.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["lavaggio", "cerume", "orecchie", "tappo", "ambulatoriale", "otorino"],
  },
  {
    slug: "tampone-faringeo",
    nome: "Tampone faringeo",
    specialita: "otorinolaringoiatria",
    medici: ["davide-nardi"],
    durataMinuti: 15,
    prezzoEuro: 40,
    tipo: "analisi",
    descrizione:
      "Prelievo di un campione dalla gola con un bastoncino di cotone, eseguito in pochi " +
      "secondi. Il campione viene inviato al laboratorio convenzionato per la coltura. L'esito " +
      "arriva nell'area referti quando il laboratorio lo trasmette.",
    preparazione:
      "Non lavare i denti né usare collutori nelle due ore precedenti e presentarsi a digiuno " +
      "da almeno un'ora.",
    giorniReferto: 3,
    impegnativa: false,
    tags: ["tampone", "gola", "faringe", "coltura", "laboratorio", "prelievo"],
  },

  // ——— Endocrinologia ———
  {
    slug: "visita-endocrinologica",
    nome: "Visita endocrinologica",
    specialita: "endocrinologia",
    medici: ["francesca-galli"],
    durataMinuti: 40,
    prezzoEuro: 130,
    tipo: "visita",
    descrizione:
      "Colloquio esteso, con lettura delle analisi del sangue e delle ecografie già eseguite, " +
      "misurazione di peso, altezza e pressione. È una visita molto basata sui documenti, quindi " +
      "la completezza della cartella portata dal paziente fa la differenza. Il referto viene " +
      "consegnato alla fine.",
    preparazione:
      "Portare tutte le analisi del sangue degli ultimi due anni, le ecografie della tiroide se " +
      "disponibili e l'elenco scritto dei farmaci e degli integratori assunti.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["tiroide", "ormoni", "endocrinologo", "metabolismo", "peso", "analisi", "visita"],
  },
  {
    slug: "visita-diabetologica",
    nome: "Visita diabetologica",
    specialita: "endocrinologia",
    medici: ["francesca-galli"],
    durataMinuti: 40,
    prezzoEuro: 130,
    tipo: "visita",
    descrizione:
      "Visita dedicata al percorso diabetologico, con revisione dei valori registrati dal " +
      "paziente e delle analisi di laboratorio. Comprende la misurazione di pressione, peso e " +
      "circonferenza addominale. Il referto viene consegnato a fine visita, insieme al " +
      "promemoria dei controlli concordati.",
    preparazione:
      "Portare il diario della glicemia o lo scarico del sensore, le ultime analisi del sangue " +
      "e la lista dei farmaci con i dosaggi.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["diabete", "glicemia", "diabetologo", "controllo", "analisi", "diario", "visita"],
  },
  {
    slug: "prelievo-del-sangue",
    nome: "Prelievo del sangue",
    specialita: "endocrinologia",
    medici: ["francesca-galli"],
    durataMinuti: 15,
    prezzoEuro: 40,
    tipo: "analisi",
    descrizione:
      "Prelievo venoso nella sala prelievi del piano 0, con accesso su appuntamento tra le 07:30 " +
      "e le 09:30 da lunedì a sabato. Il campione viene inviato al laboratorio convenzionato e " +
      "gli esiti vengono caricati nell'area referti. Il costo indicato è quello del solo " +
      "prelievo: le singole analisi si aggiungono secondo il listino consegnato in accettazione.",
    preparazione:
      "Presentarsi a digiuno da almeno 8 ore; è consentita acqua. Portare la richiesta con " +
      "l'elenco delle analisi da eseguire.",
    giorniReferto: 3,
    impegnativa: false,
    tags: ["prelievo", "sangue", "digiuno", "analisi", "laboratorio", "sala prelievi", "mattina"],
  },

  // ——— Gastroenterologia ———
  {
    slug: "visita-gastroenterologica",
    nome: "Visita gastroenterologica",
    specialita: "gastroenterologia",
    medici: ["roberto-mezzadri"],
    durataMinuti: 30,
    prezzoEuro: 120,
    tipo: "visita",
    descrizione:
      "Colloquio, esame dell'addome e lettura degli esami già eseguiti, comprese eventuali " +
      "endoscopie. Si svolge nello Studio 2.5 al piano 2; chi non può usare la scaletta interna " +
      "lo segnala in accettazione e viene ricevuto al piano 1. Il referto viene consegnato alla " +
      "fine.",
    preparazione:
      "Portare le analisi recenti, i referti di ecografie o endoscopie già fatte e l'elenco dei " +
      "farmaci in corso.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["stomaco", "intestino", "gastroenterologo", "reflusso", "digestione", "visita", "fegato"],
  },
  {
    slug: "breath-test-helicobacter",
    nome: "Breath test per Helicobacter pylori",
    specialita: "gastroenterologia",
    medici: ["roberto-mezzadri"],
    durataMinuti: 60,
    prezzoEuro: 80,
    tipo: "analisi",
    descrizione:
      "Esame non invasivo in cui si soffia in alcune provette, prima e dopo aver bevuto una " +
      "soluzione, a distanza di circa trenta minuti. Richiede di restare in sede per tutta la " +
      "durata, nella sala d'attesa del piano 2. Le provette vengono inviate al laboratorio " +
      "convenzionato.",
    preparazione:
      "Digiuno da almeno 8 ore, compresi caffè, fumo e chewing gum. Se sono stati assunti " +
      "antibiotici o farmaci per lo stomaco nelle settimane precedenti, segnalarlo in " +
      "prenotazione per fissare la data corretta.",
    giorniReferto: 5,
    impegnativa: true,
    tags: ["breath test", "helicobacter", "digiuno", "provette", "stomaco", "laboratorio"],
  },

  // ——— Fisioterapia ———
  {
    slug: "valutazione-fisioterapica",
    nome: "Valutazione fisioterapica iniziale",
    specialita: "fisioterapia",
    medici: ["ilaria-costa", "matteo-sereni"],
    durataMinuti: 45,
    prezzoEuro: 70,
    tipo: "visita",
    descrizione:
      "Primo appuntamento del percorso: il fisioterapista raccoglie la storia del problema, " +
      "misura il movimento e la forza e concorda con il paziente il numero e la frequenza delle " +
      "sedute. Si svolge nella palestra del piano 1. Al termine viene consegnata una scheda " +
      "scritta con il piano concordato.",
    preparazione:
      "Portare abbigliamento comodo e scarpe da ginnastica, più i referti ortopedici, le " +
      "radiografie o le lettere di dimissione disponibili.",
    giorniReferto: 0,
    impegnativa: false,
    tags: [
      "fisioterapia",
      "valutazione",
      "primo appuntamento",
      "palestra",
      "movimento",
      "riabilitazione",
    ],
  },
  {
    slug: "seduta-di-fisioterapia",
    nome: "Seduta di fisioterapia",
    specialita: "fisioterapia",
    medici: ["ilaria-costa", "matteo-sereni"],
    durataMinuti: 45,
    prezzoEuro: 55,
    tipo: "terapia",
    descrizione:
      "Seduta individuale di terapia manuale ed esercizio, nella palestra del piano 1, secondo " +
      "il piano concordato nella valutazione iniziale. Gli spogliatoi con armadietti sono " +
      "davanti alla palestra. I pacchetti da cinque o dieci sedute si acquistano in " +
      "accettazione.",
    preparazione:
      "Abbigliamento sportivo, scarpe da ginnastica e un telo personale. Arrivare cinque minuti " +
      "prima per cambiarsi.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["seduta", "fisioterapia", "esercizi", "palestra", "terapia manuale", "pacchetto"],
  },
  {
    slug: "tecarterapia",
    nome: "Tecarterapia",
    specialita: "fisioterapia",
    medici: ["matteo-sereni"],
    durataMinuti: 30,
    prezzoEuro: 45,
    tipo: "terapia",
    descrizione:
      "Applicazione di un manipolo che trasmette energia nella zona trattata, con la percezione " +
      "di un calore moderato. Si svolge nell'area attrezzata della palestra del piano 1 e dura " +
      "circa mezz'ora. Si prenota di solito all'interno di un percorso già impostato.",
    preparazione:
      "Togliere orologi, catenine e altri oggetti metallici prima della seduta. Segnalare al " +
      "fisioterapista la presenza di dispositivi impiantati o di protesi metalliche.",
    giorniReferto: 0,
    impegnativa: false,
    tags: ["tecar", "tecarterapia", "terapia fisica", "palestra", "calore", "riabilitazione"],
  },

  // ——— Diagnostica per immagini ———
  {
    slug: "ecocardiogramma",
    nome: "Ecocardiogramma",
    specialita: "diagnostica-per-immagini",
    medici: ["marco-bellani"],
    durataMinuti: 35,
    prezzoEuro: 140,
    tipo: "esame",
    descrizione:
      "Ecografia del cuore eseguita dal cardiologo nella sala di ecografia del piano 0. Si " +
      "svolge da sdraiati su un fianco, a torace scoperto, con la sonda appoggiata sul petto e " +
      "un gel conduttore. Le immagini e le misure vengono salvate e allegate al referto.",
    preparazione:
      "Portare i referti cardiologici e gli elettrocardiogrammi precedenti. Indossare una " +
      "maglietta facile da togliere.",
    giorniReferto: 2,
    impegnativa: true,
    tags: ["ecocardiogramma", "ecografia del cuore", "cuore", "ultrasuoni", "sonda", "referto"],
  },
  {
    slug: "ecografia-addome-completo",
    nome: "Ecografia addome completo",
    specialita: "diagnostica-per-immagini",
    medici: ["luca-tarasconi"],
    durataMinuti: 30,
    prezzoEuro: 110,
    tipo: "esame",
    descrizione:
      "Esame con ultrasuoni degli organi dell'addome, eseguito dal radiologo al piano 0. Si " +
      "svolge da sdraiati, con la sonda appoggiata sulla pelle e un gel che a volte è freddo. " +
      "Dura circa mezz'ora e il referto viene scritto nei giorni successivi.",
    preparazione:
      "Digiuno da almeno 6 ore, acqua consentita. Nelle 24 ore precedenti evitare bevande " +
      "gassate. Portare le ecografie dell'addome già eseguite.",
    giorniReferto: 3,
    impegnativa: true,
    tags: ["ecografia", "addome", "digiuno", "fegato", "reni", "ultrasuoni", "piano 0"],
  },
  {
    slug: "ecografia-tiroide",
    nome: "Ecografia della tiroide",
    specialita: "diagnostica-per-immagini",
    medici: ["luca-tarasconi"],
    durataMinuti: 20,
    prezzoEuro: 90,
    tipo: "esame",
    descrizione:
      "Esame con ultrasuoni del collo, eseguito con la sonda appoggiata sulla gola mentre si sta " +
      "sdraiati con la testa leggermente inclinata indietro. Dura una ventina di minuti e non " +
      "richiede digiuno. Il referto comprende le misure registrate dallo strumento.",
    preparazione:
      "Non indossare collane o maglioni a collo alto. Portare le analisi degli ormoni tiroidei " +
      "e le ecografie della tiroide già eseguite.",
    giorniReferto: 3,
    impegnativa: true,
    tags: ["ecografia", "tiroide", "collo", "ultrasuoni", "noduli", "referto"],
  },
  {
    slug: "radiografia-torace",
    nome: "Radiografia del torace",
    specialita: "diagnostica-per-immagini",
    medici: ["luca-tarasconi"],
    durataMinuti: 15,
    prezzoEuro: 60,
    tipo: "esame",
    descrizione:
      "Radiografia eseguita in piedi davanti allo strumento, nella sala schermata del piano 0. " +
      "L'esecuzione richiede pochi minuti: va trattenuto il respiro per qualche secondo. Le " +
      "immagini vengono refertate dal radiologo e consegnate con la stampa o il link di " +
      "download.",
    preparazione:
      "Spogliarsi dalla vita in su nello spogliatoio adiacente e togliere collane e piercing. " +
      "Segnalare al personale un'eventuale gravidanza o il sospetto di una gravidanza.",
    giorniReferto: 2,
    impegnativa: true,
    tags: ["radiografia", "rx", "torace", "lastra", "piano 0", "radiologia", "immagini"],
  },
];
