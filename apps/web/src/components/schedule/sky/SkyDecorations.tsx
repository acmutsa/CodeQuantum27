import Image from "next/image";
import { cn } from "@/lib/utils/client/cn";
import { HERO_ART, SKY_DECORATIONS } from "./assets";

const FRAME_WIDTH = 1440;

// Tri Nguyen: Turns a Figma x or width (on a 1440 frame) into a percentage so art scales with the screen.
function toPercent(pixels: number): string {
	return `${(pixels / FRAME_WIDTH) * 100}%`;
}

// Tri Nguyen: Background art behind the event clouds. Purely decorative, so it is hidden from screen readers and only shown on large screens.
export default function SkyDecorations() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
		>
			<Image
				src={HERO_ART.windSwirls}
				alt=""
				width={FRAME_WIDTH}
				height={2440}
				unoptimized
				className="absolute left-0 top-0 h-auto w-full opacity-80"
			/>

			{SKY_DECORATIONS.map((decoration) => (
				<div
					key={`${decoration.src}-${decoration.top ?? decoration.bottom}`}
					className={cn("absolute", decoration.animationClass)}
					style={{
						left: toPercent(decoration.left),
						width: toPercent(decoration.width),
						aspectRatio: `${decoration.width} / ${decoration.height}`,
						top: decoration.top,
						bottom: decoration.bottom,
						opacity: decoration.opacity,
					}}
				>
					<Image
						src={decoration.src}
						alt=""
						fill
						sizes="25vw"
						className="object-contain"
					/>
				</div>
			))}
		</div>
	);
}
