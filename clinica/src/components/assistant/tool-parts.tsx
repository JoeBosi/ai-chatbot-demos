"use client";

import {
  AlertCircleIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  ClockIcon,
  EuroIcon,
  FileTextIcon,
  MapPinIcon,
  StethoscopeIcon,
  UserRoundIcon,
} from "lucide-react";

import { useAssistant } from "@/components/assistant/assistant-provider";
import { SiteLink } from "@/components/assistant/embed-context";
import { Shimmer } from "@/components/assistant/shimmer";
import { Button } from "@/components/ui/button";
import type { ClinicUIMessage } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";

/**
 * Every tool result gets a face: a list of services with price and duration, real slots you can
 * click, a booking summary with Conferma/Annulla. Without this the patient would read JSON, and the
 * whole point of an assistant that *does* things would be lost.
 */

type Part = ClinicUIMessage["parts"][number];
type ToolPart<N extends string> = Extract<Part, { type: `tool-${N}` }>;

const euro = (v: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(v);

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

const kindLabel: Record<string, string> = {
  visita: "Visita",
  esame: "Esame",
  analisi: "Analisi",
  certificato: "Certificato",
  terapia: "Terapia",
};

function ServiceRow({
  s,
  onNavigate,
}: {
  s: { slug: string; name: string; speciality?: string; kind: string; durationMinutes: number; priceEuro: number; reportDays?: number };
  onNavigate?: () => void;
}) {
  const { ask } = useAssistant();
  return (
    <li className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-2">
        <SiteLink href={`/prestazioni/${s.slug}`} onClick={onNavigate} className="leading-tight font-semibold hover:underline">
          {s.name}
        </SiteLink>
        <span className="price shrink-0 font-semibold">{euro(s.priceEuro)}</span>
      </div>
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
        {s.speciality && <span>{s.speciality}</span>}
        <span>{kindLabel[s.kind] ?? s.kind}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="size-3" aria-hidden /> {s.durationMinutes} min
        </span>
        {typeof s.reportDays === "number" && (
          <span>{s.reportDays === 0 ? "referto subito" : `referto in ${s.reportDays} gg`}</span>
        )}
      </p>
      <div>
        <Button size="sm" variant="outline" onClick={() => ask(`Quali sono le prossime disponibilità per ${s.name}?`)}>
          Vedi disponibilità
        </Button>
      </div>
    </li>
  );
}

export function ListSpecialitiesPart({ part, onNavigate }: { part: ToolPart<"listSpecialities">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere l&apos;elenco delle specialità.</Failed>;
  if (part.state !== "output-available") return <Pending>Guardo le specialità…</Pending>;
  return (
    <Frame>
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <StethoscopeIcon className="size-4" aria-hidden /> Le nostre specialità
      </p>
      <ul className="mt-2 divide-y text-sm">
        {part.output.specialities.map((s) => (
          <li key={s.slug} className="py-1.5 first:pt-0 last:pb-0">
            <SiteLink href={`/specialita/${s.slug}`} onClick={onNavigate} className="font-medium hover:underline">
              {s.name}
            </SiteLink>
            <p className="text-muted-foreground text-xs">{s.summary}</p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function SearchServicesPart({ part, onNavigate }: { part: ToolPart<"searchServices">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a cercare fra le prestazioni.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco fra le prestazioni…</Pending>;
  if (part.output.count === 0) return <Failed>Non ho trovato prestazioni con questo nome.</Failed>;
  return (
    <Frame>
      <ul className="divide-y">
        {part.output.services.map((s) => (
          <ServiceRow key={s.slug} s={s} onNavigate={onNavigate} />
        ))}
      </ul>
    </Frame>
  );
}

export function GetServicePart({ part, onNavigate }: { part: ToolPart<"getService">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere la scheda della prestazione.</Failed>;
  if (part.state !== "output-available") return <Pending>Apro la scheda…</Pending>;
  if (!part.output.found) return <Failed>Questa prestazione non è in elenco.</Failed>;
  const s = part.output;
  return (
    <Frame className="text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <SiteLink href={`/prestazioni/${s.slug}`} onClick={onNavigate} className="font-semibold hover:underline">
          {s.name}
        </SiteLink>
        <span className="price font-semibold">{euro(s.priceEuro)}</span>
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">
        {s.speciality} · {kindLabel[s.kind] ?? s.kind} · {s.durationMinutes} minuti ·{" "}
        {s.reportDays === 0 ? "referto a fine visita" : `referto in ${s.reportDays} giorni lavorativi`}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Preparazione</dt>
        <dd>{s.preparation}</dd>
        <dt className="text-muted-foreground">Impegnativa</dt>
        <dd>{s.referralNeeded ? "necessaria per il servizio pubblico" : "non necessaria"}</dd>
        <dt className="text-muted-foreground">Esegue</dt>
        <dd>{s.doctors.map((d) => d.name).join(", ")}</dd>
      </dl>
    </Frame>
  );
}

export function FindDoctorsPart({ part, onNavigate }: { part: ToolPart<"findDoctors">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere l&apos;elenco dei medici.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco i medici…</Pending>;
  if (part.output.count === 0) return <Failed>Non ho trovato medici con questi criteri.</Failed>;
  return (
    <Frame>
      <ul className="divide-y text-sm">
        {part.output.doctors.map((d) => (
          <li key={d.slug} className="py-2 first:pt-0 last:pb-0">
            <SiteLink href={`/medici/${d.slug}`} onClick={onNavigate} className="flex items-center gap-1.5 font-semibold hover:underline">
              <UserRoundIcon className="size-4 shrink-0" aria-hidden /> {d.name}
            </SiteLink>
            <p className="text-muted-foreground text-xs">{d.specialities.join(" · ")}</p>
            {d.days.length > 0 && <p className="mt-0.5 text-xs">Riceve: {d.days.join(" · ")}</p>}
            {d.rooms.length > 0 && <p className="text-muted-foreground text-xs">{d.rooms.join(" · ")}</p>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function AvailabilityPart({ part }: { part: ToolPart<"getAvailability"> }) {
  const { ask } = useAssistant();
  if (part.state === "output-error") return <Failed>Non riesco a leggere l&apos;agenda.</Failed>;
  if (part.state !== "output-available") return <Pending>Guardo l&apos;agenda…</Pending>;
  if (!part.output.found) return <Failed>Questa prestazione non è in elenco.</Failed>;
  const { service, slots } = part.output;
  if (slots.length === 0) {
    return <Failed>Non ci sono posti liberi nei prossimi giorni: posso cercare più in là o con un altro medico.</Failed>;
  }
  return (
    <Frame className="text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarCheckIcon className="size-4" aria-hidden /> {service.name}
      </p>
      <p className="text-muted-foreground text-xs">
        {service.durationMinutes} minuti · {euro(service.priceEuro)} · scelga un orario
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {slots.map((s) => (
          <li key={s.startsAt + s.doctorSlug}>
            <button
              type="button"
              onClick={() => ask(`Prenoto ${service.name} ${s.when} con ${s.doctorName}.`)}
              className="hover:border-enamel hover:bg-enamel-soft/60 flex w-full items-center justify-between gap-3 rounded border px-2.5 py-2 text-left transition-colors"
            >
              <span>
                <span className="font-medium">{s.when}</span>
                <span className="text-muted-foreground block text-xs">
                  {s.doctorName} · {s.room}, piano {s.floor}
                </span>
              </span>
              <span className="text-enamel shrink-0 text-xs font-semibold">Scegli</span>
            </button>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function BookAppointmentPart({
  part,
  onRespond,
}: {
  part: ToolPart<"bookAppointment">;
  onRespond: (approvalId: string, approved: boolean) => void;
}) {
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>Preparo la prenotazione…</Pending>;
  if (part.state === "output-error") return <Failed>La prenotazione non è andata a buon fine. Riprovi tra poco.</Failed>;
  const input = part.input;

  if (part.state === "output-available") {
    if (!part.output.booked) {
      return (
        <Frame className="border-amber-500/40 bg-amber-500/10 text-sm">
          <p className="flex items-center gap-1.5 font-semibold">
            <AlertCircleIcon className="size-4" aria-hidden /> Prenotazione non effettuata
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{part.output.reason}</p>
        </Frame>
      );
    }
    const o = part.output;
    return (
      <Frame className="bg-enamel-soft border-enamel/30 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CalendarCheckIcon className="text-enamel size-4" aria-hidden /> Prenotazione {o.code} confermata
        </p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-muted-foreground">Quando</dt>
          <dd className="font-medium">{o.when}</dd>
          <dt className="text-muted-foreground">Prestazione</dt>
          <dd>{o.service}</dd>
          <dt className="text-muted-foreground">Medico</dt>
          <dd>{o.doctor}</dd>
          <dt className="text-muted-foreground">Dove</dt>
          <dd>{o.room}</dd>
          <dt className="text-muted-foreground">Preparazione</dt>
          <dd>{o.preparation}</dd>
        </dl>
        <p className="text-muted-foreground mt-2 text-xs">
          Si presenti {o.arriveMinutesEarlier} minuti prima all&apos;accettazione. Prenotazione dimostrativa: non arriva a
          nessuna struttura reale.
        </p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>Prenotazione annullata.</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>Prenoto…</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarCheckIcon className="size-4" aria-hidden /> Confermare questa prenotazione?
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Prestazione</dt>
        <dd>{input.serviceSlug}</dd>
        <dt className="text-muted-foreground">Quando</dt>
        <dd>{new Date(input.startsAt).toLocaleString("it-IT", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Rome" })}</dd>
        <dt className="text-muted-foreground">Nome</dt>
        <dd>{input.patientName}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{input.patientEmail}</dd>
        <dt className="text-muted-foreground">Telefono</dt>
        <dd>{input.patientPhone}</dd>
      </dl>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          Conferma prenotazione
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          Annulla
        </Button>
      </div>
    </Frame>
  );
}

export function FindMyAppointmentPart({ part }: { part: ToolPart<"findMyAppointment"> }) {
  if (part.state === "output-error") return <Failed>Non riesco a cercare la prenotazione.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco la prenotazione…</Pending>;
  if (!part.output.found) return null;
  const a = part.output;
  return (
    <Frame className="text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-semibold">
          <FileTextIcon className="size-4" aria-hidden /> Prenotazione {a.code}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            a.status === "disdetta" ? "bg-destructive/10 text-destructive" : "bg-enamel-soft text-enamel-deep",
          )}
        >
          {a.status}
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Quando</dt>
        <dd className="font-medium">{a.when}</dd>
        <dt className="text-muted-foreground">Prestazione</dt>
        <dd>{a.service}</dd>
        <dt className="text-muted-foreground">Medico</dt>
        <dd>{a.doctor}</dd>
        <dt className="text-muted-foreground">Dove</dt>
        <dd>{a.room}</dd>
        {typeof a.reportDays === "number" && a.reportDays > 0 && (
          <>
            <dt className="text-muted-foreground">Referto</dt>
            <dd>pronto in {a.reportDays} giorni lavorativi</dd>
          </>
        )}
      </dl>
    </Frame>
  );
}

export function CancelAppointmentPart({
  part,
  onRespond,
}: {
  part: ToolPart<"cancelAppointment">;
  onRespond: (approvalId: string, approved: boolean) => void;
}) {
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>Preparo la disdetta…</Pending>;
  if (part.state === "output-error") return <Failed>Non riesco a disdire la prenotazione.</Failed>;

  if (part.state === "output-available") {
    if (!part.output.cancelled) return <Failed>{part.output.reason}</Failed>;
    return (
      <Frame className="text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CalendarXIcon className="size-4" aria-hidden /> Prenotazione {part.output.code} disdetta
        </p>
        <p className="text-muted-foreground mt-1 text-xs">Il posto è tornato libero per altri pazienti.</p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>Disdetta annullata: la prenotazione resta valida.</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>Disdico…</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarXIcon className="size-4" aria-hidden /> Disdire la prenotazione {part.input.code}?
      </p>
      <p className="text-muted-foreground mt-1 text-xs">Il posto tornerà disponibile e la prenotazione non sarà più valida.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          Disdici
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          Mantieni
        </Button>
      </div>
    </Frame>
  );
}

export function WhereIsPart({ part }: { part: ToolPart<"whereIs"> }) {
  if (part.state === "output-error") return <Failed>Non riesco a leggere la piantina.</Failed>;
  if (part.state !== "output-available") return <Pending>Cerco nella struttura…</Pending>;
  if (part.output.count === 0) return <Failed>Non trovo questa stanza.</Failed>;
  return (
    <Frame className="text-sm">
      <ul className="divide-y">
        {part.output.rooms.map((r) => (
          <li key={r.name} className="py-2 first:pt-0 last:pb-0">
            <p className="flex items-center gap-1.5 font-semibold">
              <MapPinIcon className="size-4 shrink-0" aria-hidden /> {r.name}
            </p>
            <p className="text-muted-foreground text-xs">
              Piano {r.floor} · ala {r.wing} · {r.accessible ? "accessibile" : "non accessibile in carrozzina"}
            </p>
            <p className="mt-0.5 text-xs">{r.directions}</p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function SearchInfoPart({ part, onNavigate }: { part: ToolPart<"searchInfo">; onNavigate?: () => void }) {
  if (part.state === "output-error") return <Failed>Non riesco a consultare le informazioni.</Failed>;
  if (part.state !== "output-available") return <Pending>Consulto le informazioni…</Pending>;
  const seen = new Set<string>();
  const sources = part.output.sections.filter((s) => {
    const key = s.doc + s.section;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!sources.length) return null;
  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span>Dalle informazioni:</span>
      {sources.slice(0, 3).map((s) => (
        <SiteLink
          key={s.doc + s.section}
          href="/informazioni"
          onClick={onNavigate}
          className="text-foreground underline decoration-dotted underline-offset-2"
        >
          {s.doc} › {s.section}
        </SiteLink>
      ))}
    </div>
  );
}

/** Price badge used by a couple of pages that show a service inline. */
export function PriceTag({ euro: value }: { euro: number }) {
  return (
    <span className="flex items-center gap-1 text-sm font-semibold">
      <EuroIcon className="size-3.5" aria-hidden /> {euro(value)}
    </span>
  );
}
