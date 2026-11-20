import { describe, expect, it } from "vitest";
import type { EventType } from "@/lib/types/events";
import { PLACEHOLDER_QUEST_LOG, buildQuestLog } from "./quest-log";

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

describe("buildQuestLog", () => {
	it("marks scanned events with the scan time", () => {
		const log = buildQuestLog(
			[makeEvent({ id: 7 })],
			[{ eventID: 7, updatedAt: new Date("2027-02-20T14:12:00Z") }],
			TIMEZONE,
		);
		expect(log.rows).toEqual([
			{ id: 7, title: "Check-in & Breakfast", scanned: true, note: "Scanned · 8:12 AM" },
		]);
		expect(log.scannedCount).toBe(1);
	});

	it("shows the start time for events not scanned yet", () => {
		const log = buildQuestLog(
			[makeEvent({ id: 2, title: "Dinner", startTime: new Date("2027-02-21T00:00:00Z") })],
			[],
			TIMEZONE,
		);
		expect(log.rows[0]).toEqual({ id: 2, title: "Dinner", scanned: false, note: "Opens 6:00 PM" });
		expect(log.scannedCount).toBe(0);
	});

	it("keeps the event order and ignores scans for other events", () => {
		const log = buildQuestLog(
			[makeEvent({ id: 1, title: "A" }), makeEvent({ id: 2, title: "B" })],
			[{ eventID: 99, updatedAt: new Date() }],
			TIMEZONE,
		);
		expect(log.rows.map((row) => row.title)).toEqual(["A", "B"]);
		expect(log.scannedCount).toBe(0);
	});
});

describe("PLACEHOLDER_QUEST_LOG", () => {
	it("matches the Figma mock: 3 of 4 scanned", () => {
		expect(PLACEHOLDER_QUEST_LOG.rows).toHaveLength(4);
		expect(PLACEHOLDER_QUEST_LOG.scannedCount).toBe(3);
	});
});
