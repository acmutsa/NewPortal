"use server";

import { and, db, eq, inArray, sql } from "db";
import { updateEventSchema } from "db/zod";
import { adminAction } from "@/lib/safe-action";
import { events, eventsToCategories } from "db/schema";
import { revalidatePath } from "next/cache";

export const updateEvent = adminAction
	.schema(updateEventSchema)
	.action(async ({ parsedInput }) => {
		let res = {
			success: true,
			code: "success",
		};
		const { eventID, oldCategories, categories, ...e } = parsedInput;
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
			}

			//find new categories
			const newCategories: string[] = categories.filter(
				(item: string) => !oldCategories.includes(item),
			);

			//find deleting categories
			const deletingCategories: string[] = oldCategories.filter(
				(item: string) => !categories.includes(item),
			);

			const insertVal = newCategories.map((cat) => ({
				eventID,
				categoryID: cat,
			}));

			if (insertVal.length !== 0) {
				await tx.insert(eventsToCategories).values(insertVal);
			}

			if (deletingCategories.length != 0) {
				await tx
					.delete(eventsToCategories)
					.where(
						and(
							inArray(
								eventsToCategories.categoryID,
								deletingCategories,
							),
							eq(eventsToCategories.eventID, eventID),
						),
					);
			}
		});
		// VACUUM is handled by Libsql according to: https://discord.com/channels/933071162680958986/1200296371484368956
		// await db.run(sql`PRAGMA VACUUM`);
		// revalidatePath("/admin/events");
		// revalidatePath("/events");

		return res;
	});
