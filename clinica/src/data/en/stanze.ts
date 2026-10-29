// English text for rooms, keyed by slug. The Italian file stays the source of truth for everything else.
export const stanzeEn: Record<string, { nome: string; ala: string; indicazioni: string }> = {
  accettazione: {
    nome: "Reception",
    ala: "Centre",
    indicazioni:
      "It is the desk straight ahead of the main entrance at Via delle Camelie 12, on the right after the automatic door. Here you take a ticket and check in for your appointment.",
  },
  "ritiro-referti": {
    nome: "Reports desk",
    ala: "Centre",
    indicazioni:
      "From the main entrance keep left and walk along the large waiting room. The desk is the last one in the corridor, with the green sign.",
  },
  "sala-prelievi": {
    nome: "Blood-draw room 0.3",
    ala: "North",
    indicazioni:
      "From reception go straight on towards the North wing for about twenty metres. The blood-draw room is the first door on the right, with its own waiting room.",
  },
  ecografia: {
    nome: "Ultrasound 0.1",
    ala: "South",
    indicazioni:
      "From the main entrance turn right towards the South wing and follow the light blue line on the floor. It is the first door after the changing room.",
  },
  radiologia: {
    nome: "Radiology 0.2",
    ala: "South",
    indicazioni:
      "In the South wing of the ground floor, next to the ultrasound room. You can recognise it by the shielded door and the warning light above the door frame.",
  },
  "ambulatorio-1-1": {
    nome: "Consulting room 1.1",
    ala: "North",
    indicazioni:
      "From the main entrance take lift A to the first floor, then turn left. It is the first door in the North corridor.",
  },
  "ambulatorio-1-2": {
    nome: "Consulting room 1.2",
    ala: "North",
    indicazioni:
      "First floor, North corridor, second door on the left after lift A. You can also go up by the central stairs.",
  },
  "ambulatorio-1-3": {
    nome: "Consulting room 1.3",
    ala: "Centre",
    indicazioni:
      "First floor, opposite the central waiting room. From lift A turn right and cross the floor's lobby.",
  },
  "palestra-fisioterapia": {
    nome: "Gym 1.4",
    ala: "South",
    indicazioni:
      "From the main entrance take lift B to the first floor, then go right all the way to the end. The gym is the glass door with the changing rooms in front of it.",
  },
  "ambulatorio-2-1": {
    nome: "Consulting room 2.1",
    ala: "North",
    indicazioni:
      "From the main entrance take lift A to the second floor, then turn left. It is the first door in the North corridor.",
  },
  "ambulatorio-2-2": {
    nome: "Consulting room 2.2",
    ala: "North",
    indicazioni:
      "Second floor, North corridor, second door on the left. The waiting room is in the first few metres of the corridor, just outside lift A.",
  },
  "ambulatorio-2-3": {
    nome: "Consulting room 2.3",
    ala: "Centre",
    indicazioni:
      "Second floor, opposite the lift A lobby. The door is on the right, next to the soundproof booth used for hearing tests.",
  },
  "ambulatorio-2-4": {
    nome: "Consulting room 2.4",
    ala: "South",
    indicazioni:
      "From the main entrance take lift A to the second floor, then turn right and go to the end of the South corridor.",
  },
  "studio-2-5": {
    nome: "Office 2.5",
    ala: "South",
    indicazioni:
      "At the end of the South corridor on the second floor there is a small inside staircase of six steps, with no lift. The office is at the top. If you cannot use the stairs, tell reception and you will be seen in a consulting room on the first floor.",
  },
};
