export type Difficulty = 'junior' | 'detective' | 'master';

export interface CaseSession {
  caseId: string;
  clues: string[];
  solved: string[];
  introSeen: boolean;
}

export interface Player {
  version: 1;
  nickname: string;
  avatar: number;
  hat: 'cap' | 'beanie' | 'bow';
  difficulty: Difficulty;
  stars: number;
  coins: number;
  completed: string[];
  stickers: string[];
  unlocked: string[];
  equipped: Record<string, string>;
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

export type Puzzle =
  | (PuzzleDetails & { type: 'number'; answer: number; unit?: string })
  | (PuzzleDetails & { type: 'sequence'; cards: string[]; answer: string[] })
  | (PuzzleDetails & { type: 'choice'; options: string[]; answer: number });

export interface Clue {
  id: string;
  title: string;
  description: string;
  icon: string;
  character: 'ben' | 'hamster' | 'pip';
  puzzleId?: string;
}

export interface GameCase {
  id: string;
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
  rewards: { stars: number; coins: number; sticker: string; decoration: string };
}

export const decorations: {
  id: string;
  name: string;
  icon: string;
  price: number;
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
];

export function getInitialPlayer(): Player {
  return {
    version: 1,
    nickname: 'Detective',
    avatar: 0,
    hat: 'cap',
    difficulty: 'detective',
    stars: 0,
    coins: 0,
    completed: [],
    stickers: [],
    unlocked: [],
    equipped: {},
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
  ];
}

export function validateAnswer(puzzle: Puzzle, answer: number | string[]): boolean {
  if (puzzle.type === 'sequence') {
    return (
      Array.isArray(answer) &&
      answer.length === puzzle.answer.length &&
      answer.every((card, index) => card === puzzle.answer[index])
    );
  }
  return typeof answer === 'number' && Number.isFinite(answer) && answer === puzzle.answer;
}

export function canPlayCase(player: Player, id: string): boolean {
  const index = ['missing-cookies', 'giant-cupcake', 'mystery-recipe'].indexOf(id);
  return (
    index === 0 ||
    (index > 0 && player.completed.includes(['missing-cookies', 'giant-cupcake'][index - 1]))
  );
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
