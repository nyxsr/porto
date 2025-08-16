import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/db/schemas/**/*.ts',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});
