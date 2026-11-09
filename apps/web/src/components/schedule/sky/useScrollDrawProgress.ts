"use client";

import { type RefObject, useEffect, useState } from "react";
import { getDrawProgress } from "./sky-layout";

// Tri Nguyen: Returns how much of an element should be drawn (0 to 1) as the page scrolls. Updates at most once per frame.
export function useScrollDrawProgress(ref: RefObject<Element>): number {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Tri Nguyen: Reduced motion users get the full path immediately with no scroll effect.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setProgress(1);
			return;
		}

		let frame = 0;
		const update = () => {
			frame = 0;
			const rect = element.getBoundingClientRect();
			setProgress(
				getDrawProgress(rect.top, rect.height, window.innerHeight),
			);
		};
		const scheduleUpdate = () => {
			if (frame === 0) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		return () => {
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			cancelAnimationFrame(frame);
		};
	}, [ref]);

	return progress;
}
