import "server-only";

import { eq, inArray, notInArray, sql } from "drizzle-orm";

import { DEMO_CODICE, DEMO_EMAIL } from "@/data/clinica";
import { documenti } from "@/data/informazioni";
import { medici } from "@/data/medici";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { stanze } from "@/data/stanze";
import { assenze, turni } from "@/data/turni";
import type { DocInfo, Medico, Prestazione, Specialita } from "@/data/types";
import { findSlots, timeToMinutes } from "@/lib/agenda";
import { db } from "@/lib/db";
import {
  appointments,
  closures,
  doctors,
  doctorSpecialities,
  infoChunks,
  rooms,
  services,
  serviceDoctors,
  shifts,
  specialities,
} from "@/lib/db/schema";
import { embedPassages } from "@/lib/embeddings";

/* -------------------------------------------------------------------------- */
/* What gets turned into a vector. Change these and everything is re-embedded. */
/* -------------------------------------------------------------------------- */

export const specialityEmbedText = (s: Specialita) => `${s.nome}. ${s.sommario} ${s.descrizione} ${s.tags.join(", ")}`;
export const serviceEmbedText = (p: Prestazione) =>
  `${p.nome}. ${p.descrizione} ${p.preparazione} ${p.tags.join(", ")}`;
export const infoEmbedText = (s: { docTitle: string; section: string; content: string }) =>
  `${s.docTitle} - ${s.section}: ${s.content}`;

