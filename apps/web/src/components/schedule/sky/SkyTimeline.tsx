import type { CSSProperties } from "react";
import type { EventType } from "@/lib/types/events";
import EventCloud from "./EventCloud";
import FinaleTransition from "./FinaleTransition";
import SkyDecorations from "./SkyDecorations";
import { buildSkyLayout } from "./sky-layout";
import WindingPath from "./WindingPath";

type SkyTimelineProps = {
	events: EventType[];
	timezone: string;
};

// Tri Nguyen: The hack day's events. Large screens get the absolute positioned zigzag layout. Small screens get a simple stacked list. Both end in the castle finale.
export default function SkyTimeline({ events, timezone }: SkyTimelineProps) {
	const layout = buildSkyLayout(events.length);

	return (
		<div className="relative overflow-hidden">
			<div
				className="relative mx-auto max-w-[1440px] lg:h-[var(--sky-height)]"
				style={
					{ "--sky-height": `${layout.height}px` } as CSSProperties
				}
			>
				<SkyDecorations sectionHeight={layout.height} />
				<WindingPath layout={layout} />

				<ol className="flex flex-col gap-6 px-8 pt-4 lg:block lg:p-0">
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
			</div>

			{/* Tri Nguyen: The finale sits outside the 1440px box so its clouds reach both edges of wide screens. */}
			<FinaleTransition />
		</div>
	);
}
