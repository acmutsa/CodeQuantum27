import { describe, expect, it } from "vitest";
import type { EventType } from "@/lib/types/events";
import {
	MAX_HACK_DAY_EVENTS,
	buildHackDay,
	formatDayLabel,
	formatHeroDate,
	formatTimeRange,
} from "./schedule-data";

const TIMEZONE = "America/Chicago";

// Tri Nguyen: Builds a fake event so each test only spells out the fields it cares about.
function makeEvent(overrides: Partial<EventType>): EventType {
	return {
		id: 1,
		title: "Check-in & Breakfast",
		startTime: new Date("2027-02-20T14:00:00Z"),
		endTime: new Date("2027-02-20T15:00:00Z"),
		location: "Student Union Lobby",
		description: "",
		type: "Meal",
		host: null,
		hidden: false,
		...overrides,
	};
}

describe("buildHackDay", () => {
	it("returns null when there are no events", () => {
		expect(buildHackDay([], TIMEZONE)).toBeNull();
	});

	it("returns null when every event is hidden", () => {
		expect(
			buildHackDay([makeEvent({ hidden: true })], TIMEZONE),
		).toBeNull();
	});

	it("drops hidden events and sorts by start time", () => {
		const later = makeEvent({
			id: 2,
			startTime: new Date("2027-02-20T16:00:00Z"),
		});
		const earlier = makeEvent({ id: 1 });
		const hidden = makeEvent({ id: 3, hidden: true });

		const day = buildHackDay([later, earlier, hidden], TIMEZONE);

		expect(day?.events.map((event) => event.id)).toEqual([1, 2]);
	});

	it("keeps only the first 10 events, one per Figma cloud", () => {
		const events = Array.from({ length: 12 }, (_, index) =>
			makeEvent({
				id: index + 1,
				startTime: new Date(Date.UTC(2027, 1, 20, 14 + index)),
			}),
		);

		const day = buildHackDay(events.reverse(), TIMEZONE);

		expect(MAX_HACK_DAY_EVENTS).toBe(10);
		expect(day?.events.map((event) => event.id)).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
		]);
	});

	it("keeps every event in one day keyed by the first start in the hackathon timezone", () => {
		// Tri Nguyen: 05:00 UTC on Feb 21 is still 11 PM on Feb 20 in Chicago.
		const lateNight = makeEvent({
			id: 1,
			startTime: new Date("2027-02-21T05:00:00Z"),
		});
		const nextMorning = makeEvent({
			id: 2,
			startTime: new Date("2027-02-21T15:00:00Z"),
		});

		const day = buildHackDay([nextMorning, lateNight], TIMEZONE);

		expect(day?.dayKey).toBe("2027-02-20");
		expect(day?.events.map((event) => event.id)).toEqual([1, 2]);
	});
});

describe("formatTimeRange", () => {
	it("shows a start and end time", () => {
		expect(
			formatTimeRange(
				new Date("2027-02-20T14:00:00Z"),
				new Date("2027-02-20T15:00:00Z"),
				TIMEZONE,
			),
		).toBe("8:00 AM – 9:00 AM");
	});

	it("shows a single time when start equals end", () => {
		const deadline = new Date("2027-02-20T23:30:00Z");
		expect(formatTimeRange(deadline, deadline, TIMEZONE)).toBe("5:30 PM");
	});
});

describe("formatDayLabel", () => {
	it("summarizes the weekday, date, and full day span", () => {
		const day = {
			dayKey: "2027-02-20",
			events: [
				makeEvent({ id: 1 }),
				makeEvent({
					id: 2,
					startTime: new Date("2027-02-20T23:30:00Z"),
					endTime: new Date("2027-02-21T02:00:00Z"),
				}),
			],
		};

		expect(formatDayLabel(day, TIMEZONE)).toBe(
			"Saturday · Feb 20 · 8 AM – 8 PM",
		);
	});
});

describe("formatHeroDate", () => {
	it("writes the full date for the hero", () => {
		expect(formatHeroDate(new Date("2027-02-20T14:00:00Z"), TIMEZONE)).toBe(
			"Saturday, February 20, 2027",
		);
	});
});
