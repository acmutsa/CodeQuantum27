import { describe, expect, it } from "vitest";
import { HACKER_CLASSES, getHackerClass } from "./classes";

describe("getHackerClass", () => {
	it("maps groups 0, 1, 2 to Knight, Wizard, Archer like the config order", () => {
		expect(getHackerClass(0).id).toBe("knight");
		expect(getHackerClass(1).id).toBe("wizard");
		expect(getHackerClass(2).id).toBe("archer");
	});

	it("wraps old group numbers from before there were 3 classes", () => {
		expect(getHackerClass(4).id).toBe("wizard");
	});

	it("falls back to Knight for bad values", () => {
		expect(getHackerClass(-1).id).toBe("knight");
		expect(getHackerClass(Number.NaN).id).toBe("knight");
	});

	it("gives every class its own art", () => {
		const crests = new Set(HACKER_CLASSES.map((c) => c.crest));
		expect(crests.size).toBe(3);
	});
});
