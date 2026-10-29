// The database rows are Italian. On the English pages these helpers put the English words on top,
// keyed by slug; anything without a translation falls back to the Italian original.
import { clinica } from "@/data/clinica";
import { motivoEn } from "@/data/en/assenze";
import { clinicaEn } from "@/data/en/clinica";
import { documentiEn } from "@/data/en/informazioni";
import { mediciEn } from "@/data/en/medici";
import { prestazioniEn } from "@/data/en/prestazioni";
import { specialitaEn } from "@/data/en/specialita";
import { stanzeEn } from "@/data/en/stanze";
import { stanze } from "@/data/stanze";
import { documenti } from "@/data/informazioni";
import type { Lang } from "@/lib/i18n";

type Named = { slug: string; name: string };

export function lSpeciality<T extends Named & { summary?: string; description?: string }>(lang: Lang, s: T): T {
  const en = lang === "en" ? specialitaEn[s.slug] : undefined;
  if (!en) return s;
  return {
    ...s,
    name: en.nome,
    ...(s.summary !== undefined && { summary: en.sommario }),
    ...(s.description !== undefined && { description: en.descrizione }),
  };
}

export const specialityNameEn = (slug: string, name: string) => specialitaEn[slug]?.nome ?? name;

export function lService<
  T extends Named & { description?: string; preparation?: string; specialitySlug?: string; specialityName?: string },
>(lang: Lang, s: T): T {
  if (lang !== "en") return s;
  const en = prestazioniEn[s.slug];
  const out = { ...s };
  if (en) {
    out.name = en.nome;
    if (s.description !== undefined) out.description = en.descrizione;
    if (s.preparation !== undefined) out.preparation = en.preparazione;
  }
  if (s.specialitySlug && s.specialityName !== undefined) out.specialityName = specialityNameEn(s.specialitySlug, s.specialityName);
  return out;
}

export const serviceNameEn = (slug: string, name: string) => prestazioniEn[slug]?.nome ?? name;

export function lDoctor<T extends Named & { bio?: string; languages?: string[]; specialities?: { slug: string; name: string }[] }>(
  lang: Lang,
  d: T,
): T {
  if (lang !== "en") return d;
  const en = mediciEn[d.slug];
  const out = { ...d };
  if (en) {
    if (d.bio !== undefined) out.bio = en.bio;
    if (d.languages !== undefined) out.languages = en.lingue;
  }
  if (d.specialities) out.specialities = d.specialities.map((s) => ({ ...s, name: specialityNameEn(s.slug, s.name) }));
  return out;
}

export function lRoom<T extends Named & { wing?: string; directions?: string }>(lang: Lang, r: T): T {
  const en = lang === "en" ? stanzeEn[r.slug] : undefined;
  if (!en) return r;
  return {
    ...r,
    name: en.nome,
    ...(r.wing !== undefined && { wing: en.ala }),
    ...(r.directions !== undefined && { directions: en.indicazioni }),
  };
}

/** Room name only, for schedules that carry the Italian name ("Ambulatorio 2.4"). */
export function roomNameEn(lang: Lang, name: string) {
  return lang === "en" ? (roomByItalianName[name] ?? name) : name;
}

const roomByItalianName: Record<string, string> = Object.fromEntries(stanze.map((s) => [s.nome, stanzeEn[s.slug]?.nome ?? s.nome]));

export const absenceReasonEn = (lang: Lang, reason: string) => (lang === "en" ? (motivoEn[reason] ?? reason) : reason);

export const infoDocs = (lang: Lang) => (lang === "en" ? documentiEn : documenti);

// Info titles and section headings, Italian → English, paired doc by doc and heading by heading.
export const infoTitleEn: Record<string, string> = {};
export const infoSectionEn: Record<string, string> = {};
const headings = (body: string) => body.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3).trim());
for (const doc of documenti) {
  const en = documentiEn.find((d) => d.slug === doc.slug);
  if (!en) continue;
  infoTitleEn[doc.titolo] = en.titolo;
  const enHeads = headings(en.corpo);
  headings(doc.corpo).forEach((h, i) => {
    if (enHeads[i]) infoSectionEn[h] = enHeads[i];
  });
}

/** The clinic object in the page language. */
export const clinicaFor = (lang: Lang) => (lang === "en" ? { ...clinica, ...clinicaEn } : clinica);

/** The English info pages split into the same sections the database holds for the Italian ones. */
export function infoSectionsEn() {
  return documentiEn.flatMap((doc) =>
    doc.corpo
      .split(/^## /m)
      .filter((block) => block.trim())
      .map((block, position) => {
        const [heading, ...rest] = block.split("\n");
        return { docSlug: doc.slug, docTitle: doc.titolo, section: heading.trim(), content: rest.join(" ").replace(/\s+/g, " ").trim(), position };
      }),
  );
}
