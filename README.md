# Tiny Town Detectives

**Every clue counts.** A cheerful, locally saved adventure for children roughly ages 7–12, built with React, TypeScript, and Vite. Explore an illustrated town, investigate Ben’s Bakery and Sunny Park, connect evidence, and decorate a detective clubhouse. There is no account, backend, payment system, or remote game data.

## Play the adventure

Choose a made-up detective nickname, an avatar, a hat, and an adventure level. The short welcome introduces the clubhouse and starts the first mystery.

Each case follows the same loop: meet the characters → inspect clues → solve three story puzzles → review the notebook → choose an explanation → see the reveal → collect rewards → furnish the clubhouse. In Sunny Park, the reward action also puts the picnic, flower signs, or kite tails back in place.

| Mystery                       | Learning woven into the story                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| The Missing Cookies           | Count trays, find missing cookies, and compare delivery times.                                 |
| The Giant Cupcake             | Convert kilograms to grams, compare a recipe with a flour bag, and read an experiment log.     |
| The Mystery Recipe            | Reorder recipe steps, measure a fraction of the sugar, and compare witness accounts.           |
| The Picnic at the Wrong Bench | Follow trolley tracks, group delivery tags, and reconstruct the original direction sign.       |
| The Mixed Up Flower Signs     | Observe three flowerbeds, sort illustrated labels, and reconstruct a planting map.             |
| The Missing Kite Tails        | Follow ribbon scraps, classify ribbons by pattern and attachment, and assemble a kite picture. |

Baker Ben, Professor Hamster, and Pip the Pigeon recur throughout. Each conclusion is harmless and playful. Hints and retries never reduce rewards. Bakery, Park, and Clubhouse are playable; Library and Science Museum remain future locations. Park opens after all three Bakery mysteries are completed, including completions loaded from an existing save.

Junior Detective, Detective, and Master Detective adjust quantities, wording, clue counts, recipe length, route checkpoints, sorting objects, picture grids, and hints. Junior hints appear immediately and picture pieces do not need rotation. Settings can change the level at any time; collected discoveries remain saved, and unsolved puzzles use the new level.

Cases unlock in order within each location. First completion grants the case’s stars, coins, sticker, and decoration. Each location earns nine stars and 150 coins; all six mysteries earn 18 stars and 300 coins before any purchases. Replays give no extra currency or duplicate rewards. Park repairs remain visible on ordinary visits; a replay temporarily restores its own mystery while keeping the other completed repairs. Spend earned coins on decorations and arrange every owned treasure together in the clubhouse. Drag from the collection or move items around the room with a mouse, pen, or touch. Tap a collection item to place or select it, then use the move buttons or arrow keys (Shift moves farther). Bring items to the front or send them to the back when they overlap; Put away returns a treasure to the collection without losing ownership. Positions and layers save automatically and scale with the room on smaller screens.

The [Sunny Park design](design_docs/park-design.md) describes its mysteries, evidence, and visual progress. The [feature plan](design_docs/park-feature-plan.md) records the implementation scope and acceptance checks.

## Run locally

Use Node.js 22.12 or newer, or Node.js 20.19–20.x, and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173/kids-game-alpine/`. The development server binds to all interfaces so a tablet on the same network can access it. Service-worker installation needs a secure browser context: HTTP localhost is allowed, while a LAN IP or a deployed site needs HTTPS. Ordinary development gameplay works without a service worker.

| Command           | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `npm run dev`     | Run the development server with hot reload.                             |
| `npm run build`   | Type-check and create the production app and service worker in `dist/`. |
| `npm run preview` | Serve the production build locally, normally on port 4173.              |
| `npm test`        | Run Vitest tests for puzzles, progression, rewards, and local saves.    |
| `npm run lint`    | Check TypeScript, React hooks, and JavaScript with ESLint.              |
| `npm run format`  | Format source, manifest, HTML, and README with Prettier.                |

Build before running preview, then open `http://localhost:4173/kids-game-alpine/`. The default Vite base is `/kids-game-alpine/`, matching this repository's GitHub Pages address. Images, puzzle illustrations, icons, the manifest, and the service worker use the app's base path.

## Host on GitHub Pages

1. In the repository's **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Pages hosting for a private repository requires a GitHub plan that supports it.
2. Push these changes to `main`. The **Deploy to GitHub Pages** workflow installs the locked dependencies with Node.js 22, runs lint and tests, builds `dist/`, and deploys it using GitHub's Pages actions. Pull requests run the same validation and build without deploying. After the workflow is on `main`, you can also run it from the **Actions** tab.
3. Wait for the deployment to succeed, then open `https://eaglecheow.github.io/kids-game-alpine/` (or the URL reported by the deployment if you configure a custom domain).

The workflow reads the base path from GitHub Pages, so a repository rename, a user/organization site, or a custom domain uses the configured path automatically. It publishes only `dist/`; no `gh-pages` branch, backend, additional deploy token, or committed build output is needed. The app's navigation stays on the same URL, so GitHub Pages does not need a custom `404.html` fallback.

