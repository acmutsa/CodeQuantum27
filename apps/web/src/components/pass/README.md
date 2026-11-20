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
