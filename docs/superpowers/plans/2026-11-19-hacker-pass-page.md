# Hacker Pass Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a login-only `/pass` page that is a 1:1 code replica of the Figma "Cards" page (Simple crest variant), mobile and desktop, fluid for every screen width, with the desktop Quest Log driven by schedule events and the hacker's scans.

**Architecture:** A server component (`PassPage`) loads the hacker, events and scans, then renders a quest-scroll card (`QuestScroll`) and, on large screens, a class panel with the Quest Log (`ClassPanel`). Class theming (Knight/Wizard/Archer) is one data table in `classes.ts`; the Quest Log is one pure function in `quest-log.ts` that reuses `buildHackDay` from the schedule page. Only the QR dialog and the "save pass" button are client code.

**Tech Stack:** Next.js 14 App Router, React 18 server components, Tailwind 3.4 (container query units `cqw`), Clerk auth, Drizzle (libsql), `react-qr-code`, `date-fns-tz`, Vitest.

## Global Constraints

-   Branch: `tri-card`. Commit after every task. Commit subject style: short imperative lowercase, no prefix (e.g. `add hacker class themes`).
-   **Never** add `Co-Authored-By` lines, AI attribution, or "Generated with Claude Code" to any commit message or PR description.
-   Every important comment starts with `// Tri Nguyen:` (or `{/* Tri Nguyen: ... */}` in JSX) and says what the code connects to. Never use `--------` divider lines.
-   Source of truth is Figma file `9oqlic9CAVJ4uHbB8vb1C1`, page `Cards` (60:2): card component `Class=Knight, Crest=Simple` (69:185), mobile frame `Hacker Pass / Mobile — Knight` (64:3), desktop frame `Hacker Pass / Desktop — Knight` (65:109). Use the Simple crest only.
-   Palette (Tailwind `cq` tokens already exist): ink `#3D2340`, plum `#68396B`, muted `#6E5270`, gold `#D7A33D`, parchment `#F6ECD6`. Card-only extras: paper panel `#FBF5E6`, line `#D3BC8E`, nav border `#D9C49A`, brand text `#A7866A`, on-accent text `#FFFCF4`.
-   Fonts: Grenze (body) and Grenze Gotisch (display) from `apps/web/src/components/schedule/sky/fonts.ts`.
-   No fixed page widths. The card is `max-w-[366px]` and scales down with container query units; desktop layout starts at Tailwind `lg` (1024px).
-   Keep functions small and plain. No new npm dependencies.
-   Run commands from `apps/web` unless stated: tests `pnpm test`, types `pnpm exec tsc --noEmit`, lint `pnpm lint`.

---

## File Structure

| File                                                         | Responsibility                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `apps/web/public/img/pass/*.webp`                            | Card art: 3 crests, 3 wax seals, 3 scroll slices (top, middle, bottom) |
| `packages/config/hackkit.config.ts` (modify)                 | `groups` become Knights, Wizards, Archers (order = class index)        |
| `packages/db/functions/scans.ts` (new) + `index.ts` (modify) | `getScansForUser(userID)`                                              |
| `apps/web/src/components/schedule/sky/fonts.ts` (modify)     | add Grenze weight 700                                                  |
| `apps/web/src/components/pass/classes.ts` + test             | class theme table and `getHackerClass(group)`                          |
| `apps/web/src/components/pass/quest-log.ts` + test           | `buildQuestLog(events, scans, tz)` and placeholder rows                |
| `apps/web/src/components/pass/content.ts`                    | all static copy                                                        |
| `apps/web/src/components/pass/PassQr.tsx`                    | client: `PassQrCode`, `QrDialog`, `SavePassButton`                     |
| `apps/web/src/components/pass/QuestScroll.tsx`               | the scroll card                                                        |
| `apps/web/src/components/pass/ClassPanel.tsx`                | desktop panel: class title, lore, Quest Log, actions                   |
| `apps/web/src/components/pass/PassNav.tsx`                   | top bar (mobile) / nav (desktop)                                       |
| `apps/web/src/components/pass/PassBackdrop.tsx`              | peaks, cloud bank, dragon                                              |
| `apps/web/src/components/pass/PassPage.tsx`                  | server entry: auth, data, layout                                       |
| `apps/web/src/app/pass/page.tsx`                             | route                                                                  |
| `apps/web/src/components/pass/README.md`                     | docs                                                                   |

The route is `/pass` (not inside `/dash`) because the dash layout draws its own header, and Figma has its own nav. `/pass` is not in `publicRoutes`, so `apps/web/src/middleware.ts` already forces sign-in. The old `/dash/pass` page is left untouched.

---

### Task 1: Card art assets

**Files:**

-   Create: `apps/web/public/img/pass/crest-knight.webp`, `crest-wizard.webp`, `crest-archer.webp`, `seal-knight.webp`, `seal-wizard.webp`, `seal-archer.webp`, `scroll-top.webp`, `scroll-middle.webp`, `scroll-bottom.webp`

**Interfaces:**

-   Produces: the nine files above, used by Task 4 (`classes.ts`) and Task 6 (`QuestScroll.tsx`).

Sources (already cut out, transparent PNGs, same images as in Figma):
`SCRATCH=/private/tmp/claude-501/-Users-tringuyen2007-Documents-Projects-CQ27-CodeQuantum27/372c69bb-6387-4ec7-a940-5ea8ff3cf220/scratchpad`

-   crests: `$SCRATCH/crests/{knight,wizard,archer}-simple.png`
-   seals (storybook style): `$SCRATCH/seals2/{knight,wizard,archer}.png`
-   scroll: `$SCRATCH/scroll/scroll-{top,mid,bot}.png` (732 px wide = 2x the 366 px card)

-   [ ] **Step 1: Convert to 2x-size WebP**

Run from repo root:

