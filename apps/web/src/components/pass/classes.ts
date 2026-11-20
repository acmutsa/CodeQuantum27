import { DRAGONS } from "@/components/schedule/sky/assets";

// Tri Nguyen: Card art for the hacker pass lives in /public/img/pass. Dragons are shared with the schedule page.
const PASS_ART = "/img/pass";

// Tri Nguyen: Everything that changes between Knight, Wizard and Archer. Copy and colors come from the Figma "Cards" page.
export type HackerClass = {
	id: "knight" | "wizard" | "archer";
	title: string;
	motto: string;
	order: string;
	lore: string;
	accent: string;
	tint: string;
	avatarFrom: string;
	crest: string;
	seal: string;
	dragon: { src: string; width: number; height: number };
};

// Tri Nguyen: Same order as `groups` in packages/config/hackkit.config.ts, so hackerData.group is the index here.
export const HACKER_CLASSES: readonly HackerClass[] = [
	{
		id: "knight",
		title: "Knight of the Realm",
		motto: "“Hold the line.”",
		order: "Order of the Knights",
		lore: "The Knights hold the line. Steady, loyal, and first into the fray, your order keeps the realm standing until the very last commit.",
		accent: "#8C2F2F",
		tint: "#E9C9BC",
		avatarFrom: "#F1DDD3",
		crest: `${PASS_ART}/crest-knight.webp`,
		seal: `${PASS_ART}/seal-knight.webp`,
		dragon: { src: DRAGONS.chestnut, width: 220, height: 159 },
	},
	{
		id: "wizard",
		title: "Wizard of the Arcane",
		motto: "“Bend the code.”",
		order: "Order of the Wizards",
		lore: "The Wizards bend the code. Curious and clever, your order turns wild ideas into working spells before the final bell rings.",
		accent: "#4E3A86",
		tint: "#D9CDEE",
		avatarFrom: "#E5DEF2",
		crest: `${PASS_ART}/crest-wizard.webp`,
		seal: `${PASS_ART}/seal-wizard.webp`,
		dragon: { src: DRAGONS.plum, width: 220, height: 131 },
	},
	{
		id: "archer",
		title: "Archer of the Wilds",
		motto: "“Never miss.”",
		order: "Order of the Archers",
		lore: "The Archers never miss. Sharp-eyed and swift, your order picks its target early and lands every shot by demo time.",
		accent: "#2F5B3B",
		tint: "#CBDDBF",
		avatarFrom: "#DCE7D2",
		crest: `${PASS_ART}/crest-archer.webp`,
		seal: `${PASS_ART}/seal-archer.webp`,
		dragon: { src: DRAGONS.gold, width: 220, height: 119 },
	},
];

// Tri Nguyen: Picks the class from the hacker's group number. Wraps old numbers and falls back to Knight so a bad value never breaks the page.
export function getHackerClass(group: number): HackerClass {
	const index =
		Number.isInteger(group) && group >= 0
			? group % HACKER_CLASSES.length
			: 0;
	return HACKER_CLASSES[index];
}
