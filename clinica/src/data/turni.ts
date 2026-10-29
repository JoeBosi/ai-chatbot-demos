import type { Assenza, Turno } from "./types";

// Agenda settimanale ricorrente. Ogni medico lavora 2 o 3 giorni; il sabato (giorno 6) è
// aperto solo la mattina e solo per quattro professionisti: Ferraro, Moretti, Tarasconi e Costa.
// Ogni stanza ospita una sola persona per fascia: le stanze sono assegnate per specialità
// (cardiologia in 1.1, dermatologia in 1.2, ginecologia in 1.3, ortopedia in 2.1, oculistica
// in 2.2, otorino in 2.3, endocrinologia in 2.4, gastroenterologia in 2.5, fisioterapia in
// palestra, ecografie e radiografie nelle rispettive sale del piano 0).

export const turni: Turno[] = [
  // Cardiologia — Ambulatorio 1.1
  { medico: "marco-bellani", giorno: 1, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-1" },
  { medico: "marco-bellani", giorno: 3, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-1" },
  { medico: "elena-ferraro", giorno: 2, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-1-1" },
  { medico: "elena-ferraro", giorno: 4, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-1" },
  { medico: "elena-ferraro", giorno: 6, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-1" },

  // Dermatologia — Ambulatorio 1.2
  { medico: "giulia-moretti", giorno: 1, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-1-2" },
  { medico: "giulia-moretti", giorno: 4, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-1-2" },
  { medico: "giulia-moretti", giorno: 6, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-2" },
  { medico: "sandro-lippi", giorno: 2, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-2" },
  { medico: "sandro-lippi", giorno: 5, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-2" },

  // Ginecologia — Ambulatorio 1.3
  { medico: "chiara-venturi", giorno: 1, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-3" },
  { medico: "chiara-venturi", giorno: 3, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-1-3" },
  { medico: "anna-rinaldi", giorno: 2, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-3" },
  { medico: "anna-rinaldi", giorno: 4, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-1-3" },
  { medico: "anna-rinaldi", giorno: 5, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-1-3" },

  // Ortopedia — Ambulatorio 2.1
  { medico: "paolo-de-stefani", giorno: 2, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-1" },
  { medico: "paolo-de-stefani", giorno: 3, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-2-1" },
  { medico: "paolo-de-stefani", giorno: 5, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-1" },

  // Oculistica — Ambulatorio 2.2
  { medico: "silvia-boschi", giorno: 1, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-2" },
  { medico: "silvia-boschi", giorno: 3, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-2" },
  { medico: "silvia-boschi", giorno: 4, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-2-2" },

  // Otorinolaringoiatria — Ambulatorio 2.3
  { medico: "davide-nardi", giorno: 2, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-2-3" },
  { medico: "davide-nardi", giorno: 4, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-3" },
  { medico: "davide-nardi", giorno: 5, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-2-3" },

  // Endocrinologia — Ambulatorio 2.4
  { medico: "francesca-galli", giorno: 1, dalle: "14:30", alle: "18:30", stanza: "ambulatorio-2-4" },
  { medico: "francesca-galli", giorno: 3, dalle: "09:00", alle: "13:00", stanza: "ambulatorio-2-4" },

  // Gastroenterologia — Studio 2.5
  { medico: "roberto-mezzadri", giorno: 2, dalle: "09:00", alle: "13:00", stanza: "studio-2-5" },
  { medico: "roberto-mezzadri", giorno: 5, dalle: "14:30", alle: "18:30", stanza: "studio-2-5" },

  // Fisioterapia — Palestra 1.4
  { medico: "ilaria-costa", giorno: 1, dalle: "09:00", alle: "13:00", stanza: "palestra-fisioterapia" },
  { medico: "ilaria-costa", giorno: 3, dalle: "09:00", alle: "13:00", stanza: "palestra-fisioterapia" },
  { medico: "ilaria-costa", giorno: 6, dalle: "09:00", alle: "13:00", stanza: "palestra-fisioterapia" },
  { medico: "matteo-sereni", giorno: 2, dalle: "14:30", alle: "18:30", stanza: "palestra-fisioterapia" },
  { medico: "matteo-sereni", giorno: 4, dalle: "14:30", alle: "18:30", stanza: "palestra-fisioterapia" },
  { medico: "matteo-sereni", giorno: 5, dalle: "09:00", alle: "13:00", stanza: "palestra-fisioterapia" },

  // Ecografia 0.1 — una sola sonda, un medico per fascia
  { medico: "luca-tarasconi", giorno: 3, dalle: "09:00", alle: "13:00", stanza: "ecografia" },
  { medico: "marco-bellani", giorno: 4, dalle: "14:30", alle: "18:30", stanza: "ecografia" },
  { medico: "chiara-venturi", giorno: 5, dalle: "09:00", alle: "13:00", stanza: "ecografia" },

  // Radiologia 0.2 — solo il radiologo
  { medico: "luca-tarasconi", giorno: 1, dalle: "09:00", alle: "13:00", stanza: "radiologia" },
  { medico: "luca-tarasconi", giorno: 3, dalle: "14:30", alle: "18:30", stanza: "radiologia" },
  { medico: "luca-tarasconi", giorno: 6, dalle: "09:00", alle: "13:00", stanza: "radiologia" },
];

export const assenze: Assenza[] = [
  {
    medico: null,
    dal: "2026-12-24",
    al: "2027-01-03",
    motivo: "Chiusura della struttura per le festività natalizie: riapertura lunedì 4 gennaio 2027.",
  },
  {
    medico: "elena-ferraro",
    dal: "2026-08-03",
    al: "2026-08-23",
    motivo: "Ferie estive: le visite cardiologiche restano coperte dal Dott. Bellani.",
  },
  {
    medico: "matteo-sereni",
    dal: "2027-02-15",
    al: "2027-02-22",
    motivo: "Ferie: le sedute di fisioterapia vengono riprogrammate con la Dott.ssa Costa.",
  },
];
