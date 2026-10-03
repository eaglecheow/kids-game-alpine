# Sunny Park Feature Plan

Deliver the [Sunny Park Design](park-design.md) as one extension of the existing Bakery game:
three new cases, three reusable puzzle engines, and a coherent Park scene. This plan describes
the implemented scope and acceptance checks. Physical-device interaction and child playtesting
remain release checks; implementation verification is recorded in [Park verification](../artifacts/park-verification.md).

## Pre-expansion behavior and design decisions

Before this expansion, the [game model](../src/game.ts) returned three Bakery cases from `casesFor(difficulty)`.
`Puzzle` supported number, sequence, and choice. Unlock order explicitly named the Bakery IDs.
The [app](../src/App.tsx) used Bakery-specific case lists, scene art, labels, thumbnails, and back
navigation. Its town-map handler sent any unlocked non-Bakery location to the clubhouse, so
changing Park's locked flag alone would open the wrong page.

The [save loader](../src/storage.ts) derives recognized cases, clues, puzzles, and decorations
from the current catalog. It stores one active session and schema version 1. New content can
retain that schema if the persistent fields and existing IDs stay the same.

| Decision | Planned behavior |
| --- | --- |
| Park availability | All three Bakery completion IDs are required; Park case 2 requires Park case 1, and case 3 requires case 2. |
| Case catalog | `casesFor(difficulty)` returns all six cases; location filtering occurs only in views. |
| Existing content | Preserve every Bakery case, clue, puzzle, decoration ID, answer, and reward. |
| New content | Three Park cases, nine puzzle instances, and three reward decorations. |
| Engines | Extend the existing union with `route`, `sort`, and `tiles`; reuse its feedback and notebook flow. |
| Save state | Keep one session with `caseId`, `clues`, `solved`, and `introSeen`; puzzle drafts remain temporary. |
| Scene state | Derive repairs from completion IDs and current discoveries from session solved IDs. |
| Runtime | Keep React, TypeScript, native controls, SVG/CSS, local data, and existing PWA tooling. |

These decisions define the implementation scope. Gameplay tuning should be based on testing the first
complete Park case; no new dependencies or general content-authoring system are needed.

## Data and validation contracts

### Location and clues

Add a two-value location field, `bakery` or `park`, to `GameCase` and set it on all six definitions.
Use a small location record for display name, base scene asset, and alternative text. Keep
prerequisites explicit in the existing unlock helper; the map and case buttons must consult the
same policy. Park eligibility checks all three Bakery IDs, including for a partially populated
save rather than assuming the last ID proves the others.

Park clues need hotspot coordinates tied to their actual illustrated objects and an optional
post-solve discovery text. Extend `Clue` with those content fields; retain Bakery's current
coordinate fallback and wording. No extra saved field is needed: a linked solved puzzle ID
selects the discovery text in both notebook and evidence review.

Add an optional case repair-button label for the three Park actions. Bakery keeps its existing
"Collect my rewards" label. The Park action uses the existing completion/reward handler, committing
the repair and reward in the same player update; the rewards view uses the retained last case ID
to show the completed scene after the active session is cleared.

Keep separate catalog data and temporary puzzle submissions. Answer validation switches on the
puzzle discriminant; do not serialize new puzzle drafts into the player save.

| Engine | Definition fields beyond shared ID, title, question, hint, and success | Submission | Required checks |
| --- | --- | --- | --- |
| `route` | Grid dimensions, blocked cell IDs, start/end IDs, ordered checkpoint IDs, cell landmarks, and a canonical valid example | Ordered array of cell IDs | Known cells, correct start/end, orthogonal adjacency, no blocked/repeated cells, all checkpoints in order. Alternative valid routes pass. |
| `sort` | Object IDs and accessible attributes, tray IDs and displayed rules, target tray per object | Object ID to tray ID mapping | Exact required object set, known tray IDs, complete correct assignment; ordering is irrelevant and a tray may correctly be empty. |
| `tiles` | Board rows/columns, tile IDs and visual/accessible edge descriptions, target tile per slot, accepted quarter-turns, rotation enabled | Row-major placements containing tile ID and quarter-turn count | Exact slot count, known unique tile IDs, complete board, correct slot and accepted orientation. |

