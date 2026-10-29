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
import { useI18n } from "@/components/lang-provider";
import { Button } from "@/components/ui/button";
import { infoSectionEn, infoTitleEn } from "@/data/en/localize";
import { enPreparationBySlug, enService, enServiceBySlug, enSpeciality, enSpecialityBySlug, enText } from "@/data/en/chat";
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

// Labels in the page language, and the Italian tool data turned into English on the English site.
function useT() {
  const { t, lang } = useI18n();
  const en = lang === "en";
  return {
    t,
    en,
    tx: (text: string) => (en ? enText(text) : text),
    service: (slug: string, name: string) => (en ? enServiceBySlug(slug, name) : name),
    serviceName: (name: string) => (en ? enService(name) : name),
    speciality: (name: string) => (en ? enSpeciality(name) : name),
    kind: (k: string) => (en ? kindLabelEn : kindLabel)[k] ?? k,
    money: (v: number) => (en ? new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(v) : euro(v)),
  };
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

const kindLabel: Record<string, string> = {
  visita: "Visita",
  esame: "Esame",
  analisi: "Analisi",
  certificato: "Certificato",
  terapia: "Terapia",
};
const kindLabelEn: Record<string, string> = {
  visita: "Consultation",
  esame: "Test",
  analisi: "Lab test",
  certificato: "Certificate",
  terapia: "Therapy",
};

function ServiceRow({
  s,
  onNavigate,
}: {
  s: { slug: string; name: string; speciality?: string; kind: string; durationMinutes: number; priceEuro: number; reportDays?: number };
  onNavigate?: () => void;
}) {
  const { ask } = useAssistant();
  const { t, service, speciality, kind, money } = useT();
  const name = service(s.slug, s.name);
  return (
    <li className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-2">
        <SiteLink href={`/prestazioni/${s.slug}`} onClick={onNavigate} className="leading-tight font-semibold hover:underline">
          {name}
        </SiteLink>
        <span className="price shrink-0 font-semibold">{money(s.priceEuro)}</span>
      </div>
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
        {s.speciality && <span>{speciality(s.speciality)}</span>}
        <span>{kind(s.kind)}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="size-3" aria-hidden /> {s.durationMinutes} min
        </span>
        {typeof s.reportDays === "number" && (
          <span>{s.reportDays === 0 ? t("referto subito", "report straight away") : t(`referto in ${s.reportDays} gg`, `report in ${s.reportDays} days`)}</span>
        )}
      </p>
      <div>
        <Button size="sm" variant="outline" onClick={() => ask(t(`Quali sono le prossime disponibilità per ${s.name}?`, `What are the next free slots for the ${name}?`))}>
          {t("Vedi disponibilità", "See availability")}
        </Button>
      </div>
    </li>
  );
}

export function ListSpecialitiesPart({ part, onNavigate }: { part: ToolPart<"listSpecialities">; onNavigate?: () => void }) {
  const { t, en } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere l'elenco delle specialità.", "I can't read the list of specialties.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Guardo le specialità…", "Looking at the specialties…")}</Pending>;
  return (
    <Frame>
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <StethoscopeIcon className="size-4" aria-hidden /> {t("Le nostre specialità", "Our specialties")}
      </p>
      <ul className="mt-2 divide-y text-sm">
        {part.output.specialities.map((s) => (
          <li key={s.slug} className="py-1.5 first:pt-0 last:pb-0">
            <SiteLink href={`/specialita/${s.slug}`} onClick={onNavigate} className="font-medium hover:underline">
              {en ? enSpecialityBySlug(s.slug, s.name) : s.name}
            </SiteLink>
            {!en && <p className="text-muted-foreground text-xs">{s.summary}</p>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function SearchServicesPart({ part, onNavigate }: { part: ToolPart<"searchServices">; onNavigate?: () => void }) {
  const { t } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a cercare fra le prestazioni.", "I can't search the services.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco fra le prestazioni…", "Searching the services…")}</Pending>;
  if (part.output.count === 0) return <Failed>{t("Non ho trovato prestazioni con questo nome.", "I found no service with this name.")}</Failed>;
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
  const { t, en, service, speciality, kind, money } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere la scheda della prestazione.", "I can't read the service details.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Apro la scheda…", "Opening the details…")}</Pending>;
  if (!part.output.found) return <Failed>{t("Questa prestazione non è in elenco.", "This service is not listed.")}</Failed>;
  const s = part.output;
  return (
    <Frame className="text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <SiteLink href={`/prestazioni/${s.slug}`} onClick={onNavigate} className="font-semibold hover:underline">
          {service(s.slug, s.name)}
        </SiteLink>
        <span className="price font-semibold">{money(s.priceEuro)}</span>
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">
        {speciality(s.speciality)} · {kind(s.kind)} · {s.durationMinutes} {t("minuti", "minutes")} ·{" "}
        {s.reportDays === 0
          ? t("referto a fine visita", "report at the end of the visit")
          : t(`referto in ${s.reportDays} giorni lavorativi`, `report in ${s.reportDays} working days`)}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t("Preparazione", "Preparation")}</dt>
        <dd>{en ? enPreparationBySlug(s.slug, s.preparation) || "No special preparation." : s.preparation}</dd>
        <dt className="text-muted-foreground">{t("Impegnativa", "GP referral")}</dt>
        <dd>{s.referralNeeded ? t("necessaria per il servizio pubblico", "needed for the public health service") : t("non necessaria", "not needed")}</dd>
        <dt className="text-muted-foreground">{t("Esegue", "Performed by")}</dt>
        <dd>{s.doctors.map((d) => d.name).join(", ")}</dd>
      </dl>
    </Frame>
  );
}

export function FindDoctorsPart({ part, onNavigate }: { part: ToolPart<"findDoctors">; onNavigate?: () => void }) {
  const { t, tx, speciality } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere l'elenco dei medici.", "I can't read the list of doctors.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco i medici…", "Looking for doctors…")}</Pending>;
  if (part.output.count === 0) return <Failed>{t("Non ho trovato medici con questi criteri.", "I found no doctors matching these criteria.")}</Failed>;
  return (
    <Frame>
      <ul className="divide-y text-sm">
        {part.output.doctors.map((d) => (
          <li key={d.slug} className="py-2 first:pt-0 last:pb-0">
            <SiteLink href={`/medici/${d.slug}`} onClick={onNavigate} className="flex items-center gap-1.5 font-semibold hover:underline">
              <UserRoundIcon className="size-4 shrink-0" aria-hidden /> {d.name}
            </SiteLink>
            <p className="text-muted-foreground text-xs">{d.specialities.map(speciality).join(" · ")}</p>
            {d.days.length > 0 && <p className="mt-0.5 text-xs">{t("Riceve", "Sees patients")}: {tx(d.days.join(" · "))}</p>}
            {d.rooms.length > 0 && <p className="text-muted-foreground text-xs">{tx(d.rooms.join(" · "))}</p>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function AvailabilityPart({ part }: { part: ToolPart<"getAvailability"> }) {
  const { ask } = useAssistant();
  const { t, tx, money, service: nameOf } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere l'agenda.", "I can't read the diary.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Guardo l'agenda…", "Checking the diary…")}</Pending>;
  if (!part.output.found) return <Failed>{t("Questa prestazione non è in elenco.", "This service is not listed.")}</Failed>;
  const { service, slots } = part.output;
  if (slots.length === 0) {
    return (
      <Failed>
        {t(
          "Non ci sono posti liberi nei prossimi giorni: posso cercare più in là o con un altro medico.",
          "There are no free slots in the coming days: I can look further ahead or with another doctor.",
        )}
      </Failed>
    );
  }
  const name = nameOf(service.slug, service.name);
  return (
    <Frame className="text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarCheckIcon className="size-4" aria-hidden /> {name}
      </p>
      <p className="text-muted-foreground text-xs">
        {service.durationMinutes} {t("minuti", "minutes")} · {money(service.priceEuro)} · {t("scelga un orario", "choose a time")}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {slots.map((s) => (
          <li key={s.startsAt + s.doctorSlug}>
            <button
              type="button"
              onClick={() => ask(t(`Prenoto ${service.name} ${s.when} con ${s.doctorName}.`, `I book the ${name} on ${tx(s.when)} with ${s.doctorName}.`))}
              className="hover:border-enamel hover:bg-enamel-soft/60 flex w-full items-center justify-between gap-3 rounded border px-2.5 py-2 text-left transition-colors"
            >
              <span>
                <span className="font-medium">{tx(s.when)}</span>
                <span className="text-muted-foreground block text-xs">
                  {s.doctorName} · {tx(s.room)}, {t("piano", "floor")} {s.floor}
                </span>
              </span>
              <span className="text-enamel shrink-0 text-xs font-semibold">{t("Scegli", "Choose")}</span>
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
  const { t, en, tx, serviceName } = useT();
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>{t("Preparo la prenotazione…", "Preparing the booking…")}</Pending>;
  if (part.state === "output-error") return <Failed>{t("La prenotazione non è andata a buon fine. Riprovi tra poco.", "The booking did not go through. Please try again shortly.")}</Failed>;
  const input = part.input;

  if (part.state === "output-available") {
    if (!part.output.booked) {
      return (
        <Frame className="border-amber-500/40 bg-amber-500/10 text-sm">
          <p className="flex items-center gap-1.5 font-semibold">
            <AlertCircleIcon className="size-4" aria-hidden /> {t("Prenotazione non effettuata", "Booking not made")}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{part.output.reason}</p>
        </Frame>
      );
    }
    const o = part.output;
    return (
      <Frame className="bg-enamel-soft border-enamel/30 text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CalendarCheckIcon className="text-enamel size-4" aria-hidden /> {t(`Prenotazione ${o.code} confermata`, `Booking ${o.code} confirmed`)}
        </p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-muted-foreground">{t("Quando", "When")}</dt>
          <dd className="font-medium">{tx(o.when)}</dd>
          <dt className="text-muted-foreground">{t("Prestazione", "Service")}</dt>
          <dd>{serviceName(o.service)}</dd>
          <dt className="text-muted-foreground">{t("Medico", "Doctor")}</dt>
          <dd>{o.doctor}</dd>
          <dt className="text-muted-foreground">{t("Dove", "Where")}</dt>
          <dd>{tx(o.room)}</dd>
          {!en && (
            <>
              <dt className="text-muted-foreground">Preparazione</dt>
              <dd>{o.preparation}</dd>
            </>
          )}
        </dl>
        <p className="text-muted-foreground mt-2 text-xs">
          {t(
            `Si presenti ${o.arriveMinutesEarlier} minuti prima all'accettazione. Prenotazione dimostrativa: non arriva a nessuna struttura reale.`,
            `Please come to reception ${o.arriveMinutesEarlier} minutes early. Demo booking: it reaches no real clinic.`,
          )}
        </p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>{t("Prenotazione annullata.", "Booking cancelled.")}</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>{t("Prenoto…", "Booking…")}</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarCheckIcon className="size-4" aria-hidden /> {t("Confermare questa prenotazione?", "Confirm this booking?")}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t("Prestazione", "Service")}</dt>
        <dd>{en ? enServiceBySlug(input.serviceSlug, input.serviceSlug) : input.serviceSlug}</dd>
        <dt className="text-muted-foreground">{t("Quando", "When")}</dt>
        <dd>{new Date(input.startsAt).toLocaleString(en ? "en-GB" : "it-IT", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Rome" })}</dd>
        <dt className="text-muted-foreground">{t("Nome", "Name")}</dt>
        <dd>{input.patientName}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{input.patientEmail}</dd>
        <dt className="text-muted-foreground">{t("Telefono", "Phone")}</dt>
        <dd>{input.patientPhone}</dd>
      </dl>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          {t("Conferma prenotazione", "Confirm booking")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          {t("Annulla", "Cancel")}
        </Button>
      </div>
    </Frame>
  );
}

export function FindMyAppointmentPart({ part }: { part: ToolPart<"findMyAppointment"> }) {
  const { t, tx, serviceName } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a cercare la prenotazione.", "I can't look up the booking.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco la prenotazione…", "Looking up the booking…")}</Pending>;
  if (!part.output.found) return null;
  const a = part.output;
  return (
    <Frame className="text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-semibold">
          <FileTextIcon className="size-4" aria-hidden /> {t("Prenotazione", "Booking")} {a.code}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            a.status === "disdetta" ? "bg-destructive/10 text-destructive" : "bg-enamel-soft text-enamel-deep",
          )}
        >
          {a.status === "disdetta" ? t("disdetta", "cancelled") : a.status === "confermata" ? t("confermata", "confirmed") : a.status}
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t("Quando", "When")}</dt>
        <dd className="font-medium">{tx(a.when)}</dd>
        <dt className="text-muted-foreground">{t("Prestazione", "Service")}</dt>
        <dd>{serviceName(a.service)}</dd>
        <dt className="text-muted-foreground">{t("Medico", "Doctor")}</dt>
        <dd>{a.doctor}</dd>
        <dt className="text-muted-foreground">{t("Dove", "Where")}</dt>
        <dd>{tx(a.room)}</dd>
        {typeof a.reportDays === "number" && a.reportDays > 0 && (
          <>
            <dt className="text-muted-foreground">{t("Referto", "Report")}</dt>
            <dd>{t(`pronto in ${a.reportDays} giorni lavorativi`, `ready in ${a.reportDays} working days`)}</dd>
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
  const { t, en } = useT();
  if (part.state === "input-streaming" || part.state === "input-available") return <Pending>{t("Preparo la disdetta…", "Preparing the cancellation…")}</Pending>;
  if (part.state === "output-error") return <Failed>{t("Non riesco a disdire la prenotazione.", "I can't cancel the booking.")}</Failed>;

  if (part.state === "output-available") {
    if (!part.output.cancelled)
      return <Failed>{en && part.output.reason === "Nessuna prenotazione con quel codice e quella email." ? "No booking with that code and email." : part.output.reason}</Failed>;
    return (
      <Frame className="text-sm">
        <p className="flex items-center gap-1.5 font-semibold">
          <CalendarXIcon className="size-4" aria-hidden /> {t(`Prenotazione ${part.output.code} disdetta`, `Booking ${part.output.code} cancelled`)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{t("Il posto è tornato libero per altri pazienti.", "The slot is free again for other patients.")}</p>
      </Frame>
    );
  }
  if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved)) {
    return <Failed>{t("Disdetta annullata: la prenotazione resta valida.", "Cancellation stopped: the booking is still valid.")}</Failed>;
  }
  if (part.state === "approval-responded") return <Pending>{t("Disdico…", "Cancelling…")}</Pending>;

  return (
    <Frame className="border-enamel text-sm">
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarXIcon className="size-4" aria-hidden /> {t(`Disdire la prenotazione ${part.input.code}?`, `Cancel booking ${part.input.code}?`)}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {t("Il posto tornerà disponibile e la prenotazione non sarà più valida.", "The slot will become available and the booking will no longer be valid.")}
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => onRespond(part.approval.id, true)}>
          {t("Disdici", "Cancel it")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRespond(part.approval.id, false)}>
          {t("Mantieni", "Keep it")}
        </Button>
      </div>
    </Frame>
  );
}

export function WhereIsPart({ part }: { part: ToolPart<"whereIs"> }) {
  const { t, en, tx } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a leggere la piantina.", "I can't read the floor plan.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Cerco nella struttura…", "Searching the building…")}</Pending>;
  if (part.output.count === 0) return <Failed>{t("Non trovo questa stanza.", "I can't find this room.")}</Failed>;
  return (
    <Frame className="text-sm">
      <ul className="divide-y">
        {part.output.rooms.map((r) => (
          <li key={r.name} className="py-2 first:pt-0 last:pb-0">
            <p className="flex items-center gap-1.5 font-semibold">
              <MapPinIcon className="size-4 shrink-0" aria-hidden /> {tx(r.name)}
            </p>
            <p className="text-muted-foreground text-xs">
              {t("Piano", "Floor")} {r.floor} · {t(`ala ${r.wing}`, `${r.wing} wing`)} ·{" "}
              {r.accessible ? t("accessibile", "accessible") : t("non accessibile in carrozzina", "not wheelchair accessible")}
            </p>
            {!en && <p className="mt-0.5 text-xs">{r.directions}</p>}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function SearchInfoPart({ part, onNavigate }: { part: ToolPart<"searchInfo">; onNavigate?: () => void }) {
  const { t, en } = useT();
  if (part.state === "output-error") return <Failed>{t("Non riesco a consultare le informazioni.", "I can't check the information pages.")}</Failed>;
  if (part.state !== "output-available") return <Pending>{t("Consulto le informazioni…", "Checking the information pages…")}</Pending>;
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
      <span>{t("Dalle informazioni:", "From the information pages:")}</span>
      {sources.slice(0, 3).map((s) => (
        <SiteLink
          key={s.doc + s.section}
          href="/informazioni"
          onClick={onNavigate}
          className="text-foreground underline decoration-dotted underline-offset-2"
        >
          {en ? `${infoTitleEn[s.doc] ?? s.doc} › ${infoSectionEn[s.section] ?? s.section}` : `${s.doc} › ${s.section}`}
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
