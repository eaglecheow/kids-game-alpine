# Sunny Park Design

Sunny Park extends Tiny Town Detectives with three mysteries about a picnic, flower signs, and
display kites. The child helps Baker Ben, Professor Hamster, and Pip the Pigeon get the park ready
for a picnic by investigating mistakes, collecting evidence, and putting things right.

This design is implemented in the game model, puzzle controls, Park artwork, and shared case flow.
It remains the content and artwork reference. The companion [Park Feature Plan](park-feature-plan.md) describes delivery work
and acceptance criteria. Follow the [Kids Game Story Design Guide](kids-game-story-design-guide.md)
throughout implementation and review.

## Scope and working assumptions

The player's location goal is **Help your three friends get Sunny Park ready for a picnic.**
Each case gives the child one smaller, visible problem to solve.

- Reuse exactly the three existing recurring characters and their existing portraits.
- Add three new cases, each designed for approximately 5–10 minutes. Timing is a target for
  playtesting, not a measured result.
- Add exactly three new reusable puzzle types: route tracing, object sorting, and tile assembly.
  Each appears once in every Park case: nine puzzle instances in total.
- Reuse the notebook, evidence review, conclusion, reveal, rewards, clubhouse, difficulty settings,
  local saves, and offline PWA support.
- Progression: finish the three Bakery cases to open Park; complete the Park cases in
  order. Existing Bakery players should unlock Park automatically from their saved completions.
- Retain one active mystery at a time. Browsing another location does not replace its session.

The location name is **Sunny Park**, as already shown on the town map. Library and Science Museum
remain future locations. This expansion does not require new speaking characters, accounts,
multiplayer, a timer, a new currency, or a separate puzzle framework.

## Returning characters

| Character | Recognizable identity | Park role |
| --- | --- | --- |
| Baker Ben | Warm, enthusiastic, easily muddled; chef hat and apron | Brings the picnic, checks flower signs, and prepares grounded display kites. |
| Professor Hamster | Curious experimenter; goggles and lab coat | Supplies maps and observation tools, and puts up the flower labels. |
| Pip the Pigeon | Observant and eager to help; feathers and satchel | Notices physical details, helps organize supplies, and tidies the craft area. |

The child does the reasoning and causes each repair. Characters offer observations and respond
to discoveries; they do not solve the case for the child. Pip's involvement in the final case is
a helpful mistake, with an evidence-based explanation and a chance to put it right. Nobody is
treated as dishonest or punished.

## Location and visual flow

Reuse one illustrated park scene with five recognizable areas: the entrance gate, butterfly
picnic bench, sunflower bench, flowerbeds, and low craft table. Paths connect them. Keep the
investigation inside the existing scene and puzzle dialogs; the route puzzle is a small map
activity, not a new walking or camera system.

Give each hotspot a real object: trolley tracks, delivery tags, picture fragments, flower labels,
or a ribbon box. Use the same object icons in the scene, notebook, and puzzle. Label benches
with distinct butterfly and sunflower shapes, rather than relying on color.

The location's persistent progression is visual:

| Completion | Change visible on the Park scene and case picker |
| --- | --- |
| Picnic case | Basket and blanket meet at the butterfly bench; the direction sign is secured. |
| Flower case | Healthy flowers have their correct signs; Hamster's working map is upright. |
| Kite case | Grounded display kites have their tails; the picnic scene is complete. |

Small wins appear before each ending: a route lights up, sorted objects form useful groups, or
a reconstructed picture becomes readable. Save these discoveries through existing solved puzzle
IDs. Derive completed scene states from completed case IDs rather than storing separate park flags.

## Case overview

| Order | Stable case ID | Mystery | Learning focus | Explanation |
| --- | --- | --- | --- | --- |
| 1 | `park-wrong-bench` | The Picnic at the Wrong Bench | Map reading, classification, spatial orientation | Ben followed a loose direction sign that had turned. |
| 2 | `park-flower-signs` | The Mixed Up Flower Signs | Observation, classification, orientation and comparison | Hamster placed labels using an upside-down working map. |
| 3 | `park-kite-tails` | The Missing Kite Tails | Following visual clues, classifying by two features, part-to-whole reasoning | Pip mistook loose kite tails for spare ribbon and tidied them into his craft box. |

Every case has three puzzle clues and one ordinary clue at Junior level. Detective adds one
supporting observation; Master adds two. The four core clues contain everything necessary to
reach the same conclusion at every level. Extra clues strengthen the explanation without
changing it or providing exclusive evidence.

