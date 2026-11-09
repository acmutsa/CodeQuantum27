import c from "config";
import { SCHEDULE_COPY } from "./content";

// Tri Nguyen: Simple sand colored footer. The Discord link opens in a new tab with noopener so the new page cannot control this one.
export default function ScheduleFooter() {
	return (
		<footer className="bg-cq-sand">
			<div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-7 font-grenze text-[13px] sm:flex-row sm:items-center sm:justify-between lg:px-[120px]">
				<p className="text-cq-muted">{SCHEDULE_COPY.footerCopyright}</p>
				<a
					href={c.links.discord}
					target="_blank"
					rel="noopener noreferrer"
					className="font-medium text-cq-plum underline-offset-4 hover:underline"
				>
					{SCHEDULE_COPY.footerQuestion}
				</a>
			</div>
		</footer>
	);
}
