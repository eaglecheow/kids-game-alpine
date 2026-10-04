export type Difficulty = 'junior' | 'detective' | 'master';
export type Location = 'bakery' | 'park';

export interface CaseSession {
  caseId: string;
  clues: string[];
  solved: string[];
  introSeen: boolean;
}

export interface RoomPlacement {
  id: string;
  // Center coordinates, as percentages of the fixed 4:3 clubhouse canvas.
  x: number;
  y: number;
}

export interface Player {
  version: 2;
  nickname: string;
  avatar: number;
  hat: 'cap' | 'beanie' | 'bow';
  difficulty: Difficulty;
  stars: number;
  coins: number;
  completed: string[];
  stickers: string[];
  unlocked: string[];
  roomItems: RoomPlacement[]; // Back-to-front display order.
  sound: boolean;
  music: boolean;
  onboarded: boolean;
  session: CaseSession | null;
}

interface PuzzleDetails {
  id: string;
  title: string;
  question: string;
  hint: string;
  success: string;
}

export interface TilePlacement {
  tileId: string;
  turns: number;
}

export type PuzzleAnswer = number | string[] | Record<string, string> | (TilePlacement | null)[];

export type Puzzle =
  | (PuzzleDetails & { type: 'number'; answer: number; unit?: string })
  | (PuzzleDetails & { type: 'sequence'; cards: string[]; answer: string[] })
  | (PuzzleDetails & { type: 'choice'; options: string[]; answer: number })
  | (PuzzleDetails & {
      type: 'route';
      rows: number;
      columns: number;
      blocked: string[];
      start: string;
      end: string;
      checkpoints: string[];
      landmarks: Record<string, string>;
      answer: string[];
    })
  | (PuzzleDetails & {
      type: 'sort';
      objects: { id: string; label: string; icon: string; description: string; picture?: string }[];
      trays: { id: string; label: string; icon: string; rule: string; picture?: string }[];
      answer: Record<string, string>;
    })
  | (PuzzleDetails & {
      type: 'tiles';
      rows: number;
      columns: number;
      image: string;
      rotation: boolean;
      tiles: {
        id: string;
        label: string;
        description: string;
        sourceIndex: number;
        initialTurns: number;
        acceptedTurns: number[];
      }[];
      answer: TilePlacement[];
    });

export interface Clue {
  id: string;
  title: string;
  description: string;
  icon: string;
  character: 'ben' | 'hamster' | 'pip';
  puzzleId?: string;
  hotspot?: { x: number; y: number };
  discovery?: string;
}

export interface GameCase {
  id: string;
  location: Location;
  title: string;
  description: string;
  tag: string;
  icon: string;
  accent: string;
  intro: string;
  clues: Clue[];
  puzzles: Puzzle[];
  conclusions: string[];
  answer: number;
  reveal: string;
  repairLabel?: string;
  rewards: { stars: number; coins: number; sticker: string; decoration: string };
}

export const decorations: {
  id: string;
  name: string;
  icon: string;
  price: number;
  // Legacy save metadata; decorations can now be placed anywhere in the room.
  slot: 'wall' | 'floor' | 'desk' | 'shelf';
}[] = [
  { id: 'lamp', name: 'Detective lamp', icon: '💡', price: 20, slot: 'desk' },
  { id: 'globe', name: 'Adventure globe', icon: '🌍', price: 30, slot: 'desk' },
  { id: 'cookie-trophy', name: 'Cookie trophy', icon: '🏆', price: 40, slot: 'shelf' },
  { id: 'magnifying-poster', name: 'Magnifying-glass poster', icon: '🔎', price: 25, slot: 'wall' },
  { id: 'hamster-plush', name: 'Hamster plush', icon: '🐹', price: 35, slot: 'shelf' },
  { id: 'pigeon-statue', name: 'Pip statue', icon: '🐦', price: 30, slot: 'shelf' },
  { id: 'bookshelf', name: 'Mystery bookshelf', icon: '📚', price: 50, slot: 'floor' },
  { id: 'rug', name: 'Cozy clue rug', icon: '🟡', price: 20, slot: 'floor' },
  { id: 'park-picnic-pennant', name: 'Picnic pennant', icon: '🦋', price: 40, slot: 'wall' },
  { id: 'park-flowerpot', name: 'Sunny flowerpot', icon: '🌼', price: 50, slot: 'desk' },
  { id: 'park-kite-mobile', name: 'Kite mobile', icon: '🪁', price: 60, slot: 'wall' },
];

export function getInitialPlayer(): Player {
  return {
    version: 2,
    nickname: 'Detective',
    avatar: 0,
    hat: 'cap',
    difficulty: 'detective',
    stars: 0,
    coins: 0,
    completed: [],
    stickers: [],
    unlocked: [],
    roomItems: [],
    sound: true,
    music: false,
    onboarded: false,
    session: null,
  };
}

