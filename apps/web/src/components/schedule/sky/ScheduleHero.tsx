import Image from "next/image";
import { DRAGONS, HERO_ART } from "./assets";
import { SCHEDULE_COPY } from "./content";

type ScheduleHeroProps = {
	dateText: string;
};

// Tri Nguyen: Top of the page. Castle art, two floating dragons, the title copy, and the cloud bank that blends into the schedule.
// Tri Nguyen: Keep every z-index at z-20 or below so the MLH badge (z-50) always stays on top.
export default function ScheduleHero({ dateText }: ScheduleHeroProps) {
	const metaItems = [
		dateText,
		SCHEDULE_COPY.location,
		SCHEDULE_COPY.timezoneNote,
	];

	return (
		<section
			aria-labelledby="schedule-title"
			className="relative h-[440px] lg:h-[520px]"
		>
			<Image
				src={HERO_ART.castle}
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			{/* Tri Nguyen: Parchment fade so the copy stays readable on top of the busy art. */}
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-b from-cq-parchment/5 via-cq-parchment/20 to-cq-parchment/55"
			/>

			<div
				aria-hidden
				className="absolute right-[3.5%] top-[70px] hidden aspect-[330/197] w-[23%] opacity-[0.92] motion-safe:animate-cq-float md:block"
			>
				<Image
					src={DRAGONS.plum}
					alt=""
					fill
					sizes="25vw"
					className="object-contain"
				/>
			</div>
			<div
				aria-hidden
				className="absolute left-[10.4%] top-[150px] hidden aspect-[230/124] w-[16%] opacity-[0.85] motion-safe:animate-cq-float-slow md:block"
			>
				<Image
					src={DRAGONS.gold}
					alt=""
					fill
					sizes="16vw"
					className="object-contain"
				/>
			</div>

			{/* Tri Nguyen: Soft glow behind the title, same radial fade as Figma. */}
			<div
				aria-hidden
				className="absolute left-1/2 top-[150px] h-[300px] w-[820px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(246,236,214,0.75),rgba(246,236,214,0))]"
			/>

			<div className="relative z-10 flex flex-col items-center gap-3 px-4 pt-[140px] text-center lg:pt-[180px]">
				<p className="font-grenze text-base font-semibold text-cq-plum motion-safe:animate-cq-rise">
					{SCHEDULE_COPY.eyebrow}
				</p>
				<h1
					id="schedule-title"
					className="font-gotisch text-7xl font-bold text-cq-title motion-safe:animate-cq-rise lg:text-[112px] lg:leading-none"
					style={{ animationDelay: "120ms" }}
				>
					{SCHEDULE_COPY.title}
				</h1>
				<p
					className="font-grenze text-xl font-medium text-cq-ink motion-safe:animate-cq-rise"
					style={{ animationDelay: "240ms" }}
				>
					{SCHEDULE_COPY.subtitle}
				</p>
				<ul
					className="flex flex-wrap items-center justify-center gap-3 font-grenze text-[15px] text-cq-muted motion-safe:animate-cq-rise"
					style={{ animationDelay: "360ms" }}
				>
					{metaItems.map((item, index) => (
						<li key={item} className="flex items-center gap-3">
							{index > 0 && (
								<span
									aria-hidden
									className="h-[5px] w-[5px] rounded-full bg-cq-gold"
								/>
							)}
							{item}
						</li>
					))}
				</ul>
			</div>

			{/* Tri Nguyen: Cloud bank hangs 99px over the bottom of the hero, exactly like the Figma overlap. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-[calc(100%-99px)] z-10 h-[200px] lg:h-[280px]"
			>
				<Image
					src={HERO_ART.cloudBank}
					alt=""
					fill
					sizes="100vw"
					className="object-cover object-top"
				/>
			</div>
		</section>
	);
}