The pre-expansion `validateAnswer()` parameter accepted only `number | string[]`. Extend it
with the necessary mapping and tile-placement shapes and narrow inside each branch. Retain
existing numeric finiteness and exact sequence checks. `Puzzle.tsx` must build the submission
explicitly for each type; its former fallback treated unrecognized types as number input.

### Reference fixtures

These small examples make the new validators reviewable. They are reference fixtures, not the
final authored board for every case.

Route fixture: a 4 × 4 kite-trail board, with start at `r1c1`, checkpoint at `r2c2`, destination
at `r4c4`, and blocked cells `r1c3`, `r2c1`, `r2c3`, `r4c2`:

```text
S . # .
# A # .
. . . .
. # . E
```

Both of these submissions pass:

```text
r1c1 → r1c2 → r2c2 → r3c2 → r3c3 → r4c3 → r4c4
r1c1 → r1c2 → r2c2 → r3c2 → r3c3 → r3c4 → r4c4
```

A jump from `r1c2` to `r3c2`, a blocked cell, a revisited cell, or an omitted checkpoint fails.
No shortest-route preference applies.

Sorting fixture: `butterfly-tag-a` and `butterfly-tag-b` go into `butterfly`, `sunflower-tag` into
`sunflower`, and `acorn-tag` into `acorn`. A correct full mapping passes regardless of input
key order. A missing tag, unknown tag, unknown tray, or misplaced tag fails.

Tile fixture: four unique fragments fill a 2 × 2 board in row-major order: `gate-corner`,
`arrow-head`, `post-base`, `bench-corner`, each at zero quarter-turns. Swapping two fragments,
repeating a fragment, leaving a slot empty, or rotating the asymmetric arrow incorrectly fails.
Accepted turn lists handle intentional symmetry. Junior's controls do not offer rotation and
its supplied tile orientations must already be valid.

## Delivery sequence

| Phase | Work | Dependency | Done when |
| --- | --- | --- | --- |
| 1 | Location routing, catalog membership, unlock policy, and save regression checks | Design defaults above | Both location pickers work; Bakery progress survives; Park opens from eligible saved completions. |
| 2 | Three new engine validators and accessible views | Phase 1 data conventions | Reference fixtures and malformed submissions behave correctly; all operations work with buttons and keyboard. |
| 3 | Wrong Bench vertical slice with art, discovery text, conclusion, repair, and reward | Phases 1–2 | One complete Park case works at all three levels and passes the story review and offline browser check. |
| 4 | Flower Signs and Kite Tails using the same engines | Phase 3 interaction lessons | All nine instances are authored; each case has sufficient Junior evidence and a visible player-led resolution. |
| 5 | Full progression, replay, rewards, responsive polish, documentation, and release checks | Phase 4 | All six cases pass regression checks and the device, accessibility, and production-offline checks below. |

Do not assign calendar estimates before the first complete case exposes artwork and interaction
costs. Use these phases as implementation units; they describe dependencies rather than separate
new systems.

## Feature backlog and acceptance criteria

### Park entry and case navigation

**Files:** `src/game.ts`, `src/App.tsx`, `src/game.test.ts`.

- Add Park as an explicit destination. Fix the map dispatch so Park opens its case picker.
- Bakery shows only Bakery cases; Park shows only Park cases; Case Files shows all six with
  location labels. Shared investigation, notebook, reveal, and rewards remain reusable.
- Derive case headings, scene alternative text, local case numbering, and "Leave & save"
  destination from the active case's location.
- Replace hardcoded three-case totals and Bakery-only replay/completion labels with values from
  the relevant catalog. A new save says zero of six total mysteries and zero of three per location.
- Prefer the active case for Continue; otherwise feature the first unlocked unfinished case.
  When all six are complete, offer a correctly labelled replay.
- A locked Park marker explains "Solve the three Bakery mysteries to visit Sunny Park" and
  shows progress. Completing the third Bakery case changes its state automatically.
- An existing active Bakery or Park session resumes when another case is requested, using its
  correct location and scene. Browsing a picker does not start or discard a mystery.

### Reusable puzzle controls

**Files:** `src/game.ts`, `src/components/Puzzle.tsx`, `src/styles.css`, `src/game.test.ts`.

