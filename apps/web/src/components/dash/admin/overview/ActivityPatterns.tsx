import { Suspense } from "react";
import {
	getActivityByTimeOfDay,
	getMembershipStatus,
} from "@/lib/queries/charts";
import TimeOfDayChart from "./TimeOfDayChart";
import MembershipStatusChart from "./MembershipStatusChart";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function ActivityPatterns() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold tracking-tight">
					Activity Patterns
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Suspense
					fallback={
						<LoadingCard
							title="Activity by Time of Day"
							description="When members most frequently visit"
						/>
					}
				>
					<TimeOfDayCard />
				</Suspense>
				<Suspense
					fallback={
						<LoadingCard
							title="Membership Status"
							description="Distribution of member statuses"
						/>
					}
				>
					<MembershipStatusCard />
				</Suspense>
			</div>
		</div>
	);
}

function LoadingCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex h-[150px] items-center justify-center">
					Loading...
				</div>
			</CardContent>
		</Card>
	);
}

async function TimeOfDayCard() {
	const activityByTimeOfDay = await getActivityByTimeOfDay();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">
					Activity by Time of Day
				</CardTitle>
				<CardDescription>
					When members most frequently visit
				</CardDescription>
			</CardHeader>
			<CardContent>
				<TimeOfDayChart activityByTimeOfDay={activityByTimeOfDay} />
			</CardContent>
		</Card>
	);
}

async function MembershipStatusCard() {
	const membershipStatus = await getMembershipStatus();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Membership Status</CardTitle>
				<CardDescription>
					Distribution of member statuses
				</CardDescription>
			</CardHeader>
			<CardContent>
				<MembershipStatusChart membershipStatus={membershipStatus} />
			</CardContent>
		</Card>
	);
}
