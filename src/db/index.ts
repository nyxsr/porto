import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as convo from './schemas/convo';
import * as knowledge from './schemas/knowledge';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle({
  client: sql,
  schema: {
    ...convo,
    ...knowledge,
  },
});
