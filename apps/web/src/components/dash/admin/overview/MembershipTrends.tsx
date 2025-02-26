import { Suspense } from "react";
import {
	getRegistrationsByMonth,
	getCheckinsByMonth,
} from "@/lib/queries/charts";
import MonthlyRegistrationChart from "./MonthlyRegistrationChart";
import MonthlyCheckinChart from "./MonthlyCheckinChart";

export default async function MembershipTrends() {
	return (
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
					<RegistrationChartWithData />
				</Suspense>
				<Suspense
					fallback={
						<div className="flex h-[300px] items-center justify-center">
							Loading check-in data...
						</div>
					}
				>
					<CheckinChartWithData />
				</Suspense>
			</div>
		</div>
	);
}

// Split into separate components so each can fetch its own data independently
async function RegistrationChartWithData() {
	const registrations = await getRegistrationsByMonth();
	return <MonthlyRegistrationChart registrations={registrations} />;
}

async function CheckinChartWithData() {
	const checkins = await getCheckinsByMonth();
	return <MonthlyCheckinChart checkins={checkins} />;
}
