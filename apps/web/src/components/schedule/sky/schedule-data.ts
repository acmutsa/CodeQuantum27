import { formatInTimeZone } from "date-fns-tz";
import type { EventType } from "@/lib/types/events";

// Tri Nguyen: One calendar day of the schedule. dayKey is "yyyy-MM-dd" in the hackathon timezone.
export type ScheduleDay = {
	dayKey: string;
	events: EventType[];
};

// Tri Nguyen: Removes hidden events, sorts by start time, and buckets events by local calendar day.
export function groupEventsByDay(
	events: EventType[],
	timezone: string,
): ScheduleDay[] {
	const visibleEvents = events
		.filter((event) => !event.hidden)
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

	const days: ScheduleDay[] = [];
	for (const event of visibleEvents) {
		const dayKey = formatInTimeZone(
			event.startTime,
			timezone,
			"yyyy-MM-dd",
		);
		const currentDay = days[days.length - 1];

		if (currentDay && currentDay.dayKey === dayKey) {
			currentDay.events.push(event);
		} else {
			days.push({ dayKey, events: [event] });
		}
	}
	return days;
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

// Tri Nguyen: A one day event is "Hack Day". Longer events fall back to "Day 1", "Day 2", and so on.
export function getDayTitle(index: number, totalDays: number): string {
	return totalDays === 1 ? "Hack Day" : `Day ${index + 1}`;
}
