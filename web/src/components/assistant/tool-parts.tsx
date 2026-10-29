"use client";

import { CheckCircle2Icon, CircleIcon, LifeBuoyIcon, PackageIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { ShopLink } from "@/components/assistant/embed-context";
import { Shimmer } from "@/components/assistant/shimmer";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductArt } from "@/components/shop/product-art";
import { Button } from "@/components/ui/button";
import type { ShopUIMessage } from "@/lib/ai/tools";
import { formatDateTime, formatPrice, orderStatusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

type Part = ShopUIMessage["parts"][number];
type ToolPart<N extends string> = Extract<Part, { type: `tool-${N}` }>;

const euro = (v: number) => formatPrice(Math.round(v * 100));

function Pending({ children }: { children: string }) {
  return (
    <div className="text-muted-foreground text-sm">
      <Shimmer>{children}</Shimmer>
    </div>
  );
}

function Failed({ children }: { children: string }) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-card w-full rounded-md border p-3", className)}>{children}</div>;
}

type MiniProduct = {
  slug: string;
  name: string;
  brand: string;
  priceEuro: number;
  compareAtEuro?: number | null;
  inStock: boolean;
  art: string;
  color: string;
  summary?: string;
};

function ProductRow({ p, onNavigate }: { p: MiniProduct; onNavigate?: () => void }) {
  return (
    <li className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
      <ShopLink href={`/prodotti/${p.slug}`} onClick={onNavigate} className="w-16 shrink-0 overflow-hidden rounded">
        <ProductArt art={p.art} color={p.color} title={p.name} />
      </ShopLink>
      <div className="min-w-0 flex-1">
        <ShopLink href={`/prodotti/${p.slug}`} onClick={onNavigate} className="block leading-tight font-semibold hover:underline">
          {p.name}
        </ShopLink>
        <p className="text-muted-foreground truncate text-xs">{p.summary ?? p.brand}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="flex items-baseline gap-1.5">
            <span className="price font-semibold">{euro(p.priceEuro)}</span>
            {p.compareAtEuro ? <s className="text-muted-foreground text-xs">{euro(p.compareAtEuro)}</s> : null}
            {!p.inStock && <span className="text-destructive text-xs">Esaurito</span>}
          </p>
          <AddToCartButton slug={p.slug} inStock={p.inStock} size="sm" label="Aggiungi" />
        </div>
      </div>
    </li>
  );
}

