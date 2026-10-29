import "server-only";

import { tool, type InferUITools, type UIMessage } from "ai";
import { z } from "zod";

import { getCart, CartError, setQuantity } from "@/lib/cart";
import { getProduct, getProductsBySlugs, searchProducts } from "@/lib/catalog";
import { searchHelp } from "@/lib/help";
import { createTicket, findOrder } from "@/lib/orders";

const categorySlugs = ["macchine-espresso", "macinacaffe", "caffe", "moka-e-filtro", "accessori"] as const;

// Small free models sometimes send numbers as strings or empty strings for
// optional fields; normalise instead of failing the whole step.
const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null ? undefined : typeof v === "string" ? Number(v.replace(",", ".")) : v),
  z.number().positive().optional(),
);
const optionalString = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().max(200).optional());

export const tools = {
  searchProducts: tool({
    description:
      "Cerca prodotti nel catalogo per testo libero (es. 'macchina espresso per cappuccino', 'caffè fruttato per filtro') e/o filtri. Restituisce fino a 6 prodotti con prezzo in euro e disponibilità.",
    inputSchema: z.object({
      query: optionalString.describe("Cosa cerca il cliente, in parole sue"),
      category: z.preprocess((v) => (v === "" ? undefined : v), z.enum(categorySlugs).optional()),
      maxPrice: optionalNumber.describe("Prezzo massimo in euro"),
      minPrice: optionalNumber.describe("Prezzo minimo in euro"),
      sort: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["relevance", "price_asc", "price_desc", "rating"]).optional()),
    }),
    execute: async ({ query, category, maxPrice, minPrice, sort }) => {
      const results = await searchProducts({
        query,
        category,
        maxPriceCents: maxPrice ? Math.round(maxPrice * 100) : undefined,
        minPriceCents: minPrice ? Math.round(minPrice * 100) : undefined,
        sort,
        limit: 6,
      });
      return {
        count: results.length,
        products: results.map((p) => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          category: p.categorySlug,
          priceEuro: p.priceCents / 100,
          compareAtEuro: p.compareAtCents ? p.compareAtCents / 100 : null,
          inStock: p.stock > 0,
          rating: p.rating,
          reviews: p.reviewsCount,
          summary: p.summary,
          art: p.art,
          color: p.color,
        })),
      };
    },
  }),

  getProduct: tool({
    description: "Dettagli completi di un prodotto: descrizione, scheda tecnica, prezzo, disponibilità. Usa lo slug restituito da searchProducts.",
    inputSchema: z.object({ slug: z.string().min(1).max(80) }),
    execute: async ({ slug }) => {
      const p = await getProduct(slug.trim().toLowerCase());
      if (!p) return { found: false as const, message: `Nessun prodotto con slug "${slug}". Usa searchProducts per trovarlo.` };
      return {
        found: true as const,
        product: {
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          category: p.categorySlug,
          priceEuro: p.priceCents / 100,
          compareAtEuro: p.compareAtCents ? p.compareAtCents / 100 : null,
          stock: p.stock,
          rating: p.rating,
          reviews: p.reviewsCount,
          summary: p.summary,
          description: p.description,
          specs: p.specs,
          art: p.art,
          color: p.color,
        },
      };
    },
  }),

  compareProducts: tool({
    description: "Confronta da 2 a 3 prodotti affiancando prezzo e scheda tecnica. Usa gli slug dei prodotti.",
    inputSchema: z.object({ slugs: z.array(z.string().min(1).max(80)).min(2).max(3) }),
    execute: async ({ slugs }) => {
      const found = await getProductsBySlugs(slugs.map((s) => s.trim().toLowerCase()));
      return {
        products: found.map((p) => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          priceEuro: p.priceCents / 100,
          inStock: p.stock > 0,
          rating: p.rating,
          summary: p.summary,
          specs: p.specs,
          art: p.art,
          color: p.color,
        })),
        missing: slugs.filter((s) => !found.some((p) => p.slug === s.trim().toLowerCase())),
      };
    },
  }),

  addToCart: tool({
    description: "Aggiunge un prodotto al carrello del cliente. Usalo solo se il cliente chiede di aggiungerlo o di comprarlo.",
    inputSchema: z.object({
      slug: z.string().min(1).max(80),
      quantity: z.preprocess((v) => (v === undefined || v === "" ? 1 : Number(v)), z.number().int().min(1).max(10)),
    }),
    execute: async ({ slug, quantity }) => {
      try {
        const { product, quantity: inCart, cart } = await setQuantity(slug.trim().toLowerCase(), quantity, "add");
        return {
          ok: true as const,
          added: { slug: product.slug, name: product.name, quantity, inCart, art: product.art, color: product.color },
          cart: { itemCount: cart.itemCount, subtotalEuro: cart.subtotalCents / 100, shippingEuro: cart.shippingCents / 100 },
        };
      } catch (err) {
        if (err instanceof CartError) return { ok: false as const, message: err.message };
        throw err;
      }
    },
  }),

  getCart: tool({
    description: "Mostra il contenuto attuale del carrello del cliente con totali e spese di spedizione.",
    inputSchema: z.object({}),
    execute: async () => {
      const cart = await getCart();
      return {
        itemCount: cart.itemCount,
        lines: cart.lines.map((l) => ({ slug: l.slug, name: l.name, quantity: l.quantity, priceEuro: l.priceCents / 100 })),
        subtotalEuro: cart.subtotalCents / 100,
        shippingEuro: cart.shippingCents / 100,
        totalEuro: cart.totalCents / 100,
        freeShippingFromEuro: 49,
      };
    },
  }),

  trackOrder: tool({
    description: "Stato e tracciamento di un ordine. Servono il numero d'ordine (es. CF-10482) e l'email usata per l'acquisto.",
    inputSchema: z.object({
      orderNumber: z.string().min(3).max(20),
      email: z.string().email().max(120),
    }),
    execute: async ({ orderNumber, email }) => {
      const order = await findOrder(orderNumber, email);
      if (!order) {
        return {
          found: false as const,
          message: "Nessun ordine corrisponde a questo numero ed email. Chiedi al cliente di ricontrollarli.",
        };
      }
      return { found: true as const, order };
    },
  }),

  searchHelp: tool({
    description:
      "Cerca nel centro assistenza del negozio: spedizioni, resi e rimborsi, garanzia, pagamenti, modifica o annullo ordini, guide (scelta macchina, macinatura, conservazione, manutenzione), corsi e contatti.",
    inputSchema: z.object({ question: z.string().min(2).max(300) }),
    execute: async ({ question }) => {
      const hits = await searchHelp(question, 4);
      return {
        results: hits.map((h) => ({
          title: h.docTitle,
          section: h.section,
          content: h.content,
          url: `/assistenza#${h.docSlug}`,
        })),
      };
    },
  }),

  createSupportTicket: tool({
    description:
      "Apre una richiesta di assistenza per un operatore umano. Chiedi prima al cliente nome, email, argomento e descrizione. Il cliente vedrà un riepilogo da confermare.",
    inputSchema: z.object({
      name: z.string().min(2).max(80),
      email: z.string().email().max(120),
      topic: z.enum(["ordine", "reso", "guasto", "prodotto", "altro"]),
      message: z.string().min(10).max(1500),
      orderNumber: optionalString,
    }),
    execute: async (input, { toolCallId }) => {
      const ticket = await createTicket({ ...input, toolCallId });
      return { ticketNumber: ticket.number, replyWithin: "1 giorno lavorativo", email: ticket.email };
    },
  }),
};

export type ShopTools = InferUITools<typeof tools>;
export type ShopUIMessage = UIMessage<{ model?: string }, never, ShopTools>;