```bash
SCRATCH=/private/tmp/claude-501/-Users-tringuyen2007-Documents-Projects-CQ27-CodeQuantum27/372c69bb-6387-4ec7-a940-5ea8ff3cf220/scratchpad
mkdir -p apps/web/public/img/pass
python3 -I - "$SCRATCH" apps/web/public/img/pass <<'EOF'
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
def save(path, name, width):
    im = Image.open(path).convert("RGBA")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(f"{out}/{name}.webp", "WEBP", quality=86, method=6)
    print(name, im.size)
for c in ["knight", "wizard", "archer"]:
    save(f"{src}/crests/{c}-simple.png", f"crest-{c}", 316)
    save(f"{src}/seals2/{c}.png", f"seal-{c}", 148)
for a, b in [("top", "top"), ("mid", "middle"), ("bot", "bottom")]:
    save(f"{src}/scroll/scroll-{a}.png", f"scroll-{b}", 732)
EOF
ls -la apps/web/public/img/pass
```

Expected: 9 files; crests 316 wide, seals 148 wide, scroll slices 732 wide (top/bottom 732×177, middle 732×689). Each under ~120 KB.

-   [ ] **Step 2: Commit**

```bash
git add apps/web/public/img/pass
git commit -m "add hacker pass card art"
```

---

### Task 2: Classes in config, scans query, bold Grenze

**Files:**

-   Modify: `packages/config/hackkit.config.ts` (the `groups` object, lines ~66-91)
-   Create: `packages/db/functions/scans.ts`
-   Modify: `packages/db/functions/index.ts`
-   Modify: `apps/web/src/components/schedule/sky/fonts.ts`

**Interfaces:**

-   Produces: `getScansForUser(userID: string): Promise<{ eventID: number; updatedAt: Date }[]>` exported from `db/functions`.
-   Produces: `c.groups` keys in order `"Knights"`, `"Wizards"`, `"Archers"` (registration assigns `count % 3`, so `hackerData.group` is 0, 1 or 2).
-   Produces: `grenze` font now includes weight 700 (`font-bold`).

-   [ ] **Step 1: Replace `groups` in `packages/config/hackkit.config.ts`**

Replace the whole `groups: { ... },` block with:

```ts
	// Tri Nguyen: Hacker classes. Registration puts each new hacker in the next one (count % 3), and the hacker pass (apps/web/src/components/pass/classes.ts) reads them in this exact order.
	groups: {
		Knights: {
			discordRole: "Knights",
		},
		Wizards: {
			discordRole: "Wizards",
		},
		Archers: {
			discordRole: "Archers",
		},
	},
```

-   [ ] **Step 2: Create `packages/db/functions/scans.ts`**

```ts
import { db, eq } from "..";
import { scans } from "../schema";

// Tri Nguyen: Every event check-in for one hacker. The hacker pass Quest Log uses it to mark events as scanned and show the scan time.
export function getScansForUser(userID: string) {
	return db.query.scans.findMany({
		where: eq(scans.userID, userID),
		columns: { eventID: true, updatedAt: true },
	});
}
```

-   [ ] **Step 3: Export it from `packages/db/functions/index.ts`**

Add the line `export * from "./scans";` after `export * from "./events";`.

-   [ ] **Step 4: Add weight 700 in `apps/web/src/components/schedule/sky/fonts.ts`**

Change `weight: ["400", "500", "600"],` to `weight: ["400", "500", "600", "700"],` and update the comment above it to:

```ts
// Tri Nguyen: Body font for the schedule and hacker pass pages. Weights match the Figma text styles (Regular, Medium, SemiBold, Bold, Italic).
```

-   [ ] **Step 5: Type check**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no new errors (note any pre-existing ones before this task and compare).

-   [ ] **Step 6: Commit**

```bash
git add packages/config/hackkit.config.ts packages/db/functions/scans.ts packages/db/functions/index.ts apps/web/src/components/schedule/sky/fonts.ts
git commit -m "set hacker classes and add scans query"
```

---

### Task 3: Class themes (`classes.ts`)

**Files:**

-   Create: `apps/web/src/components/pass/classes.ts`
-   Test: `apps/web/src/components/pass/classes.test.ts`

**Interfaces:**

-   Consumes: `DRAGONS` from `@/components/schedule/sky/assets`.
-   Produces:

```ts
export type HackerClass = {
	id: "knight" | "wizard" | "archer";
	title: string;
	motto: string;
	order: string;
	lore: string;
	accent: string;
	tint: string;
	avatarFrom: string;
	crest: string;
	seal: string;
	dragon: { src: string; width: number; height: number };
};
export const HACKER_CLASSES: readonly HackerClass[];
export function getHackerClass(group: number): HackerClass;
```

-   [ ] **Step 1: Write the failing test** `apps/web/src/components/pass/classes.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { HACKER_CLASSES, getHackerClass } from "./classes";

describe("getHackerClass", () => {
	it("maps groups 0, 1, 2 to Knight, Wizard, Archer like the config order", () => {
		expect(getHackerClass(0).id).toBe("knight");
		expect(getHackerClass(1).id).toBe("wizard");
		expect(getHackerClass(2).id).toBe("archer");
	});

	it("wraps old group numbers from before there were 3 classes", () => {
		expect(getHackerClass(4).id).toBe("wizard");
	});

	it("falls back to Knight for bad values", () => {
		expect(getHackerClass(-1).id).toBe("knight");
		expect(getHackerClass(Number.NaN).id).toBe("knight");
	});

	it("gives every class its own art", () => {
		const crests = new Set(HACKER_CLASSES.map((c) => c.crest));
		expect(crests.size).toBe(3);
	});
});
```

-   [ ] **Step 2: Run it to see it fail**

Run: `cd apps/web && pnpm test src/components/pass/classes.test.ts`
Expected: FAIL, cannot find module `./classes`.

-   [ ] **Step 3: Implement** `apps/web/src/components/pass/classes.ts`

