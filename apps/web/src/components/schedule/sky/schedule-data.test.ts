import { describe, expect, it } from "vitest";
import type { EventType } from "@/lib/types/events";
import {
	formatDayLabel,
	formatHeroDate,
	formatTimeRange,
	getDayTitle,
	groupEventsByDay,
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

describe("groupEventsByDay", () => {
	it("returns no days when there are no events", () => {
		expect(groupEventsByDay([], TIMEZONE)).toEqual([]);
	});

	it("drops hidden events and sorts by start time", () => {
		const later = makeEvent({
			id: 2,
			startTime: new Date("2027-02-20T16:00:00Z"),
		});
		const earlier = makeEvent({ id: 1 });
		const hidden = makeEvent({ id: 3, hidden: true });

		const days = groupEventsByDay([later, earlier, hidden], TIMEZONE);

		expect(days).toHaveLength(1);
		expect(days[0].events.map((event) => event.id)).toEqual([1, 2]);
	});

	it("splits days using the hackathon timezone, not UTC", () => {
		// Tri Nguyen: 05:00 UTC on Feb 21 is still 11 PM on Feb 20 in Chicago.
		const lateNight = makeEvent({
			id: 1,
			startTime: new Date("2027-02-21T05:00:00Z"),
		});
		const nextMorning = makeEvent({
			id: 2,
			startTime: new Date("2027-02-21T15:00:00Z"),
		});

		const days = groupEventsByDay([lateNight, nextMorning], TIMEZONE);

		expect(days.map((day) => day.dayKey)).toEqual([
			"2027-02-20",
			"2027-02-21",
		]);
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

describe("getDayTitle", () => {
	it("calls a single day Hack Day", () => {
		expect(getDayTitle(0, 1)).toBe("Hack Day");
	});

	it("numbers days when the event spans several days", () => {
		expect(getDayTitle(0, 2)).toBe("Day 1");
		expect(getDayTitle(1, 2)).toBe("Day 2");
	});
});
