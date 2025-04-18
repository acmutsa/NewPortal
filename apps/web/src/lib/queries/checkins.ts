import { count, db, eq, inArray, sql } from "db";
import { checkins } from "db/schema";
import { CheckInUserClientProps } from "db/types";

export const getCheckinLog = async (eventID?: string) => {
	return await db.query.checkins.findMany({
		columns: {
			time: true,
			feedback: true,
			rating: true,
		},
		with: {
			author: {
				columns: {
					userID: true,
					firstName: true,
					lastName: true,
				},
			},
			event: {
				columns: {
					name: true,
				},
			},
		},
		where: eventID != null ? eq(checkins.eventID, eventID) : undefined,
	});
};

export const getCheckinStatsOverview = async (eventID?: string) => {
	const [res] = await db
		.select({ total_checkins: count() })
		.from(checkins)
		.where(eventID != null ? eq(checkins.eventID, eventID) : undefined);
	return res;
};

export const checkInUserClient = async (props: CheckInUserClientProps) => {
	return db.insert(checkins).values({
		...props,
	});
};

export const checkInUserList = async (
	eventID: string,
	universityIDs: string[],
	adminID: number,
) => {
	const userIDs = await db.query.users.findMany({
		where: (users) => inArray(users.universityID, universityIDs),
		columns: { userID: true, universityID: true },
	});

	const successfulIDs = (
		await db
			.insert(checkins)
			.values(
				userIDs.map(({ userID }) => ({
					userID,
					eventID,
					adminID,
				})),
			)
			.returning({ userID: checkins.userID })
			.onConflictDoNothing()
	).map(({ userID }) => userID);

	// Return only failed ids
	const successful = userIDs.filter(({ userID }) =>
		successfulIDs.includes(userID),
	);
	const failed = universityIDs.filter(
		(id) => !successful.some(({ universityID }) => universityID === id),
	);
	return failed;
};
