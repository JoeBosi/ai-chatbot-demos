import { AccessibilityIcon, BikeIcon, BusIcon, CarIcon, ParkingSquareIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { clinica } from "@/data/clinica";
import { listRooms } from "@/lib/clinica";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/dove-siamo", {
  title: "Dove siamo",
  description: "Indirizzo, come arrivare in auto, in bus o in bici, parcheggio, accessibilità e piantina dei tre piani.",
});

export default async function DoveSiamoPage() {
  const rooms = await listRooms();

  // listRooms ordina per piano: raggruppo mantenendo quell'ordine.
  const floors: { floor: number; rooms: typeof rooms }[] = [];
  for (const room of rooms) {
    const last = floors.at(-1);
    if (last?.floor === room.floor) last.rooms.push(room);
    else floors.push({ floor: room.floor, rooms: [room] });
  }

  const arrivare = [
    { icon: CarIcon, title: "In auto", text: clinica.comeArrivare.auto },
    { icon: ParkingSquareIcon, title: "Parcheggio", text: clinica.comeArrivare.parcheggio },
    { icon: BusIcon, title: "In autobus", text: clinica.comeArrivare.bus },
    { icon: BikeIcon, title: "In bicicletta", text: clinica.comeArrivare.bici },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Dove siamo</h1>
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
        L&apos;indirizzo è inventato: non cercarlo su una mappa, non esiste.
      </p>

      <section className="mt-12" aria-labelledby="come-arrivare">
        <h2 id="come-arrivare" className="font-display text-3xl">
          Come arrivare
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
          Accessibilità
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
          Piantina, piano per piano
        </h2>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Non c&apos;è una mappa da guardare: ci sono le indicazioni a parole, quelle che darebbe la persona in
          accettazione.
        </p>

        <div className="mt-6 space-y-8">
          {floors.map((f) => (
            <div key={f.floor}>
              <h3 className="font-display text-2xl">
                Piano {f.floor}
                {f.floor === 0 && <span className="text-muted-foreground text-base font-normal"> (piano terra)</span>}
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
                        {room.accessible ? "Accessibile in carrozzina" : "Non accessibile in carrozzina"}
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
        Orari della reception e contatti completi sono in{" "}
        <Link href="/informazioni" className="text-enamel underline decoration-dotted underline-offset-4">
          Informazioni
        </Link>
        .
      </p>
    </div>
  );
}
