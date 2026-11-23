import Image from "next/image";
import { DRAGONS, HERO_ART } from "../schedule/sky/assets";
import { grenze, grenzeGotisch } from "../schedule/sky/fonts";

const chapters = [
	{
		title: "Our Mission",
		body: "CodeQuantum exists to give students from marginalized and underrepresented communities in tech a place to shape what gets built. That purpose has guided past collaborations with ACM-W. We want students to feel comfortable sharing an untested idea, learning a skill from a peer, and passing on something they know.",
	},
	{
		title: "What to Expect",
		body: "Start with a question you’d like to answer or a problem you’ve noticed. Compare ideas with other students, choose one piece you can build, and try it out. As you test and revise your project, you’ll practice breaking down problems and discover how other builders approach the same challenge.",
	},
	{
		title: "Why CodeQuantum?",
		body: "Your project can start with something small that matters to you. If you’re new to coding, seeing your first feature work can give you the confidence to keep going. If you’ve built projects before, working alongside someone with different interests can take a familiar idea in a direction you wouldn’t have found alone.",
	},
];

export default function About() {
	return (
		<section
			id="About"
			aria-labelledby="about-title"
			className={`${grenze.variable} ${grenzeGotisch.variable} scroll-mt-16 border-y border-cq-rope bg-cq-parchment px-6 py-12 font-grenze text-cq-ink sm:px-10 lg:py-20`}
		>
			<div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr] lg:gap-20">
				<div className="min-w-0">
					<h2
						id="about-title"
						className="font-gotisch font-semibold leading-none text-cq-title"
					>
						<span className="block text-3xl sm:text-4xl">
							What is
						</span>
						<span className="block text-[clamp(2.5rem,7.5vw,6rem)]">
							CodeQuantum?
						</span>
					</h2>
					<p className="mb-7 mt-5 max-w-xl text-xl leading-snug sm:text-2xl">
						CodeQuantum is a 12-hour, student-run hackathon hosted
						by ACM at UTSA. Whether you’re writing your first lines
						of code or bringing experience from past projects,
						you’ll meet students who share your curiosity and learn
						from each other as you turn a creative idea into a
						working project.
					</p>
					<div className="space-y-2">
						{chapters.map(({ title, body }, index) => (
							<details
								key={title}
								open={index === 0}
								className="group rounded-sm border-4 border-double border-cq-rope bg-cq-path"
							>
								<summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-xl font-semibold text-cq-title hover:bg-cq-sand/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cq-plum motion-safe:transition-colors [&::-webkit-details-marker]:hidden">
									{title}
									<span
										aria-hidden="true"
										className="relative h-4 w-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:bg-current after:absolute after:inset-x-0 after:top-1/2 after:h-0.5 after:rotate-90 after:bg-current group-open:after:rotate-0 motion-safe:after:transition-transform"
									/>
								</summary>
								<p className="px-4 pb-4 pt-1 text-lg leading-snug">
									{body}
								</p>
							</details>
						))}
					</div>
				</div>
				<div
					aria-hidden="true"
					className="relative mx-auto w-full max-w-sm self-center"
				>
					<div className="relative aspect-[4/3] overflow-hidden rounded-t-[50%] border-[6px] border-double border-cq-plum bg-cq-sand md:aspect-[4/5]">
						<Image
							src={HERO_ART.castle}
							alt=""
							fill
							sizes="(min-width: 768px) 384px, 90vw"
							className="object-cover object-[56%_center]"
						/>
						<div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cq-ink/20 to-transparent" />
					</div>
					<div className="absolute right-[7%] top-[21%] aspect-[330/197] w-[52%]">
						<Image
							src={DRAGONS.plum}
							alt=""
							fill
							sizes="200px"
							className="object-contain"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
