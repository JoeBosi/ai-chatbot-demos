import "server-only";

import { and, asc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { appointments, closures, doctors, rooms, services, serviceDoctors, shifts } from "@/lib/db/schema";

/**
 * Availability is computed, never stored: weekly shifts − closures − appointments already taken.
 * Storing thousands of empty slots would mean regenerating them every time a doctor changes day,
 * and would still not prevent a double booking — that is the database's unique index on
 * (doctor, start) and it is the only thing we trust at the moment of writing.
 *
 * Everything here works on Europe/Rome wall-clock time, because that is what the patient reads on
 * the page and what the clinic's door says. The conversion happens in one place: `atLocal()`.
 */
export const TIMEZONE = "Europe/Rome";

/** Earliest bookable moment: nobody books a blood test for twenty minutes from now. */
const MIN_NOTICE_HOURS = 24;
/** How far ahead the calendar is open. */
export const HORIZON_DAYS = 45;

export type Slot = {
  /** ISO string with the real offset, e.g. "2026-10-13T09:30:00+02:00". */
  startsAt: string;
  endsAt: string;
  /** "2026-10-13" and "09:30", already in clinic time, ready to show. */
  date: string;
  time: string;
  doctorSlug: string;
  doctorName: string;
  roomSlug: string;
  roomName: string;
  floor: number;
};

const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

export function weekdayName(weekday: number) {
  return GIORNI[weekday] ?? "";
}

export function minutesToTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** The offset Europe/Rome has on a given date, as "+02:00" — summer time included. */
function offsetFor(dateISO: string) {
  const probe = new Date(`${dateISO}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")?.value;
  // "GMT+2" / "GMT+02:00" / "GMT"
  const match = name?.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return "+00:00";
  const [, sign, hours, minutes = "00"] = match;
  return `${sign}${hours.padStart(2, "0")}:${minutes}`;
}

/** A wall-clock date+minute in clinic time, as a real instant. */
export function atLocal(dateISO: string, minute: number) {
  return new Date(`${dateISO}T${minutesToTime(minute)}:00${offsetFor(dateISO)}`);
}

/** "2026-10-13" for an instant, in clinic time. */
export function localDate(instant: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, dateStyle: "short" }).format(instant);
}

/** "09:30" for an instant, in clinic time. */
export function localTime(instant: Date) {
  return new Intl.DateTimeFormat("it-IT", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit" }).format(instant);
}

export function localWeekday(dateISO: string) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, weekday: "short" }).format(
    new Date(`${dateISO}T12:00:00Z`),
  );
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/** Human date for answers: "lunedì 13 ottobre". */
export function prettyDate(dateISO: string) {
  return new Intl.DateTimeFormat("it-IT", { timeZone: TIMEZONE, weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${dateISO}T12:00:00Z`),
  );
}

