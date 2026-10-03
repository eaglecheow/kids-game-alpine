# Sunny Park implementation verification

Verified on 3 October 2026 in the Codex in-app browser on macOS. Implementation follows
[the Park design](../design_docs/park-design.md) and [feature plan](../design_docs/park-feature-plan.md).

## Delivered behavior

- Three Park mysteries reuse Baker Ben, Professor Hamster, and Pip the Pigeon.
- Route, sorting, and picture reconstruction are reusable, data-driven puzzle types. Each
  appears in every case at Junior, Detective, and Master: 27 authored configurations.
- Park requires all three Bakery completions; its mysteries unlock in order. Continue resumes
  the existing session, and Case Files includes both locations.
- Explicit notebook commits reveal discoveries and update the scene. The final repair action
  commits completion and one-time rewards together. All three repairs accumulate on Park visits.
- Three new decorations can be equipped in their supported slots. Existing Bakery IDs, rewards,
  save key, and version-1 saved shape are retained; no dependencies or extra repair flags were added.

## Automated checks

| Check                                        | Result                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `npm test`                                   | 21 tests passed.                                                              |
| `npm run lint`                               | Passed.                                                                       |
| `npm run build`                              | Passed TypeScript and Vite; Workbox generated a 25-entry precache.            |
| Prettier check of changed TypeScript and CSS | Passed.                                                                       |
| `git diff --check`                           | Passed.                                                                       |
| Park SVG assets                              | All ten parse as XML, exist in production output, and appear in the precache. |

Tests cover all 27 Park configurations, stable core IDs and character references, alternate
routes, checkpoint order, complete sorting assignments, tile identity/orientation, malformed
submissions, unlock prerequisites, one-time/full-adventure rewards, original Bakery economy,
old saves, Park round trips, difficulty changes, and corrupt/future-save handling.

## Browser checks

| Flow                            | Observed result                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fresh save                      | Park locked at 0/3 Bakery completions; Case Files includes six mysteries.                                                                                                                                                                                                                                       |
| Real pre-expansion save upgrade | Completed all Bakery cases in the previous production build, equipped the Cookie trophy, then updated its worker on the same origin. Nickname, nine stars, 150 coins, completion IDs, and equipment survived; Park opened.                                                                                      |
| Wrong Bench, Junior             | Completed all three engines. Route, sorting, reconstruction, and conclusion retries preserved progress and offered supportive feedback. Explicit commits updated notebook/evidence and the scene. Repair granted three stars and 40 coins.                                                                      |
| Saved Park update               | Left after a committed discovery, reloaded through another worker update, and resumed that discovery. Requesting a Bakery replay while this session was open returned to the Park investigation.                                                                                                                |
| Flower Signs, Detective         | Completed the two-stop route, six-object sort, and four-piece rotated picture. Undo, return-object, and rotation after placing a fragment worked. Repair retained the picnic and granted three stars and 50 coins.                                                                                              |
| 320-pixel viewport              | Route cells measured approximately 47.8 pixels square. Dialog client and scroll widths matched, with no horizontal overflow. Labelled inspection buttons replace overlapping scene hotspots on narrow screens; reconstruction remained readable.                                                                |
| Kite Tails, Master              | Completed the three-stop route, eight-object sort, and six-piece rotated picture; collected all six clues and deduced the correct explanation. Repair retained the other two repairs and granted three stars and 60 coins.                                                                                      |
| Cached production               | After the final worker activated, stopped the preview server, reloaded, resumed Kite Tails, loaded its picture artwork, and completed the case. Then replayed Wrong Bench while the server remained stopped. This verifies cached play with the origin unavailable; the OS network connection was not disabled. |
| Replay                          | Wrong Bench restored only its own mystery; flowers and kite tails stayed repaired. Completing the replay granted zero stars and zero coins, with no duplicate room treasure.                                                                                                                                    |
| Final persistence and equipment | Reload retained all six completions, 18 stars, 300 coins, stickers, and decorations. Equipped the pennant, flowerpot, and kite mobile without a purchase charge; the Cookie trophy stayed equipped.                                                                                                             |
| Keyboard controls               | Activated route cells, sorting objects/trays, reconstruction selection/place/remove/rotate, and answer/commit buttons with Enter during the playthroughs. Controls use native buttons with labels, visible focus rules, and status messages.                                                                    |
| Focus and browser errors        | Native Tab navigation produced a visible solid focus outline. Final browser error/warning log was empty.                                                                                                                                                                                                        |

The preview server was restarted after the cached-play check. A completed Park view is recorded
in [the screenshot](park-completed.jpg).

## Story review and remaining release checks

Reviewed each actual case against the mandatory story guide checklist and No-Dialogue Test:
the goal is to prepare the picnic; the player investigates, makes visible discoveries, chooses
an evidence-based explanation, and performs the repair. Ben delivers, Hamster organizes, and
Pip tidies; mistakes are harmless. Dialogue stays brief, retries have no penalty, and repairs
provide clear achievements. Empty basket space, mismatched flower symbols, empty kite loops,
route markers, physical evidence pictures, and repaired scenes convey the objectives visually.
This is an implementation review, not an observed child-comprehension result.

Physical touch-device interaction, target-age playtesting, case-duration measurements, assistive
screen-reader use, full contrast auditing, installation, OS-level network disconnection, and
live reduced-motion emulation were not performed. Reduced-motion rules and static discovery
states were inspected in source. These checks remain for release; browser viewport testing
does not establish physical-device behavior.

## Touch picture-puzzle redesign

The picture board and piece tray now sit beside each other. Pointer-based dragging supports
touch, mouse, and pen, with a lifted preview, highlighted destinations, and a small drop margin.
Board pieces swap when dropped onto each other; replacing a board piece from the tray returns
the displaced piece to the tray. Drops outside the workspace and cancelled gestures preserve
the board. Rotate and Return use large labelled buttons; selecting a piece and activating an
empty square provides a tap/keyboard alternative. Puzzle answers, rewards, and saves are unchanged.

`npm test` passes all 36 tests, including 11 placement checks for movement, swaps, orientation,
replacement, invalid destinations, and immutability. Lint, TypeScript/Vite production build,
Prettier, and `git diff --check` pass. The updated production precache includes 26 entries.

The final production preview also passed a Chromium offline check: after service-worker
activation, disabling the browser context's network and reloading served the app from the
worker. Park picture placement, rotation before and after placement, and mouse dragging worked.
All six picture SVG variants and the Park scene decoded offline, with no console errors,
failed requests, or HTTP errors.

Trusted Chromium touch events verified tray-to-board drops, rotation after dropping, tapping an
empty square after a drag, swaps that retain orientation, returning pieces to the tray, and
replacing occupied squares. Releasing outside the workspace and OS-style touch cancellation
both kept the original arrangement. These are browser-emulated touch checks; physical-device
testing remains a release check.

All nine picture/difficulty combinations were completed through the keyboard controls. Escape
cancelled an active drag without closing the puzzle. Junior omitted rotation; Detective used
four pieces and Master used six. At 320px, no horizontal overflow occurred and the smallest
piece target measured 50.9px. The 390px phone and desktop layouts also passed. Browser runtime
errors were absent. Screenshots show the [320px Master layout](park-touch-mobile.png) and
[active touch drag](park-touch-drag.png).

The existing illustrated evidence and player-led discoveries are preserved. The side-by-side
pieces and empty picture squares retain the visible assembly goal required by the story guide's
No-Dialogue Test; hints and story outcomes are unchanged.
