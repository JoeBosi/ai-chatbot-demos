"use client";

import { CheckCircle2Icon, CircleIcon, LifeBuoyIcon, PackageIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { ShopLink } from "@/components/assistant/embed-context";
import { Shimmer } from "@/components/assistant/shimmer";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductArt } from "@/components/shop/product-art";
import { useI18n } from "@/components/lang-provider";
import { Button } from "@/components/ui/button";
import { productsEn } from "@/data/en/catalog";
import { helpSectionEn, helpTitleEn } from "@/data/en/help";
import { orderNoteEn } from "@/data/en/orders";
import type { ShopUIMessage } from "@/lib/ai/tools";
import { formatDateTime, formatPrice, orderStatusLabel, orderStatusLabelEn } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Part = ShopUIMessage["parts"][number];
type ToolPart<N extends string> = Extract<Part, { type: `tool-${N}` }>;

function useTool() {
  const { t, lang } = useI18n();
  return { t, lang, euro: (v: number) => formatPrice(Math.round(v * 100), lang) };
}

// Tool results arrive in Italian from the database; on the English site names, summaries and specs
// come from the English catalogue.
function en<T extends { slug: string; name: string; summary?: string; specs?: Record<string, string> }>(lang: Lang, p: T): T {
  const tr = lang === "en" ? productsEn[p.slug] : undefined;
  if (!tr) return p;
  return { ...p, name: tr.name ?? p.name, summary: p.summary === undefined ? undefined : tr.summary, specs: p.specs === undefined ? undefined : tr.specs };
}

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

function ProductRow({ p: original, onNavigate }: { p: MiniProduct; onNavigate?: () => void }) {
  const { t, lang, euro } = useTool();
  const p = en(lang, original);
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
            {!p.inStock && <span className="text-destructive text-xs">{t("Esaurito", "Sold out")}</span>}
          </p>
          <AddToCartButton slug={p.slug} inStock={p.inStock} size="sm" label={t("Aggiungi", "Add")} />
        </div>
      </div>
    </li>
  );
}

