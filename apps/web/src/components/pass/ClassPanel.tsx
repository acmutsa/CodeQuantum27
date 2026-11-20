import type { HackerClass } from "./classes";
import { PASS_COPY } from "./content";
import { QrDialog, SavePassButton } from "./PassQr";
import type { QuestLogData } from "./quest-log";

type ClassPanelProps = {
	hackerClass: HackerClass;
	questLog: QuestLogData;
	qrPayload: string;
};

const BUTTON =
	"rounded-[10px] px-6 py-3.5 text-[17px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

// Tri Nguyen: Right side of the desktop pass. The Quest Log rows come from buildQuestLog (quest-log.ts), which reads schedule events and this hacker's scans.
export default function ClassPanel({
	hackerClass,
	questLog,
	qrPayload,
}: ClassPanelProps) {
	return (
		<section
			aria-labelledby="pass-class-title"
			className="hidden w-full min-w-0 max-w-[560px] flex-1 flex-col gap-5 lg:flex"
		>
			<p className="text-base font-semibold uppercase tracking-[0.18em] text-cq-plum">
				{PASS_COPY.yourClass}
			</p>
			<h1
				id="pass-class-title"
				className="font-gotisch text-[clamp(52px,5vw,72px)] font-bold leading-none text-cq-ink"
			>
				{hackerClass.order}
			</h1>
			<p className="text-xl font-medium leading-normal text-cq-muted">
				{hackerClass.lore}
			</p>

			{/* Tri Nguyen: Quest Log. Scanned events get a filled check in the class color; upcoming ones a dashed circle and the start time. */}
			<div className="rounded-2xl border-[1.5px] border-[#D3BC8E] bg-[#FBF5E6]/95 px-6 pb-2.5 pt-[18px]">
				<div className="flex items-center justify-between pb-2">
					<h2 className="font-gotisch text-[30px] font-semibold text-cq-ink">
						{PASS_COPY.questLog}
					</h2>
					<p className="text-sm font-medium text-cq-muted">
						{questLog.scannedCount} of {questLog.rows.length}{" "}
						scanned
					</p>
				</div>
				<ol>
					{questLog.rows.map((row) => (
						<li
							key={row.id}
							className="flex items-center gap-3.5 border-t border-[#D3BC8E]/70 py-3"
						>
							<QuestIcon scanned={row.scanned} />
							<span
								className={`flex-1 text-lg font-semibold ${row.scanned ? "text-cq-ink" : "text-cq-muted"}`}
							>
								{row.title}
							</span>
							<span
								className={`text-[15px] font-medium text-cq-muted ${row.scanned ? "" : "italic"}`}
							>
								{row.note}
							</span>
						</li>
					))}
				</ol>
			</div>

			{/* Tri Nguyen: Same QR dialog as tapping the card, plus a PNG download of the code. */}
			<div className="flex gap-3">
				<QrDialog payload={qrPayload}>
					<button
						type="button"
						className={`${BUTTON} bg-[var(--accent)] text-[#FFFCF4] hover:brightness-110`}
					>
						{PASS_COPY.showQr}
					</button>
				</QrDialog>
				<SavePassButton
					className={`${BUTTON} border-[1.5px] border-[var(--accent)] bg-[#FBF5E6] text-[var(--accent)] hover:bg-white`}
				/>
			</div>
		</section>
	);
}

// Tri Nguyen: Status icons exported from Figma. Decorative, the row note says the status in words.
function QuestIcon({ scanned }: { scanned: boolean }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			className="size-6 shrink-0"
		>
			{scanned ? (
				<>
					<circle cx="12" cy="12" r="11" fill="var(--accent)" />
					<path
						d="M7 12.5l3.2 3.2L17 9"
						stroke="#FFFCF4"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</>
			) : (
				<circle
					cx="12"
					cy="12"
					r="10"
					stroke="#6E5270"
					strokeWidth="1.8"
					strokeDasharray="3 3"
				/>
			)}
		</svg>
	);
}
