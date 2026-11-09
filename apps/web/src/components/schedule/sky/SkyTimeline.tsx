import type { CSSProperties } from "react";
import Image from "next/image";
import type { EventType } from "@/lib/types/events";
import { FINALE_LANDSCAPE } from "./assets";
import EventCloud from "./EventCloud";
import SkyDecorations from "./SkyDecorations";
import { buildSkyLayout } from "./sky-layout";
import WindingPath from "./WindingPath";

type SkyTimelineProps = {
	events: EventType[];
	timezone: string;
	showFinale: boolean;
};

// Tri Nguyen: One day of events. Large screens get the absolute positioned Figma layout. Small screens get a simple stacked list.
export default function SkyTimeline({
	events,
	timezone,
	showFinale,
}: SkyTimelineProps) {
	const layout = buildSkyLayout(events.length);

	return (
		<div className="relative overflow-hidden">
			<div
				className="relative mx-auto max-w-[1440px] lg:h-[var(--sky-height)]"
				style={
					{ "--sky-height": `${layout.height}px` } as CSSProperties
				}
			>
				<SkyDecorations />
				<WindingPath layout={layout} />

				<ol className="flex flex-col gap-8 px-4 pb-16 lg:block lg:p-0">
					{events.map((event, index) => (
						<li key={event.id}>
							<EventCloud
								event={event}
								index={index}
								top={layout.cardTops[index]}
								timezone={timezone}
							/>
						</li>
					))}
				</ol>

				{/* Tri Nguyen: Castle and lake landscape that closes out the last day. Bleeds past the left edge just like Figma. */}
				{showFinale && (
					<div
						aria-hidden
						className="pointer-events-none relative ml-[-15.76%] w-[118.06%] lg:absolute lg:bottom-0 lg:left-0"
						style={{ aspectRatio: "1700 / 411" }}
					>
						<Image
							src={FINALE_LANDSCAPE}
							alt=""
							fill
							sizes="118vw"
							className="object-cover"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
