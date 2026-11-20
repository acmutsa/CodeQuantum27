# Hacker Class Cards — Design

Figma: file `9oqlic9CAVJ4uHbB8vb1C1`, page `Cards` (60:2). Code comes after Tri reviews the Figma.

## Goal
A hacker pass in the storybook schedule style, themed by class (Knight, Wizard, Archer), with a QR code volunteers scan for food and event check-ins. Mobile and desktop.

## Class source
Classes replace the placeholder `groups` in `packages/config/hackkit.config.ts`. The card reads the hacker's group like the current pass (`apps/web/src/app/dash/pass/page.tsx`).

## Themes
| Class  | Accent              | Crest           | Motto            | Dragon   |
|--------|---------------------|-----------------|------------------|----------|
| Knight | crimson + steel     | shield + sword  | "Hold the line." | chestnut |
| Wizard | plum + violet       | staff + moon    | "Bend the code." | plum     |
| Archer | forest green + gold | bow + arrow     | "Never miss."    | gold     |

Shared base: cream parchment, plum ink text, gold accents, Grenze Gotisch (display) + Grenze (body), same as the schedule.

## Card layout (quest scroll)
The pass is an old quest scroll: rolled parchment ends top and bottom with class-colored knobs, aged parchment body (edge burn inner shadow), and a wax seal in the class color pressed on the bottom roll. Class shades stay on the crest wash, chip, footer band, seal, knobs, and QR border.

1. Header lettering "✦ CodeQuantum 27 · Quest Pass ✦" in the class accent, no solid bar.
2. Class crest art (generated shield, 176px) as the hero, faint class dragon behind it, round profile photo (62px, gold ring) overlapping the crest's lower right.
3. First name (Grenze Gotisch ~40px), `@hackerTag`, class title (e.g. "Knight of the Realm").
4. Motto in Grenze italic.
5. Gold flourish divider (line, leaves, center diamond).
6. QR stub: dark plum QR on flat cream, quiet zone, ~220px on mobile, caption "Show at food & event check-ins". No texture behind the QR.
7. Footer: event date + location on the left, wax seal on the right.

## Frames
- Mobile 390×844 ×3 (one per class): card fills the width, QR at thumb height.
- Desktop 1440×900 ×3: sky / peaks / clouds background with the class dragon; card on the left, parchment panel on the right with class lore and a static "Quest log" mock of check-ins.
- A `Hacker Card` component with `Class` (Knight, Wizard, Archer) and `Crest` (Simple, Detailed) variants. Screens use `Crest=Simple`: flat line-art shield like the schedule clouds, plain tint behind it. `Crest=Detailed` keeps the engraved crest with the faint dragon.

## Rules (UI/UX Pro Max review)
- Text contrast 4.5:1 or better; QR is dark on light with a quiet zone.
- Tap targets 44px or larger (enlarge-QR tap).
- Decorative motion (floating dragon) respects reduced motion.
- Check at 375 and 1440 widths.

## Assets
Generated crest emblems in the ink-sketch style of the schedule art; reuse existing dragons, clouds, peaks from `apps/web/public/img/schedule`. Fallback: vector crests drawn in Figma.