```ts
import { DRAGONS } from "@/components/schedule/sky/assets";

// Tri Nguyen: Card art for the hacker pass lives in /public/img/pass. Dragons are shared with the schedule page.
const PASS_ART = "/img/pass";

// Tri Nguyen: Everything that changes between Knight, Wizard and Archer. Copy and colors come from the Figma "Cards" page.
export type HackerClass = {
	id: "knight" | "wizard" | "archer";
	title: string;
	motto: string;
	order: string;
	lore: string;
	accent: string;
	tint: string;
	avatarFrom: string;
	crest: string;
	seal: string;
	dragon: { src: string; width: number; height: number };
};

// Tri Nguyen: Same order as `groups` in packages/config/hackkit.config.ts, so hackerData.group is the index here.
export const HACKER_CLASSES: readonly HackerClass[] = [
	{
		id: "knight",
		title: "Knight of the Realm",
		motto: "“Hold the line.”",
		order: "Order of the Knights",
		lore: "The Knights hold the line. Steady, loyal, and first into the fray, your order keeps the realm standing until the very last commit.",
		accent: "#8C2F2F",
		tint: "#E9C9BC",
		avatarFrom: "#F1DDD3",
		crest: `${PASS_ART}/crest-knight.webp`,
		seal: `${PASS_ART}/seal-knight.webp`,
		dragon: { src: DRAGONS.chestnut, width: 220, height: 159 },
	},
	{
		id: "wizard",
		title: "Wizard of the Arcane",
		motto: "“Bend the code.”",
		order: "Order of the Wizards",
		lore: "The Wizards bend the code. Curious and clever, your order turns wild ideas into working spells before the final bell rings.",
		accent: "#4E3A86",
		tint: "#D9CDEE",
		avatarFrom: "#E5DEF2",
		crest: `${PASS_ART}/crest-wizard.webp`,
		seal: `${PASS_ART}/seal-wizard.webp`,
		dragon: { src: DRAGONS.plum, width: 220, height: 131 },
	},
	{
		id: "archer",
		title: "Archer of the Wilds",
		motto: "“Never miss.”",
		order: "Order of the Archers",
		lore: "The Archers never miss. Sharp-eyed and swift, your order picks its target early and lands every shot by demo time.",
		accent: "#2F5B3B",
		tint: "#CBDDBF",
		avatarFrom: "#DCE7D2",
		crest: `${PASS_ART}/crest-archer.webp`,
		seal: `${PASS_ART}/seal-archer.webp`,
		dragon: { src: DRAGONS.gold, width: 220, height: 119 },
	},
];

// Tri Nguyen: Picks the class from the hacker's group number. Wraps old numbers and falls back to Knight so a bad value never breaks the page.
export function getHackerClass(group: number): HackerClass {
	const index =
		Number.isInteger(group) && group >= 0
			? group % HACKER_CLASSES.length
			: 0;
	return HACKER_CLASSES[index];
}
```

-   [ ] **Step 4: Run the test**

Run: `cd apps/web && pnpm test src/components/pass/classes.test.ts`
Expected: 4 passed.