## Case 1 The Picnic at the Wrong Bench

**Child's goal:** Find the picnic basket and bring it to the butterfly bench.

The butterfly bench has a blanket and an empty basket outline. Ben is holding a delivery slip.
The current picnic arrow points toward the sunflower bench. This mismatch makes the problem
visible before any dialogue.

**Opening:** Ben says, "I followed the picnic arrow. Where is our basket?"

| Core clue and character | Puzzle ID and type | Player action | Discovery and small win |
| --- | --- | --- | --- |
| Trolley trail (`park-bench-trail`) — Ben | `park-bench-route`, `route` | Trace a safe path via the marked trolley stops to inspect the sunflower bench. | The basket is at the sunflower bench. Its tracks agree with Ben's delivery slip. The inspected path lights up. |
| Delivery tags (`park-bench-tags`) — Pip | `park-bench-sort`, `sort` | Group destination tags by butterfly, sunflower, and acorn symbols. | The picnic basket's tag belongs to the butterfly group. Its destination differs from where it was found. The picnic tag is attached to the basket evidence card. |
| Original sign picture (`park-bench-picture`) — Hamster | `park-bench-tiles`, `tiles` | Assemble a separate picture of the original sign, using its fixed gate marker to orient it. | The original picnic arrow points toward the butterfly bench. The repaired picture appears beside the current sign for comparison. |
| Loose sign collar — Pip | No puzzle; `park-bench-collar` | Inspect the sign's loose collar and Ben's pictorial delivery slip. | The sign can swivel; its current arrow matches Ben's route. A ribbon shows a gentle breeze turning the loose sign. |

The delivery slip records Ben following the sign, rather than remembering a different destination.
The picture has a gate anchor and two distinct bench symbols so rotating the whole picture cannot
change its meaning. The basket is intact; there is no thief or lost food to worry about.

Detective's extra clue is an undamaged basket seal (`park-bench-seal`). Master's extra clue is a
matching trolley-wheel imprint (`park-bench-wheel`). Neither is needed to identify the turned sign.

**Conclusion options, in this order:**

1. Ben chose the sunflower bench even though the sign pointed to the butterfly bench.
2. Ben followed a turned sign and delivered the basket to the wrong bench.
3. Pip carried the basket away after Ben delivered it.

The correct conclusion index is **1**. The original picture, current arrow, delivery slip, basket
tag, and route together support it. The other options contradict the direction evidence or the
intact trolley delivery.

**Resolution:** After the correct deduction, the child presses "Put our picnic in place." The
basket moves to the blanket and the sign collar closes. Ben says, "You found the mix-up! Our
picnic is ready." Pip adds, "A butterfly bench deserves a butterfly picnic."

Reward: **3 stars, 40 coins, butterfly sticker, picnic pennant decoration**.

## Case 2 The Mixed Up Flower Signs

**Child's goal:** Put the right signs beside the flowers.

The flowers are healthy, but the outer two signs do not match their blossoms; the middle sign
already matches. Hamster's
working map is visibly clipped upside down at his stand. Its gate symbol is at the wrong end.
The puzzle fragments belong to a **separate master map**; the working copy remains intact.

**Opening:** Ben says, "The flowers look lovely. Their signs look muddled!"

| Core clue and character | Puzzle ID and type | Player action | Discovery and small win |
| --- | --- | --- | --- |
| Label-delivery path (`park-flowers-path`) — Hamster | `park-flowers-route`, `route` | Trace a path from Hamster's stand through marked flowerbed stops. | The child records which flower shape actually grows in each bed. Bed outlines and location symbols appear in the notebook. |
| Flower label tray (`park-flowers-tray`) — Ben | `park-flowers-sort`, `sort` | Group flower signs by pictured leaf and blossom shapes, using the supplied pictorial key. | The signs belong to different flower groups from their current beds. The signs become correctly grouped in the tray. |
| Master planting map (`park-flowers-master`) — Hamster | `park-flowers-tiles`, `tiles` | Assemble the master picture with the entrance gate at its marked edge. | The map agrees with the actual flowers and shows the intended sign positions. The upright reference appears beside the working copy. |
| Working map at the stand — Pip | No puzzle; `park-flowers-copy` | Inspect the intact copy and the stand's pictorial placement note. | The copy's gate marker is at the stand's lower edge. Hamster's placement note points from this copy to the label tray. |

