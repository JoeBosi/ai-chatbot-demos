// English text for services, keyed by slug. The Italian file stays the source of truth for everything else.
export const prestazioniEn: Record<string, { nome: string; descrizione: string; preparazione: string }> = {
  "visita-cardiologica": {
    nome: "Cardiology consultation",
    descrizione:
      "A talk with the cardiologist, a blood pressure check and listening to the heart. In most cases it includes a resting electrocardiogram done at the same appointment. The printed report is given to you at the end of the consultation.",
    preparazione:
      "Bring your most recent blood tests, any previous cardiology reports and the list of medicines you are taking.",
  },
  elettrocardiogramma: {
    nome: "Resting electrocardiogram",
    descrizione:
      "A recording of the heart's electrical activity, using a few sticky electrodes placed on the chest, arms and legs. You lie down for the test. It takes a few minutes and causes no discomfort. The cardiologist reports on the trace the same day.",
    preparazione: "",
  },
  "elettrocardiogramma-sotto-sforzo": {
    nome: "Exercise electrocardiogram",
    descrizione:
      "A recording of the heart trace while you pedal on an exercise bike, with the resistance increased gradually. The cardiologist stays with you throughout and monitors blood pressure and heart rate. At the end there is a recovery period of a few minutes before you get dressed.",
    preparazione:
      "Bring sportswear and trainers. Avoid a large meal in the two hours before.",
  },
  "holter-pressorio-24h": {
    nome: "24-hour blood pressure Holter",
    descrizione:
      "A small device with a cuff is fitted. It measures blood pressure at regular intervals over a whole day. The appointment is for fitting the device and explaining what to do. The next day you come back to return it. The report is prepared after the data is downloaded.",
    preparazione:
      "Wear a T-shirt with loose sleeves. Bring a sheet of paper or a notepad to write down your sleep and activity times, as explained when the device is fitted.",
  },
  "certificato-idoneita-sportiva-non-agonistica": {
    nome: "Certificate of fitness for non-competitive sport",
    descrizione:
      "A visit with blood pressure, height and weight checks and a resting electrocardiogram. At the end you receive the certificate for non-competitive sport. It is the service usually asked for by gyms, swimming pools and amateur clubs. The certificate is given to you straight away, signed and stamped.",
    preparazione:
      "Bring an identity document, your health card and, for minors, the sports club form signed by a parent.",
  },
  "visita-dermatologica": {
    nome: "Dermatology consultation",
    descrizione:
      "A talk and an examination of the skin, hair and nails, using the dermatoscope where needed. It can cover one specific area or the whole skin, as agreed when booking. The report is given to you at the end of the consultation.",
    preparazione:
      "Come without creams, foundation or nail polish on the areas to be examined, and without make-up on your face.",
  },
  "mappatura-dei-nei": {
    nome: "Mole mapping with digital dermatoscopy",
    descrizione:
      "A systematic examination of the moles all over the body, with a dermatoscope connected to a camera. The images are stored so they can be compared at check-ups in later years. You will need to undress step by step. There is a screen in the room.",
    preparazione:
      "No creams, self-tanners or nail polish. If you have had mole mapping elsewhere, bring the images or the previous report.",
  },
  "crioterapia-lesioni-cutanee": {
    nome: "Cryotherapy of skin lesions",
    descrizione:
      "An outpatient treatment in which the dermatologist applies liquid nitrogen to surface skin lesions already assessed at a previous consultation. The session takes a few minutes and is held in the same consulting room as the consultation. At the end you receive instructions for the dressing, spoken and in writing.",
    preparazione:
      "Bring the report of the dermatology consultation in which cryotherapy was indicated. Do not apply creams to the area in the hours before.",
  },
  "visita-ginecologica": {
    nome: "Gynaecology consultation",
    descrizione:
      "A talk and a gynaecological examination. An ultrasound scan can be done in the same room when the appointment includes it. The consulting room has a separate changing room. The report is given to you at the end.",
    preparazione:
      "Bring previous tests and ultrasound scans. If you take hormone therapy, bring the name of the product.",
  },
  "pap-test": {
    nome: "Pap test",
    descrizione:
      "Cells are taken from the cervix with a small spatula. It takes a few minutes, during a consultation or as a separate appointment. The sample is sent to the external partner laboratory. The result is uploaded to the reports area when the laboratory sends it.",
    preparazione:
      "Do not have it during your period. In that case, simply move the appointment by phoning reception. In the 48 hours before, do not use vaginal pessaries, creams or douches.",
  },
  "ecografia-pelvica": {
    nome: "Pelvic ultrasound",
    descrizione:
      "An ultrasound test of the pelvic organs, done by the gynaecologist in the ultrasound room on floor 0. The probe is placed on the abdomen with a gel, or used transvaginally, as stated when booking. The images are saved and attached to the report.",
    preparazione:
      "For the abdominal test, come with a full bladder: drink about half a litre of water around one hour before and do not go to the toilet.",
  },
  "visita-ortopedica": {
    nome: "Orthopaedic consultation",
    descrizione:
      "A talk and an assessment of how the joints concerned move, with a review of any X-ray images you already have. The consultation is on floor 2. You will need to uncover the area to be examined, so comfortable clothes are best. The report, with any proposed physiotherapy plan, is given to you at the end.",
    preparazione:
      "Bring any X-rays, MRI or CT scans you have already had, even on CD, and the matching reports.",
  },
  "infiltrazione-articolare": {
    nome: "Joint injection",
    descrizione:
      "An outpatient treatment in which the orthopaedic specialist injects a product into the joint, after agreeing it at a previous consultation. The procedure takes a few minutes. After the injection you stay in the waiting room for about a quarter of an hour. Instructions for the following hours are given to you in writing.",
    preparazione:
      "Bring the report of the orthopaedic consultation in which the injection was indicated, and the product if you bought it at a pharmacy. Plan not to drive straight afterwards.",
  },
  "medicazione-semplice": {
    nome: "Simple dressing",
    descrizione:
      "Cleaning and renewing the dressing of a wound or stitches, as a scheduled outpatient service. It takes a few minutes and is done on floor 2. Repeat dressings can be booked together at reception.",
    preparazione:
      "If the dressing follows a hospital stay, bring the discharge letter or the surgery report.",
  },
  "visita-oculistica": {
    nome: "Full eye consultation",
    descrizione:
      "An eye test, an eye pressure check and an examination of the back of the eye. For the back-of-the-eye examination, drops are put in that widen the pupil and blur your vision for two or three hours. A prescription for glasses or lenses, if needed, is given to you at the end of the consultation.",
    preparazione:
      "Bring the glasses you use or the box of your contact lenses. If drops are planned, do not plan to drive after the consultation.",
  },
  "esame-del-campo-visivo": {
    nome: "Visual field test",
    descrizione:
      "You look into a lit dome and press a button each time you see a dot of light. One eye is tested at a time, and it needs steady attention for a few minutes. The report includes the charts printed by the machine.",
    preparazione:
      "Bring the glasses you use. If possible come well rested, because the test needs concentration.",
  },
  "visita-otorinolaringoiatrica": {
    nome: "ENT consultation",
    descrizione:
      "A talk and an examination of the ears, nose and throat with lighted instruments and small mirrors. The consultation is on floor 2, in the consulting room next to the soundproof booth. The report is given to you at the end.",
    preparazione:
      "Bring any previous hearing tests and, if you have them, reports of other specialist consultations on the same area.",
  },
  "esame-audiometrico": {
    nome: "Hearing test",
    descrizione:
      "A hearing test in a soundproof booth. You wear headphones and signal each time you hear a sound, at different volumes and frequencies. One ear is tested at a time. The result is a chart that is attached to the report.",
    preparazione: "",
  },
  "lavaggio-auricolare": {
    nome: "Ear irrigation",
    descrizione:
      "An outpatient service in which the ear is flushed with lukewarm water to remove earwax. It takes a few minutes per ear and ends with a visual check. It is usually booked after an ENT consultation.",
    preparazione:
      "If a softening product was recommended, use it in the days before, following the instructions you received at the consultation.",
  },
  "tampone-faringeo": {
    nome: "Throat swab",
    descrizione:
      "A sample is taken from the throat with a cotton bud, in a few seconds. The sample is sent to the partner laboratory for culture. The result arrives in the reports area when the laboratory sends it.",
    preparazione:
      "Do not brush your teeth or use mouthwash in the two hours before, and come without having eaten for at least one hour.",
  },
  "visita-endocrinologica": {
    nome: "Endocrinology consultation",
    descrizione:
      "A long talk, with a review of the blood tests and ultrasound scans you have already had, and weight, height and blood pressure checks. This consultation relies heavily on documents, so a complete file brought by the patient makes a difference. The report is given to you at the end.",
    preparazione:
      "Bring all blood tests from the last two years, thyroid ultrasound scans if you have them, and a written list of the medicines and supplements you take.",
  },
  "visita-diabetologica": {
    nome: "Diabetes consultation",
    descrizione:
      "A consultation for diabetes care, with a review of the values recorded by the patient and of the lab tests. It includes blood pressure, weight and waist measurements. The report is given to you at the end of the consultation, together with a reminder of the agreed check-ups.",
    preparazione:
      "Bring your blood glucose diary or the sensor download, your latest blood tests and the list of medicines with their doses.",
  },
  "prelievo-del-sangue": {
    nome: "Blood draw",
    descrizione:
      "Blood is taken from a vein in the blood-draw room on floor 0, by appointment between 07:30 and 09:30, Monday to Saturday. The sample is sent to the partner laboratory and the results are uploaded to the reports area. The price shown is for the blood draw only: each lab test is added according to the price list given at reception.",
    preparazione:
      "Do not eat for at least 8 hours before; water is allowed. Bring the request with the list of lab tests to be done.",
  },
  "visita-gastroenterologica": {
    nome: "Gastroenterology consultation",
    descrizione:
      "A talk, an examination of the abdomen and a review of the tests you have already had, including any endoscopies. It takes place in Office 2.5 on floor 2. If you cannot use the small inside staircase, tell reception and you will be seen on floor 1. The report is given to you at the end.",
    preparazione:
      "Bring recent tests, reports of any ultrasound scans or endoscopies you have had, and the list of medicines you are taking.",
  },
  "breath-test-helicobacter": {
    nome: "Breath test for Helicobacter pylori",
    descrizione:
      "A non-invasive test in which you blow into some tubes, before and after drinking a solution, about thirty minutes apart. You need to stay at the clinic for the whole time, in the waiting room on floor 2. The tubes are sent to the partner laboratory.",
    preparazione:
      "Do not eat for at least 8 hours before, and that includes coffee, smoking and chewing gum. If you have taken antibiotics or stomach medicines in the previous weeks, say so when booking so the right date can be set.",
  },
  "valutazione-fisioterapica": {
    nome: "Initial physiotherapy assessment",
    descrizione:
      "The first appointment of the programme. The physiotherapist takes the history of the problem, measures movement and strength, and agrees with the patient the number and frequency of sessions. It takes place in the gym on floor 1. At the end you receive a written sheet with the agreed plan.",
    preparazione:
      "Bring comfortable clothes and trainers, plus any orthopaedic reports, X-rays or discharge letters you have.",
  },
  "seduta-di-fisioterapia": {
    nome: "Physiotherapy session",
    descrizione:
      "A one-to-one session of manual therapy and exercise, in the gym on floor 1, following the plan agreed at the initial assessment. The changing rooms with lockers are in front of the gym. Packages of five or ten sessions can be bought at reception.",
    preparazione:
      "Sportswear, trainers and your own towel. Arrive five minutes early to get changed.",
  },
  tecarterapia: {
    nome: "Tecar therapy",
    descrizione:
      "A handpiece that sends energy into the treated area is applied, and you feel moderate warmth. It takes place in the equipped area of the gym on floor 1 and lasts about half an hour. It is usually booked as part of a programme already set up.",
    preparazione:
      "Take off watches, chains and other metal objects before the session. Tell the physiotherapist if you have implanted devices or metal prostheses.",
  },
  ecocardiogramma: {
    nome: "Echocardiogram",
    descrizione:
      "An ultrasound scan of the heart, done by the cardiologist in the ultrasound room on floor 0. You lie on your side with your chest uncovered, and the probe is placed on your chest with a conductive gel. The images and measurements are saved and attached to the report.",
    preparazione:
      "Bring previous cardiology reports and electrocardiograms. Wear a T-shirt that is easy to take off.",
  },
  "ecografia-addome-completo": {
    nome: "Full abdominal ultrasound",
    descrizione:
      "An ultrasound test of the abdominal organs, done by the radiologist on floor 0. You lie down, and the probe is placed on the skin with a gel that is sometimes cold. It takes about half an hour and the report is written in the following days.",
    preparazione:
      "Do not eat for at least 6 hours before; water is allowed. Avoid fizzy drinks in the 24 hours before. Bring any abdominal ultrasound scans you have already had.",
  },
  "ecografia-tiroide": {
    nome: "Thyroid ultrasound",
    descrizione:
      "An ultrasound test of the neck. The probe is placed on the throat while you lie down with your head tilted slightly back. It takes about twenty minutes and you do not need to fast. The report includes the measurements recorded by the machine.",
    preparazione:
      "Do not wear necklaces or polo-neck jumpers. Bring your thyroid hormone tests and any thyroid ultrasound scans you have already had.",
  },
  "radiografia-torace": {
    nome: "Chest X-ray",
    descrizione:
      "An X-ray taken standing in front of the machine, in the shielded room on floor 0. It takes a few minutes: you need to hold your breath for a few seconds. The radiologist reports on the images, which are given to you as a print or a download link.",
    preparazione:
      "Undress from the waist up in the changing room next door and take off necklaces and piercings. Tell the staff if you are pregnant or think you might be.",
  },
};
