import type { EventAndCategoriesType } from "@/lib/types/events";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import clsx from "clsx";
import EventCategories from "./EventCategories";
import { Badge } from "../ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import {
	EVENT_DATE_FORMAT_STRING,
	EVENT_TIME_FORMAT_STRING,
} from "@/lib/constants/events";
import EventImage from "./shared/EventImage";
export default function EventCardComponent({
	event,
	isPast,
	isEventCurrentlyHappening,
	isEventCheckinAllowed,
	clientTimezone,
}: {
	event: EventAndCategoriesType;
	isPast: boolean;
	isEventCurrentlyHappening: boolean;
	clientTimezone: string;
	isEventCheckinAllowed: boolean;
}) {
	const { thumbnailUrl, start, id, points } = event;

	const eventDetailsLink = `/events/${id}`;
	const eventCheckinLink = `/events/${id}/checkin`;
	const startDateFormatted = formatInTimeZone(
		start,
		clientTimezone,
		`${EVENT_DATE_FORMAT_STRING} @ ${EVENT_TIME_FORMAT_STRING}`,
	);

	return (
		<Card
			className={`group relative flex h-full w-full flex-col transition duration-300 ease-in-out hover:shadow-lg hover:shadow-slate-400 md:hover:scale-105`}
		>
			<CardHeader className="flex h-full justify-center p-0 pb-4">
				<EventImage
					src={thumbnailUrl}
					className={clsx("w-full rounded-md", {
						"h-auto grayscale group-hover:grayscale-0": isPast,
					})}
					isLive={isEventCurrentlyHappening}
				/>
			</CardHeader>
			<CardContent className="flex w-full flex-1 flex-col justify-end p-0 pb-4">
				<CardTitle className="w-full truncate whitespace-nowrap px-4 pb-1 text-center font-bold md:px-4 ">
					{event.name}
				</CardTitle>
				<EventCategories
					event={event}
					isPast={isPast}
					className="pb-3 pt-3"
				/>
				<div className="flex w-full flex-col items-center justify-center gap-3 px-2 text-gray-600 md:px-6">
					<p className="text-primary">
						{`${isPast ? "Ended on: " : ""}`}
						{startDateFormatted}
					</p>
					<span className="flex w-full flex-row items-center justify-center gap-3 text-primary">
						<p>Points:</p>
						<p>{points}</p>
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex w-full">
				<Link
					href={eventDetailsLink}
					className="flex h-full w-1/2 flex-row items-center justify-center border-r border-gray-400"
				>
					<h1 className="text-primary">Details</h1>
				</Link>

				<Link
					href={eventCheckinLink}
					className={clsx(
						"flex h-full w-1/2 flex-row items-center justify-center border-l border-gray-400",
						{
							"pointer-events-none": !isEventCheckinAllowed,
						},
					)}
					aria-disabled={!isEventCheckinAllowed}
					tabIndex={!isEventCheckinAllowed ? -1 : 0}
				>
					<h1
						className={clsx("text-blue-400 dark:text-sky-300", {
							"line-through": isPast,
							"opacity-40": !isEventCheckinAllowed,
						})}
					>
						Check-In
					</h1>
				</Link>
			</CardFooter>
		</Card>
	);
}
