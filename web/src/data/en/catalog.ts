// English text for the catalogue, keyed by slug. The Italian catalogue in ../catalog.ts stays the
// source of truth for prices, stock and search; only the words shown on the English pages live here.
// Brand-like names (Vapora Mini, Miscela Banco…) stay as they are; generic names are translated.

type Text = { name?: string; summary: string; description: string; specs: Record<string, string> };

export const categoriesEn: Record<string, { name: string; description: string }> = {
  "macchine-espresso": {
    name: "Espresso machines",
    description: "From a compact machine for your first espresso to a dual boiler for latte art.",
  },
  macinacaffe: { name: "Grinders", description: "Conical and flat burrs: half of a good espresso is decided here." },
  caffe: {
    name: "Coffee beans",
    description: "Fresh roasts from our roastery, shipped within 10 days of roasting.",
  },
  "moka-e-filtro": { name: "Moka and filter", description: "Moka pots, drippers, French press: coffee without a pump." },
  accessori: { name: "Accessories", description: "Scales, kettles, tampers, milk jugs and everything for cleaning." },
};

export const productsEn: Record<string, Text> = {
  "vapora-mini": {
    summary: "Compact 15-bar pump machine with a steam wand, made for beginners.",
    description:
      "The Vapora Mini takes 16 cm of counter space and heats up in 40 seconds thanks to its thermoblock. The 51 mm portafilter takes ground coffee and ESE pods, so you can start even without a grinder. The panarello steam wand makes it easy to froth milk for a cappuccino, but it is not suited to latte art. Ideal for 1-2 coffees a day.",
    specs: {
      Pressure: "15 bar",
      Heating: "Thermoblock, ready in 40 s",
      Portafilter: "51 mm, pressurised baskets",
      "Works with": "Ground coffee, 44 mm ESE pods",
      "Water tank": "0.9 L",
      Power: "1350 W",
      "Steam wand": "Panarello",
      Dimensions: "16 × 30 × 29 cm",
      Warranty: "2 years",
    },
  },
  "vapora-classica": {
    summary: "Professional 58 mm portafilter and a two-hole steam wand.",
    description:
      "Steel body, 300 ml brass boiler and a 58 mm portafilter with non-pressurised baskets: the Classica is the machine on which you really learn to extract. The two-hole steam wand allows latte art. It needs a grinder suited to espresso: with pre-ground supermarket coffee the shot runs fast and watery.",
    specs: {
      Pressure: "15 bar with OPV set to 10 bar",
      Heating: "300 ml brass boiler",
      Portafilter: "58 mm, professional baskets",
      "Works with": "Freshly ground coffee",
      "Water tank": "2 L",
      Power: "1200 W",
      "Steam wand": "Professional, two holes",
      Dimensions: "22 × 25 × 33 cm",
      Warranty: "2 years",
    },
  },
  "brenta-pid": {
    summary: "Single boiler with PID temperature control and a group-head pressure gauge.",
    description:
      "The PID controller keeps the water within ±1 °C of the chosen temperature (88 to 96 °C), so you can match the extraction to light or dark roasts. E61 thermosiphon group, pressure gauge on the group, adjustable pre-infusion. For milk you wait about 45 seconds while the boiler switches to steam mode.",
    specs: {
      Pressure: "15-bar vibration pump, OPV 9 bar",
      Heating: "Single 450 ml boiler, PID",
      Group: "E61",
      Portafilter: "58 mm",
      "Water tank": "2.5 L",
      Power: "1400 W",
      "Warm-up time": "About 20 minutes",
      Dimensions: "25 × 42 × 38 cm",
      Warranty: "3 years",
    },
  },
  "brenta-duo": {
    summary: "Dual boiler with PID on both: espresso and steam at the same time.",
    description:
      "Two separate boilers (0.75 L coffee, 1.8 L steam) with independent PID control: you can pull a shot and steam milk at the same time, like behind a bar. Quiet rotary pump, optional mains water connection, weekly power-on timer. Made for people who make many cappuccinos a day.",
    specs: {
      Pressure: "Rotary pump, adjustable 9 bar",
      Heating: "Dual steel boiler, dual PID",
      Group: "E61 with flow meter",
      Portafilter: "58 mm",
      "Water tank": "3 L or mains connection",
      Power: "2000 W",
      Dimensions: "32 × 46 × 40 cm",
      Warranty: "3 years",
    },
  },
  "nordica-automatica": {
    summary: "Bean-to-cup machine with built-in grinder and one-touch cappuccino.",
    description:
      "It grinds, doses and extracts on its own: you just pick the drink on the display. The automatic milk circuit makes cappuccino and latte macchiato and rinses itself after each drink. Handy for families and offices; the taste is less adjustable than with a portafilter machine. Currently out of stock, back in about 3 weeks.",
    specs: {
      Grinder: "Built-in, ceramic burrs, 13 settings",
      Drinks: "8 recipes",
      Milk: "Automatic system with jug",
      "Water tank": "1.8 L",
      Power: "1450 W",
      Dimensions: "24 × 43 × 36 cm",
      Warranty: "2 years",
    },
  },
  "vapora-leva": {
    summary: "Manual lever machine: you set the pressure, no pump.",
    description:
      "No pump and no noise: the pressure comes from your hand on the lever. Electrically heated 800 ml boiler, boiler pressure gauge, steam wand. It takes practice and a good grinder, but gives you full control over pre-infusion.",
    specs: {
      Pressure: "Manual lever",
      Heating: "800 ml boiler",
      Portafilter: "51 mm",
      Power: "1000 W",
      Dimensions: "20 × 30 × 55 cm",
      Warranty: "2 years",
    },
  },
  "macinaverde-uno": {
    summary: "Steel conical grinder with 40 settings, for filter and moka.",
    description:
      "40 mm conical burrs and 40 click settings: great for moka, filter and French press. For espresso with non-pressurised baskets the steps are too coarse; it works with the Vapora Mini and its pressurised baskets.",
    specs: {
      Burrs: "40 mm steel conical",
      Settings: "40 clicks",
      "Suited to": "Moka, filter, French press, espresso with pressurised baskets",
      Hopper: "250 g",
      Power: "150 W",
      Warranty: "2 years",
    },
  },
  "macinaverde-micro": {
    summary: "Stepless micrometric adjustment for espresso, single dosing.",
    description:
      "54 mm conical burrs with stepless adjustment: you can correct an espresso by a few microns. Designed for single dosing (you weigh the grams and grind them all), it retains less than 0.2 g. Recommended with the Vapora Classica and the Brenta PID.",
    specs: {
      Burrs: "54 mm steel conical",
      Settings: "Stepless micrometric",
      "Suited to": "Espresso, filter",
      Retention: "< 0.2 g",
      Power: "200 W",
      Warranty: "2 years",
    },
  },
  "brenta-piatta-64": {
    summary: "64 mm flat burrs and a slow motor for sweeter, clearer espresso.",
    description:
      "64 mm flat burrs at 1400 rpm: less heat and a more even particle distribution, which gives cleaner cups, especially with light roasts. Micrometric screw adjustment, anti-static outlet.",
    specs: {
      Burrs: "64 mm steel flat",
      Settings: "Micrometric screw",
      "Suited to": "Espresso, filter",
      Speed: "1400 rpm",
      Power: "350 W",
      Warranty: "3 years",
    },
  },
  "macinaverde-manuale": {
    summary: "Hand grinder with conical burrs, for travel or filter coffee.",
    description:
      "Aluminium body, 38 mm steel conical burrs and 30 settings. Grinds 20 g for filter in about a minute. Works without power: perfect for camping with a moka pot or French press.",
    specs: {
      Burrs: "38 mm steel conical",
      Settings: "30 clicks",
      Capacity: "25 g",
      Weight: "480 g",
      "Suited to": "Moka, filter, French press",
      Warranty: "2 years",
    },
  },
  "miscela-banco": {
    summary: "70% Arabica and 30% Robusta, medium-dark roast: the espresso of an Italian bar.",
    description:
      "Our best-selling blend: full body, thick crema and notes of cocoa and roasted hazelnut. The Brazilian Robusta adds structure and stands up well to milk. Suited to espresso and moka. 1 kg bag with valve.",
    specs: {
      Blend: "70% Arabica (Brazil, Colombia), 30% Robusta (India)",
      Roast: "Medium-dark",
      Notes: "Cocoa, hazelnut, caramel",
      Weight: "1 kg",
      "Suited to": "Espresso, moka",
      Intensity: "4/5",
    },
  },
  "etiopia-guji": {
    name: "Ethiopia Guji",
    summary: "Washed single origin, light roast: citrus and white flowers.",
    description:
      "Heirloom Arabica grown at 2000 metres in the Guji region and washed at the station. A light roast that brings out the acidity: bergamot, jasmine, white peach. At its best in filter methods; as espresso it needs a fine grind and a high temperature.",
    specs: {
      Origin: "Ethiopia, Guji",
      Variety: "Heirloom",
      Process: "Washed",
      Roast: "Light",
      Notes: "Bergamot, jasmine, white peach",
      Weight: "250 g",
      "Suited to": "Filter, French press",
    },
  },
  "brasile-mogiana": {
    name: "Brazil Mogiana",
    summary: "Natural single origin, sweet and low in acidity: milk chocolate.",
    description:
      "100% natural-process Arabica from Mogiana. Low acidity, round body and the sweetness of milk chocolate and almond. The easiest coffee to extract as espresso for beginners.",
    specs: {
      Origin: "Brazil, Alta Mogiana",
      Process: "Natural",
      Roast: "Medium",
      Notes: "Milk chocolate, almond",
      Weight: "500 g",
      "Suited to": "Espresso, moka",
    },
  },
  "colombia-decaffeinato": {
    name: "Colombia Decaf",
    summary: "Decaffeinated with sugar-cane process, no chemical solvents.",
    description:
      "Colombian Arabica decaffeinated with the natural ethyl acetate process from sugar cane. It keeps the sweetness of caramel and red fruit. Contains less than 0.1% caffeine.",
    specs: {
      Origin: "Colombia, Huila",
      Decaffeination: "Sugar cane EA",
      Roast: "Medium",
      Notes: "Caramel, red fruit",
      Weight: "250 g",
      "Suited to": "Espresso, moka, filter",
    },
  },
  "miscela-moka": {
    summary: "Ground for moka, 100% Arabica, medium roast.",
    description:
      "Already ground to the right size for a moka pot, neither too fine nor too coarse, to avoid a burnt taste. 100% Arabica from Brazil and Honduras. 500 g pack in a protective atmosphere.",
    specs: {
      Blend: "100% Arabica",
      Roast: "Medium",
      Grind: "For moka",
      Weight: "500 g",
      "Suited to": "Moka",
    },
  },
  "kenya-nyeri": {
    summary: "Blackcurrant and grapefruit, juicy acidity. Lot sold out.",
    description:
      "AA selection of the SL28 and SL34 varieties, washed. An intense cup of blackcurrant, pink grapefruit and ripe tomato. Seasonal lot sold out: the new harvest arrives in November.",
    specs: {
      Origin: "Kenya, Nyeri",
      Variety: "SL28, SL34",
      Process: "Washed",
      Roast: "Light",
      Weight: "250 g",
      "Suited to": "Filter",
    },
  },
  "moka-ferro-3": {
    name: "Moka Ferro 3 cups",
    summary: "3-cup aluminium moka pot, also for induction with an adapter.",
    description:
      "Die-cast aluminium, inspectable safety valve and Bakelite handle. It does not work directly on induction: you need the adapter plate sold among the accessories. Wash with water only, no detergent.",
    specs: {
      Capacity: "3 cups (150 ml)",
      Material: "Aluminium",
      Induction: "Only with adapter",
      Washing: "By hand, no detergent",
      Warranty: "2 years",
    },
  },
  "moka-inox-6": {
    name: "Moka Inox 6 cups",
    summary: "6-cup stainless-steel moka pot, induction compatible.",
    description:
      "18/10 stainless steel with a magnetic base: works on gas, electric and induction without adapters. Dishwasher safe. Spare gasket and filter available.",
    specs: {
      Capacity: "6 cups (300 ml)",
      Material: "18/10 stainless steel",
      Induction: "Yes",
      Washing: "Dishwasher",
      Warranty: "2 years",
    },
  },
  "dripper-ceramica": {
    name: "Ceramic dripper",
    summary: "Glazed ceramic cone dripper for hand-poured filter coffee.",
    description:
      "60° cone with spiral ribs and a single large hole: the flow depends on how you pour. Ceramic holds the heat. Uses conical paper filters for 1-4 cups.",
    specs: {
      Material: "Glazed ceramic",
      Capacity: "1-4 cups",
      Filters: "Conical paper, size 02",
      Washing: "Dishwasher",
    },
  },
  "pressa-francese": {
    name: "French press 800 ml",
    summary: "Borosilicate glass carafe with a double steel filter.",
    description:
      "Immersion brewing for a full-bodied, oily coffee. Double fine-mesh filter for less sediment. Coarse grind and 4 minutes of brewing recommended.",
    specs: {
      Capacity: "800 ml",
      Material: "Borosilicate glass, steel",
      Grind: "Coarse",
      Washing: "Dishwasher",
    },
  },
  "kit-filtro-completo": {
    name: "Complete filter kit",
    summary: "Dripper, gooseneck kettle, scale and 100 filters.",
    description:
      "Everything you need to start with filter coffee: ceramic dripper, 0.6 L stovetop gooseneck kettle, scale with timer and 100 paper filters. You save 20 € compared with buying them separately.",
    specs: {
      Contents: "Dripper, 0.6 L kettle, scale with timer, 100 filters",
      "Suited to": "Filter beginners",
    },
  },
  "bilancia-timer": {
    name: "Scale with timer",
    summary: "0.1 g precision and built-in timer, fits under the cup.",
    description:
      "Weighs dose and drink to 0.1 g, up to 2 kg. The timer starts automatically with the first drip. USB-C rechargeable, water-resistant surface.",
    specs: {
      Precision: "0.1 g",
      Capacity: "2 kg",
      Timer: "Automatic",
      Battery: "USB-C rechargeable",
      Dimensions: "12 × 12 × 2 cm",
    },
  },
  "bollitore-collo-cigno": {
    name: "Electric gooseneck kettle",
    summary: "Temperature set to the degree and a precision spout.",
    description:
      "0.9 L kettle with temperature adjustable from 40 to 100 °C and a 60-minute keep-warm. The gooseneck spout controls the flow for filter coffee.",
    specs: {
      Capacity: "0.9 L",
      Temperature: "40-100 °C, to the degree",
      Power: "1200 W",
      "Keep warm": "60 minutes",
    },
  },
  "pressino-58": {
    name: "Calibrated tamper 58 mm",
    summary: "Tamper with a spring calibrated to 15 kg for consistent tamping.",
    description:
      "58.5 mm steel base and a spring that clicks at 15 kg: you tamp the same way every time. Fits 58 mm portafilters (Vapora Classica, Brenta PID, Brenta Duo). Does not fit the Vapora Mini (51 mm).",
    specs: {
      Diameter: "58.5 mm",
      Pressure: "Calibrated 15 kg spring",
      Material: "Stainless steel, walnut",
      Compatibility: "58 mm portafilters",
    },
  },
  "lattiera-350": {
    name: "Latte art milk jug 350 ml",
    summary: "Sharp spout for precise patterns, stainless steel.",
    description:
      "350 ml, enough for one cappuccino. The narrow, sharp spout helps you pour hearts and tulips. Graduated scale inside.",
    specs: {
      Capacity: "350 ml",
      Material: "Stainless steel",
      Spout: "Sharp",
    },
  },
  "tazzine-porcellana": {
    name: "Porcelain espresso cups (6)",
    summary: "Thick porcelain that holds the heat, 70 ml with saucer.",
    description: "Set of 6 cups with saucers, thick walls and an oval bottom like at the bar. Dishwasher safe.",
    specs: {
      Capacity: "70 ml",
      Pieces: "6 cups + 6 saucers",
      Material: "Porcelain",
      Washing: "Dishwasher",
    },
  },
  "kit-pulizia": {
    name: "Cleaning and descaling kit",
    summary: "Descaler, group-head tablets, brush and blind basket.",
    description:
      "Lactic-acid descaler (4 treatments), 20 group-head cleaning tablets, a brush for the gaskets and a 58 mm blind basket. The blind basket is only for machines with a three-way valve (Brenta PID, Brenta Duo).",
    specs: {
      Contents: "Descaler 4 doses, 20 tablets, brush, 58 mm blind basket",
      "Suited to": "All espresso machines",
    },
  },
  "adattatore-induzione": {
    name: "Induction adapter",
    summary: "13 cm plate to use aluminium moka pots on induction.",
    description:
      "13 cm ferromagnetic steel disc with an insulated handle. Lets you use aluminium moka pots and coffee makers on induction hobs.",
    specs: {
      Diameter: "13 cm",
      Material: "Ferromagnetic steel",
      "Works with": "Moka pots up to 6 cups",
    },
  },
};

// The same product in the page language: Italian rows from the database, English words on top.
export function localizeProduct<T extends { slug: string; name: string; summary: string }>(lang: "it" | "en", p: T): T {
  if (lang === "it") return p;
  const en = productsEn[p.slug];
  if (!en) return p;
  const out = { ...p, name: en.name ?? p.name, summary: en.summary } as T & { description?: string; specs?: unknown };
  if ("description" in p) out.description = en.description;
  if ("specs" in p) out.specs = en.specs;
  return out;
}

export function localizeCategory<T extends { slug: string; name: string; description: string }>(lang: "it" | "en", c: T): T {
  const en = lang === "en" ? categoriesEn[c.slug] : undefined;
  return en ? { ...c, ...en } : c;
}
