"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/client/cn";
import { FINALE_LANDSCAPE, HERO_ART } from "./assets";

// Tri Nguyen: The sweeping wind curve drawn across the top of the finale, in a 1440 x 160 box.
const SWOOSH_PATH = "M -40 118 C 220 30, 480 150, 760 92 S 1180 8, 1480 66";

// Tri Nguyen: Closes out the schedule. A band of clouds sweeps in over the top of the castle landscape, with a flowing wind swoosh, so the page drifts down into the castle instead of hitting a hard edge.
export default function FinaleTransition() {
	const ref = useRef<HTMLDivElement>(null);
	const [hasArrived, setHasArrived] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Tri Nguyen: Start the cloud sweep once, the first time the finale scrolls into view.
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setHasArrived(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			aria-hidden
			className="pointer-events-none relative z-0 mt-28 overflow-x-clip lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0"
		>
			{/* Tri Nguyen: Castle and lake landscape. Bleeds past the left edge just like Figma. */}
			<div
				className="relative ml-[-15.76%] w-[118.06%]"
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

			{/* Tri Nguyen: The hero cloud bank flipped upside down so its clouds hang over the mountains. The mask fades its top edge into the page, so there is no hard line. Pulled 3% left to hide a grey sliver in the art. */}
			<div
				className={cn(
					"absolute inset-x-0 -top-[64px] overflow-hidden lg:-top-[96px]",
					hasArrived
						? "motion-safe:animate-cq-swoosh"
						: "motion-safe:opacity-0",
				)}
				style={{
					maskImage:
						"linear-gradient(to bottom, transparent 0%, black 45%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, transparent 0%, black 45%)",
				}}
			>
				<div
					className="relative -ml-[3%] w-[103%] -scale-y-100"
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

			{/* Tri Nguyen: Cream wind swoosh with a gold line flowing along it. The winding path above ends inside this band. */}
			<svg
				className="absolute inset-x-0 -top-[70px] h-[110px] w-full lg:-top-[96px] lg:h-[150px]"
				viewBox="0 0 1440 160"
				preserveAspectRatio="none"
				fill="none"
			>
				<path
					d={SWOOSH_PATH}
					className="stroke-cq-path"
					strokeOpacity={0.9}
					strokeWidth={26}
					strokeLinecap="round"
				/>
				<path
					d={SWOOSH_PATH}
					className="stroke-cq-rope"
					strokeWidth={2}
					transform="translate(0 -8)"
				/>
				<path
					d={SWOOSH_PATH}
					className="stroke-cq-gold motion-safe:animate-cq-flow"
					strokeWidth={2}
					strokeDasharray="40 80"
					strokeLinecap="round"
					transform="translate(0 8)"
				/>
			</svg>
		</div>
	);
}
