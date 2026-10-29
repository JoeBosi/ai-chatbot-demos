import type { Medico } from "./types";

// 14 professionisti inventati. Tre hanno due specialità coerenti fra loro
// (cardiologia/ginecologia/ortopedia insieme alla diagnostica per immagini, perché
// eseguono personalmente le ecografie del loro ambito).
// I colori sono scuri, per restare leggibili sul bianco, e uno diverso per ciascuno.

export const medici: Medico[] = [
  {
    slug: "marco-bellani",
    nome: "Dott. Marco Bellani",
    titolo: "Dott.",
    specialita: ["cardiologia", "diagnostica-per-immagini"],
    bio:
      "Laureato a Bologna, si occupa di cardiologia ambulatoriale da quindici anni. In " +
      "poliambulatorio segue le visite cardiologiche, gli elettrocardiogrammi e gli " +
      "ecocardiogrammi, che esegue personalmente nella sala di ecografia del piano 0.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 12345",
    colore: "#1F3A5F",
  },
  {
    slug: "elena-ferraro",
    nome: "Dott.ssa Elena Ferraro",
    titolo: "Dott.ssa",
    specialita: ["cardiologia"],
    bio:
      "Si è formata in cardiologia a Padova e lavora in ambulatorio dal 2012. Segue i controlli " +
      "della pressione arteriosa e le prove sotto sforzo, e rilascia i certificati di idoneità " +
      "sportiva non agonistica.",
    lingue: ["italiano", "inglese", "francese"],
    albo: "Ordine dei Medici di Parma n. 12871",
    colore: "#7A2E2E",
  },
  {
    slug: "giulia-moretti",
    nome: "Dott.ssa Giulia Moretti",
    titolo: "Dott.ssa",
    specialita: ["dermatologia"],
    bio:
      "Dermatologa, si occupa in particolare di mappatura dei nei in dermatoscopia digitale. " +
      "Riceve anche il sabato mattina, quando l'ambulatorio è dedicato ai controlli periodici " +
      "della pelle.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 13004",
    colore: "#2E5E4E",
  },
  {
    slug: "sandro-lippi",
    nome: "Dott. Sandro Lippi",
    titolo: "Dott.",
    specialita: ["dermatologia"],
    bio:
      "Laureato a Firenze, lavora in dermatologia ambulatoriale dal 2009. In poliambulatorio " +
      "segue le visite dermatologiche e i piccoli trattamenti ambulatoriali come la crioterapia.",
    lingue: ["italiano", "spagnolo"],
    albo: "Ordine dei Medici di Parma n. 11920",
    colore: "#4B3A6E",
  },
  {
    slug: "chiara-venturi",
    nome: "Dott.ssa Chiara Venturi",
    titolo: "Dott.ssa",
    specialita: ["ginecologia", "diagnostica-per-immagini"],
    bio:
      "Ginecologa, si occupa di controlli periodici e di monitoraggio della gravidanza. Esegue " +
      "personalmente le ecografie pelviche e ostetriche, il venerdì mattina nella sala di " +
      "ecografia del piano 0.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 13342",
    colore: "#8A4A1F",
  },
  {
    slug: "anna-rinaldi",
    nome: "Dott.ssa Anna Rinaldi",
    titolo: "Dott.ssa",
    specialita: ["ginecologia"],
    bio:
      "Si è formata a Torino e lavora in ambulatorio di ginecologia dal 2015. Segue le visite " +
      "ginecologiche e i pap test, e riceve su tre giorni alla settimana.",
    lingue: ["italiano", "inglese", "tedesco"],
    albo: "Ordine dei Medici di Parma n. 13511",
    colore: "#1E4D4A",
  },
  {
    slug: "paolo-de-stefani",
    nome: "Prof. Paolo De Stefani",
    titolo: "Prof.",
    specialita: ["ortopedia"],
    bio:
      "Ortopedico con una lunga attività di insegnamento universitario, lavora in " +
      "poliambulatorio tre giorni alla settimana. Si occupa di visite ortopediche, infiltrazioni " +
      "articolari e medicazioni, e collabora con la fisioterapia interna per i percorsi di " +
      "recupero.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 10477",
    colore: "#3B3B6D",
  },
  {
    slug: "luca-tarasconi",
    nome: "Dott. Luca Tarasconi",
    titolo: "Dott.",
    specialita: ["diagnostica-per-immagini"],
    bio:
      "Radiologo, si occupa di radiografie ed ecografie e scrive i referti degli esami eseguiti " +
      "al piano 0. Lavora in poliambulatorio dal 2017 e copre anche il turno del sabato mattina.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 13690",
    colore: "#5C4033",
  },
  {
    slug: "silvia-boschi",
    nome: "Dott.ssa Silvia Boschi",
    titolo: "Dott.ssa",
    specialita: ["oculistica"],
    bio:
      "Oculista, si occupa di visite complete della vista e di esami del campo visivo. Riceve al " +
      "piano 2 e prescrive occhiali e lenti a contatto quando la visita lo richiede.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 12558",
    colore: "#6B2D5B",
  },
  {
    slug: "davide-nardi",
    nome: "Dott. Davide Nardi",
    titolo: "Dott.",
    specialita: ["otorinolaringoiatria"],
    bio:
      "Otorinolaringoiatra, laureato a Milano, in poliambulatorio dal 2014. Segue le visite " +
      "specialistiche, gli esami audiometrici in cabina silente e i lavaggi auricolari.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 12233",
    colore: "#22503A",
  },
  {
    slug: "francesca-galli",
    nome: "Dott.ssa Francesca Galli",
    titolo: "Dott.ssa",
    specialita: ["endocrinologia"],
    bio:
      "Endocrinologa, si occupa di tiroide, metabolismo e percorsi diabetologici. Riceve due " +
      "giorni alla settimana al piano 2 e lavora molto sulla lettura delle analisi portate dal " +
      "paziente.",
    lingue: ["italiano", "inglese", "spagnolo"],
    albo: "Ordine dei Medici di Parma n. 13077",
    colore: "#704214",
  },
  {
    slug: "roberto-mezzadri",
    nome: "Dott. Roberto Mezzadri",
    titolo: "Dott.",
    specialita: ["gastroenterologia"],
    bio:
      "Gastroenterologo, laureato a Pavia, in poliambulatorio dal 2016. Segue le visite " +
      "gastroenterologiche e organizza i breath test, che si svolgono in sede nell'arco di " +
      "un'ora.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Medici di Parma n. 13425",
    colore: "#2B4C7E",
  },
  {
    slug: "ilaria-costa",
    nome: "Dott.ssa Ilaria Costa",
    titolo: "Dott.ssa",
    specialita: ["fisioterapia"],
    bio:
      "Fisioterapista, si occupa di valutazioni iniziali e di percorsi di terapia manuale ed " +
      "esercizio. Lavora nella palestra del piano 1 e copre il turno del sabato mattina.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Fisioterapisti di Parma n. 2184",
    colore: "#4A5D23",
  },
  {
    slug: "matteo-sereni",
    nome: "Dott. Matteo Sereni",
    titolo: "Dott.",
    specialita: ["fisioterapia"],
    bio:
      "Fisioterapista, si occupa di riabilitazione dopo interventi ortopedici e di tecarterapia. " +
      "Riceve nella palestra del piano 1 su tre giorni alla settimana, in parte di pomeriggio.",
    lingue: ["italiano", "inglese"],
    albo: "Ordine dei Fisioterapisti di Parma n. 2367",
    colore: "#833B2B",
  },
];
