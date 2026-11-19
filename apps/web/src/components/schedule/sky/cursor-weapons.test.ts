import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	CURSOR_WEAPONS,
	type CursorWeapon,
	cursorTransform,
} from "./cursor-weapons";

const WEAPONS = Object.keys(CURSOR_WEAPONS) as CursorWeapon[];

describe("CURSOR_WEAPONS", () => {
	it.each(WEAPONS)("%s hotspot is inside the rendered box", (weapon) => {
		const { hotspotX, hotspotY, size } = CURSOR_WEAPONS[weapon];
		expect(hotspotX).toBeGreaterThanOrEqual(0);
		expect(hotspotY).toBeGreaterThanOrEqual(0);
		expect(hotspotX).toBeLessThan(size);
		expect(hotspotY).toBeLessThan(size);
	});

	it.each(WEAPONS)("%s art files exist in public", (weapon) => {
		const { src, effectSrc } = CURSOR_WEAPONS[weapon];
		for (const file of [src, effectSrc]) {
			expect(existsSync(path.join(process.cwd(), "public", file))).toBe(
				true,
			);
		}
	});
});

describe("cursorTransform", () => {
	it("offsets the image by the hotspot so the tip sits on the pointer", () => {
		expect(cursorTransform(100, 50, "sword")).toBe(
			"translate3d(97px, 47px, 0)",
		);
	});

	it("allows negative positions near the top-left edge", () => {
		expect(cursorTransform(0, 0, "staff")).toBe(
			"translate3d(-3px, -3px, 0)",
		);
	});
});
