import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import KeyMetrics from "@/components/dash/admin/overview/KeyMetrics";
import MembershipTrends from "@/components/dash/admin/overview/MembershipTrends";
import EngagementSection from "@/components/dash/admin/overview/EngagementSection";
import ActivityPatterns from "@/components/dash/admin/overview/ActivityPatterns";
import DemographicsSection from "@/components/dash/admin/overview/DemographicsSection";

// The dashboard always fetches fresh data on each request
// Data is memoized within each render via React's built-in request deduplication
export default async function Page() {
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
			<Suspense
				fallback={
					<div className="flex h-36 items-center justify-center">
						Loading key metrics...
					</div>
				}
			>
				<KeyMetrics />
			</Suspense>

			{/* Trends Section */}
			<Suspense
				fallback={
					<div className="flex h-36 items-center justify-center">
						Loading membership trends...
					</div>
				}
			>
				<MembershipTrends />
			</Suspense>

			{/* Engagement Metrics */}
			<Suspense
				fallback={
					<div className="flex h-36 items-center justify-center">
						Loading engagement metrics...
					</div>
				}
			>
				<EngagementSection />
			</Suspense>

			{/* Activity Patterns */}
			<Suspense
				fallback={
					<div className="flex h-36 items-center justify-center">
						Loading activity patterns...
					</div>
				}
			>
				<ActivityPatterns />
			</Suspense>

			{/* Demographics Section */}
			<Suspense
				fallback={
					<div className="flex h-36 items-center justify-center">
						Loading demographics data...
					</div>
				}
			>
				<DemographicsSection />
			</Suspense>
		</div>
	);
}
