import type { OrderEvent, OrderStatus } from "@/lib/db/schema";

// Orders visitors can look up to try the assistant. They are listed on /ordini.
export type DemoOrder = {
  number: string;
  email: string;
  customerName: string;
  city: string;
  status: OrderStatus;
  items: { slug: string; quantity: number }[];
  carrier?: string;
  trackingCode?: string;
  // days relative to the seed date, so the timeline always looks recent
  createdDaysAgo: number;
  estimatedDeliveryInDays?: number;
  events: { daysAgo: number; hour: number; status: OrderStatus; note: string }[];
};

export const DEMO_EMAIL = "demo@cremaeferro.it";

export const demoOrders: DemoOrder[] = [
  {
    number: "CF-10482",
    email: DEMO_EMAIL,
    customerName: "Giulia Demo",
    city: "Bologna",
    status: "spedito",
    items: [
      { slug: "vapora-classica", quantity: 1 },
      { slug: "macinaverde-micro", quantity: 1 },
      { slug: "miscela-banco", quantity: 1 },
    ],
    carrier: "Corriere Espresso",
    trackingCode: "CE7741902IT",
    createdDaysAgo: 2,
    estimatedDeliveryInDays: 1,
    events: [
      { daysAgo: 2, hour: 10, status: "ricevuto", note: "Ordine ricevuto e pagamento confermato" },
      { daysAgo: 2, hour: 15, status: "in_preparazione", note: "Il magazzino sta preparando il pacco" },
      { daysAgo: 1, hour: 11, status: "spedito", note: "Ritirato dal corriere a Parma" },
    ],
  },
  {
    number: "CF-10477",
    email: DEMO_EMAIL,
    customerName: "Giulia Demo",
    city: "Bologna",
    status: "consegnato",
    items: [
      { slug: "etiopia-guji", quantity: 2 },
      { slug: "dripper-ceramica", quantity: 1 },
    ],
    carrier: "Corriere Espresso",
    trackingCode: "CE7738115IT",
    createdDaysAgo: 12,
    events: [
      { daysAgo: 12, hour: 9, status: "ricevuto", note: "Ordine ricevuto e pagamento confermato" },
      { daysAgo: 11, hour: 8, status: "in_preparazione", note: "In attesa della tostatura del giovedì" },
      { daysAgo: 10, hour: 16, status: "spedito", note: "Ritirato dal corriere a Parma" },
      { daysAgo: 9, hour: 8, status: "in_consegna", note: "In consegna a Bologna" },
      { daysAgo: 9, hour: 12, status: "consegnato", note: "Consegnato, firmato da G. Demo" },
    ],
  },
  {
    number: "CF-10490",
    email: DEMO_EMAIL,
    customerName: "Giulia Demo",
    city: "Bologna",
    status: "in_preparazione",
    items: [
      { slug: "brenta-duo", quantity: 1 },
      { slug: "pressino-58", quantity: 1 },
    ],
    createdDaysAgo: 0,
    estimatedDeliveryInDays: 2,
    events: [
      { daysAgo: 0, hour: 9, status: "ricevuto", note: "Ordine ricevuto e pagamento confermato" },
      { daysAgo: 0, hour: 11, status: "in_preparazione", note: "Il magazzino sta preparando il pacco" },
    ],
  },
  {
    number: "CF-10455",
    email: "marco.demo@example.com",
    customerName: "Marco Demo",
    city: "Palermo",
    status: "in_consegna",
    items: [{ slug: "moka-inox-6", quantity: 1 }],
    carrier: "Corriere Espresso",
    trackingCode: "CE7729930IT",
    createdDaysAgo: 3,
    estimatedDeliveryInDays: 0,
    events: [
      { daysAgo: 3, hour: 17, status: "ricevuto", note: "Ordine ricevuto e pagamento confermato" },
      { daysAgo: 2, hour: 10, status: "spedito", note: "Ritirato dal corriere a Parma" },
      { daysAgo: 0, hour: 7, status: "in_consegna", note: "In consegna a Palermo" },
    ],
  },
  {
    number: "CF-10431",
    email: DEMO_EMAIL,
    customerName: "Giulia Demo",
    city: "Bologna",
    status: "annullato",
    items: [{ slug: "nordica-automatica", quantity: 1 }],
    createdDaysAgo: 20,
    events: [
      { daysAgo: 20, hour: 14, status: "ricevuto", note: "Ordine ricevuto, in attesa del bonifico" },
      { daysAgo: 13, hour: 14, status: "annullato", note: "Annullato: bonifico non ricevuto entro 7 giorni" },
    ],
  },
];

export function eventsFor(order: DemoOrder, now: Date): OrderEvent[] {
  return order.events.map((e) => {
    const at = new Date(now);
    at.setDate(at.getDate() - e.daysAgo);
    at.setHours(e.hour, 0, 0, 0);
    // events of "today" must never be in the future
    if (at > now) at.setTime(now.getTime() - (order.events.length - order.events.indexOf(e)) * 20 * 60 * 1000);
    return { at: at.toISOString(), status: e.status, note: e.note };
  });
}