For a different hosting path, override Vite's base for both the build and preview:

```sh
# Host at the root of an HTTPS origin.
npm run build -- --base /
npm run preview -- --base /

# Host under a different directory.
npm run build -- --base /my-game/
npm run preview -- --base /my-game/
```

Open the preview URL printed for the chosen base and check that scenes and puzzle pictures load. On localhost, wait for offline-ready status, switch the browser offline, and reload to check the cached app. Installed apps launch their configured URL; moving to another origin does not transfer browser saves.

## File architecture

The MVP keeps its engine compact rather than creating a directory for each possible future feature.

```text
src/
  App.tsx                 Navigation, case flow, onboarding, notebook, settings, clubhouse
  game.ts                 Typed case definitions, difficulty data, items, validation, rewards
  storage.ts              Local save loading, validation, migration, and writing
  clubhouse.ts            Room dimensions, default positions, and placement bounds
  game.test.ts            Game and save tests
  components/
    Character.tsx         Original SVG character portraits and detective customization
    RoomItem.tsx          Original SVG clubhouse furniture and decorations
    Clubhouse.tsx         Free placement, touch dragging, keyboard and button controls
    Clubhouse.css         Responsive clubhouse canvas and editor styles
    Modal.tsx             Native dialog with labels and close controls
    Puzzle.tsx            Number, sequence, choice, route, sorting, and tile puzzle views
    SequenceCards.tsx     Recipe card dragging, tap placement, and keyboard reordering
    ParkScene.tsx         Park repairs, saved discoveries, and illustrated physical evidence
  audio.ts                Optional Web Audio effects and background melody
  assets.ts               Public asset URLs relative to the configured hosting path
  pwa.ts                  Service-worker registration and offline-ready event
  styles.css              Responsive theme, interaction states, reduced-motion rules
  main.tsx                React entry point and locally bundled Nunito fonts
public/
  town-map.svg            Illustrated town environment
  bakery-scene.svg        Illustrated bakery environment
  park-scene.svg          Illustrated park environment
  park-*.svg              Park thumbnails and fixed-grid picture assets
  manifest.webmanifest    App identity, standalone display, installation icons
  icon.svg                Original icon source
  icon-192.png
  icon-512.png
vite.config.ts            Hosting base path, React build, and generated service worker
.github/workflows/pages.yml  Validation and GitHub Pages deployment
```

Persistent player data is separate from temporary page and modal state. The active case session stores clue IDs, solved puzzle IDs, and whether its introduction has been seen. Case content lives in structured `GameCase` objects returned by `casesFor(difficulty)`; this catalog includes both locations, while their pickers filter by location. Park repairs derive from completed case IDs and discoveries from solved puzzle IDs.

## Puzzle engines and accessibility

`Puzzle` is a discriminated union in `src/game.ts`:

- `number`: a finite numeric answer, with optional unit text. Story data supplies arithmetic, decimals, fractions, and measurement challenges.
- `sequence`: a starting card array and an ordered answer array. Drag whole cards with a mouse or touch, with a highlighted drop position and scrolling for long recipes. Tap a card and then its new position, or use keyboard controls, as alternatives.
- `choice`: evidence options and a zero-based correct option index.
- `route`: a small fixed grid with a start, destination, obstacles, and ordered checkpoints. Select adjacent cells, then undo or reset. Every valid path passes, without a shortest-path requirement.
- `sort`: objects with illustrated attributes and three labelled rule trays. Select an object and assign a tray; revise any placement before checking. Every object must match its tray; object order is irrelevant and a tray can remain empty.
- `tiles`: a rectangular picture board with unique fragments. Drag pieces from the tray into highlighted squares, swap board pieces, or drag them back to the tray. Select a piece and use Rotate where enabled. Tap/keyboard controls also work: select a piece, activate an empty square to place it, or use Return to clear its square. All fragments must occupy their matching slots at accepted quarter-turn orientations.

Every puzzle includes a hint and character-driven success text. Incorrect attempts show supportive feedback, preserve the current arrangement, and allow another try. Number validation compares exact numeric values; sequence validation checks every card in order. Successful puzzle feedback previews the discovery; **Add discovery to notebook** saves it and reveals its lasting scene change. Park notebook observations gain their discovered facts after this commit.

Native buttons, labelled controls, visible focus outlines, dialog semantics, status announcements, large targets, responsive layouts, and `prefers-reduced-motion` rules support accessible play. No mystery requires dragging: sequence card selection and the other engines’ selection, placement, rotation, and undo buttons perform every required operation. Patterns, shapes, and text accompany color.

## Add another mystery

