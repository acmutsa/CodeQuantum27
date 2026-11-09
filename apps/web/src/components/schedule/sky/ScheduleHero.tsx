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
			className="relative h-[440px] sm:h-[380px] lg:h-[440px]"
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
				className="absolute right-[4%] top-[56px] hidden aspect-[330/197] w-[18%] opacity-[0.92] motion-safe:animate-cq-float md:block"
			>
				<Image
					src={DRAGONS.plum}
					alt=""
					fill
					sizes="18vw"
					className="object-contain"
				/>
			</div>
			<div
				aria-hidden
				className="absolute left-[11%] top-[120px] hidden aspect-[230/124] w-[12.5%] opacity-[0.85] motion-safe:animate-cq-float-slow md:block"
			>
				<Image
					src={DRAGONS.gold}
					alt=""
					fill
					sizes="13vw"
					className="object-contain"
				/>
			</div>

			{/* Tri Nguyen: Soft glow behind the title, same radial fade as Figma. */}
			<div
				aria-hidden
				className="absolute left-1/2 top-[110px] h-[250px] w-[660px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(246,236,214,0.75),rgba(246,236,214,0))]"
			/>

			<div className="relative z-10 flex flex-col items-center gap-2 px-4 pt-[110px] text-center lg:pt-[140px]">
				<p className="font-grenze text-sm font-semibold text-cq-plum motion-safe:animate-cq-rise">
					{SCHEDULE_COPY.eyebrow}
				</p>
				<h1
					id="schedule-title"
					className="font-gotisch text-6xl font-bold text-cq-title motion-safe:animate-cq-rise lg:text-[88px] lg:leading-none"
					style={{ animationDelay: "120ms" }}
				>
					{SCHEDULE_COPY.title}
				</h1>
				<p
					className="font-grenze text-lg font-medium text-cq-ink motion-safe:animate-cq-rise"
					style={{ animationDelay: "240ms" }}
				>
					{SCHEDULE_COPY.subtitle}
				</p>
				<ul
					className="flex flex-wrap items-center justify-center gap-3 font-grenze text-sm text-cq-muted motion-safe:animate-cq-rise"
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

			{/* Tri Nguyen: Cloud bank hangs 80px over the bottom of the hero. It keeps the art's own shape (2880 x 560) so the soft parchment fade at its bottom is never cut off. It is pulled 3% left to hide a grey sliver on the art's left edge. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-[calc(100%-80px)] z-10 overflow-hidden"
			>
				<div
					className="relative -ml-[3%] w-[103%]"
					style={{ aspectRatio: "2880 / 560" }}
				>
					<Image
						src={HERO_ART.cloudBank}
						alt=""
						fill
						sizes="103vw"
						className="object-cover"
					/>
				</div>
			</div>
		</section>
	);
}
