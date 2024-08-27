"use server";

import { db, eq, inArray, sql } from "db";
import { customAlphabet } from "nanoid";
import { updateEventSchemaFormified } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { eventCategories, events, eventsToCategories } from "db/schema";
import c from "config";

// const nanoid = customAlphabet(
// 	"1234567890abcdefghijklmnopqrstuvwxyz",
// 	c.events.idLength,
// );

// I know this is a horribly written function, but I don't care it was hard :(
export const updateEvent = adminAction(
	updateEventSchemaFormified,
	async ({ eventID, oldCategories, categories, ...e }) => {
		let res = {
			success: true,
			code: "success",
		};
		await db.transaction(async (tx) => {
			const ids = await tx
				.update(events)
				.set({ ...e })
				.where(eq(events.id, eventID))
				.returning({ eventID: events.id });

			if (ids.length === 0) {
				res = {
					success: false,
					code: "update_event_failed",
				};
				tx.rollback();
				return;
			}

			// const { id } = ids[0];

			// create sets
			const oldSet = new Set(oldCategories as string[]);
			console.dir(oldSet);
			const newSet = new Set(categories as string[]);
			console.dir(newSet);
			//find new categories
			const newCategories = newSet.difference(oldSet);

			//find deleting categories
			const deletingCategories = oldSet.difference(newSet);

			const newCatArray = Array.from(newCategories) as string[];
			const newCatIds = await tx
				.select({ id: eventCategories.id })
				.from(eventCategories)
				.where(inArray(eventCategories.name, newCatArray));
			const oldCatArray = Array.from(deletingCategories) as string[];
			const oldCatIds = await tx
				.select({ id: eventCategories.id })
				.from(eventCategories)
				.where(inArray(eventCategories.name, oldCatArray));

			const insertVal = newCatIds.map((cat) => ({
				eventID,
				categoryID: cat.id,
			}));

			const events_to_categories = await tx
				.insert(eventsToCategories)
				.values(insertVal)
				.returning();

			if (events_to_categories.length === insertVal.length) {
				res = {
					success: false,
					code: "events_to_categories_failed",
				};
				tx.rollback();
				return;
			}

			const deletedVals = await tx
				.delete(eventsToCategories)
				.where(
					inArray(
						eventsToCategories.categoryID,
						oldCatIds.map((o) => o.id),
					),
				)
				.returning({ deletedID: eventsToCategories.categoryID });

			if (deletedVals.length === oldCatIds.length) {
				res = {
					success: false,
					code: "events_to_categories_failed",
				};
				tx.rollback();
				return;
			}
		});

		await db.execute(sql`VACUUM events_to_categories`);

		return res;
	},
);
