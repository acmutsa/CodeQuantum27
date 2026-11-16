# Sky Schedule Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new, unrouted schedule page that matches the Figma frame "Schedule / Desktop — Storybook v4" (castle hero, cloud event cards on a winding path, dragons, finale landscape), adds tasteful animations, and keeps the MLH season badge working.

**Architecture:** One self-contained folder, `apps/web/src/components/schedule/sky/`. A server component (`SkySchedulePage`) reads events from the existing `events` table, hides hidden events, groups them by day in the hackathon timezone, and composes small presentational components. Layout math and date formatting live in pure, unit-tested modules. Animations are CSS keyframes (Tailwind `motion-safe:` variants) plus two tiny client pieces: a scroll-reveal wrapper and a scroll-linked path drawer. Nothing is wired into a route yet; going live later is a one-line change in `apps/web/src/app/schedule/page.tsx`.

**Tech Stack:** Next.js 14.2 App Router, React 18, TypeScript, Tailwind 3.4, `next/font/google` (Grenze, Grenze Gotisch), `next/image`, `date-fns-tz`, Drizzle (`db/functions`), Vitest (new, dev only).

## Global Constraints

- Commit rules (apply to every subagent): never add `Co-Authored-By` lines, never add AI attribution lines, never include "Generated with Claude Code" or similar disclaimers in commits or PRs.
- Commit message style: short imperative subject, no prefix, matching history (e.g. `unify form field colors`).
- Never stage `.gitignore` (it has unrelated uncommitted edits). Always `git add` explicit paths.
- Every code comment is tagged with the author name: `// Tri Nguyen: ...` or `{/* Tri Nguyen: ... */}` in JSX. Never use `--------` style divider comments.
- Do not add or change any route. `apps/web/src/app/schedule/page.tsx` must be unchanged in every commit.
- Keep the MLH badge working: the page renders `<MLHBadge />` directly after `<Navbar />` (same as `apps/web/src/app/page.tsx`), and no element on the page may use a z-index above `z-20` so the badge (`z-50`) always stays on top.
- Security: no `dangerouslySetInnerHTML`, no new runtime dependencies (Vitest is devDependency only), all art served locally from `/public/img/schedule`, every `target="_blank"` link has `rel="noopener noreferrer"`, hidden events are filtered on the server.
- All times shown in `c.hackathonTimezone` (`America/Chicago`), because the hero says "All times in CST".
- Formatting: the repo uses Prettier with tabs. Run Prettier on touched files before each commit.
- Palette (from Figma): plum `#68396B`, ink `#3D2340`, title `#4E2B4F`, muted `#6E5270`, gold `#D7A33D`, parchment `#F6ECD6`, sand `#EBDDBF`, path `#FFFDF3`, rope `#E2CC9C`.
- Figma source: file key `9oqlic9CAVJ4uHbB8vb1C1`, frame node `19:2`.

## File Structure

All new files live in `apps/web/src/components/schedule/sky/` unless noted.

| File | Responsibility |
|---|---|
| `schedule-data.ts` | Pure helpers: filter, sort, group events by day; format times and labels |
| `schedule-data.test.ts` | Unit tests for the helpers above |
| `sky-layout.ts` | Pure layout math: card positions, winding path, markers, scroll draw progress |
| `sky-layout.test.ts` | Unit tests for layout math |
| `content.ts` | All static page copy in one place |
| `assets.ts` | Image paths, cloud variants, background decoration placements |
| `fonts.ts` | `next/font` setup for Grenze and Grenze Gotisch |
| `Reveal.tsx` | Client wrapper that fades content up when it scrolls into view |
| `useScrollDrawProgress.ts` | Client hook returning 0..1 draw progress for the path |
| `ScheduleHero.tsx` | Castle hero, dragons, title copy, cloud bank |
| `DayHeader.tsx` | "Hack Day" heading plus plain-text date line |
| `EventCloud.tsx` | One event card drawn on cloud art |
| `WindingPath.tsx` | Client SVG path that draws itself while scrolling |
| `SkyDecorations.tsx` | Peaks, drifting dragons, deco clouds, wind swirls |
| `SkyTimeline.tsx` | Composes path, decorations, cards, finale for one day |
| `ScheduleFooter.tsx` | Footer with copyright and Discord link |
| `SkySchedulePage.tsx` | Server entry: fetch events and compose the page |
| `README.md` | Short guide for teammates |
| `apps/web/public/img/schedule/*` | Art exported from Figma |
| Modify `apps/web/tailwind.config.js` | Add `cq` colors, fonts, keyframes |
| Modify `apps/web/package.json` | Add Vitest and a `test` script |
| Create `apps/web/vitest.config.ts` | Vitest config with the `@` alias |

---

### Task 1: Vitest setup and schedule date helpers

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/components/schedule/sky/schedule-data.ts`
- Test: `apps/web/src/components/schedule/sky/schedule-data.test.ts`

**Interfaces:**
- Consumes: `EventType` from `@/lib/types/events` (fields: `id`, `title`, `startTime: Date`, `endTime: Date`, `location: string | null`, `description`, `type`, `host: string | null`, `hidden: boolean`).
- Produces:
  - `type ScheduleDay = { dayKey: string; events: EventType[] }`
  - `groupEventsByDay(events: EventType[], timezone: string): ScheduleDay[]`
  - `formatTimeRange(start: Date, end: Date, timezone: string): string`
  - `formatDayLabel(day: ScheduleDay, timezone: string): string`
  - `formatHeroDate(date: Date, timezone: string): string`
  - `getDayTitle(index: number, totalDays: number): string`

- [ ] **Step 1: Install Vitest and add the test script**

Run from repo root:

```bash
pnpm --filter web add -D vitest@2.1.9
```

Then add `"test": "vitest run"` to `apps/web/package.json` scripts, right after `"lint"`:

```json
		"lint": "next lint",
		"test": "vitest run",
```

- [ ] **Step 2: Create `apps/web/vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tri Nguyen: Unit tests run in plain Node. The "@" alias mirrors tsconfig so imports match the app code.
export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
```

- [ ] **Step 3: Write the failing tests**

Create `apps/web/src/components/schedule/sky/schedule-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { EventType } from "@/lib/types/events";
import {
	formatDayLabel,
	formatHeroDate,
	formatTimeRange,
	getDayTitle,
	groupEventsByDay,
} from "./schedule-data";

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

describe("groupEventsByDay", () => {
	it("returns no days when there are no events", () => {
		expect(groupEventsByDay([], TIMEZONE)).toEqual([]);
	});

	it("drops hidden events and sorts by start time", () => {
		const later = makeEvent({
			id: 2,
			startTime: new Date("2027-02-20T16:00:00Z"),
		});
		const earlier = makeEvent({ id: 1 });
		const hidden = makeEvent({ id: 3, hidden: true });

		const days = groupEventsByDay([later, earlier, hidden], TIMEZONE);

		expect(days).toHaveLength(1);
		expect(days[0].events.map((event) => event.id)).toEqual([1, 2]);
	});

	it("splits days using the hackathon timezone, not UTC", () => {
		// Tri Nguyen: 05:00 UTC on Feb 21 is still 11 PM on Feb 20 in Chicago.
		const lateNight = makeEvent({
			id: 1,
			startTime: new Date("2027-02-21T05:00:00Z"),
		});
		const nextMorning = makeEvent({
			id: 2,
			startTime: new Date("2027-02-21T15:00:00Z"),
		});

		const days = groupEventsByDay([lateNight, nextMorning], TIMEZONE);

		expect(days.map((day) => day.dayKey)).toEqual([
			"2027-02-20",
			"2027-02-21",
		]);
	});
});

