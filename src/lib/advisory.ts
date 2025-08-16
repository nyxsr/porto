import { db } from '@/db';
import { sql } from 'drizzle-orm';

const LOCK_KEY = BigInt('781234567890123456'); // This is a unique identifier for the advisory lock

export async function advisoryLock() {
  await db.execute(sql`SELECT pg_advisory_lock(${LOCK_KEY})`);
}
export async function advisoryUnlock() {
  await db.execute(sql`SELECT pg_advisory_unlock(${LOCK_KEY})`);
}
