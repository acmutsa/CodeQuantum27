"use client";

import { useEffect, useRef, useState } from "react";
import {
	CURSOR_WEAPONS,
	type CursorWeapon,
	cursorTransform,
} from "./cursor-weapons";

type ThemedCursorProps = {
	weapon?: CursorWeapon;
};

type CursorEffect = { id: number; x: number; y: number };

const MAX_EFFECTS = 6;

// Tri Nguyen: Swaps the mouse cursor for a sword or staff. The weapon follows the pointer without React renders, and clicks give it a quick press and spawn a short effect. Touch devices and coarse pointers keep the normal cursor and render nothing.
export default function ThemedCursor({ weapon = "sword" }: ThemedCursorProps) {
	const config = CURSOR_WEAPONS[weapon];
	const layerRef = useRef<HTMLDivElement>(null);
	const weaponRef = useRef<HTMLImageElement>(null);
	const nextId = useRef(0);
	const [enabled, setEnabled] = useState(false);
	const [effects, setEffects] = useState<CursorEffect[]>([]);

	useEffect(() => {
		const canUse = window.matchMedia(
			"(hover: hover) and (pointer: fine)",
		).matches;
		if (!canUse) return;
		setEnabled(true);
		document.documentElement.classList.add("cq-themed-cursor");
		return () => {
			document.documentElement.classList.remove("cq-themed-cursor");
			setEnabled(false);
		};
	}, []);

	useEffect(() => {
		if (!enabled) return;
		const layer = layerRef.current;
		const image = weaponRef.current;
		if (!layer || !image) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let frame = 0;
		let x = 0;
		let y = 0;

		const paint = () => {
			frame = 0;
			layer.style.transform = cursorTransform(x, y, weapon);
		};

		const onMove = (event: PointerEvent) => {
			if (event.pointerType === "touch") return;
			x = event.clientX;
			y = event.clientY;
			// Tri Nguyen: Stay hidden until the first move, and show again after the pointer comes back into the window.
			layer.style.opacity = "1";
			if (!frame) frame = requestAnimationFrame(paint);
		};

		const onLeave = (event: MouseEvent) => {
			if (!event.relatedTarget) layer.style.opacity = "0";
		};

		const onDown = (event: PointerEvent) => {
			if (event.pointerType === "touch") return;
			if (event.button !== 0 || reducedMotion.matches) return;
			// Tri Nguyen: Remove the class and force a reflow so the swing restarts even on rapid clicks.
			const classes = config.clickAnimation.split(" ");
			image.classList.remove(...classes);
			void image.offsetWidth;
			image.classList.add(...classes);
			const id = nextId.current++;
			setEffects((current) =>
				[...current, { id, x: event.clientX, y: event.clientY }].slice(
					-MAX_EFFECTS,
				),
			);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerdown", onDown);
		document.addEventListener("mouseout", onLeave);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerdown", onDown);
			document.removeEventListener("mouseout", onLeave);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [enabled, weapon, config.clickAnimation]);

	if (!enabled) return null;

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed left-0 top-0 z-[9999]"
		>
			{/* Tri Nguyen: Effects sit at the click point, centered on it, and remove themselves when their animation ends. */}
			{effects.map((effect) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					key={effect.id}
					src={config.effectSrc}
					alt=""
					draggable={false}
					width={config.effectSize}
					height={config.effectSize}
					className={`pointer-events-none fixed max-w-none ${config.effectAnimation}`}
					style={{
						left: effect.x - config.effectSize / 2,
						top: effect.y - config.effectSize / 2,
					}}
					onAnimationEnd={() =>
						setEffects((current) =>
							current.filter((item) => item.id !== effect.id),
						)
					}
				/>
			))}
			<div
				ref={layerRef}
				className="absolute left-0 top-0 opacity-0 will-change-transform"
			>
				{/* Tri Nguyen: The click press pivots on the tip, so the point stays on the pointer like a real mouse. */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					ref={weaponRef}
					src={config.src}
					alt=""
					draggable={false}
					width={config.size}
					height={config.size}
					className="max-w-none origin-[8%_8%] select-none"
				/>
			</div>
		</div>
	);
}
