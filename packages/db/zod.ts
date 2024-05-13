import { createInsertSchema } from "drizzle-zod";
import { data, users } from "./schema";

export const insertUserDataSchema = createInsertSchema(data);
export const insertUserSchema = createInsertSchema(users);
export const insertUserWithDataSchema = insertUserSchema.extend({
	data: insertUserDataSchema,
});
