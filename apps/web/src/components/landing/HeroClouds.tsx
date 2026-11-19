"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const ASSETS = {
	pair: { src: "/img/clouds/cloud-pair-dark.webp", w: 2400, h: 1061 },
	trio: { src: "/img/clouds/cloud-trio-light.webp", w: 2400, h: 1093 },
	bank: { src: "/img/clouds/cloud-bank.webp", w: 2400, h: 1383 },
} as const;

type ClumpCloud = {
	asset: keyof typeof ASSETS;
	left: number; // vw, left edge
	bottom: number; // vh, negative = spills below the hero
	width: number; // vw
	z: number;
	flip?: boolean;
	spread: number; // how far (vw) it drifts outward on scroll
};

// Back row (z 10) → front row (z 20). Buttons sit at z 30.
const CLUMP: ClumpCloud[] = [
	// back row: darker clouds give the clump depth
	{ asset: "pair", left: -10, bottom: 8, width: 38, z: 10, spread: 10 },
	{ asset: "pair", left: 17, bottom: 12, width: 30, z: 10, flip: true, spread: 4 },
	{ asset: "pair", left: 51, bottom: 11, width: 32, z: 10, spread: 4 },
	{ asset: "pair", left: 72, bottom: 7, width: 38, z: 10, flip: true, spread: 10 },
	// middle row
	{ asset: "trio", left: -14, bottom: -2, width: 40, z: 15, flip: true, spread: 8 },
	{ asset: "trio", left: 74, bottom: -1, width: 40, z: 15, spread: 8 },
	// front row: spills into the next section
	{ asset: "trio", left: 0, bottom: -12, width: 38, z: 20, spread: 5 },
	{ asset: "bank", left: 29, bottom: -14, width: 42, z: 20, spread: 0 },
	{ asset: "trio", left: 60, bottom: -12, width: 40, z: 20, flip: true, spread: 5 },
];

type HeroCloudsProps = {
	registerHref: string;
	mentorHref: string;
	judgeHref: string;
	volunteerHref: string;
};

/**
 * Cloud frame around the hero. Writes scroll progress (0 → 1 over one
 * viewport height) to the `--p` CSS variable; each layer reads it to drift
 * outward while the bottom bank rises, so the clouds carry the eye into the
 * next section.
 */
export default function HeroClouds({
	registerHref,
	mentorHref,
	judgeHref,
	volunteerHref,
}: HeroCloudsProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			return;

		let frame = 0;
		const update = () => {
			frame = 0;
			const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
			el.style.setProperty("--p", p.toFixed(4));
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div
			ref={ref}
			className="pointer-events-none absolute inset-0 [--p:0]"
		>
			{/* ── Back layer: darker clouds in the top corners ── */}
			<div
				aria-hidden
				className="absolute -left-[10%] -top-[4%] -z-10 w-[55vw] max-w-[800px] sm:w-[42vw]"
				style={{
					transform:
						"translate3d(calc(var(--p) * -25vw), calc(var(--p) * -10vh), 0)",
				}}
			>
				<Image
					src="/img/clouds/cloud-pair-dark.webp"
					alt=""
					width={2400}
					height={1061}
					priority
					className="cq-cloud-drift w-full opacity-90"
				/>
			</div>
			<div
				aria-hidden
				className="absolute -right-[10%] -top-[2%] -z-10 w-[55vw] max-w-[800px] sm:w-[42vw]"
				style={{
					transform:
						"translate3d(calc(var(--p) * 25vw), calc(var(--p) * -10vh), 0) scaleX(-1)",
				}}
			>
				<Image
					src="/img/clouds/cloud-pair-dark.webp"
					alt=""
					width={2400}
					height={1061}
					priority
					className="cq-cloud-drift w-full opacity-90 [animation-delay:-4s]"
				/>
			</div>

			{/* ── Bottom clump: reused cloud assets layered into a bank that
			     spills into the next section. Back row sits behind the buttons,
			     front row overlaps the section edge. ── */}
			{CLUMP.map((c, i) => {
				const a = ASSETS[c.asset];
				const dir = c.left + c.width / 2 < 50 ? -1 : 1;
				return (
					<div
						key={i}
						aria-hidden
						className="absolute"
						style={{
							left: `${c.left}vw`,
							bottom: `${c.bottom}vh`,
							width: `${c.width}vw`,
							zIndex: c.z,
							transform: `translate3d(calc(var(--p) * ${dir * c.spread}vw), calc(var(--p) * -10vh), 0)${c.flip ? " scaleX(-1)" : ""}`,
						}}
					>
						<Image
							src={a.src}
							alt=""
							width={a.w}
							height={a.h}
							priority={c.z > 10}
							className="cq-cloud-drift w-full"
							style={{ animationDelay: `${-i * 1.7}s` }}
						/>
					</div>
				);
			})}

			{/* ── Cloud buttons ── */}
			<nav
				aria-label="Get involved"
				className="pointer-events-auto absolute inset-x-0 bottom-[6vh] z-30 flex flex-wrap items-end justify-center gap-x-2 gap-y-1 px-4 sm:bottom-[10vh] sm:gap-x-6"
				style={{
					transform: "translate3d(0, calc(var(--p) * -6vh), 0)",
				}}
			>
				{/* Register sits on top; the three role forms line up beneath it. */}
				<div className="flex basis-full justify-center">
					<CloudButton
						href={registerHref}
						src="/img/clouds/btn-register.webp"
						label="Register for CodeQuantum"
						height={553}
						className="w-[72vw] max-w-[440px]"
						internal
					/>
				</div>
				<CloudButton
					href={mentorHref}
					src="/img/clouds/btn-mentor.webp"
					label="Become a mentor"
					height={483}
					className="w-[30vw] max-w-[280px] [animation-delay:-1.5s]"
				/>
				<CloudButton
					href={judgeHref}
					src="/img/clouds/btn-judge.webp"
					label="Become a judge"
					height={560}
					className="w-[30vw] max-w-[280px] [animation-delay:-2.2s]"
				/>
				<CloudButton
					href={volunteerHref}
					src="/img/clouds/btn-volunteer.webp"
					label="Volunteer"
					height={490}
					className="w-[30vw] max-w-[280px] [animation-delay:-3s]"
				/>
			</nav>
		</div>
	);
}

function CloudButton({
	href,
	src,
	label,
	height,
	className = "",
	internal = false,
}: {
	href: string;
	src: string;
	label: string;
	height: number;
	className?: string;
	internal?: boolean;
}) {
	const external = !internal && href.startsWith("http");
	return (
		<Link
			href={href}
			aria-label={label}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			className={`cq-cloud-bob group mx-auto block rounded-[40%] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d7a33d]/70 sm:mx-0 ${className}`}
		>
			<Image
				src={src}
				alt=""
				width={1000}
				height={height}
				className="w-full drop-shadow-[0_8px_16px_rgba(78,43,79,0.25)] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-active:scale-95"
			/>
		</Link>
	);
}
