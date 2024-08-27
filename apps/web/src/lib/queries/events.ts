import { db, eq } from "db";
import { eventCategories, events, eventsToCategories } from "db/schema";
import { iEvent, uEvent } from "../constants/events";

export async function getEventWithCategoriesById(id: string): Promise<iEvent> {
	console.log("Id:", id);

	const event = await db.query.events.findFirst({
		where: () => eq(events.id, id),
	});

	if (!event) {
		throw Error("Event does not exist");
	}

	const categories = await db
		.select({ id: eventCategories.id, name: eventCategories.name })
		.from(eventsToCategories)
		.where(eq(eventsToCategories.eventID, id))
		.rightJoin(
			eventCategories,
			eq(eventsToCategories.categoryID, eventCategories.id),
		);

	return {
		...event,
		categories: categories.map((row) => row.name),
	} as uEvent;
}
