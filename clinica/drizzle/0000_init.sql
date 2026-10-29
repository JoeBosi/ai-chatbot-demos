CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"patient_name" text NOT NULL,
	"patient_email" text NOT NULL,
	"patient_phone" text NOT NULL,
	"service_slug" text NOT NULL,
	"doctor_slug" text NOT NULL,
	"room_slug" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'confermata' NOT NULL,
	"note" text,
	"is_demo" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tool_call_id" text,
	CONSTRAINT "appointments_code_unique" UNIQUE("code"),
	CONSTRAINT "appointments_tool_call_id_unique" UNIQUE("tool_call_id")
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"messages" jsonb NOT NULL,
	"model" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "closures" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_slug" text,
	"from_date" text NOT NULL,
	"to_date" text NOT NULL,
	"reason" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_specialities" (
	"doctor_slug" text NOT NULL,
	"speciality_slug" text NOT NULL,
	CONSTRAINT "doctor_specialities_doctor_slug_speciality_slug_pk" PRIMARY KEY("doctor_slug","speciality_slug")
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio" text NOT NULL,
	"languages" text[] NOT NULL,
	"register" text NOT NULL,
	"color" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "info_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"doc_slug" text NOT NULL,
	"doc_title" text NOT NULL,
	"section" text NOT NULL,
	"content" text NOT NULL,
	"position" integer NOT NULL,
	"embedding" vector(384),
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('italian', coalesce(doc_title, '') || ' ' || coalesce(section, '')), 'A') || setweight(to_tsvector('italian', coalesce(content, '')), 'B')) STORED
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"floor" integer NOT NULL,
	"wing" text NOT NULL,
	"directions" text NOT NULL,
	"accessible" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_doctors" (
	"service_slug" text NOT NULL,
	"doctor_slug" text NOT NULL,
	CONSTRAINT "service_doctors_service_slug_doctor_slug_pk" PRIMARY KEY("service_slug","doctor_slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"speciality_slug" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"kind" text NOT NULL,
	"description" text NOT NULL,
	"preparation" text NOT NULL,
	"report_days" integer NOT NULL,
	"referral_needed" integer DEFAULT 0 NOT NULL,
	"tags" text[] NOT NULL,
	"tags_text" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"embedding" vector(384),
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('italian', coalesce(name, '')), 'A') || setweight(to_tsvector('italian', coalesce(tags_text, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '') || ' ' || coalesce(preparation, '')), 'C')) STORED
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_slug" text NOT NULL,
	"weekday" integer NOT NULL,
	"start_min" integer NOT NULL,
	"end_min" integer NOT NULL,
	"room_slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialities" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] NOT NULL,
	"tags_text" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"embedding" vector(384),
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('italian', coalesce(name, '')), 'A') || setweight(to_tsvector('italian', coalesce(summary, '') || ' ' || coalesce(tags_text, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '')), 'C')) STORED
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_slug_services_slug_fk" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_slug_doctors_slug_fk" FOREIGN KEY ("doctor_slug") REFERENCES "public"."doctors"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_room_slug_rooms_slug_fk" FOREIGN KEY ("room_slug") REFERENCES "public"."rooms"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "closures" ADD CONSTRAINT "closures_doctor_slug_doctors_slug_fk" FOREIGN KEY ("doctor_slug") REFERENCES "public"."doctors"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_doctor_slug_doctors_slug_fk" FOREIGN KEY ("doctor_slug") REFERENCES "public"."doctors"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_speciality_slug_specialities_slug_fk" FOREIGN KEY ("speciality_slug") REFERENCES "public"."specialities"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_doctors" ADD CONSTRAINT "service_doctors_service_slug_services_slug_fk" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_doctors" ADD CONSTRAINT "service_doctors_doctor_slug_doctors_slug_fk" FOREIGN KEY ("doctor_slug") REFERENCES "public"."doctors"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_speciality_slug_specialities_slug_fk" FOREIGN KEY ("speciality_slug") REFERENCES "public"."specialities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_doctor_slug_doctors_slug_fk" FOREIGN KEY ("doctor_slug") REFERENCES "public"."doctors"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_room_slug_rooms_slug_fk" FOREIGN KEY ("room_slug") REFERENCES "public"."rooms"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointments_email_idx" ON "appointments" USING btree ("patient_email");--> statement-breakpoint
CREATE INDEX "appointments_starts_idx" ON "appointments" USING btree ("starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_doctor_slot_idx" ON "appointments" USING btree ("doctor_slug","starts_at") WHERE status = 'confermata';--> statement-breakpoint
CREATE INDEX "info_chunks_search_idx" ON "info_chunks" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "info_chunks_embedding_idx" ON "info_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "services_search_idx" ON "services" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "services_embedding_idx" ON "services" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "services_speciality_idx" ON "services" USING btree ("speciality_slug");--> statement-breakpoint
CREATE INDEX "shifts_doctor_idx" ON "shifts" USING btree ("doctor_slug");--> statement-breakpoint
CREATE INDEX "shifts_weekday_idx" ON "shifts" USING btree ("weekday");--> statement-breakpoint
CREATE INDEX "specialities_search_idx" ON "specialities" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "specialities_embedding_idx" ON "specialities" USING hnsw ("embedding" vector_cosine_ops);