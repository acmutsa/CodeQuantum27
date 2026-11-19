"use client";

import { useRef } from "react";
import { LANE_WIDTH, type SkyLayout } from "./sky-layout";
import { useScrollDrawProgress } from "./useScrollDrawProgress";

type WindingPathProps = {
	layout: SkyLayout;
};

// Tri Nguyen: Small gold spiral drawn next to each event marker.
const SWIRL_PATH =
	"M0 0c3-4 9-3 10 2s-4 10-10 9-11-8-8-15 13-11 20-6 10 15 4 21";

// Tri Nguyen: The cream road with two gold rope lines that winds between the clouds. It draws itself as you scroll.
export default function WindingPath({ layout }: WindingPathProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const progress = useScrollDrawProgress(svgRef);

	// Tri Nguyen: pathLength={1} lets one number control how much is drawn. Offset 1 hides it, 0 shows it all.
	// Tri Nguyen: The gap is 2 (not 1) so no zero length dash is left at the ends, which would show as a round dot before scrolling.
	const drawProps = {
		pathLength: 1,
		strokeDasharray: "1 2",
		strokeDashoffset: 1 - progress,
	};

	return (
		<svg
			ref={svgRef}
			aria-hidden
			className="pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 lg:block"
			width={LANE_WIDTH}
			height={layout.height}
			viewBox={`0 0 ${LANE_WIDTH} ${layout.height}`}
			fill="none"
		>
			<path
				d={layout.path}
				className="stroke-cq-path"
				strokeOpacity={0.9}
				strokeWidth={36}
				strokeLinecap="round"
				{...drawProps}
			/>
			<path
				d={layout.path}
				transform="translate(-10 0)"
				className="stroke-cq-rope"
				strokeWidth={2}
				{...drawProps}
			/>
			<path
				d={layout.path}
				transform="translate(10 0)"
				className="stroke-cq-rope"
				strokeWidth={2}
				{...drawProps}
			/>

			{layout.markers.map((marker, index) => (
				<g key={`${marker.x}-${marker.y}`}>
					<circle
						cx={marker.x}
						cy={marker.y + 28}
						r={4}
						className="fill-cq-plum/70"
					/>
					<g
						transform={`translate(${marker.x + (index % 2 === 0 ? 38 : -38)} ${marker.y - 12})`}
					>
						<path
							d={SWIRL_PATH}
							className="stroke-cq-gold motion-safe:animate-[spin_14s_linear_infinite]"
							strokeWidth={2}
							strokeLinecap="round"
							style={{
								transformBox: "fill-box",
								transformOrigin: "center",
							}}
						/>
					</g>
				</g>
			))}
		</svg>
	);
}
