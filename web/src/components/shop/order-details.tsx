import { products } from "@/data/catalog";
import { productsEn } from "@/data/en/catalog";
import { orderNoteEn } from "@/data/en/orders";
import { formatDateTime, formatPrice, orderStatusLabel, orderStatusLabelEn } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import type { PublicOrder } from "@/lib/orders";

// Orders keep the Italian product name; the English page shows the English one when there is one.
const nameEn = Object.fromEntries(products.map((p) => [p.name, productsEn[p.slug]?.name ?? p.name]));

export function OrderDetails({ order, lang = "it" }: { order: PublicOrder; lang?: Lang }) {
  const en = lang === "en";
  const status = en ? orderStatusLabelEn : orderStatusLabel;
  return (
    <article className="rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-3xl">
          {en ? "Order" : "Ordine"} {order.number}
        </h2>
        <p className="bg-enamel-soft text-enamel-deep rounded-full px-3 py-1 text-sm font-medium">{status[order.status]}</p>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        {order.customerFirstName}, {en ? "delivery to" : "consegna a"} {order.city}
        {order.estimatedDelivery && order.status !== "consegnato" && order.status !== "annullato"
          ? ` · ${en ? "expected on" : "prevista il"} ${new Intl.DateTimeFormat(en ? "en-GB" : "it-IT", { day: "numeric", month: "long" }).format(new Date(order.estimatedDelivery))}`
          : ""}
      </p>
      <ol className="mt-6 space-y-4 border-l-2 pl-5">
        {order.events
          .slice()
          .reverse()
          .map((e) => (
            <li key={e.at + e.status} className="relative">
              <span className="bg-enamel absolute top-1.5 -left-[27px] size-3 rounded-full" aria-hidden />
              <p className="font-medium">{status[e.status]}</p>
              <p className="text-muted-foreground text-sm">
                {formatDateTime(e.at, lang)} — {en ? (orderNoteEn[e.note] ?? e.note) : e.note}
              </p>
            </li>
          ))}
      </ol>
      {order.trackingCode && (
        <p className="mt-6 text-sm">
          {order.carrier}, {en ? "tracking" : "tracciamento"} <span className="font-mono">{order.trackingCode}</span>
        </p>
      )}
      <ul className="mt-6 divide-y border-y text-sm">
        {order.items.map((i) => (
          <li key={i.name} className="flex justify-between py-2">
            <span>
              {en ? (nameEn[i.name] ?? i.name) : i.name} × {i.quantity}
            </span>
            <span className="tabular-nums">{formatPrice(i.priceCents * i.quantity, lang)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between font-semibold">
        <span>{en ? "Total" : "Totale"}</span>
        <span className="price">{formatPrice(order.totalCents, lang)}</span>
      </p>
    </article>
  );
}
