import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { now } from '../utils';

export const convo = pgTable(
  'convo',
  {
    id: serial('id').primaryKey(),
    sid: varchar('sid', { length: 64 }).notNull(),
    role: varchar('role', { length: 32 }).notNull(), // user, assistant, system
    content: text('content').notNull(),
    meta: jsonb('meta')
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(now),
  },
  (t) => ({
    // Access by session quickly
    sidIdx: index('convo_sid_idx').on(t.sid),

    // Critical: support "last N messages for sid ordered by created_at"
    sidCreatedIdx: index('convo_sid_created_idx').on(t.sid, t.createdAt),
  }),
);

export type Convo = typeof convo.$inferSelect;
export type ConvoInsert = typeof convo.$inferInsert;