/** One "## " heading of an informative document = one searchable chunk. */
export function infoSections() {
  return documenti.flatMap((doc: DocInfo) =>
    doc.corpo
      .split(/^## /m)
      .filter(Boolean)
      .map((block, position) => {
        const [heading, ...rest] = block.split("\n");
        return {
          docSlug: doc.slug,
          docTitle: doc.titolo,
          section: heading.trim(),
          content: rest.join("\n").trim(),
          position,
        };
      }),
  );
}

const specialityRow = (s: Specialita, position: number) => ({
  slug: s.slug,
  name: s.nome,
  summary: s.sommario,
  description: s.descrizione,
  tags: s.tags,
  tagsText: s.tags.join(" "),
  position,
});

const doctorRow = (m: Medico, position: number) => ({
  slug: m.slug,
  name: m.nome,
  title: m.titolo,
  bio: m.bio,
  languages: m.lingue,
  register: m.albo,
  color: m.colore,
  position,
});

const serviceRow = (p: Prestazione, position: number) => ({
  slug: p.slug,
  name: p.nome,
  specialitySlug: p.specialita,
  durationMinutes: p.durataMinuti,
  priceCents: Math.round(p.prezzoEuro * 100),
  kind: p.tipo,
  description: p.descrizione,
  preparation: p.preparazione,
  reportDays: p.giorniReferto,
  referralNeeded: p.impegnativa ? 1 : 0,
  tags: p.tags,
  tagsText: p.tags.join(" "),
  position,
});

/* -------------------------------------------------------------------------- */
/* Consistency: a wrong slug in the data files must fail loudly, at startup,   */
/* not silently produce a doctor nobody can book.                             */
/* -------------------------------------------------------------------------- */

export function checkData() {
  const problems: string[] = [];
  const specialitySlugs = new Set(specialita.map((s) => s.slug));
  const doctorSlugs = new Set(medici.map((m) => m.slug));
  const roomSlugs = new Set(stanze.map((s) => s.slug));

  for (const m of medici) {
    for (const s of m.specialita) if (!specialitySlugs.has(s)) problems.push(`medico ${m.slug}: specialità inesistente "${s}"`);
  }
  for (const p of prestazioni) {
    if (!specialitySlugs.has(p.specialita)) problems.push(`prestazione ${p.slug}: specialità inesistente "${p.specialita}"`);
    if (!p.medici.length) problems.push(`prestazione ${p.slug}: nessun medico`);
    for (const d of p.medici) {
      if (!doctorSlugs.has(d)) problems.push(`prestazione ${p.slug}: medico inesistente "${d}"`);
      else {
        const medico = medici.find((m) => m.slug === d)!;
        if (!medico.specialita.includes(p.specialita)) {
          problems.push(`prestazione ${p.slug}: ${d} non ha la specialità ${p.specialita}`);
        }
      }
    }
  }
  for (const t of turni) {
    if (!doctorSlugs.has(t.medico)) problems.push(`turno: medico inesistente "${t.medico}"`);
    if (!roomSlugs.has(t.stanza)) problems.push(`turno di ${t.medico}: stanza inesistente "${t.stanza}"`);
    if (timeToMinutes(t.alle) <= timeToMinutes(t.dalle)) problems.push(`turno di ${t.medico}: orario invertito`);
  }
  for (const m of medici) {
    if (!turni.some((t) => t.medico === m.slug)) problems.push(`medico ${m.slug}: nessun turno, non è prenotabile`);
  }
  // Two doctors in the same room at the same time would send two patients to the same door.
  for (const a of turni) {
    for (const b of turni) {
      if (a === b || a.stanza !== b.stanza || a.giorno !== b.giorno || a.medico === b.medico) continue;
      const overlap = timeToMinutes(a.dalle) < timeToMinutes(b.alle) && timeToMinutes(b.dalle) < timeToMinutes(a.alle);
      if (overlap) problems.push(`stanza ${a.stanza}: ${a.medico} e ${b.medico} si sovrappongono il giorno ${a.giorno}`);
    }
  }
  return [...new Set(problems)];
}

/* -------------------------------------------------------------------------- */
/* First seed                                                                 */
/* -------------------------------------------------------------------------- */

export async function seedAll() {
  const problems = checkData();
  if (problems.length) throw new Error(`Dati incoerenti in src/data:\n- ${problems.join("\n- ")}`);

  const specialityVectors = await embedPassages(specialita.map(specialityEmbedText));
  await db.insert(specialities).values(specialita.map((s, i) => ({ ...specialityRow(s, i), embedding: specialityVectors[i] })));

  await db.insert(doctors).values(medici.map(doctorRow));
  await db.insert(doctorSpecialities).values(
    medici.flatMap((m) => m.specialita.map((s) => ({ doctorSlug: m.slug, specialitySlug: s }))),
  );
  await db.insert(rooms).values(
    stanze.map((s) => ({
      slug: s.slug,
      name: s.nome,
      floor: s.piano,
      wing: s.ala,
      directions: s.indicazioni,
      accessible: s.accessibile ? 1 : 0,
    })),
  );

  const serviceVectors = await embedPassages(prestazioni.map(serviceEmbedText));
  await db.insert(services).values(prestazioni.map((p, i) => ({ ...serviceRow(p, i), embedding: serviceVectors[i] })));
  await db.insert(serviceDoctors).values(prestazioni.flatMap((p) => p.medici.map((d) => ({ serviceSlug: p.slug, doctorSlug: d }))));

  await db.insert(shifts).values(
    turni.map((t) => ({
      doctorSlug: t.medico,
      weekday: t.giorno,
      startMin: timeToMinutes(t.dalle),
      endMin: timeToMinutes(t.alle),
      roomSlug: t.stanza,
    })),
  );
  if (assenze.length) {
    await db.insert(closures).values(assenze.map((a) => ({ doctorSlug: a.medico, fromDate: a.dal, toDate: a.al, reason: a.motivo })));
  }

  const sections = infoSections();
  const infoVectors = await embedPassages(sections.map(infoEmbedText));
  await db.insert(infoChunks).values(sections.map((s, i) => ({ ...s, embedding: infoVectors[i] })));
}

/**
 * Invented appointments so a visitor can immediately try "trova la mia prenotazione": one with the
 * demo code from `src/data/clinica.ts`, two others further ahead. They are rebuilt every day,
 * because a demo booking in the past looks broken.
 */
export async function seedDemoAppointments() {
  const wanted = [
    { serviceSlug: prestazioni[0]?.slug, code: DEMO_CODICE, name: "Mario Demo" },
    { serviceSlug: prestazioni[1]?.slug, code: "PR-20482", name: "Giulia Demo" },
    { serviceSlug: prestazioni[2]?.slug, code: "PR-20483", name: "Luca Demo" },
  ].filter((w): w is { serviceSlug: string; code: string; name: string } => Boolean(w.serviceSlug));

  for (const w of wanted) {
    const { service, slots } = await findSlots({ serviceSlug: w.serviceSlug, limit: 4 });
    const slot = slots.at(-1);
    if (!service || !slot) continue;
    await db
      .insert(appointments)
      .values({
        code: w.code,
        patientName: w.name,
        patientEmail: DEMO_EMAIL,
        patientPhone: "0521 000 000",
        serviceSlug: service.slug,
        doctorSlug: slot.doctorSlug,
        roomSlug: slot.roomSlug,
        startsAt: new Date(slot.startsAt),
        endsAt: new Date(slot.endsAt),
        isDemo: 1,
      })
      .onConflictDoNothing();
  }
}

/* -------------------------------------------------------------------------- */
/* Re-sync of an existing database                                            */
/* -------------------------------------------------------------------------- */

export type SyncPlan = { added: string[]; updated: string[]; reembedded: string[]; removed: string[] };
export type SyncReport = {
  specialita: SyncPlan;
  medici: SyncPlan;
  stanze: SyncPlan;
  prestazioni: SyncPlan;
  turni: SyncPlan;
  informazioni: SyncPlan;
  dryRun: boolean;
};

const empty = (): SyncPlan => ({ added: [], updated: [], reembedded: [], removed: [] });

/** Postgres returns `jsonb` and arrays in its own order; compare content, not storage. */
function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(",")}}`;
}

function diffRow(row: Record<string, unknown>, values: Record<string, unknown>) {
  return Object.entries(values).some(([key, value]) => stable(row[key]) !== stable(value));
}

export function planIsEmpty(report: SyncReport) {
  return Object.values(report)
    .filter((v): v is SyncPlan => typeof v === "object" && v !== null)
    .every((p) => !p.added.length && !p.updated.length && !p.reembedded.length && !p.removed.length);
}

export function describe(report: SyncReport) {
  const line = (name: string, p: SyncPlan) =>
    `${name}: +${p.added.length} ~${p.updated.length} (${p.reembedded.length} ricalcolati) -${p.removed.length}`;
  return [
    line("specialità", report.specialita),
    line("medici", report.medici),
    line("stanze", report.stanze),
    line("prestazioni", report.prestazioni),
    line("turni", report.turni),
    line("informazioni", report.informazioni),
  ].join(" · ");
}

export async function syncContent({ dryRun = false } = {}): Promise<SyncReport> {
  const problems = checkData();
  if (problems.length) throw new Error(`Dati incoerenti in src/data:\n- ${problems.join("\n- ")}`);

  const report: SyncReport = {
    specialita: empty(),
    medici: empty(),
    stanze: empty(),
    prestazioni: empty(),
    turni: empty(),
    informazioni: empty(),
    dryRun,
  };

  /* Specialità ------------------------------------------------------------- */
  {
    const plan = report.specialita;
    const rows = await db.select().from(specialities);
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    const toEmbed: { slug: string; text: string }[] = [];

    for (const [position, s] of specialita.entries()) {
      const values = specialityRow(s, position);
      const row = bySlug.get(s.slug);
      if (!row) {
        plan.added.push(s.slug);
        plan.reembedded.push(s.slug);
        toEmbed.push({ slug: s.slug, text: specialityEmbedText(s) });
        if (!dryRun) await db.insert(specialities).values(values);
        continue;
      }
      if (!diffRow(row, values)) continue;
      plan.updated.push(s.slug);
      const embedChanged = specialityEmbedText(s) !== `${row.name}. ${row.summary} ${row.description} ${row.tags.join(", ")}`;
      if (embedChanged) {
        plan.reembedded.push(s.slug);
        toEmbed.push({ slug: s.slug, text: specialityEmbedText(s) });
      }
      if (!dryRun) await db.update(specialities).set(values).where(eq(specialities.slug, s.slug));
    }
    const keep = specialita.map((s) => s.slug);
    plan.removed.push(...rows.filter((r) => !keep.includes(r.slug)).map((r) => r.slug));

    if (!dryRun && toEmbed.length) {
      const vectors = await embedPassages(toEmbed.map((t) => t.text));
      for (const [i, t] of toEmbed.entries()) {
        await db.update(specialities).set({ embedding: vectors[i] }).where(eq(specialities.slug, t.slug));
      }
    }
    if (!dryRun && plan.removed.length) await db.delete(specialities).where(notInArray(specialities.slug, keep));
  }

  /* Medici ----------------------------------------------------------------- */
  {
    const plan = report.medici;
    const rows = await db.select().from(doctors);
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    for (const [position, m] of medici.entries()) {
      const values = doctorRow(m, position);
      const row = bySlug.get(m.slug);
      if (!row) {
        plan.added.push(m.slug);
        if (!dryRun) await db.insert(doctors).values(values);
        continue;
      }
      if (!diffRow(row, values)) continue;
      plan.updated.push(m.slug);
      if (!dryRun) await db.update(doctors).set(values).where(eq(doctors.slug, m.slug));
    }
    const keep = medici.map((m) => m.slug);
    plan.removed.push(...rows.filter((r) => !keep.includes(r.slug)).map((r) => r.slug));
    if (!dryRun) {
      if (plan.removed.length) await db.delete(doctors).where(notInArray(doctors.slug, keep));
      // The join table is tiny: rewriting it is simpler and cannot drift.
      await db.delete(doctorSpecialities);
      await db
        .insert(doctorSpecialities)
        .values(medici.flatMap((m) => m.specialita.map((s) => ({ doctorSlug: m.slug, specialitySlug: s }))));
    }
  }

  /* Stanze ----------------------------------------------------------------- */
  {
    const plan = report.stanze;
    const rows = await db.select().from(rooms);
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    for (const s of stanze) {
      const values = {
        slug: s.slug,
        name: s.nome,
        floor: s.piano,
        wing: s.ala,
        directions: s.indicazioni,
        accessible: s.accessibile ? 1 : 0,
      };
      const row = bySlug.get(s.slug);
      if (!row) {
        plan.added.push(s.slug);
        if (!dryRun) await db.insert(rooms).values(values);
        continue;
      }
      if (!diffRow(row, values)) continue;
      plan.updated.push(s.slug);
      if (!dryRun) await db.update(rooms).set(values).where(eq(rooms.slug, s.slug));
    }
    const keep = stanze.map((s) => s.slug);
    // A room still referenced by an appointment stays: the patient has that door written down.
    const used = await db.select({ slug: appointments.roomSlug }).from(appointments);
    const usedSlugs = new Set(used.map((u) => u.slug));
    const orphans = rows.filter((r) => !keep.includes(r.slug) && !usedSlugs.has(r.slug)).map((r) => r.slug);
    plan.removed.push(...orphans);
    if (!dryRun && orphans.length) await db.delete(rooms).where(inArray(rooms.slug, orphans));
  }

  /* Prestazioni ------------------------------------------------------------ */
  {
    const plan = report.prestazioni;
    const rows = await db.select().from(services);
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    const toEmbed: { slug: string; text: string }[] = [];

    for (const [position, p] of prestazioni.entries()) {
      const values = serviceRow(p, position);
      const row = bySlug.get(p.slug);
      if (!row) {
        plan.added.push(p.slug);
        plan.reembedded.push(p.slug);
        toEmbed.push({ slug: p.slug, text: serviceEmbedText(p) });
        if (!dryRun) await db.insert(services).values(values);
        continue;
      }
      if (!diffRow(row, values)) continue;
      plan.updated.push(p.slug);
      const rowText = `${row.name}. ${row.description} ${row.preparation} ${row.tags.join(", ")}`;
      if (serviceEmbedText(p) !== rowText) {
        plan.reembedded.push(p.slug);
        toEmbed.push({ slug: p.slug, text: serviceEmbedText(p) });
      }
      if (!dryRun) await db.update(services).set(values).where(eq(services.slug, p.slug));
    }
    const keep = prestazioni.map((p) => p.slug);
    plan.removed.push(...rows.filter((r) => !keep.includes(r.slug)).map((r) => r.slug));

    if (!dryRun) {
      if (toEmbed.length) {
        const vectors = await embedPassages(toEmbed.map((t) => t.text));
        for (const [i, t] of toEmbed.entries()) {
          await db.update(services).set({ embedding: vectors[i] }).where(eq(services.slug, t.slug));
        }
      }
      if (plan.removed.length) {
        // Keep a discontinued service if someone is still booked for it.
        const booked = await db.select({ slug: appointments.serviceSlug }).from(appointments);
        const stillUsed = new Set(booked.map((b) => b.slug));
        const removable = plan.removed.filter((slug) => !stillUsed.has(slug));
        plan.removed = removable;
        if (removable.length) await db.delete(services).where(inArray(services.slug, removable));
      }
      await db.delete(serviceDoctors);
      await db
        .insert(serviceDoctors)
        .values(prestazioni.flatMap((p) => p.medici.map((d) => ({ serviceSlug: p.slug, doctorSlug: d }))));
    }
  }

  /* Turni e chiusure ------------------------------------------------------- */
  {
    const plan = report.turni;
    const rows = await db.select().from(shifts);
    const wanted = turni.map((t) => ({
      doctorSlug: t.medico,
      weekday: t.giorno,
      startMin: timeToMinutes(t.dalle),
      endMin: timeToMinutes(t.alle),
      roomSlug: t.stanza,
    }));
    const key = (t: { doctorSlug: string; weekday: number; startMin: number; endMin: number; roomSlug: string }) =>
      `${t.doctorSlug}|${t.weekday}|${t.startMin}|${t.endMin}|${t.roomSlug}`;
    const have = new Set(rows.map(key));
    const want = new Set(wanted.map(key));
    plan.added.push(...wanted.filter((t) => !have.has(key(t))).map((t) => `${t.doctorSlug} g${t.weekday}`));
    plan.removed.push(...rows.filter((t) => !want.has(key(t))).map((t) => `${t.doctorSlug} g${t.weekday}`));

    if (!dryRun && (plan.added.length || plan.removed.length)) {
      // Shifts are a handful of rows and have no identity of their own: rewrite them.
      await db.delete(shifts);
      await db.insert(shifts).values(wanted);
    }
    if (!dryRun) {
      await db.delete(closures);
      if (assenze.length) {
        await db
          .insert(closures)
          .values(assenze.map((a) => ({ doctorSlug: a.medico, fromDate: a.dal, toDate: a.al, reason: a.motivo })));
      }
    }
  }

  /* Informazioni ----------------------------------------------------------- */
  {
    const plan = report.informazioni;
    const sections = infoSections();
    const rows = await db.select().from(infoChunks);
    const key = (s: { docSlug: string; position: number }) => `${s.docSlug}#${s.position}`;
    const byKey = new Map(rows.map((r) => [key(r), r]));
    const toEmbed: { id: number | null; key: string; text: string; section: (typeof sections)[number] }[] = [];

    for (const s of sections) {
      const row = byKey.get(key(s));
      const label = `${s.docSlug} · ${s.section}`;
      if (!row) {
        plan.added.push(label);
        plan.reembedded.push(label);
        toEmbed.push({ id: null, key: key(s), text: infoEmbedText(s), section: s });
        continue;
      }
      if (row.docTitle === s.docTitle && row.section === s.section && row.content === s.content) continue;
      plan.updated.push(label);
      plan.reembedded.push(label);
      toEmbed.push({ id: row.id, key: key(s), text: infoEmbedText(s), section: s });
    }
    const keep = new Set(sections.map(key));
    const orphans = rows.filter((r) => !keep.has(key(r)));
    plan.removed.push(...orphans.map((r) => `${r.docSlug} · ${r.section}`));

    if (!dryRun && toEmbed.length) {
      const vectors = await embedPassages(toEmbed.map((t) => t.text));
      for (const [i, t] of toEmbed.entries()) {
        if (t.id === null) await db.insert(infoChunks).values({ ...t.section, embedding: vectors[i] });
        else await db.update(infoChunks).set({ ...t.section, embedding: vectors[i] }).where(eq(infoChunks.id, t.id));
      }
    }
    if (!dryRun && orphans.length) {
      await db.delete(infoChunks).where(
        inArray(
          infoChunks.id,
          orphans.map((o) => o.id),
        ),
      );
    }
  }

  // An appointment pointing at a doctor who no longer has that shift is not a data error: the
  // patient keeps the appointment. Only report it, so whoever maintains the clinic knows.
  const dangling = await db.execute<{ count: number }>(
    sql`select count(*)::int as count from appointments a where not exists (select 1 from doctors d where d.slug = a.doctor_slug)`,
  );
  if (dangling[0]?.count) console.warn(`[sync] ${dangling[0].count} prenotazioni con un medico non più in elenco`);

  return report;
}
