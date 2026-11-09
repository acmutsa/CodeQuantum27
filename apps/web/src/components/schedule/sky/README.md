# Sky Schedule

Storybook themed schedule page built from the Figma file "CodeQuantum 27 – Schedule" (frame "Schedule / Desktop — Storybook v4"). Written by Tri Nguyen.

## Where things live

-   `SkySchedulePage.tsx` is the entry. It loads events on the server and builds the page.
-   Change wording in `content.ts`.
-   Change or swap art in `assets.ts`. Images are in `apps/web/public/img/schedule`.
-   Change spacing of the cards and the path in `sky-layout.ts`.
-   Date and time formatting is in `schedule-data.ts`.
-   Colors and animations are the `cq` tokens in `apps/web/tailwind.config.js`.

## Events

Events come from the admin events page (`/admin/events`). Hidden events are filtered out on the server. CodeQuantum is one day, so every visible event is shown under a single "Hack Day" heading (`buildHackDay` in `schedule-data.ts`). Cloud art cycles through ten shapes, so any number of events works.

## Castle finale

`FinaleTransition.tsx` is the bottom of the page: a flipped cloud bank fades in over the castle landscape and a wind swoosh with a gold dashed line flows across it. The path ends inside the swoosh, which is set by `FINALE_SPACE` and `PATH_END_LIFT` in `sky-layout.ts`.

## Animations

Hero copy rises in, dragons float, clouds bob and fade in on scroll, the path draws itself as you scroll, and the castle clouds swoosh in when you reach the bottom. Everything respects "reduce motion" in the operating system settings.

## MLH badge

`<MLHBadge />` renders right after `<Navbar />`. Keep every z-index on this page at `z-20` or lower so the badge stays on top.

## Going live

Not routed yet. To ship it, make `apps/web/src/app/schedule/page.tsx` render `<SkySchedulePage />` and keep `export const revalidate = 60`.

## Tests

`pnpm --filter web test`
