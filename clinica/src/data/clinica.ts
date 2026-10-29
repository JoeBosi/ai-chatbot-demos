// Dati della struttura. Tutto inventato: indirizzo, telefono e email non esistono.

/** Email usata negli esempi di prenotazione della demo. */
export const DEMO_EMAIL = "demo@vallenova.example";

/** Codice prenotazione di esempio, citato nei documenti informativi. */
export const DEMO_CODICE = "PR-20481";

export const clinica = {
  nome: "Poliambulatorio Vallenova",
  claim: "Visite, esami e fisioterapia in un unico edificio, su tre piani.",
  indirizzo: "Via delle Camelie 12",
  cap: "43121",
  citta: "Parma",
  provincia: "PR",
  telefono: "0521 000 000",
  telefonoReferti: "0521 000 001",
  email: "info@vallenova.example",
  emailReferti: "referti@vallenova.example",
  piani: [0, 1, 2],

  /** Orari di apertura della reception, giorno per giorno. */
  orari: [
    { giorno: 1, nome: "Lunedì", dalle: "08:00", alle: "19:00" },
    { giorno: 2, nome: "Martedì", dalle: "08:00", alle: "19:00" },
    { giorno: 3, nome: "Mercoledì", dalle: "08:00", alle: "19:00" },
    { giorno: 4, nome: "Giovedì", dalle: "08:00", alle: "19:00" },
    { giorno: 5, nome: "Venerdì", dalle: "08:00", alle: "19:00" },
    { giorno: 6, nome: "Sabato", dalle: "08:00", alle: "13:00" },
    { giorno: 0, nome: "Domenica", dalle: null, alle: null },
  ],

  /** Orari del solo sportello referti, al piano 0. */
  orariRitiroReferti: "Da lunedì a venerdì 08:30-13:00 e 14:30-18:00, sabato 08:30-12:30.",

  comeArrivare: {
    auto:
      "Da tangenziale, uscita Parma Centro, poi direzione quartiere Vallenova: Via delle Camelie " +
      "si imbocca dalla rotonda di Via dei Pioppi. L'ingresso pazienti è al civico 12.",
    parcheggio:
      "Parcheggio interno gratuito per i pazienti, 40 posti, di cui 4 riservati alle persone con " +
      "disabilità davanti all'ingresso principale. Quando è pieno c'è il parcheggio pubblico a " +
      "strisce blu di Via dei Pioppi, a 200 metri.",
    bus:
      "Linee 7 e 14, fermata Camelie, a 80 metri dall'ingresso. Dalla stazione ferroviaria sono " +
      "circa 15 minuti con la linea 7.",
    bici: "Rastrelliera coperta per 20 biciclette a sinistra dell'ingresso principale.",
  },

  accessibilita: {
    note:
      "Ingresso principale a livello strada, senza gradini, con porta automatica. Due ascensori " +
      "(A e B) servono tutti i piani e sono abbastanza larghi per una carrozzina. Servizi igienici " +
      "accessibili ai piani 0 e 1. Una sola stanza, lo Studio 2.5 al piano 2, si raggiunge solo con " +
      "una scaletta interna: chi non può usarla viene ricevuto in un ambulatorio del piano 1.",
    accompagnatori:
      "Un accompagnatore può entrare in sala d'attesa e, se il paziente lo chiede, anche in " +
      "ambulatorio. Per i minori serve sempre un genitore o un tutore.",
    aiutoInSede:
      "In accettazione è disponibile una carrozzina di cortesia; per chiederla in anticipo basta " +
      "telefonare allo 0521 000 000.",
  },
} as const;
