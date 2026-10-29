// English text for the information pages. The Italian file stays the source of truth for everything else.
import type { DocInfo } from "../types";

export const documentiEn: DocInfo[] = [
  {
    slug: "prenotare-e-disdire",
    titolo: "How to book and how to cancel",
    corpo: `## This site is a demo
Poliambulatorio Vallenova does not exist: it is a fictional clinic made up to show how a
booking assistant works. No appointment made here reaches a real clinic, no doctor is
notified and no payment is requested. Do not enter real personal data: no real first name and
surname, no tax code, no phone number and no email address that you actually use. In the
examples we use the email demo@vallenova.example and the booking code PR-20481. Everything you
type is only there to show the process on screen.

## How to book
You can book in three ways: on this site, choosing the service, doctor and time from those
available; by phone on 0521 000 000, Monday to Friday from 08:00 to 19:00 and on Saturday from
08:00 to 13:00; or in person at reception, on floor 0. To book you need your first name,
surname, date of birth, a phone number and an email address. At the end you receive an email
with the booking code, the day, the time, the doctor's name and the room.

## On the day of the appointment
It is best to arrive 10 minutes early to check in at reception, on floor 0. Anyone who arrives
more than 15 minutes late may not be seen, because the doctor's diary runs in fixed slots: in
that case the appointment is moved to the first available date. The waiting rooms are on
floors 0, 1 and 2, near the consulting rooms.

## How to cancel or reschedule
Cancellation is free up to 24 hours before the appointment and can be done from the link in
the confirmation email, by phone on 0521 000 000 or at reception. The same procedure applies
to rescheduling: the first free time with the same doctor is found. If the cancellation comes
after that deadline or the patient does not turn up, a fee of 20 euros is charged, rising to
35 euros for diagnostic tests.

## Reminders and waiting lists
An email reminder is sent 48 hours before and a text message 24 hours before the appointment.
If the date offered is too far away, you can ask to be put on the call-back list: if someone
else cancels, reception phones to offer the freed slot, usually with one or two days' notice.`,
  },
  {
    slug: "referti",
    titolo: "Reports: timing, collection and delivery",
    corpo: `## How many days until it is ready
Specialist consultations come with an immediate report: it is handed over printed and signed
at the end of the consultation. Diagnostic tests take 2 to 4 working days: 2 days for the
exercise electrocardiogram, echocardiogram, chest X-ray and visual field test, 3 days for
ultrasound scans, mole mapping, blood tests and throat swabs, 4 days for the blood pressure
Holter. The Pap test takes up to 7 working days and the breath test 5, because they go through
the external laboratory. Days are counted from the first working day after the test.

## Collection at the floor 0 desk
The reports desk is on floor 0: from the main entrance keep left to the end of the corridor,
green sign. It is open Monday to Friday from 08:30 to 13:00 and from 14:30 to 18:00, and on
Saturday from 08:30 to 12:30. To collect you need an identity document and the booking code,
for example PR-20481. Reports remain available at the desk for 90 days, after which they are
archived and must be requested by phone on 0521 000 001.

## Collection by someone else
A relative or acquaintance can collect the report on the patient's behalf if they bring three
things: the written authorisation signed by the patient, a photocopy of the patient's identity
document and their own identity document. The authorisation form can be downloaded from the
site or requested at reception. For minors no authorisation is needed if a parent collects,
but the parent must show their own document.

## Delivery by email or by post
Anyone who asks for it when booking receives the report as a PDF at the email address given,
with a password-protected link that expires after 30 days. Delivery by email is free. Posting
a paper copy to a home address costs 6 euros and usually arrives within 5 working days.
Radiology images are supplied on CD or with a download link, at no extra cost.

## Copies and lost reports
A copy of a report already handed over can be requested at the floor 0 desk or by writing to
referti@vallenova.example, giving your name, date of birth and the date of the test. A paper
copy costs 3 euros and a PDF copy is free, and it is prepared within 2 working days. As this
is a demo, the reports on this site are fictitious documents generated as examples.`,
  },
  {
    slug: "preparazione-esami",
    titolo: "Preparing for tests: general rules",
    corpo: `## Fasting
When the service requires fasting, the count starts from the last meal or drink other than
water. Blood tests and the breath test require 8 hours of fasting, the abdominal ultrasound
6 hours. Water is always allowed, in moderate amounts. Coffee, tea, chewing gum, sweets and
smoking break the fast and should be avoided during the same period.

## Full bladder, clean skin, bare neck
Some tests have a preparation other than fasting. The pelvic ultrasound over the abdomen needs
a full bladder: about half a litre of water roughly an hour before, without going to the
toilet. For the dermatology consultation and mole mapping the skin should be free of creams,
self-tanners, foundation and nail varnish. For the thyroid ultrasound it is best to avoid
necklaces and polo-neck jumpers, because the probe works on the neck.

## Documents and previous tests to bring
For almost all services it is worth bringing any tests already done for the same problem:
reports, X-rays, MRI scans (also on CD), blood tests from the last two years. You also need a
written list of the medicines and supplements you take, with the doses. For endocrinology and
diabetes consultations this documentation is the most important part of the appointment.

## Clothing and time on site
For physiotherapy, Tecar therapy and the exercise electrocardiogram you need sportswear and
trainers; for physiotherapy also your own towel. Some services require you to stay on site
longer than expected: the breath test about an hour, the joint injection a quarter of an hour
of observation after the procedure, the eye consultation with drops two or three hours of
blurred vision, during which you cannot drive.

## If the preparation was not followed
If the fasting or preparation was not followed, the test normally cannot be carried out and
is rescheduled. It is best to phone 0521 000 000 before coming: rescheduling in advance does
not incur a fee. The specific preparation for each service is given on its page on the site
and in the confirmation email.`,
  },
  {
    slug: "pagamenti-e-ticket",
    titolo: "Payments, ticket charges and the public health service",
    corpo: `## Private and public health service
Services can be provided privately, paying the list price shown on each service's page, or
under agreement with the public health service, paying the ticket charge. Privately you do not
need a GP referral; under the public health service you do, and the original must be brought
on the day of the appointment. Private prices in this demo range from 40 euros for a wound
dressing or a blood test to 160 euros for mole mapping.

## Ticket charges and exemptions
The ticket charge for a specialist consultation under the public health service is 23 euros,
and for a diagnostic test 36 euros. Anyone with an exemption must bring the exemption code and
the document that proves it: in that case no ticket charge is requested. Without a valid GP
referral the service is provided privately at the list price.

## How to pay
Payment is made at reception, on floor 0, before the service. We accept cash up to 500 euros,
debit cards, Visa and Mastercard credit cards, and digital payment by smartphone. We do not
accept cheques. The receipt or invoice is printed straight away and, on request, also sent by
email.

## Invoice, tax deductions and packages
The invoice shows the patient's tax code, which is needed for the tax deduction: so it must be
given at the time of payment. For physiotherapy sessions there are packages of five sessions
for 250 euros and of ten for 480 euros, which can be bought at reception and are valid for 12
months. Packages are personal and cannot be transferred.

## Nothing is paid in this demo
As this is a demo site, no money is collected here and no payment details are requested: no
card number, no IBAN. The prices are only there to make the example realistic. If a screen
asks for payment details, do not enter them.`,
  },
  {
    slug: "documenti-da-portare",
    titolo: "Documents to bring",
    corpo: `## Always, for any service
You need a valid identity document, your health card and the booking code received by email,
for example PR-20481. The document is checked at reception when you check in. Without an
identity document reports cannot be collected.

## If the service is under the public health service
As well as the basic documents you need the original GP referral, with the requested service
and the date. Anyone with an exemption must also bring the exemption certificate with its
code. The GP referral is kept by the clinic.

## Previous tests and reports
It is worth bringing everything about the same problem: reports from previous consultations,
X-rays and MRI scans (also on CD), blood tests from the last two years, hospital discharge
letters. For endocrinology and diabetes consultations this material is essential, because the
consultation is largely based on reading it. Also bring a written list of the medicines and
supplements you take, with the doses.

## Minors and authorised persons
Patients under 18 must be accompanied by a parent or guardian with their own identity
document; for sports certificates the form from the sports club, signed, is also needed.
Anyone collecting a report for an adult must have the written and signed authorisation, the
photocopy of the patient's document and their own document.

## Documents in the demo version
On this demo site no document is requested, uploaded or stored: the list above describes how
a real clinic would work. Do not upload photos of real documents and do not type real tax
codes or health card numbers into the booking screens.`,
  },
  {
    slug: "orari-e-contatti",
    titolo: "Opening hours and contacts",
    corpo: `## Opening hours
The outpatient clinic is open Monday to Friday from 08:00 to 19:00 and on Saturday from 08:00
to 13:00. It is closed on Sunday. On Saturday morning only a reduced group of consulting rooms
is open: cardiology with Dott.ssa Ferraro, dermatology with Dott.ssa Moretti, radiology with
Dott. Tarasconi and physiotherapy with Dott.ssa Costa.

## Consulting room and blood-draw sessions
The consulting rooms work in two sessions: 09:00-13:00 in the morning and 14:30-18:30 in the
afternoon. The blood-draw room on floor 0 sees patients by appointment from 07:30 to 09:30,
Monday to Saturday. Ultrasound scans and X-rays are carried out on floor 0 during the
respective shifts, which are shown when booking.

## Phone and email
The main number is 0521 000 000, available during opening hours: it is for booking,
cancelling, rescheduling an appointment and general information. For reports there is a
dedicated line, 0521 000 001, available Monday to Friday from 09:00 to 17:00. The email
addresses are info@vallenova.example for information and referti@vallenova.example for copies
of reports; we reply within 2 working days.

## Planned closures
The clinic is closed from 24 December 2026 to 3 January 2027 for the holidays, reopening on
Monday 4 January 2027. Closures and individual doctors' absences are already shown in the
booking calendar: unavailable times do not appear among those you can select. In case of a
sudden closure, reception phones the patients already booked.

## Numbers and addresses in this demo
The phone, email and address on this page are made up: 0521 000 000 is not a working number,
the @vallenova.example addresses do not receive mail and Via delle Camelie 12 does not exist.
For real emergencies there are the public health service numbers, which this demo site does
not replace in any way.`,
  },
  {
    slug: "come-arrivare",
    titolo: "How to get here and where to park",
    corpo: `## The address and the building
Poliambulatorio Vallenova is at Via delle Camelie 12, 43121 Parma, in the Vallenova district.
The building has three floors: floor 0 has reception, the reports desk, the blood-draw room,
ultrasound and radiology; floor 1 has three consulting rooms and the physiotherapy gym; floor 2
has four consulting rooms and Studio 2.5. The patient entrance is the one with the automatic
door and the canopy.

## By car
From the ring road take the Parma Centro exit and follow signs for the Vallenova district;
Via delle Camelie is reached from the Via dei Pioppi roundabout. The drive from the exit to
the entrance takes about 6 minutes without traffic. At rush hour, between 08:00 and 09:00,
allow an extra 10 minutes.

## Parking
The on-site car park is free for patients and has 40 spaces, 4 of which are reserved for
disabled people right in front of the main entrance. You enter through the gate to the right
of number 12 and the exit is automatic. When it is full, the public pay-and-display car park
(blue lines) on Via dei Pioppi is 200 metres away and costs 1.20 euros per hour.

## Bus, train and bicycle
Lines 7 and 14 stop at the Camelie stop, 80 metres from the entrance, with a bus about every
15 minutes. From Parma railway station it takes about 15 minutes on line 7. For those coming
by bicycle there is a covered rack for 20 bicycles to the left of the main entrance.

## Finding your way inside the building
From the entrance, reception is the counter immediately on the right; the reports desk is at
the end of the left-hand corridor, with the green sign. Two lifts serve all floors: lift A
goes to the North and Centre corridors, lift B to the South wing and the floor 1 gym. On the
floor 0 floor a light-blue line leads to the ultrasound and radiology rooms, in the South
wing.`,
  },
  {
    slug: "accessibilita-e-assistenza",
    titolo: "Accessibility and assistance",
    corpo: `## Entrance, lifts and toilets
The main entrance is at street level, with no steps, and an automatic door wide enough for a
wheelchair. Two lifts, A and B, serve floors 0, 1 and 2 and have a roomy car and a button
panel with raised numbers. The accessible toilets are on floor 0, next to the large waiting
room, and on floor 1, opposite lift A. In the on-site car park there are 4 reserved spaces in
front of the entrance.

## The only room that is not accessible
All rooms can be reached by wheelchair except one: Studio 2.5, at the end of the South
corridor on floor 2, can only be reached by climbing an internal flight of six steps, with no
lift. It is the room normally used for gastroenterology. Anyone who cannot use the steps should
say so when booking or at reception: the consultation is moved to a consulting room on floor 1,
with no change of doctor or cost.

## Assistance on site
A courtesy wheelchair is available at reception, and it can be reserved in advance by phoning
0521 000 000. Staff will accompany anyone who asks to the consulting room. For those who find
it hard to stand, every waiting room has seats with armrests and, in the rooms on floors 1 and
2, two reserved seats near the entrance.

## Companions, guide dogs and languages
A companion can stay in the waiting room and, if the patient asks, also come into the
consulting room; for patients under 18 a parent or guardian must be present. Guide dogs are
allowed in all areas, including the ultrasound and radiology rooms. Among the team's
professionals, as well as Italian, English, French, Spanish and German are spoken: each
person's languages are shown on their page.

## How to tell us about a need
Any particular need should be mentioned when booking, so that a suitable room and time can be
reserved: an appointment at a less busy time, a room on floor 1, longer time, an interpreter
arranged by the patient. You can write to info@vallenova.example or phone 0521 000 000. In the
demo version these requests are not recorded anywhere.`,
  },
  {
    slug: "privacy-demo",
    titolo: "Privacy and data processing (demo version)",
    corpo: `## Do not enter real personal data
This site is a demo and the data typed into its screens has none of the protection of a
healthcare provider. Do not enter your real first name and surname, tax code, health card
number, exact date of birth, home address, or a phone number or email you actually use. For
the examples you can use a made-up name, the email demo@vallenova.example and the code
PR-20481. Do not upload photos of real documents or reports.

## What is kept and for how long
The example bookings created in this demo are kept in a test database and are deleted
automatically after 7 days; conversations with the assistant after 30 days. There is no health
record, no real report and no link to external laboratories or bodies. The texts of
conversations with the assistant are kept in technical form for as long as needed to make the
demo work and are not used to profile anyone.

## No real health data
The clinic, doctors, services, prices and hours on this site are made up: no information on
these pages comes from a medical record or a real patient. The assistant has no access to the
health data of real people and cannot consult external archives. Its answers are based only on
the demo content of these pages.

## No medical advice
The assistant on this site gives organisational information: hours, locations, costs,
preparation for tests, how to collect reports. It does not make diagnoses, interpret symptoms,
suggest which test to have or comment on treatments. For any health matter, refer to your own
doctor and, in emergencies, to the public health service numbers.

## Who runs this demo
The site is a teaching example by Giuseppe Bosi: there is no healthcare provider behind it,
and no real health data is processed. The email info@vallenova.example is the fictitious
contact of the made-up clinic. Who built the site, with which tools and under which licences,
is on the Credits page; what is kept and for how long, on the site's Privacy page (both at the
bottom of every page).`,
  },
  {
    slug: "domande-frequenti",
    titolo: "Frequently asked questions",
    corpo: `## Do I need a GP referral?
Privately you do not: you pay the list price shown on the service's page and book directly.
Under the public health service you need the original GP referral, to bring on the day of the
appointment, and you pay the ticket charge: 23 euros for a specialist consultation, 36 euros
for a diagnostic test. Each service's page shows whether a GP referral is required.

## How long does the appointment last and how long is the wait?
Consultations last between 25 and 45 minutes, tests between 15 and 60. It is best to arrive 10
minutes early to check in at reception. Some services require you to stay on site longer: the
breath test about an hour, the joint injection a quarter of an hour of observation after the
procedure.

## Can I choose my doctor and change them?
Yes: when booking you see the professionals who provide that service and their available
times. Changing doctor counts as a new booking, to be made at least 24 hours in advance to
avoid the fee. If a doctor is away on holiday, the system does not show their times for that
period.

## Can I bring a companion or come with a child?
A companion can stay in the waiting room and, if the patient asks, come into the consulting
room. For patients under 18 a parent or guardian with an identity document must be present.
There is no childcare service, but the waiting rooms on floors 0 and 1 have a corner with a
small table and small chairs.

## Can I really book here?
No. This site is a demo: no booking reaches a real clinic, no doctor receives your appointment
and no payment is collected. The address, phone, email and doctors are made up, and real
personal data should not be entered. It is there to show how a booking assistant would work,
not to book a consultation.`,
  },
];
