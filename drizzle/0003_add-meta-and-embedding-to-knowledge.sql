CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "knowledge" ADD COLUMN "meta" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "embedding" vector(1536);
