import React from "react";
import { getMemberStatsOverview } from "@/lib/queries/users";
import { Separator } from "@/components/ui/separator";

type StatItemProps = {
	label: string;
	value: number | string;
};

function StatItem({ label, value }: StatItemProps) {
	return (
		<div className="flex flex-col p-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span className="text-lg font-semibold">{value}</span>
		</div>
	);
}

type Props = {};

async function MemberStatsSheet({}: Props) {
	const stats = await getMemberStatsOverview();

	const statItems: StatItemProps[] = [
		{
			label: "Total Members",
			value: stats.totalMembers,
		},
		{
			label: "Active Members", 
			value: stats.activeMembers,
		},
	];

	return (
		<div className="flex w-fit space-x-4 rounded-lg border p-2">
			{statItems.map((stat, index) => (
				<React.Fragment key={stat.label}>
					<StatItem {...stat} />
					{index < statItems.length - 1 && (
						<Separator orientation="vertical" />
					)}
				</React.Fragment>
			))}
		</div>
	);
}

export default MemberStatsSheet;
