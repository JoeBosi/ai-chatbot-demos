import type { ReactNode } from "react";

/** Building blocks shared by the three long-form pages: /tutorial, /manutenzione, /operatore. */

export function Sezione({
  id,
  titolo,
  occhiello,
  children,
}: {
  id: string;
  titolo: string;
  occhiello?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t pt-10">
      {occhiello && (
        <p className="text-enamel text-xs font-semibold tracking-[0.18em] uppercase">
          {occhiello}
        </p>
      )}
      <h2 className="font-display mt-1 text-3xl leading-tight md:text-4xl">
        {titolo}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function Prova({
  titolo,
  children,
}: {
  titolo: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-enamel-soft/70 border-enamel/20 rounded-lg border p-4">
      <p className="text-enamel-deep font-semibold">Prova tu: {titolo}</p>
      <div className="mt-2 flex flex-col gap-2 text-[15px]">{children}</div>
    </div>
  );
}

export function Nota({ children }: { children: ReactNode }) {
  return (
    <div className="border-crema/40 bg-crema/5 rounded-lg border p-4">
      <p className="text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

/** A warning that costs money, data or downtime if ignored. */
export function Attenzione({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <p className="text-[15px] leading-relaxed">
        <strong>Attenzione. </strong>
        {children}
      </p>
    </div>
  );
}

export function Indice({
  voci,
}: {
  voci: { id: string; titolo: string; livello?: string }[];
}) {
  return (
    <nav aria-label="Indice" className="bg-card mt-10 rounded-lg border p-4">
      <p className="font-display text-xl">Indice</p>
      <ol className="mt-2 flex flex-col gap-1.5 text-[15px]">
        {voci.map((v) => (
          <li key={v.id} className="flex items-baseline justify-between gap-3">
            <a
              href={`#${v.id}`}
              className="hover:text-enamel underline decoration-dotted underline-offset-4"
            >
              {v.titolo}
            </a>
            {v.livello && (
              <span className="text-muted-foreground shrink-0 text-xs">
                {v.livello}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Two-column table with a fixed header: "se succede X → fai Y". */
export function Tabella({
  intestazioni,
  righe,
}: {
  intestazioni: string[];
  righe: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            {intestazioni.map((h) => (
              <th key={h} className="py-2 pr-3 font-semibold last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="align-top">
          {righe.map((riga, i) => (
            <tr key={i} className="border-b last:border-0">
              {riga.map((cella, j) => (
                <td key={j} className="py-2 pr-3 last:pr-0">
                  {cella}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
