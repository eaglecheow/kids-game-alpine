Build a polished, kid-friendly Progressive Web App called **Tiny Town Detectives**.

The target audience is **primary school children, roughly ages 7–12**.

The core idea is that the child plays as a junior detective solving short mysteries around a colourful town. Educational puzzles should be embedded naturally into each mystery so that the experience feels like an adventure game rather than a worksheet.

## Product Goal

Create a playable MVP that demonstrates the complete gameplay loop:

**Explore → gather clues → solve educational puzzles → solve the mystery → earn rewards → decorate clubhouse**

The MVP should be fun enough that a child can play it without adult explanation.

Do not build a large platform yet. Focus on one polished vertical slice.

---

# MVP Scope

Create:

- 1 town map
- 1 playable location: Bakery
- 1 detective clubhouse
- 3 characters
- 3 mystery cases
- 3 reusable puzzle types
- Player progression
- Rewards and clubhouse decorations
- Offline-capable PWA support
- Local save system
- Responsive tablet/mobile/desktop UI

No backend or login is required for the MVP.

Store player progress locally using IndexedDB or another appropriate persistent browser storage mechanism.

---

# Visual Direction

Use a bright, cheerful illustrated aesthetic suitable for children.

Think:

- rounded shapes
- large buttons
- expressive characters
- playful animations
- colourful environments
- minimal text density
- strong visual hierarchy
- readable typography

Avoid making the UI look like a school portal.

The interface should feel closer to an interactive cartoon adventure.

Use CSS/SVG illustrations and simple vector-style artwork where possible.

Do not rely on copyrighted characters or franchises.

---

# Main Character

The player is a young detective.

Allow the player to choose:

- avatar
- detective hat
- nickname

Do not collect personal information.

The nickname can remain locally stored.

---

# Town Map

Create a simple illustrated town map.

For the MVP, show several locations but only make the Bakery playable.

Example locations:

- 🍞 Bakery
- 📚 Library
- 🌳 Park
- 🧪 Science Museum
- 🏠 Detective Clubhouse

Locked locations should visually indicate that they will become available later.

Selecting Bakery opens the available cases.

---

# Bakery Characters

Create three recurring characters.

### Baker Ben

Friendly bakery owner who is enthusiastic but easily confused.

### Professor Hamster

A tiny eccentric scientist who frequently experiments with food and measurements.

### Pip the Pigeon

A suspicious-looking pigeon who constantly appears near crime scenes but is usually innocent.

Give each character simple portrait artwork and expressive dialogue animations.

---

# Case Structure

Each mystery should take approximately **5–10 minutes**.

Each case follows this structure:

1. Intro cutscene
2. Explore bakery
3. Speak with characters
4. Find clues
5. Complete three educational puzzles
6. Review collected evidence
7. Choose a conclusion
8. Reveal what happened
9. Receive reward
10. Return to clubhouse

Educational content must be integrated into the story.

Avoid presenting isolated worksheet-style questions.

---

# Case 1

## The Missing Cookies

Baker Ben prepared several trays of cookies, but some have vanished.

The player investigates how many cookies should exist and compares that with the number remaining.

Learning focus:

- multiplication
- subtraction
- counting

Example scenario:

Baker Ben made:

6 trays × 8 cookies

Some remain on the counter.

The player determines how many are missing.

Clues should reveal that Pip the Pigeon did not steal the cookies.

The mystery should have a funny, harmless conclusion.

---

# Case 2

## The Giant Cupcake

A cupcake has grown to an enormous size overnight.

The player investigates the recipe.

Learning focus:

- measurement
- decimals
- units
- reading comprehension

Example clue:

The intended recipe required:

250 g flour

Someone accidentally used:

2.5 kg flour

The player needs to recognise that the quantities are dramatically different.

The final reveal should show that Professor Hamster accidentally caused the giant cupcake during an experiment.

---

# Case 3

## The Mystery Recipe

