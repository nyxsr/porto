#!/usr/bin/env tsx

import 'dotenv/config';

import { eq } from 'drizzle-orm';

import { advisoryLock, advisoryUnlock } from '@/lib/advisory';
import { embedBatch, EMBEDDING_DIM, withRetry } from '@/lib/embedding';

import { knowledge } from './schemas/knowledge';
import { dbScript as db } from './script-db';
import { knowledgeSeeds } from './seeds/knowledge';

function chunk<T>(arr: T[], n = 16) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export async function seedDatabase() {
  const force = process.argv.includes('--force');
  console.log(`Seeding knowledge (force=${force})…`);
  await advisoryLock();
  try {
    await db.transaction(async (tx) => {
      for (const row of knowledgeSeeds) {
        await tx
          .insert(knowledge)
          .values({
            slug: row.slug,
            title: row.title,
            keywords: row.keywords ?? [],
            content: row.content,
            meta: row.meta,
          })
          .onConflictDoUpdate({
            target: knowledge.slug,
            set: {
              title: row.title,
              keywords: row.keywords ?? [],
              content: row.content,
              meta: row.meta,
              updatedAt: new Date(),
            },
          });
      }
    });

    console.log('Upserted seed rows. ✅');

    const rows = await db.query.knowledge.findMany({
      columns: { id: true, slug: true, title: true, content: true, embedding: true },
    });

    const targets = force ? rows : rows.filter((r) => r.embedding == null);
    if (!targets.length) {
      console.log('No rows require embedding. ✅');
      return;
    }

    console.log(`Preparing embeddings for ${targets.length} row(s)…`);

    type EmbPack = { id: string; slug: string; vector: number[] };
    const toWrite: EmbPack[] = [];
    for (const group of chunk(targets, 16)) {
      const texts = group.map((g) => `${g.title}\n\n${g.content}`);
      const vectors = await withRetry(() => embedBatch(texts));
      for (let i = 0; i < group.length; i++) {
        const vec = vectors[i];
        if (!vec || vec.length !== EMBEDDING_DIM) {
          throw new Error(`Bad embedding dim for ${group[i].slug}`);
        }
        toWrite.push({ id: String(group[i].id), slug: group[i].slug, vector: vec });
      }
    }
    console.log('Embeddings computed. ✅');

    // If you prefer smaller locks, use per-batch transactions instead:
    for (const group of chunk(toWrite, 64)) {
      await db.transaction(async (tx) => {
        for (const pack of group) {
          await tx
            .update(knowledge)
            .set({ embedding: pack.vector, updatedAt: new Date() })
            .where(eq(knowledge.id, Number(pack.id)));
        }
      });
    }
    console.log('Seeding embeddings complete. ✅');
  } catch (err) {
    console.error('Seeding embeddings failed:', err);
    process.exitCode = 1;
  } finally {
    await advisoryUnlock();
  }
}

seedDatabase();
