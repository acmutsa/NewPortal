ALTER TABLE "data" DROP CONSTRAINT "data_short_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "short_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "data" DROP COLUMN IF EXISTS "short_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_short_id_unique" UNIQUE("short_id");