export function casesFor(difficulty: Difficulty): GameCase[] {
  const level = { junior: 0, detective: 1, master: 2 }[difficulty];
  const trays = [3, 6, 9][level];
  const perTray = [4, 8, 12][level];
  const total = trays * perTray;
  const remaining = [9, 36, 81][level];
  const missing = total - remaining;
  const flourKg = [1, 2.5, 1.25][level];
  const recipeGrams = [250, 250, 125][level];
  const flourGrams = flourKg * 1000;
  const flourTimes = flourGrams / recipeGrams;
  const fraction = ['one half', 'one quarter', 'three quarters'][level];
  const cups = [2, 8, 2][level];
  const sugar = [1, 2, 1.5][level];
  const steps = [
    ['Measure the flour', 'Mix the ingredients', 'Bake the cake', 'Decorate the cake'],
    [
      'Measure the flour',
      'Mix the ingredients',
      'Bake the cake',
      'Let the cake cool',
      'Decorate the cake',
    ],
    [
      'Preheat the oven',
      'Measure the flour',
      'Mix the ingredients',
      'Bake the cake',
      'Let the cake cool',
      'Decorate the cake',
    ],
  ][level];

  return [
    {
      id: 'missing-cookies',
      location: 'bakery',
      title: 'The Missing Cookies',
      description: 'A tray of trouble. A trail of crumbs. Where did the cookies go?',
      tag: 'Counting & clever clues',
      icon: '🍪',
      accent: '#e7a557',
      intro:
        '“My cookies have vanished!” gasps Baker Ben. Pip is peeking through the window. Professor Hamster is measuring crumbs. Time to follow the evidence!',
      clues: [
        {
          id: 'cookie-trays',
          title: 'Freshly baked trays',
          icon: '🍪',
          character: 'ben',
          puzzleId: 'cookie-total',
          description: `“I baked ${trays} trays with ${perTray} cookies on every tray,” says Ben. “Can you count my whole batch?”`,
        },
        {
          id: 'cookie-counter',
          title: 'The counter count',
          icon: '🔢',
          character: 'hamster',
          puzzleId: 'cookie-missing',
          description: `“My crumb-o-meter counts ${remaining} cookies left,” squeaks Professor Hamster. “How many left the counter?”`,
        },
        {
          id: 'cookie-clipboard',
          title: 'Ben’s delivery note',
          icon: '📋',
          character: 'pip',
          puzzleId: 'cookie-timeline',
          description: `“Look!” coos Pip. “Ben wrote: 2:00 — pack ${missing} cookies in a picnic basket. I arrived at 2:15, after he carried it away.”`,
        },
        {
          id: 'cookie-basket',
          title: 'A picnic invitation',
          icon: '🧺',
          character: 'ben',
          description:
            '“A clubhouse tea party? And this basket has my name on it!” says Ben. “Oh dear. I may have forgotten something!”',
        },
        ...(level > 0
          ? [
              {
                id: 'cookie-feathers',
                title: 'A feather outside',
                icon: '🪶',
                character: 'pip' as const,
                description:
                  '“My feather is outside the closed window,” says Pip. “The latch was shut until Ben came back.”',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'cookie-receipt',
                title: 'The clubhouse receipt',
                icon: '🧾',
                character: 'hamster' as const,
                description: `“Delivered by Ben: ${missing} cookies,” reads Professor Hamster. “The clubhouse signed at 2:10 — before Pip arrived!”`,
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'number',
          id: 'cookie-total',
          title: 'Count the batch',
          question: `Ben baked ${trays} trays. Each tray held ${perTray} cookies. How many cookies did he bake altogether?`,
          answer: total,
          unit: 'cookies',
          hint:
            level === 0
              ? `Add ${perTray} for each of the ${trays} trays. You can count the groups one at a time.`
              : `Multiply the number of trays by the cookies on each tray: ${trays} × ${perTray}.`,
          success: `Ben counts the trays. “${total} cookies! That’s my whole batch. Now we have something to compare!”`,
        },
        {
          type: 'number',
          id: 'cookie-missing',
          title: 'Find the missing cookies',
          question: `${total} cookies were baked. Professor Hamster counted ${remaining} left on the counter. How many cookies are missing?`,
          answer: missing,
          unit: 'cookies',
          hint:
            level === 0
              ? `Start at ${remaining} and count up to ${total}. Each step is one missing cookie.`
              : `Take the cookies still on the counter away from the whole batch: ${total} − ${remaining}.`,
          success: `“${missing} cookies have left the counter!” squeaks Professor Hamster. “Let’s find where they went.”`,
        },
        {
          type: 'choice',
          id: 'cookie-timeline',
          title: 'Follow the delivery',
          question: `Ben packed ${missing} cookies at 2:00. Pip arrived at 2:15. Which explanation fits the note and the timing?`,
          options: [
            'Pip took the cookies before Ben packed them.',
            'Ben carried the cookies away in the picnic basket.',
            'The counter ate the cookies.',
          ],
          answer: 1,
          hint:
            level === 0
              ? 'Ben’s note says who packed the basket. Pip arrived fifteen minutes later.'
              : 'Compare who was there at 2:00 with what the delivery note says.',
          success:
            'Pip fluffs his feathers. “Thank you! I came for a chat, not a cookie caper.” The basket is our best lead!',
        },
      ],
      conclusions: [
        'Pip secretly stole the batch.',
        'Ben delivered the missing cookies to the clubhouse tea party.',
        'Professor Hamster made the cookies disappear.',
      ],
      answer: 1,
      reveal: `Ben opens the clubhouse basket. There are all ${missing} cookies! “I delivered them myself and forgot!” Pip puts on a tiny napkin. Mystery solved — tea party saved.`,
      rewards: { stars: 3, coins: 40, sticker: '🍪', decoration: 'cookie-trophy' },
    },
    {
      id: 'giant-cupcake',
      location: 'bakery',
      title: 'The Giant Cupcake',
      description: 'One tiny recipe. One very, VERY big cupcake.',
      tag: 'Measures & mystery science',
      icon: '🧁',
      accent: '#e997b5',
      intro:
        'A cupcake is nearly touching the bakery ceiling! “It was small last night!” says Ben. Professor Hamster adjusts his goggles. Pip looks for a very large plate.',
      clues: [
        {
          id: 'cupcake-bag',
          title: 'The empty flour bag',
          icon: '🌾',
          character: 'hamster',
          puzzleId: 'cupcake-grams',
          description: `“I poured in the whole ${flourKg} kg bag,” says Professor Hamster. “A kilogram is 1,000 grams. That’s quite a lot!”`,
        },
        {
          id: 'cupcake-recipe',
          title: 'The little recipe',
          icon: '📖',
          character: 'ben',
          puzzleId: 'cupcake-compare',
          description: `“My recipe needs just ${recipeGrams} g of flour,” says Ben. “Let’s compare it with that whole bag.”`,
        },
        {
          id: 'cupcake-clock',
          title: 'The experiment log',
          icon: '⏰',
          character: 'hamster',
          puzzleId: 'cupcake-timing',
          description:
            '“3:00 — I tested my pretend Grow-O powder. 3:05 — the cupcake grew!” reads Professor Hamster. “Perhaps I should have checked the amounts first.”',
        },
        {
          id: 'cupcake-pip',
          title: 'A late visitor',
          icon: '🐦',
          character: 'pip',
          description:
            '“I arrived at 3:30,” says Pip. “The cupcake was already huge. I thought the bakery had built a new balcony!”',
        },
        ...(level > 0
          ? [
              {
                id: 'cupcake-label',
                title: 'A unit mix-up',
                icon: '🏷️',
                character: 'ben' as const,
                description:
                  '“The recipe says g, but the bag says kg,” says Ben. “Those units mean different amounts, even when the numbers look small.”',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'cupcake-goggles',
                title: 'Floury goggles',
                icon: '🥽',
                character: 'hamster' as const,
                description:
                  '“My goggles have flour on them, and I signed the experiment log,” says Professor Hamster. “All the evidence points to my experiment.”',
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'number',
          id: 'cupcake-grams',
          title: 'Read the flour bag',
          question: `The bag held ${flourKg} kg of flour. 1 kg = 1,000 g. How many grams were in the bag?`,
          answer: flourGrams,
          unit: 'g',
          hint:
            level === 0
              ? 'One whole kilogram is 1,000 grams. The bag held exactly one kilogram.'
              : `Multiply ${flourKg} by 1,000. ${level === 2 ? '1 kg is 1,000 g, and 0.25 kg is a quarter of that.' : 'The half kilogram adds another 500 g.'}`,
          success: `“${flourGrams} grams!” gasps Ben. “That bag was much bigger than my little recipe.”`,
        },
        {
          type: 'number',
          id: 'cupcake-compare',
          title: 'Spot the recipe mix-up',
          question: `The recipe needs ${recipeGrams} g. The Professor used ${flourGrams} g. How many times the recipe’s flour did he use?`,
          answer: flourTimes,
          unit: 'times',
          hint:
            level === 0
              ? `Count groups of ${recipeGrams}: 250, 500, 750, 1,000. How many groups?`
              : `Divide the flour used by the flour needed: ${flourGrams} ÷ ${recipeGrams}.`,
          success: `Professor Hamster’s goggles wobble. “${flourTimes} times the flour! My pretend growth experiment got a rather large helping.”`,
        },
        {
          type: 'choice',
          id: 'cupcake-timing',
          title: 'Check the clock',
          question:
            'The Professor experimented at 3:00. The cupcake grew at 3:05. Pip arrived at 3:30. Who was there before it grew?',
          options: [
            'Professor Hamster, during his experiment.',
            'Pip, after the cupcake was already giant.',
            'Nobody: the log shows no visitors.',
          ],
          answer: 0,
          hint:
            level === 0
              ? '3:00 is before 3:05. 3:30 is after it. Who was there at 3:00?'
              : 'Find the event that happened before 3:05, then match it with a character.',
          success:
            'Pip nods. “That’s the timeline!” Professor Hamster raises a floury paw. “I think I owe Ben an explanation.”',
        },
      ],
      conclusions: [
        'Professor Hamster mixed up the flour amount during his growth experiment.',
        'Pip made the cupcake grow by flapping his wings.',
        'Ben secretly ordered a cupcake-sized house.',
      ],
      answer: 0,
      reveal: `Professor Hamster admits he used ${flourTimes} times the recipe’s flour with his silly Grow-O experiment. His pretend Shrink-O spoon returns the cupcake to normal. “Next time: check the units!” Pip orders one sensible slice.`,
      rewards: { stars: 3, coins: 50, sticker: '🧁', decoration: 'hamster-plush' },
    },
    {
      id: 'mystery-recipe',
      location: 'bakery',
      title: 'The Mystery Recipe',
      description: 'The recipe is in a muddle. Help put a delicious plan back together.',
      tag: 'Order, fractions & logic',
      icon: '📖',
      accent: '#a2cbb1',
      intro:
        'Recipe cards are scattered across the bakery! Ben is holding a whisk and a card that says “Decorate”. “That can’t be first!” he says. Can you untangle the recipe and discover the muddle?',
      clues: [
        {
          id: 'recipe-steps',
          title: 'Ben’s recipe memory',
          icon: '📝',
          character: 'ben',
          puzzleId: 'recipe-order',
          description: `“I remember!” says Ben. “${steps.join(' → ')}.” ${level === 0 ? 'The cake should be cool before you decorate it.' : 'Each step gets the cake ready for the next one.'}`,
        },
        {
          id: 'recipe-fraction',
          title: 'The sugar note',
          icon: '🥄',
          character: 'hamster',
          puzzleId: 'recipe-sugar',
          description: `“Use ${fraction} of ${cups} cups of sugar,” reads Professor Hamster. “We can measure that part without guessing.”`,
        },
        {
          id: 'recipe-pip',
          title: 'What Pip saw',
          icon: '🪶',
          character: 'pip',
          puzzleId: 'recipe-evidence',
          description:
            '“Ben waved the loose recipe cards like a fan,” coos Pip. “Whoosh! They fluttered to the floor. I came inside to help after that.”',
        },
        {
          id: 'recipe-fan',
          title: 'An unusual fan',
          icon: '🪭',
          character: 'ben',
          description:
            '“The oven made me warm, so I fanned my face with the cards,” admits Ben. “I didn’t notice they were coming loose!”',
        },
        ...(level > 0
          ? [
              {
                id: 'recipe-icing',
                title: 'The icing reminder',
                icon: '🎂',
                character: 'hamster' as const,
                description:
                  '“Warm cakes melt icing,” says Professor Hamster. “That’s why cooling belongs after baking and before decorating.”',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'recipe-oven',
                title: 'The oven reminder',
                icon: '🔥',
                character: 'ben' as const,
                description:
                  '“For this recipe, switch on the oven first,” says Ben. “It warms up while we measure and mix.”',
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'sequence',
          id: 'recipe-order',
          title: 'Rebuild the recipe',
          question:
            'Arrange the cards from first to last. Ben’s recipe memory in your notebook will help!',
          cards: [...steps.slice(2), ...steps.slice(0, 2)],
          answer: [...steps],
          hint:
            level === 0
              ? 'Measure before you mix. Mix before you bake. Decorate last, once the cake is cool.'
              : level === 1
                ? 'What must happen before baking? What keeps the icing from melting afterward?'
                : 'Ben switches on the oven first so it warms up while he prepares the ingredients.',
          success:
            'Ben follows the cards with his whisk. “Now that’s a recipe! No more icing on raw flour.”',
        },
        {
          type: 'number',
          id: 'recipe-sugar',
          title: 'Measure just enough sugar',
          question: `The note asks for ${fraction} of ${cups} cups of sugar. How many cups should you measure?`,
          answer: sugar,
          unit: 'cups',
          hint:
            level === 0
              ? 'Split two cups into two equal parts. Use one of those parts.'
              : level === 1
                ? 'Split eight cups into four equal parts. Use one part: 8 ÷ 4.'
                : 'One quarter of two cups is half a cup. Take three of those quarter portions.',
          success: `“${sugar} ${sugar === 1 ? 'cup' : 'cups'}!” squeaks Professor Hamster. “A carefully measured portion for a delicious cake.”`,
        },
        {
          type: 'choice',
          id: 'recipe-evidence',
          title: 'Solve the card caper',
          question:
            'Pip saw Ben waving the loose cards. Ben remembers using them as a fan. Pip came inside after they fell. What fits both accounts?',
          options: [
            'Pip mixed the cards before entering.',
            'Ben’s recipe-card fan scattered the cards.',
            'Professor Hamster erased the recipe.',
          ],
          answer: 1,
          hint:
            level === 0
              ? 'Both Ben and Pip mention the same fan. Who was holding it?'
              : 'Find the explanation supported by both witnesses, in the order the events happened.',
          success:
            'Pip bows. “Two matching clues!” Ben grins sheepishly. “I suppose a recipe makes a better plan than a fan.”',
        },
      ],
      conclusions: [
        'Pip shuffled the cards as a prank.',
        'Ben used the loose cards as a fan and scattered them.',
        'Professor Hamster hid the instructions with invisible ink.',
      ],
      answer: 1,
      reveal:
        'Ben clips the recipe cards together and finds a proper fan. Everyone follows your restored recipe to bake a celebration cake. Pip gets the job of tasting one crumb. “A very important job,” he coos.',
      rewards: { stars: 3, coins: 60, sticker: '👩‍🍳', decoration: 'magnifying-poster' },
    },
    ...parkCases(level),
  ];
}

function routeBoard(
  level: number,
  kind: 'bench' | 'flowers' | 'kites',
): Pick<
  Extract<Puzzle, { type: 'route' }>,
  'rows' | 'columns' | 'blocked' | 'start' | 'end' | 'checkpoints' | 'landmarks' | 'answer'
> {
  const size = level === 0 ? 4 : 5;
  if (kind === 'flowers') {
    const answer =
      level === 0
        ? ['r3c1', 'r3c2', 'r3c3', 'r3c4']
        : ['r3c1', 'r3c2', 'r3c3', 'r4c3', 'r4c4', 'r4c5', 'r3c5'];
    return {
      rows: size,
      columns: size,
      blocked: ['r2c2', 'r2c4', 'r4c1'],
      start: 'r3c1',
      end: `r3c${size}`,
      checkpoints:
        level === 0 ? ['r3c2'] : level === 1 ? ['r3c3', 'r4c4'] : ['r3c3', 'r4c3', 'r4c4'],
      landmarks: {
        r3c1: '● Round blossoms at the left bed and Hamster’s stand',
        [level === 0 ? 'r3c2' : 'r3c3']: '★ Star blossoms at the middle bed',
        [`r3c${size}`]: '🔔 Bell blossoms at the right bed',
        r4c3: '🔎 Leaf observation marker',
        r4c4: '🏷️ Label-holder marker',
      },
      answer,
    };
  }
  return {
    rows: size,
    columns: size,
    blocked: level === 2 ? ['r2c1', 'r2c3'] : ['r1c3', 'r2c1', 'r2c3', 'r4c2'],
    start: 'r1c1',
    end: `r${size}c${size}`,
    checkpoints: level === 0 ? ['r2c2'] : level === 1 ? ['r2c2', 'r3c3'] : ['r2c2', 'r3c3', 'r4c4'],
    landmarks:
      kind === 'bench'
        ? {
            r1c1: '🚪 Entrance gate',
            r2c2: '🛞 Trolley tracks beside the sign',
            r3c3: '🧾 Delivery stop',
            r4c4: '🌻 Sunflower marker',
            [`r${size}c${size}`]: '🧺 Basket at the sunflower bench',
          }
        : {
            r1c1: '🪁 Grounded kite display',
            r2c2: '🎀 Ribbon scrap',
            r3c3: '〰️ Patterned ribbon scrap',
            r4c4: '📦 Craft-table marker',
            [`r${size}c${size}`]: '📦 Pip’s labelled ribbon box',
          },
    answer: [
      'r1c1',
      'r1c2',
      'r2c2',
      'r3c2',
      'r3c3',
      'r3c4',
      'r4c4',
      ...(level === 0 ? [] : ['r4c5', 'r5c5']),
    ],
  };
}

function sortingTray(level: number, kind: 'bench' | 'flowers' | 'kites') {
  const trays = {
    bench: [
      {
        id: 'butterfly',
        label: 'Butterfly bench',
        icon: '🦋',
        rule: 'Tags with a butterfly destination stamp.',
      },
      {
        id: 'sunflower',
        label: 'Sunflower bench',
        icon: '🌻',
        rule: 'Tags with a sunflower destination stamp.',
      },
      {
        id: 'acorn',
        label: 'Acorn table',
        icon: '🌰',
        rule: 'Tags with an acorn destination stamp.',
      },
    ],
    flowers: [
      { id: 'round', label: 'Round blossoms', icon: '●', rule: 'Round blossoms with oval leaves.' },
      {
        id: 'star',
        label: 'Star blossoms',
        icon: '★',
        rule: 'Pointed star blossoms with narrow leaves.',
      },
      {
        id: 'bell',
        label: 'Bell blossoms',
        icon: '🔔',
        rule: 'Hanging bell blossoms with curved leaves.',
      },
    ],
    kites: [
      {
        id: 'tails',
        label: 'Kite tails',
        icon: '🪁',
        rule: 'Long patterned ribbons with an attachment loop.',
        picture: '/park-kite-samples.svg#striped-tail',
      },
      {
        id: 'parcels',
        label: 'Parcel ribbons',
        icon: '🎁',
        rule: 'Flat-ended ribbons that tie around a parcel.',
        picture: '/park-kite-samples.svg#parcel-ribbon',
      },
      {
        id: 'flags',
        label: 'Picnic flags',
        icon: '🚩',
        rule: 'Triangular flags with a hanging tab.',
        picture: '/park-kite-samples.svg#picnic-flag',
      },
    ],
  }[kind];
  const examples = {
    bench: [
      [
        'picnic-tag',
        'Picnic basket tag',
        '🦋',
        'Butterfly destination stamp; straight border.',
        'butterfly',
      ],
      [
        'butterfly-tag',
        'Small delivery tag',
        '🦋',
        'Butterfly destination stamp; dotted border.',
        'butterfly',
      ],
      [
        'sunflower-tag',
        'Flower delivery tag',
        '🌻',
        'Sunflower destination stamp; straight border.',
        'sunflower',
      ],
      ['acorn-tag', 'Acorn delivery tag', '🌰', 'Acorn destination stamp; dotted border.', 'acorn'],
      [
        'sunflower-tag-two',
        'Long delivery tag',
        '🌻',
        'Sunflower destination stamp; striped border.',
        'sunflower',
      ],
      [
        'acorn-tag-two',
        'Square delivery tag',
        '🌰',
        'Acorn destination stamp; straight border.',
        'acorn',
      ],
      [
        'butterfly-flower-border',
        'Flower-edged tag',
        '🦋',
        'Butterfly destination stamp; sunflower-patterned border.',
        'butterfly',
      ],
      [
        'acorn-butterfly-border',
        'Butterfly-edged tag',
        '🌰',
        'Acorn destination stamp; butterfly-patterned border.',
        'acorn',
      ],
    ],
    flowers: [
      ['round-sign', 'Round flower sign', '●', 'Round blossom and oval leaves.', 'round'],
      ['star-sign', 'Star flower sign', '★', 'Pointed blossom and narrow leaves.', 'star'],
      ['bell-sign', 'Bell flower sign', '🔔', 'Hanging blossom and curved leaves.', 'bell'],
      [
        'round-sign-two',
        'Small round sign',
        '●',
        'Round blossom and oval leaves on a striped card.',
        'round',
      ],
      [
        'star-sign-two',
        'Small star sign',
        '★',
        'Pointed blossom and narrow leaves on a dotted card.',
        'star',
      ],
      [
        'bell-sign-two',
        'Small bell sign',
        '🔔',
        'Hanging blossom and curved leaves on a striped card.',
        'bell',
      ],
      [
        'round-star-border',
        'Star-edged flower sign',
        '●',
        'Round blossom and oval leaves; decorative stars on the border.',
        'round',
      ],
      [
        'bell-round-border',
        'Round-edged flower sign',
        '🔔',
        'Hanging blossom and curved leaves; decorative circles on the border.',
        'bell',
      ],
    ],
    kites: [
      [
        'striped-tail',
        'Striped ribbon sample',
        '〰️',
        'Long striped ribbon with an attachment loop.',
        'tails',
        '/park-kite-samples.svg#striped-tail',
      ],
      [
        'dotted-tail',
        'Dotted ribbon sample',
        '•••',
        'Long dotted ribbon with an attachment loop.',
        'tails',
        '/park-kite-samples.svg#dotted-tail',
      ],
      [
        'zigzag-tail',
        'Zigzag ribbon sample',
        '⚡',
        'Long zigzag ribbon with an attachment loop.',
        'tails',
        '/park-kite-samples.svg#zigzag-tail',
      ],
      [
        'parcel-ribbon',
        'Parcel ribbon sample',
        '🎁',
        'Flat-ended striped ribbon; no attachment loop.',
        'parcels',
        '/park-kite-samples.svg#parcel-ribbon',
      ],
      [
        'picnic-flag',
        'Picnic flag sample',
        '🚩',
        'Triangular flag with a hanging tab.',
        'flags',
        '/park-kite-samples.svg#picnic-flag',
      ],
      [
        'parcel-ribbon-two',
        'Short parcel sample',
        '🎁',
        'Flat-ended dotted ribbon; no attachment loop.',
        'parcels',
        '/park-kite-samples.svg#parcel-ribbon-two',
      ],
      [
        'zigzag-parcel',
        'Zigzag parcel sample',
        '⚡',
        'Zigzag pattern with flat ends; no attachment loop.',
        'parcels',
        '/park-kite-samples.svg#zigzag-parcel',
      ],
      [
        'striped-flag',
        'Striped flag sample',
        '〰️',
        'Striped triangle with a hanging tab.',
        'flags',
        '/park-kite-samples.svg#striped-flag',
      ],
    ],
  }[kind].slice(0, 4 + level * 2);
  return {
    objects: examples.map(([id, label, icon, description, , picture]) => ({
      id,
      label,
      icon,
      description,
      picture,
    })),
    trays,
    answer: Object.fromEntries(examples.map(([id, , , , tray]) => [id, tray])),
  };
}

function pictureBoard(level: number, kind: 'sign' | 'flowers' | 'kites') {
  const columns = 2;
  const rows = level === 2 ? 3 : 2;
  const fragments = {
    sign:
      level === 2
        ? [
            [
              'Gate arch and entrance path',
              'Gate arch crosses a side edge; entrance path reaches the lower edge.',
            ],
            [
              'Gate crossbar and acorn marker',
              'Gate crossbar crosses a side edge; an acorn mark sits beside the path.',
            ],
            [
              'Picnic arrow and butterfly bench',
              'Left-pointing arrowhead above a butterfly bench; bench outlines cross the lower edge.',
            ],
            [
              'Arrow shaft and sunflower bench',
              'Arrow shaft meets a side edge; sunflower bench outlines cross the lower edge.',
            ],
            [
              'Butterfly bench feet and vine',
              'Bench feet enter the upper edge; blanket and butterfly vine meet the border.',
            ],
            [
              'Sunflower bench feet and acorn vine',
              'Bench feet and sign base enter the upper edge; an acorn sits beside the vine.',
            ],
          ]
        : [
            [
              'Gate and arrowhead',
              'Gate arch meets a side edge; a left-pointing arrowhead sits above a path at the lower edge.',
            ],
            [
              'Gate and acorn',
              'Gate crossbar and arrow shaft meet a side edge; an acorn marks the border.',
            ],
            [
              'Butterfly bench and blanket',
              'Butterfly bench above a blanket; the curving path enters the upper and side edges.',
            ],
            [
              'Sunflower bench and sign base',
              'Sunflower bench beside the sign base; the curving path enters the upper and side edges.',
            ],
          ],
    flowers:
      level === 2
        ? [
            [
              'Gate and butterfly',
              'Gate crossbar meets a side edge; a butterfly marks the picture border.',
            ],
            [
              'Gate and open path',
              'Gate crossbar meets a side edge; the straight path crosses the lower edge.',
            ],
            [
              'Round blossoms and star petals',
              'Beds and path cross a side edge; flower-label stems reach the lower edge.',
            ],
            [
              'Bell blossoms and star petals',
              'Beds and path cross a side edge; label stems reach the lower edge beside a round margin mark.',
            ],
            [
              'Planting curve and butterfly vine',
              'Flower-label stems enter the upper edge; planting curve and butterfly vine cross a side edge.',
            ],
            [
              'Planting curve and acorn vine',
              'Flower-label stems enter the upper edge; planting curve and vine cross a side edge beside an acorn.',
            ],
          ]
        : [
            [
              'Gate and round petals',
              'Gate arch meets a side edge; round blossoms cross the lower edge.',
            ],
            [
              'Gate and bell petals',
              'Gate crossbar meets a side edge; bell blossoms cross the lower edge.',
            ],
            [
              'Round label and curving path',
              'Round and star stems cross the upper edge; the planting curve continues across a side edge.',
            ],
            [
              'Bell label and acorn',
              'Bell and star stems cross the upper edge; the curve continues across a side edge beside an acorn.',
            ],
          ],
    kites:
      level === 2
        ? [
            [
              'Gate and butterfly mark',
              'Gate arch meets a side edge; the string curve crosses the lower edge beside a butterfly.',
            ],
            [
              'Gate and acorn mark',
              'Gate arch meets a side edge; the string curve crosses the lower edge beside an acorn.',
            ],
            [
              'Striped kite and dotted kite',
              'Striped kite body and tail cross the lower edge; the dotted kite continues across a side edge.',
            ],
            [
              'Zigzag kite and dotted kite',
              'Zigzag kite body and tail cross the lower edge; the dotted kite continues across a side edge.',
            ],
            [
              'Striped bow and butterfly vine',
              'Striped tail enters the upper edge; the butterfly vine crosses a side edge.',
            ],
            [
              'Zigzag bow and acorn vine',
              'Zigzag and dotted tails enter the upper edge; the acorn vine crosses a side edge.',
            ],
          ]
        : [
            [
              'Striped kite and gate arch',
              'Gate arch meets a side edge; striped and dotted kite bodies continue across the lower edge.',
            ],
            [
              'Zigzag kite and acorn',
              'Gate arch meets a side edge; zigzag and dotted kite bodies continue across the lower edge beside an acorn.',
            ],
            [
              'Striped tail and little box',
              'Striped kite enters the upper edge, with patterned bows below; dotted tail crosses a side edge beside a little box.',
            ],
            [
              'Zigzag tail and round mark',
              'Zigzag kite enters the upper edge, with patterned bows below; dotted bows and a round margin mark are nearby.',
            ],
          ],
  }[kind];
  const answer = Array.from({ length: columns * rows }, (_, sourceIndex) => ({
    tileId: `${kind}-fragment-${sourceIndex + 1}`,
    turns: 0,
  }));
  return {
    rows,
    columns,
    image: `/park-${kind}${level === 2 ? '-master' : ''}.svg`,
    rotation: level > 0,
    tiles: answer
      .map(({ tileId }, sourceIndex) => ({
        id: tileId,
        label: fragments[sourceIndex][0],
        description: fragments[sourceIndex][1],
        sourceIndex,
        initialTurns: level === 0 ? 0 : (sourceIndex % 3) + 1,
        acceptedTurns: [0],
      }))
      .reverse(),
    answer,
  };
}

function parkCases(level: number): GameCase[] {
  return [
    {
      id: 'park-wrong-bench',
      location: 'park',
      title: 'The Picnic at the Wrong Bench',
      description: 'A picnic blanket. An empty basket spot. Follow the trail to lunch!',
      tag: 'Maps, sorting & picture clues',
      icon: '🧺',
      accent: '#e6b96a',
      intro:
        '“I followed the picnic arrow,” says Ben. “Where is our basket?” Find it and bring it to the butterfly bench.',
      clues: [
        {
          id: 'park-bench-trail',
          title: 'Trolley trail',
          icon: '🛞',
          character: 'ben',
          puzzleId: 'park-bench-route',
          hotspot: { x: 76, y: 49 },
          description:
            '“These are my trolley tracks,” says Ben. “Follow the marked stops and see where they lead.”',
          discovery:
            'The tracks lead to the intact basket at the sunflower bench. They match Ben’s delivery route.',
        },
        {
          id: 'park-bench-tags',
          title: 'Delivery tags',
          icon: '🦋',
          character: 'pip',
          puzzleId: 'park-bench-sort',
          hotspot: { x: 85, y: 55 },
          description:
            '“Each tag has a destination stamp,” says Pip. “The picnic tag is here too. Group matching stamps.”',
          discovery:
            'The picnic basket’s tag belongs to the butterfly bench, rather than the sunflower bench where it was found.',
        },
        {
          id: 'park-bench-picture',
          title: 'Original sign picture',
          icon: '🧩',
          character: 'hamster',
          puzzleId: 'park-bench-tiles',
          hotspot: { x: 53, y: 43 },
          description:
            '“This separate picture shows the sign when it was put up,” says Hamster. “Join its edges. Keep the gate upright.”',
          discovery:
            'With its gate upright, the original picture points the picnic arrow toward the butterfly bench. Today’s arrow points toward the sunflower bench.',
        },
        {
          id: 'park-bench-collar',
          title: 'Loose sign collar',
          icon: '↪️',
          character: 'pip',
          hotspot: { x: 50, y: 34 },
          description:
            'The sign swivels in its loose collar. Ben’s delivery slip shows him following its arrow. A ribbon flutters as the breeze gently turns the sign.',
        },
        ...(level > 0
          ? [
              {
                id: 'park-bench-seal',
                title: 'An intact basket seal',
                icon: '🎀',
                character: 'ben' as const,
                hotspot: { x: 88, y: 42 },
                description:
                  '“My seal is still tied,” says Ben. “Everything inside the basket is safe.”',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'park-bench-wheel',
                title: 'Matching wheel marks',
                icon: '🛞',
                character: 'hamster' as const,
                hotspot: { x: 72, y: 58 },
                description:
                  'The small wheel marks beside the sunflower bench match Ben’s trolley wheels.',
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'route',
          id: 'park-bench-route',
          title: 'Follow the trolley',
          question:
            'Start at the gate. Visit the numbered stops in order, then reach the basket. Stay on open cells.',
          ...routeBoard(level, 'bench'),
          hint:
            level === 0
              ? 'Select Start, then an adjoining open cell. Visit stop 1 before the basket.'
              : 'Move one cell up, down, left, or right. Visit every numbered stop in order; Undo helps you try another path.',
          success: 'Ben’s trolley reached the sunflower bench. There is the intact picnic basket!',
        },
        {
          type: 'sort',
          id: 'park-bench-sort',
          title: 'Read the delivery stamps',
          question:
            'Select a tag, then its destination tray. Use the stamp, rather than the border decoration.',
          ...sortingTray(level, 'bench'),
          hint: 'The butterfly stamp goes with the butterfly bench. Match the other destination stamps in the same way.',
          success:
            'The picnic tag has a butterfly stamp. The basket belongs at the butterfly bench!',
        },
        {
          type: 'tiles',
          id: 'park-bench-tiles',
          title: 'Rebuild the sign picture',
          question: 'Join the picture fragments. The gate belongs at the top of the picture.',
          ...pictureBoard(level, 'sign'),
          hint:
            level === 0
              ? 'Select a fragment, then an empty space. Match the picture edges and the gate marker.'
              : 'Match the picture edges and keep the gate upright. Rotate a fragment if its lines point the wrong way.',
          success:
            'The original arrow points toward the butterfly bench. Today’s arrow has turned toward the sunflower bench.',
        },
      ],
      conclusions: [
        'Ben chose the sunflower bench even though the sign pointed to the butterfly bench.',
        'Ben followed a turned sign and delivered the basket to the wrong bench.',
        'Pip carried the basket away after Ben delivered it.',
      ],
      answer: 1,
      reveal:
        'The original arrow, butterfly tag, and trolley trail agree: Ben followed a sign that had turned in its loose collar. You found the mix-up! Put the basket on its blanket and secure the sign.',
      repairLabel: 'Put our picnic in place',
      rewards: { stars: 3, coins: 40, sticker: '🦋', decoration: 'park-picnic-pennant' },
    },
    {
      id: 'park-flower-signs',
      location: 'park',
      title: 'The Mixed Up Flower Signs',
      description: 'Lovely blossoms. Muddled signs. Which labels belong to these beds?',
      tag: 'Observation, shapes & orientation',
      icon: '🌼',
      accent: '#9ecb91',
      intro:
        '“The flowers look lovely. Their signs look muddled!” says Ben. Put the right signs beside the flowers.',
      clues: [
        {
          id: 'park-flowers-path',
          title: 'Label-delivery path',
          icon: '🌿',
          character: 'hamster',
          puzzleId: 'park-flowers-route',
          hotspot: { x: 49, y: 62 },
          description:
            '“My stand is beside the first bed,” says Hamster. “Visit the marked stops and look at the flowers in all three beds.”',
          discovery:
            'Round blossoms grow on the left, star blossoms in the middle, and bell blossoms on the right. All the plants are healthy.',
        },
        {
          id: 'park-flowers-tray',
          title: 'Flower label tray',
          icon: '🏷️',
          character: 'ben',
          puzzleId: 'park-flowers-sort',
          hotspot: { x: 68, y: 70 },
          description:
            '“This key shows the blossom and leaf shapes,” says Ben. “Sort the signs using those shapes.”',
          discovery:
            'The round sign belongs with oval leaves, the star sign with narrow leaves, and the bell sign with curved leaves. The two outer signs do not match their beds.',
        },
        {
          id: 'park-flowers-master',
          title: 'Master planting map',
          icon: '🧩',
          character: 'hamster',
          puzzleId: 'park-flowers-tiles',
          hotspot: { x: 26, y: 72 },
          description:
            '“These pieces are a separate master map,” says Hamster. “Put it together with the entrance gate at the top.”',
          discovery:
            'The upright master map matches the actual flowerbeds: round, star, bell from left to right. Turning it upside down swaps the outer bed positions.',
        },
        {
          id: 'park-flowers-copy',
          title: 'Working map at the stand',
          icon: '🗺️',
          character: 'pip',
          hotspot: { x: 12.7, y: 75 },
          description:
            'The intact working copy’s gate marker is at the stand’s lower edge. Hamster’s stamped placement note points from this copy to the label tray.',
        },
        ...(level > 0
          ? [
              {
                id: 'park-flowers-middle',
                title: 'The middle bed matches',
                icon: '★',
                character: 'ben' as const,
                hotspot: { x: 50, y: 52 },
                description:
                  'The middle star-blossom sign matches its flowers. Only the two outer signs are swapped.',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'park-flowers-holders',
                title: 'Label-holder marks',
                icon: '🏷️',
                character: 'hamster' as const,
                hotspot: { x: 73, y: 57 },
                description:
                  'The holders have paired outer marks. Their positions match a half-turn of the working map.',
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'route',
          id: 'park-flowers-route',
          title: 'Visit the flowerbeds',
          question:
            'Start beside the round blossoms. Visit the numbered stops in order, then reach the bell blossoms.',
          ...routeBoard(level, 'flowers'),
          hint:
            level === 0
              ? 'Select Start beside the round flowers. Pass stop 1 at the star flowers, then reach the bell flowers.'
              : 'The start, star-blossom stop, and finish show all three beds. Follow the other numbered observation stops in order too.',
          success:
            'You observed every bed: round blossoms on the left, star blossoms in the middle, bell blossoms on the right.',
        },
        {
          type: 'sort',
          id: 'park-flowers-sort',
          title: 'Group the flower signs',
          question: 'Match each sign’s blossom and leaves to the tray’s picture key.',
          ...sortingTray(level, 'flowers'),
          hint: 'Look at the blossom and the leaves together. Round blossoms have oval leaves. Border decorations do not change the flower group.',
          success:
            'The signs are grouped by flower shape. The two outer signs were placed beside different blossoms!',
        },
        {
          type: 'tiles',
          id: 'park-flowers-tiles',
          title: 'Join the master map',
          question:
            'Join the map picture with the gate at the top. Look for continuous paths and bed shapes.',
          ...pictureBoard(level, 'flowers'),
          hint:
            level === 0
              ? 'Select a fragment, then a space. Match the gate border and the path edges.'
              : 'Keep the gate upright. Match paths and blossom outlines; Rotate changes a fragment by one quarter-turn.',
          success:
            'The upright map agrees with the flowers. The working copy’s lower gate shows why the outer signs were reversed.',
        },
      ],
      conclusions: [
        'Hamster used his map upside down and swapped the outer flower signs.',
        'Ben moved the flowers into different beds after the signs were placed.',
        'Pip changed the flowers’ shapes while tidying.',
      ],
      answer: 0,
      reveal:
        'Your observations match the upright master map. Hamster placed the signs using the working copy with its gate at the bottom. That half-turn swapped the outer signs. Put the signs beside their matching flowers.',
      repairLabel: 'Match the signs to the flowers',
      rewards: { stars: 3, coins: 50, sticker: '🌼', decoration: 'park-flowerpot' },
    },
    {
      id: 'park-kite-tails',
      location: 'park',
      title: 'The Missing Kite Tails',
      description: 'Three grounded kites have empty loops. Where are their patterned tails?',
      tag: 'Visual trails, patterns & parts',
      icon: '🪁',
      accent: '#9ebed4',
      intro:
        '“Our display kites have no tails,” says Ben. “Can you find them?” Find the tails and put them back on the low display.',
      clues: [
        {
          id: 'park-kites-trail',
          title: 'Ribbon trail',
          icon: '🎀',
          character: 'pip',
          puzzleId: 'park-kites-route',
          hotspot: { x: 76, y: 80 },
          description:
            '“Follow these ribbon scraps to the low craft table,” says Pip. “The numbered markers show where to look.”',
          discovery:
            'The trail reaches Pip’s labelled box. Inside are three intact rolled ribbons with stripes, dots, and zigzags.',
        },
        {
          id: 'park-kites-tray',
          title: 'Ribbon sample tray',
          icon: '〰️',
          character: 'hamster',
          puzzleId: 'park-kites-sort',
          hotspot: { x: 85, y: 90 },
          description:
            '“These sample cards are ready to inspect,” says Hamster. “Sort by pattern and attachment shape, using the tray key.”',
          discovery:
            'The three long patterned samples have attachment loops. They are kite tails, matching the intact rolls in Pip’s box.',
        },
        {
          id: 'park-kites-picture',
          title: 'Kite-making picture',
          icon: '🧩',
          character: 'ben',
          puzzleId: 'park-kites-tiles',
          hotspot: { x: 61, y: 87 },
          description:
            '“This picture shows our complete display,” says Ben. “Join its outlines and match the patterns.”',
          discovery:
            'The striped, dotted, and zigzag tails each fit a kite’s matching pattern and empty attachment loop.',
        },
        {
          id: 'park-kites-checklist',
          title: 'Pip’s tidy checklist',
          icon: '✅',
          character: 'pip',
          hotspot: { x: 91, y: 78 },
          description:
            'Pip’s stamp marks the instruction “Roll spare ribbon into my box.” The checklist’s box symbol matches his labelled craft box.',
        },
        ...(level > 0
          ? [
              {
                id: 'park-kites-loop',
                title: 'An uncut loop',
                icon: '➰',
                character: 'hamster' as const,
                hotspot: { x: 53, y: 76 },
                description:
                  'The rolled ribbons still have their attachment loops. They can go straight back on the display.',
              },
            ]
          : []),
        ...(level > 1
          ? [
              {
                id: 'park-kites-label',
                title: 'Matching box label',
                icon: '📦',
                character: 'ben' as const,
                hotspot: { x: 89, y: 69 },
                description: 'The box label matches the symbol in Pip’s stamped tidy checklist.',
              },
            ]
          : []),
      ],
      puzzles: [
        {
          type: 'route',
          id: 'park-kites-route',
          title: 'Follow the ribbon scraps',
          question:
            'Start at the grounded kite display. Visit the numbered ribbon stops in order and reach the craft box.',
          ...routeBoard(level, 'kites'),
          hint:
            level === 0
              ? 'Select Start, then a neighbouring open cell. Visit stop 1 before reaching Pip’s box.'
              : 'Follow open neighbouring cells and visit the numbered scraps in order. You can Undo or Reset without losing rewards.',
          success:
            'Pip’s box holds three intact rolls: stripes, dots, and zigzags. The ribbon trail found them!',
        },
        {
          type: 'sort',
          id: 'park-kites-sort',
          title: 'Identify the ribbon samples',
          question:
            'Sort every sample into kite tails, parcel ribbons, or picnic flags. Check its attachment shape too.',
          ...sortingTray(level, 'kites'),
          hint: 'A kite tail is a long patterned ribbon with an attachment loop. Flat ends belong to parcel ribbons; a triangle with a tab is a flag. A tray may stay empty.',
          success:
            'Three samples belong in the kite-tail group. Their patterns and loops match the rolled ribbons!',
        },
        {
          type: 'tiles',
          id: 'park-kites-tiles',
          title: 'Complete the kite picture',
          question:
            'Join the display picture. Follow the continuous kite outlines and matching tail patterns.',
          ...pictureBoard(level, 'kites'),
          hint:
            level === 0
              ? 'Select a fragment and a space. Match stripes with stripes, dots with dots, and the picture borders.'
              : 'Match the border, outlines, and patterns. Rotate a fragment until its lines continue into the next piece.',
          success:
            'Each recovered tail matches one grounded kite. Pip’s “spare ribbon” was part of this display!',
        },
      ],
      conclusions: [
        'A breeze blew the kite tails into a tall tree.',
        'Ben used the kite tails to wrap picnic parcels.',
        'Pip thought the loose kite tails were spare ribbon and tidied them into his box.',
      ],
      answer: 2,
      reveal:
        'The trail found intact ribbons in Pip’s box. Their loops and patterns match the missing tails, and his stamped checklist records tidying “spare ribbon.” You spotted the helpful mix-up! Give the grounded kites their tails.',
      repairLabel: 'Give the kites their tails',
      rewards: { stars: 3, coins: 60, sticker: '🪁', decoration: 'park-kite-mobile' },
    },
  ];
}

export function validateAnswer(puzzle: Puzzle, answer: PuzzleAnswer): boolean {
  if (puzzle.type === 'sequence') {
    return (
      Array.isArray(answer) &&
      answer.length === puzzle.answer.length &&
      answer.every((card, index) => card === puzzle.answer[index])
    );
  }
  if (puzzle.type === 'route') {
    if (
      !Array.isArray(answer) ||
      !Array.from<unknown>(answer).every((cell) => typeof cell === 'string')
    )
      return false;
    const path = answer as string[];
    if (
      path[0] !== puzzle.start ||
      path.at(-1) !== puzzle.end ||
      new Set(path).size !== path.length ||
      path.some((cell) => puzzle.blocked.includes(cell))
    )
      return false;
    const cells = path.map((cell) => {
      const match = /^r([1-9]\d*)c([1-9]\d*)$/.exec(cell);
      if (!match) return null;
      const row = Number(match[1]);
      const column = Number(match[2]);
      return row <= puzzle.rows && column <= puzzle.columns ? { row, column } : null;
    });
    if (cells.some((cell) => cell === null)) return false;
    for (let index = 1; index < cells.length; index++) {
      const before = cells[index - 1]!;
      const current = cells[index]!;
      if (Math.abs(before.row - current.row) + Math.abs(before.column - current.column) !== 1)
        return false;
    }
    let previous = -1;
    for (const checkpoint of puzzle.checkpoints) {
      const index = path.indexOf(checkpoint);
      if (index <= previous) return false;
      previous = index;
    }
    return true;
  }
  if (puzzle.type === 'sort') {
    if (typeof answer !== 'object' || answer === null || Array.isArray(answer)) return false;
    const assignment = answer as Record<string, string>;
    const ids = Object.keys(assignment);
    return (
      ids.length === puzzle.objects.length &&
      puzzle.objects.every(
        (item) =>
          Object.hasOwn(assignment, item.id) &&
          puzzle.trays.some((tray) => tray.id === assignment[item.id]) &&
          assignment[item.id] === puzzle.answer[item.id],
      )
    );
  }
  if (puzzle.type === 'tiles') {
    if (!Array.isArray(answer) || answer.length !== puzzle.rows * puzzle.columns) return false;
    const used = new Set<string>();
    return Array.from<unknown>(answer).every((placement, index) => {
      if (typeof placement !== 'object' || placement === null) return false;
      const candidate = placement as TilePlacement;
      const tile = puzzle.tiles.find((item) => item.id === candidate.tileId);
      if (
        !tile ||
        used.has(candidate.tileId) ||
        candidate.tileId !== puzzle.answer[index].tileId ||
        !Number.isInteger(candidate.turns) ||
        candidate.turns < 0 ||
        candidate.turns > 3 ||
        !tile.acceptedTurns.includes(candidate.turns)
      )
        return false;
      used.add(candidate.tileId);
      return true;
    });
  }
  return typeof answer === 'number' && Number.isFinite(answer) && answer === puzzle.answer;
}

// Keep each location's unlock order in one place. Case IDs are persisted in saves.
const bakeryCaseOrder = ['missing-cookies', 'giant-cupcake', 'mystery-recipe'];
const parkCaseOrder = ['park-wrong-bench', 'park-flower-signs', 'park-kite-tails'];

export function canVisitPark(player: Player): boolean {
  return bakeryCaseOrder.every((id) => player.completed.includes(id));
}

function isUnlockedInOrder(player: Player, id: string, order: string[]): boolean {
  const index = order.indexOf(id);
  return index === 0 || (index > 0 && player.completed.includes(order[index - 1]));
}

export function canPlayCase(player: Player, id: string): boolean {
  if (parkCaseOrder.includes(id)) {
    return canVisitPark(player) && isUnlockedInOrder(player, id, parkCaseOrder);
  }
  return isUnlockedInOrder(player, id, bakeryCaseOrder);
}

export function completeCase(player: Player, caseDefinition: GameCase): Player {
  if (
    !canPlayCase(player, caseDefinition.id) ||
    player.session?.caseId !== caseDefinition.id ||
    !caseDefinition.puzzles.every((puzzle) => player.session?.solved.includes(puzzle.id))
  )
    return player;
  if (player.completed.includes(caseDefinition.id)) return { ...player, session: null };

  return {
    ...player,
    stars: player.stars + caseDefinition.rewards.stars,
    coins: player.coins + caseDefinition.rewards.coins,
    completed: [...player.completed, caseDefinition.id],
    stickers: [...new Set([...player.stickers, caseDefinition.rewards.sticker])],
    unlocked: [...new Set([...player.unlocked, caseDefinition.rewards.decoration])],
    session: null,
  };
}
