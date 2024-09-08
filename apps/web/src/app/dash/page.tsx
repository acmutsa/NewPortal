import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users,data,checkins,events } from "db/schema";
import { eq,count,between,sum,sql } from "db/drizzle";
import { redirect } from "next/navigation";
import c from "config";
import Image from "next/image";
import { RadialChartProgress } from "@/components/shared/circular-progress";

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

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-in");

	// Cache this later
	const queryResult = await db
		.select({
			user: users,
			userData: data,
			events:events,
			// Still do not think the dates are working right here
			currentSemesterPoints: sql`SUM(${events.points}) FILTER (WHERE ${checkins.time} BETWEEN ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.mapWith(Number),
			totalPoints: sum(events.points),
			currentSemesterEventsAttended: count(
				between(
					checkins.time,
					c.semesters.current.startDate,
					c.semesters.current.endDate,
				),
			),
			totalEventsAttended: count(checkins.eventID),
			checkins: checkins,
		})
		.from(users)
		.innerJoin(data, eq(users.userID, data.userID))
		.leftJoin(checkins, eq(users.userID, checkins.userID))
		.leftJoin(events, eq(events.id, checkins.eventID))
		.groupBy(checkins.userID, checkins.eventID, users.userID, data.userID,events.id)
		.where(eq(users.clerkID, userId));

		console.log(queryResult);
	
		

	if (!queryResult || queryResult.length < 1) return redirect("/onboarding");
	
	const userDashResult = queryResult[0];

	const {
		user,
		userData,
		currentSemesterPoints,
		totalPoints,
		currentSemesterEventsAttended,
		totalEventsAttended,
		// checkins,
	} = userDashResult;

	const hasUserMetRequiredPoints = currentSemesterPoints >= c.semesters.current.pointsRequired;

	const radialChartProgressProps = {
		titleText: "Attendance Points",
		descriptionText: c.semesters.current.title,
		current: currentSemesterPoints ?? 0,
		total: c.semesters.current.pointsRequired,
		footerText: hasUserMetRequiredPoints ? 'Way To Go! You have gained enough points to attend our banquet🎉': `Keep Attending Events to earn more points!`,
	};
	
	return (
		<main className="flex min-h-[calc(100vh-4rem)] w-screen items-center justify-center">
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
						<CardContent className="flex items-center space-x-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={""} alt={user.firstName} />
								<AvatarFallback>
									{`${user.firstName.charAt(0) + user.lastName.charAt(-1)}`}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="text-xl font-semibold">
									{user.firstName} {user.lastName}
								</h2>
								<p className="mt-1 flex items-center text-sm text-muted-foreground">
									<GraduationCapIcon className="mr-2 h-4 w-4" />
									{`${userData.major}, ${userData.graduationYear}`}
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-2 opacity-0"
								>
									Edit Profile
								</Button>
							</div>
						</CardContent>
					</Card>

					<RadialChartProgress {...radialChartProgressProps}>
						
					</RadialChartProgress>
					
					{/* <Card>
						<CardHeader>
							<CardTitle>Attendance Points</CardTitle>
							<CardDescription>
								<div className="flex w-full flex-row items-center justify-between">
									<p>{c.semesters.current.title}</p>
									<p>Total Points</p>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex w-full flex-row items-center justify-between">
								<p className="text-3xl font-bold">
									{currentSemesterCheckins}
								</p>
								<p className="text-3xl font-bold">
									{totalCheckins}
								</p>
								<CircularProgressBar current={8} total={c.semesters.current.pointsRequired} size={150} />
							</div>
						</CardContent>
						<CardFooter>
							<p className="mt-2 text-sm text-muted-foreground">
								Keep attending events to earn more points!
							</p>
						</CardFooter>
					</Card> */}



					<Card className="md:col-span-3">
						<CardHeader>
							<CardTitle>Your Activity</CardTitle>
						</CardHeader>
						<CardContent>
							{/* <ul className="space-y-4">
								{user.recentEvents.map((event, index) => (
									<li
										key={index}
										className="flex items-center justify-between border-b pb-2 last:border-0"
									>
										<div className="flex items-center space-x-2">
											<CalendarIcon className="h-5 w-5 text-muted-foreground" />
											<span>{event.name}</span>
										</div>
										<Badge variant="secondary">
											{event.date}
										</Badge>
									</li>
								))}
							</ul> */}
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}

export const runtime = 'edge'
export const revalidate = 30