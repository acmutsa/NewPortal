"use client";

import Image from "next/image";
import type { EventImageProps } from "@/lib/types/events";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventImage(props: EventImageProps) {
	const [loaded, setLoaded] = useState(false);
	const { isLive, ...imageProps } = props;
	const combinedProps = {
		alt: "Event Image",
		priority: true,
		width: imageProps.width || 0,
		height: imageProps.height || 0,
		quality: 100,
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
		...imageProps,
	};

	return (
		<div className="relative h-full w-full">
			<span
				className={clsx(
					"relative flex w-full items-center justify-center",
					{ "live-glow": isLive },
				)}
			>
				<Image
					{...combinedProps}
					onLoad={() => setLoaded(true)}
					hidden={!loaded}
				/>
			</span>

			<Skeleton
				className={`${loaded ? "hidden" : `h-[${props.width || "300"}px] w-full`}`}
				hidden={loaded}
			/>
		</div>
	);
}
