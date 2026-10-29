import { AccessibilityIcon, BikeIcon, BusIcon, CarIcon, ParkingSquareIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { clinicaFor, lRoom } from "@/data/en/localize";
import { listRooms } from "@/lib/clinica";
import { getI18n } from "@/lib/i18n-server";
import { metaFor } from "@/lib/seo";

export const generateMetadata: () => Promise<Metadata> = metaFor("/dove-siamo", {
  it: {
    title: "Dove siamo",
    description:
      "Indirizzo, come arrivare in auto, in bus o in bici, parcheggio, accessibilità e piantina dei tre piani.",
  },
  en: {
    title: "Where we are",
    description:
      "Address, how to get here by car, bus or bike, parking, accessibility and the plan of the three floors.",
  },
});

export default async function DoveSiamoPage() {
  const [itRooms, { t, href, lang }] = await Promise.all([listRooms(), getI18n()]);
  const rooms = itRooms.map((r) => lRoom(lang, r));
  const clinica = clinicaFor(lang);

  // listRooms ordina per piano: raggruppo mantenendo quell'ordine.
  const floors: { floor: number; rooms: typeof rooms }[] = [];
  for (const room of rooms) {
    const last = floors.at(-1);
    if (last?.floor === room.floor) last.rooms.push(room);
    else floors.push({ floor: room.floor, rooms: [room] });
  }

  const arrivare = [
    { icon: CarIcon, title: t("In auto", "By car"), text: clinica.comeArrivare.auto },
    { icon: ParkingSquareIcon, title: t("Parcheggio", "Parking"), text: clinica.comeArrivare.parcheggio },
    { icon: BusIcon, title: t("In autobus", "By bus"), text: clinica.comeArrivare.bus },
    { icon: BikeIcon, title: t("In bicicletta", "By bike"), text: clinica.comeArrivare.bici },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">{t("Dove siamo", "Where we are")}</h1>
      <p className="mt-4 text-lg leading-relaxed">
        <strong>{clinica.nome}</strong>
        <br />
        {clinica.indirizzo} — {clinica.cap} {clinica.citta} ({clinica.provincia})
      </p>
      <p className="text-muted-foreground mt-2">
        Reception{" "}
        <a href={`tel:${clinica.telefono.replace(/\s/g, "")}`} className="text-enamel underline decoration-dotted underline-offset-4">
          {clinica.telefono}
        </a>{" "}
        ·{" "}
        <a href={`mailto:${clinica.email}`} className="text-enamel underline decoration-dotted underline-offset-4">
          {clinica.email}
        </a>
      </p>
      <p className="text-muted-foreground mt-4 text-sm">
        {t("L'indirizzo è inventato: non cercarlo su una mappa, non esiste.", "The address is made up: don't look for it on a map, it does not exist.")}
      </p>

      <section className="mt-12" aria-labelledby="come-arrivare">
        <h2 id="come-arrivare" className="font-display text-3xl">
          {t("Come arrivare", "How to get here")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {arrivare.map((a) => (
            <div key={a.title} className="bg-card rounded-lg border p-5">
              <a.icon className="text-enamel size-5" aria-hidden />
              <h3 className="font-display mt-2 text-xl leading-none">{a.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="accessibilita">
        <h2 id="accessibilita" className="font-display text-3xl">
          {t("Accessibilità", "Accessibility")}
        </h2>
        <div className="bg-enamel-soft/60 mt-5 flex gap-4 rounded-lg border p-5">
          <AccessibilityIcon className="text-enamel mt-0.5 size-5 shrink-0" aria-hidden />
          <div className="space-y-3 leading-relaxed">
            <p>{clinica.accessibilita.note}</p>
            <p>{clinica.accessibilita.accompagnatori}</p>
            <p>{clinica.accessibilita.aiutoInSede}</p>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="piantina">
        <h2 id="piantina" className="font-display text-3xl">
          {t("Piantina, piano per piano", "Floor plan, floor by floor")}
        </h2>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {t(
            "Non c'è una mappa da guardare: ci sono le indicazioni a parole, quelle che darebbe la persona in accettazione.",
            "There is no map to look at: there are directions in words, the ones the person at reception would give.",
          )}
        </p>

        <div className="mt-6 space-y-8">
          {floors.map((f) => (
            <div key={f.floor}>
              <h3 className="font-display text-2xl">
                {t("Piano", "Floor")} {f.floor}
                {f.floor === 0 && <span className="text-muted-foreground text-base font-normal"> ({t("piano terra", "ground floor")})</span>}
              </h3>
              <ul className="mt-3 divide-y border-y">
                {f.rooms.map((room) => (
                  <li key={room.slug} className="py-3">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-semibold">{room.name}</span>
                      <span className="text-muted-foreground text-sm">{room.wing}</span>
                      <span
                        className={
                          room.accessible
                            ? "text-enamel rounded-full border px-2 py-0.5 text-xs"
                            : "rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-800"
                        }
                      >
                        {room.accessible ? t("Accessibile in carrozzina", "Wheelchair accessible") : t("Non accessibile in carrozzina", "Not wheelchair accessible")}
                      </span>
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{room.directions}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="text-muted-foreground mt-12 text-sm leading-relaxed">
        {t("Orari della reception e contatti completi sono in", "Reception hours and full contacts are in")}{" "}
        <Link href={href("/informazioni")} className="text-enamel underline decoration-dotted underline-offset-4">
          {t("Informazioni", "Information")}
        </Link>
        .
      </p>
    </div>
  );
}