Use three invented display groups with clear illustrated shapes: round, star, and bell blossoms.
Their labels are visual identifiers supplied by the game, not a lesson in real plant taxonomy.
Place the three beds along the map's horizontal centerline: round blossoms on the left, star
blossoms in the middle, and bell blossoms on the right, with the gate at its top edge. The outer
two beds swap under a half-turn; the middle group's position stays consistent. Keep the location
layout consistent across difficulty levels so this explanation always holds.

Junior's route starts at Hamster's stand beside the first bed, uses the middle bed as its one
checkpoint, and ends at the third bed. Every valid route therefore observes all three beds.

Detective's extra clue is the correctly matched middle bed (`park-flowers-middle`). Master's
extra clue is the paired label-holder marks (`park-flowers-holders`). Show all flowers as thriving
at every level; this is a labelling problem, not an emergency requiring gardening knowledge.

**Conclusion options, in this order:**

1. Hamster used his map upside down and swapped the outer flower signs.
2. Ben moved the flowers into different beds after the signs were placed.
3. Pip changed the flowers' shapes while tidying.

The correct conclusion index is **0**. The real bed observations agree with the upright master
map. The reversed working copy and placement note explain the signs. Nothing suggests the plants
moved or changed shape.

**Resolution:** The child presses "Match the signs to the flowers." The prepared signs appear
beside the right beds, and the working copy turns upright. Hamster says, "Gate at the top!
Thank you for checking my map." Ben points out that the flowers were lovely all along.

Reward: **3 stars, 50 coins, flower sticker, flowerpot decoration**.

## Case 3 The Missing Kite Tails

**Child's goal:** Find the kite tails and put them back on the display.

Three small kites sit on low display stands beside the picnic. Their tail attachment loops are
empty. A labelled craft box is visible by Pip's table. These are grounded decorations; the child
never needs to climb, chase something into the sky, or handle a dangerous object.

**Opening:** Ben says, "Our display kites have no tails. Can you find them?"

| Core clue and character | Puzzle ID and type | Player action | Discovery and small win |
| --- | --- | --- | --- |
| Ribbon trail (`park-kites-trail`) — Pip | `park-kites-route`, `route` | Trace the path via the marked ribbon scraps to the low craft table. | Intact rolled ribbons are found inside Pip's labelled box. The box opens and its contents become visible. |
| Ribbon tray (`park-kites-tray`) — Hamster | `park-kites-sort`, `sort` | Sort ribbons into kite tails, parcel ribbons, and picnic flags by pattern and attachment shape. | The rolled ribbons have the same patterns and looped ends as the missing tails. Three matching tails form one kite-tail group. |
| Kite-making picture (`park-kites-picture`) — Ben | `park-kites-tiles`, `tiles` | Assemble the display picture, matching continuous outlines and distinct corner marks. | Each recovered tail fits a particular kite. A preview outlines the matching attachments. |
| Pip's tidy checklist — Pip | No puzzle; `park-kites-checklist` | Inspect the pictorial entry and Pip's stamp. | The stamped instruction says "Roll spare ribbon into my box." Its box symbol matches the craft box. |

The sorting station uses illustrated sample cards available from the start; it does not require
opening the box through the route puzzle first. The sample patterns agree with the intact rolls
later found there. All levels include three tail samples; Junior's fourth object is a decoy,
so a tray may correctly remain empty. Combined with the route, sorting, and picture discoveries,
the checklist establishes Pip's action and the mistaken identity of the ribbons. A feather alone
would only establish his presence.

Detective's extra clue is an uncut loop (`park-kites-loop`). Master's extra clue is the display's
matching storage label (`park-kites-label`). These corroborate that the tails were tidied intact.

**Conclusion options, in this order:**

1. A breeze blew the kite tails into a tall tree.
2. Ben used the kite tails to wrap picnic parcels.
3. Pip thought the loose kite tails were spare ribbon and tidied them into his box.

The correct conclusion index is **2**. The trail, intact contents, matching attachments, and
stamped checklist establish where the tails went and why. The other options do not fit the box
contents or the kite-tail identification.

**Resolution:** The child presses "Give the kites their tails." The matching ribbons attach to
the grounded displays. Pip says, "I thought they were spare ribbon. Thanks for spotting it!"
The child adds a kite picture to the tidy checklist, and all three friends admire the picnic.

Reward: **3 stars, 60 coins, kite sticker, kite mobile decoration**.

