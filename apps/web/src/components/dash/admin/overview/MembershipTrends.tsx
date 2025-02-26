import { Suspense } from "react";
import {
	getRegistrationsByMonth,
	getCheckinsByMonth,
} from "@/lib/queries/charts";
import MonthlyRegistrationChart from "./MonthlyRegistrationChart";
import MonthlyCheckinChart from "./MonthlyCheckinChart";

export default async function MembershipTrends() {
	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight sm:text-xl">
					Membership Trends
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
				<Suspense
					fallback={
						<div className="flex h-[200px] items-center justify-center sm:h-[300px]">
							Loading registration data...
						</div>
					}
				>
					<RegistrationChartWithData />
				</Suspense>
				<Suspense
					fallback={
						<div className="flex h-[200px] items-center justify-center sm:h-[300px]">
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
