import { Grenze_Gotisch } from "next/font/google";
import c from "config";
import HeroClouds from "./HeroClouds";

const gothic = Grenze_Gotisch({
	subsets: ["latin"],
	weight: ["500", "700"],
	variable: "--font-gothic",
});

export default function Hero() {
	return (
		<section
			className={`${gothic.variable} relative z-10 min-h-[100svh] w-full`}
		>
			{/* Background — placeholder sky until the castle/mountain landscape art exists.
			    Swap this div for an <Image fill> of the landscape when it's ready. */}
			<div
				aria-hidden
				className="absolute inset-0 -z-20 bg-gradient-to-b from-[#7478a6] via-[#e9c48a] to-[#fff1d8]"
			/>

			{/* Title */}
			<div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-[40vh] text-center">
				<h1 className="font-[family-name:var(--font-gothic)] text-6xl font-bold leading-none text-[#2f1e30] drop-shadow-[0_2px_12px_rgba(255,241,216,0.6)] sm:text-7xl md:text-8xl lg:text-9xl">
					{c.hackathonName}
				</h1>
			</div>

			<HeroClouds
				applyHref="/register"
				mentorHref={c.links.mentorForm}
				volunteerHref={c.links.volunteerForm}
			/>
		</section>
	);
}