1. Add a `GameCase` to `casesFor()` in `src/game.ts`, with a unique stable `id`, location, intro, character clues, three puzzles, conclusion options, correct conclusion index, reveal, and rewards. Follow the existing difficulty variants and the mandatory [Kids Game Story Design Guide](design_docs/kids-game-story-design-guide.md).
2. Give clues and puzzles stable IDs. Link each puzzle to its clue with `puzzleId`; use the existing character keys `ben`, `hamster`, and `pip`. Provide enough evidence to explain the conclusion without guessing. For Park clues, provide object-specific hotspot coordinates and optional post-solve discovery text.
3. Extend the explicit unlock order in `canPlayCase()`. The case picker and flow consume the returned definitions; new locations would also require their map and navigation UI.
4. If granting a new decoration, add its stable ID to `decorations` and its dimensions and starting position to `clubhouse.ts`. The furniture slot remains legacy migration metadata; it does not restrict placement. Put standalone illustration assets in `public/` so the build precaches them.
5. Extend `src/game.test.ts` to check the new case at each level, its unlock prerequisite, answers, reward references, and one-time completion behavior.

IDs are used in saved progress. Keep existing IDs stable; renaming or removing them requires an intentional save migration. Choice and conclusion answer indices must match the displayed option order.

## Local saves

`src/storage.ts` stores JSON in `localStorage` under `tiny-town-detectives.player`. This small save contains version `2`, profile choices, difficulty, audio preferences, earned currency, completed cases, stickers, owned decorations, independent room positions, and one active case session. Each `roomItems` entry stores a stable decoration ID and its center as x/y percentages; array order stores the layers from back to front. `App.tsx` saves player-state changes automatically.

You can leave a mystery for the map or clubhouse and resume it later. Starting another case while one is open returns to the saved mystery first, preserving discoveries. Temporary typed answers, unsubmitted card order, and open dialogs are not saved.

In **Settings → Reset all progress**, confirm **Yes, reset all progress** to start again from the first mystery. This permanently clears completed cases, notebook discoveries, stars, coins, stickers, and owned and placed clubhouse decorations on this device. Your detective nickname, look, adventure level, and audio preferences stay the same. **Keep my progress**, Close, or Escape cancels the reset. If the fresh save cannot be written, your current progress stays intact and the game shows an error.

The loader supplies defaults, sanitizes invalid fields, and discards unknown clue, puzzle, case, or decoration IDs. Unversioned, version `0`, and version `1` saves are migrated and rewritten as version `2`: valid equipped items become independently movable items near their previous positions, while ownership, progress, currency, and preferences are retained. Current room layouts allow each owned decoration once, reject invalid coordinates, keep items inside the room, and preserve layer order. An empty layout stays empty. Future save versions are preserved rather than overwritten; the app signals when saving fails.

Saves belong to that browser and origin. Clearing site storage removes them; devices and browsers do not synchronize. A nickname stays local and should be a made-up name.

## Offline PWA and installation

PWA caching is enabled in the **production build**, not the development server. `vite-plugin-pwa` generates `dist/sw.js` with Workbox. Its precache contains built JavaScript, CSS, HTML, SVG illustrations, PNG icons, the manifest, and WOFF2 fonts, including Park scenes, thumbnails, and picture fragments. Case definitions are bundled with the JavaScript, so all six mysteries need no network requests after caching. Navigations fall back to the cached `index.html`.

`src/pwa.ts` registers the worker immediately and emits `pwa-ready` when an active offline cache is ready. The UI also listens to browser online/offline events and shows a connection indicator. A first visit still needs connectivity long enough to load and cache the app.

On a later deployment, changed asset revisions are downloaded into the new cache, outdated caches are cleaned up, and the `autoUpdate` worker takes control and refreshes open clients. Player saves remain in localStorage; temporary unsubmitted UI input may reset during an update.

Use the game’s install control when the browser supplies an installation prompt. Safari on iPhone/iPad uses Share → Add to Home Screen. The manifest requests standalone display and supplies 192px and 512px maskable PNG icons.

To check offline behavior manually:

1. Run `npm run build`, then `npm run preview`.
2. Open the localhost preview, start an adventure, and wait for the offline-ready status/service-worker activation.
3. Disable connectivity in browser developer tools and reload. With Bakery completed, visit Park, inspect clues, solve a puzzle, leave the case, and resume it. Check the picture assets and complete a repair offline.
4. Restore connectivity, rebuild a change, and check that the next worker updates the cached app while retaining a prior Bakery save and a saved Park session.

Automated game tests do not establish physical-device touch behavior, installation, or browser offline behavior; those require browser/device checks.

## Optional audio

`src/audio.ts` synthesizes gentle sine-wave effects and a quiet repeating tune with native Web Audio. It has no downloaded sound files. `playSound(kind, enabled)` handles click, clue, and success effects; `setMusic(enabled)` controls the melody. Sounds only start in response to interaction. Music starts from its settings toggle or a case Start/Continue action when enabled, never from initial rendering. Sound and music preferences are saved locally; music defaults off.
