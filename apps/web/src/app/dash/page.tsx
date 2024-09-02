import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";
import c from "config";
import Image from "next/image";
import CircularProgressBar from "@/components/shared/circular-progress";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
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

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			data: true,
		},
	});

	if (!user) return redirect("/onboarding");
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
									{`${user.data.major}, ${user.data.graduationYear}`}
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-2"
								>
									Edit Profile
								</Button>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Attendance Points</CardTitle>
							<CardDescription>
								{`${new Date().getMonth() > 6 ? "Fall" : "Spring"} Semester ${new Date().getFullYear()}`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{0}</div>
							<p className="mt-2 text-sm text-muted-foreground">
								Keep attending events to earn more points!
							</p>
						</CardContent>
					</Card>
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
