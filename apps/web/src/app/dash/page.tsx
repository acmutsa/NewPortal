import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users,data,checkins,events } from "db/schema";
import { eq,count,between,sum,sql } from "db/drizzle";
import { redirect } from "next/navigation";
import c from "config";
import { RadialChartProgress } from "@/components/shared/circular-progress";
import { getUserCheckins } from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	CalendarIcon,
	GraduationCapIcon,
	MapPinIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";


interface AttendedEvents {
	id: string;
	name: string;
	points: number;
	start: typeof events.start;
}
export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	// Cache this later
	const queryResult = await db
		.select({
			user: users,
			userData: data,
			attendedEvents: sql<
				Array<AttendedEvents>
			>`JSONB_AGG(JSONB_BUILD_OBJECT(
			'id', ${events.id},
			'name', ${events.name},
			'points', ${events.points},
			'start', ${events.start}) ORDER BY ${events.start} DESC)`.as("attendedEvents"),
			// Still do not think the dates are working right here
			currentSemesterPoints:
				sql`SUM(${events.points}) FILTER (WHERE ${checkins.time} BETWEEN ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.mapWith(
					Number,
				),
			totalPoints: sum(events.points),
			currentSemesterEventsAttended: count(
				between(
					checkins.time,
					c.semesters.current.startDate,
					c.semesters.current.endDate,
				),
			),
			totalEventsAttended: count(checkins.userID),
			userCheckins: sql`ARRAY_AGG(${checkins.eventID})`,
		})
		.from(users)
		.innerJoin(data, eq(users.userID, data.userID))
		.leftJoin(checkins, eq(users.userID, checkins.userID))
		.leftJoin(events, eq(events.id, checkins.eventID))
		.groupBy(users.userID, data.userID)
		.where(eq(users.clerkID, userId));

	if (queryResult.length === 0) {
		return redirect("/sign-in");
	}

	const userDashResult = queryResult[0];

	const {
		user,
		userData,
		currentSemesterPoints,
		totalPoints,
		currentSemesterEventsAttended,
		totalEventsAttended,
		attendedEvents,
		// checkins,
	} = userDashResult;

	const hasUserMetRequiredPoints =
		currentSemesterPoints >= c.semesters.current.pointsRequired;

	const radialChartProgressProps = {
		titleText: "Attendance Points",
		descriptionText: c.semesters.current.title,
		current: currentSemesterPoints ?? 0,
		total: c.semesters.current.pointsRequired,
		footerText: hasUserMetRequiredPoints
			? "Way To Go! You have gained enough points to attend our banquet🎉"
			: `Keep attending avents to earn more points!`,
	};

	console.log(userDashResult.attendedEvents);

	const slicedEvents = attendedEvents.slice(0, 5);

	return (
		<main className="flex min-h-[calc(100vh-4rem)] w-screen items-center justify-center pb-4">
			<div>
				<div>
					<h2 className="text-xl font-bold">Welcome,</h2>
					<h1 className="pb-5 text-5xl font-black">
						{user.firstName}
					</h1>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle>Profile</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-row items-center gap-5">
							<Avatar className="h-20 w-20">
								<AvatarImage src={""} alt={user.firstName} />
								<AvatarFallback>
									{`${user.firstName.charAt(0) + user.lastName.charAt(0)}`}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<h2 className="text-xl font-semibold">
									{user.firstName} {user.lastName}
								</h2>
								<p className="mt-1 flex items-center text-sm text-muted-foreground">
									<GraduationCapIcon className="mr-2 h-4 w-4" />
									{`${userData.major}, ${userData.graduationYear}`}
								</p>
								{/* <Button
									variant="outline"
									size="sm"
									className="mt-2 opacity-0">
									Edit Profile
								</Button> */}
							</div>
						</CardContent>
					</Card>

					<RadialChartProgress {...radialChartProgressProps} />

					<Card className="md:col-span-3">
						<CardHeader>
							<CardTitle> Recent Activity </CardTitle>
							<div className="flex w-full flex-col items-start justify-between border-b border-muted py-2 text-muted-foreground md:flex-row md:items-center md:justify-start md:gap-6">
								<p>{`Events this semester: ${currentSemesterEventsAttended}`}</p>
								<p>{`Events Total: ${totalEventsAttended}`}</p>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4 flex flex-col">
								{slicedEvents?.map((event, index) => (
									<Link
										href={`events/${event.id}`}
										key={index}
										
									>
										<li className="flex items-center justify-between border-b pb-2 last:border-0">
											<div className="flex items-center space-x-2">
												<span>{event.name}</span>
											</div>
										</li>
									</Link>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}

export const runtime = 'edge'
export const revalidate = 30