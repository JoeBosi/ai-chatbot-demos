import type { Specialita } from "./types";

// Le 10 specialità del poliambulatorio. I testi sono descrittivi e organizzativi:
// spiegano di cosa si occupa il reparto e come si svolge una visita, mai cosa fare.

export const specialita: Specialita[] = [
  {
    slug: "cardiologia",
    nome: "Cardiologia",
    sommario: "Si occupa del cuore, della pressione e della circolazione del sangue.",
    descrizione:
      "La cardiologia è la branca che si occupa del cuore e dei vasi sanguigni, quindi anche di " +
      "pressione arteriosa, battito e circolazione. In poliambulatorio offriamo visite " +
      "cardiologiche, elettrocardiogrammi a riposo e sotto sforzo ed ecocardiogrammi. Una visita " +
      "tipo dura circa 30 minuti: il cardiologo raccoglie la storia clinica, misura la pressione, " +
      "ascolta il cuore e di solito esegue un elettrocardiogramma nello stesso appuntamento. Al " +
      "termine consegna un referto scritto, che il paziente porta al proprio medico curante.",
    tags: [
      "cuore",
      "pressione alta",
      "elettrocardiogramma",
      "ecg",
      "battito",
      "colesterolo",
      "sotto sforzo",
      "ecocardiogramma",
    ],
  },
  {
    slug: "dermatologia",
    nome: "Dermatologia",
    sommario: "Si occupa di pelle, capelli, unghie e nei.",
    descrizione:
      "La dermatologia riguarda la pelle e i suoi annessi: capelli, unghie, nei e macchie " +
      "cutanee. Le prestazioni più richieste sono la visita dermatologica, la mappatura dei nei " +
      "con il dermatoscopio e i piccoli trattamenti ambulatoriali come la crioterapia. La visita " +
      "dura circa 20-30 minuti e prevede l'osservazione della pelle, a volte su tutto il corpo, " +
      "con uno strumento di ingrandimento. Il referto viene rilasciato a fine visita e, nel caso " +
      "della mappatura, include le immagini archiviate per il confronto negli anni successivi.",
    tags: [
      "pelle",
      "nei",
      "macchie",
      "acne",
      "capelli",
      "unghie",
      "dermatoscopio",
      "mappatura nei",
      "prurito",
    ],
  },
  {
    slug: "ginecologia",
    nome: "Ginecologia",
    sommario: "Si occupa della salute femminile e della gravidanza.",
    descrizione:
      "La ginecologia si occupa dell'apparato genitale femminile, dei controlli periodici e del " +
      "percorso della gravidanza. In poliambulatorio si eseguono visite ginecologiche, pap test, " +
      "ecografie pelviche ed ecografie in gravidanza. La visita dura 25-30 minuti e comprende il " +
      "colloquio, l'esame ginecologico e, se previsto dall'appuntamento, l'ecografia nella stessa " +
      "stanza. Il pap test è un prelievo rapido di cellule, il cui esito arriva dal laboratorio " +
      "entro qualche giorno.",
    tags: [
      "gravidanza",
      "pap test",
      "ciclo",
      "ecografia pelvica",
      "contraccezione",
      "menopausa",
      "visita ginecologica",
      "controllo annuale",
    ],
  },
  {
    slug: "ortopedia",
    nome: "Ortopedia",
    sommario: "Si occupa di ossa, articolazioni, muscoli e tendini.",
    descrizione:
      "L'ortopedia riguarda l'apparato muscolo-scheletrico: ossa, articolazioni, legamenti e " +
      "tendini. Le prestazioni comprendono la visita ortopedica, le infiltrazioni articolari " +
      "ambulatoriali e le medicazioni. Durante la visita, che dura circa 30 minuti, lo " +
      "specialista valuta il movimento delle articolazioni e guarda eventuali radiografie o " +
      "risonanze già eseguite: per questo conviene portarle con sé. Spesso il percorso continua " +
      "con la fisioterapia, prenotabile nello stesso poliambulatorio.",
    tags: [
      "ginocchio",
      "spalla",
      "schiena",
      "frattura",
      "tendine",
      "anca",
      "infiltrazione",
      "lombalgia",
    ],
  },
  {
    slug: "oculistica",
    nome: "Oculistica",
    sommario: "Si occupa della vista e della salute degli occhi.",
    descrizione:
      "L'oculistica si occupa degli occhi e della vista, dalla misurazione dei difetti visivi ai " +
      "controlli periodici della pressione oculare. In sede si eseguono la visita oculistica " +
      "completa e l'esame del campo visivo. La visita dura circa 30 minuti; se è previsto " +
      "l'esame del fondo oculare vengono instillate gocce che dilatano la pupilla e rendono la " +
      "vista annebbiata per qualche ora, quindi è meglio non programmare di guidare subito dopo. " +
      "La prescrizione per occhiali o lenti, quando serve, viene consegnata a fine visita.",
    tags: [
      "vista",
      "occhiali",
      "occhi",
      "campo visivo",
      "pressione oculare",
      "fondo oculare",
      "lenti",
      "visita oculistica",
    ],
  },
  {
    slug: "otorinolaringoiatria",
    nome: "Otorinolaringoiatria",
    sommario: "Si occupa di orecchio, naso e gola.",
    descrizione:
      "L'otorinolaringoiatria, abbreviata in otorino, si occupa di orecchie, naso, seni " +
      "paranasali, gola e voce. Le prestazioni disponibili sono la visita specialistica, l'esame " +
      "audiometrico, il lavaggio auricolare e il tampone faringeo. La visita dura circa 25 " +
      "minuti: lo specialista osserva orecchie, naso e gola con strumenti luminosi e, se " +
      "l'appuntamento lo prevede, completa con l'esame dell'udito in cabina silente. Il referto " +
      "viene consegnato alla fine.",
    tags: [
      "orecchie",
      "naso",
      "gola",
      "udito",
      "audiometria",
      "raucedine",
      "tappo di cerume",
      "russamento",
      "sinusite",
    ],
  },
  {
    slug: "endocrinologia",
    nome: "Endocrinologia",
    sommario: "Si occupa di ormoni, tiroide, metabolismo e diabete.",
    descrizione:
      "L'endocrinologia riguarda le ghiandole che producono ormoni, come la tiroide e le " +
      "surrenali, e il metabolismo in generale; comprende anche l'area del diabete. In sede si " +
      "eseguono visite endocrinologiche e visite diabetologiche, oltre al prelievo di sangue per " +
      "le analisi di laboratorio. La visita dura 30-40 minuti ed è molto basata sui documenti: " +
      "lo specialista legge le analisi precedenti, l'elenco dei farmaci in corso ed eventuali " +
      "ecografie. Per questo chiediamo di portare tutta la documentazione disponibile.",
    tags: [
      "tiroide",
      "ormoni",
      "diabete",
      "metabolismo",
      "peso",
      "glicemia",
      "analisi del sangue",
      "menopausa",
    ],
  },
  {
    slug: "gastroenterologia",
    nome: "Gastroenterologia",
    sommario: "Si occupa di stomaco, intestino, fegato e digestione.",
    descrizione:
      "La gastroenterologia si occupa dell'apparato digerente: esofago, stomaco, intestino, " +
      "fegato e vie biliari. In poliambulatorio offriamo la visita gastroenterologica e il " +
      "breath test per l'Helicobacter pylori; le ecografie dell'addome si prenotano nel reparto " +
      "di diagnostica per immagini. La visita dura circa 30 minuti, con colloquio, esame " +
      "dell'addome e lettura degli esami già eseguiti. Il breath test consiste nel soffiare in " +
      "alcune provette a distanza di tempo e richiede circa un'ora di permanenza in sede.",
    tags: [
      "stomaco",
      "intestino",
      "fegato",
      "digestione",
      "reflusso",
      "helicobacter",
      "breath test",
      "colon",
      "gonfiore",
    ],
  },
  {
    slug: "fisioterapia",
    nome: "Fisioterapia",
    sommario: "Percorsi di riabilitazione e terapie fisiche in palestra attrezzata.",
    descrizione:
      "La fisioterapia si occupa del recupero del movimento dopo un infortunio, un intervento o " +
      "un periodo di dolore persistente. In sede si eseguono la valutazione fisioterapica " +
      "iniziale, le sedute di terapia manuale ed esercizio e la tecarterapia. Il percorso inizia " +
      "sempre con una valutazione di 45 minuti, in cui il fisioterapista misura il movimento e " +
      "concorda con il paziente il numero di sedute; le sedute successive durano 45 minuti e si " +
      "svolgono nella palestra del piano 1. Conviene portare abbigliamento comodo e scarpe da " +
      "ginnastica.",
    tags: [
      "riabilitazione",
      "palestra",
      "esercizi",
      "tecar",
      "massaggio",
      "post operatorio",
      "mal di schiena",
      "recupero",
      "mobilità",
    ],
  },
  {
    slug: "diagnostica-per-immagini",
    nome: "Diagnostica per immagini",
    sommario: "Radiologia ed ecografie, al piano 0 dove stanno i macchinari.",
    descrizione:
      "La diagnostica per immagini raccoglie gli esami che producono immagini del corpo: " +
      "radiografie ed ecografie. Tutte le apparecchiature sono al piano 0, perché sono pesanti e " +
      "richiedono stanze schermate. Una radiografia dura pochi minuti, un'ecografia tra 15 e 30 " +
      "minuti a seconda della zona: il medico appoggia la sonda sulla pelle con un gel e " +
      "registra le immagini. Il referto non è immediato, perché viene scritto dal medico " +
      "refertante e reso disponibile nei giorni successivi.",
    tags: [
      "ecografia",
      "radiografia",
      "rx",
      "lastra",
      "ultrasuoni",
      "referto",
      "immagini",
      "ecocardiogramma",
      "tiroide",
    ],
  },
];
