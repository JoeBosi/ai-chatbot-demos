import { medici } from "@/data/medici";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { mediciEn } from "@/data/en/medici";
import { prestazioniEn } from "@/data/en/prestazioni";
import { specialitaEn } from "@/data/en/specialita";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// The long form of llms.txt: the same data the pages show, as plain Markdown, Italian then English.
export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY.it}`,
    "",
    "Tutti i nomi, i prezzi e le persone sono inventati. L'assistente non dà pareri medici; in emergenza: 112.",
    "",
    ...specialita.flatMap((s) => [
      `## ${s.nome}`,
      "",
      s.descrizione,
      "",
      ...prestazioni
        .filter((p) => p.specialita === s.slug)
        .flatMap((p) => [`### ${p.nome}`, "", `${SITE_URL}/prestazioni/${p.slug} · ${p.durataMinuti} minuti · ${p.prezzoEuro} €`, "", p.descrizione, ""]),
    ]),
    "## Medici",
    "",
    ...medici.map((m) => `- [${m.nome}](${SITE_URL}/medici/${m.slug}): ${m.bio}`),
    "",
    "# English",
    "",
    `> ${SITE_SUMMARY.en}`,
    "",
    "All names, prices and people are made up. The assistant gives no medical advice; in an emergency: 112.",
    "",
    ...specialita.flatMap((s) => [
      `## ${specialitaEn[s.slug]?.nome ?? s.nome}`,
      "",
      specialitaEn[s.slug]?.descrizione ?? s.descrizione,
      "",
      ...prestazioni
        .filter((p) => p.specialita === s.slug)
        .flatMap((p) => [
          `### ${prestazioniEn[p.slug]?.nome ?? p.nome}`,
          "",
          `${SITE_URL}/en/prestazioni/${p.slug} · ${p.durataMinuti} minutes · ${p.prezzoEuro} €`,
          "",
          prestazioniEn[p.slug]?.descrizione ?? p.descrizione,
          "",
        ]),
    ]),
    "## Doctors",
    "",
    ...medici.map((m) => `- [${m.nome}](${SITE_URL}/en/medici/${m.slug}): ${mediciEn[m.slug]?.bio ?? m.bio}`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