describe("formatTimeRange", () => {
	it("shows a start and end time", () => {
		expect(
			formatTimeRange(
				new Date("2027-02-20T14:00:00Z"),
				new Date("2027-02-20T15:00:00Z"),
				TIMEZONE,
			),
		).toBe("8:00 AM – 9:00 AM");
	});

	it("shows a single time when start equals end", () => {
		const deadline = new Date("2027-02-20T23:30:00Z");
		expect(formatTimeRange(deadline, deadline, TIMEZONE)).toBe("5:30 PM");
	});
});

describe("formatDayLabel", () => {
	it("summarizes the weekday, date, and full day span", () => {
		const day = {
			dayKey: "2027-02-20",
			events: [
				makeEvent({ id: 1 }),
				makeEvent({
					id: 2,
					startTime: new Date("2027-02-20T23:30:00Z"),
					endTime: new Date("2027-02-21T02:00:00Z"),
				}),
			],
		};

		expect(formatDayLabel(day, TIMEZONE)).toBe(
			"Saturday · Feb 20 · 8 AM – 8 PM",
		);
	});
});

describe("formatHeroDate", () => {
	it("writes the full date for the hero", () => {
		expect(
			formatHeroDate(new Date("2027-02-20T14:00:00Z"), TIMEZONE),
		).toBe("Saturday, February 20, 2027");
	});
});

