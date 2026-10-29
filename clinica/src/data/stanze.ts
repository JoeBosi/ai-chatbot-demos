import type { Stanza } from "./types";

// 14 stanze su tre piani. Al piano 0 stanno accettazione, referti, prelievi e i macchinari
// pesanti (ecografia e radiologia); gli ambulatori sono ai piani 1 e 2; la palestra della
// fisioterapia è al piano 1. Tutte accessibili tranne lo Studio 2.5, raggiungibile solo
// da una scaletta interna.

export const stanze: Stanza[] = [
  {
    slug: "accettazione",
    nome: "Accettazione",
    piano: 0,
    ala: "Centro",
    indicazioni:
      "È il bancone subito davanti all'ingresso principale di Via delle Camelie 12, a destra " +
      "dopo la porta automatica. Qui si ritira il numero e si registra l'appuntamento.",
    accessibile: true,
  },
  {
    slug: "ritiro-referti",
    nome: "Sportello referti",
    piano: 0,
    ala: "Centro",
    indicazioni:
      "Dall'ingresso principale si tiene la sinistra e si costeggia la sala d'attesa grande: lo " +
      "sportello è l'ultimo del corridoio, con l'insegna verde.",
    accessibile: true,
  },
  {
    slug: "sala-prelievi",
    nome: "Sala prelievi 0.3",
    piano: 0,
    ala: "Nord",
    indicazioni:
      "Dall'accettazione si prosegue dritti verso l'ala Nord per una ventina di metri: la sala " +
      "prelievi è la prima porta sulla destra, con la sua sala d'attesa dedicata.",
    accessibile: true,
  },
  {
    slug: "ecografia",
    nome: "Ecografia 0.1",
    piano: 0,
    ala: "Sud",
    indicazioni:
      "Dall'ingresso principale si gira a destra verso l'ala Sud e si segue la striscia azzurra " +
      "sul pavimento: è la prima porta dopo lo spogliatoio.",
    accessibile: true,
  },
  {
    slug: "radiologia",
    nome: "Radiologia 0.2",
    piano: 0,
    ala: "Sud",
    indicazioni:
      "Nell'ala Sud del piano terra, accanto alla sala di ecografia: si riconosce dalla porta " +
      "schermata e dalla spia luminosa sopra lo stipite.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-1-1",
    nome: "Ambulatorio 1.1",
    piano: 1,
    ala: "Nord",
    indicazioni:
      "Dall'ingresso principale, ascensore A fino al primo piano, poi a sinistra: è la prima " +
      "porta del corridoio Nord.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-1-2",
    nome: "Ambulatorio 1.2",
    piano: 1,
    ala: "Nord",
    indicazioni:
      "Primo piano, corridoio Nord, seconda porta a sinistra dopo l'ascensore A. Si può salire " +
      "anche dalla scala centrale.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-1-3",
    nome: "Ambulatorio 1.3",
    piano: 1,
    ala: "Centro",
    indicazioni:
      "Primo piano, di fronte alla sala d'attesa centrale: dall'ascensore A si gira a destra e " +
      "si attraversa l'atrio del piano.",
    accessibile: true,
  },
  {
    slug: "palestra-fisioterapia",
    nome: "Palestra 1.4",
    piano: 1,
    ala: "Sud",
    indicazioni:
      "Dall'ingresso principale, ascensore B fino al primo piano, poi tutto a destra fino in " +
      "fondo: la palestra è la porta a vetri con gli spogliatoi davanti.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-2-1",
    nome: "Ambulatorio 2.1",
    piano: 2,
    ala: "Nord",
    indicazioni:
      "Dall'ingresso principale, ascensore A fino al secondo piano, poi a sinistra: prima porta " +
      "del corridoio Nord.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-2-2",
    nome: "Ambulatorio 2.2",
    piano: 2,
    ala: "Nord",
    indicazioni:
      "Secondo piano, corridoio Nord, seconda porta a sinistra. La sala d'attesa è nei primi " +
      "metri del corridoio, subito fuori dall'ascensore A.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-2-3",
    nome: "Ambulatorio 2.3",
    piano: 2,
    ala: "Centro",
    indicazioni:
      "Secondo piano, di fronte all'atrio dell'ascensore A: la porta è a destra, accanto alla " +
      "cabina silente usata per gli esami dell'udito.",
    accessibile: true,
  },
  {
    slug: "ambulatorio-2-4",
    nome: "Ambulatorio 2.4",
    piano: 2,
    ala: "Sud",
    indicazioni:
      "Dall'ingresso principale, ascensore A fino al secondo piano, poi a destra fino al fondo " +
      "del corridoio Sud.",
    accessibile: true,
  },
  {
    slug: "studio-2-5",
    nome: "Studio 2.5",
    piano: 2,
    ala: "Sud",
    indicazioni:
      "In fondo al corridoio Sud del secondo piano c'è una scaletta interna di sei gradini, " +
      "senza ascensore: lo studio è in cima. Chi non può usare la scaletta lo segnala in " +
      "accettazione e viene ricevuto in un ambulatorio del piano 1.",
    accessibile: false,
  },
];
