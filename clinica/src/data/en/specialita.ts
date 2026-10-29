// English text for the specialties. The Italian file stays the source of truth for everything else.

export const specialitaEn: Record<string, { nome: string; sommario: string; descrizione: string }> = {
  cardiologia: {
    nome: "Cardiology",
    sommario: "Deals with the heart, blood pressure and blood circulation.",
    descrizione:
      "Cardiology is the branch that deals with the heart and blood vessels, and so also with " +
      "blood pressure, heartbeat and circulation. At the outpatient clinic we offer cardiology " +
      "consultations, resting and exercise electrocardiograms and echocardiograms. A typical " +
      "consultation lasts about 30 minutes: the cardiologist takes the medical history, measures " +
      "blood pressure, listens to the heart and usually performs an electrocardiogram in the same " +
      "appointment. At the end they hand over a written report, which the patient takes to their " +
      "own GP.",
  },
  dermatologia: {
    nome: "Dermatology",
    sommario: "Deals with skin, hair, nails and moles.",
    descrizione:
      "Dermatology covers the skin and its appendages: hair, nails, moles and skin marks. The " +
      "most requested services are the dermatology consultation, mole mapping with the " +
      "dermatoscope and small outpatient treatments such as cryotherapy. The consultation lasts " +
      "about 20-30 minutes and involves examining the skin, sometimes over the whole body, with a " +
      "magnifying instrument. The report is issued at the end of the consultation and, for mole " +
      "mapping, includes the images archived for comparison in the following years.",
  },
  ginecologia: {
    nome: "Gynaecology",
    sommario: "Deals with women's health and pregnancy.",
    descrizione:
      "Gynaecology deals with the female reproductive system, routine check-ups and the course " +
      "of pregnancy. At the outpatient clinic we carry out gynaecology consultations, Pap tests, " +
      "pelvic ultrasound scans and pregnancy ultrasound scans. The consultation lasts 25-30 " +
      "minutes and includes a talk, the gynaecological examination and, if the appointment " +
      "includes it, the ultrasound in the same room. The Pap test is a quick sampling of cells, " +
      "and the result comes from the laboratory within a few days.",
  },
  ortopedia: {
    nome: "Orthopaedics",
    sommario: "Deals with bones, joints, muscles and tendons.",
    descrizione:
      "Orthopaedics covers the musculoskeletal system: bones, joints, ligaments and tendons. The " +
      "services include the orthopaedic consultation, outpatient joint injections and wound " +
      "dressings. During the consultation, which lasts about 30 minutes, the specialist assesses " +
      "joint movement and looks at any X-rays or MRI scans already done: so it is worth bringing " +
      "them along. The pathway often continues with physiotherapy, which can be booked at the " +
      "same outpatient clinic.",
  },
  oculistica: {
    nome: "Ophthalmology",
    sommario: "Deals with eyesight and eye health.",
    descrizione:
      "Ophthalmology deals with the eyes and eyesight, from measuring sight defects to routine " +
      "checks of eye pressure. On site we carry out the full eye consultation and the visual " +
      "field test. The consultation lasts about 30 minutes; if a fundus examination is planned, " +
      "drops are put in that dilate the pupil and blur vision for a few hours, so it is best not " +
      "to plan to drive straight afterwards. The prescription for glasses or lenses, when needed, " +
      "is handed over at the end of the consultation.",
  },
  otorinolaringoiatria: {
    nome: "Ear, nose and throat (ENT)",
    sommario: "Deals with the ear, nose and throat.",
    descrizione:
      "Otorhinolaryngology, shortened to ENT, deals with the ears, nose, sinuses, throat and " +
      "voice. The services available are the specialist consultation, the hearing test, ear " +
      "irrigation and the throat swab. The consultation lasts about 25 minutes: the specialist " +
      "examines the ears, nose and throat with lighted instruments and, if the appointment " +
      "includes it, completes it with a hearing test in a soundproof booth. The report is handed " +
      "over at the end.",
  },
  endocrinologia: {
    nome: "Endocrinology",
    sommario: "Deals with hormones, the thyroid, metabolism and diabetes.",
    descrizione:
      "Endocrinology covers the glands that produce hormones, such as the thyroid and the " +
      "adrenal glands, and metabolism in general; it also includes diabetes. On site we carry " +
      "out endocrinology and diabetes consultations, as well as blood draws for laboratory " +
      "tests. The consultation lasts 30-40 minutes and is very document-based: the specialist " +
      "reads previous tests, the list of current medicines and any ultrasound scans. That is why " +
      "we ask you to bring all available documentation.",
  },
  gastroenterologia: {
    nome: "Gastroenterology",
    sommario: "Deals with the stomach, intestine, liver and digestion.",
    descrizione:
      "Gastroenterology deals with the digestive system: oesophagus, stomach, intestine, liver " +
      "and bile ducts. At the outpatient clinic we offer the gastroenterology consultation and " +
      "the breath test for Helicobacter pylori; abdominal ultrasound scans are booked through " +
      "the diagnostic imaging department. The consultation lasts about 30 minutes, with a talk, " +
      "an examination of the abdomen and a review of tests already done. The breath test " +
      "involves blowing into a few tubes at intervals and requires about an hour on site.",
  },
  fisioterapia: {
    nome: "Physiotherapy",
    sommario: "Rehabilitation programmes and physical therapies in an equipped gym.",
    descrizione:
      "Physiotherapy deals with recovering movement after an injury, an operation or a period of " +
      "persistent pain. On site we carry out the initial physiotherapy assessment, sessions of " +
      "manual therapy and exercise, and Tecar therapy. The programme always starts with a " +
      "45-minute assessment, in which the physiotherapist measures movement and agrees the " +
      "number of sessions with the patient; the following sessions last 45 minutes and take " +
      "place in the floor 1 gym. It is worth bringing comfortable clothes and trainers.",
  },
  "diagnostica-per-immagini": {
    nome: "Diagnostic imaging",
    sommario: "Radiology and ultrasound scans, on floor 0 where the equipment is.",
    descrizione:
      "Diagnostic imaging brings together the tests that produce images of the body: X-rays and " +
      "ultrasound scans. All the equipment is on floor 0, because it is heavy and needs shielded " +
      "rooms. An X-ray takes a few minutes, an ultrasound scan between 15 and 30 minutes " +
      "depending on the area: the doctor places the probe on the skin with a gel and records the " +
      "images. The report is not immediate, because it is written by the reporting doctor and " +
      "made available in the following days.",
  },
};
