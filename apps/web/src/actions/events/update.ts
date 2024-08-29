"use server";

import { and, db, eq, inArray, sql } from "db";
import { customAlphabet } from "nanoid";
import { updateEventSchema } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { eventCategories, events, eventsToCategories } from "db/schema";
import c from "config";

// const nanoid = customAlphabet(
// 	"1234567890abcdefghijklmnopqrstuvwxyz",
// 	c.events.idLength,
// );

// I know this is a horribly written function, but I don't care it was hard :(
export const updateEvent = adminAction(
	updateEventSchema,
	async ({ eventID, oldCategories, categories, ...e }) => {
		let res = {
			success: true,
			code: "success",
		};
		await db.transaction(async (tx) => {
			const ids = await tx
				.update(events)
				.set(e)
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
			console.log("Got here!");
			// create sets
			// const oldSet: Set<string> = new Set(oldCategories as string[]);
			// console.dir(oldSet);
			// const newSet: Set<string> = new Set(categories as string[]);
			// console.dir(newSet);
			//find new categories
			const newCategories: string[] = categories.filter(
				(item: string) => !oldCategories.includes(item),
			);
			console.log("New Categories", newCategories);

			//find deleting categories
			const deletingCategories: string[] = oldCategories.filter(
				(item: string) => !categories.includes(item),
			);
			console.log("Deleting Categories", deletingCategories);

			const insertVal = newCategories.map((cat) => ({
				eventID,
				categoryID: cat,
			}));

			const events_to_categories = await tx
				.insert(eventsToCategories)
				.values(insertVal)
				.returning();

			// if (events_to_categories.length === insertVal.length) {
			// 	res = {
			// 		success: false,
			// 		code: "events_to_categories_failed",
			// 	};
			// 	tx.rollback();
			// 	return;
			// }

			const deletedVals = await tx
				.delete(eventsToCategories)
				.where(
					and(
						inArray(
							eventsToCategories.categoryID,
							deletingCategories,
						),
						eq(eventsToCategories.eventID, eventID),
					),
				)
				.returning({ deletedID: eventsToCategories.categoryID });

			// if (deletedVals.length === deletingCategories.length) {
			// 	res = {
			// 		success: false,
			// 		code: "events_to_categories_failed",
			// 	};
			// 	tx.rollback();
			// 	return;
			// }
		});

		await db.execute(sql`VACUUM events_to_categories`);

		return res;
	},
);
