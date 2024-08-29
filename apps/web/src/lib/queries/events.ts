import { db, eq } from "db";
import { eventCategories, events, eventsToCategories } from "db/schema";
import { iEvent, uEvent } from "../constants/events";

export async function getEventWithCategoriesById(id: string): Promise<uEvent> {
	console.log("Id:", id);

	const event = await db.query.events.findFirst({
		where: () => eq(events.id, id),
		with: {
			eventsToCategories: {
				with: {
					category: {
						columns: {
							name: true,
						},
					},
				},
			},
		},
		columns: {
			id: false,
		},
	});

	if (!event) {
		throw Error("Event does not exist");
	}

	// const categories = await db
	// 	.select({ id: eventCategories.id, name: eventCategories.name })
	// 	.from(eventsToCategories)
	// 	.where(eq(eventsToCategories.eventID, id))
	// 	.rightJoin(
	// 		eventCategories,
	// 		eq(eventsToCategories.categoryID, eventCategories.id),
	// 	);

	return {
		name: event.name,
		description: event.description,
		id: id,
		start: event.start,
		end: event.end,
		checkinStart: event.checkinStart,
		checkinEnd: event.checkinEnd,
		location: event.location,
		categories: event.eventsToCategories.map((cat) => cat.category.name),
		thumbnailUrl: event.thumbnailUrl,
		isUserCheckinable: event.isUserCheckinable,
		isHidden: event.isHidden,
		points: event.points,
	};
}
