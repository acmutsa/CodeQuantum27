# Sky Schedule

Storybook themed schedule page built from the Figma file "CodeQuantum 27 – Schedule" (frame "Schedule / Desktop — Storybook v4"). Written by Tri Nguyen.

## Where things live

-   `SkySchedulePage.tsx` is the entry. It loads events on the server and builds the page.
-   Change wording in `content.ts`, including the date line next to "Hack Day".
-   Change or swap art in `assets.ts`. Images are in `apps/web/public/img/schedule`.
-   Change spacing of the cards and the path in `sky-layout.ts`.
-   Card time formatting and the 10 event limit are in `schedule-data.ts`.
-   Colors and animations are the `cq` tokens in `apps/web/tailwind.config.js`.

## Events

Events come from the admin events page (`/admin/events`). Hidden events are filtered out on the server. CodeQuantum is one day, so visible events are shown under a single "Hack Day" heading (`buildHackDay` in `schedule-data.ts`). Like Figma v4, the page shows at most 10 events, one per cloud shape (`MAX_HACK_DAY_EVENTS`). Events after the 10th by start time are not shown, so keep the schedule to 10 events or raise that number.

## Castle finale

`FinaleTransition.tsx` is the castle and lake landscape at the bottom of the page, matching Figma v4. The path runs behind the mountains and ends at the castle. That spacing is set by `FINALE_SPACE` and `PATH_END_LIFT` in `sky-layout.ts`.

## Animations

Hero copy rises in, dragons float, clouds bob and fade in on scroll, the path draws itself as you scroll, finishing at the castle when you reach the bottom. Everything respects "reduce motion" in the operating system settings.

## MLH badge

`<MLHBadge />` renders right after `<Navbar />`. Keep every z-index on this page at `z-20` or lower so the badge stays on top.

## Cursor

`<ThemedCursor weapon="sword" />` replaces the mouse cursor with a sword that slices on every click, like an attack in a game, and flashes a 4 frame slash sprite (`sword-slash.svg`, frames are 64px wide side by side). Change `weapon` to `"staff"` in `SkySchedulePage.tsx` for the magic staff, which casts and bursts into sparks. Art lives in `apps/web/public/img/cursor/` and sizes and hotspots live in `cursor-weapons.ts`. The cursor layer is `z-[9999]`, the one exception to the z-20 rule, and it is `pointer-events-none`. With "reduce motion" the cursor is still replaced but nothing animates. Touch and coarse pointers keep the normal cursor and render nothing.

## Going live

Not routed yet. To ship it, make `apps/web/src/app/schedule/page.tsx` render `<SkySchedulePage />` and keep `export const revalidate = 60`.

## Tests

`pnpm --filter web test`
