ALTER TABLE "convo" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "knowledge" ALTER COLUMN "createdAt" DROP NOT NULL;