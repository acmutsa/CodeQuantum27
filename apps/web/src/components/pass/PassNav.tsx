import c from "config";
import Image from "next/image";
import Link from "next/link";
import { PASS_COPY } from "./content";

// Tri Nguyen: Desktop links from the Figma nav. The pass page is the active one.
const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Schedule", href: "/schedule" },
	{ label: PASS_COPY.pageTitle, href: "/pass", active: true },
	{ label: "Discord", href: c.links.discord },
] as const;

// Tri Nguyen: One bar for both sizes. Phones get the brand and "Hacker Pass" (Figma Top Bar), desktop gets links and a Dashboard button (Figma Nav).
export default function PassNav() {
	return (
		<header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#D9C49A] bg-cq-parchment/90 px-4 backdrop-blur-sm lg:h-16 lg:px-10">
			<Link href="/" className="flex items-center gap-2 lg:gap-2.5">
				<Image
					src={c.icon.sm}
					alt=""
					width={32}
					height={32}
					unoptimized
					className="size-7 rounded-md lg:size-8"
				/>
				<span className="font-gotisch text-lg font-bold text-[#A7866A]">
					{c.hackathonName}
				</span>
			</Link>

			<nav aria-label="Main" className="hidden gap-7 lg:flex">
				{NAV_LINKS.map((link) => (
					<Link
						key={link.label}
						href={link.href}
						aria-current={"active" in link ? "page" : undefined}
						className={
							"active" in link
								? "text-sm font-semibold text-cq-plum"
								: "text-sm font-medium text-cq-muted hover:text-cq-plum"
						}
					>
						{link.label}
					</Link>
				))}
			</nav>

			<Link
				href="/dash"
				className="hidden rounded-lg border border-[#CFCCCC] bg-[#EEEDED] px-4 py-2 text-sm font-medium text-cq-ink hover:bg-white lg:inline-flex"
			>
				Dashboard
			</Link>
			<p className="text-[15px] font-semibold text-cq-plum lg:hidden">
				{PASS_COPY.pageTitle}
			</p>
		</header>
	);
}
