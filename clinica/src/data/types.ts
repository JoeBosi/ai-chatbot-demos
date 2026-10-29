// Il contenuto inventato del Poliambulatorio Vallenova. Tutto finto: nessun medico, prestazione,
// prezzo o indirizzo corrisponde a una struttura reale. I tipi stanno qui perché i file di dati
// (specialita.ts, medici.ts, prestazioni.ts, stanze.ts, informazioni.ts) e la sincronizzazione del
// database devono parlare la stessa lingua.

/** Lunedì = 1 … Sabato = 6, domenica = 0 (come `Date.getDay()`). */
export type Giorno = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Specialita = {
  slug: string;
  nome: string;
  /** Una frase per il menu e per l'assistente. */
  sommario: string;
  /** Di cosa si occupa, in parole che userebbe un paziente. Informativo, mai un consiglio clinico. */
  descrizione: string;
  /** Parole con cui i pazienti la cercano: "cuore", "pressione", "elettrocardiogramma". */
  tags: string[];
};

export type Medico = {
  slug: string;
  /** Titolo + nome, come compare in agenda: "Dott.ssa Elena Ferraro". */
  nome: string;
  titolo: "Dott." | "Dott.ssa" | "Prof." | "Prof.ssa";
  specialita: string[]; // slug di Specialita: un medico può averne più di una
  /** Due o tre frasi: formazione, di cosa si occupa in concreto. Niente promesse di guarigione. */
  bio: string;
  lingue: string[];
  /** Iscrizione all'albo, inventata: serve a rendere credibile la scheda. */
  albo: string;
  /** Colore della pastiglia con le iniziali (niente foto di persone che non esistono). */
  colore: string;
};

export type Prestazione = {
  slug: string;
  nome: string;
  specialita: string; // slug
  /** Chi la esegue: slug dei medici. Deve essere coerente con le specialità del medico. */
  medici: string[];
  durataMinuti: number;
  prezzoEuro: number;
  /** Visita, esame strumentale, analisi, certificato… serve a raggruppare in pagina. */
  tipo: "visita" | "esame" | "analisi" | "certificato" | "terapia";
  descrizione: string;
  /** Come prepararsi: digiuno, documenti, farmaci da sospendere. Vuoto se non serve niente. */
  preparazione: string;
  /** Giorni lavorativi per il referto. 0 = consegnato subito a fine visita. */
  giorniReferto: number;
  /** Serve l'impegnativa del medico di base per il servizio pubblico? (demo: solo informativo) */
  impegnativa: boolean;
  tags: string[];
};

export type Stanza = {
  slug: string;
  nome: string; // "Ambulatorio 2.4"
  piano: number; // 0 = piano terra
  ala: string; // "Ala Nord"
  /** Come ci si arriva, in parole semplici: è la risposta che l'assistente darà più spesso. */
  indicazioni: string;
  accessibile: boolean;
};

/** Fascia oraria ricorrente: il dottor X, il martedì, dalle 9 alle 13, nella stanza Y. */
export type Turno = {
  medico: string; // slug
  giorno: Giorno;
  /** "09:00" / "13:00", ora locale della clinica. */
  dalle: string;
  alle: string;
  stanza: string; // slug
};

/** Chiusure della clinica o assenze di un medico. `medico: null` = chiuso tutto. */
export type Assenza = {
  medico: string | null;
  /** "2026-12-24" */
  dal: string;
  al: string;
  motivo: string;
};

/** Pagine informative: una sezione "## " = un pezzo cercabile dall'assistente. */
export type DocInfo = { slug: string; titolo: string; corpo: string };