- Add the three discriminants and shared answer type. Keep the existing three engines intact.
- Route: selectable start/adjacent cells, path state, Undo, and Reset. Sort: selected object and
  tray buttons, visible placements, and the ability to move an object back. Tiles: selectable
  fragment/slot, Place, Remove, and quarter-turn Rotate where enabled.
- Reuse hints, supportive retries, success announcements, and the explicit notebook commit.
  Wrong answers preserve drafts; uncommitted drafts reset on close/reopen or difficulty change.
- Controls have descriptive accessible names, visible focus, at least 44-pixel touch targets,
  and operation without dragging, sound, color alone, or time pressure.
- Keep per-type view code in `Puzzle.tsx` initially. Extract a view only if its size makes the
  shared shell hard to read; do not create a registry, plugin system, or generic puzzle factory.

### Mystery content and evidence

**Files:** `src/game.ts`, `src/App.tsx`, `src/game.test.ts`, `design_docs/park-design.md`.

- Author the nine stable puzzle IDs listed in the design, with one instance of each engine in
  each case. Provide all three difficulty variants: 27 authored puzzle configurations.
- Provide 4/5/6 clue definitions per case and use only `ben`, `hamster`, and `pip`. Keep the
  four core clue IDs and all puzzle IDs stable across difficulty.
- Add unique case and clue IDs exactly as specified. Check puzzle-to-clue references, conclusion
  indices, decoration references, and that each supplied answer/example is valid.
- Keep all stations accessible in any order. Their independent artifacts must not contradict
  one another or require a hidden prerequisite.
- Show raw observations before a linked puzzle is committed, and discovered facts afterward.
  The notebook and conclusion evidence board use the same rule.
- Preserve the current UI readiness check for every rendered clue and all three puzzles.
  `completeCase()` currently validates matching/unlocked session and solved puzzles; it does
  not independently validate the child's chosen conclusion. Keep the existing successful
  conclusion → reveal → reward flow rather than claiming the helper checks that choice.
- Apply the story guide checklist and No Dialogue Test to each case's actual screens. Final
  reveal text confirms the evidence and gives the child the repair action described in the design.

### Park artwork and visible discoveries

**Files:** `public/park-scene.svg`, `src/App.tsx`, `src/styles.css`, optionally a small
`src/components/ParkScene.tsx` for the scene's overlays.

- Create one local SVG base scene with the gate, two distinct benches, flowerbeds, and low craft
  table. Place hotspots on their illustrated objects, rather than using Bakery's index coordinates.
- Create three case thumbnails showing the empty picnic spot, mismatched flower signs, and
  missing kite tails. Park cases must not use Bakery's cookie/cupcake/recipe thumbnails.
- Supply three assembly pictures: original direction sign, master planting map, and kite-making
  picture. Use a fixed grid crop per tile and existing SVG/CSS; no new image library is required.
- Include sorting object/tray symbols and route landmarks. Reuse these shapes in clue cards and
  scene art. Document fragment edge descriptions alongside their definitions.
- Show the three small wins for each case and the three cumulative repairs. Static equivalents
  must convey the same discoveries with reduced motion or sound disabled.
- Completing the correct deduction offers the labelled repair action in the reveal. That action
  commits completion and rewards together and opens rewards showing the repaired scene. Do not
  add a separate repair flag or later claim step, or require a modal to retain a committed discovery.
- Replays override only the active case's repair for its investigation view; ordinary Park visits
  still derive the completed tableau from saved completion IDs.

### Rewards and clubhouse

**Files:** `src/game.ts`, `src/components/RoomItem.tsx`, `src/App.tsx`, `src/game.test.ts`.

- Add `park-picnic-pennant` to wall, `park-flowerpot` to desk, and `park-kite-mobile` to wall,
  with the proposed prices and rewards in the design. Supply recognizable `RoomItem` illustrations.
- Grant each decoration with its case; it is immediately owned and can be equipped in its slot.
- Park contributes 9 stars and 150 coins; all six cases total 18 stars and 300 coins before
  purchases. Replays, difficulty changes, repeated repair clicks, and repeated reward clicks
  cannot duplicate currency, stickers, or decorations.
- Retain a Bakery economy check that filters both earned cases and the purchase catalog to the
  original Bakery content. Check the full six-case economy, ownership, and slot compatibility
  separately; the three new Park catalog prices must not inflate Bakery's purchase requirement.

