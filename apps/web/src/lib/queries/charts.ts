import { db, count, sql, eq, and, gt, lte, gte, desc, asc } from "db";
import { data, users, checkins } from "db/schema";

export async function getRegistrationsByMonth() {
	const monthlyRegistrations = await db
		.select({
			month: sql`strftime('%m', ${users.joinDate})`.mapWith(Number),
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

// Checkins by month
export async function getCheckinsByMonth() {
	const monthlyCheckins = await db
		.select({
			month: sql`EXTRACT(MONTH FROM ${checkins.time})`.mapWith(Number),
			year: sql`EXTRACT(YEAR FROM ${checkins.time})`.mapWith(Number),
			count: count(),
		})
		.from(checkins)
		.where(
			sql`EXTRACT(YEAR FROM ${checkins.time}) = EXTRACT(YEAR FROM NOW()) AND ${checkins.time} < NOW()`,
		)
		.groupBy(
			sql`EXTRACT(MONTH FROM ${checkins.time})`,
			sql`EXTRACT(YEAR FROM ${checkins.time})`,
		)
		.orderBy(sql`EXTRACT(MONTH FROM ${checkins.time})`);

	// Create array of all months with count 0
	const allMonths = Array.from({ length: 12 }, (_, i) => ({
		month: i + 1,
		count: 0,
	}));

	// Merge in actual checkin counts
	monthlyCheckins.forEach((checkin) => {
		allMonths[checkin.month - 1].count = checkin.count;
	});

	return allMonths;
}

export async function getUserClassifications() {
	return await db
		.select({
			classification: sql`LOWER(${data.classification})`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(REPLACE(${data.classification}, ' ', '-')),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(
			sql`LOWER(${data.classification})`,
			sql`LOWER(REPLACE(${data.classification}, ' ', '-'))`,
		)
		.orderBy(desc(count()));
}

// Get gender distribution of members
export async function getGenderDistribution() {
	// Query the unnested gender array to count each gender
	const result = await db
		.select({
			gender: sql`LOWER(unnest(${data.gender}))`.mapWith(String),
			fill: sql`CONCAT('var(--color-',LOWER(REPLACE(unnest(${data.gender}), ' ', '-')),')')`.mapWith(
				String,
			),
			count: count(),
		})
		.from(data)
		.groupBy(
			sql`LOWER(unnest(${data.gender}))`,
			sql`LOWER(REPLACE(unnest(${data.gender}), ' ', '-'))`,
		)
		.orderBy(desc(count()));

	return result;
}

// Get race/ethnicity distribution of members
export async function getRaceDistribution() {
	const result = await db
		.select({
			race: sql`LOWER(unnest(${data.ethnicity}))`.mapWith(String),
			count: count(),
			fill: sql`CONCAT('var(--color-',LOWER(REPLACE(unnest(${data.ethnicity}), ' ', '-')),')')`.mapWith(
				String,
			),
		})
		.from(data)
		.groupBy(
			sql`LOWER(unnest(${data.ethnicity}))`,
			sql`LOWER(REPLACE(unnest(${data.ethnicity}), ' ', '-'))`,
		)
		.orderBy(desc(count()));

	return result.map((item) => ({
		...item,
		race: item.race.toLowerCase(),
	}));
}

// Get active members count (members who checked in at least once in the last 30 days)
export async function getActiveMembers() {
	const result = await db
		.select({
			activeMembers: count(sql`DISTINCT ${checkins.userID}`),
		})
		.from(checkins)
		.where(sql`${checkins.time} >= NOW() - INTERVAL '30 days'`);

	return result[0]?.activeMembers || 0;
}

// Get retention rate (percentage of members who were active last month and remained active this month)
export async function getRetentionRate() {
	// Members active last month
	const lastMonthActiveUsers = await db
		.select({
			userID: checkins.userID,
		})
		.from(checkins)
		.where(
			sql`${checkins.time} >= NOW() - INTERVAL '60 days' AND ${checkins.time} < NOW() - INTERVAL '30 days'`,
		)
		.groupBy(checkins.userID);

	// Members active this month
	const thisMonthActiveUsers = await db
		.select({
			userID: checkins.userID,
		})
		.from(checkins)
		.where(sql`${checkins.time} >= NOW() - INTERVAL '30 days'`)
		.groupBy(checkins.userID);

	const lastMonthUserIds = lastMonthActiveUsers.map((u) => u.userID);
	const thisMonthUserIds = thisMonthActiveUsers.map((u) => u.userID);

	// Count users who were active both last month and this month
	const retainedUsers = lastMonthUserIds.filter((id) =>
		thisMonthUserIds.includes(id),
	);

	// Calculate retention rate (handle division by zero)
	return lastMonthUserIds.length > 0
		? Math.round((retainedUsers.length / lastMonthUserIds.length) * 100)
		: 0;
}

// Get growth rate compared to previous month
export async function getGrowthRate() {
	// Current month signups
	const currentMonthResult = await db
		.select({
			count: count(),
		})
		.from(users)
		.where(
			sql`${users.joinDate} >= DATE_TRUNC('month', NOW()) AND ${users.joinDate} < NOW()`,
		);

	// Previous month signups
	const previousMonthResult = await db
		.select({
			count: count(),
		})
		.from(users)
		.where(
			sql`${users.joinDate} >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') AND ${users.joinDate} < DATE_TRUNC('month', NOW())`,
		);

	const currentMonthCount = currentMonthResult[0]?.count || 0;
	const previousMonthCount = previousMonthResult[0]?.count || 1; // Avoid division by zero

	return parseFloat(
		(
			((currentMonthCount - previousMonthCount) / previousMonthCount) *
			100
		).toFixed(1),
	);
}

// Get activity by day of week
export async function getActivityByDayOfWeek() {
	const result = await db
		.select({
			day: sql`TO_CHAR(${checkins.time}, 'Dy')`.mapWith(String),
			count: count(),
		})
		.from(checkins)
		.where(sql`${checkins.time} >= NOW() - INTERVAL '90 days'`)
		.groupBy(
			sql`TO_CHAR(${checkins.time}, 'Dy')`,
			sql`TO_CHAR(${checkins.time}, 'ID')`,
		)
		.orderBy(sql`TO_CHAR(${checkins.time}, 'ID')`); // Order by day number (Mon=1, Sun=7)

	return result;
}

// Get most active day
export async function getMostActiveDay() {
	const result = await db
		.select({
			day: sql`TO_CHAR(${checkins.time}, 'Day')`.mapWith(String),
			count: count(),
		})
		.from(checkins)
		.where(sql`${checkins.time} >= NOW() - INTERVAL '90 days'`)
		.groupBy(sql`TO_CHAR(${checkins.time}, 'Day')`)
		.orderBy(desc(count()))
		.limit(1);

	return result[0]?.day.trim() || "Wednesday";
}

// Get activity by time of day
export async function getActivityByTimeOfDay() {
	const timeSlots = [
		{ slot: "6-9 AM", start: 6, end: 9 },
		{ slot: "9-12 PM", start: 9, end: 12 },
		{ slot: "12-3 PM", start: 12, end: 15 },
		{ slot: "3-6 PM", start: 15, end: 18 },
		{ slot: "6-9 PM", start: 18, end: 21 },
		{ slot: "9-12 AM", start: 21, end: 24 },
	];

	const results = [];

	// Run query for each time slot
	for (const slot of timeSlots) {
		const result = await db
			.select({
				count: count(),
			})
			.from(checkins)
			.where(
				sql`${checkins.time} >= NOW() - INTERVAL '90 days' AND EXTRACT(HOUR FROM ${checkins.time}) >= ${slot.start} AND EXTRACT(HOUR FROM ${checkins.time}) < ${slot.end}`,
			);

		results.push({
			time: slot.slot,
			count: result[0]?.count || 0,
		});
	}

	return results;
}

// Get membership status distribution
export async function getMembershipStatus() {
	const statusColors: Record<string, string> = {
		Active: "bg-green-500",
		Trial: "bg-blue-500",
		Expired: "bg-amber-500",
		Inactive: "bg-red-500",
	};

	// Since we don't have a memberships table, we'll use the users table
	// and derive status from joinDate for demonstration purposes
	const result = await db
		.select({
			status: sql`CASE 
                WHEN ${users.joinDate} >= NOW() - INTERVAL '7 days' THEN 'Trial'
                WHEN ${users.joinDate} >= NOW() - INTERVAL '90 days' THEN 'Active'
                WHEN ${users.joinDate} >= NOW() - INTERVAL '180 days' THEN 'Expired'
                ELSE 'Inactive'
              END`.mapWith(String),
			count: count(),
		})
		.from(users)
		.groupBy(
			sql`CASE 
            WHEN ${users.joinDate} >= NOW() - INTERVAL '7 days' THEN 'Trial'
            WHEN ${users.joinDate} >= NOW() - INTERVAL '90 days' THEN 'Active'
            WHEN ${users.joinDate} >= NOW() - INTERVAL '180 days' THEN 'Expired'
            ELSE 'Inactive'
          END`,
		)
		.orderBy(desc(count()));

	return result.map((item) => ({
		...item,
		color: statusColors[item.status] || "bg-gray-500",
	}));
}