describe("getDayTitle", () => {
	it("calls a single day Hack Day", () => {
		expect(getDayTitle(0, 1)).toBe("Hack Day");
	});

	it("numbers days when the event spans several days", () => {
		expect(getDayTitle(0, 2)).toBe("Day 1");
		expect(getDayTitle(1, 2)).toBe("Day 2");
	});
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `pnpm --filter web test`
Expected: FAIL with `Failed to resolve import "./schedule-data"`.

- [ ] **Step 5: Write the implementation**

Create `apps/web/src/components/schedule/sky/schedule-data.ts`:

```ts
import { formatInTimeZone } from "date-fns-tz";
import type { EventType } from "@/lib/types/events";

// Tri Nguyen: One calendar day of the schedule. dayKey is "yyyy-MM-dd" in the hackathon timezone.
export type ScheduleDay = {
	dayKey: string;
	events: EventType[];
};

// Tri Nguyen: Removes hidden events, sorts by start time, and buckets events by local calendar day.
export function groupEventsByDay(
	events: EventType[],
	timezone: string,
): ScheduleDay[] {
	const visibleEvents = events
		.filter((event) => !event.hidden)
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

	const days: ScheduleDay[] = [];
	for (const event of visibleEvents) {
		const dayKey = formatInTimeZone(event.startTime, timezone, "yyyy-MM-dd");
		const currentDay = days[days.length - 1];

		if (currentDay && currentDay.dayKey === dayKey) {
			currentDay.events.push(event);
		} else {
			days.push({ dayKey, events: [event] });
		}
	}
	return days;
}

// Tri Nguyen: Card time text, e.g. "8:00 AM – 9:00 AM", or just "5:30 PM" for deadlines.
export function formatTimeRange(
	start: Date,
	end: Date,
	timezone: string,
): string {
	const startText = formatInTimeZone(start, timezone, "h:mm a");
	if (start.getTime() === end.getTime()) {
		return startText;
	}
	return `${startText} – ${formatInTimeZone(end, timezone, "h:mm a")}`;
}

// Tri Nguyen: Short clock text that drops ":00", e.g. "8 AM" but "5:30 PM".
function formatShortClock(date: Date, timezone: string): string {
	const minutes = formatInTimeZone(date, timezone, "mm");
	return formatInTimeZone(date, timezone, minutes === "00" ? "h a" : "h:mm a");
}

// Tri Nguyen: Line next to the day title, e.g. "Saturday · Feb 20 · 8 AM – 8 PM".
export function formatDayLabel(day: ScheduleDay, timezone: string): string {
	const firstStart = day.events[0].startTime;
	const lastEnd = new Date(
		Math.max(...day.events.map((event) => event.endTime.getTime())),
	);

	const weekday = formatInTimeZone(firstStart, timezone, "EEEE");
	const date = formatInTimeZone(firstStart, timezone, "MMM d");
	const span = `${formatShortClock(firstStart, timezone)} – ${formatShortClock(lastEnd, timezone)}`;

	return `${weekday} · ${date} · ${span}`;
}

// Tri Nguyen: Full date for the hero meta row, e.g. "Saturday, February 20, 2027".
export function formatHeroDate(date: Date, timezone: string): string {
	return formatInTimeZone(date, timezone, "EEEE, MMMM d, yyyy");
}

// Tri Nguyen: A one day event is "Hack Day". Longer events fall back to "Day 1", "Day 2", and so on.
export function getDayTitle(index: number, totalDays: number): string {
	return totalDays === 1 ? "Hack Day" : `Day ${index + 1}`;
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm --filter web test`
Expected: PASS, 9 tests.

- [ ] **Step 7: Format and commit**

```bash
pnpm exec prettier --write apps/web/vitest.config.ts apps/web/package.json apps/web/src/components/schedule/sky/schedule-data.ts apps/web/src/components/schedule/sky/schedule-data.test.ts
git add apps/web/package.json pnpm-lock.yaml apps/web/vitest.config.ts apps/web/src/components/schedule/sky/schedule-data.ts apps/web/src/components/schedule/sky/schedule-data.test.ts
git commit -m "add vitest and schedule date helpers"
```

---

### Task 2: Sky layout math

**Files:**
- Create: `apps/web/src/components/schedule/sky/sky-layout.ts`
- Test: `apps/web/src/components/schedule/sky/sky-layout.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `LANE_WIDTH = 480`, `CARD_WIDTH = 560`, `CARD_HEIGHT = 246`
  - `type SkyPoint = { x: number; y: number }`
  - `type SkyLayout = { height: number; path: string; markers: SkyPoint[]; cardTops: number[] }`
  - `buildSkyLayout(eventCount: number): SkyLayout` (path and marker x values are in a 480px wide lane centered on the page)
  - `getDrawProgress(rectTop: number, rectHeight: number, viewportHeight: number): number` (0..1)

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/components/schedule/sky/sky-layout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { LANE_WIDTH, buildSkyLayout, getDrawProgress } from "./sky-layout";

describe("buildSkyLayout", () => {
	it("returns an empty layout when there are no events", () => {
		expect(buildSkyLayout(0)).toEqual({
			height: 0,
			path: "",
			markers: [],
			cardTops: [],
		});
	});

	it("stacks cards 200px apart starting 40px from the top", () => {
		expect(buildSkyLayout(3).cardTops).toEqual([40, 240, 440]);
	});

	it("matches the Figma section height for ten events", () => {
		expect(buildSkyLayout(10).height).toBe(2440);
	});

	it("bends the path away from each card", () => {
		// Tri Nguyen: Even cards sit on the left so the path bends right, odd cards do the opposite.
		expect(buildSkyLayout(2).markers).toEqual([
			{ x: 330, y: 160 },
			{ x: 150, y: 360 },
		]);
	});

	it("draws one smooth curve through every marker", () => {
		expect(buildSkyLayout(2).path).toBe(
			"M 240 -20 C 240 70, 330 70, 330 160 C 330 260, 150 260, 150 360 C 150 500, 240 500, 240 640",
		);
	});

	it("uses a 480px lane", () => {
		expect(LANE_WIDTH).toBe(480);
	});
});

describe("getDrawProgress", () => {
	it("is 0 before the path reaches the reading line", () => {
		expect(getDrawProgress(1000, 2000, 800)).toBe(0);
	});

	it("grows as the path scrolls up", () => {
		expect(getDrawProgress(-1000, 2000, 800)).toBeCloseTo(0.8);
	});

	it("stops at 1 once fully scrolled past", () => {
		expect(getDrawProgress(-3000, 2000, 800)).toBe(1);
	});

	it("is fully drawn when the path has no height", () => {
		expect(getDrawProgress(0, 0, 800)).toBe(1);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test`
Expected: FAIL with `Failed to resolve import "./sky-layout"`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/components/schedule/sky/sky-layout.ts`:

```ts
// Tri Nguyen: All numbers come from the Figma frame (1440px wide). Change them here and every card, the path, and the markers move together.
export const LANE_WIDTH = 480;
export const CARD_WIDTH = 560;
export const CARD_HEIGHT = 246;

const LANE_CENTER = LANE_WIDTH / 2;
const BEND = 90;
const FIRST_CARD_TOP = 40;
const ROW_STEP = 200;
const MARKER_OFFSET = 120;
const FINALE_SPACE = 354;
const PATH_START_Y = -20;
const PATH_END_LIFT = 200;
const READING_LINE = 0.75;

export type SkyPoint = { x: number; y: number };

export type SkyLayout = {
	height: number;
	path: string;
	markers: SkyPoint[];
	cardTops: number[];
};

// Tri Nguyen: Works out where each card sits and builds the SVG path that winds between them.
export function buildSkyLayout(eventCount: number): SkyLayout {
	if (eventCount <= 0) {
		return { height: 0, path: "", markers: [], cardTops: [] };
	}

	const cardTops = Array.from(
		{ length: eventCount },
		(_, index) => FIRST_CARD_TOP + index * ROW_STEP,
	);
	const height = cardTops[cardTops.length - 1] + CARD_HEIGHT + FINALE_SPACE;

	// Tri Nguyen: Even cards are on the left, so their marker bends right, and odd cards bend left.
	const markers = cardTops.map((top, index) => ({
		x: index % 2 === 0 ? LANE_CENTER + BEND : LANE_CENTER - BEND,
		y: top + MARKER_OFFSET,
	}));

	const points: SkyPoint[] = [
		{ x: LANE_CENTER, y: PATH_START_Y },
		...markers,
		{ x: LANE_CENTER, y: height - PATH_END_LIFT },
	];

	// Tri Nguyen: Each segment is a cubic curve with vertical handles, which gives the soft S shape from Figma.
	const curves = points.slice(1).map((point, index) => {
		const previous = points[index];
		const midY = (previous.y + point.y) / 2;
		return `C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
	});

	return {
		height,
		path: `M ${points[0].x} ${points[0].y} ${curves.join(" ")}`,
		markers,
		cardTops,
	};
}

// Tri Nguyen: How much of the path to draw (0 to 1) based on how far it has scrolled past 75% of the screen.
export function getDrawProgress(
	rectTop: number,
	rectHeight: number,
	viewportHeight: number,
): number {
	if (rectHeight <= 0) {
		return 1;
	}
	const drawnPixels = viewportHeight * READING_LINE - rectTop;
	return Math.min(1, Math.max(0, drawnPixels / rectHeight));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test`
Expected: PASS, 19 tests total.

- [ ] **Step 5: Format and commit**

```bash
pnpm exec prettier --write apps/web/src/components/schedule/sky/sky-layout.ts apps/web/src/components/schedule/sky/sky-layout.test.ts
git add apps/web/src/components/schedule/sky/sky-layout.ts apps/web/src/components/schedule/sky/sky-layout.test.ts
git commit -m "add sky schedule layout math"
```

---

### Task 3: Export the art from Figma

**Files:**
- Create: 24 PNG images plus 1 SVG in `apps/web/public/img/schedule/`

**Interfaces:**
- Produces: the exact file names listed below. Task 4 `assets.ts` references them with a `.png` extension.

- [ ] **Step 1: Download each raw image**

For each row, call the Figma MCP tool `download_assets` with `fileKey: "9oqlic9CAVJ4uHbB8vb1C1"` and the node id. Take `rawImages[0].url` from the response and save it:

```bash
mkdir -p apps/web/public/img/schedule
curl -fL -o "apps/web/public/img/schedule/<file name>" "<rawImages[0].url>"
```

| Node | File name |
|---|---|
| `19:18` | `castle-art.png` |
| `45:2` | `cloud-bank.png` |
| `19:718` | `dragon-plum.png` |
| `19:719` | `dragon-gold.png` |
| `19:720` | `dragon-ice.png` |
| `19:721` | `dragon-chestnut.png` |
| `26:4` | `peaks-a.png` |
| `26:5` | `peaks-b.png` |
| `21:3` | `finale-landscape.png` |
| `44:2` | `cloud-01.png` |
| `44:3` | `cloud-02.png` |
| `44:4` | `cloud-03.png` |
| `44:5` | `cloud-04.png` |
| `44:6` | `cloud-05.png` |
| `44:7` | `cloud-06.png` |
| `44:8` | `cloud-07.png` |
| `44:9` | `cloud-08.png` |
| `44:10` | `cloud-09.png` |
| `44:11` | `cloud-10.png` |
| `44:12` | `deco-cloud-01.png` |
| `44:13` | `deco-cloud-02.png` |
| `44:14` | `deco-cloud-03.png` |
| `44:15` | `deco-cloud-04.png` |
| `44:16` | `deco-cloud-05.png` |

If a response reports `format` other than `png`, convert it to PNG instead of changing the name: `sips -s format png <file> --out <file>.png && mv <file>.png <file>`.

- [ ] **Step 2: Export the wind swirls as SVG**

Run `use_figma` on the same file with this script. It clones the frame without its white background, exports, and deletes the clone:

```js
const frame = await figma.getNodeByIdAsync("19:516");
const copy = frame.clone();
copy.fills = [];
const svg = await copy.exportAsync({ format: "SVG_STRING" });
copy.remove();
return svg;
```

Save the returned string to `apps/web/public/img/schedule/wind-swirls.svg`.

- [ ] **Step 3: Verify the files**

Run:

```bash
ls apps/web/public/img/schedule | wc -l
file apps/web/public/img/schedule/*.png | grep -v "PNG image" || echo "all png"
du -sh apps/web/public/img/schedule
```

Expected: `25`, then `all png`. Note the total size in the commit body if it is above 10 MB so reviewers know.

- [ ] **Step 4: Commit**

```bash
git add apps/web/public/img/schedule
git commit -m "add sky schedule art from figma"
```

---

### Task 4: Theme tokens, fonts, copy, and asset map

**Files:**
- Modify: `apps/web/tailwind.config.js` (inside `theme.extend`)
- Create: `apps/web/src/components/schedule/sky/fonts.ts`
- Create: `apps/web/src/components/schedule/sky/content.ts`
- Create: `apps/web/src/components/schedule/sky/assets.ts`

**Interfaces:**
- Produces:
  - Tailwind colors `cq-plum`, `cq-ink`, `cq-title`, `cq-muted`, `cq-gold`, `cq-parchment`, `cq-sand`, `cq-path`, `cq-rope`
  - Tailwind fonts `font-grenze`, `font-gotisch`
  - Tailwind animations `animate-cq-float`, `animate-cq-float-slow`, `animate-cq-drift`, `animate-cq-bob`, `animate-cq-rise`
  - `grenze`, `grenzeGotisch` (next/font objects with `.variable`)
  - `SCHEDULE_COPY` object (keys below)
  - `HERO_ART`, `DRAGONS`, `FINALE_LANDSCAPE`, `CLOUD_VARIANTS: CloudVariant[]`, `SKY_DECORATIONS: Decoration[]`, types `CloudVariant`, `Decoration`

- [ ] **Step 1: Extend Tailwind**

In `apps/web/tailwind.config.js`, inside `theme.extend.colors`, add after the `sidebar` block:

```js
				// Tri Nguyen: CodeQuantum 27 storybook palette used by the sky schedule page.
				cq: {
					plum: "#68396B",
					ink: "#3D2340",
					title: "#4E2B4F",
					muted: "#6E5270",
					gold: "#D7A33D",
					parchment: "#F6ECD6",
					sand: "#EBDDBF",
					path: "#FFFDF3",
					rope: "#E2CC9C",
				},
```

Inside `theme.extend.keyframes`, add after `accordion-up`:

```js
				// Tri Nguyen: Gentle up and down hover with a tiny tilt for dragons.
				"cq-float": {
					"0%, 100%": { transform: "translateY(0) rotate(0deg)" },
					"50%": { transform: "translateY(-12px) rotate(-1.5deg)" },
				},
				// Tri Nguyen: Slow sideways drift for the small background clouds.
				"cq-drift": {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(24px)" },
				},
				// Tri Nguyen: Soft bob so event clouds feel like they are floating.
				"cq-bob": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-6px)" },
				},
				// Tri Nguyen: Fade and rise used when content first appears.
				"cq-rise": {
					from: { opacity: "0", transform: "translateY(24px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
```

Inside `theme.extend.animation`, add after `accordion-up`:

```js
				"cq-float": "cq-float 7s ease-in-out infinite",
				"cq-float-slow": "cq-float 10s ease-in-out infinite",
				"cq-drift": "cq-drift 18s ease-in-out infinite",
				"cq-bob": "cq-bob 6s ease-in-out infinite",
				"cq-rise": "cq-rise 0.8s ease-out both",
```

Inside `theme.extend.fontFamily`, add after `oswald`:

```js
				grenze: ["var(--font-grenze)"],
				gotisch: ["var(--font-grenze-gotisch)"],
```

- [ ] **Step 2: Create `fonts.ts`**

```ts
import { Grenze, Grenze_Gotisch } from "next/font/google";

// Tri Nguyen: Body font for the schedule page. Weights match the Figma text styles (Regular, Medium, SemiBold, Italic).
export const grenze = Grenze({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	style: ["normal", "italic"],
	variable: "--font-grenze",
});

// Tri Nguyen: Blackletter display font for big titles like "Schedule" and "Hack Day".
export const grenzeGotisch = Grenze_Gotisch({
	subsets: ["latin"],
	weight: ["600", "700"],
	variable: "--font-grenze-gotisch",
});
```

- [ ] **Step 3: Create `content.ts`**

```ts
// Tri Nguyen: Every piece of static text on the schedule page. Edit wording here instead of inside components.
export const SCHEDULE_COPY = {
	eyebrow: "CODEQUANTUM 27",
	title: "Schedule",
	subtitle: "One day of building, learning, and a little bit of magic.",
	dateFallback: "Date coming soon",
	location: "UTSA Main Campus",
	timezoneNote: "All times in CST",
	emptyState: "The schedule is still being written. Check back soon!",
	footerCopyright: "© 2026 CodeQuantum · ACM UTSA",
	footerQuestion: "Questions? Reach us on Discord",
} as const;
```

- [ ] **Step 4: Create `assets.ts`**

```ts
// Tri Nguyen: Every image the sky schedule uses lives in /public/img/schedule. Swapping art is a one line change here.
const ART_DIR = "/img/schedule";

export const HERO_ART = {
	castle: `${ART_DIR}/castle-art.png`,
	cloudBank: `${ART_DIR}/cloud-bank.png`,
	windSwirls: `${ART_DIR}/wind-swirls.svg`,
} as const;

export const DRAGONS = {
	plum: `${ART_DIR}/dragon-plum.png`,
	gold: `${ART_DIR}/dragon-gold.png`,
	ice: `${ART_DIR}/dragon-ice.png`,
	chestnut: `${ART_DIR}/dragon-chestnut.png`,
} as const;

const PEAKS = {
	a: `${ART_DIR}/peaks-a.png`,
	b: `${ART_DIR}/peaks-b.png`,
} as const;

export const FINALE_LANDSCAPE = `${ART_DIR}/finale-landscape.png`;

// Tri Nguyen: Cloud art behind one event card. x, y, width, height are pixels inside a 560 x 246 card, copied from Figma.
export type CloudVariant = {
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

// Tri Nguyen: Cards cycle through these in order, so event 11 reuses cloud 1.
export const CLOUD_VARIANTS: CloudVariant[] = [
	{ src: `${ART_DIR}/cloud-01.png`, x: -31, y: -27, width: 500, height: 247 },
	{ src: `${ART_DIR}/cloud-02.png`, x: -32, y: -15, width: 495, height: 237 },
	{ src: `${ART_DIR}/cloud-03.png`, x: -86, y: -14, width: 507, height: 238 },
	{ src: `${ART_DIR}/cloud-04.png`, x: -30, y: -38, width: 513, height: 254 },
	{ src: `${ART_DIR}/cloud-05.png`, x: -102, y: -26, width: 512, height: 248 },
	{ src: `${ART_DIR}/cloud-06.png`, x: -27, y: -34, width: 558, height: 258 },
	{ src: `${ART_DIR}/cloud-07.png`, x: -19, y: -26, width: 521, height: 250 },
	{ src: `${ART_DIR}/cloud-08.png`, x: -55, y: -75, width: 676, height: 327 },
	{ src: `${ART_DIR}/cloud-09.png`, x: -14, y: -37, width: 513, height: 254 },
	{ src: `${ART_DIR}/cloud-10.png`, x: -29, y: -63, width: 586, height: 290 },
];

// Tri Nguyen: A background picture in the sky section. left and width are Figma pixels on a 1440 frame. Use top to pin from the section top or bottom to pin from the section bottom.
export type Decoration = {
	src: string;
	left: number;
	width: number;
	height: number;
	top?: number;
	bottom?: number;
	opacity: number;
	animationClass?: string;
};

export const SKY_DECORATIONS: Decoration[] = [
	{ src: PEAKS.a, left: 0, top: 353, width: 580, height: 227, opacity: 0.9 },
	{ src: PEAKS.b, left: 840, top: 968, width: 600, height: 212, opacity: 0.9 },
	{ src: PEAKS.a, left: 0, top: 1503, width: 580, height: 227, opacity: 0.9 },
	{
		src: DRAGONS.ice,
		left: 1130,
		top: 300,
		width: 240,
		height: 190,
		opacity: 0.6,
		animationClass: "motion-safe:animate-cq-float-slow",
	},
	{
		src: DRAGONS.chestnut,
		left: 40,
		top: 1110,
		width: 230,
		height: 166,
		opacity: 0.55,
		animationClass: "motion-safe:animate-cq-float",
	},
	{
		src: DRAGONS.gold,
		left: 1170,
		top: 1600,
		width: 210,
		height: 113,
		opacity: 0.5,
		animationClass: "motion-safe:animate-cq-float-slow",
	},
	{
		src: DRAGONS.plum,
		left: 150,
		bottom: 382,
		width: 300,
		height: 179,
		opacity: 0.85,
		animationClass: "motion-safe:animate-cq-float",
	},
	{
		src: `${ART_DIR}/deco-cloud-01.png`,
		left: 780,
		top: -6,
		width: 206,
		height: 102,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-02.png`,
		left: 1230,
		top: 640,
		width: 166,
		height: 82,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-03.png`,
		left: 40,
		top: 1480,
		width: 236,
		height: 112,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-04.png`,
		left: 1190,
		top: 1840,
		width: 206,
		height: 96,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-05.png`,
		left: 600,
		top: 2020,
		width: 186,
		height: 92,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
];
```

- [ ] **Step 5: Type check**

Run: `pnpm --filter web exec tsc --noEmit 2>&1 | grep "schedule/sky" || echo "no sky errors"`
Expected: `no sky errors`.

- [ ] **Step 6: Format and commit**

```bash
pnpm exec prettier --write apps/web/tailwind.config.js apps/web/src/components/schedule/sky/fonts.ts apps/web/src/components/schedule/sky/content.ts apps/web/src/components/schedule/sky/assets.ts
git add apps/web/tailwind.config.js apps/web/src/components/schedule/sky/fonts.ts apps/web/src/components/schedule/sky/content.ts apps/web/src/components/schedule/sky/assets.ts
git commit -m "add sky schedule theme, fonts, copy, and asset map"
```

---

### Task 5: Motion primitives

**Files:**
- Create: `apps/web/src/components/schedule/sky/Reveal.tsx`
- Create: `apps/web/src/components/schedule/sky/useScrollDrawProgress.ts`

**Interfaces:**
- Consumes: `getDrawProgress` from `./sky-layout`, `cn` from `@/lib/utils/client/cn`.
- Produces:
  - `Reveal` default export, props `{ children: ReactNode; className?: string; style?: CSSProperties; delayMs?: number }`
  - `useScrollDrawProgress(ref: RefObject<Element>): number`

- [ ] **Step 1: Create `Reveal.tsx`**

```tsx
"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
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
				isVisible ? "motion-safe:animate-cq-rise" : "motion-safe:opacity-0",
			)}
			style={{ ...style, animationDelay: `${delayMs}ms` }}
		>
			{children}
		</div>
	);
}
```

- [ ] **Step 2: Create `useScrollDrawProgress.ts`**

```ts
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
			setProgress(getDrawProgress(rect.top, rect.height, window.innerHeight));
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
```

- [ ] **Step 3: Type check and tests**

Run: `pnpm --filter web exec tsc --noEmit 2>&1 | grep "schedule/sky" || echo "no sky errors"` then `pnpm --filter web test`
Expected: `no sky errors`, then PASS, 19 tests.

- [ ] **Step 4: Format and commit**

```bash
pnpm exec prettier --write apps/web/src/components/schedule/sky/Reveal.tsx apps/web/src/components/schedule/sky/useScrollDrawProgress.ts
git add apps/web/src/components/schedule/sky/Reveal.tsx apps/web/src/components/schedule/sky/useScrollDrawProgress.ts
git commit -m "add scroll reveal and path draw helpers"
```

---

### Task 6: Hero, day header, and footer

**Files:**
- Create: `apps/web/src/components/schedule/sky/ScheduleHero.tsx`
- Create: `apps/web/src/components/schedule/sky/DayHeader.tsx`
- Create: `apps/web/src/components/schedule/sky/ScheduleFooter.tsx`

**Interfaces:**
- Consumes: `HERO_ART`, `DRAGONS` from `./assets`; `SCHEDULE_COPY` from `./content`; `Reveal` from `./Reveal`; `c` from `config` (`c.links.discord`).
- Produces:
  - `ScheduleHero` default export, props `{ dateText: string }`
  - `DayHeader` default export, props `{ headingId: string; title: string; label: string; isFirst: boolean }`
  - `ScheduleFooter` default export, no props

- [ ] **Step 1: Create `ScheduleHero.tsx`**

```tsx
import Image from "next/image";
import { DRAGONS, HERO_ART } from "./assets";
import { SCHEDULE_COPY } from "./content";

type ScheduleHeroProps = {
	dateText: string;
};

// Tri Nguyen: Top of the page. Castle art, two floating dragons, the title copy, and the cloud bank that blends into the schedule.
// Tri Nguyen: Keep every z-index at z-20 or below so the MLH badge (z-50) always stays on top.
export default function ScheduleHero({ dateText }: ScheduleHeroProps) {
	const metaItems = [dateText, SCHEDULE_COPY.location, SCHEDULE_COPY.timezoneNote];

	return (
		<section
			aria-labelledby="schedule-title"
			className="relative h-[440px] lg:h-[520px]"
		>
			<Image
				src={HERO_ART.castle}
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			{/* Tri Nguyen: Parchment fade so the copy stays readable on top of the busy art. */}
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-b from-cq-parchment/5 via-cq-parchment/20 to-cq-parchment/55"
			/>

			<div
				aria-hidden
				className="absolute right-[3.5%] top-[70px] hidden aspect-[330/197] w-[23%] opacity-[0.92] motion-safe:animate-cq-float md:block"
			>
				<Image src={DRAGONS.plum} alt="" fill sizes="25vw" className="object-contain" />
			</div>
			<div
				aria-hidden
				className="absolute left-[10.4%] top-[150px] hidden aspect-[230/124] w-[16%] opacity-[0.85] motion-safe:animate-cq-float-slow md:block"
			>
				<Image src={DRAGONS.gold} alt="" fill sizes="16vw" className="object-contain" />
			</div>

			{/* Tri Nguyen: Soft glow behind the title, same radial fade as Figma. */}
			<div
				aria-hidden
				className="absolute left-1/2 top-[150px] h-[300px] w-[820px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(246,236,214,0.75),rgba(246,236,214,0))]"
			/>

			<div className="relative z-10 flex flex-col items-center gap-3 px-4 pt-[140px] text-center lg:pt-[180px]">
				<p className="font-grenze text-base font-semibold text-cq-plum motion-safe:animate-cq-rise">
					{SCHEDULE_COPY.eyebrow}
				</p>
				<h1
					id="schedule-title"
					className="font-gotisch text-7xl font-bold text-cq-title motion-safe:animate-cq-rise lg:text-[112px] lg:leading-none"
					style={{ animationDelay: "120ms" }}
				>
					{SCHEDULE_COPY.title}
				</h1>
				<p
					className="font-grenze text-xl font-medium text-cq-ink motion-safe:animate-cq-rise"
					style={{ animationDelay: "240ms" }}
				>
					{SCHEDULE_COPY.subtitle}
				</p>
				<ul
					className="flex flex-wrap items-center justify-center gap-3 font-grenze text-[15px] text-cq-muted motion-safe:animate-cq-rise"
					style={{ animationDelay: "360ms" }}
				>
					{metaItems.map((item, index) => (
						<li key={item} className="flex items-center gap-3">
							{index > 0 && (
								<span aria-hidden className="h-[5px] w-[5px] rounded-full bg-cq-gold" />
							)}
							{item}
						</li>
					))}
				</ul>
			</div>

			{/* Tri Nguyen: Cloud bank hangs 99px over the bottom of the hero, exactly like the Figma overlap. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-[calc(100%-99px)] z-10 h-[200px] lg:h-[280px]"
			>
				<Image
					src={HERO_ART.cloudBank}
					alt=""
					fill
					sizes="100vw"
					className="object-cover object-top"
				/>
			</div>
		</section>
	);
}
```

- [ ] **Step 2: Create `DayHeader.tsx`**

```tsx
import { cn } from "@/lib/utils/client/cn";
import Reveal from "./Reveal";

type DayHeaderProps = {
	headingId: string;
	title: string;
	label: string;
	isFirst: boolean;
};

// Tri Nguyen: Day title with the date as plain text beside it. The first day gets extra top space so it clears the hero cloud bank.
export default function DayHeader({
	headingId,
	title,
	label,
	isFirst,
}: DayHeaderProps) {
	return (
		<header
			className={cn(
				"relative z-20 mx-auto max-w-[1440px] px-6 pb-4 lg:px-[120px]",
				isFirst ? "pt-28 lg:pt-[111px]" : "pt-12",
			)}
		>
			<Reveal className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
				<h2
					id={headingId}
					className="font-gotisch text-5xl font-bold text-cq-plum lg:text-[60px]"
				>
					{title}
				</h2>
				<p className="font-grenze text-lg font-semibold text-cq-plum/85">
					{label}
				</p>
			</Reveal>
		</header>
	);
}
```

- [ ] **Step 3: Create `ScheduleFooter.tsx`**

```tsx
import c from "config";
import { SCHEDULE_COPY } from "./content";

// Tri Nguyen: Simple sand colored footer. The Discord link opens in a new tab with noopener so the new page cannot control this one.
export default function ScheduleFooter() {
	return (
		<footer className="bg-cq-sand">
			<div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-7 font-grenze text-[13px] sm:flex-row sm:items-center sm:justify-between lg:px-[120px]">
				<p className="text-cq-muted">{SCHEDULE_COPY.footerCopyright}</p>
				<a
					href={c.links.discord}
					target="_blank"
					rel="noopener noreferrer"
					className="font-medium text-cq-plum underline-offset-4 hover:underline"
				>
					{SCHEDULE_COPY.footerQuestion}
				</a>
			</div>
		</footer>
	);
}
```

- [ ] **Step 4: Type check**

Run: `pnpm --filter web exec tsc --noEmit 2>&1 | grep "schedule/sky" || echo "no sky errors"`
Expected: `no sky errors`.

- [ ] **Step 5: Format and commit**

```bash
pnpm exec prettier --write apps/web/src/components/schedule/sky/ScheduleHero.tsx apps/web/src/components/schedule/sky/DayHeader.tsx apps/web/src/components/schedule/sky/ScheduleFooter.tsx
git add apps/web/src/components/schedule/sky/ScheduleHero.tsx apps/web/src/components/schedule/sky/DayHeader.tsx apps/web/src/components/schedule/sky/ScheduleFooter.tsx
git commit -m "add sky schedule hero, day header, and footer"
```

---

### Task 7: Event clouds, winding path, decorations, timeline

**Files:**
- Create: `apps/web/src/components/schedule/sky/EventCloud.tsx`
- Create: `apps/web/src/components/schedule/sky/WindingPath.tsx`
- Create: `apps/web/src/components/schedule/sky/SkyDecorations.tsx`
- Create: `apps/web/src/components/schedule/sky/SkyTimeline.tsx`

**Interfaces:**
- Consumes: `buildSkyLayout`, `SkyLayout`, `LANE_WIDTH`, `CARD_WIDTH`, `CARD_HEIGHT` from `./sky-layout`; `formatTimeRange` from `./schedule-data`; `CLOUD_VARIANTS`, `SKY_DECORATIONS`, `HERO_ART`, `FINALE_LANDSCAPE` from `./assets`; `Reveal`; `useScrollDrawProgress`; `EventType`.
- Produces:
  - `EventCloud` default export, props `{ event: EventType; index: number; top: number; timezone: string }`
  - `WindingPath` default export, props `{ layout: SkyLayout }`
  - `SkyDecorations` default export, no props
  - `SkyTimeline` default export, props `{ events: EventType[]; timezone: string; showFinale: boolean }`

- [ ] **Step 1: Create `EventCloud.tsx`**

```tsx
import type { CSSProperties } from "react";
import Image from "next/image";
import type { EventType } from "@/lib/types/events";
import { cn } from "@/lib/utils/client/cn";
import { CLOUD_VARIANTS } from "./assets";
import Reveal from "./Reveal";
import { formatTimeRange } from "./schedule-data";
import { CARD_HEIGHT, CARD_WIDTH } from "./sky-layout";

type EventCloudProps = {
	event: EventType;
	index: number;
	top: number;
	timezone: string;
};

// Tri Nguyen: Converts Figma pixels inside a card into percentages so the card can shrink on smaller screens.
function toPercent(pixels: number, total: number): string {
	return `${(pixels / total) * 100}%`;
}

// Tri Nguyen: One event drawn on cloud art. Stacked on mobile, zigzagging left and right from the lg breakpoint up.
export default function EventCloud({ event, index, top, timezone }: EventCloudProps) {
	const cloud = CLOUD_VARIANTS[index % CLOUD_VARIANTS.length];
	const isLeft = index % 2 === 0;

	return (
		<Reveal
			className={cn(
				"relative mx-auto w-full max-w-[560px] lg:absolute lg:top-[var(--card-top)] lg:z-10 lg:mx-0 lg:w-[clamp(420px,38.9%,560px)]",
				isLeft ? "lg:left-[7%]" : "lg:right-[7%]",
			)}
			style={{ "--card-top": `${top}px` } as CSSProperties}
		>
			{/* Tri Nguyen: Negative delays stagger the bob so neighboring clouds never move in sync. */}
			<article
				className="relative motion-safe:animate-cq-bob"
				style={{
					aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
					animationDelay: `${(index % 3) * -2}s`,
				}}
			>
				<div
					aria-hidden
					className="pointer-events-none absolute"
					style={{
						left: toPercent(cloud.x, CARD_WIDTH),
						top: toPercent(cloud.y, CARD_HEIGHT),
						width: toPercent(cloud.width, CARD_WIDTH),
						height: toPercent(cloud.height, CARD_HEIGHT),
					}}
				>
					<Image
						src={cloud.src}
						alt=""
						fill
						sizes="(min-width: 1024px) 40vw, 100vw"
						className="object-fill"
					/>
				</div>

				<div className="absolute inset-y-0 left-[19%] right-[14%] flex flex-col justify-center gap-1.5">
					<p className="font-grenze text-lg font-semibold text-cq-plum lg:text-[22px]">
						<time dateTime={event.startTime.toISOString()}>
							{formatTimeRange(event.startTime, event.endTime, timezone)}
						</time>
					</p>
					<h3 className="font-gotisch text-2xl font-semibold leading-[1.15] text-cq-ink lg:text-[30px]">
						{event.title}
					</h3>
					{event.location && (
						<p className="font-grenze text-[15px] italic text-cq-muted">
							{event.location}
						</p>
					)}
				</div>
			</article>
		</Reveal>
	);
}
```

- [ ] **Step 2: Create `WindingPath.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { LANE_WIDTH, type SkyLayout } from "./sky-layout";
import { useScrollDrawProgress } from "./useScrollDrawProgress";

type WindingPathProps = {
	layout: SkyLayout;
};

// Tri Nguyen: Small gold spiral drawn next to each event marker.
const SWIRL_PATH =
	"M0 0c3-4 9-3 10 2s-4 10-10 9-11-8-8-15 13-11 20-6 10 15 4 21";

// Tri Nguyen: The cream road with two gold rope lines that winds between the clouds. It draws itself as you scroll.
export default function WindingPath({ layout }: WindingPathProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const progress = useScrollDrawProgress(svgRef);

	// Tri Nguyen: pathLength={1} lets one number control how much is drawn. Offset 1 hides it, 0 shows it all.
	const drawProps = {
		pathLength: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1 - progress,
	};

	return (
		<svg
			ref={svgRef}
			aria-hidden
			className="pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 lg:block"
			width={LANE_WIDTH}
			height={layout.height}
			viewBox={`0 0 ${LANE_WIDTH} ${layout.height}`}
			fill="none"
		>
			<path
				d={layout.path}
				className="stroke-cq-path"
				strokeOpacity={0.9}
				strokeWidth={44}
				strokeLinecap="round"
				{...drawProps}
			/>
			<path
				d={layout.path}
				transform="translate(-13 0)"
				className="stroke-cq-rope"
				strokeWidth={2}
				{...drawProps}
			/>
			<path
				d={layout.path}
				transform="translate(13 0)"
				className="stroke-cq-rope"
				strokeWidth={2}
				{...drawProps}
			/>

			{layout.markers.map((marker, index) => (
				<g key={`${marker.x}-${marker.y}`}>
					<circle cx={marker.x} cy={marker.y + 34} r={5} className="fill-cq-plum/70" />
					<g transform={`translate(${marker.x + (index % 2 === 0 ? 46 : -46)} ${marker.y - 14})`}>
						<path
							d={SWIRL_PATH}
							className="stroke-cq-gold motion-safe:animate-[spin_14s_linear_infinite]"
							strokeWidth={2}
							strokeLinecap="round"
							style={{ transformBox: "fill-box", transformOrigin: "center" }}
						/>
					</g>
				</g>
			))}
		</svg>
	);
}
```

- [ ] **Step 3: Create `SkyDecorations.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils/client/cn";
import { HERO_ART, SKY_DECORATIONS } from "./assets";

const FRAME_WIDTH = 1440;

// Tri Nguyen: Turns a Figma x or width (on a 1440 frame) into a percentage so art scales with the screen.
function toPercent(pixels: number): string {
	return `${(pixels / FRAME_WIDTH) * 100}%`;
}

// Tri Nguyen: Background art behind the event clouds. Purely decorative, so it is hidden from screen readers and only shown on large screens.
export default function SkyDecorations() {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
			<Image
				src={HERO_ART.windSwirls}
				alt=""
				width={FRAME_WIDTH}
				height={2440}
				unoptimized
				className="absolute left-0 top-0 h-auto w-full opacity-80"
			/>

			{SKY_DECORATIONS.map((decoration) => (
				<div
					key={`${decoration.src}-${decoration.top ?? decoration.bottom}`}
					className={cn("absolute", decoration.animationClass)}
					style={{
						left: toPercent(decoration.left),
						width: toPercent(decoration.width),
						aspectRatio: `${decoration.width} / ${decoration.height}`,
						top: decoration.top,
						bottom: decoration.bottom,
						opacity: decoration.opacity,
					}}
				>
					<Image src={decoration.src} alt="" fill sizes="25vw" className="object-contain" />
				</div>
			))}
		</div>
	);
}
```

- [ ] **Step 4: Create `SkyTimeline.tsx`**

```tsx
import type { CSSProperties } from "react";
import Image from "next/image";
import type { EventType } from "@/lib/types/events";
import { FINALE_LANDSCAPE } from "./assets";
import EventCloud from "./EventCloud";
import SkyDecorations from "./SkyDecorations";
import { buildSkyLayout } from "./sky-layout";
import WindingPath from "./WindingPath";

type SkyTimelineProps = {
	events: EventType[];
	timezone: string;
	showFinale: boolean;
};

// Tri Nguyen: One day of events. Large screens get the absolute positioned Figma layout. Small screens get a simple stacked list.
export default function SkyTimeline({ events, timezone, showFinale }: SkyTimelineProps) {
	const layout = buildSkyLayout(events.length);

	return (
		<div className="relative overflow-hidden">
			<div
				className="relative mx-auto max-w-[1440px] lg:h-[var(--sky-height)]"
				style={{ "--sky-height": `${layout.height}px` } as CSSProperties}
			>
				<SkyDecorations />
				<WindingPath layout={layout} />

				<ol className="flex flex-col gap-8 px-4 pb-16 lg:block lg:p-0">
					{events.map((event, index) => (
						<li key={event.id}>
							<EventCloud
								event={event}
								index={index}
								top={layout.cardTops[index]}
								timezone={timezone}
							/>
						</li>
					))}
				</ol>

				{/* Tri Nguyen: Castle and lake landscape that closes out the last day. Bleeds past the left edge just like Figma. */}
				{showFinale && (
					<div
						aria-hidden
						className="pointer-events-none relative ml-[-15.76%] w-[118.06%] lg:absolute lg:bottom-0 lg:left-0"
						style={{ aspectRatio: "1700 / 411" }}
					>
						<Image src={FINALE_LANDSCAPE} alt="" fill sizes="118vw" className="object-cover" />
					</div>
				)}
			</div>
		</div>
	);
}
```

- [ ] **Step 5: Type check and tests**

Run: `pnpm --filter web exec tsc --noEmit 2>&1 | grep "schedule/sky" || echo "no sky errors"` then `pnpm --filter web test`
Expected: `no sky errors`, then PASS, 19 tests.

- [ ] **Step 6: Format and commit**

```bash
pnpm exec prettier --write apps/web/src/components/schedule/sky/EventCloud.tsx apps/web/src/components/schedule/sky/WindingPath.tsx apps/web/src/components/schedule/sky/SkyDecorations.tsx apps/web/src/components/schedule/sky/SkyTimeline.tsx
git add apps/web/src/components/schedule/sky/EventCloud.tsx apps/web/src/components/schedule/sky/WindingPath.tsx apps/web/src/components/schedule/sky/SkyDecorations.tsx apps/web/src/components/schedule/sky/SkyTimeline.tsx
git commit -m "add sky schedule event clouds, path, and decorations"
```

---

### Task 8: Page entry, teammate README, and visual check

**Files:**
- Create: `apps/web/src/components/schedule/sky/SkySchedulePage.tsx`
- Create: `apps/web/src/components/schedule/sky/README.md`
- Temporarily modify (never commit): `apps/web/src/app/schedule/page.tsx`

**Interfaces:**
- Consumes: everything above; `getAllEvents` from `db/functions`; `Navbar` from `@/components/shared/Navbar`; `MLHBadge` from `@/components/landing/MLHBadge`; `c` from `config`.
- Produces: `SkySchedulePage` default export (async server component, no props).

- [ ] **Step 1: Create `SkySchedulePage.tsx`**

```tsx
import c from "config";
import { getAllEvents } from "db/functions";
import MLHBadge from "@/components/landing/MLHBadge";
import Navbar from "@/components/shared/Navbar";
import { SCHEDULE_COPY } from "./content";
import DayHeader from "./DayHeader";
import { grenze, grenzeGotisch } from "./fonts";
import ScheduleFooter from "./ScheduleFooter";
import ScheduleHero from "./ScheduleHero";
import { formatDayLabel, formatHeroDate, getDayTitle, groupEventsByDay } from "./schedule-data";
import SkyTimeline from "./SkyTimeline";

// Tri Nguyen: Server entry for the sky schedule. Reads events on the server, so hidden events never reach the browser.
// Tri Nguyen: Not routed yet. To go live, render <SkySchedulePage /> from apps/web/src/app/schedule/page.tsx.
export default async function SkySchedulePage() {
	const timezone = c.hackathonTimezone;
	const days = groupEventsByDay(await getAllEvents(), timezone);
	const firstStart = days[0]?.events[0]?.startTime;
	const heroDate = firstStart
		? formatHeroDate(firstStart, timezone)
		: SCHEDULE_COPY.dateFallback;

	return (
		<div
			className={`${grenze.variable} ${grenzeGotisch.variable} w-full overflow-x-hidden bg-cq-parchment font-grenze text-cq-ink`}
		>
			<Navbar />
			{/* Tri Nguyen: MLH season badge goes right after the navbar, same as the landing page. Nothing on this page goes above z-20 so it stays on top. */}
			<MLHBadge />

			<main>
				<ScheduleHero dateText={heroDate} />

				{days.length === 0 ? (
					<p className="relative z-20 px-6 pb-24 pt-32 text-center text-xl text-cq-muted">
						{SCHEDULE_COPY.emptyState}
					</p>
				) : (
					days.map((day, index) => {
						const headingId = `schedule-day-${day.dayKey}`;
						return (
							<section key={day.dayKey} aria-labelledby={headingId}>
								<DayHeader
									headingId={headingId}
									title={getDayTitle(index, days.length)}
									label={formatDayLabel(day, timezone)}
									isFirst={index === 0}
								/>
								<SkyTimeline
									events={day.events}
									timezone={timezone}
									showFinale={index === days.length - 1}
								/>
							</section>
						);
					})
				)}
			</main>

			<ScheduleFooter />
		</div>
	);
}
```

- [ ] **Step 2: Create `README.md`**

```markdown
# Sky Schedule

Storybook themed schedule page built from the Figma file "CodeQuantum 27 – Schedule" (frame "Schedule / Desktop — Storybook v4"). Written by Tri Nguyen.

## Where things live

- `SkySchedulePage.tsx` is the entry. It loads events on the server and builds the page.
- Change wording in `content.ts`.
- Change or swap art in `assets.ts`. Images are in `apps/web/public/img/schedule`.
- Change spacing of the cards and the path in `sky-layout.ts`.
- Date and time formatting is in `schedule-data.ts`.
- Colors and animations are the `cq` tokens in `apps/web/tailwind.config.js`.

## Events

Events come from the admin events page (`/admin/events`). Hidden events are filtered out on the server. Cloud art cycles through ten shapes, so any number of events works.

## Animations

Hero copy rises in, dragons float, clouds bob and fade in on scroll, and the path draws itself as you scroll. Everything respects "reduce motion" in the operating system settings.

## MLH badge

`<MLHBadge />` renders right after `<Navbar />`. Keep every z-index on this page at `z-20` or lower so the badge stays on top.

## Going live

Not routed yet. To ship it, make `apps/web/src/app/schedule/page.tsx` render `<SkySchedulePage />` and keep `export const revalidate = 60`.

## Tests

`pnpm --filter web test`
```

- [ ] **Step 3: Run tests and type check**

Run: `pnpm --filter web test` then `pnpm --filter web exec tsc --noEmit 2>&1 | grep "schedule/sky" || echo "no sky errors"`
Expected: PASS, 19 tests, then `no sky errors`.

- [ ] **Step 4: Temporarily route the page for a visual check (do not commit)**

Replace the body of `apps/web/src/app/schedule/page.tsx` with:

```tsx
import SkySchedulePage from "@/components/schedule/sky/SkySchedulePage";

export default function Page() {
	return <SkySchedulePage />;
}

export const revalidate = 60;
```

Run: `pnpm --filter web dev` and open `http://localhost:3000/schedule`. If the events table is empty, add a few events at `/admin/events/new` first.

Check, at 1440px width, side by side with Figma node `19:2`:
- Hero art, dragons, title, meta row with gold dots, cloud bank overlap.
- "Hack Day" title with the plain date line next to it, clear of the clouds.
- Cards zigzag left and right, the path winds between them, and the finale landscape sits at the bottom.
- The MLH badge shows at the top right, above the hero dragon.
- Scroll: cards fade up, the path draws, dragons and small clouds move.
- With macOS "Reduce motion" on, nothing animates and everything is visible.
- At 390px width: cards stack in one column, no horizontal scroll.

- [ ] **Step 5: Restore the route**

Run: `git checkout -- apps/web/src/app/schedule/page.tsx && git status --short apps/web/src/app`
Expected: no output from `git status`.

- [ ] **Step 6: Format and commit**

```bash
pnpm exec prettier --write apps/web/src/components/schedule/sky/SkySchedulePage.tsx apps/web/src/components/schedule/sky/README.md
git add apps/web/src/components/schedule/sky/SkySchedulePage.tsx apps/web/src/components/schedule/sky/README.md
git commit -m "add sky schedule page entry and readme"
```
