import { sql } from 'drizzle-orm';
import { jsonb, pgTable, serial, text, timestamp, vector } from 'drizzle-orm/pg-core';

import { now } from '../utils';

export type KnowledgeMeta = {
  lang: string;
  tags: string[];
  source: string;
  version: number;
  allowGeneralFallback?: boolean; // optional (Education sample omits this)
};

export const knowledge = pgTable('knowledge', {
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
});

export type Knowledge = typeof knowledge.$inferSelect;
export type KnowledgeInsert = typeof knowledge.$inferInsert;
