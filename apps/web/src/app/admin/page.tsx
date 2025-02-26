import DemographicsStats from "@/components/dash/admin/overview/DemographicsStats";
import MonthlyRegistrationChart from "@/components/dash/admin/overview/MonthlyRegistrationChart";
import MonthlyCheckinChart from "@/components/dash/admin/overview/MonthlyCheckinChart";
import ActivityByDayChart from "@/components/dash/admin/overview/ActivityByDayChart";
import TimeOfDayChart from "@/components/dash/admin/overview/TimeOfDayChart";
import MembershipStatusChart from "@/components/dash/admin/overview/MembershipStatusChart";
import EngagementMetricsCard from "@/components/dash/admin/overview/EngagementMetricsCard";
import AverageVisitsCard from "@/components/dash/admin/overview/AverageVisitsCard";
import GenderDistributionChart from "@/components/dash/admin/overview/GenderDistributionChart";
import RaceDistributionChart from "@/components/dash/admin/overview/RaceDistributionChart";
import { Separator } from "@/components/ui/separator";
import {
	getRegistrationsByMonth,
	getUserClassifications,
	getCheckinsByMonth,
	getActiveMembers,
	getRetentionRate,
	getGrowthRate,
	getMostActiveDay,
	getActivityByDayOfWeek,
	getActivityByTimeOfDay,
	getMembershipStatus,
	getGenderDistribution,
	getRaceDistribution,
} from "@/lib/queries/charts";
import { Suspense } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	CalendarIcon,
	UserIcon,
	CheckCircleIcon,
	BarChart,
	ArrowUpIcon,
	UsersIcon,
	TrendingUpIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page() {
	// Fetch all required data from database
	const monthlyRegistrations = await getRegistrationsByMonth();
	const monthlyCheckins = await getCheckinsByMonth();
	const classifications = await getUserClassifications();
	const activeMembers = await getActiveMembers();
	const retentionRate = await getRetentionRate();
	const growthRate = await getGrowthRate();
	const mostActiveDay = await getMostActiveDay();
	const activityByDayOfWeek = await getActivityByDayOfWeek();
	const activityByTimeOfDay = await getActivityByTimeOfDay();
	const membershipStatus = await getMembershipStatus();
	const genderData = await getGenderDistribution();
	const raceData = await getRaceDistribution();

	// Calculate total registrations this year
	const totalRegistrations = monthlyRegistrations.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	// Calculate total check-ins this year
	const totalCheckins = monthlyCheckins.reduce(
		(acc, curr) => acc + curr.count,
		0,
	);

	// Calculate average monthly registrations
	const avgMonthlyRegistrations = Math.round(
		totalRegistrations /
			monthlyRegistrations.filter((m) => m.count > 0).length || 0,
	);

	// Calculate new members this month
	const newMembersThisMonth =
		monthlyRegistrations[new Date().getMonth()]?.count || 0;

	// Calculate average visits per member
	const averageVisitsPerMember = (
		totalCheckins / (totalRegistrations || 1)
	).toFixed(1);

	// Create engagement metrics object for components
	const engagementMetrics = {
		activeMembers,
		averageVisitsPerMember,
		mostActiveDay,
	};

	return (
		<div className="mx-auto max-w-7xl space-y-6 p-4 text-foreground">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Admin Overview
				</h1>
				<p className="text-muted-foreground">
					Monitor key club metrics and trends
				</p>
				<Separator className="my-2" />
			</div>

			{/* Key Metrics Summary Cards */}
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
						<p className="text-xs text-muted-foreground">
							This year
						</p>
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
						<div className="text-2xl font-bold">
							{totalCheckins}
						</div>
						<p className="text-xs text-muted-foreground">
							This year
						</p>
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
						<p className="text-xs text-muted-foreground">
							This month
						</p>
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
							<div className="text-2xl font-bold">
								{growthRate}%
							</div>
							<ArrowUpIcon className="h-4 w-4 text-green-500" />
						</div>
						<p className="text-xs text-muted-foreground">
							vs last month
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Trends Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Membership Trends
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Suspense
						fallback={
							<div className="flex h-[300px] items-center justify-center">
								Loading registration data...
							</div>
						}
					>
						<MonthlyRegistrationChart
							registrations={monthlyRegistrations}
						/>
					</Suspense>
					<Suspense
						fallback={
							<div className="flex h-[300px] items-center justify-center">
								Loading check-in data...
							</div>
						}
					>
						<MonthlyCheckinChart checkins={monthlyCheckins} />
					</Suspense>
				</div>
			</div>

			{/* Engagement Metrics */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Engagement Metrics
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg">
								Active Members
							</CardTitle>
							<CardDescription>
								Members who visited in the last 30 days
							</CardDescription>
						</CardHeader>
						<CardContent>
							<EngagementMetricsCard
								activeMembers={engagementMetrics.activeMembers}
								totalRegistrations={totalRegistrations}
							/>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg">
								Avg. Visits per Member
							</CardTitle>
							<CardDescription>
								Average check-ins per registered member
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AverageVisitsCard
								averageVisits={
									engagementMetrics.averageVisitsPerMember
								}
							/>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg">
								Most Active Day
							</CardTitle>
							<CardDescription>
								Day with highest check-in activity
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ActivityByDayChart
								activityByDayOfWeek={activityByDayOfWeek}
								mostActiveDay={engagementMetrics.mostActiveDay}
							/>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Activity Patterns */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Activity Patterns
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
							<TimeOfDayChart
								activityByTimeOfDay={activityByTimeOfDay}
							/>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Membership Status
							</CardTitle>
							<CardDescription>
								Distribution of member statuses
							</CardDescription>
						</CardHeader>
						<CardContent>
							<MembershipStatusChart
								membershipStatus={membershipStatus}
							/>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Demographics Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Member Demographics
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Member Classification
							</CardTitle>
							<CardDescription>
								Distribution by member level
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense
								fallback={
									<div className="flex h-[300px] items-center justify-center">
										Loading demographic data...
									</div>
								}
							>
								<DemographicsStats
									classifications={classifications}
								/>
							</Suspense>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Gender Distribution
							</CardTitle>
							<CardDescription>
								Breakdown of members by gender
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense
								fallback={
									<div className="flex h-[300px] items-center justify-center">
										Loading gender data...
									</div>
								}
							>
								<GenderDistributionChart
									genderData={genderData}
								/>
							</Suspense>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Race/Ethnicity
							</CardTitle>
							<CardDescription>
								Breakdown of members by race/ethnicity
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense
								fallback={
									<div className="flex h-[300px] items-center justify-center">
										Loading race/ethnicity data...
									</div>
								}
							>
								<RaceDistributionChart raceData={raceData} />
							</Suspense>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
