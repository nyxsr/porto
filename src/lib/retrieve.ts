import { db } from '@/db';
import { sql } from 'drizzle-orm';

export type KBHit = {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta: { allowGeneralFallback?: boolean; [k: string]: unknown } | null;
  sim: number;
};

type Options = {
  k?: number;
  minScore?: number; // 0..1, similarity threshold
  lang?: string; // meta.lang == lang
  requireTags?: string[]; // intersects keywords
  setProbes?: number; // ivfflat.probes
};

/**
 * Vector search over knowledge.
 * `queryEmbedding` must be the same dimension as your `embedding` column (1536).
 */
export async function searchByEmbedding(
  queryEmbedding: number[],
  opts: Options = {},
): Promise<KBHit[]> {
  const { k = 5, minScore = 0.15, lang, requireTags } = opts;

  // Build a proper vector literal once (no sql.raw needed);
  // We pass the array as JSON and cast in SQL to vector.
  // Postgres will param-bind the JSON safely.
  const vecJson = JSON.stringify(queryEmbedding);

  // Optional WHERE fragments
  const langFilter = lang ? sql`AND meta->>'lang' = ${lang}` : sql``;
  const tagsFilter =
    requireTags && requireTags.length
      ? sql`AND keywords && ${`{${requireTags.join(',')}}`}::text[]`
      : sql``;

  // Build the main query without SET LOCAL (which may not work in all contexts)
  // NOTICE:
  // We cast from JSON → text → vector to avoid hand-building a '[...]' string.
  // embedding <=> (<json>::text::vector)
  const { rows } = await db.execute<KBHit>(sql`
    WITH query_vec AS (
      SELECT (${vecJson}::json)::text::vector AS v
    )
    SELECT id, slug, title, content, meta,
           1 - (embedding <=> (SELECT v FROM query_vec)) AS sim
    FROM knowledge
    WHERE embedding IS NOT NULL
      ${langFilter}
      ${tagsFilter}
    ORDER BY embedding <=> (SELECT v FROM query_vec)
    LIMIT ${k};
  `);

  return (rows ?? [])
    .map((r) => ({
      ...r,
      meta: r.meta ?? {},
    }))
    .filter((r) => r.sim >= minScore);
}
