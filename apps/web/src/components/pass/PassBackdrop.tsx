import Image from "next/image";
import { HERO_ART } from "@/components/schedule/sky/assets";
import type { HackerClass } from "./classes";

// Tri Nguyen: Peaks and cloud images are shared with the schedule page (public/img/schedule).
const PEAKS_LEFT = "/img/schedule/peaks-a.png";
const PEAKS_RIGHT = "/img/schedule/peaks-b.png";

// Tri Nguyen: Decorative art behind the pass, pinned to the bottom of the page like the Figma frames. Phones only get the faint peaks.
export default function PassBackdrop({
	dragon,
}: {
	dragon: HackerClass["dragon"];
}) {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<Image
				src={PEAKS_LEFT}
				alt=""
				width={580}
				height={227}
				unoptimized
				className="absolute -bottom-7 left-1/2 w-[580px] max-w-none -translate-x-1/2 opacity-55 lg:bottom-[97px] lg:left-0 lg:translate-x-0 lg:opacity-60"
			/>
			<Image
				src={PEAKS_RIGHT}
				alt=""
				width={600}
				height={212}
				unoptimized
				className="absolute bottom-[92px] right-0 hidden w-[600px] opacity-60 lg:block"
			/>
			<Image
				src={HERO_ART.cloudBank}
				alt=""
				width={1440}
				height={280}
				unoptimized
				className="absolute -bottom-14 left-0 hidden h-[280px] w-full object-cover opacity-90 lg:block"
			/>
			{/* Tri Nguyen: Class dragon floats on the right. Motion stops for people who ask for reduced motion. */}
			<Image
				src={dragon.src}
				alt=""
				width={dragon.width}
				height={dragon.height}
				unoptimized
				className="absolute right-6 top-[46%] hidden opacity-75 motion-safe:animate-cq-bob lg:block"
			/>
		</div>
	);
}
