"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Sprite faces left (head at -x), so 180° is its "forward" heading. */
const SPRITE_HEADING_DEG = 180;
/** How quickly the dragon catches up to its scroll target (0–1 per frame). */
const FOLLOW = 0.07;
/** How quickly it turns toward its direction of travel (0–1 per frame). */
const TURN = 0.12;

/**
 * Point on the flight path for scroll progress t (0 → 1 over the whole page),
 * as fractions of the viewport. Sweeps side to side while weaving up and down.
 */
function flightPath(t: number) {
	const x = 0.5 - 0.38 * Math.cos(Math.PI * 2 * 1.5 * t);
	const y = 0.4 + 0.22 * Math.sin(Math.PI * 2 * 2.5 * t);
	return { x, y };
}

/** Shortest signed difference between two angles in degrees. */
function angleDelta(from: number, to: number) {
	return ((((to - from) % 360) + 540) % 360) - 180;
}

/**
 * A dragon that flies around the whole page as you scroll. Mount once at the
 * page level; it is fixed to the viewport and ignores pointer events.
 */
export default function ScrollDragon() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const place = (x: number, y: number, rot: number) => {
			el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${
				y - el.offsetHeight / 2
			}px, 0) rotate(${rot}deg)`;
		};

		const target = () => {
			const max =
				document.documentElement.scrollHeight - window.innerHeight;
			const t = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
			const p = flightPath(t);
			return { x: p.x * window.innerWidth, y: p.y * window.innerHeight };
		};

		// Reduced motion: park the dragon on its path and don't animate.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			const p = target();
			place(p.x, p.y, 0);
			el.style.opacity = "1";
			return;
		}

		let { x, y } = target();
		let heading = SPRITE_HEADING_DEG;
		let frame = 0;

		const tick = () => {
			const goal = target();
			const dx = (goal.x - x) * FOLLOW;
			const dy = (goal.y - y) * FOLLOW;
			x += dx;
			y += dy;

			// Only turn when actually moving, so it doesn't spin while hovering.
			if (Math.hypot(dx, dy) > 0.4) {
				const want = (Math.atan2(dy, dx) * 180) / Math.PI;
				heading += angleDelta(heading, want) * TURN;
			}

			place(x, y, heading - SPRITE_HEADING_DEG);
			frame = requestAnimationFrame(tick);
		};

		el.style.opacity = "1";
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, []);

	return (
		<div
			ref={ref}
			aria-hidden
			className="pointer-events-none fixed left-0 top-0 z-40 w-[clamp(64px,9vw,130px)] opacity-0 transition-opacity duration-700 will-change-transform"
		>
			<Image
				src="/img/sprites/dragon.webp"
				alt=""
				width={600}
				height={629}
				priority
				className="w-full drop-shadow-[0_12px_10px_rgba(47,30,48,0.3)]"
			/>
		</div>
	);
}
