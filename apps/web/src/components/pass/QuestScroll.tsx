import Image from "next/image";
import type { CSSProperties } from "react";
import type { HackerClass } from "./classes";
import { PASS_COPY } from "./content";
import { PASS_QR_ID, PassQrCode, QrDialog } from "./PassQr";

// Tri Nguyen: The fields of the signed-in hacker the card shows. Comes from getHacker in PassPage.tsx.
export type PassHacker = {
	firstName: string;
	lastName: string;
	hackerTag: string;
	profilePhoto: string | null;
};

type QuestScrollProps = {
	hacker: PassHacker;
	hackerClass: HackerClass;
	qrPayload: string;
};

// Tri Nguyen: The hacker pass card, a quest scroll from Figma (Cards page, "Hacker Card" Class=*, Crest=Simple).
// Tri Nguyen: The scroll is 3 images: top and bottom rolls keep their shape, the middle stretches to fit the content.
export default function QuestScroll({
	hacker,
	hackerClass,
	qrPayload,
}: QuestScrollProps) {
	const { accent, tint } = hackerClass;
	const fullName = `${hacker.firstName} ${hacker.lastName}`;

	return (
		<article
			aria-label={`${fullName}'s hacker pass`}
			className="relative mx-auto w-full max-w-[366px] [container-type:inline-size]"
			style={{ "--accent": accent } as CSSProperties}
		>
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-[23.8cqw] top-[23.8cqw] bg-[url('/img/pass/scroll-middle.webp')] bg-[length:100%_100%]"
			/>
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-[24.2cqw] bg-[url('/img/pass/scroll-top.webp')] bg-[length:100%_100%]"
			/>
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-[24.2cqw] bg-[url('/img/pass/scroll-bottom.webp')] bg-[length:100%_100%]"
			/>

			<div className="relative flex flex-col items-center pb-[22.4cqw] pl-[14.75cqw] pr-[13.66cqw] pt-[20.77cqw]">
				{/* Tri Nguyen: Header lettering in the class color. */}
				<p className="flex items-center gap-1.5 whitespace-pre pb-0.5 pt-1.5 text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">
					<span>{PASS_COPY.ribbonStart}</span>
					<span aria-hidden>·</span>
					<span>{PASS_COPY.ribbonEnd}</span>
				</p>

				{/* Tri Nguyen: Crest with a soft class-colored glow, and the profile photo (or first initial) in a gold ring. */}
				<div className="relative h-[166px] w-full">
					<div
						aria-hidden
						className="absolute inset-0"
						style={{
							background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${tint}CC 0%, ${tint}73 55%, ${tint}00 100%)`,
						}}
					/>
					<Image
						src={hackerClass.crest}
						alt=""
						width={158}
						height={158}
						unoptimized
						priority
						className="absolute left-1/2 top-1 -translate-x-1/2"
					/>
					<div className="absolute left-[calc(50%+33px)] top-[92px] size-[70px] rounded-full bg-cq-gold p-1">
						<div
							className="relative grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-[#FFFCF4] font-gotisch text-[32px] font-bold text-[#FFFCF4]"
							style={{
								background: `linear-gradient(90deg, ${hackerClass.avatarFrom}, ${accent}8C)`,
							}}
						>
							{hacker.firstName.charAt(0)}
							{hacker.profilePhoto ? (
								// eslint-disable-next-line @next/next/no-img-element -- Tri Nguyen: profile photos can come from any host, so next/image remotePatterns would block some.
								<img
									src={hacker.profilePhoto}
									alt=""
									className="absolute inset-0 size-full object-cover"
								/>
							) : null}
						</div>
					</div>
				</div>

				{/* Tri Nguyen: Name, @tag, class title and motto. */}
				<div className="flex flex-col items-center gap-0.5 px-6 pb-1.5 text-center">
					<h2 className="font-gotisch text-[40px] font-bold leading-[1.05] text-cq-ink">
						{fullName}
					</h2>
					<p className="text-[15px] font-medium text-cq-muted">
						@{hacker.hackerTag}
					</p>
					<p className="py-0.5 text-[15px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
						{hackerClass.title}
					</p>
					<p className="pt-1.5 text-[17px] italic text-cq-plum">
						{hackerClass.motto}
					</p>
				</div>

				{/* Tri Nguyen: Gold flourish divider, exported from Figma. */}
				<div
					aria-hidden
					className="flex h-[30px] w-full items-center px-[5px]"
				>
					<svg
						viewBox="0 0 252 17"
						fill="none"
						className="h-auto w-full"
					>
						<path
							d="M3.73 8.4h100.8M147.47 8.4h100.8"
							stroke="#C9A35A"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M104.53 8.4c5.6-6.53 11.2-6.53 13.07 0-1.87 6.53-7.47 6.53-13.07 0ZM147.47 8.4c-5.6-6.53-11.2-6.53-13.07 0 1.87 6.53 7.47 6.53 13.07 0Z"
							fill="#D7A33D"
						/>
						<path
							d="m126 1.87 6.53 6.53L126 14.93l-6.53-6.53L126 1.87Z"
							fill="#D7A33D"
							stroke="#9C7A3A"
						/>
						<circle cx="3.73" cy="8.4" r="1.87" fill="#D7A33D" />
						<circle cx="248.27" cy="8.4" r="1.87" fill="#D7A33D" />
					</svg>
				</div>

				{/* Tri Nguyen: QR stub. Tapping the code opens it full screen (PassQr.tsx). */}
				<div className="flex w-full flex-col items-center gap-2.5 pb-[18px] pt-1 text-center">
					<QrDialog payload={qrPayload}>
						<button
							type="button"
							id={PASS_QR_ID}
							aria-label={PASS_COPY.showQr}
							className="aspect-square w-full max-w-[216px] rounded-[14px] border-2 border-[var(--accent)] bg-white p-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
						>
							<PassQrCode payload={qrPayload} />
						</button>
					</QrDialog>
					<p className="text-[15px] font-semibold text-cq-ink">
						{PASS_COPY.qrCaption}
					</p>
					<p className="text-sm text-cq-muted">{PASS_COPY.qrHint}</p>
				</div>

				{/* Tri Nguyen: Event date and place. The wax seal sits to the right on the bottom roll. */}
				<div className="w-full pb-1 pl-1 pt-1.5 text-[13px] font-semibold text-[var(--accent)]">
					<p>{PASS_COPY.eventDate}</p>
					<p>{PASS_COPY.location}</p>
				</div>
			</div>

			<Image
				src={hackerClass.seal}
				alt=""
				width={74}
				height={74}
				unoptimized
				className="absolute bottom-[14.75cqw] right-[14.75cqw] w-[20.2cqw] rotate-[9deg] drop-shadow-[0_3px_4px_rgba(61,36,64,0.25)]"
			/>
		</article>
	);
}
