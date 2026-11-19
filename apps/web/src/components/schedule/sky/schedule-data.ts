import { formatInTimeZone } from "date-fns-tz";
import type { EventType } from "@/lib/types/events";

// Tri Nguyen: The hack day shown on the page. dayKey is the "yyyy-MM-dd" date of the first event in the hackathon timezone.
export type ScheduleDay = {
	dayKey: string;
	events: EventType[];
};

// Tri Nguyen: Figma v4 has 10 event clouds, one for each cloud shape in assets.ts, so the page shows at most 10 events.
export const MAX_HACK_DAY_EVENTS = 10;

// Tri Nguyen: CodeQuantum is a single hack day, so visible events go into one day. Hidden events are removed, the rest are sorted by start time, and only the first 10 are kept.
export function buildHackDay(
	events: EventType[],
	timezone: string,
): ScheduleDay | null {
	const visibleEvents = events
		.filter((event) => !event.hidden)
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
		.slice(0, MAX_HACK_DAY_EVENTS);

	if (visibleEvents.length === 0) {
		return null;
	}

	return {
		dayKey: formatInTimeZone(
			visibleEvents[0].startTime,
			timezone,
			"yyyy-MM-dd",
		),
		events: visibleEvents,
	};
}

// Tri Nguyen: Card time text, e.g. "8:00 AM – 9:00 AM", or just "5:30 PM" for deadlines.
export function formatTimeRange(
	start: Date,
	end: Date,
	timezone: string,
): string {
	const startText = formatInTimeZone(start, timezone, "h:mm a");
	if (start.getTime() === end.getTime()) {
		return startText;
	}
	return `${startText} – ${formatInTimeZone(end, timezone, "h:mm a")}`;
}
