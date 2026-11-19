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

	it("stacks cards 160px apart starting 24px from the top", () => {
		expect(buildSkyLayout(3).cardTops).toEqual([24, 184, 344]);
	});

	it("leaves room for the castle finale below the last card", () => {
		expect(buildSkyLayout(10).height).toBe(2020);
	});

	it("bends the path away from each card", () => {
		// Tri Nguyen: Even cards sit on the left so the path bends right, odd cards do the opposite.
		expect(buildSkyLayout(2).markers).toEqual([
			{ x: 270, y: 120 },
			{ x: 130, y: 280 },
		]);
	});

	it("draws one smooth curve through every marker", () => {
		expect(buildSkyLayout(2).path).toBe(
			"M 200 -20 C 200 50, 270 50, 270 120 C 270 200, 130 200, 130 280 C 130 350, 200 350, 200 420",
		);
	});

	it("uses a 400px lane", () => {
		expect(LANE_WIDTH).toBe(400);
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
