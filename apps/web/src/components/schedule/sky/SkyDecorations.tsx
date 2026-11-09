import Image from "next/image";
import { cn } from "@/lib/utils/client/cn";
import { HERO_ART, SKY_DECORATIONS } from "./assets";
import { ROW_SCALE } from "./sky-layout";

const FRAME_WIDTH = 1440;
const SWIRLS_HEIGHT = 2440;

// Tri Nguyen: Art that would start this close to the bottom is skipped so it never piles up on the castle finale.
const FINALE_CLEARANCE = 460;

type SkyDecorationsProps = {
	sectionHeight: number;
};

// Tri Nguyen: Turns a Figma x or width (on a 1440 frame) into a percentage so art scales with the screen.
function toPercent(pixels: number): string {
	return `${(pixels / FRAME_WIDTH) * 100}%`;
}

// Tri Nguyen: Background art behind the event clouds. Purely decorative, so it is hidden from screen readers and only shown on large screens.
// Tri Nguyen: Positions come from Figma, so they are shrunk by ROW_SCALE to match the smaller rows.
export default function SkyDecorations({ sectionHeight }: SkyDecorationsProps) {
	const visibleDecorations = SKY_DECORATIONS.filter(
		(decoration) =>
			decoration.top * ROW_SCALE < sectionHeight - FINALE_CLEARANCE,
	);

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
		>
			<Image
				src={HERO_ART.windSwirls}
				alt=""
				width={FRAME_WIDTH}
				height={SWIRLS_HEIGHT}
				unoptimized
				className="absolute left-0 top-0 w-full opacity-80"
				style={{ height: SWIRLS_HEIGHT * ROW_SCALE }}
			/>

			{visibleDecorations.map((decoration) => (
				<div
					key={`${decoration.src}-${decoration.top}`}
					className={cn("absolute", decoration.animationClass)}
					style={{
						left: toPercent(decoration.left),
						width: toPercent(decoration.width * ROW_SCALE),
						aspectRatio: `${decoration.width} / ${decoration.height}`,
						top: decoration.top * ROW_SCALE,
						opacity: decoration.opacity,
					}}
				>
					<Image
						src={decoration.src}
						alt=""
						fill
						sizes="20vw"
						className="object-contain"
					/>
				</div>
			))}
		</div>
	);
}
