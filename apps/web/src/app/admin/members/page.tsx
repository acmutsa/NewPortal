import { Suspense } from "react";
import { getUserWithData } from "@/lib/queries";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";
import MemberStatsSheet from "@/components/dash/admin/members/MemberStatsSheet";

async function Page() {
	const members = await getUserWithData();
	return (
		<div className="mx-auto max-w-6xl pt-4 text-foreground">
			<div className="mb-5 grid grid-cols-2 px-5">
				<h1 className="font-foreground text-3xl font-bold tracking-tight">
					Members
				</h1>
			</div>
			<div className="px-5">
				<Suspense fallback={<div>...loading</div>}>
					<MemberStatsSheet />
				</Suspense>
			</div>
			{/* <div className="border-muted">{events?.[0].name}</div> */}
			<div className="rounded-xl p-5">
				<DataTable
					columns={columns}
					data={members}
					tableName="members"
					// viewRoute="/member/"
				/>
			</div>
		</div>
	);
}

export default Page;
