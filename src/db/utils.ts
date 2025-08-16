import { sql } from 'drizzle-orm';

export function now() {
  return sql<string>`now()`;
}
