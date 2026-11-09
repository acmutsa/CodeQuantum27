import { cn } from "@/lib/utils/client/cn";
import Reveal from "./Reveal";

type DayHeaderProps = {
	headingId: string;
	title: string;
	label: string;
	isFirst: boolean;
};

// Tri Nguyen: Day title with the date as plain text beside it. The first day gets extra top space so it clears the hero cloud bank.
export default function DayHeader({
	headingId,
	title,
	label,
	isFirst,
}: DayHeaderProps) {
	return (
		<header
			className={cn(
				"relative z-20 mx-auto max-w-[1440px] px-6 pb-4 lg:px-[120px]",
				isFirst ? "pt-28 lg:pt-[111px]" : "pt-12",
			)}
		>
			<Reveal className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
				<h2
					id={headingId}
					className="font-gotisch text-5xl font-bold text-cq-plum lg:text-[60px]"
				>
					{title}
				</h2>
				<p className="font-grenze text-lg font-semibold text-cq-plum/85">
					{label}
				</p>
			</Reveal>
		</header>
	);
}
