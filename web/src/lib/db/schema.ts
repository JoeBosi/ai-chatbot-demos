import { sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

// Local multilingual-e5-small embeddings (see src/lib/embeddings.ts).
export const EMBEDDING_DIMENSIONS = 384;

const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

export const categories = pgTable("categories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull().default(0),
});

export type ProductSpecs = Record<string, string>;

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    categorySlug: text("category_slug")
      .notNull()
      .references(() => categories.slug),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    stock: integer("stock").notNull(),
    rating: real("rating").notNull(),
    reviewsCount: integer("reviews_count").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    specs: jsonb("specs").$type<ProductSpecs>().notNull(),
    tags: text("tags").array().notNull(),
    art: text("art").notNull(),
    color: text("color").notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('italian', coalesce(name, '') || ' ' || coalesce(brand, '')), 'A') || setweight(to_tsvector('italian', coalesce(summary, '')), 'B') || setweight(to_tsvector('italian', coalesce(description, '')), 'C')`,
    ),
  },
  (t) => [
    index("products_category_idx").on(t.categorySlug),
    index("products_search_idx").using("gin", t.searchVector),
    index("products_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const kbChunks = pgTable(
  "kb_chunks",
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
    index("kb_chunks_search_idx").using("gin", t.searchVector),
    index("kb_chunks_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.cartId, t.productId] })],
);

export type OrderStatus = "ricevuto" | "in_preparazione" | "spedito" | "in_consegna" | "consegnato" | "annullato";

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  priceCents: number;
};

export type OrderEvent = {
  at: string;
  status: OrderStatus;
  note: string;
};

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    number: text("number").notNull().unique(),
    email: text("email").notNull(),
    customerName: text("customer_name").notNull(),
    city: text("city").notNull(),
    status: text("status").$type<OrderStatus>().notNull(),
    items: jsonb("items").$type<OrderItem[]>().notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    carrier: text("carrier"),
    trackingCode: text("tracking_code"),
    estimatedDelivery: text("estimated_delivery"),
    events: jsonb("events").$type<OrderEvent[]>().notNull(),
    isDemo: integer("is_demo").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_email_idx").on(t.email)],
);

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  orderNumber: text("order_number"),
  // The approved tool call that created the ticket: replaying the same approval must not create another.
  toolCallId: text("tool_call_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  messages: jsonb("messages").notNull(),
  model: text("model"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
