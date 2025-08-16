import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as convo from './schemas/convo';
import * as knowledge from './schemas/knowledge';

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL, // ?sslmode=require
  ssl: { rejectUnauthorized: false },
});

export const dbScript = drizzle(pool, { schema: { ...convo, ...knowledge } });
