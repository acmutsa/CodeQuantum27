import c from "config";
import { getAllEvents } from "db/functions";
import MLHBadge from "@/components/landing/MLHBadge";
import Navbar from "@/components/shared/Navbar";
import { SCHEDULE_COPY } from "./content";
import DayHeader from "./DayHeader";
import { grenze, grenzeGotisch } from "./fonts";
import ScheduleFooter from "./ScheduleFooter";
import ScheduleHero from "./ScheduleHero";
import { buildHackDay } from "./schedule-data";
import SkyTimeline from "./SkyTimeline";

const HACK_DAY_HEADING_ID = "schedule-hack-day";

// Tri Nguyen: Server entry for the sky schedule. Reads events on the server, so hidden events never reach the browser.
// Tri Nguyen: Rendered by apps/web/src/app/schedule/page.tsx. The landing page links here with a placeholder Schedule button for now.
export default async function SkySchedulePage() {
	const timezone = c.hackathonTimezone;
	const hackDay = buildHackDay(await getAllEvents(), timezone);

	return (
		<div
			className={`${grenze.variable} ${grenzeGotisch.variable} w-full overflow-x-hidden bg-cq-parchment font-grenze text-cq-ink`}
		>
			<Navbar />
			{/* Tri Nguyen: MLH season badge goes right after the navbar, same as the landing page. Nothing on this page goes above z-20 so it stays on top. */}
			<MLHBadge />

			<main>
				<ScheduleHero />

				{hackDay ? (
					<section aria-labelledby={HACK_DAY_HEADING_ID}>
						<DayHeader
							headingId={HACK_DAY_HEADING_ID}
							title={SCHEDULE_COPY.dayTitle}
							label={SCHEDULE_COPY.dayLabel}
						/>
						<SkyTimeline
							events={hackDay.events}
							timezone={timezone}
						/>
					</section>
				) : (
					<p className="relative z-20 px-6 pb-24 pt-28 text-center text-lg text-cq-muted">
						{SCHEDULE_COPY.emptyState}
					</p>
				)}
			</main>

			<ScheduleFooter />
		</div>
	);
}
