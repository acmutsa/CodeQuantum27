import { auth } from "@clerk/nextjs/server";
import c from "config";
import { getAllEvents, getHacker, getScansForUser } from "db/functions";
import { redirect } from "next/navigation";
import { grenze, grenzeGotisch } from "@/components/schedule/sky/fonts";
import { buildHackDay } from "@/components/schedule/sky/schedule-data";
import { createQRpayload } from "@/lib/utils/shared/qr";
import ClassPanel from "./ClassPanel";
import { getHackerClass } from "./classes";
import PassBackdrop from "./PassBackdrop";
import PassNav from "./PassNav";
import { PLACEHOLDER_QUEST_LOG, buildQuestLog } from "./quest-log";
import QuestScroll from "./QuestScroll";

// Tri Nguyen: Server entry for the hacker pass (rendered by app/pass/page.tsx). middleware.ts already makes /pass sign-in only.
// Tri Nguyen: Unregistered or unapproved users are sent to the same places the dashboard sends them (app/dash/layout.tsx).
export default async function PassPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const hacker = await getHacker(userId);
	if (!hacker?.hackerData) redirect("/register");
	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		!hacker.isApproved
	) {
		redirect("/i/approval");
	}

	// Tri Nguyen: The Quest Log uses the same events as the schedule page (hidden ones are removed by buildHackDay). With no events yet it shows the Figma placeholder.
	const timezone = c.hackathonTimezone;
	const [events, scans] = await Promise.all([
		getAllEvents(),
		getScansForUser(userId),
	]);
	const hackDay = buildHackDay(events, timezone);
	const questLog = hackDay
		? buildQuestLog(hackDay.events, scans, timezone)
		: PLACEHOLDER_QUEST_LOG;

	const hackerClass = getHackerClass(hacker.hackerData.group);
	// Tri Nguyen: Same QR payload as the old pass, so the admin scanner keeps working.
	const qrPayload = createQRpayload({
		userID: userId,
		createdAt: new Date(),
	});

	return (
		<div
			className={`${grenze.variable} ${grenzeGotisch.variable} min-h-dvh bg-cq-parchment font-grenze text-cq-ink`}
			style={{ "--accent": hackerClass.accent } as React.CSSProperties}
		>
			<PassNav />
			<main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden lg:min-h-[calc(100dvh-4rem)]">
				<PassBackdrop dragon={hackerClass.dragon} />
				<div className="relative mx-auto flex max-w-[1104px] flex-col items-center px-3 pb-4 pt-2 lg:min-h-[calc(100dvh-4rem)] lg:flex-row lg:gap-[86px] lg:px-6 lg:py-10 xl:px-0">
					<div className="w-full max-w-[366px] lg:shrink-0">
						<QuestScroll
							hacker={{
								firstName: hacker.firstName,
								lastName: hacker.lastName,
								hackerTag: hacker.hackerTag,
								profilePhoto: hacker.profilePhoto || null,
							}}
							hackerClass={hackerClass}
							qrPayload={qrPayload}
						/>
					</div>
					<ClassPanel
						hackerClass={hackerClass}
						questLog={questLog}
						qrPayload={qrPayload}
					/>
				</div>
			</main>
		</div>
	);
}
