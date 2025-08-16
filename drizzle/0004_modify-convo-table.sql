ALTER TABLE "convo" ALTER COLUMN "role" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "convo" ADD COLUMN "sid" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "convo" ADD COLUMN "mode" varchar(32) DEFAULT '';--> statement-breakpoint
ALTER TABLE "convo" ADD COLUMN "meta" jsonb DEFAULT '{}'::jsonb;