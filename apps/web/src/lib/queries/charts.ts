import { db, count, sql } from "db";
import { data, users } from "db/schema";

export async function getRegistrationsByMonth() {
	const monthlyRegistrations = await db
		.select({
			month: sql`EXTRACT(MONTH FROM ${users.joinDate})`.mapWith(Number),
			count: count(),
		})
		.from(users)
		.where(
			sql`EXTRACT(YEAR FROM ${users.joinDate}) = EXTRACT(YEAR FROM NOW()) AND ${users.joinDate} < NOW()`,
		)
		.groupBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`)
		.orderBy(sql`EXTRACT(MONTH FROM ${users.joinDate})`);

	// Create array of all months with count 0
	const allMonths = Array.from({ length: 12 }, (_, i) => ({
		month: i + 1,
		count: 0,
	}));

	// Merge in actual registration counts
	monthlyRegistrations.forEach((reg) => {
		allMonths[reg.month - 1].count = reg.count;
	});

	return allMonths;
}

export async function getUserClassifications() {
	return await db
		.select({
			classification: sql`LOWER(${data.classification})`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(${data.classification}),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(sql`LOWER(${data.classification})`.mapWith(String));
}

export async function getGenderDistribution() {
	return await db
		.select({
			gender: sql`LOWER(${data.gender})`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(${data.gender}),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(sql`LOWER(${data.gender})`.mapWith(String));
}
