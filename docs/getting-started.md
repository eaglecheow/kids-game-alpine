# Getting started with development

Tiny Town Detectives is a client-only React/TypeScript game built with Vite. Start with
[AGENTS.md](../AGENTS.md) for project rules. Before changing cases, clues, dialogue, progression,
or endings, read the mandatory [story design guide](../design_docs/kids-game-story-design-guide.md).

## Prerequisites and setup

Use Git, npm, and Node.js **22.12+** or **20.19–20.x** (Vite's supported minimums).
The deployment workflow uses Node.js 22. This refactor was also checked locally with Node.js
24.19.0 and npm 11.9.0. No account, API key, database, or `.env` file is needed to run the game.

```sh
git clone https://github.com/eaglecheow/kids-game-alpine.git
cd kids-game-alpine
node --version
npm --version
npm ci
npm run dev
```

Open `http://localhost:5173/kids-game-alpine/`, or the URL Vite prints if that port is busy.
The server binds to all interfaces for tablet testing. If a sandbox does not permit npm's
normal home-directory cache, use a writable cache, for example `npm ci --cache /tmp/kids-game-npm`.
Keep `package-lock.json` committed; use `npm ci` to reproduce its dependencies.

## Checks and production preview

Run these from the repository root:

| Command           | Purpose                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `npm test`        | Run Vitest game, progression, save migration, and placement regression tests once. |
| `npx vitest`      | Watch tests while editing.                                                         |
| `npm run lint`    | Check source with ESLint, including React Hooks rules.                             |
| `npx tsc -b`      | Run the strict TypeScript project check without producing app output.              |
| `npm run build`   | Type-check and build `dist/`, including the production service worker.             |
| `npm run preview` | Serve the existing production build; rebuild after source changes.                 |
| `npm run format`  | Format source, manifest, HTML, and README; review its diff before committing.      |

For a targeted test, use `npm test -- src/game.test.ts`. For documentation formatting, use
`npx prettier --write docs/getting-started.md AGENTS.md`.

Preview normally serves `http://localhost:4173/kids-game-alpine/`. Check changed interactions
with keyboard and touch, reload to verify saved progress, then wait for service-worker
activation and reload offline. See the README's [offline checklist](../README.md#offline-pwa-and-installation)
for the fuller scenario. An HTTP LAN IP supports ordinary play but service workers require
HTTPS or localhost. Use browser profiles dedicated to testing so reset tests do not erase
someone's real adventure.

## Where code lives

| Path                                             | Responsibility                                                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.tsx`                                   | React entry point and locally bundled fonts.                                                                                             |
| `src/App.tsx`                                    | Navigation, case flow, temporary modal state, and saved player orchestration; case definitions are derived only when difficulty changes. |
| `src/game.ts`                                    | Typed case/puzzle definitions, difficulty data, answer validation, unlock rules, and one-time rewards.                                   |
| `src/storage.ts`                                 | Local save loading, validation, migrations, writes, and confirmed progress reset.                                                        |
| `src/components/`                                | UI: onboarding/settings and shared difficulty selection, case art, puzzles, scenes, dialogs, and clubhouse.                              |
| `src/clubhouse.ts`, `src/tilePlacement.ts`       | Pure room bounds and tile placement helpers.                                                                                             |
| `src/*.test.ts`                                  | Vitest tests alongside the rules they protect.                                                                                           |
| `src/styles.css`, `src/components/Clubhouse.css` | Existing responsive styling and reduced-motion support.                                                                                  |
| `src/assets.ts`, `src/audio.ts`, `src/pwa.ts`    | Base-aware asset URLs, optional synthesized audio, and offline registration.                                                             |
| `public/`                                        | Illustrations, puzzle pictures, app icons, and manifest.                                                                                 |
| `design_docs/`                                   | Story requirements and feature/design references.                                                                                        |
| `vite.config.ts`, `.github/workflows/pages.yml`  | Build/service-worker configuration and GitHub Pages validation/deployment.                                                               |

Player data stays in browser local storage under `tiny-town-detectives.player` (schema version 2).
Keep save IDs and migrations compatible. Temporary UI state belongs outside the saved player.
Components receive data and callbacks; pure game rules do not access browser storage. Keep
shared rules in one place and extract components when they have a clear responsibility.

## Configuration

- Vite's default `base` is `/kids-game-alpine/`. Use `publicAsset()` and `import.meta.env.BASE_URL`
  for hosted paths; do not hard-code a root-relative asset URL.
- `PAGES_BASE_PATH` is set **inside the GitHub Actions build step** from `configure-pages` output.
  That step passes it to Vite's `--base` flag. Setting it alone locally does not change Vite's base.
- To test another existing hosting path, use matching overrides:
  `npm run build -- --base /my-game/` and `npm run preview -- --base /my-game/`.
- There are no application secrets or required runtime environment variables. The generated
  service worker is active in production builds, not ordinary development.

## Typical change and deployment workflow

1. Create a focused branch from current `main`, inspect existing tests, and run the app.
2. Make a small behavior-preserving change. Add regression tests for affected rules; preserve
   saved data, accessibility, text, and visual design. Measure performance changes rather than
   assuming an extraction makes the app faster.
3. Run tests, lint, and build against the final code. Check the production preview, including
   saved progress and offline behavior. Review the diff and commit source, tests, and relevant docs.
4. Follow the repository's current branch protections and review requirements. Pull requests run
   the same validation/build workflow without deploying. Do not bypass required reviews.
5. With deployment authorization, publish the verified changes to `main` through the allowed
   repository workflow. Its push triggers **Deploy to GitHub Pages**, which installs locked
   dependencies, lints, tests, builds with the configured Pages base, and deploys `dist/`.
   `workflow_dispatch` on `main` can rerun the same deployment when needed.
6. Verify the workflow's commit SHA and successful build/deploy jobs, then check the live URL
   reported by the deploy job. The established address is
   <https://eaglecheow.github.io/kids-game-alpine/>. Check the loaded asset version, gameplay,
   existing saves, and offline reload before declaring deployment complete.

Use the established Pages destination; no `gh-pages` branch or new hosting service is needed.
See [Host on GitHub Pages](../README.md#host-on-github-pages) for hosting setup details.