## Reusable puzzle types

The Bakery already uses `number`, `sequence`, and `choice`. Park adds three discriminants to the
existing puzzle union. The evidence conclusion still uses the existing choice interaction; it
does not count as a fourth new engine.

| Type | Repeatable interaction | Data supplied by each mystery | Validation |
| --- | --- | --- | --- |
| `route` | Select the start and extend a connected path across a small grid; undo or reset. | Walkable cells, start, destination, ordered checkpoint symbols, and story art. | Reach the destination through all checkpoints in order using adjacent walkable cells. No diagonal moves, repeated cells, or omitted stops. Accept every valid route, without shortest-path scoring. |
| `sort` | Select an object, then select its labelled tray; move it again to revise. | Stable object IDs, visible attributes, tray rules, and the correct tray for each object. | Every required object appears exactly once in its correct tray. Object order inside a tray does not matter. |
| `tiles` | Select a square picture fragment, choose a board slot, and rotate it with buttons where enabled. | A fixed rectangular board, unique tile IDs, edge illustrations, orientation markers, and target placements. | Every slot contains its target tile in an allowed quarter-turn orientation, with no missing or duplicate tiles. |

Route tracing involves spatial adjacency and obstacles, rather than reordering a list of steps.
Sorting assigns several objects to categories, rather than picking one answer. Tile assembly
reconstructs a two-dimensional picture, rather than ordering supplied instruction cards.

For this release, use fixed authored boards and classification rules. Do not add random generation,
pathfinding, arbitrary jigsaw shapes, physics, scoring by speed, or a separate editor.
Author tile pictures with distinct corners and edges so valid-looking symmetric arrangements do
not fail an invisible rule. If a tile is intentionally symmetric, its accepted turns must be
explicit in its data.

### Difficulty and support

| Setting | Junior Detective | Detective | Master Detective |
| --- | --- | --- | --- |
| Route | Up to 4 × 4 cells; one checkpoint | Up to 5 × 5 cells; two checkpoints | Up to 5 × 5 cells; three checkpoints and more path branches |
| Sorting | Four objects; three trays with large example icons | Six objects; three trays | Eight objects; three trays; relevant two-feature distinctions |
| Tile assembly | 2 × 2 board; correct orientations supplied | 2 × 2 board; quarter-turn rotation enabled | 2 × 3 board; quarter-turn rotation enabled |
| Clues | Four core clues | Four core clues plus one supporting clue | Four core clues plus two supporting clues |
| Hints | Visible immediately; show a sample interaction | Available on request; highlight the useful feature | Available on request; prompt a comparison before highlighting |

These are authored difficulty variants, not age restrictions. The child can change difficulty
at any time. Keep case, clue, and puzzle IDs stable. Solved puzzles remain credited; unsubmitted
paths, tray choices, and tile arrangements reset when the puzzle or level changes, consistent
with the existing Bakery behavior. Rewards stay identical across levels.

All objects needed for the core deduction stay available at Junior level. Harder levels add
detail and reasoning, not reading-heavy instructions or exclusive solution facts.

### Accessible controls and feedback

Use native buttons for all required operations. Dragging is optional and unnecessary for this
release. Each route cell has a row, column, landmark, and state label; keyboard users can focus
and activate cells and use Undo. Objects and trays have labels and selection announcements.
Tile slots have row and column labels; fragments have edge descriptions and explicit Rotate,
Remove, and Place controls. Describe the picture features without naming the correct slot.

Use shape, pattern, and text alongside color. Target at least 44 × 44 CSS pixels for controls,
keep grids usable at a 320-pixel viewport, preserve visible focus, and announce feedback and
successful discoveries. Motion enhances the result but is not needed to understand it; provide
the same static result with reduced motion. Sound is optional.

Supportive retry examples:

- Route: "This path crosses a flowerbed. Try the open path beside it."
- Sorting: "Look at the stamp and the tray symbol. Do they match?"
- Tiles: "These picture edges don't meet yet. Try another turn."

Keep the child's arrangement on an incorrect attempt. Offer one useful next step, unlimited
retries, and no loss of stars or coins. Successful validation previews the discovery inside the
puzzle. The existing "Add discovery to notebook" button commits the solved ID, closes the puzzle,
and reveals its lasting scene change. Until that commit, reopening the puzzle starts an
unsubmitted attempt.

## Evidence and case flow

