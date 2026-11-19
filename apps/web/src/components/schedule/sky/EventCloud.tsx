import type { CSSProperties } from "react";
import Image from "next/image";
import type { EventType } from "@/lib/types/events";
import { cn } from "@/lib/utils/client/cn";
import { CLOUD_VARIANTS } from "./assets";
import Reveal from "./Reveal";
import { formatTimeRange } from "./schedule-data";
import { CARD_HEIGHT, CARD_WIDTH } from "./sky-layout";

type EventCloudProps = {
	event: EventType;
	index: number;
	top: number;
	timezone: string;
};

// Tri Nguyen: Converts Figma pixels inside a card into percentages so the card can shrink on smaller screens.
function toPercent(pixels: number, total: number): string {
	return `${(pixels / total) * 100}%`;
}

// Tri Nguyen: One event drawn on cloud art. Stacked on mobile, zigzagging left and right from the lg breakpoint up.
export default function EventCloud({
	event,
	index,
	top,
	timezone,
}: EventCloudProps) {
	const cloud = CLOUD_VARIANTS[index % CLOUD_VARIANTS.length];
	const isLeft = index % 2 === 0;

	return (
		<Reveal
			className={cn(
				"relative mx-auto w-full max-w-[440px] lg:absolute lg:top-[var(--card-top)] lg:z-10 lg:mx-0 lg:w-[clamp(340px,30.5%,440px)]",
				isLeft ? "lg:left-[9%]" : "lg:right-[9%]",
			)}
			style={{ "--card-top": `${top}px` } as CSSProperties}
		>
			{/* Tri Nguyen: Negative delays stagger the bob so neighboring clouds never move in sync. */}
			{/* Tri Nguyen: aspect-ratio sets the Figma shape, and because the text below is in normal flow a long title makes the cloud taller instead of spilling out. */}
			<article
				className="relative flex motion-safe:animate-cq-bob"
				style={{
					aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
					animationDelay: `${(index % 3) * -2}s`,
				}}
			>
				<div
					aria-hidden
					className="pointer-events-none absolute"
					style={{
						left: toPercent(cloud.x, CARD_WIDTH),
						top: toPercent(cloud.y, CARD_HEIGHT),
						width: toPercent(cloud.width, CARD_WIDTH),
						height: toPercent(cloud.height, CARD_HEIGHT),
					}}
				>
					<Image
						src={cloud.src}
						alt=""
						fill
						sizes="(min-width: 1024px) 32vw, 100vw"
						className="object-fill"
					/>
				</div>

				<div className="relative flex w-full flex-col justify-center gap-1 break-words py-[7%] pl-[19%] pr-[14%]">
					<p className="font-grenze text-sm font-semibold text-cq-plum lg:text-lg">
						<time dateTime={event.startTime.toISOString()}>
							{formatTimeRange(
								event.startTime,
								event.endTime,
								timezone,
							)}
						</time>
					</p>
					<h3 className="font-gotisch text-xl font-semibold leading-[1.15] text-cq-ink lg:text-[24px]">
						{event.title}
					</h3>
					{event.location && (
						<p className="font-grenze text-[13px] italic text-cq-muted">
							{event.location}
						</p>
					)}
				</div>
			</article>
		</Reveal>
	);
}