Baker Ben's recipe cards have become mixed up.

The player must reconstruct the correct recipe.

Learning focus:

- sequencing
- reading comprehension
- logic
- simple fractions

Example puzzle:

Put these instructions into the correct order:

- Bake the cake
- Mix the ingredients
- Measure the flour
- Decorate the cake

Another puzzle can involve choosing the correct fraction of an ingredient.

---

# Puzzle System

Design puzzles as reusable components.

Create at least three puzzle engines.

## 1. Number Puzzle

Supports:

- addition
- subtraction
- multiplication
- division
- measurement

Questions should be generated from structured puzzle data.

Example schema:

{
  "type": "number",
  "question": "There are 6 trays with 8 cookies each. How many cookies are there?",
  "answer": 48
}

---

## 2. Sequence Puzzle

The player drags cards into the correct order.

Used for:

- recipe instructions
- story sequences
- scientific processes

Support both mouse and touch interaction.

---

## 3. Evidence Choice Puzzle

The player reads clues and chooses the most logical answer.

Example:

Clue A:
Professor Hamster entered the bakery at 3 PM.

Clue B:
The cupcake began growing at 3:05 PM.

Clue C:
Pip the Pigeon arrived at 3:30 PM.

Question:

Who could have caused the cupcake to grow?

Avoid punishing incorrect answers harshly.

Provide hints and allow retries.

---

# Feedback Philosophy

Do not simply display:

"Correct!"

Instead, have the story react to the player's answer.

Example:

The player enters:

48 cookies

Then animate Baker Ben counting the trays.

Baker Ben says:

"Forty-eight! That's exactly how many I baked!"

Then display:

🔎 New clue discovered

Wrong answers should also produce supportive contextual feedback.

Example:

"Hmm... that number doesn't quite match the six trays. Maybe count how many cookies would be on each tray."

Never shame the child.

---

# Clue System

Create a detective notebook.

The notebook displays collected clues as cards.

Example:

🔎 Flour Bag

"The bag originally contained 2.5 kg of flour."

🔎 Recipe Card

"The recipe only calls for 250 g."

The player can open the notebook at any time during a case.

---

# Mystery Conclusion

At the end of a case, display the evidence board.

Allow the player to select what they think happened.

The player should make a conclusion based on previously discovered clues.

After selecting an answer, show a short animated reveal.

The reveal should be humorous and lighthearted.

---

# Rewards

Completing cases earns:

- Detective Stars
- Coins
- Stickers
- Clubhouse decorations

Rewards should not involve real-money purchases.

No loot boxes.

---

# Detective Clubhouse

Create a simple customizable clubhouse room.

The child can place or unlock decorations such as:

- detective lamp
- globe
- cookie trophy
- magnifying-glass poster
- hamster plush
- pigeon statue
- bookshelf
- rug

For the MVP, simple predefined furniture slots are sufficient.

No free-form physics-based placement is necessary.

---

# Progression

Track:

- completed cases
- earned stars
- coins
- unlocked decorations
- equipped decorations
- avatar
- nickname

Persist everything locally.

Create a simple save versioning system so future schema changes can be migrated.

---

# Difficulty

Create three difficulty levels:

### Junior Detective
Ages approximately 7–8

### Detective
Ages approximately 9–10

### Master Detective
Ages approximately 11–12

Difficulty should affect:

- number ranges
- complexity of wording
- number of clues
- amount of hinting

Do not describe these as school grades.

The player can change difficulty at any time.

---

# Accessibility

Include:

- large touch targets
- keyboard navigation
- visible focus indicators
- high contrast text
- reduced-motion support
- readable fonts
- no critical information conveyed through colour alone

Support screen-reader-friendly labels where practical.

---

# Audio

Create an audio architecture but keep actual sounds optional.

Support:

- background music toggle
- sound effects toggle
- character sound effects

Do not autoplay loud audio.

Save sound preferences locally.

---

# PWA Requirements

