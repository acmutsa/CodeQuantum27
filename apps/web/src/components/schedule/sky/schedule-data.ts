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

// Tri Nguyen: Short clock text that drops ":00", e.g. "8 AM" but "5:30 PM".
function formatShortClock(date: Date, timezone: string): string {
	const minutes = formatInTimeZone(date, timezone, "mm");
	return formatInTimeZone(
		date,
		timezone,
		minutes === "00" ? "h a" : "h:mm a",
	);
}

// Tri Nguyen: Line next to the day title, e.g. "Saturday · Feb 20 · 8 AM – 8 PM".
export function formatDayLabel(day: ScheduleDay, timezone: string): string {
	const firstStart = day.events[0].startTime;
	const lastEnd = new Date(
		Math.max(...day.events.map((event) => event.endTime.getTime())),
	);

	const weekday = formatInTimeZone(firstStart, timezone, "EEEE");
	const date = formatInTimeZone(firstStart, timezone, "MMM d");
	const span = `${formatShortClock(firstStart, timezone)} – ${formatShortClock(lastEnd, timezone)}`;

	return `${weekday} · ${date} · ${span}`;
}

// Tri Nguyen: Full date for the hero meta row, e.g. "Saturday, February 20, 2027".
export function formatHeroDate(date: Date, timezone: string): string {
	return formatInTimeZone(date, timezone, "EEEE, MMMM d, yyyy");
}
