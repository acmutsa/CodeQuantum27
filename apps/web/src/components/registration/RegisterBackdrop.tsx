import Image from "next/image";
import { HERO_ART } from "@/components/schedule/sky/assets";

// Tri Nguyen: Peaks are shared with the schedule page and hacker pass (public/img/schedule).
const PEAKS_LEFT = "/img/schedule/peaks-a.png";
const PEAKS_RIGHT = "/img/schedule/peaks-b.png";

// Tri Nguyen: Storybook art behind the register form (app/register/page.tsx). Castle art fades into parchment at the top like the schedule hero, and the peaks sit at the bottom like the pass.
export default function RegisterBackdrop() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div
				className="absolute inset-x-0 top-0 h-[520px]"
				style={{
					maskImage:
						"linear-gradient(to bottom, black 55%, transparent)",
					WebkitMaskImage:
						"linear-gradient(to bottom, black 55%, transparent)",
				}}
			>
				<Image
					src={HERO_ART.castle}
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
			</div>
			{/* Tri Nguyen: Parchment wash so the title stays readable on top of the art. */}
			<div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-cq-parchment/10 via-cq-parchment/35 to-cq-parchment" />
			<Image
				src={PEAKS_LEFT}
				alt=""
				width={580}
				height={227}
				unoptimized
				className="absolute bottom-0 left-0 w-[580px] max-w-none opacity-50"
			/>
			<Image
				src={PEAKS_RIGHT}
				alt=""
				width={600}
				height={212}
				unoptimized
				className="absolute bottom-0 right-0 hidden w-[600px] opacity-50 md:block"
			/>
		</div>
	);
}