export function SearchProductsPart({ part, onNavigate }: { part: ToolPart<"searchProducts">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>La ricerca nel catalogo non è riuscita.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco nel catalogo…</Pending>;
  const { products } = part.output;
  if (products.length === 0) return <Failed>Nessun prodotto trovato con questi criteri.</Failed>;
  return (
    <Frame>
      <ul className="divide-y">
        {products.map((p) => (
          <ProductRow key={p.slug} p={p} onNavigate={onNavigate} />
        ))}
      </ul>
    </Frame>
  );
}

export function GetProductPart({ part, onNavigate }: { part: ToolPart<"getProduct">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere la scheda del prodotto.</Failed>;
  if (part.state !== "output-available") return <Pending>Leggo la scheda tecnica…</Pending>;
  if (!part.output.found) return null;
  const p = part.output.product;
  const specs = Object.entries(p.specs).slice(0, 6);
  return (
    <Frame>
      <ul>
        <ProductRow p={{ ...p, inStock: p.stock > 0 }} onNavigate={onNavigate} />
      </ul>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t pt-3 text-xs">
        {specs.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Frame>
  );
}

export function CompareProductsPart({ part }: { part: ToolPart<"compareProducts"> }) {
  if (part.state === "output-error") return <Failed>Il confronto non è riuscito.</Failed>;
  if (part.state !== "output-available") return <Pending>Metto a confronto i prodotti…</Pending>;
  const { products } = part.output;
  if (products.length < 2) return null;
  const keys = Array.from(new Set(products.flatMap((p) => Object.keys(p.specs)))).slice(0, 8);
  return (
    <Frame className="overflow-x-auto p-0">
      <table className="w-full min-w-[320px] text-left text-xs">
        <caption className="sr-only">Confronto tra prodotti</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="p-2" />
            {products.map((p) => (
              <th key={p.slug} scope="col" className="p-2 align-bottom">
                <div className="mb-1 w-12 overflow-hidden rounded">
                  <ProductArt art={p.art} color={p.color} title={p.name} />
                </div>
                <ShopLink href={`/prodotti/${p.slug}`} className="text-sm leading-tight font-semibold hover:underline">
                  {p.name}
                </ShopLink>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <th scope="row" className="text-muted-foreground p-2 font-normal">Prezzo</th>
            {products.map((p) => (
              <td key={p.slug} className="price p-2 font-semibold">
                {euro(p.priceEuro)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <th scope="row" className="text-muted-foreground p-2 font-normal">Valutazione</th>
            {products.map((p) => (
              <td key={p.slug} className="p-2">
                {p.rating.toLocaleString("it-IT")} / 5
              </td>
            ))}
          </tr>
          {keys.map((k) => (
            <tr key={k} className="border-b last:border-0">
              <th scope="row" className="text-muted-foreground p-2 font-normal">{k}</th>
              {products.map((p) => (
                <td key={p.slug} className="p-2">
                  {p.specs[k] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

export function AddToCartPart({ part, onNavigate }: { part: ToolPart<"addToCart">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non sono riuscito ad aggiungere il prodotto.</Failed>;
  if (part.state !== "output-available") return <Pending>Aggiungo al carrello…</Pending>;
  const out = part.output;
  if (!out.ok) return <Failed>{out.message}</Failed>;
  return (
    <Frame className="bg-enamel-soft border-enamel/30 flex items-center gap-3">
      <div className="w-12 shrink-0 overflow-hidden rounded">
        <ProductArt art={out.added.art} color={out.added.color} title={out.added.name} />
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CheckCircle2Icon className="text-enamel size-4" aria-hidden />
          Aggiunto al carrello
        </p>
        <p className="truncate">
          {out.added.name} × {out.added.quantity}
        </p>
        <p className="text-muted-foreground text-xs">
          {out.cart.itemCount} articoli · {euro(out.cart.subtotalEuro)}
        </p>
      </div>
      <Button asChild size="sm" variant="outline">
        <ShopLink href="/carrello" onClick={onNavigate}>
          <ShoppingBagIcon />
          Carrello
        </ShopLink>
      </Button>
    </Frame>
  );
}

export function GetCartPart({ part, onNavigate }: { part: ToolPart<"getCart">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere il carrello.</Failed>;
  if (part.state !== "output-available") return <Pending>Controllo il carrello…</Pending>;
  const c = part.output;
  if (c.itemCount === 0) return null;
  return (
    <Frame className="text-sm">
      <ul className="space-y-1">
        {c.lines.map((l) => (
          <li key={l.slug} className="flex justify-between gap-2">
            <span className="truncate">
              {l.name} × {l.quantity}
            </span>
            <span className="tabular-nums">{euro(l.priceEuro * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
        <span>Totale {c.shippingEuro === 0 ? "(spedizione gratuita)" : `(+ ${euro(c.shippingEuro)} spedizione)`}</span>
        <span className="price">{euro(c.totalEuro)}</span>
      </div>
      <Button asChild size="sm" className="mt-3 w-full">
        <ShopLink href="/carrello" onClick={onNavigate}>
          Vai al carrello
        </ShopLink>
      </Button>
    </Frame>
  );
}

const trackingSteps = ["ricevuto", "in_preparazione", "spedito", "in_consegna", "consegnato"] as const;

export function TrackOrderPart({ part }: { part: ToolPart<"trackOrder"> }) {
  if (part.state === "output-error") return <Failed>Non riesco a controllare l&apos;ordine.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco l&apos;ordine…</Pending>;
  if (!part.output.found) return null;
  const o = part.output.order;
  const reached = new Set(o.events.map((e) => e.status));
  return (
    <Frame className="text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-semibold">
          <PackageIcon className="size-4" aria-hidden /> Ordine {o.number}
        </p>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", o.status === "annullato" ? "bg-destructive/10 text-destructive" : "bg-enamel-soft text-enamel-deep")}>
          {orderStatusLabel[o.status]}
        </span>
      </div>
      {o.status !== "annullato" && (
        <ol className="mt-3 grid grid-cols-5 gap-1" aria-label="Avanzamento dell'ordine">
          {trackingSteps.map((step) => {
            const done = reached.has(step);
            return (
              <li key={step} className="flex flex-col items-center gap-1 text-center">
                {done ? <CheckCircle2Icon className="text-enamel size-4" aria-hidden /> : <CircleIcon className="text-steel size-4" aria-hidden />}
                <span className={cn("text-[10px] leading-tight", !done && "text-muted-foreground")}>{orderStatusLabel[step]}</span>
              </li>
            );
          })}
        </ol>
      )}
      <ul className="mt-3 space-y-1 border-t pt-2 text-xs">
        {o.events
          .slice()
          .reverse()
          .map((e) => (
            <li key={e.at + e.status} className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">{formatDateTime(e.at)}</span>
              <span>{e.note}</span>
            </li>
          ))}
      </ul>
      {o.trackingCode && (
        <p className="mt-2 flex items-center gap-1.5 text-xs">
          <TruckIcon className="size-3.5" aria-hidden /> {o.carrier}: <span className="font-mono">{o.trackingCode}</span>
        </p>
      )}
    </Frame>
  );
}

export function SearchHelpPart({ part, onNavigate }: { part: ToolPart<"searchHelp">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a consultare il centro assistenza.</Failed>;
  if (part.state !== "output-available") return <Pending>Consulto il centro assistenza…</Pending>;
  const seen = new Set<string>();
  const sources = part.output.results.filter((r) => {
    const key = r.title + r.section;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (sources.length === 0) return null;
  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span>Dal centro assistenza:</span>
      {sources.slice(0, 3).map((r) => (
        <ShopLink key={r.title + r.section} href={r.url} onClick={onNavigate} className="text-foreground underline decoration-dotted underline-offset-2">
          {r.title} › {r.section}
        </ShopLink>
      ))}
    </div>
  );
}

const topicLabel: Record<string, string> = {
  ordine: "Ordine",
  reso: "Reso",
  guasto: "Guasto",
  prodotto: "Prodotto",
  altro: "Altro",
};

export function SupportTicketPart({
  part,
  onRespond,
}: {
  part: ToolPart<"createSupportTicket">;
  onRespond: (approvalId: string, approved: boolean) => void;
}) {
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>Preparo la richiesta di assistenza…</Pending>;
  if (part.state === "output-error") return <Failed>La richiesta non è stata inviata. Riprova tra poco.</Failed>;
  const input = part.input;

  if (part.state === "output-available") {
    return (
      <Frame className="bg-enamel-soft border-enamel/30 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CheckCircle2Icon className="text-enamel size-4" aria-hidden /> Richiesta {part.output.ticketNumber} inviata
        </p>
        <p className="text-muted-foreground text-xs">
          Ti rispondiamo a {part.output.email} entro {part.output.replyWithin}.
        </p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>Richiesta di assistenza annullata.</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>Invio la richiesta…</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <LifeBuoyIcon className="size-4" aria-hidden /> Inviare questa richiesta di assistenza?
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Nome</dt>
        <dd>{input.name}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{input.email}</dd>
        <dt className="text-muted-foreground">Argomento</dt>
        <dd>{topicLabel[input.topic] ?? input.topic}</dd>
        {input.orderNumber && (
          <>
            <dt className="text-muted-foreground">Ordine</dt>
            <dd>{input.orderNumber}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Messaggio</dt>
        <dd className="whitespace-pre-wrap">{input.message}</dd>
      </dl>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          Invia richiesta
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          Annulla
        </Button>
      </div>
    </Frame>
  );
}
