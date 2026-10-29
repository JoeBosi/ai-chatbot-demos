import type { Metadata } from "next";

import { AskChip } from "@/components/assistant/ask";
import { OrderDetails } from "@/components/shop/order-details";
import { Button } from "@/components/ui/button";
import { DEMO_EMAIL, demoOrders } from "@/data/demo-orders";
import { findOrder } from "@/lib/orders";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/ordini", {
  title: "Stato dell'ordine",
  description:
    "Controllare lo stato di un ordine di prova con il numero e l'email, anche chiedendolo all'assistente.",
});

export default async function OrdersPage({ searchParams }: PageProps<"/ordini">) {
  const params = await searchParams;
  const numero = typeof params.numero === "string" ? params.numero.slice(0, 20) : "";
  const email = typeof params.email === "string" ? params.email.slice(0, 120) : "";
  const searched = Boolean(numero && email);
  const order = searched ? await findOrder(numero, email) : null;
  const field = "mt-1 w-full rounded-md border bg-white px-3 py-2 text-base outline-none focus:border-enamel";

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-5xl">Dov&apos;è il mio ordine?</h1>
        <p className="text-muted-foreground mt-3">Inserisci il numero d&apos;ordine e l&apos;email usata per l&apos;acquisto, oppure chiedilo al Barista.</p>
        <form method="get" className="mt-6 space-y-3">
          <label className="block text-sm">
            Numero d&apos;ordine
            <input name="numero" required defaultValue={numero} placeholder="CF-10482" className={field} />
          </label>
          <label className="block text-sm">
            Email
            <input name="email" type="email" required defaultValue={email} placeholder={DEMO_EMAIL} className={field} />
          </label>
          <Button type="submit" size="lg">
            Cerca l&apos;ordine
          </Button>
        </form>
        <div className="bg-enamel-soft mt-8 rounded-xl p-5 text-sm">
          <p className="font-semibold">Ordini di prova</p>
          <p className="text-muted-foreground mt-1">Email: {DEMO_EMAIL}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {demoOrders
              .filter((o) => o.email === DEMO_EMAIL)
              .map((o) => (
                <li key={o.number}>
                  <AskChip question={`Dov'è il mio ordine ${o.number}? La mail è ${DEMO_EMAIL}`} label={o.number} className="bg-white" />
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div>
        {searched && !order && (
          <p role="alert" className="rounded-xl border bg-white p-6">
            Nessun ordine corrisponde a questo numero ed email. Controlla di aver usato la stessa email dell&apos;acquisto.
          </p>
        )}
        {order && <OrderDetails order={order} />}
      </div>
    </div>
  );
}
