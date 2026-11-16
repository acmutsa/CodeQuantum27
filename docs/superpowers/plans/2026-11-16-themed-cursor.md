# Themed Cursor (Sword + Staff) Plan

Goal: replace the mouse cursor on the sky schedule page with a medieval sword that swings when you click. Also ship a magic staff cursor (casts a spark burst when you click) as a second option, but the page uses the sword for now.

Branch: `tree/sword-cursor` (off `tree/schedule`). PR into `dev`.

## Global Constraints

- Palette (Tailwind `cq` tokens in `apps/web/tailwind.config.js`): plum `#68396B`, ink `#3D2340`, title `#4E2B4F`, muted `#6E5270`, gold `#D7A33D`, parchment `#F6ECD6`, sand `#EBDDBF`, path `#FFFDF3`, rope `#E2CC9C`. Storybook / illuminated-manuscript look: ink outlines, flat fills, a little highlight.
- Assets live in `apps/web/public/img/cursor/` as hand-written SVG (no external tools, no raster).
- Cursor art is drawn pointing up-left like a normal arrow cursor: the sword TIP and the staff ORB TOP are at the top-left of the image, so the hotspot is the tip.
- Code comments are tagged `// Tri Nguyen: ...`, plain sentences, no `----` divider lines. Match the existing sky components' style (tabs, double quotes).
- Commits: short imperative lowercase subject, no prefix (e.g. "add sword and staff cursor art"). NEVER add a `Co-Authored-By` line, any AI/Claude attribution, or "Generated with Claude Code" to commits or PR text.
- Do not touch or commit the user's unrelated uncommitted changes: `.gitignore`, `apps/web/src/app/schedule/page.tsx`, `docs/`. Stage only your own files by explicit path.
- Keep every page z-index at `z-20` or lower EXCEPT the cursor layer, which is `pointer-events-none` and must sit above everything (MLH badge included).
- Respect `prefers-reduced-motion`: cursor still replaced, but no swing/burst animation.
- Only replace the cursor on devices with a fine pointer that can hover (`(hover: hover) and (pointer: fine)`). Touch devices keep default behavior and render nothing.

## Task 1: Cursor art

Create these SVGs in `apps/web/public/img/cursor/`:

1. `sword.svg` — viewBox `0 0 48 48`. Diagonal longsword, tip at about (3,3), pommel toward bottom-right. Steel blade (light grey/white `#FFFDF3` with a fuller line), gold `#D7A33D` crossguard, plum `#68396B` wrapped grip, gold pommel. Ink `#3D2340` outline ~1.5px so it reads on parchment AND on the dark plum navbar (add a thin parchment/white outer halo stroke under the ink stroke for contrast).
2. `staff.svg` — viewBox `0 0 48 48`. Diagonal wizard staff, glowing orb/crystal at top-left (orb top around (3,3)), wooden shaft (warm brown with ink outline) to bottom-right, gold bands/claws holding a plum-and-gold crystal. Same halo + ink outline treatment.
3. `sword-slash.svg` — viewBox `0 0 64 64`. A crescent slash arc (the swoosh left behind by a sword swing): tapered crescent, path/parchment white with gold edge, transparent background. Used as a short-lived click effect.
4. `staff-spark.svg` — viewBox `0 0 64 64`. A magic burst: central 4-point star plus a ring of small sparkles/dots in gold and plum. Used as a short-lived click effect.

Each file under 3 KB, valid standalone SVG with `xmlns`, no scripts, no external refs. Verify each renders by opening it (e.g. convert with `qlmanage -t` or `rsvg-convert` if available, otherwise just xmllint --noout). Commit: "add sword and staff cursor art".

## Task 2: ThemedCursor component and wiring

1. `apps/web/src/components/schedule/sky/cursor-weapons.ts` — exports `type CursorWeapon = "sword" | "staff"` and `CURSOR_WEAPONS: Record<CursorWeapon, { src: string; effectSrc: string; size: number; hotspotX: number; hotspotY: number; clickAnimation: string; effectAnimation: string; effectSize: number }>` with paths from Task 1 (`/img/cursor/...`), size 40 (px rendered), hotspot matching the tip in rendered pixels, Tailwind animation class names from step 3. Also export a pure helper `cursorTransform(x: number, y: number, weapon: CursorWeapon): string` returning `translate3d(${x - hotspotX}px, ${y - hotspotY}px, 0)`.
2. `apps/web/src/components/schedule/sky/cursor-weapons.test.ts` (vitest, same style as `sky-layout.test.ts`): hotspot inside the rendered box for each weapon; `cursorTransform` math; every `src`/`effectSrc` file exists under `apps/web/public`.
3. Tailwind keyframes/animations in `apps/web/tailwind.config.js` next to the other `cq-*` ones, each with a `// Tri Nguyen:` comment:
   - `cq-sword-swing` (~280ms): rotate around the grip from 0 → -40deg (wind up) → 25deg (strike) → 0. Transform origin at the pommel (bottom-right) — set via the element's `origin-[...]` class.
   - `cq-staff-cast` (~320ms): small tilt back then forward with a brief scale 1.1 pulse.
   - `cq-slash` (~350ms): effect fades in, scales 0.6 → 1.15, rotates slightly, fades out.
   - `cq-spark` (~450ms): effect scales 0.3 → 1.4, rotates 45deg, fades out.
4. `apps/web/src/components/schedule/sky/ThemedCursor.tsx` — `"use client"`, props `{ weapon?: CursorWeapon }` default `"sword"`.
   - On mount, only if `matchMedia("(hover: hover) and (pointer: fine)")` matches: add class `cq-themed-cursor` to `document.documentElement`; remove on unmount. Listen to `pointermove` on window and write `style.transform = cursorTransform(...)` directly to a ref (no React state per move; batch with requestAnimationFrame). Hide the layer until the first move and when the pointer leaves the window (`document` `pointerleave`/`mouseout` with no relatedTarget), show again on move.
   - On `pointerdown` (primary button): restart the weapon's click animation (remove class, force reflow or toggle a key, re-add) and spawn an effect `<img>` at the click point (centered on the hotspot) that removes itself on `animationend`. Keep at most a few effects alive (state array capped, e.g. 6). Skip both when `prefers-reduced-motion: reduce`.
   - Render a `fixed left-0 top-0 pointer-events-none z-[9999]` layer with `aria-hidden`. Use plain `<img>` (decorative, `alt=""`, `draggable={false}`); follow existing repo lint rules (check how other sky components render images and match).
5. `apps/web/src/app/globals.css`: `.cq-themed-cursor, .cq-themed-cursor * { cursor: none !important; }` with a Tri Nguyen comment.
6. Render `<ThemedCursor weapon="sword" />` inside `SkySchedulePage.tsx` (comment: switch to `"staff"` for the magic staff).
7. README.md in the sky folder: short "Cursor" section (what it does, how to switch to staff, where the art lives, the z-index exception, reduced motion/touch behavior).
8. Run `pnpm --filter web test` and `pnpm --filter web exec tsc --noEmit` (or the repo's typecheck); report output. Commit: "add sword cursor with swing animation to sky schedule".
