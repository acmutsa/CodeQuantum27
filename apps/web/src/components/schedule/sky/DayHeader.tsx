import Reveal from "./Reveal";

type DayHeaderProps = {
	headingId: string;
	title: string;
	label: string;
};

// Tri Nguyen: "Hack Day" title with the date as plain text beside it. The top padding clears the hero cloud bank.
export default function DayHeader({ headingId, title, label }: DayHeaderProps) {
	return (
		<header className="relative z-20 mx-auto max-w-[1440px] px-6 pb-2 pt-20 lg:px-[120px] lg:pt-[84px]">
			<Reveal className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
				<h2
					id={headingId}
					className="font-gotisch text-4xl font-bold text-cq-plum lg:text-[46px]"
				>
					{title}
				</h2>
				<p className="font-grenze text-base font-semibold text-cq-plum/85">
					{label}
				</p>
			</Reveal>
		</header>
	);
}
