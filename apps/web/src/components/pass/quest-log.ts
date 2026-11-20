import { formatInTimeZone } from "date-fns-tz";
import type { EventType } from "@/lib/types/events";

// Tri Nguyen: One check-in from the scans table (packages/db/functions/scans.ts).
export type ScanRecord = { eventID: number; updatedAt: Date };

// Tri Nguyen: One row in the desktop Quest Log. note is the right-hand text, e.g. "Scanned · 8:12 AM" or "Opens 6:00 PM".
export type QuestRow = {
	id: number;
	title: string;
	scanned: boolean;
	note: string;
};

export type QuestLogData = { rows: QuestRow[]; scannedCount: number };

// Tri Nguyen: Joins the schedule events (already filtered and sorted by buildHackDay) with this hacker's scans.
export function buildQuestLog(
	events: EventType[],
	scans: ScanRecord[],
	timezone: string,
): QuestLogData {
	const scannedAt = new Map(
		scans.map((scan) => [scan.eventID, scan.updatedAt]),
	);
	const rows = events.map((event) => {
		const scanTime = scannedAt.get(event.id);
		return {
			id: event.id,
			title: event.title,
			scanned: scanTime !== undefined,
			note: scanTime
				? `Scanned · ${formatInTimeZone(scanTime, timezone, "h:mm a")}`
				: `Opens ${formatInTimeZone(event.startTime, timezone, "h:mm a")}`,
		};
	});
	return { rows, scannedCount: rows.filter((row) => row.scanned).length };
}

// Tri Nguyen: Shown until the real schedule is added in /admin/events. Same rows as the Figma mock.
export const PLACEHOLDER_QUEST_LOG: QuestLogData = {
	rows: [
		{
			id: -1,
			title: "Check-in & Breakfast",
			scanned: true,
			note: "Scanned · 8:12 AM",
		},
		{
			id: -2,
			title: "Opening Ceremony",
			scanned: true,
			note: "Scanned · 9:04 AM",
		},
		{ id: -3, title: "Lunch", scanned: true, note: "Scanned · 12:41 PM" },
		{ id: -4, title: "Dinner", scanned: false, note: "Opens 6:00 PM" },
	],
	scannedCount: 3,
};
