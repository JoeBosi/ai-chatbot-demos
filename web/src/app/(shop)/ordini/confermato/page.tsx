import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AskChip } from "@/components/assistant/ask";
import { OrderDetails } from "@/components/shop/order-details";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n-server";
import { findOrder } from "@/lib/orders";
import { metaFor } from "@/lib/seo";

const meta = metaFor("/ordini/confermato", {
  it: {
    title: "Ordine confermato",
    description:
      "Riepilogo di un ordine di prova nel negozio dimostrativo.",
  },
  en: {
    title: "Order confirmed",
    description:
      "Summary of a test order in the demo shop.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await meta()), robots: { index: false } };
}

export default async function OrderConfirmedPage({ searchParams }: PageProps<"/ordini/confermato">) {
  const params = await searchParams;
  const numero = typeof params.numero === "string" ? params.numero : "";
  const email = typeof params.email === "string" ? params.email : "";
  const [order, { t, href, lang }] = await Promise.all([numero && email ? findOrder(numero, email) : null, getI18n()]);
  if (!order) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-5xl leading-tight">{t("Grazie, ordine ricevuto", "Thank you, order received")}</h1>
        <p className="text-muted-foreground mt-3">
          {t(
            "È un ordine di prova: nessun addebito e nessuna spedizione. Puoi usarlo per provare l'assistente.",
            "It is a test order: no charge and no shipment. You can use it to try the assistant.",
          )}
        </p>
        <div className="mt-6 flex flex-col items-start gap-3">
          <AskChip
            question={t(`Dov'è il mio ordine ${order.number}? La mail è ${email}`, `Where is my order ${order.number}? The email is ${email}`)}
            label={t("Chiedi al Barista lo stato dell'ordine", "Ask the Barista about the order status")}
          />
          <AskChip
            question={t(`Vorrei annullare l'ordine ${order.number}, come faccio?`, `I would like to cancel order ${order.number}, how do I do it?`)}
            label={t("Chiedi come annullarlo", "Ask how to cancel it")}
          />
          <Button asChild variant="link" className="px-0">
            <Link href={href("/prodotti")}>{t("Continua a sfogliare", "Keep browsing")}</Link>
          </Button>
        </div>
      </div>
      <OrderDetails order={order} lang={lang} />
    </div>
  );
}
