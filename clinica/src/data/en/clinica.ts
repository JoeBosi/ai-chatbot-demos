// English text for the clinic details. The Italian file stays the source of truth for everything else.

// Overrides only these fields of `clinica` (../clinica.ts): claim, orari[].nome,
// orariRitiroReferti, comeArrivare.*, accessibilita.*. Everything else (name, address,
// phones, emails, floors, opening times) comes from the Italian object.
export const clinicaEn = {
  claim: "Consultations, tests and physiotherapy in a single building, on three floors.",

  /** Same order and times as `clinica.orari`; only `nome` is translated. */
  orari: [
    { giorno: 1, nome: "Monday", dalle: "08:00", alle: "19:00" },
    { giorno: 2, nome: "Tuesday", dalle: "08:00", alle: "19:00" },
    { giorno: 3, nome: "Wednesday", dalle: "08:00", alle: "19:00" },
    { giorno: 4, nome: "Thursday", dalle: "08:00", alle: "19:00" },
    { giorno: 5, nome: "Friday", dalle: "08:00", alle: "19:00" },
    { giorno: 6, nome: "Saturday", dalle: "08:00", alle: "13:00" },
    { giorno: 0, nome: "Sunday", dalle: null, alle: null },
  ],

  orariRitiroReferti:
    "Monday to Friday 08:30-13:00 and 14:30-18:00, Saturday 08:30-12:30.",

  comeArrivare: {
    auto:
      "From the ring road, take the Parma Centro exit, then follow signs for the Vallenova " +
      "district: Via delle Camelie is reached from the Via dei Pioppi roundabout. The patient " +
      "entrance is at number 12.",
    parcheggio:
      "Free on-site car park for patients, 40 spaces, 4 of which are reserved for disabled " +
      "people in front of the main entrance. When it is full there is the public pay-and-display " +
      "car park (blue lines) on Via dei Pioppi, 200 metres away.",
    bus:
      "Lines 7 and 14, Camelie stop, 80 metres from the entrance. From the railway station it " +
      "takes about 15 minutes on line 7.",
    bici: "Covered rack for 20 bicycles to the left of the main entrance.",
  },

  accessibilita: {
    note:
      "Main entrance at street level, with no steps, and an automatic door. Two lifts (A and B) " +
      "serve all floors and are wide enough for a wheelchair. Accessible toilets on floors 0 and " +
      "1. Only one room, Studio 2.5 on floor 2, can be reached only by an internal flight of " +
      "steps: anyone who cannot use them is seen in a consulting room on floor 1.",
    accompagnatori:
      "A companion can come into the waiting room and, if the patient asks, also into the " +
      "consulting room. Minors must always be accompanied by a parent or guardian.",
    aiutoInSede:
      "A courtesy wheelchair is available at reception; to reserve it in advance, just phone " +
      "0521 000 000.",
  },
} as const;
