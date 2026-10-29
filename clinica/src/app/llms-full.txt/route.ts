import { medici } from "@/data/medici";
import { prestazioni } from "@/data/prestazioni";
import { specialita } from "@/data/specialita";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/seo";

// The long form of llms.txt: the same data the pages show, as plain Markdown.
export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
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
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
