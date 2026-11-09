import { describe, expect, it } from "vitest";
import { LANE_WIDTH, buildSkyLayout, getDrawProgress } from "./sky-layout";

describe("buildSkyLayout", () => {
	it("returns an empty layout when there are no events", () => {
		expect(buildSkyLayout(0)).toEqual({
			height: 0,
			path: "",
			markers: [],
			cardTops: [],
		});
	});

	it("stacks cards 200px apart starting 40px from the top", () => {
		expect(buildSkyLayout(3).cardTops).toEqual([40, 240, 440]);
	});

	it("matches the Figma section height for ten events", () => {
		expect(buildSkyLayout(10).height).toBe(2440);
	});

	it("bends the path away from each card", () => {
		// Tri Nguyen: Even cards sit on the left so the path bends right, odd cards do the opposite.
		expect(buildSkyLayout(2).markers).toEqual([
			{ x: 330, y: 160 },
			{ x: 150, y: 360 },
		]);
	});

	it("draws one smooth curve through every marker", () => {
		expect(buildSkyLayout(2).path).toBe(
			"M 240 -20 C 240 70, 330 70, 330 160 C 330 260, 150 260, 150 360 C 150 500, 240 500, 240 640",
		);
	});

	it("uses a 480px lane", () => {
		expect(LANE_WIDTH).toBe(480);
	});
});

describe("getDrawProgress", () => {
	it("is 0 before the path reaches the reading line", () => {
		expect(getDrawProgress(1000, 2000, 800)).toBe(0);
	});

	it("grows as the path scrolls up", () => {
		expect(getDrawProgress(-1000, 2000, 800)).toBeCloseTo(0.8);
	});

	it("stops at 1 once fully scrolled past", () => {
		expect(getDrawProgress(-3000, 2000, 800)).toBe(1);
	});

	it("is fully drawn when the path has no height", () => {
		expect(getDrawProgress(0, 0, 800)).toBe(1);
	});
});