### Saves and difficulty changes

**Files:** `src/storage.ts`, `src/game.test.ts`, `src/App.tsx`.

- Keep the existing storage key and version 1 while the saved shape stays additive and unchanged.
  Do not rename any existing identifier or add persistent location, repair, or puzzle-draft flags.
- Ensure the save loader sees all six cases even when the UI filters by location. A Park session's
  clue/puzzle IDs and its completed case rewards must survive reload.
- Test a pre-expansion version-1 save with Bakery currency, equipment, preferences, completions,
  and an unfinished case. Loading must preserve them; Park opens if all Bakery cases are complete.
- Solved IDs stay credited across level changes; the UI uses current difficulty definitions for
  unsolved tasks. Extra higher-level clue IDs may be dropped on reload at a lower level, matching
  the existing loader policy; no core clue or solved puzzle may be lost.
- Preserve corrupt-field sanitization, blocked-storage feedback, and future-version protection.
  If implementation later changes the saved structure, add a tested explicit migration before
  changing the version; an additive content catalog alone does not require one.

### Offline delivery and documentation

**Files:** `vite.config.ts`, `src/pwa.ts`, `README.md`.

- Bundle Park data with game code and keep standalone SVG/PNG assets in `public/`. Existing
  Workbox precache patterns cover those formats; inspect generated output before changing config.
- Update README's playable locations, all-six-case progression, six engine descriptions, rewards,
  architecture, and save/offline instructions. Add links to both Park documents.
- A cached production build must load every Park scene, thumbnail, puzzle tile, and reward offline.
  Verify an actual worker update preserves a prior Bakery save and a saved Park session.

## Verification and release criteria

During implementation, add focused Vitest checks for the new behavior. Update existing tests
that assume `casesFor()` contains exactly three cases by filtering Bakery explicitly; identify
cases by ID rather than relying on their array position. Run `npm test`, `npm run lint`, and
`npm run build` for code changes.

| Check | Required evidence |
| --- | --- |
| Content integrity | Six unique cases, three per location; three puzzles per case; unique referenced IDs; only the same three NPC keys; all three new engines appear once in each Park case. |
| All difficulty variants | Valid puzzle examples at Junior, Detective, and Master; consistent core evidence and stable IDs; no missing reward/art references. |
| New answer validation | Correct, incorrect, incomplete, unknown-ID, duplicate, wrong-shape, and invalid-turn submissions; alternate valid routes; checkpoint order and sorting order behavior. |
| Unlocks | Zero/partial/all Bakery completions, each Park predecessor, unknown case, and saved eligibility all behave as designed. |
| Rewards | First completion, replay, repeat reward actions, full totals, decoration ownership, and valid equipment slots. |
| Save regressions | Old Bakery save preservation; Park partial/completed round trips; difficulty-switch preservation; corrupt/future saves retain existing behavior. |
| Browser flow | Map to both pickers, Case Files, Continue, notebook, every puzzle, conclusion retries, repair, rewards, clubhouse, and correct back destinations. |
| Accessibility | Complete all three engines with keyboard only; check labels, focus, status announcements, contrast, pattern/shape cues, and reduced motion. |
| Responsive interaction | Play at 320-pixel width and on desktop; verify all controls fit and remain usable on a physical touch device. Browser emulation alone does not establish device touch behavior. |
| Offline and update | Build and preview; wait for worker activation, disconnect, reload, finish and resume Park; update the worker while preserving a real previous save. |
| Story quality | Each actual case passes every guide checklist item and the No Dialogue Test; observe whether target-age players can explain the goal and deduction. |

The [implementation verification](../artifacts/park-verification.md) records automated checks,
browser playthroughs, cached production play with the preview server stopped, and worker updates
that preserved saves. Case duration, child comprehension, physical-device interaction, and the
remaining accessibility/device checks still require release testing.

## Completion boundary

The Park feature is complete when all three cases work at every difficulty, all three engines
are reusable through data, old saves retain their progress, each success visibly improves the
park, and the required verification passes. Implementation should stay within the files and
behavior above. Broader refactoring, new locations, extra mystery cases, and additional puzzle
engines are separate future work.
