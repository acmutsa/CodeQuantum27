import c from "config";
import { getAllEvents } from "db/functions";
import MLHBadge from "@/components/landing/MLHBadge";
import Navbar from "@/components/shared/Navbar";
import { SCHEDULE_COPY } from "./content";
import DayHeader from "./DayHeader";
import { grenze, grenzeGotisch } from "./fonts";
import ScheduleFooter from "./ScheduleFooter";
import ScheduleHero from "./ScheduleHero";
import {
	formatDayLabel,
	formatHeroDate,
	getDayTitle,
	groupEventsByDay,
} from "./schedule-data";
import SkyTimeline from "./SkyTimeline";

// Tri Nguyen: Server entry for the sky schedule. Reads events on the server, so hidden events never reach the browser.
// Tri Nguyen: Not routed yet. To go live, render <SkySchedulePage /> from apps/web/src/app/schedule/page.tsx.
export default async function SkySchedulePage() {
	const timezone = c.hackathonTimezone;
	const days = groupEventsByDay(await getAllEvents(), timezone);
	const firstStart = days[0]?.events[0]?.startTime;
	const heroDate = firstStart
		? formatHeroDate(firstStart, timezone)
		: SCHEDULE_COPY.dateFallback;

	return (
		<div
			className={`${grenze.variable} ${grenzeGotisch.variable} w-full overflow-x-hidden bg-cq-parchment font-grenze text-cq-ink`}
		>
			<Navbar />
			{/* Tri Nguyen: MLH season badge goes right after the navbar, same as the landing page. Nothing on this page goes above z-20 so it stays on top. */}
			<MLHBadge />

			<main>
				<ScheduleHero dateText={heroDate} />

				{days.length === 0 ? (
					<p className="relative z-20 px-6 pb-24 pt-32 text-center text-xl text-cq-muted">
						{SCHEDULE_COPY.emptyState}
					</p>
				) : (
					days.map((day, index) => {
						const headingId = `schedule-day-${day.dayKey}`;
						return (
							<section
								key={day.dayKey}
								aria-labelledby={headingId}
							>
								<DayHeader
									headingId={headingId}
									title={getDayTitle(index, days.length)}
									label={formatDayLabel(day, timezone)}
									isFirst={index === 0}
								/>
								<SkyTimeline
									events={day.events}
									timezone={timezone}
									showFinale={index === days.length - 1}
								/>
							</section>
						);
					})
				)}
			</main>

			<ScheduleFooter />
		</div>
	);
}
