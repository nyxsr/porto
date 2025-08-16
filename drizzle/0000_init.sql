CREATE TABLE "convo" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"role" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
