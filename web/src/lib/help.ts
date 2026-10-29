import "server-only";

import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { embedQuery } from "@/lib/embeddings";

export type HelpHit = {
  docSlug: string;
  docTitle: string;
  section: string;
  content: string;
  score: number;
};

// Same hybrid retrieval as the catalogue, over the help centre sections.
export async function searchHelp(question: string, limit = 4): Promise<HelpHit[]> {
  const q = question.trim().slice(0, 300);
  if (!q) return [];
  const vector = JSON.stringify(await embedQuery(q));
  const rows = await db.execute<HelpHit>(sql`
    with text_hits as (
      select id, row_number() over (
        order by ts_rank_cd(search_vector, websearch_to_tsquery('italian', ${q})) desc
      ) as r
      from kb_chunks
      where search_vector @@ websearch_to_tsquery('italian', ${q})
      limit 20
    ),
    vector_hits as (
      select id, row_number() over (order by embedding <=> ${vector}::vector) as r
      from kb_chunks
      order by embedding <=> ${vector}::vector
      limit 20
    )
    select k.doc_slug as "docSlug", k.doc_title as "docTitle", k.section, k.content,
      (coalesce(1.0 / (60 + t.r), 0) + coalesce(1.0 / (60 + v.r), 0))::float as score
    from text_hits t full outer join vector_hits v on t.id = v.id
    join kb_chunks k on k.id = coalesce(t.id, v.id)
    order by score desc
    limit ${limit}
  `);
  return [...rows];
}
