import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, serial, text, timestamp, vector } from 'drizzle-orm/pg-core';

import { now } from '../utils';

export type KnowledgeMeta = {
  lang: string;
  tags: string[];
  source: string;
  version: number;
  allowGeneralFallback?: boolean;
};

export const knowledge = pgTable(
  'knowledge',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    keywords: text('keywords')
      .array()
      .default(sql`ARRAY[]::text[]`),
    content: text('content').notNull(),
    meta: jsonb('meta')
      .$type<KnowledgeMeta>()
      .default({} as KnowledgeMeta),
    embedding: vector('embedding', { dimensions: 1536 }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(now),
  },
  (table) => ({
    // 1. Vector similarity search index (HNSW - best for 1536 dimensions)
    // HNSW is optimal for high-dimensional vectors (1536) with better recall/performance
    embeddingHnswIdx: index('knowledge_embedding_hnsw_idx')
      .using('hnsw', table.embedding.op('vector_cosine_ops'))
      .with({
        m: 16, // connections per layer (default 16, good for 1536 dims)
        ef_construction: 64, // search width during construction (higher = better recall)
      }),

    // 2. Full-text search index for semantic search
    // Combines title and content for comprehensive text search
    titleContentSearchIdx: index('knowledge_title_content_search_idx').using(
      'gin',
      sql`to_tsvector('english', ${table.title} || ' ' || ${table.content})`,
    ),

    // 3. GIN index for keywords array operations
    // Essential for tag-based filtering with @>, &&, <@ operators
    keywordsGinIdx: index('knowledge_keywords_gin_idx').using('gin', table.keywords),

    // 4. JSONB indexes for meta fields (based on your actual data patterns)
    metaLangIdx: index('knowledge_meta_lang_idx').on(sql`((meta->>'lang'))`),

    metaTagsGinIdx: index('knowledge_meta_tags_gin_idx').using('gin', sql`((meta->'tags'))`),

    metaSourceIdx: index('knowledge_meta_source_idx').on(sql`((meta->>'source'))`),

    // 5. Composite indexes for common query patterns
    // Based on your data showing frequent lang + source queries
    langSourceIdx: index('knowledge_lang_source_idx').on(
      sql`((meta->>'lang'))`,
      sql`((meta->>'source'))`,
    ),

    // For retrieving recent content by language (common pattern)
    recentByLangIdx: index('knowledge_recent_by_lang_idx').on(
      sql`((meta->>'lang'))`,
      table.updatedAt.desc(),
    ),

    // 6. Timestamp indexes for time-based queries
    updatedAtIdx: index('knowledge_updated_at_idx').on(table.updatedAt.desc()),
    createdAtIdx: index('knowledge_created_at_idx').on(table.createdAt.desc()),
  }),
);

export type Knowledge = typeof knowledge.$inferSelect;
export type KnowledgeInsert = typeof knowledge.$inferInsert;
