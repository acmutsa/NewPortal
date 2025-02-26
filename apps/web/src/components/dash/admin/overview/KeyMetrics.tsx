import {
	getRegistrationsByMonth,
	getCheckinsByMonth,
	getRetentionRate,
	getGrowthRate,
} from "@/lib/queries/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	UserIcon,
	CheckCircleIcon,
	BarChart,
	ArrowUpIcon,
	UsersIcon,
	TrendingUpIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default async function KeyMetrics() {
	// Fetch data in parallel
	const [monthlyRegistrations, monthlyCheckins, retentionRate, growthRate] =
		await Promise.all([
			getRegistrationsByMonth(),
			getCheckinsByMonth(),
			getRetentionRate(),
			getGrowthRate(),
		]);

	// Calculate metrics
	const totalRegistrations = monthlyRegistrations.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	const totalCheckins = monthlyCheckins.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	// Get new members this month
	const newMembersThisMonth =
		monthlyRegistrations[new Date().getMonth()]?.count || 0;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Total Registrations
					</CardTitle>
					<UserIcon className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{totalRegistrations}
					</div>
					<p className="text-xs text-muted-foreground">This year</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Total Check-ins
					</CardTitle>
					<CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalCheckins}</div>
					<p className="text-xs text-muted-foreground">This year</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						New Members
					</CardTitle>
					<UsersIcon className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{newMembersThisMonth}
					</div>
					<p className="text-xs text-muted-foreground">This month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Retention Rate
					</CardTitle>
					<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="flex items-baseline space-x-1">
						<div className="text-2xl font-bold">
							{retentionRate}%
						</div>
					</div>
					<div className="mt-1">
						<Progress value={retentionRate} className="h-1" />
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						Last 3 months
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Growth Rate
					</CardTitle>
					<BarChart className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="flex items-baseline space-x-1">
						<div className="text-2xl font-bold">{growthRate}%</div>
						<ArrowUpIcon className="h-4 w-4 text-green-500" />
					</div>
					<p className="text-xs text-muted-foreground">
						vs last month
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
