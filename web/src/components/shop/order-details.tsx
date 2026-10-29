import { formatDateTime, formatPrice, orderStatusLabel } from "@/lib/format";
import type { PublicOrder } from "@/lib/orders";

export function OrderDetails({ order }: { order: PublicOrder }) {
  return (
    <article className="rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-3xl">Ordine {order.number}</h2>
        <p className="bg-enamel-soft text-enamel-deep rounded-full px-3 py-1 text-sm font-medium">{orderStatusLabel[order.status]}</p>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        {order.customerFirstName}, consegna a {order.city}
        {order.estimatedDelivery && order.status !== "consegnato" && order.status !== "annullato"
          ? ` · prevista il ${new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long" }).format(new Date(order.estimatedDelivery))}`
          : ""}
      </p>
      <ol className="mt-6 space-y-4 border-l-2 pl-5">
        {order.events
          .slice()
          .reverse()
          .map((e) => (
            <li key={e.at + e.status} className="relative">
              <span className="bg-enamel absolute top-1.5 -left-[27px] size-3 rounded-full" aria-hidden />
              <p className="font-medium">{orderStatusLabel[e.status]}</p>
              <p className="text-muted-foreground text-sm">
                {formatDateTime(e.at)} — {e.note}
              </p>
            </li>
          ))}
      </ol>
      {order.trackingCode && (
        <p className="mt-6 text-sm">
          {order.carrier}, tracciamento <span className="font-mono">{order.trackingCode}</span>
        </p>
      )}
      <ul className="mt-6 divide-y border-y text-sm">
        {order.items.map((i) => (
          <li key={i.name} className="flex justify-between py-2">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span className="tabular-nums">{formatPrice(i.priceCents * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between font-semibold">
        <span>Totale</span>
        <span className="price">{formatPrice(order.totalCents)}</span>
      </p>
    </article>
  );
}