export function SearchProductsPart({ part, onNavigate }: { part: ToolPart<"searchProducts">; onNavigate?: () => void }) {
  const { t } = useTool();
  if (part.state === "output-error") return <Failed>{t("La ricerca nel catalogo non è riuscita.", "The catalogue search failed.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco nel catalogo…", "Searching the catalogue…")}</Pending>;
  const { products } = part.output;
  if (products.length === 0) return <Failed>{t("Nessun prodotto trovato con questi criteri.", "No products match these criteria.")}</Failed>;
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
  const { t, lang } = useTool();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere la scheda del prodotto.", "I can't read the product sheet.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Leggo la scheda tecnica…", "Reading the spec sheet…")}</Pending>;
  if (!part.output.found) return null;
  const p = part.output.product;
  const specs = Object.entries(en(lang, p).specs ?? {}).slice(0, 6);
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
  const { t, lang, euro } = useTool();
  if (part.state === "output-error") return <Failed>{t("Il confronto non è riuscito.", "The comparison failed.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Metto a confronto i prodotti…", "Comparing the products…")}</Pending>;
  const products = part.output.products.map((p) => en(lang, p) as typeof p);
  if (products.length < 2) return null;
  const keys = Array.from(new Set(products.flatMap((p) => Object.keys(p.specs)))).slice(0, 8);
  return (
    <Frame className="overflow-x-auto p-0">
      <table className="w-full min-w-[320px] text-left text-xs">
        <caption className="sr-only">{t("Confronto tra prodotti", "Product comparison")}</caption>
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
            <th scope="row" className="text-muted-foreground p-2 font-normal">{t("Prezzo", "Price")}</th>
            {products.map((p) => (
              <td key={p.slug} className="price p-2 font-semibold">
                {euro(p.priceEuro)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <th scope="row" className="text-muted-foreground p-2 font-normal">{t("Valutazione", "Rating")}</th>
            {products.map((p) => (
              <td key={p.slug} className="p-2">
                {p.rating.toLocaleString(lang === "en" ? "en-GB" : "it-IT")} / 5
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
  const { t, lang, euro } = useTool();
  if (part.state === "output-error") return <Failed>{t("Non sono riuscito ad aggiungere il prodotto.", "I couldn't add the product.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Aggiungo al carrello…", "Adding to the cart…")}</Pending>;
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
          {t("Aggiunto al carrello", "Added to the cart")}
        </p>
        <p className="truncate">
          {(lang === "en" && productsEn[out.added.slug]?.name) || out.added.name} × {out.added.quantity}
        </p>
        <p className="text-muted-foreground text-xs">
          {out.cart.itemCount} {t("articoli", "items")} · {euro(out.cart.subtotalEuro)}
        </p>
      </div>
      <Button asChild size="sm" variant="outline">
        <ShopLink href="/carrello" onClick={onNavigate}>
          <ShoppingBagIcon />
          {t("Carrello", "Cart")}
        </ShopLink>
      </Button>
    </Frame>
  );
}

export function GetCartPart({ part, onNavigate }: { part: ToolPart<"getCart">; onNavigate?: () => void }) {
  const { t, lang, euro } = useTool();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere il carrello.", "I can't read the cart.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Controllo il carrello…", "Checking the cart…")}</Pending>;
  const c = part.output;
  if (c.itemCount === 0) return null;
  return (
    <Frame className="text-sm">
      <ul className="space-y-1">
        {c.lines.map((l) => (
          <li key={l.slug} className="flex justify-between gap-2">
            <span className="truncate">
              {(lang === "en" && productsEn[l.slug]?.name) || l.name} × {l.quantity}
            </span>
            <span className="tabular-nums">{euro(l.priceEuro * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
        <span>
          {t("Totale", "Total")}{" "}
          {c.shippingEuro === 0 ? t("(spedizione gratuita)", "(free shipping)") : t(`(+ ${euro(c.shippingEuro)} spedizione)`, `(+ ${euro(c.shippingEuro)} shipping)`)}
        </span>
        <span className="price">{euro(c.totalEuro)}</span>
      </div>
      <Button asChild size="sm" className="mt-3 w-full">
        <ShopLink href="/carrello" onClick={onNavigate}>
          {t("Vai al carrello", "Go to the cart")}
        </ShopLink>
      </Button>
    </Frame>
  );
}

const trackingSteps = ["ricevuto", "in_preparazione", "spedito", "in_consegna", "consegnato"] as const;

export function TrackOrderPart({ part }: { part: ToolPart<"trackOrder"> }) {
  const { t, lang } = useTool();
  const statusLabel = lang === "en" ? orderStatusLabelEn : orderStatusLabel;
  if (part.state === "output-error") return <Failed>{t("Non riesco a controllare l'ordine.", "I can't check the order.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco l'ordine…", "Looking up the order…")}</Pending>;
  if (!part.output.found) return null;
  const o = part.output.order;
  const reached = new Set(o.events.map((e) => e.status));
  return (
    <Frame className="text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-semibold">
          <PackageIcon className="size-4" aria-hidden /> {t("Ordine", "Order")} {o.number}
        </p>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", o.status === "annullato" ? "bg-destructive/10 text-destructive" : "bg-enamel-soft text-enamel-deep")}>
          {statusLabel[o.status]}
        </span>
      </div>
      {o.status !== "annullato" && (
        <ol className="mt-3 grid grid-cols-5 gap-1" aria-label={t("Avanzamento dell'ordine", "Order progress")}>
          {trackingSteps.map((step) => {
            const done = reached.has(step);
            return (
              <li key={step} className="flex flex-col items-center gap-1 text-center">
                {done ? <CheckCircle2Icon className="text-enamel size-4" aria-hidden /> : <CircleIcon className="text-steel size-4" aria-hidden />}
                <span className={cn("text-[10px] leading-tight", !done && "text-muted-foreground")}>{statusLabel[step]}</span>
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
              <span className="text-muted-foreground w-28 shrink-0">{formatDateTime(e.at, lang)}</span>
              <span>{lang === "en" ? (orderNoteEn[e.note] ?? e.note) : e.note}</span>
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
  const { t, lang } = useTool();
  if (part.state === "output-error") return <Failed>{t("Non riesco a consultare il centro assistenza.", "I can't reach the help centre.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Consulto il centro assistenza…", "Checking the help centre…")}</Pending>;
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
      <span>{t("Dal centro assistenza:", "From the help centre:")}</span>
      {sources.slice(0, 3).map((r) => (
        <ShopLink key={r.title + r.section} href={r.url} onClick={onNavigate} className="text-foreground underline decoration-dotted underline-offset-2">
          {lang === "en" ? `${helpTitleEn[r.title] ?? r.title} › ${helpSectionEn[r.section] ?? r.section}` : `${r.title} › ${r.section}`}
        </ShopLink>
      ))}
    </div>
  );
}

const topicLabel: Record<Lang, Record<string, string>> = {
  it: { ordine: "Ordine", reso: "Reso", guasto: "Guasto", prodotto: "Prodotto", altro: "Altro" },
  en: { ordine: "Order", reso: "Return", guasto: "Fault", prodotto: "Product", altro: "Other" },
};

export function SupportTicketPart({
  part,
  onRespond,
}: {
  part: ToolPart<"createSupportTicket">;
  onRespond: (approvalId: string, approved: boolean) => void;
}) {
  const { t, lang } = useTool();
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>{t("Preparo la richiesta di assistenza…", "Preparing the support request…")}</Pending>;
  if (part.state === "output-error") return <Failed>{t("La richiesta non è stata inviata. Riprova tra poco.", "The request was not sent. Try again shortly.")}</Failed>;
  const input = part.input;

  if (part.state === "output-available") {
    return (
      <Frame className="bg-enamel-soft border-enamel/30 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CheckCircle2Icon className="text-enamel size-4" aria-hidden /> {t(`Richiesta ${part.output.ticketNumber} inviata`, `Request ${part.output.ticketNumber} sent`)}
        </p>
        <p className="text-muted-foreground text-xs">
          {t(`Ti rispondiamo a ${part.output.email} entro ${part.output.replyWithin}.`, `We will reply to ${part.output.email} within ${part.output.replyWithin === "1 giorno lavorativo" ? "1 working day" : part.output.replyWithin}.`)}
        </p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>{t("Richiesta di assistenza annullata.", "Support request cancelled.")}</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>{t("Invio la richiesta…", "Sending the request…")}</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <LifeBuoyIcon className="size-4" aria-hidden /> {t("Inviare questa richiesta di assistenza?", "Send this support request?")}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t("Nome", "Name")}</dt>
        <dd>{input.name}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{input.email}</dd>
        <dt className="text-muted-foreground">{t("Argomento", "Topic")}</dt>
        <dd>{topicLabel[lang][input.topic] ?? input.topic}</dd>
        {input.orderNumber && (
          <>
            <dt className="text-muted-foreground">{t("Ordine", "Order")}</dt>
            <dd>{input.orderNumber}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t("Messaggio", "Message")}</dt>
        <dd className="whitespace-pre-wrap">{input.message}</dd>
      </dl>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          {t("Invia richiesta", "Send request")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          {t("Annulla", "Cancel")}
        </Button>
      </div>
    </Frame>
  );
}
