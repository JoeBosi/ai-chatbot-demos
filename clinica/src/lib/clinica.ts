import "server-only";

import { and, asc, eq, inArray, sql, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import { doctors, doctorSpecialities, infoChunks, rooms, services, serviceDoctors, specialities } from "@/lib/db/schema";
import { embedQuery } from "@/lib/embeddings";

export type Speciality = typeof specialities.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Room = typeof rooms.$inferSelect;

export function listSpecialities() {
  return db
    .select({
      slug: specialities.slug,
      name: specialities.name,
      summary: specialities.summary,
      tags: specialities.tags,
    })
    .from(specialities)
    .orderBy(asc(specialities.position));
}

export async function getSpeciality(slug: string) {
  const [row] = await db.select().from(specialities).where(eq(specialities.slug, slug));
  return row;
}

export function listRooms() {
  return db.select().from(rooms).orderBy(asc(rooms.floor), asc(rooms.name));
}

export async function getRoom(slug: string) {
  const [row] = await db.select().from(rooms).where(eq(rooms.slug, slug));
  return row;
}

/** Doctors with the slugs of their specialities, in one go (14 rows: no need to be clever). */
export async function listDoctors(opts: { speciality?: string } = {}) {
  const rows = await db
    .select({
      slug: doctors.slug,
      name: doctors.name,
      title: doctors.title,
      bio: doctors.bio,
      languages: doctors.languages,
      register: doctors.register,
      color: doctors.color,
      position: doctors.position,
      specialitySlug: doctorSpecialities.specialitySlug,
      specialityName: specialities.name,
    })
    .from(doctors)
    .innerJoin(doctorSpecialities, eq(doctorSpecialities.doctorSlug, doctors.slug))
    .innerJoin(specialities, eq(specialities.slug, doctorSpecialities.specialitySlug))
    .orderBy(asc(doctors.position), asc(doctors.name));

  const byDoctor = new Map<string, Doctor & { specialities: { slug: string; name: string }[] }>();
  for (const row of rows) {
    const current = byDoctor.get(row.slug) ?? {
      slug: row.slug,
      name: row.name,
      title: row.title,
      bio: row.bio,
      languages: row.languages,
      register: row.register,
      color: row.color,
      position: row.position,
      specialities: [],
    };
    current.specialities.push({ slug: row.specialitySlug, name: row.specialityName });
    byDoctor.set(row.slug, current);
  }
  const all = [...byDoctor.values()];
  return opts.speciality ? all.filter((d) => d.specialities.some((s) => s.slug === opts.speciality)) : all;
}

export async function getDoctor(slug: string) {
  const all = await listDoctors();
  return all.find((d) => d.slug === slug);
}

export type ServiceCard = Pick<
  Service,
  "slug" | "name" | "specialitySlug" | "durationMinutes" | "priceCents" | "kind" | "reportDays" | "referralNeeded"
> & { specialityName: string };

const cardColumns = {
  slug: services.slug,
  name: services.name,
  specialitySlug: services.specialitySlug,
  durationMinutes: services.durationMinutes,
  priceCents: services.priceCents,
  kind: services.kind,
  reportDays: services.reportDays,
  referralNeeded: services.referralNeeded,
  specialityName: specialities.name,
};

function serviceConditions(f: { speciality?: string; kind?: string; maxPriceCents?: number }) {
  const conds: SQL[] = [];
  if (f.speciality) conds.push(eq(services.specialitySlug, f.speciality));
  if (f.kind) conds.push(sql`${services.kind} = ${f.kind}`);
  if (f.maxPriceCents != null) conds.push(sql`${services.priceCents} <= ${f.maxPriceCents}`);
  return conds.length ? and(...conds) : undefined;
}

export async function listServices(f: { speciality?: string; kind?: string; limit?: number } = {}) {
  return db
    .select(cardColumns)
    .from(services)
    .innerJoin(specialities, eq(specialities.slug, services.specialitySlug))
    .where(serviceConditions(f))
    .orderBy(asc(services.position), asc(services.name))
    .limit(f.limit ?? 200);
}

export async function getService(slug: string) {
  const [row] = await db
    .select({ service: services, specialityName: specialities.name })
    .from(services)
    .innerJoin(specialities, eq(specialities.slug, services.specialitySlug))
    .where(eq(services.slug, slug));
  if (!row) return undefined;
  const who = await db
    .select({ slug: doctors.slug, name: doctors.name, title: doctors.title })
    .from(serviceDoctors)
    .innerJoin(doctors, eq(doctors.slug, serviceDoctors.doctorSlug))
    .where(eq(serviceDoctors.serviceSlug, slug))
    .orderBy(asc(doctors.name));
  return { ...row.service, specialityName: row.specialityName, doctors: who };
}

export async function servicesForDoctor(doctorSlug: string) {
  return db
    .select(cardColumns)
    .from(serviceDoctors)
    .innerJoin(services, eq(services.slug, serviceDoctors.serviceSlug))
    .innerJoin(specialities, eq(specialities.slug, services.specialitySlug))
    .where(eq(serviceDoctors.doctorSlug, doctorSlug))
    .orderBy(asc(services.name));
}

/**
 * Hybrid search over the services: Italian full-text and vector similarity fused with reciprocal
 * rank fusion. It is what lets "pancia" find the gastroenterology services and "cuore sotto sforzo"
 * find the stress test, without anybody writing a synonym table by hand.
 *
 * Note what this does NOT do: it never maps a symptom to a diagnosis. It returns what the clinic
 * offers; the instructions forbid the assistant from turning that into medical advice.
 */
export async function searchServices(f: {
  query?: string;
  speciality?: string;
  kind?: string;
  maxPriceCents?: number;
  limit?: number;
}): Promise<ServiceCard[]> {
  const limit = Math.min(f.limit ?? 6, 12);
  const where = serviceConditions(f);
  const query = f.query?.trim();

  if (!query) {
    return db
      .select(cardColumns)
      .from(services)
      .innerJoin(specialities, eq(specialities.slug, services.specialitySlug))
      .where(where)
      .orderBy(asc(services.position))
      .limit(limit);
  }

  const vector = JSON.stringify(await embedQuery(query));
  const filterSql = where ? sql`and ${where}` : sql``;
  const rows = await db.execute<{ slug: string }>(sql`
    with text_hits as (
      select slug, row_number() over (
        order by ts_rank_cd(search_vector, websearch_to_tsquery('italian', ${query})) desc
      ) as r
      from services
      where search_vector @@ websearch_to_tsquery('italian', ${query}) ${filterSql}
      limit 30
    ),
    vector_hits as (
      select slug, row_number() over (order by embedding <=> ${vector}::vector) as r,
        1 - (embedding <=> ${vector}::vector) as similarity
      from services
      where embedding is not null ${filterSql}
      order by embedding <=> ${vector}::vector
      limit 30
    ),
    fused as (
      select coalesce(t.slug, v.slug) as slug,
        coalesce(1.0 / (60 + t.r), 0) + coalesce(1.0 / (60 + v.r), 0) as score,
        t.slug is not null as text_match,
        coalesce(v.similarity, 0) as similarity
      from text_hits t full outer join vector_hits v on t.slug = v.slug
    )
    select slug from fused
    where text_match or similarity > 0.8
    order by score desc
    limit ${limit}
  `);

  const slugs = rows.map((r) => r.slug);
  if (!slugs.length) return [];
  const found = await db
    .select(cardColumns)
    .from(services)
    .innerJoin(specialities, eq(specialities.slug, services.specialitySlug))
    .where(inArray(services.slug, slugs));
  const bySlug = new Map(found.map((s) => [s.slug, s]));
  return slugs.map((s) => bySlug.get(s)).filter((s): s is ServiceCard => Boolean(s));
}

export type InfoHit = { docSlug: string; docTitle: string; section: string; content: string; score: number };

/** Same retrieval over the informative pages: orari, referti, pagamenti, parcheggio, privacy. */
export async function searchInfo(question: string, limit = 4): Promise<InfoHit[]> {
  const q = question.trim().slice(0, 300);
  if (!q) return [];
  const vector = JSON.stringify(await embedQuery(q));
  const rows = await db.execute<InfoHit>(sql`
    with text_hits as (
      select id, row_number() over (
        order by ts_rank_cd(search_vector, websearch_to_tsquery('italian', ${q})) desc
      ) as r
      from info_chunks
      where search_vector @@ websearch_to_tsquery('italian', ${q})
      limit 20
    ),
    vector_hits as (
      select id, row_number() over (order by embedding <=> ${vector}::vector) as r
      from info_chunks
      order by embedding <=> ${vector}::vector
      limit 20
    )
    select c.doc_slug as "docSlug", c.doc_title as "docTitle", c.section, c.content,
      (coalesce(1.0 / (60 + t.r), 0) + coalesce(1.0 / (60 + v.r), 0))::float as score
    from text_hits t full outer join vector_hits v on t.id = v.id
    join info_chunks c on c.id = coalesce(t.id, v.id)
    order by score desc
    limit ${limit}
  `);
  return [...rows];
}

export function listInfoDocs() {
  return db
    .select({
      docSlug: infoChunks.docSlug,
      docTitle: infoChunks.docTitle,
      section: infoChunks.section,
      content: infoChunks.content,
      position: infoChunks.position,
    })
    .from(infoChunks)
    .orderBy(asc(infoChunks.docSlug), asc(infoChunks.position));
}
