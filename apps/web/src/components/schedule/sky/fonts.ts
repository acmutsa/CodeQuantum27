import { Grenze, Grenze_Gotisch } from "next/font/google";

// Tri Nguyen: Body font for the schedule page. Weights match the Figma text styles (Regular, Medium, SemiBold, Italic).
export const grenze = Grenze({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	style: ["normal", "italic"],
	variable: "--font-grenze",
});

// Tri Nguyen: Blackletter display font for big titles like "Schedule" and "Hack Day".
export const grenzeGotisch = Grenze_Gotisch({
	subsets: ["latin"],
	weight: ["600", "700"],
	variable: "--font-grenze-gotisch",
});
