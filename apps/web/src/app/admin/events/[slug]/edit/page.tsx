import React from "react";

import EditEventForm from "@/components/dash/admin/events/EditEventForm";

import { getCategoryOptions } from "@/lib/queries";
import { iEvent, uEvent } from "@/lib/constants/events";
import { getEventWithCategoriesById } from "@/lib/queries/events";

type Props = {
	params: { slug: string };
};

export default async function Page({ params: { slug } }: Props) {
	const categoryOptions = await getCategoryOptions();
	try {
		const oldValues: uEvent = await getEventWithCategoriesById(slug);
		return (
			<div className="mx-auto max-w-6xl pt-4 text-foreground">
				<div className="grid grid-cols-2 px-5">
					<h1 className="font-foreground mb-2 text-3xl font-bold tracking-tight">
						Edit Event
					</h1>
				</div>
				<div className="rounded-xl border border-muted p-5">
					<EditEventForm
						eventID={slug}
						oldValues={oldValues}
						categoryOptions={categoryOptions}
					/>
				</div>
			</div>
		);
	} catch {
		return (
			<div>
				Error fetching event. It likely no event exists with this id
			</div>
		);
	}
}