Implement the application as a proper Progressive Web App.

Include:

- web app manifest
- installable experience
- icons
- service worker
- offline shell
- cached case assets
- responsive design
- standalone display mode

The Bakery cases should remain playable after the application has been loaded previously without internet access.

Provide an offline indicator if the browser loses connectivity.

---

# Technology

Prefer:

- React
- TypeScript
- Vite
- CSS Modules, Tailwind CSS, or a similarly maintainable styling solution
- IndexedDB
- Workbox or an equivalent service-worker solution

Use a component architecture that can later support many towns, locations, characters, cases, and puzzles.

Avoid unnecessary dependencies.

---

# Suggested Architecture

Organise the project approximately like this:

src/
  app/
  components/
  game/
    cases/
    characters/
    dialogue/
    puzzles/
    clues/
    rewards/
  pages/
    TownMap/
    Bakery/
    Clubhouse/
  data/
    cases/
    characters/
    items/
  storage/
  pwa/
  hooks/
  utils/
  assets/

Cases should primarily be defined using structured data rather than hardcoded page logic.

For example:

cases/
  missing-cookies.ts
  giant-cupcake.ts
  mystery-recipe.ts

Each case definition should contain:

- title
- description
- scenes
- dialogue
- clues
- puzzles
- conclusion
- rewards

Design the engine so additional case packs can be added later.

---

# State Management

Keep state management reasonably lightweight.

Separate:

- persistent player state
- current case session state
- UI state

Avoid building an unnecessarily complicated global state architecture.

---

# Navigation

Main flow:

Home
↓
Town Map
↓
Bakery
↓
Case Selection
↓
Mystery
↓
Case Conclusion
↓
Rewards
↓
Clubhouse / Town Map

Allow the user to leave a case and resume it later.

---

# Home Screen

Create a polished title screen.

Show:

TINY TOWN DETECTIVES

Subtitle:

"Every clue counts."

Primary button:

🔎 Start Detecting

If a save exists:

🔎 Continue Adventure

Secondary option:

⚙️ Settings

---

# First-Time Experience

On the first launch:

1. Show title
2. Ask for detective nickname
3. Choose avatar
4. Choose difficulty
5. Introduce the clubhouse
6. Unlock Bakery
7. Begin the first mystery

Keep onboarding short.

Do not require registration.

---

# Animation

Use lightweight animations for:

- clue discovery
- stars
- dialogue bubbles
- character expressions
- reward reveals
- scene transitions

Avoid excessive animation.

Respect prefers-reduced-motion.

---

# Responsive Layout

Prioritise:

1. Tablet
2. Mobile
3. Desktop

The game should work especially well in landscape orientation on tablets.

Do not require landscape orientation.

---

# Developer Experience

Include:

- ESLint
- formatting
- clear TypeScript types
- reusable components
- sensible naming
- README
- development commands
- production build command

Add comments only where they clarify non-obvious game logic.

---

# Testing

Add tests for important game logic such as:

- reward calculation
- puzzle answer validation
- save/load
- progress unlocking
- case completion

Avoid spending excessive time testing purely visual components.

---

# README

Create a README explaining:

- game concept
- architecture
- how to install
- how to run locally
- how to build
- how PWA caching works
- where case definitions live
- how to add a new mystery
- how player saves work

---

# Priority Order

Build in this order:

1. Project skeleton
2. Core visual theme
3. Player save system
4. Town map
5. Bakery location
6. Dialogue system
7. Puzzle engine
8. Clue notebook
9. First mystery
10. Remaining two mysteries
11. Rewards
12. Clubhouse
13. PWA/offline support
14. Polish and animation
15. Tests and README

Keep the application runnable throughout development.

Do not over-engineer future features before the MVP works.

The final result should feel like a small but genuine children's adventure game, not a prototype dashboard.

Most importantly:

**The learning activity should always serve the mystery. The mystery should never feel like a wrapper around a worksheet.**