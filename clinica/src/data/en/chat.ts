// Small translators for the chat cards. Tool results arrive in Italian (the model reads them too);
// on the English site the cards show English names and dates.
import { prestazioniEn } from "@/data/en/prestazioni";
import { specialitaEn } from "@/data/en/specialita";
import { stanzeEn } from "@/data/en/stanze";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { stanze } from "@/data/stanze";

const byItalian = (list: { slug: string; nome: string }[], en: Record<string, { nome: string }>) =>
  Object.fromEntries(list.map((x) => [x.nome, en[x.slug]?.nome ?? x.nome]));

const serviceName = byItalian(prestazioni, prestazioniEn);
const specialityName = byItalian(specialita, specialitaEn);
const roomName = byItalian(stanze, stanzeEn);

const words: [RegExp, string][] = [
  [/\blunedì\b/gi, "Monday"],
  [/\bmartedì\b/gi, "Tuesday"],
  [/\bmercoledì\b/gi, "Wednesday"],
  [/\bgiovedì\b/gi, "Thursday"],
  [/\bvenerdì\b/gi, "Friday"],
  [/\bsabato\b/gi, "Saturday"],
  [/\bdomenica\b/gi, "Sunday"],
  [/\bgennaio\b/g, "January"],
  [/\bfebbraio\b/g, "February"],
  [/\bmarzo\b/g, "March"],
  [/\baprile\b/g, "April"],
  [/\bmaggio\b/g, "May"],
  [/\bgiugno\b/g, "June"],
  [/\bluglio\b/g, "July"],
  [/\bagosto\b/g, "August"],
  [/\bsettembre\b/g, "September"],
  [/\bottobre\b/g, "October"],
  [/\bnovembre\b/g, "November"],
  [/\bdicembre\b/g, "December"],
  [/ alle /g, " at "],
  [/\bpiano\b/g, "floor"],
];

export function enText(text: string) {
  let out = text;
  for (const [name, en] of Object.entries(roomName)) if (name !== en) out = out.split(name).join(en);
  for (const [re, en] of words) out = out.replace(re, en);
  return out;
}

export const enService = (name: string) => serviceName[name] ?? name;
export const enSpeciality = (name: string) => specialityName[name] ?? name;
export const enServiceBySlug = (slug: string, name: string) => prestazioniEn[slug]?.nome ?? name;
export const enSpecialityBySlug = (slug: string, name: string) => specialitaEn[slug]?.nome ?? name;
export const enPreparationBySlug = (slug: string, text: string) => prestazioniEn[slug]?.preparazione || text;
