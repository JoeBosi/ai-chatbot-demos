import "server-only";

import { tool, type InferUITools, type UIMessage } from "ai";
import { z } from "zod";

import { bookAppointment, BookingError, cancelAppointment, doctorSchedule, findAppointment, findSlots, prettyDate } from "@/lib/agenda";
import { getDoctor, getRoom, getService, listDoctors, listRooms, listSpecialities, searchInfo, searchServices } from "@/lib/clinica";

/**
 * What the assistant can actually do. Two rules shaped every one of these tools:
 *
 * 1. **No clinical advice.** There is deliberately no tool that maps a symptom to an exam. The
 *    assistant can say what a speciality deals with and what a service involves, because that is
 *    written by the clinic; it cannot decide what a person needs.
 * 2. **The tools do not trust the model.** An appointment is re-validated server-side against the
 *    real shifts, a booking needs the patient's click, and an existing appointment is only shown
 *    when the code *and* the email match.
 */

// Small free models sometimes send numbers as strings, or "" for an optional field.
const optionalString = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().max(200).optional());
const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null ? undefined : typeof v === "string" ? Number(v.replace(",", ".")) : v),
  z.number().positive().optional(),
);

const euro = (cents: number) => cents / 100;

export const tools = {
  listSpecialities: tool({
    description:
      "Elenca le specialità del poliambulatorio con una frase su cosa si occupa ciascuna. Usalo quando il paziente chiede 'cosa fate', 'che visite si possono prenotare' o nomina un'area generica.",
    inputSchema: z.object({}),
    execute: async () => {
      const rows = await listSpecialities();
      return { count: rows.length, specialities: rows.map((r) => ({ slug: r.slug, name: r.name, summary: r.summary })) };
    },
  }),

  searchServices: tool({
    description:
      "Cerca fra le prestazioni prenotabili (visite, esami, analisi, certificati, terapie) per testo libero o filtri. Restituisce durata, prezzo, giorni per il referto e se serve l'impegnativa. NON interpretare sintomi: cerca ciò che il paziente nomina.",
    inputSchema: z.object({
      query: optionalString.describe("Cosa cerca il paziente, in parole sue (es. 'ecografia addome', 'visita cuore')"),
      speciality: optionalString.describe("Slug di una specialità, se già nota"),
      kind: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["visita", "esame", "analisi", "certificato", "terapia"]).optional()),
      maxPrice: optionalNumber.describe("Prezzo massimo in euro"),
    }),
    execute: async ({ query, speciality, kind, maxPrice }) => {
      const results = await searchServices({
        query,
        speciality,
        kind,
        maxPriceCents: maxPrice ? Math.round(maxPrice * 100) : undefined,
        limit: 6,
      });
      return {
        count: results.length,
        services: results.map((s) => ({
          slug: s.slug,
          name: s.name,
          speciality: s.specialityName,
          kind: s.kind,
          durationMinutes: s.durationMinutes,
          priceEuro: euro(s.priceCents),
          reportDays: s.reportDays,
          referralNeeded: Boolean(s.referralNeeded),
        })),
      };
    },
  }),

  getService: tool({
    description:
      "Tutti i dettagli di una prestazione: descrizione, preparazione (digiuno, documenti), durata, prezzo, giorni per il referto, chi la esegue. Usalo prima di prenotare e ogni volta che il paziente chiede 'come mi preparo'.",
    inputSchema: z.object({ slug: z.string().max(80) }),
    execute: async ({ slug }) => {
      const s = await getService(slug);
      if (!s) return { found: false as const };
      return {
        found: true as const,
        slug: s.slug,
        name: s.name,
        speciality: s.specialityName,
        kind: s.kind,
        description: s.description,
        preparation: s.preparation || "Nessuna preparazione particolare.",
        durationMinutes: s.durationMinutes,
        priceEuro: euro(s.priceCents),
        reportDays: s.reportDays,
        referralNeeded: Boolean(s.referralNeeded),
        doctors: s.doctors.map((d) => ({ slug: d.slug, name: `${d.title} ${d.name}` })),
      };
    },
  }),

  findDoctors: tool({
    description:
      "Chi lavora nel poliambulatorio: per specialità, per prestazione o per nome. Restituisce specialità, lingue e i giorni in cui riceve.",
    inputSchema: z.object({
      speciality: optionalString.describe("Slug della specialità"),
      serviceSlug: optionalString.describe("Slug di una prestazione: restituisce solo chi la esegue"),
      name: optionalString.describe("Parte del cognome, se il paziente lo nomina"),
    }),
    execute: async ({ speciality, serviceSlug, name }) => {
      let list = await listDoctors({ speciality });
      if (serviceSlug) {
        const service = await getService(serviceSlug);
        const allowed = new Set(service?.doctors.map((d) => d.slug) ?? []);
        list = list.filter((d) => allowed.has(d.slug));
      }
      if (name) {
        const needle = name.toLowerCase();
        list = list.filter((d) => d.name.toLowerCase().includes(needle));
      }
      const withDays = await Promise.all(
        list.slice(0, 8).map(async (d) => {
          const schedule = await doctorSchedule(d.slug);
          return {
            slug: d.slug,
            name: `${d.title} ${d.name}`,
            specialities: d.specialities.map((s) => s.name),
            languages: d.languages,
            days: schedule.map((s) => `${s.weekdayName} ${s.from}-${s.to}`),
            rooms: [...new Set(schedule.map((s) => `${s.roomName} (piano ${s.floor})`))],
          };
        }),
      );
      return { count: withDays.length, doctors: withDays };
    },
  }),

  getAvailability: tool({
    description:
      "Le prossime disponibilità reali per una prestazione, calcolate dagli orari dei medici e da ciò che è già prenotato. Serve lo slug della prestazione; il medico è facoltativo. Mostra al paziente data, ora, medico e stanza.",
    inputSchema: z.object({
      serviceSlug: z.string().max(80),
      doctorSlug: optionalString.describe("Se il paziente vuole un medico in particolare"),
      fromDate: optionalString.describe("Data da cui cercare, formato 2026-10-20"),
    }),
    execute: async ({ serviceSlug, doctorSlug, fromDate }) => {
      const { service, slots } = await findSlots({ serviceSlug, doctorSlug, fromDate, limit: 8 });
      if (!service) return { found: false as const };
      return {
        found: true as const,
        service: { slug: service.slug, name: service.name, durationMinutes: service.durationMinutes, priceEuro: euro(service.priceCents) },
        count: slots.length,
        slots: slots.map((s) => ({
          startsAt: s.startsAt,
          when: `${prettyDate(s.date)} alle ${s.time}`,
          doctorSlug: s.doctorSlug,
          doctorName: s.doctorName,
          room: s.roomName,
          floor: s.floor,
        })),
      };
    },
  }),

  bookAppointment: tool({
    description:
      "Prenota un appuntamento. Chiedi prima al paziente nome, email e telefono, e fatti confermare lo slot scelto fra quelli di getAvailability. Il paziente vedrà un riepilogo con i pulsanti Conferma / Annulla: nulla viene prenotato senza il suo clic.",
    inputSchema: z.object({
      serviceSlug: z.string().max(80),
      doctorSlug: z.string().max(80),
      startsAt: z.string().max(40).describe("Esattamente il campo startsAt dello slot scelto"),
      patientName: z.string().min(2).max(80),
      patientEmail: z.string().email().max(120),
      patientPhone: z.string().min(6).max(30),
      note: optionalString.describe("Nota organizzativa del paziente. Non chiedere e non riportare informazioni sulla salute."),
    }),
    execute: async (input, { toolCallId }) => {
      try {
        const appointment = await bookAppointment({ ...input, toolCallId });
        const service = await getService(appointment.serviceSlug);
        const room = await getRoom(appointment.roomSlug);
        const doctor = await getDoctor(appointment.doctorSlug);
        return {
          booked: true as const,
          code: appointment.code,
          when: `${prettyDate(appointment.startsAt.toISOString().slice(0, 10))} alle ${new Intl.DateTimeFormat("it-IT", {
            timeZone: "Europe/Rome",
            hour: "2-digit",
            minute: "2-digit",
          }).format(appointment.startsAt)}`,
          service: service?.name ?? appointment.serviceSlug,
          doctor: doctor ? `${doctor.title} ${doctor.name}` : appointment.doctorSlug,
          room: room ? `${room.name}, piano ${room.floor}` : appointment.roomSlug,
          arriveMinutesEarlier: 10,
          preparation: service?.preparation || "Nessuna preparazione particolare.",
        };
      } catch (err) {
        if (err instanceof BookingError) return { booked: false as const, reason: err.message };
        throw err;
      }
    },
  }),

  findMyAppointment: tool({
    description:
      "Trova una prenotazione già fatta. Servono il codice (formato PR-12345) E l'email usata per prenotare: chiedili entrambi, non rivelare nulla se non combaciano.",
    inputSchema: z.object({ code: z.string().max(20), email: z.string().email().max(120) }),
    execute: async ({ code, email }) => {
      const row = await findAppointment(code, email);
      if (!row) return { found: false as const };
      const service = await getService(row.serviceSlug);
      const room = await getRoom(row.roomSlug);
      const doctor = await getDoctor(row.doctorSlug);
      return {
        found: true as const,
        code: row.code,
        status: row.status,
        when: `${prettyDate(row.startsAt.toISOString().slice(0, 10))} alle ${new Intl.DateTimeFormat("it-IT", {
          timeZone: "Europe/Rome",
          hour: "2-digit",
          minute: "2-digit",
        }).format(row.startsAt)}`,
        service: service?.name ?? row.serviceSlug,
        doctor: doctor ? `${doctor.title} ${doctor.name}` : row.doctorSlug,
        room: room ? `${room.name}, piano ${room.floor}` : row.roomSlug,
        reportDays: service?.reportDays ?? null,
      };
    },
  }),

  cancelAppointment: tool({
    description:
      "Disdice una prenotazione. Servono codice ed email. Il paziente vedrà un riepilogo da confermare: senza il suo clic non viene disdetto niente.",
    inputSchema: z.object({ code: z.string().max(20), email: z.string().email().max(120) }),
    execute: async ({ code, email }) => {
      const row = await cancelAppointment(code, email);
      if (!row) return { cancelled: false as const, reason: "Nessuna prenotazione con quel codice e quella email." };
      return { cancelled: true as const, code: row.code, status: row.status };
    },
  }),

  whereIs: tool({
    description:
      "Dov'è una stanza o un servizio dentro la struttura: piano, ala, come arrivarci, se è accessibile. Usalo per 'dove si ritirano i referti', 'dove è l'ecografia', 'ambulatorio 2.4'.",
    inputSchema: z.object({ query: z.string().max(120) }),
    execute: async ({ query }) => {
      const needle = query.toLowerCase().trim();
      const all = await listRooms();
      const hits = all.filter(
        (r) =>
          r.name.toLowerCase().includes(needle) ||
          r.wing.toLowerCase().includes(needle) ||
          r.directions.toLowerCase().includes(needle) ||
          needle.includes(r.name.toLowerCase()),
      );
      const rooms = (hits.length ? hits : all).slice(0, 5);
      return {
        count: rooms.length,
        exact: hits.length > 0,
        rooms: rooms.map((r) => ({
          name: r.name,
          floor: r.floor,
          wing: r.wing,
          directions: r.directions,
          accessible: Boolean(r.accessible),
        })),
      };
    },
  }),

  searchInfo: tool({
    description:
      "Cerca nelle pagine informative della clinica: orari, come prenotare e disdire, referti (tempi, ritiro, delega, invio), pagamenti e ticket, documenti da portare, parcheggio, accessibilità, privacy. Rispondi SOLO con ciò che trovi qui, citando la sezione.",
    inputSchema: z.object({ question: z.string().max(300) }),
    execute: async ({ question }) => {
      const hits = await searchInfo(question, 4);
      return {
        count: hits.length,
        sections: hits.map((h) => ({ doc: h.docTitle, section: h.section, content: h.content })),
      };
    },
  }),
};

export type ClinicTools = InferUITools<typeof tools>;
export type ClinicUIMessage = UIMessage<{ model?: string }, never, ClinicTools>;
