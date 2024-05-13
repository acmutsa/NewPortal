CREATE TABLE IF NOT EXISTS "checkins" (
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	"feedback" text,
	CONSTRAINT "checkins_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"major" text NOT NULL,
	"short_id" text NOT NULL,
	"classification" text NOT NULL,
	"graduation_month" integer NOT NULL,
	"graduation_year" integer NOT NULL,
	"birthday" timestamp,
	"gender" text[] NOT NULL,
	"ethnicity" text[] NOT NULL,
	"resume" text,
	"shirt_type" text NOT NULL,
	"shirt_size" text NOT NULL,
	"interested_event_types" text[] NOT NULL,
	CONSTRAINT "data_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	CONSTRAINT "event_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"checkin_start" timestamp NOT NULL,
	"checkin_end" timestamp NOT NULL,
	"location" text NOT NULL,
	"is_user_checkinable" boolean DEFAULT true NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events_to_categories" (
	"event_id" text NOT NULL,
	"category_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_category_id_event_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_user_id_data_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "data"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
