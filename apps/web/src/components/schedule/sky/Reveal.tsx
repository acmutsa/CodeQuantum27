"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils/client/cn";

type RevealProps = {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	delayMs?: number;
};

// Tri Nguyen: Fades its children up the first time they scroll into view. Users who prefer reduced motion see the content right away.
export default function Reveal({
	children,
	className,
	style,
	delayMs = 0,
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Tri Nguyen: Watch once, then stop observing so the animation never replays.
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={cn(
				className,
				isVisible
					? "motion-safe:animate-cq-rise"
					: "motion-safe:opacity-0",
			)}
			style={{ ...style, animationDelay: `${delayMs}ms` }}
		>
			{children}
		</div>
	);
}