-   [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/pass/classes.ts apps/web/src/components/pass/classes.test.ts
git commit -m "add hacker class themes"
```

---

### Task 4: Quest Log data (`quest-log.ts`) and page copy (`content.ts`)

**Files:**

-   Create: `apps/web/src/components/pass/quest-log.ts`
-   Create: `apps/web/src/components/pass/content.ts`
-   Test: `apps/web/src/components/pass/quest-log.test.ts`

**Interfaces:**

-   Consumes: `EventType` from `@/lib/types/events`; scan rows shaped like `getScansForUser` output.
-   Produces:

```ts
export type ScanRecord = { eventID: number; updatedAt: Date };
export type QuestRow = { id: number; title: string; scanned: boolean; note: string };
export type QuestLogData = { rows: QuestRow[]; scannedCount: number };
export function buildQuestLog(events: EventType[], scans: ScanRecord[], timezone: string): QuestLogData;
export const PLACEHOLDER_QUEST_LOG: QuestLogData;
export const PASS_COPY: { ...string constants };
```

-   [ ] **Step 1: Write the failing test** `apps/web/src/components/pass/quest-log.test.ts`

```ts
import { describe, expect, it } from "vitest";
import type { EventType } from "@/lib/types/events";
import { PLACEHOLDER_QUEST_LOG, buildQuestLog } from "./quest-log";

const TIMEZONE = "America/Chicago";

// Tri Nguyen: Builds a fake event so each test only spells out the fields it cares about.
function makeEvent(overrides: Partial<EventType>): EventType {
	return {
		id: 1,
		title: "Check-in & Breakfast",
		startTime: new Date("2027-02-20T14:00:00Z"),
		endTime: new Date("2027-02-20T15:00:00Z"),
		location: "Student Union Lobby",
		description: "",
		type: "Meal",
		host: null,
		hidden: false,
		...overrides,
	};
}

describe("buildQuestLog", () => {
	it("marks scanned events with the scan time", () => {
		const log = buildQuestLog(
			[makeEvent({ id: 7 })],
			[{ eventID: 7, updatedAt: new Date("2027-02-20T14:12:00Z") }],
			TIMEZONE,
		);
		expect(log.rows).toEqual([
			{
				id: 7,
				title: "Check-in & Breakfast",
				scanned: true,
				note: "Scanned · 8:12 AM",
			},
		]);
		expect(log.scannedCount).toBe(1);
	});

	it("shows the start time for events not scanned yet", () => {
		const log = buildQuestLog(
			[
				makeEvent({
					id: 2,
					title: "Dinner",
					startTime: new Date("2027-02-21T00:00:00Z"),
				}),
			],
			[],
			TIMEZONE,
		);
		expect(log.rows[0]).toEqual({
			id: 2,
			title: "Dinner",
			scanned: false,
			note: "Opens 6:00 PM",
		});
		expect(log.scannedCount).toBe(0);
	});

	it("keeps the event order and ignores scans for other events", () => {
		const log = buildQuestLog(
			[
				makeEvent({ id: 1, title: "A" }),
				makeEvent({ id: 2, title: "B" }),
			],
			[{ eventID: 99, updatedAt: new Date() }],
			TIMEZONE,
		);
		expect(log.rows.map((row) => row.title)).toEqual(["A", "B"]);
		expect(log.scannedCount).toBe(0);
	});
});

describe("PLACEHOLDER_QUEST_LOG", () => {
	it("matches the Figma mock: 3 of 4 scanned", () => {
		expect(PLACEHOLDER_QUEST_LOG.rows).toHaveLength(4);
		expect(PLACEHOLDER_QUEST_LOG.scannedCount).toBe(3);
	});
});
```

-   [ ] **Step 2: Run it to see it fail**

Run: `cd apps/web && pnpm test src/components/pass/quest-log.test.ts`
Expected: FAIL, cannot find module `./quest-log`.

-   [ ] **Step 3: Implement** `apps/web/src/components/pass/quest-log.ts`

```ts
import { formatInTimeZone } from "date-fns-tz";
import type { EventType } from "@/lib/types/events";

// Tri Nguyen: One check-in from the scans table (packages/db/functions/scans.ts).
export type ScanRecord = { eventID: number; updatedAt: Date };

// Tri Nguyen: One row in the desktop Quest Log. note is the right-hand text, e.g. "Scanned · 8:12 AM" or "Opens 6:00 PM".
export type QuestRow = {
	id: number;
	title: string;
	scanned: boolean;
	note: string;
};

export type QuestLogData = { rows: QuestRow[]; scannedCount: number };

// Tri Nguyen: Joins the schedule events (already filtered and sorted by buildHackDay) with this hacker's scans.
export function buildQuestLog(
	events: EventType[],
	scans: ScanRecord[],
	timezone: string,
): QuestLogData {
	const scannedAt = new Map(
		scans.map((scan) => [scan.eventID, scan.updatedAt]),
	);
	const rows = events.map((event) => {
		const scanTime = scannedAt.get(event.id);
		return {
			id: event.id,
			title: event.title,
			scanned: scanTime !== undefined,
			note: scanTime
				? `Scanned · ${formatInTimeZone(scanTime, timezone, "h:mm a")}`
				: `Opens ${formatInTimeZone(event.startTime, timezone, "h:mm a")}`,
		};
	});
	return { rows, scannedCount: rows.filter((row) => row.scanned).length };
}

// Tri Nguyen: Shown until the real schedule is added in /admin/events. Same rows as the Figma mock.
export const PLACEHOLDER_QUEST_LOG: QuestLogData = {
	rows: [
		{
			id: -1,
			title: "Check-in & Breakfast",
			scanned: true,
			note: "Scanned · 8:12 AM",
		},
		{
			id: -2,
			title: "Opening Ceremony",
			scanned: true,
			note: "Scanned · 9:04 AM",
		},
		{ id: -3, title: "Lunch", scanned: true, note: "Scanned · 12:41 PM" },
		{ id: -4, title: "Dinner", scanned: false, note: "Opens 6:00 PM" },
	],
	scannedCount: 3,
};
```

-   [ ] **Step 4: Create** `apps/web/src/components/pass/content.ts`

```ts
// Tri Nguyen: Every piece of static text on the hacker pass page. Edit wording here instead of inside components.
export const PASS_COPY = {
	pageTitle: "Hacker Pass",
	ribbonStart: "✦  CodeQuantum 27",
	ribbonEnd: "Quest Pass  ✦",
	qrCaption: "Show at food & event check-ins",
	qrHint: "Tap the code to enlarge · turn brightness up",
	eventDate: "Sat · Feb 20, 2027",
	location: "UTSA Main Campus",
	yourClass: "Your Class",
	questLog: "Quest Log",
	showQr: "Show QR full screen",
	savePass: "Save pass to phone",
	qrDialogTitle: "Your check-in code",
	qrFileName: "codequantum-pass.png",
} as const;
```

-   [ ] **Step 5: Run the tests**

Run: `cd apps/web && pnpm test src/components/pass`
Expected: all pass (classes + quest-log).

-   [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/pass/quest-log.ts apps/web/src/components/pass/quest-log.test.ts apps/web/src/components/pass/content.ts
git commit -m "add quest log data and pass copy"
```

---

### Task 5: QR code, full-screen dialog, save button (client)

**Files:**

-   Create: `apps/web/src/components/pass/PassQr.tsx`

**Interfaces:**

-   Consumes: `Dialog, DialogContent, DialogTitle, DialogTrigger` from `@/components/shadcn/ui/dialog`; `QRCode` from `react-qr-code`; `PASS_COPY`.
-   Produces:

```ts
export function PassQrCode(props: { payload: string }): JSX.Element; // square SVG, fills its parent width
export function QrDialog(props: {
	payload: string;
	children: React.ReactNode;
}): JSX.Element; // children = trigger button
export function SavePassButton(props: { className?: string }): JSX.Element; // downloads #pass-qr svg as PNG
export const PASS_QR_ID = "pass-qr";
```

-   [ ] **Step 1: Implement** `apps/web/src/components/pass/PassQr.tsx`

```tsx
"use client";

import QRCode from "react-qr-code";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { PASS_COPY } from "./content";

// Tri Nguyen: The card's QR wrapper has this id so SavePassButton can find the code on the page.
export const PASS_QR_ID = "pass-qr";

// Tri Nguyen: The check-in QR. Volunteers scan it with the admin scanner (components/admin/scanner/PassScanner.tsx). Dark plum on white for contrast.
export function PassQrCode({ payload }: { payload: string }) {
	return (
		<QRCode
			value={payload}
			fgColor="#3D2340"
			bgColor="#FFFFFF"
			level="M"
			viewBox="0 0 256 256"
			style={{ width: "100%", height: "auto" }}
		/>
	);
}

// Tri Nguyen: Opens a big QR so it scans easily. Used by tapping the card's QR and by the "Show QR full screen" button.
export function QrDialog({
	payload,
	children,
}: {
	payload: string;
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-[min(92vw,460px)] max-w-none rounded-2xl border-cq-gold bg-white p-6">
				<DialogTitle className="text-center font-grenze text-xl font-semibold text-cq-ink">
					{PASS_COPY.qrDialogTitle}
				</DialogTitle>
				<PassQrCode payload={payload} />
			</DialogContent>
		</Dialog>
	);
}

// Tri Nguyen: Saves the card's QR as a PNG (white border included) so hackers can check in without signing in again.
export function SavePassButton({ className }: { className?: string }) {
	function savePass() {
		const svg = document.querySelector(`#${PASS_QR_ID} svg`);
		if (!svg) return;
		const svgUrl = URL.createObjectURL(
			new Blob([new XMLSerializer().serializeToString(svg)], {
				type: "image/svg+xml",
			}),
		);
		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = canvas.height = 1024;
			const context = canvas.getContext("2d");
			if (!context) return;
			context.fillStyle = "#FFFFFF";
			context.fillRect(0, 0, 1024, 1024);
			context.drawImage(image, 64, 64, 896, 896);
			URL.revokeObjectURL(svgUrl);
			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = PASS_COPY.qrFileName;
			link.click();
		};
		image.src = svgUrl;
	}

	return (
		<button type="button" onClick={savePass} className={className}>
			{PASS_COPY.savePass}
		</button>
	);
}
```

-   [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no new errors. (If `DialogContent` has no `className` merge for `max-w-none`, it uses `cn`, so the override works.)

-   [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/pass/PassQr.tsx
git commit -m "add pass qr dialog and save button"
```

