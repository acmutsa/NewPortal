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
		<div className="mx-auto max-w-7xl space-y-4 p-3 text-foreground sm:space-y-6 sm:p-4">
			<div className="flex flex-col space-y-1 sm:space-y-2">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Admin Overview
				</h1>
				<p className="text-sm text-muted-foreground sm:text-base">
					Monitor key club metrics and trends
				</p>
				<Separator className="mt-1 sm:mt-2" />
			</div>

			{/* Key Metrics Summary Cards */}
			<Suspense
				fallback={
					<div className="flex h-28 items-center justify-center sm:h-36">
						Loading key metrics...
					</div>
				}
			>
				<KeyMetrics />
			</Suspense>

			{/* Trends Section */}
			<Suspense
				fallback={
					<div className="flex h-28 items-center justify-center sm:h-36">
						Loading membership trends...
					</div>
				}
			>
				<MembershipTrends />
			</Suspense>

			{/* Engagement Metrics */}
			<Suspense
				fallback={
					<div className="flex h-28 items-center justify-center sm:h-36">
						Loading engagement metrics...
					</div>
				}
			>
				<EngagementSection />
			</Suspense>

			{/* Activity Patterns */}
			<Suspense
				fallback={
					<div className="flex h-28 items-center justify-center sm:h-36">
						Loading activity patterns...
					</div>
				}
			>
				<ActivityPatterns />
			</Suspense>

			{/* Demographics Section */}
			<Suspense
				fallback={
					<div className="flex h-28 items-center justify-center sm:h-36">
						Loading demographics data...
					</div>
				}
			>
				<DemographicsSection />
			</Suspense>
		</div>
	);
}
