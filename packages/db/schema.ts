import {
	bigserial,
	text,
	varchar,
	uniqueIndex,
	boolean,
	timestamp,
	integer,
	json,
	pgEnum,
	primaryKey,
	pgTable,
	PgArray,
} from "drizzle-orm/pg-core";

// export const userData = pgTable("user_data", {
// 	race: text("race").array(),
// });

export const accounts = pgTable("accounts", {
	clerkID: text("clerk_id").primaryKey(),
});

export const users = pgTable("users", {
	memberID: text("member_id").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	interestedEventTypes: text("interested_event_types").array().notNull(),
	role: text("role").notNull().default("member"),
});

export const data = pgTable("data", {
	major: text("major").notNull(),
	universityID: text("short_id").notNull().unique(),
	classification: text("classification").notNull(),
	graduation: timestamp("graduation").notNull(),
	birthday: timestamp("birthday").notNull(),
	gender: text("gender").array().notNull(),
	ethnicity: text("ethnicity").array().notNull(),
	resume: text("resume").notNull(),
	shirtType: text("shirt_size").notNull(),
});

export const eventCategories = pgTable("event_categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	color: text("color").notNull(),
});

export const events = pgTable("events", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	start: timestamp("start").notNull(),
	end: timestamp("end").notNull(),
	checkinStart: timestamp("checkin_start").notNull(),
	checkinEnd: timestamp("checkin_end").notNull(),
	location: text("location").notNull(),
	isUserCheckinable: boolean("is_user_checkinable").notNull().default(true),
	isHidden: boolean("is_hidden").notNull().default(false),
});

export const checkins = pgTable("checkins", {
	eventID: text("event_id").notNull(),
	memberID: text("member_id").notNull(),
	time: timestamp("time").defaultNow().notNull(),
	feedback: text("feedback"),
});
