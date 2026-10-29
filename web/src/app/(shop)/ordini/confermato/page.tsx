import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AskChip } from "@/components/assistant/ask";
import { OrderDetails } from "@/components/shop/order-details";
import { Button } from "@/components/ui/button";
import { findOrder } from "@/lib/orders";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = { ...pageMeta("/ordini/confermato", {
  title: "Ordine confermato",
  description:
    "Riepilogo di un ordine di prova nel negozio dimostrativo.",
}), robots: { index: false } };

export default async function OrderConfirmedPage({ searchParams }: PageProps<"/ordini/confermato">) {
  const params = await searchParams;
  const numero = typeof params.numero === "string" ? params.numero : "";
  const email = typeof params.email === "string" ? params.email : "";
  const order = numero && email ? await findOrder(numero, email) : null;
  if (!order) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-5xl leading-tight">Grazie, ordine ricevuto</h1>
        <p className="text-muted-foreground mt-3">
          È un ordine di prova: nessun addebito e nessuna spedizione. Puoi usarlo per provare l&apos;assistente.
        </p>
        <div className="mt-6 flex flex-col items-start gap-3">
          <AskChip question={`Dov'è il mio ordine ${order.number}? La mail è ${email}`} label="Chiedi al Barista lo stato dell'ordine" />
          <AskChip question={`Vorrei annullare l'ordine ${order.number}, come faccio?`} label="Chiedi come annullarlo" />
          <Button asChild variant="link" className="px-0">
            <Link href="/prodotti">Continua a sfogliare</Link>
          </Button>
        </div>
      </div>
      <OrderDetails order={order} />
    </div>
  );
}
