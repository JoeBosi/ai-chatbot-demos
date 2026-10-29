import { sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

// Local multilingual-e5-small embeddings (see src/lib/embeddings.ts).
export const EMBEDDING_DIMENSIONS = 384;

const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

export const specialities = pgTable(
  "specialities",
  {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    tags: text("tags").array().notNull(),
    // I tag ripetuti come testo: una colonna generata può usare solo funzioni immutabili, e
    // array_to_string non lo è. Lo scrive il codice che popola/aggiorna la riga.
    tagsText: text("tags_text").notNull().default(""),
    position: integer("position").notNull().default(0),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('italian', coalesce(name, '')), 'A') || setweight(to_tsvector('italian', coalesce(summary, '') || ' ' || coalesce(tags_text, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '')), 'C')`,
    ),
  },
  (t) => [
    index("specialities_search_idx").using("gin", t.searchVector),
    index("specialities_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const doctors = pgTable("doctors", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  languages: text("languages").array().notNull(),
  register: text("register").notNull(),
  color: text("color").notNull(),
  position: integer("position").notNull().default(0),
});

/** A doctor can cover more than one speciality, and a speciality has several doctors. */
export const doctorSpecialities = pgTable(
  "doctor_specialities",
  {
    doctorSlug: text("doctor_slug")
      .notNull()
      .references(() => doctors.slug, { onDelete: "cascade" }),
    specialitySlug: text("speciality_slug")
      .notNull()
      .references(() => specialities.slug, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.doctorSlug, t.specialitySlug] })],
);

export const rooms = pgTable("rooms", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  floor: integer("floor").notNull(),
  wing: text("wing").notNull(),
  directions: text("directions").notNull(),
  accessible: integer("accessible").notNull().default(1),
});

export type ServiceKind = "visita" | "esame" | "analisi" | "certificato" | "terapia";

export const services = pgTable(
  "services",
  {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    specialitySlug: text("speciality_slug")
      .notNull()
      .references(() => specialities.slug),
    durationMinutes: integer("duration_minutes").notNull(),
    priceCents: integer("price_cents").notNull(),
    kind: text("kind").$type<ServiceKind>().notNull(),
    description: text("description").notNull(),
    preparation: text("preparation").notNull(),
    reportDays: integer("report_days").notNull(),
    referralNeeded: integer("referral_needed").notNull().default(0),
    tags: text("tags").array().notNull(),
    tagsText: text("tags_text").notNull().default(""),
    position: integer("position").notNull().default(0),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('italian', coalesce(name, '')), 'A') || setweight(to_tsvector('italian', coalesce(tags_text, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '') || ' ' || coalesce(preparation, '')), 'C')`,
    ),
  },
  (t) => [
    index("services_search_idx").using("gin", t.searchVector),
    index("services_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
    index("services_speciality_idx").on(t.specialitySlug),
  ],
);

/** Who performs a service. Availability is computed from the shifts of these doctors only. */
export const serviceDoctors = pgTable(
  "service_doctors",
  {
    serviceSlug: text("service_slug")
      .notNull()
      .references(() => services.slug, { onDelete: "cascade" }),
    doctorSlug: text("doctor_slug")
      .notNull()
      .references(() => doctors.slug, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.serviceSlug, t.doctorSlug] })],
);

/** Recurring weekly shift: this doctor, on this weekday, in this room, from `startMin` to `endMin`. */
export const shifts = pgTable(
  "shifts",
  {
    id: serial("id").primaryKey(),
    doctorSlug: text("doctor_slug")
      .notNull()
      .references(() => doctors.slug, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    startMin: integer("start_min").notNull(),
    endMin: integer("end_min").notNull(),
    roomSlug: text("room_slug")
      .notNull()
      .references(() => rooms.slug),
  },
  (t) => [index("shifts_doctor_idx").on(t.doctorSlug), index("shifts_weekday_idx").on(t.weekday)],
);

/** Closures: a doctor's leave, or the whole clinic when `doctorSlug` is null. Dates are inclusive. */
export const closures = pgTable("closures", {
  id: serial("id").primaryKey(),
  doctorSlug: text("doctor_slug").references(() => doctors.slug, { onDelete: "cascade" }),
  fromDate: text("from_date").notNull(),
  toDate: text("to_date").notNull(),
  reason: text("reason").notNull(),
});

export type AppointmentStatus = "confermata" | "disdetta";

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    /** Shown to the patient: "PR-20481". The only thing they need to find it again. */
    code: text("code").notNull().unique(),
    patientName: text("patient_name").notNull(),
    patientEmail: text("patient_email").notNull(),
    patientPhone: text("patient_phone").notNull(),
    serviceSlug: text("service_slug")
      .notNull()
      .references(() => services.slug),
    doctorSlug: text("doctor_slug")
      .notNull()
      .references(() => doctors.slug),
    roomSlug: text("room_slug")
      .notNull()
      .references(() => rooms.slug),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: text("status").$type<AppointmentStatus>().notNull().default("confermata"),
    note: text("note"),
    isDemo: integer("is_demo").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    /** Set when the assistant booked it, so a tool retry cannot create a second appointment. */
    toolCallId: text("tool_call_id").unique(),
  },
  (t) => [
    index("appointments_email_idx").on(t.patientEmail),
    index("appointments_starts_idx").on(t.startsAt),
    // One doctor cannot be in two places at once: this is what makes two people clicking the same
    // slot resolve into one booking and one honest "quell'orario è stato appena preso".
    uniqueIndex("appointments_doctor_slot_idx")
      .on(t.doctorSlug, t.startsAt)
      .where(sql`status = 'confermata'`),
  ],
);

/** Informative pages, split into "## " sections: the assistant searches these, never invents them. */
export const infoChunks = pgTable(
  "info_chunks",
  {
    id: serial("id").primaryKey(),
    docSlug: text("doc_slug").notNull(),
    docTitle: text("doc_title").notNull(),
    section: text("section").notNull(),
    content: text("content").notNull(),
    position: integer("position").notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('italian', coalesce(doc_title, '') || ' ' || coalesce(section, '')), 'A') || setweight(to_tsvector('italian', coalesce(content, '')), 'B')`,
    ),
  },
  (t) => [
    index("info_chunks_search_idx").using("gin", t.searchVector),
    index("info_chunks_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  messages: jsonb("messages").notNull(),
  model: text("model"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