---

### Task 6: The quest scroll card (`QuestScroll.tsx`)

**Files:**

-   Create: `apps/web/src/components/pass/QuestScroll.tsx`

**Interfaces:**

-   Consumes: `HackerClass` (Task 3), `PASS_COPY` (Task 4), `PassQrCode`, `QrDialog`, `PASS_QR_ID` (Task 5).
-   Produces:

```ts
export type PassHacker = {
	firstName: string;
	lastName: string;
	hackerTag: string;
	profilePhoto: string | null;
};
export default function QuestScroll(props: {
	hacker: PassHacker;
	hackerClass: HackerClass;
	qrPayload: string;
}): JSX.Element;
```

Layout notes (from Figma 69:185, card 366 × 864): all spacing that sits on the scroll art is written in `cqw` (1cqw = 1% of the card width), so at 366 px it equals the Figma pixels and on narrow phones it shrinks with the art. Text stays in px. Conversions: top roll 88 px = 24.2cqw, paddings top 76 = 20.77cqw, bottom 82 = 22.4cqw, left 54 = 14.75cqw, right 50 = 13.66cqw, seal 74 px = 20.2cqw at 54 px (14.75cqw) from the right and bottom.

-   [ ] **Step 1: Implement** `apps/web/src/components/pass/QuestScroll.tsx`

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import type { HackerClass } from "./classes";
import { PASS_COPY } from "./content";
import { PASS_QR_ID, PassQrCode, QrDialog } from "./PassQr";

// Tri Nguyen: The fields of the signed-in hacker the card shows. Comes from getHacker in PassPage.tsx.
export type PassHacker = {
	firstName: string;
	lastName: string;
	hackerTag: string;
	profilePhoto: string | null;
};

type QuestScrollProps = {
	hacker: PassHacker;
	hackerClass: HackerClass;
	qrPayload: string;
};

