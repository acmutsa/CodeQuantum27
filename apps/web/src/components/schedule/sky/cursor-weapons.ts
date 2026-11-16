export type CursorWeapon = "sword" | "staff";

type CursorWeaponConfig = {
	src: string;
	effectSrc: string;
	size: number;
	hotspotX: number;
	hotspotY: number;
	clickAnimation: string;
	effectAnimation: string;
	effectSize: number;
};

// Tri Nguyen: Art is 48 units wide with the tip at (3.5, 3.5), so at 40px the tip sits near (3, 3). Effects are 64 units drawn at 64px.
export const CURSOR_WEAPONS: Record<CursorWeapon, CursorWeaponConfig> = {
	sword: {
		src: "/img/cursor/sword.svg",
		effectSrc: "/img/cursor/sword-slash.svg",
		size: 40,
		hotspotX: 3,
		hotspotY: 3,
		clickAnimation: "animate-cq-sword-swing",
		effectAnimation: "animate-cq-slash",
		effectSize: 64,
	},
	staff: {
		src: "/img/cursor/staff.svg",
		effectSrc: "/img/cursor/staff-spark.svg",
		size: 40,
		hotspotX: 3,
		hotspotY: 3,
		clickAnimation: "animate-cq-staff-cast",
		effectAnimation: "animate-cq-spark",
		effectSize: 64,
	},
};

// Tri Nguyen: Places the cursor image so its tip lands exactly on the pointer.
export function cursorTransform(
	x: number,
	y: number,
	weapon: CursorWeapon,
): string {
	const { hotspotX, hotspotY } = CURSOR_WEAPONS[weapon];
	return `translate3d(${x - hotspotX}px, ${y - hotspotY}px, 0)`;
}
