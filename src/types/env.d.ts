declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DATABASE_URL: string;
    OPENAI_API_KEY: string;
    CRON_SECRET: string;
  }
}
