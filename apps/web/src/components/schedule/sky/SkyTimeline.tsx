import type { CSSProperties } from "react";
import Image from "next/image";
import type { EventType } from "@/lib/types/events";
import { PATH_START_CLOUD } from "./assets";
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

	// Tri Nguyen: z-10 paints the timeline over the faded tail of the hero cloud bank, so the path and first card are never hidden under it. overflow-x-clip trims wide art at the sides but lets the path cloud poke up above the top.
	return (
		<div className="relative z-10 overflow-x-clip">
			<div
				className="relative mx-auto max-w-[1440px] lg:h-[var(--sky-height)]"
				style={
					{ "--sky-height": `${layout.height}px` } as CSSProperties
				}
			>
				<SkyDecorations sectionHeight={layout.height} />
				<WindingPath layout={layout} />
				{/* Tri Nguyen: Small cloud over the start of the path, like Figma, so the road drifts out of the sky instead of starting in mid air. It is centered 12px left of the path because the drift animation moves it 24px right. */}
				<div
					aria-hidden
					className="pointer-events-none absolute left-[calc(50%-100px)] top-[-36px] z-0 hidden aspect-[206/102] w-[176px] motion-safe:animate-cq-drift lg:block"
				>
					<Image
						src={PATH_START_CLOUD}
						alt=""
						fill
						sizes="176px"
						className="object-contain"
					/>
				</div>

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
