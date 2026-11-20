import { Grenze, Grenze_Gotisch } from "next/font/google";

// Tri Nguyen: Body font for the schedule and hacker pass pages. Weights match the Figma text styles (Regular, Medium, SemiBold, Bold, Italic).
export const grenze = Grenze({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
	variable: "--font-grenze",
});

// Tri Nguyen: Blackletter display font for big titles like "Schedule" and "Hack Day".
export const grenzeGotisch = Grenze_Gotisch({
	subsets: ["latin"],
	weight: ["600", "700"],
	variable: "--font-grenze-gotisch",
});