Use the existing loop: introduction → inspect scene and talk to friends → make three discoveries
→ review evidence → choose an explanation → reveal and restore → collect rewards → clubhouse.

All three puzzle stations and the ordinary clue are accessible in any order. Use independent
artifacts: the flower master map is separate from the working copy, and kite sorting uses a sample
tray rather than a box that another puzzle must open. Hinting may recommend a next action but
must not silently impose puzzle prerequisites.

Opening a clue records the observation, as it does today. A solved puzzle adds its **discovery**
to that same notebook card and to the evidence board. Before solving, show only the initial
observation; avoid placing a final causal explanation in the raw clue description. Preserve the
existing conclusion gate requiring all current clues and all three solved puzzles.

Endings confirm facts the child has already established. Reveals must not introduce a confession,
new note, or new object as the only proof of the answer. The child initiates the visible repair
after deducing the explanation; characters then acknowledge the result.

The labelled repair button replaces "Collect my rewards" for a Park case. It commits the case's
completion and one-time rewards together, clears the session, and opens the reward screen with
the repaired scene pictured. There is no separate unsaved repair stage or second reward claim.
Before pressing it, a reload retains the solved discoveries but requires the conclusion again;
afterward, a reload retains both the completed repair and its rewards.

## Rewards and replay

| Case | Stars | Coins | Sticker | Decoration ID | Clubhouse slot |
| --- | --- | --- | --- | --- | --- |
| Wrong bench | 3 | 40 | Butterfly | `park-picnic-pennant` | `wall` |
| Flower signs | 3 | 50 | Flower | `park-flowerpot` | `desk` |
| Kite tails | 3 | 60 | Kite | `park-kite-mobile` | `wall` |

New decoration catalog prices are 40, 50, and 60 coins respectively. Each is granted
directly with its case reward, using the existing ownership rules, so the price does not create
a second required purchase. Their art should be recognizable at clubhouse icon size.

Park adds **9 stars and 150 coins**. Bakery plus Park totals **18 stars and 300 coins** before
purchases. Completion grants rewards once per case, regardless of level, hints, retries, or replay.

Completed repairs remain visible on ordinary Park visits. A replay temporarily shows its own
case's unresolved problem while retaining the other completed repairs. Leaving the replay keeps
that session for resumption; it does not erase completed IDs, rewards, or the ordinary completed
scene. Collecting replay rewards clears the session without granting duplicates.

## Story review

This review evaluates the proposed content and art requirements. Implementation must repeat it
against actual screens; it is not evidence of child playtesting or completed accessibility work.

| Story guide check | Design evidence |
| --- | --- |
| One clear main goal | Get Sunny Park ready for a picnic; each case has a one-sentence object goal. |
| Player causes important events | The child locates, compares, deduces, and initiates each repair. |
| Safe emotional stakes | Misplaced supplies and signs, healthy flowers, intact tails, grounded kites; nobody is in danger. |
| Memorable characters | The same visual identities and contrasting traits carry through all three cases. |
| Gameplay causes story progress | Each puzzle adds evidence; each solved case visibly restores one part of the picnic. |
| Short, understandable dialogue | Openings and responses describe the immediate problem or discovery. |
| No lore dump | The picnic setup and visible mismatch introduce the location without backstory. |
| Regular small wins | Every route, sort, and picture produces an observable change and notebook discovery. |
| World visibly reacts | Correct sign and basket, matched flower labels, restored kite tails, completed picnic. |
| Objective works without dialogue | Missing outlines, mismatched shapes, gate anchors, object icons, and highlighted hotspots show each task. |
| Clear achievement and celebration | The child finishes a picnic tableau with all three friends and receives a themed reward. |

### No Dialogue Test

- **Picnic:** Empty basket outline on the butterfly blanket; basket visible after route inspection;
  butterfly tag; current and original arrows disagree; the repaired scene reunites basket and blanket.
- **Flowers:** Sign silhouettes disagree with blossoms; gate marker shows the working map upside
  down; comparison and final placement visibly fix the mismatch.
- **Kites:** Empty tail loops; matching patterned rolls in the box; the picture connects tails to
  kites; the final display has complete tails.

The design passes at the specification level only if these visual cues are produced as described.
Before release, repeat the test with dialogue hidden in the playable screens. A child should
identify the problem, find the relevant objects, and recognize the repair without an adult
explaining it. Follow the guide's priority order: clarity, player agency, emotional safety,
memorable characters, story and gameplay connection, then additional detail.
