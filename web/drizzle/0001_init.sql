CREATE TABLE "cart_items" (
	"cart_id" uuid NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_cart_id_product_id_pk" PRIMARY KEY("cart_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
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
CREATE TABLE "kb_chunks" (
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
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"email" text NOT NULL,
	"customer_name" text NOT NULL,
	"city" text NOT NULL,
	"status" text NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal_cents" integer NOT NULL,
	"shipping_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"carrier" text,
	"tracking_code" text,
	"estimated_delivery" text,
	"events" jsonb NOT NULL,
	"is_demo" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"category_slug" text NOT NULL,
	"price_cents" integer NOT NULL,
	"compare_at_cents" integer,
	"stock" integer NOT NULL,
	"rating" real NOT NULL,
	"reviews_count" integer NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"specs" jsonb NOT NULL,
	"tags" text[] NOT NULL,
	"art" text NOT NULL,
	"color" text NOT NULL,
	"embedding" vector(384),
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('italian', coalesce(name, '') || ' ' || coalesce(brand, '')), 'A') || setweight(to_tsvector('italian', coalesce(summary, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '')), 'C')) STORED,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"topic" text NOT NULL,
	"message" text NOT NULL,
	"order_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kb_chunks_search_idx" ON "kb_chunks" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "kb_chunks_embedding_idx" ON "kb_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "products_search_idx" ON "products" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "products_embedding_idx" ON "products" USING hnsw ("embedding" vector_cosine_ops);