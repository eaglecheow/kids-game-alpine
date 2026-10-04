# Repository Guidelines

## Project Structure & Module Organization

Tiny Town Detectives is a React/TypeScript game built with Vite. `src/App.tsx` manages navigation and gameplay; `src/game.ts` defines cases, puzzles, progression, and rewards. `src/storage.ts` handles local saves. Reusable UI lives in `src/components/`; styling, audio, and service-worker registration live in `src/styles.css`, `src/audio.ts`, and `src/pwa.ts`. Tests sit alongside source in `src/game.test.ts`. `public/` contains illustrations, icons, and the manifest; `design_docs/` contains design references. Production output goes to ignored `dist/`.

## Story Design Requirements

Before designing, implementing, or revising any game component involving stories (including cases, characters, dialogue, clues, puzzle narratives, progression, and endings), read and follow [Kids Game Story Design Guide](design_docs/kids-game-story-design-guide.md). Following this guide is mandatory for all story-related work.

Use the guide's Agent Priority Order for tradeoffs. Before marking story-related work complete, review the affected content against its Agent Review Checklist and No-Dialogue Test, and resolve any failed checks.

## Build, Test, and Development Commands

Use Node.js 22.12+ or 20.19–20.x with npm.

- `npm ci`: install locked dependencies.
- `npm run dev`: start Vite with hot reload, normally on port 5173; binds to all interfaces.
- `npm run build`: type-check and generate the production app and service worker.
- `npm run preview`: serve `dist/`, normally on port 4173; build first.
- `npm test`: run Vitest once.
- `npm run lint`: run ESLint, including React Hooks rules.
- `npm run format`: format source, manifest, HTML, and README with Prettier.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, semicolons, single quotes, trailing commas, and a 100-column Prettier width. Name components and their `.tsx` files in PascalCase (`RoomItem.tsx`); use camelCase for functions and variables. Follow existing discriminated unions for puzzle types. Keep changes focused and reuse existing modules before adding abstractions or dependencies.

## Readability, Performance, SOLID & DRY

- Give each module one clear responsibility. Keep app navigation and case orchestration in `App`; put self-contained UI in named components and pure game rules in domain functions. Prefer descriptive names, explicit types at boundaries, and early returns over deeply nested conditions.
- Apply SOLID proportionally: use composition and small prop/callback contracts, keep browser storage and other side effects out of game rules, and extend the existing puzzle union instead of introducing speculative class hierarchies or plugin systems. Preserve the behavior promised by existing component contracts.
- Apply DRY to shared knowledge and actual repeated behavior, such as difficulty choices and case unlock order. Keep one source of truth. Do not combine unrelated UI merely because its markup looks similar.
- Identify repeated work before optimizing. Memoize expensive derived data with all relevant dependencies; never rely on memoization for correctness or mutate memoized case definitions. Keep temporary drag state separate from durable saves and avoid storage writes on every pointer movement.
- Measure relevant work, render counts, timings, or bundle size before and after performance changes. Report the method and scope; do not claim frame-rate or loading improvements from unmeasured assumptions. Avoid blanket memoization, unnecessary indexes for tiny collections, and new dependencies without a demonstrated need.
- Refactors must retain gameplay, text, styling, accessible controls, save keys/schema/IDs, migration behavior, and one-time rewards. Add regression tests for affected rules and verify affected UI, difficulty changes, reloads, and offline play. Run lint, tests, and the type-checked production build against the final code before deployment.
- Keep [the development guide](docs/getting-started.md) and README architecture notes accurate when commands, configuration, or module responsibilities change.

## Testing Guidelines

Use Vitest with descriptive `describe`/`it` blocks and `*.test.ts` filenames beside source. Cover changed puzzle answers, difficulty variants, unlock rules, one-time rewards, and save validation/migrations. No coverage percentage is configured. Run tests, lint, and build for code changes. Manually verify affected UI with keyboard and touch; check offline behavior through the production preview after service-worker activation.

## Commit & Pull Request Guidelines

Use concise, imperative commit subjects, matching the existing history. PRs should describe behavior changes, link relevant issues, report validation, and include screenshots for visual changes. Follow branch protection and the existing GitHub Pages workflow; deploy only with user authorization after successful verification. Verify the deployed commit, workflow status, and live behavior before reporting deployment success.

## Persistence & Accessibility

Keep case, clue, puzzle, and decoration IDs stable; changes require intentional save migration and tests. Preserve local-only player data, supportive retries, labelled controls, visible focus, reduced motion, and button alternatives to dragging.
