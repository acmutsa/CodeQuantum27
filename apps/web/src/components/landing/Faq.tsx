import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { grenze, grenzeGotisch } from "@/components/schedule/sky/fonts";
import { faqItems } from "./faq-data";

export default function Faq() {
	return (
		<section
			id="faq"
			aria-labelledby="faq-heading"
			className={`${grenze.variable} ${grenzeGotisch.variable} relative isolate overflow-hidden bg-cq-parchment px-5 py-16 font-grenze text-cq-ink sm:px-8 lg:py-24`}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-[url('/img/schedule/deco-cloud-01.png')] bg-[length:14rem_auto] bg-left-top bg-no-repeat opacity-35"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-[url('/img/schedule/peaks-b.png')] bg-[length:auto_100%] bg-right-bottom bg-no-repeat opacity-30"
			/>
			<div className="mx-auto max-w-5xl">
				<h2
					id="faq-heading"
					className="mx-auto mb-9 max-w-3xl text-center font-gotisch text-5xl font-bold leading-none text-cq-title sm:mb-12 sm:text-7xl"
				>
					Frequently Asked Questions
				</h2>
				<Accordion
					type="single"
					collapsible
					className="grid items-start gap-3 md:grid-cols-2 md:gap-4"
				>
					{faqItems.map((item) => (
						<AccordionItem
							key={item.id}
							value={item.id}
							className="rounded-lg border border-cq-rope bg-cq-path shadow-sm data-[state=open]:border-cq-plum motion-reduce:[&_[data-radix-collection-item]]:transition-none motion-reduce:[&_[role=region]]:animate-none"
						>
							<AccordionTrigger className="min-h-16 rounded-lg px-5 text-left text-xl font-semibold leading-tight text-cq-ink hover:bg-cq-sand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cq-plum active:bg-cq-sand [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:justify-between [&>div]:gap-4 [&[data-state=open]_svg]:rotate-180 [&_svg]:text-cq-plum motion-reduce:[&_svg]:transition-none">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="px-5 pb-5 text-lg leading-snug text-cq-muted">
								<p>{item.answer}</p>
								{"link" in item && (
									<a
										href={item.link.href}
										className="mt-2 inline-block rounded-sm font-semibold text-cq-plum underline underline-offset-4 focus-visible:outline-cq-plum"
									>
										{item.link.label}
									</a>
								)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
