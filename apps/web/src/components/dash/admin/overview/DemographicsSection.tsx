import { Suspense } from "react";
import {
	getUserClassifications,
	getGenderDistribution,
	getRaceDistribution,
} from "@/lib/queries/charts";
import DemographicsStats from "./DemographicsStats";
import GenderDistributionChart from "./GenderDistributionChart";
import RaceDistributionChart from "./RaceDistributionChart";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function DemographicsSection() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold tracking-tight">
					Member Demographics
				</h2>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Suspense
					fallback={
						<LoadingCard
							title="Member Classification"
							description="Distribution by member level"
						/>
					}
				>
					<ClassificationCard />
				</Suspense>

				<Suspense
					fallback={
						<LoadingCard
							title="Gender Distribution"
							description="Breakdown of members by gender"
						/>
					}
				>
					<GenderCard />
				</Suspense>

				<Suspense
					fallback={
						<LoadingCard
							title="Race/Ethnicity"
							description="Breakdown of members by race/ethnicity"
						/>
					}
				>
					<RaceCard />
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
				<div className="flex h-[300px] items-center justify-center">
					Loading...
				</div>
			</CardContent>
		</Card>
	);
}

async function ClassificationCard() {
	const classifications = await getUserClassifications();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Member Classification</CardTitle>
				<CardDescription>Distribution by member level</CardDescription>
			</CardHeader>
			<CardContent>
				<DemographicsStats classifications={classifications} />
			</CardContent>
		</Card>
	);
}

async function GenderCard() {
	const genderData = await getGenderDistribution();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Gender Distribution</CardTitle>
				<CardDescription>
					Breakdown of members by gender
				</CardDescription>
			</CardHeader>
			<CardContent>
				<GenderDistributionChart genderData={genderData} />
			</CardContent>
		</Card>
	);
}

async function RaceCard() {
	const raceData = await getRaceDistribution();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Race/Ethnicity</CardTitle>
				<CardDescription>
					Breakdown of members by race/ethnicity
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RaceDistributionChart raceData={raceData} />
			</CardContent>
		</Card>
	);
}