function addDays(dateISO: string, days: number) {
  const d = new Date(`${dateISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type AvailabilityQuery = {
  serviceSlug: string;
  doctorSlug?: string;
  /** "2026-10-13": first day to consider. Defaults to today. */
  fromDate?: string;
  /** How many slots to return, at most. */
  limit?: number;
  days?: number;
};

/**
 * The next free slots for a service. One query per building block (shifts, closures, booked
 * appointments), then the grid is built in memory: a month of a 14-doctor clinic is a few hundred
 * rows, so this stays well under the time it takes the model to read the answer.
 */
export async function findSlots({ serviceSlug, doctorSlug, fromDate, limit = 8, days = HORIZON_DAYS }: AvailabilityQuery) {
  const [service] = await db.select().from(services).where(eq(services.slug, serviceSlug));
  if (!service) return { service: null, slots: [] as Slot[] };

  const allowed = await db
    .select({ slug: serviceDoctors.doctorSlug })
    .from(serviceDoctors)
    .where(eq(serviceDoctors.serviceSlug, serviceSlug));
  let doctorSlugs = allowed.map((a) => a.slug);
  if (doctorSlug) doctorSlugs = doctorSlugs.filter((s) => s === doctorSlug);
  if (!doctorSlugs.length) return { service, slots: [] as Slot[] };

  const [shiftRows, closureRows, doctorRows, roomRows] = await Promise.all([
    db.select().from(shifts).where(inArray(shifts.doctorSlug, doctorSlugs)).orderBy(asc(shifts.startMin)),
    db
      .select()
      .from(closures)
      .where(or(isNull(closures.doctorSlug), inArray(closures.doctorSlug, doctorSlugs))),
    db.select().from(doctors).where(inArray(doctors.slug, doctorSlugs)),
    db.select().from(rooms),
  ]);

  const today = localDate(new Date());
  const start = fromDate && fromDate > today ? fromDate : today;
  const notBefore = new Date(Date.now() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  const end = addDays(start, days);

  const taken = await db
    .select({ doctorSlug: appointments.doctorSlug, startsAt: appointments.startsAt, endsAt: appointments.endsAt })
    .from(appointments)
    .where(
      and(
        inArray(appointments.doctorSlug, doctorSlugs),
        eq(appointments.status, "confermata"),
        gte(appointments.startsAt, atLocal(start, 0)),
        lt(appointments.startsAt, atLocal(end, 0)),
      ),
    );

  const doctorName = new Map(doctorRows.map((d) => [d.slug, `${d.title} ${d.name}`.trim()]));
  const roomByslug = new Map(roomRows.map((r) => [r.slug, r]));
  const busy = new Set(taken.map((t) => `${t.doctorSlug}@${t.startsAt.toISOString()}`));
  const closedFor = (slug: string, date: string) =>
    closureRows.some((c) => (c.doctorSlug === null || c.doctorSlug === slug) && c.fromDate <= date && date <= c.toDate);

  const slots: Slot[] = [];
  for (let i = 0; i <= days && slots.length < limit; i++) {
    const date = addDays(start, i);
    const weekday = localWeekday(date);
    for (const shift of shiftRows.filter((s) => s.weekday === weekday)) {
      if (closedFor(shift.doctorSlug, date)) continue;
      const room = roomByslug.get(shift.roomSlug);
      if (!room) continue;
      for (let minute = shift.startMin; minute + service.durationMinutes <= shift.endMin; minute += service.durationMinutes) {
        const startsAt = atLocal(date, minute);
        if (startsAt < notBefore) continue;
        if (busy.has(`${shift.doctorSlug}@${startsAt.toISOString()}`)) continue;
        const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000);
        slots.push({
          startsAt: toOffsetISO(startsAt, date),
          endsAt: toOffsetISO(endsAt, date),
          date,
          time: localTime(startsAt),
          doctorSlug: shift.doctorSlug,
          doctorName: doctorName.get(shift.doctorSlug) ?? shift.doctorSlug,
          roomSlug: room.slug,
          roomName: room.name,
          floor: room.floor,
        });
      }
    }
    slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }
  return { service, slots: slots.slice(0, limit) };
}

function toOffsetISO(instant: Date, dateISO: string) {
  const offset = offsetFor(dateISO);
  const [sign, hh, mm] = [offset[0], Number(offset.slice(1, 3)), Number(offset.slice(4, 6))];
  const shifted = new Date(instant.getTime() + (sign === "+" ? 1 : -1) * (hh * 60 + mm) * 60 * 1000);
  return `${shifted.toISOString().slice(0, 19)}${offset}`;
}

/** The weekly days of a doctor, ready to print: "martedì 9:00-13:00 · giovedì 14:30-18:30". */
export async function doctorSchedule(doctorSlug: string) {
  const rows = await db
    .select({
      weekday: shifts.weekday,
      startMin: shifts.startMin,
      endMin: shifts.endMin,
      roomName: rooms.name,
      floor: rooms.floor,
    })
    .from(shifts)
    .innerJoin(rooms, eq(rooms.slug, shifts.roomSlug))
    .where(eq(shifts.doctorSlug, doctorSlug))
    .orderBy(asc(shifts.weekday), asc(shifts.startMin));
  return rows.map((r) => ({
    ...r,
    weekdayName: weekdayName(r.weekday),
    from: minutesToTime(r.startMin),
    to: minutesToTime(r.endMin),
  }));
}

/** A booking code a patient can read over the phone: PR-20481. */
export function newAppointmentCode() {
  return `PR-${Math.floor(10000 + Math.random() * 89999)}`;
}

export class BookingError extends Error {}

export type BookingRequest = {
  serviceSlug: string;
  doctorSlug: string;
  /** Must be one of the slots returned by `findSlots` — it is re-checked here. */
  startsAt: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  note?: string;
  toolCallId?: string;
};

/**
 * Books a slot, re-validating everything server-side: the client (or the model) can ask for any
 * time it likes, so the shift, the closures, the notice period and the double booking are all
 * checked here. The unique index is the final word — between the check and the insert another
 * patient can still get in, and that race is handled by catching the constraint.
 */
export async function bookAppointment(req: BookingRequest) {
  const wanted = new Date(req.startsAt);
  if (Number.isNaN(wanted.getTime())) throw new BookingError("Orario non valido.");

  const date = localDate(wanted);
  const { service, slots } = await findSlots({
    serviceSlug: req.serviceSlug,
    doctorSlug: req.doctorSlug,
    fromDate: date,
    days: 1,
    limit: 200,
  });
  if (!service) throw new BookingError("Prestazione non trovata.");

  const slot = slots.find((s) => new Date(s.startsAt).getTime() === wanted.getTime());
  if (!slot) throw new BookingError("Quell'orario non è più disponibile: chiedi le prossime disponibilità.");

  if (req.toolCallId) {
    const [already] = await db.select().from(appointments).where(eq(appointments.toolCallId, req.toolCallId));
    if (already) return already;
  }

  const code = newAppointmentCode();
  try {
    const [created] = await db
      .insert(appointments)
      .values({
        code,
        patientName: req.patientName.trim().slice(0, 80),
        patientEmail: req.patientEmail.trim().toLowerCase().slice(0, 120),
        patientPhone: req.patientPhone.trim().slice(0, 30),
        serviceSlug: service.slug,
        doctorSlug: slot.doctorSlug,
        roomSlug: slot.roomSlug,
        startsAt: new Date(slot.startsAt),
        endsAt: new Date(slot.endsAt),
        note: req.note?.trim().slice(0, 300) || null,
        toolCallId: req.toolCallId ?? null,
      })
      .returning();
    return created;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("appointments_doctor_slot_idx")) {
      throw new BookingError("Quell'orario è stato appena prenotato da qualcun altro: scegline un altro.");
    }
    if (message.includes("appointments_tool_call_id")) {
      const [existing] = await db.select().from(appointments).where(eq(appointments.toolCallId, req.toolCallId!));
      if (existing) return existing;
    }
    throw err;
  }
}

/** Looked up with code **and** email, like a parcel: the code alone is not a password. */
export async function findAppointment(code: string, email: string) {
  const [row] = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.code, code.trim().toUpperCase()),
        sql`lower(${appointments.patientEmail}) = ${email.trim().toLowerCase()}`,
      ),
    );
  return row ?? null;
}

export async function cancelAppointment(code: string, email: string) {
  const row = await findAppointment(code, email);
  if (!row) return null;
  if (row.status === "disdetta") return row;
  const [updated] = await db
    .update(appointments)
    .set({ status: "disdetta" })
    .where(eq(appointments.id, row.id))
    .returning();
  return updated;
}