// Tri Nguyen: The hacker pass card, a quest scroll from Figma (Cards page, "Hacker Card" Class=*, Crest=Simple).
// Tri Nguyen: The scroll is 3 images: top and bottom rolls keep their shape, the middle stretches to fit the content.
export default function QuestScroll({
	hacker,
	hackerClass,
	qrPayload,
}: QuestScrollProps) {
	const { accent, tint } = hackerClass;
	const fullName = `${hacker.firstName} ${hacker.lastName}`;

	return (
		<article
			aria-label={`${fullName}'s hacker pass`}
			className="relative mx-auto w-full max-w-[366px] [container-type:inline-size]"
			style={{ "--accent": accent } as CSSProperties}
		>
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-[23.8cqw] top-[23.8cqw] bg-[url('/img/pass/scroll-middle.webp')] bg-[length:100%_100%]"
			/>
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-[24.2cqw] bg-[url('/img/pass/scroll-top.webp')] bg-[length:100%_100%]"
			/>
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-[24.2cqw] bg-[url('/img/pass/scroll-bottom.webp')] bg-[length:100%_100%]"
			/>

			<div className="relative flex flex-col items-center pb-[22.4cqw] pl-[14.75cqw] pr-[13.66cqw] pt-[20.77cqw]">
				{/* Tri Nguyen: Header lettering in the class color. */}
				<p className="flex items-center gap-1.5 whitespace-pre pb-0.5 pt-1.5 text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">
					<span>{PASS_COPY.ribbonStart}</span>
					<span aria-hidden>·</span>
					<span>{PASS_COPY.ribbonEnd}</span>
				</p>

				{/* Tri Nguyen: Crest with a soft class-colored glow, and the profile photo (or first initial) in a gold ring. */}
				<div className="relative h-[166px] w-full">
					<div
						aria-hidden
						className="absolute inset-0"
						style={{
							background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${tint}CC 0%, ${tint}73 55%, ${tint}00 100%)`,
						}}
					/>
					<Image
						src={hackerClass.crest}
						alt=""
						width={158}
						height={158}
						unoptimized
						priority
						className="absolute left-1/2 top-1 -translate-x-1/2"
					/>
					<div className="absolute left-[calc(50%+33px)] top-[92px] size-[70px] rounded-full bg-cq-gold p-1">
						<div
							className="relative grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-[#FFFCF4] font-gotisch text-[32px] font-bold text-[#FFFCF4]"
							style={{
								background: `linear-gradient(90deg, ${hackerClass.avatarFrom}, ${accent}8C)`,
							}}
						>
							{hacker.firstName.charAt(0)}
							{hacker.profilePhoto ? (
								// eslint-disable-next-line @next/next/no-img-element -- Tri Nguyen: profile photos can come from any host, so next/image remotePatterns would block some.
								<img
									src={hacker.profilePhoto}
									alt=""
									className="absolute inset-0 size-full object-cover"
								/>
							) : null}
						</div>
					</div>
				</div>

				{/* Tri Nguyen: Name, @tag, class title and motto. */}
				<div className="flex flex-col items-center gap-0.5 px-6 pb-1.5 text-center">
					<h2 className="font-gotisch text-[40px] font-bold leading-[1.05] text-cq-ink">
						{fullName}
					</h2>
					<p className="text-[15px] font-medium text-cq-muted">
						@{hacker.hackerTag}
					</p>
					<p className="py-0.5 text-[15px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
						{hackerClass.title}
					</p>
					<p className="pt-1.5 text-[17px] italic text-cq-plum">
						{hackerClass.motto}
					</p>
				</div>

				{/* Tri Nguyen: Gold flourish divider, exported from Figma. */}
				<div
					aria-hidden
					className="flex h-[30px] w-full items-center px-[5px]"
				>
					<svg
						viewBox="0 0 252 17"
						fill="none"
						className="h-auto w-full"
					>
						<path
							d="M3.73 8.4h100.8M147.47 8.4h100.8"
							stroke="#C9A35A"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M104.53 8.4c5.6-6.53 11.2-6.53 13.07 0-1.87 6.53-7.47 6.53-13.07 0ZM147.47 8.4c-5.6-6.53-11.2-6.53-13.07 0 1.87 6.53 7.47 6.53 13.07 0Z"
							fill="#D7A33D"
						/>
						<path
							d="m126 1.87 6.53 6.53L126 14.93l-6.53-6.53L126 1.87Z"
							fill="#D7A33D"
							stroke="#9C7A3A"
						/>
						<circle cx="3.73" cy="8.4" r="1.87" fill="#D7A33D" />
						<circle cx="248.27" cy="8.4" r="1.87" fill="#D7A33D" />
					</svg>
				</div>

				{/* Tri Nguyen: QR stub. Tapping the code opens it full screen (PassQr.tsx). */}
				<div className="flex w-full flex-col items-center gap-2.5 pb-[18px] pt-1 text-center">
					<QrDialog payload={qrPayload}>
						<button
							type="button"
							id={PASS_QR_ID}
							aria-label={PASS_COPY.showQr}
							className="aspect-square w-full max-w-[216px] rounded-[14px] border-2 border-[var(--accent)] bg-white p-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
						>
							<PassQrCode payload={qrPayload} />
						</button>
					</QrDialog>
					<p className="text-[15px] font-semibold text-cq-ink">
						{PASS_COPY.qrCaption}
					</p>
					<p className="text-sm text-cq-muted">{PASS_COPY.qrHint}</p>
				</div>

				{/* Tri Nguyen: Event date and place. The wax seal sits to the right on the bottom roll. */}
				<div className="w-full pb-1 pl-1 pt-1.5 text-[13px] font-semibold text-[var(--accent)]">
					<p>{PASS_COPY.eventDate}</p>
					<p>{PASS_COPY.location}</p>
				</div>
			</div>

			<Image
				src={hackerClass.seal}
				alt=""
				width={74}
				height={74}
				unoptimized
				className="absolute bottom-[14.75cqw] right-[14.75cqw] w-[20.2cqw] rotate-[9deg] drop-shadow-[0_3px_4px_rgba(61,36,64,0.25)]"
			/>
		</article>
	);
}
```

-   [ ] **Step 2: Type check and lint**

Run: `cd apps/web && pnpm exec tsc --noEmit && pnpm lint`
Expected: no new errors.

-   [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/pass/QuestScroll.tsx
git commit -m "add quest scroll card"
```

---

### Task 7: Desktop class panel with Quest Log (`ClassPanel.tsx`)

**Files:**

-   Create: `apps/web/src/components/pass/ClassPanel.tsx`

**Interfaces:**

-   Consumes: `HackerClass`, `QuestLogData`, `PASS_COPY`, `QrDialog`, `SavePassButton`.
-   Produces: `export default function ClassPanel(props: { hackerClass: HackerClass; questLog: QuestLogData; qrPayload: string }): JSX.Element;` (rendered only at `lg` and up).

Figma (65:109 "Class Panel", 560 wide): gap 20; "YOUR CLASS" Grenze SemiBold 16 tracking 18% plum; title Grenze Gotisch Bold 72 lh 100% ink; lore Grenze Medium 20 lh 150% muted; Quest Log box bg `#FBF5E6` 94%, 1.5 px `#D3BC8E` border, radius 16, padding 18/24/10/24; header row 44 + 8 bottom padding; rows 52 tall, 1 px top border `#D3BC8E` 70%, gap 14, 24 px icon; actions gap 12, buttons radius 10, padding 14/24, Grenze SemiBold 17.

-   [ ] **Step 1: Implement** `apps/web/src/components/pass/ClassPanel.tsx`

```tsx
import type { HackerClass } from "./classes";
import { PASS_COPY } from "./content";
import { QrDialog, SavePassButton } from "./PassQr";
import type { QuestLogData } from "./quest-log";

type ClassPanelProps = {
	hackerClass: HackerClass;
	questLog: QuestLogData;
	qrPayload: string;
};

const BUTTON =
	"rounded-[10px] px-6 py-3.5 text-[17px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

// Tri Nguyen: Right side of the desktop pass. The Quest Log rows come from buildQuestLog (quest-log.ts), which reads schedule events and this hacker's scans.
export default function ClassPanel({
	hackerClass,
	questLog,
	qrPayload,
}: ClassPanelProps) {
	return (
		<section
			aria-labelledby="pass-class-title"
			className="hidden w-full min-w-0 max-w-[560px] flex-1 flex-col gap-5 lg:flex"
		>
			<p className="text-base font-semibold uppercase tracking-[0.18em] text-cq-plum">
				{PASS_COPY.yourClass}
			</p>
			<h1
				id="pass-class-title"
				className="font-gotisch text-[clamp(52px,5vw,72px)] font-bold leading-none text-cq-ink"
			>
				{hackerClass.order}
			</h1>
			<p className="text-xl font-medium leading-normal text-cq-muted">
				{hackerClass.lore}
			</p>

			{/* Tri Nguyen: Quest Log. Scanned events get a filled check in the class color; upcoming ones a dashed circle and the start time. */}
			<div className="rounded-2xl border-[1.5px] border-[#D3BC8E] bg-[#FBF5E6]/95 px-6 pb-2.5 pt-[18px]">
				<div className="flex items-center justify-between pb-2">
					<h2 className="font-gotisch text-[30px] font-semibold text-cq-ink">
						{PASS_COPY.questLog}
					</h2>
					<p className="text-sm font-medium text-cq-muted">
						{questLog.scannedCount} of {questLog.rows.length}{" "}
						scanned
					</p>
				</div>
				<ol>
					{questLog.rows.map((row) => (
						<li
							key={row.id}
							className="flex items-center gap-3.5 border-t border-[#D3BC8E]/70 py-3"
						>
							<QuestIcon scanned={row.scanned} />
							<span
								className={`flex-1 text-lg font-semibold ${row.scanned ? "text-cq-ink" : "text-cq-muted"}`}
							>
								{row.title}
							</span>
							<span
								className={`text-[15px] font-medium text-cq-muted ${row.scanned ? "" : "italic"}`}
							>
								{row.note}
							</span>
						</li>
					))}
				</ol>
			</div>

			{/* Tri Nguyen: Same QR dialog as tapping the card, plus a PNG download of the code. */}
			<div className="flex gap-3">
				<QrDialog payload={qrPayload}>
					<button
						type="button"
						className={`${BUTTON} bg-[var(--accent)] text-[#FFFCF4] hover:brightness-110`}
					>
						{PASS_COPY.showQr}
					</button>
				</QrDialog>
				<SavePassButton
					className={`${BUTTON} border-[1.5px] border-[var(--accent)] bg-[#FBF5E6] text-[var(--accent)] hover:bg-white`}
				/>
			</div>
		</section>
	);
}

// Tri Nguyen: Status icons exported from Figma. Decorative, the row note says the status in words.
function QuestIcon({ scanned }: { scanned: boolean }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			className="size-6 shrink-0"
		>
			{scanned ? (
				<>
					<circle cx="12" cy="12" r="11" fill="var(--accent)" />
					<path
						d="M7 12.5l3.2 3.2L17 9"
						stroke="#FFFCF4"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</>
			) : (
				<circle
					cx="12"
					cy="12"
					r="10"
					stroke="#6E5270"
					strokeWidth="1.8"
					strokeDasharray="3 3"
				/>
			)}
		</svg>
	);
}
```

-   [ ] **Step 2: Type check and lint**

Run: `cd apps/web && pnpm exec tsc --noEmit && pnpm lint`
Expected: no new errors.

-   [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/pass/ClassPanel.tsx
git commit -m "add class panel with quest log"
```

---

### Task 8: Nav, backdrop, page entry and route

**Files:**

-   Create: `apps/web/src/components/pass/PassNav.tsx`
-   Create: `apps/web/src/components/pass/PassBackdrop.tsx`
-   Create: `apps/web/src/components/pass/PassPage.tsx`
-   Create: `apps/web/src/app/pass/page.tsx`

**Interfaces:**

-   Consumes: everything above; `getHacker`, `getAllEvents`, `getScansForUser` from `db/functions`; `buildHackDay` from `@/components/schedule/sky/schedule-data`; `createQRpayload` from `@/lib/utils/shared/qr`; `auth` from `@clerk/nextjs/server`; `grenze`, `grenzeGotisch` from `@/components/schedule/sky/fonts`.
-   Produces: route `/pass`.

-   [ ] **Step 1: Implement** `apps/web/src/components/pass/PassNav.tsx`

```tsx
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
```

-   [ ] **Step 2: Implement** `apps/web/src/components/pass/PassBackdrop.tsx`

```tsx
import Image from "next/image";
import { HERO_ART } from "@/components/schedule/sky/assets";
import type { HackerClass } from "./classes";

// Tri Nguyen: Peaks and cloud images are shared with the schedule page (public/img/schedule).
const PEAKS_LEFT = "/img/schedule/peaks-a.png";
const PEAKS_RIGHT = "/img/schedule/peaks-b.png";

// Tri Nguyen: Decorative art behind the pass, pinned to the bottom of the page like the Figma frames. Phones only get the faint peaks.
export default function PassBackdrop({
	dragon,
}: {
	dragon: HackerClass["dragon"];
}) {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<Image
				src={PEAKS_LEFT}
				alt=""
				width={580}
				height={227}
				unoptimized
				className="absolute -bottom-7 left-1/2 w-[580px] max-w-none -translate-x-1/2 opacity-55 lg:bottom-[97px] lg:left-0 lg:translate-x-0 lg:opacity-60"
			/>
			<Image
				src={PEAKS_RIGHT}
				alt=""
				width={600}
				height={212}
				unoptimized
				className="absolute bottom-[92px] right-0 hidden w-[600px] opacity-60 lg:block"
			/>
			<Image
				src={HERO_ART.cloudBank}
				alt=""
				width={1440}
				height={280}
				unoptimized
				className="absolute -bottom-14 left-0 hidden h-[280px] w-full object-cover opacity-90 lg:block"
			/>
			{/* Tri Nguyen: Class dragon floats on the right. Motion stops for people who ask for reduced motion. */}
			<Image
				src={dragon.src}
				alt=""
				width={dragon.width}
				height={dragon.height}
				unoptimized
				className="absolute right-6 top-[46%] hidden opacity-75 motion-safe:animate-cq-bob lg:block"
			/>
		</div>
	);
}
```

-   [ ] **Step 3: Implement** `apps/web/src/components/pass/PassPage.tsx`

```tsx
import { auth } from "@clerk/nextjs/server";
import c from "config";
import { getAllEvents, getHacker, getScansForUser } from "db/functions";
import { redirect } from "next/navigation";
import { grenze, grenzeGotisch } from "@/components/schedule/sky/fonts";
import { buildHackDay } from "@/components/schedule/sky/schedule-data";
import { createQRpayload } from "@/lib/utils/shared/qr";
import ClassPanel from "./ClassPanel";
import { getHackerClass } from "./classes";
import PassBackdrop from "./PassBackdrop";
import PassNav from "./PassNav";
import { PLACEHOLDER_QUEST_LOG, buildQuestLog } from "./quest-log";
import QuestScroll from "./QuestScroll";

// Tri Nguyen: Server entry for the hacker pass (rendered by app/pass/page.tsx). middleware.ts already makes /pass sign-in only.
// Tri Nguyen: Unregistered or unapproved users are sent to the same places the dashboard sends them (app/dash/layout.tsx).
export default async function PassPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const hacker = await getHacker(userId);
	if (!hacker?.hackerData) redirect("/register");
	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		!hacker.isApproved
	) {
		redirect("/i/approval");
	}

	// Tri Nguyen: The Quest Log uses the same events as the schedule page (hidden ones are removed by buildHackDay). With no events yet it shows the Figma placeholder.
	const timezone = c.hackathonTimezone;
	const [events, scans] = await Promise.all([
		getAllEvents(),
		getScansForUser(userId),
	]);
	const hackDay = buildHackDay(events, timezone);
	const questLog = hackDay
		? buildQuestLog(hackDay.events, scans, timezone)
		: PLACEHOLDER_QUEST_LOG;

	const hackerClass = getHackerClass(hacker.hackerData.group);
	// Tri Nguyen: Same QR payload as the old pass, so the admin scanner keeps working.
	const qrPayload = createQRpayload({
		userID: userId,
		createdAt: new Date(),
	});

	return (
		<div
			className={`${grenze.variable} ${grenzeGotisch.variable} min-h-dvh bg-cq-parchment font-grenze text-cq-ink`}
			style={{ "--accent": hackerClass.accent } as React.CSSProperties}
		>
			<PassNav />
			<main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden lg:min-h-[calc(100dvh-4rem)]">
				<PassBackdrop dragon={hackerClass.dragon} />
				<div className="relative mx-auto flex max-w-[1104px] flex-col items-center px-3 pb-4 pt-2 lg:min-h-[calc(100dvh-4rem)] lg:flex-row lg:gap-[86px] lg:px-6 lg:py-10 xl:px-0">
					<div className="w-full max-w-[366px] lg:shrink-0">
						<QuestScroll
							hacker={{
								firstName: hacker.firstName,
								lastName: hacker.lastName,
								hackerTag: hacker.hackerTag,
								profilePhoto: hacker.profilePhoto || null,
							}}
							hackerClass={hackerClass}
							qrPayload={qrPayload}
						/>
					</div>
					<ClassPanel
						hackerClass={hackerClass}
						questLog={questLog}
						qrPayload={qrPayload}
					/>
				</div>
			</main>
		</div>
	);
}
```

-   [ ] **Step 4: Create the route** `apps/web/src/app/pass/page.tsx`

```tsx
import type { Metadata } from "next";
import PassPage from "@/components/pass/PassPage";

export const metadata: Metadata = { title: "Hacker Pass" };

// Tri Nguyen: Login-only hacker pass. Not listed in publicRoutes (packages/config), so middleware asks for sign-in first.
export default function Page() {
	return <PassPage />;
}
```

-   [ ] **Step 5: Verify build health**

Run: `cd apps/web && pnpm test && pnpm exec tsc --noEmit && pnpm lint`
Expected: all tests pass, no new type or lint errors.

-   [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/pass/PassNav.tsx apps/web/src/components/pass/PassBackdrop.tsx apps/web/src/components/pass/PassPage.tsx apps/web/src/app/pass/page.tsx
git commit -m "add login-only hacker pass page"
```

---

### Task 9: Visual check against Figma and README

**Files:**

-   Create: `apps/web/src/components/pass/README.md`
-   Modify: any pass component where the visual check finds a mismatch

-   [ ] **Step 1: Check the page in the browser**

With the dev server on `http://localhost:3000` and a signed-in hacker in Chrome, open `/pass` at 390 px wide, 1440 × 1024, and also 320, 768 and 1024 widths. Compare with the Figma screenshots of 64:3 (mobile) and 65:109 (desktop). Check: scroll rolls line up, QR is fully visible on a 390 × 844 screen, no horizontal scroll, the QR dialog opens from the card and from "Show QR full screen", "Save pass to phone" downloads a PNG, signed-out visit redirects to sign-in.

-   [ ] **Step 2: Fix mismatches** in the component files, re-run `pnpm exec tsc --noEmit && pnpm lint`, and commit each fix separately, e.g. `git commit -m "fix pass seal position"`.

-   [ ] **Step 3: Write** `apps/web/src/components/pass/README.md`

```md
# Hacker Pass

Login-only quest scroll pass at `/pass`, built from the Figma file "CodeQuantum 27 – Schedule", page "Cards" (Simple crest). Written by Tri Nguyen.

## Where things live

-   `PassPage.tsx` is the entry. It checks the user, loads events and scans on the server, and lays out the page.
-   `QuestScroll.tsx` is the card. `ClassPanel.tsx` is the desktop panel with the Quest Log.
-   `PassQr.tsx` is the only client code: the QR, the full screen dialog, and the PNG download.
-   Class copy, colors and art are in `classes.ts`. Static text is in `content.ts`.
-   Card art is in `apps/web/public/img/pass`. Peaks, clouds and dragons are shared from `apps/web/public/img/schedule`.

## Classes

A hacker's class is `hackerData.group`: 0 Knight, 1 Wizard, 2 Archer, the same order as `groups` in `packages/config/hackkit.config.ts`. Registration hands them out in turn.

## Quest Log

The desktop Quest Log lists the same events as the schedule page (`buildHackDay`, hidden events removed) and marks the ones this hacker has been scanned into (`scans` table, `getScansForUser`). Until events exist in `/admin/events`, it shows the Figma placeholder rows (`PLACEHOLDER_QUEST_LOG`).

## Sizes

The card is at most 366 px wide. Spacing on the scroll art uses `cqw` units so the art and content shrink together on narrow phones. Desktop layout starts at 1024 px.
```

-   [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/pass/README.md
git commit -m "document hacker pass page"
```
