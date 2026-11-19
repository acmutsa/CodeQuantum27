import Image from "next/image";
import { FINALE_LANDSCAPE } from "./assets";

// Tri Nguyen: Closes out the schedule with the castle and lake landscape, matching Figma v4. The winding path runs down behind it and ends at the castle.
export default function FinaleTransition() {
	return (
		<div
			aria-hidden
			className="pointer-events-none relative z-0 mt-12 overflow-x-clip lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0"
		>
			{/* Tri Nguyen: Bleeds past the left edge just like Figma. */}
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
		</div>
	);
}
