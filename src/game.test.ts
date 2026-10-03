import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canPlayCase,
  canVisitPark,
  casesFor,
  completeCase,
  decorations,
  getInitialPlayer,
  validateAnswer,
  type GameCase,
  type Player,
  type Difficulty,
  type PuzzleAnswer,
} from './game';
import { loadPlayer, SAVE_KEY, savePlayer } from './storage';

const bakeryCases = (difficulty: Difficulty) =>
  casesFor(difficulty).filter((gameCase) => gameCase.location === 'bakery');
const caseById = (id: string, difficulty: Difficulty = 'detective') => {
  const gameCase = casesFor(difficulty).find((item) => item.id === id);
  if (!gameCase) throw new Error(`Unknown test case ${id}`);
  return gameCase;
};
const bakeryCompleted = ['missing-cookies', 'giant-cupcake', 'mystery-recipe'];
const malformed = (value: unknown) => value as PuzzleAnswer;

const readyToFinish = (gameCase: GameCase, player = getInitialPlayer()): Player => ({
  ...player,
  session: {
    caseId: gameCase.id,
    clues: gameCase.clues.map((clue) => clue.id),
    solved: gameCase.puzzles.map((puzzle) => puzzle.id),
    introSeen: true,
  },
});

describe('bakery mysteries', () => {
  it('keeps three solvable puzzles per case and increases clues with difficulty', () => {
    const levels = ['junior', 'detective', 'master'] as const;
    for (const [index, difficulty] of levels.entries()) {
      const cases = bakeryCases(difficulty);
      expect(cases).toHaveLength(3);
      for (const gameCase of cases) {
        expect(gameCase.puzzles).toHaveLength(3);
        expect(gameCase.clues).toHaveLength(4 + index);
        expect(new Set(gameCase.clues.map((clue) => clue.character))).toEqual(
          new Set(['ben', 'hamster', 'pip']),
        );
        expect(gameCase.puzzles.every((puzzle) => validateAnswer(puzzle, puzzle.answer))).toBe(
          true,
        );
        expect(decorations.some((item) => item.id === gameCase.rewards.decoration)).toBe(true);
      }
    }
    expect(caseById('missing-cookies').puzzles.map((puzzle) => puzzle.answer)).toEqual([48, 12, 1]);
    expect(caseById('giant-cupcake').puzzles.map((puzzle) => puzzle.answer)).toEqual([2500, 10, 0]);
    expect(caseById('mystery-recipe', 'master').puzzles[1].answer).toBe(1.5);
  });

  it('accepts exact finite numbers and checks every sequence card in order', () => {
    const sugar = caseById('mystery-recipe', 'master').puzzles[1];
    expect(validateAnswer(sugar, 1.5)).toBe(true);
    expect(validateAnswer(sugar, 1)).toBe(false);
    expect(validateAnswer(sugar, Number.NaN)).toBe(false);
    expect(validateAnswer(sugar, ['1.5'])).toBe(false);
    const sequence = caseById('mystery-recipe', 'master').puzzles[0];
    if (sequence.type !== 'sequence') throw new Error('Recipe must use sequence puzzle');
    expect(validateAnswer(sequence, [...sequence.answer].reverse())).toBe(false);
    expect(validateAnswer(sequence, sequence.answer.slice(1))).toBe(false);
    expect(validateAnswer(caseById('missing-cookies', 'master').puzzles[2], 0)).toBe(false);
  });
});

describe('Park mysteries and reusable puzzles', () => {
  it('authors all three engines and complete core evidence at every difficulty', () => {
    const coreClues = new Map<string, string[]>();
    const puzzleIds = new Map<string, string[]>();
    for (const [level, difficulty] of (['junior', 'detective', 'master'] as const).entries()) {
      const allCases = casesFor(difficulty);
      expect(allCases).toHaveLength(6);
      expect(new Set(allCases.map((item) => item.id)).size).toBe(6);
      const park = allCases.filter((item) => item.location === 'park');
      expect(park).toHaveLength(3);
      const clues = allCases.flatMap((item) => item.clues);
      const puzzles = allCases.flatMap((item) => item.puzzles);
      expect(new Set(clues.map((item) => item.id)).size).toBe(clues.length);
      expect(new Set(puzzles.map((item) => item.id)).size).toBe(puzzles.length);
      for (const gameCase of park) {
        expect(gameCase.clues).toHaveLength(4 + level);
        expect(gameCase.puzzles.map((puzzle) => puzzle.type)).toEqual(['route', 'sort', 'tiles']);
        expect(new Set(gameCase.clues.map((clue) => clue.character))).toEqual(
          new Set(['ben', 'hamster', 'pip']),
        );
        expect(gameCase.answer).toBeLessThan(gameCase.conclusions.length);
        expect(gameCase.repairLabel).toBeTruthy();
        expect(decorations.some((item) => item.id === gameCase.rewards.decoration)).toBe(true);
        for (const puzzle of gameCase.puzzles) {
          expect(validateAnswer(puzzle, puzzle.answer)).toBe(true);
          const linked = gameCase.clues.filter((clue) => clue.puzzleId === puzzle.id);
          expect(linked).toHaveLength(1);
          expect(linked[0].discovery).toBeTruthy();
          if (puzzle.type === 'sort') expect(puzzle.objects).toHaveLength(4 + level * 2);
          if (puzzle.type === 'route') expect(puzzle.checkpoints).toHaveLength(1 + level);
          if (puzzle.type === 'tiles') {
            expect(puzzle.tiles).toHaveLength(level === 2 ? 6 : 4);
            expect(puzzle.rotation).toBe(level > 0);
            expect(puzzle.columns).toBe(2);
            expect(puzzle.rows).toBe(level === 2 ? 3 : 2);
            expect(puzzle.image.endsWith('-master.svg')).toBe(level === 2);
            expect(new Set(puzzle.tiles.map((tile) => tile.label)).size).toBe(puzzle.tiles.length);
            expect(puzzle.tiles.map((tile) => tile.sourceIndex).sort()).toEqual(
              Array.from({ length: puzzle.tiles.length }, (_, index) => index),
            );
          }
        }
        const core = gameCase.clues.slice(0, 4).map((clue) => clue.id);
        const ids = gameCase.puzzles.map((puzzle) => puzzle.id);
        if (level === 0) {
          coreClues.set(gameCase.id, core);
          puzzleIds.set(gameCase.id, ids);
        } else {
          expect(core).toEqual(coreClues.get(gameCase.id));
          expect(ids).toEqual(puzzleIds.get(gameCase.id));
        }
        expect(
          gameCase.clues.every(
            (clue) =>
              clue.hotspot &&
              clue.hotspot.x >= 0 &&
              clue.hotspot.x <= 100 &&
              clue.hotspot.y >= 0 &&
              clue.hotspot.y <= 100,
          ),
        ).toBe(true);
      }
    }
  });

  it('accepts alternative routes and rejects jumps, obstacles, repeats and missing stops', () => {
    const route = caseById('park-kite-tails', 'junior').puzzles[0];
    if (route.type !== 'route') throw new Error('Kite trail must use a route');
    expect(validateAnswer(route, ['r1c1', 'r1c2', 'r2c2', 'r3c2', 'r3c3', 'r4c3', 'r4c4'])).toBe(
      true,
    );
    expect(validateAnswer(route, ['r1c1', 'r1c2', 'r2c2', 'r3c2', 'r3c3', 'r3c4', 'r4c4'])).toBe(
      true,
    );
    expect(validateAnswer(route, ['r1c1', 'r1c2', 'r3c2', 'r3c3', 'r4c3', 'r4c4'])).toBe(false);
    expect(validateAnswer(route, ['r1c1', 'r2c1', 'r2c2', 'r3c2', 'r3c3', 'r4c3', 'r4c4'])).toBe(
      false,
    );
    expect(
      validateAnswer(route, [
        'r1c1',
        'r1c2',
        'r2c2',
        'r1c2',
        'r2c2',
        'r3c2',
        'r3c3',
        'r4c3',
        'r4c4',
      ]),
    ).toBe(false);
    expect(validateAnswer(route, ['r1c1', 'r1c2', 'r1c3', 'r1c4', 'r2c4', 'r3c4', 'r4c4'])).toBe(
      false,
    );
    expect(validateAnswer(route, [...route.answer.slice(0, -1), 'r4c5'])).toBe(false);
    expect(validateAnswer(route, route.answer.slice(1))).toBe(false);
    expect(validateAnswer(route, ['r1c1', 'r2c2', 'r3c3', 'r4c4'])).toBe(false);
    expect(validateAnswer(route, malformed([null]))).toBe(false);
    const sparse = [...route.answer];
    delete sparse[2];
    expect(validateAnswer(route, sparse)).toBe(false);
    expect(validateAnswer(route, malformed({}))).toBe(false);
    expect(validateAnswer(route, malformed(null))).toBe(false);
    expect(validateAnswer(route, [route.start, 'unknown', route.end])).toBe(false);
    const reversedStops = { ...route, checkpoints: ['r3c3', 'r2c2'] };
    expect(validateAnswer(reversedStops, route.answer)).toBe(false);
    const omittedStop = { ...route, checkpoints: ['r2c2', 'r2c4'] };
    expect(validateAnswer(omittedStop, route.answer)).toBe(false);
  });

  it('observes all three flowerbeds even along a different Junior path', () => {
    const route = caseById('park-flower-signs', 'junior').puzzles[0];
    if (route.type !== 'route') throw new Error('Flower path must use a route');
    expect(route.landmarks[route.start]).toContain('Round');
    expect(route.landmarks[route.checkpoints[0]]).toContain('Star');
    expect(route.landmarks[route.end]).toContain('Bell');
    expect(validateAnswer(route, ['r3c1', 'r3c2', 'r4c2', 'r4c3', 'r4c4', 'r3c4'])).toBe(true);
  });

  it('sorts by complete assignments, independent of key order or an empty tray', () => {
    const sort = caseById('park-kite-tails', 'junior').puzzles[1];
    if (sort.type !== 'sort') throw new Error('Ribbon tray must use sorting');
    expect(Object.values(sort.answer)).not.toContain('flags');
    expect(validateAnswer(sort, Object.fromEntries(Object.entries(sort.answer).reverse()))).toBe(
      true,
    );
    const [first, ...rest] = Object.entries(sort.answer);
    expect(validateAnswer(sort, Object.fromEntries(rest))).toBe(false);
    expect(validateAnswer(sort, { ...sort.answer, unknown: 'tails' })).toBe(false);
    expect(validateAnswer(sort, { ...sort.answer, [first[0]]: 'unknown' })).toBe(false);
    expect(validateAnswer(sort, { ...sort.answer, [first[0]]: 'parcels' })).toBe(false);
    expect(validateAnswer(sort, malformed(Object.values(sort.answer)))).toBe(false);
    expect(validateAnswer(sort, malformed(null))).toBe(false);
    expect(validateAnswer(sort, malformed(4))).toBe(false);
    expect(validateAnswer(sort, malformed(Object.create(sort.answer)))).toBe(false);
    const master = caseById('park-kite-tails', 'master').puzzles[1];
    if (master.type !== 'sort') throw new Error('Ribbon tray must use sorting');
    expect(master.answer['zigzag-tail']).toBe('tails');
    expect(master.answer['zigzag-parcel']).toBe('parcels');
  });

  it('checks tile identity, slot, unique placement and allowed integer quarter-turns', () => {
    const tiles = caseById('park-wrong-bench', 'junior').puzzles[2];
    if (tiles.type !== 'tiles') throw new Error('Sign picture must use tiles');
    expect(tiles.tiles.every((tile) => tile.initialTurns === 0)).toBe(true);
    expect(validateAnswer(tiles, tiles.answer)).toBe(true);
    const swapped = [...tiles.answer];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    expect(validateAnswer(tiles, swapped)).toBe(false);
    expect(
      validateAnswer(tiles, [tiles.answer[0], tiles.answer[0], ...tiles.answer.slice(2)]),
    ).toBe(false);
    expect(validateAnswer(tiles, [null, ...tiles.answer.slice(1)])).toBe(false);
    expect(validateAnswer(tiles, tiles.answer.slice(1))).toBe(false);
    expect(validateAnswer(tiles, [{ tileId: 'unknown', turns: 0 }, ...tiles.answer.slice(1)])).toBe(
      false,
    );
    for (const turns of [1, -1, 4, 0.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(validateAnswer(tiles, [{ ...tiles.answer[0], turns }, ...tiles.answer.slice(1)])).toBe(
        false,
      );
    }
    expect(validateAnswer(tiles, malformed(['sign-fragment-1']))).toBe(false);
    expect(validateAnswer(tiles, malformed([{}, ...tiles.answer.slice(1)]))).toBe(false);
    expect(validateAnswer(tiles, malformed(new Array(tiles.answer.length)))).toBe(false);
    expect(validateAnswer(tiles, malformed({}))).toBe(false);
    const symmetric = {
      ...tiles,
      tiles: tiles.tiles.map((tile) =>
        tile.id === tiles.answer[0].tileId ? { ...tile, acceptedTurns: [0, 2] } : tile,
      ),
    };
    expect(
      validateAnswer(symmetric, [{ ...tiles.answer[0], turns: 2 }, ...tiles.answer.slice(1)]),
    ).toBe(true);
  });
});

describe('progression and rewards', () => {
  it('unlocks each mystery after the previous one and rejects unknown cases', () => {
    const player = getInitialPlayer();
    expect(canPlayCase(player, 'missing-cookies')).toBe(true);
    expect(canPlayCase(player, 'giant-cupcake')).toBe(false);
    expect(canPlayCase(player, 'mystery-recipe')).toBe(false);
    expect(canPlayCase(player, 'unknown')).toBe(false);
    const first = caseById('missing-cookies');
    const completed = completeCase(readyToFinish(first), first);
    expect(canPlayCase(completed, 'giant-cupcake')).toBe(true);
    expect(canPlayCase(completed, 'mystery-recipe')).toBe(false);
  });

  it('requires the matching session and every puzzle before rewarding a case', () => {
    const first = caseById('missing-cookies');
    const player = getInitialPlayer();
    expect(completeCase(player, first)).toBe(player);
    const unfinished = readyToFinish(first);
    unfinished.session!.solved.pop();
    expect(completeCase(unfinished, first)).toBe(unfinished);
    const locked = caseById('giant-cupcake');
    const lockedPlayer = readyToFinish(locked);
    expect(completeCase(lockedPlayer, locked)).toBe(lockedPlayer);
  });

  it('requires all Bakery completions for every Park case and its Park predecessor', () => {
    const initial = getInitialPlayer();
    expect(canVisitPark(initial)).toBe(false);
    expect(canPlayCase(initial, 'park-wrong-bench')).toBe(false);
    for (const omitted of bakeryCompleted) {
      const partial = { ...initial, completed: bakeryCompleted.filter((id) => id !== omitted) };
      expect(canVisitPark(partial)).toBe(false);
      expect(canPlayCase(partial, 'park-wrong-bench')).toBe(false);
      expect(
        canPlayCase(
          { ...partial, completed: [...partial.completed, 'park-wrong-bench'] },
          'park-flower-signs',
        ),
      ).toBe(false);
    }
    const eligible = { ...initial, completed: bakeryCompleted };
    expect(canVisitPark(eligible)).toBe(true);
    expect(canPlayCase(eligible, 'park-wrong-bench')).toBe(true);
    expect(canPlayCase(eligible, 'park-flower-signs')).toBe(false);
    const picnic = completeCase(
      readyToFinish(caseById('park-wrong-bench'), eligible),
      caseById('park-wrong-bench'),
    );
    expect(canPlayCase(picnic, 'park-flower-signs')).toBe(true);
    expect(canPlayCase(picnic, 'park-kite-tails')).toBe(false);
    const flowers = completeCase(
      readyToFinish(caseById('park-flower-signs'), picnic),
      caseById('park-flower-signs'),
    );
    expect(canPlayCase(flowers, 'park-kite-tails')).toBe(true);
    expect(canPlayCase(flowers, 'unknown')).toBe(false);
  });

  it('completes the full expansion once and prevents repeated repair or replay rewards', () => {
    let player = getInitialPlayer();
    for (const gameCase of casesFor('detective')) {
      const ready = readyToFinish(gameCase, player);
      player = completeCase(ready, gameCase);
      expect(completeCase(player, gameCase)).toBe(player);
      const replay = completeCase(readyToFinish(gameCase, player), gameCase);
      expect(replay).toEqual(player);
    }
    expect(player.stars).toBe(18);
    expect(player.coins).toBe(300);
    expect(player.completed).toHaveLength(6);
    expect(player.stickers).toHaveLength(6);
    expect(player.unlocked).toHaveLength(6);
    const shopTotal = decorations
      .filter((item) => !player.unlocked.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
    expect(player.coins).toBeGreaterThanOrEqual(shopTotal);
    expect(
      decorations.filter((item) => item.id.startsWith('park-')).map((item) => item.slot),
    ).toEqual(['wall', 'desk', 'wall']);
  });

  it('awards each case once, preserves preferences, and totals the full adventure', () => {
    let player = { ...getInitialPlayer(), nickname: 'Star', sound: false };
    for (const gameCase of bakeryCases(player.difficulty)) {
      player = completeCase(readyToFinish(gameCase, player), gameCase);
      const replay = completeCase(readyToFinish(gameCase, player), gameCase);
      expect(replay.coins).toBe(player.coins);
      expect(replay.session).toBeNull();
      expect(player.session).toBeNull();
    }
    expect(player.stars).toBe(9);
    expect(player.coins).toBe(150);
    expect(player.completed).toHaveLength(3);
    expect(player.stickers).toHaveLength(3);
    expect(player.unlocked).toHaveLength(3);
    expect(player.nickname).toBe('Star');
    expect(player.sound).toBe(false);
  });
});

describe('decoration economy', () => {
  it('lets a detective collect every decoration with the available one-time rewards', () => {
    let player = getInitialPlayer();
    for (const gameCase of bakeryCases(player.difficulty)) {
      player = completeCase(readyToFinish(gameCase, player), gameCase);
    }
    const shopTotal = decorations
      .filter((item) => !item.id.startsWith('park-') && !player.unlocked.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
    expect(player.coins).toBeGreaterThanOrEqual(shopTotal);
  });
});

describe('local saves', () => {
  let values: Map<string, string>;
  beforeEach(() => {
    values = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    });
  });

  it('round-trips preferences, rewards, decorations, and a resumable case', () => {
    const first = caseById('missing-cookies');
    const player = completeCase(readyToFinish(first), first);
    player.nickname = 'Pip Pal';
    player.equipped = { shelf: 'cookie-trophy' };
    player.music = true;
    player.session = {
      caseId: 'giant-cupcake',
      clues: ['cupcake-bag'],
      solved: ['cupcake-grams'],
      introSeen: true,
    };
    expect(savePlayer(player)).toBe(true);
    expect(loadPlayer()).toEqual(player);
  });

  it('preserves a pre-expansion version-1 Bakery save and unlocks Park from saved completions', () => {
    const oldSave: Player = {
      ...getInitialPlayer(),
      nickname: 'Old Detective',
      stars: 9,
      coins: 125,
      completed: [...bakeryCompleted],
      stickers: ['🍪', '🧁', '👩‍🍳'],
      unlocked: ['cookie-trophy', 'hamster-plush', 'magnifying-poster', 'lamp'],
      equipped: { shelf: 'cookie-trophy', wall: 'magnifying-poster', desk: 'lamp' },
      sound: false,
      music: true,
      onboarded: true,
      session: {
        caseId: 'missing-cookies',
        clues: ['cookie-trays'],
        solved: ['cookie-total'],
        introSeen: true,
      },
    };
    values.set(SAVE_KEY, JSON.stringify(oldSave));
    const loaded = loadPlayer();
    expect(loaded).toEqual(oldSave);
    expect(canVisitPark(loaded)).toBe(true);
    expect(canPlayCase(loaded, 'park-wrong-bench')).toBe(true);
    expect(loaded.version).toBe(1);
    expect(savePlayer(loaded)).toBe(true);
    expect(loadPlayer()).toEqual(oldSave);
  });

  it('round-trips Park discoveries and rewards at each difficulty', () => {
    for (const difficulty of ['junior', 'detective', 'master'] as const) {
      let player = { ...getInitialPlayer(), difficulty };
      for (const gameCase of casesFor(difficulty).filter(
        (item) => item.location === 'bakery' || item.id === 'park-wrong-bench',
      )) {
        player = completeCase(readyToFinish(gameCase, player), gameCase);
      }
      player.equipped = { wall: 'park-picnic-pennant' };
      const flowers = caseById('park-flower-signs', difficulty);
      player.session = {
        caseId: flowers.id,
        clues: flowers.clues.map((clue) => clue.id),
        solved: ['park-flowers-sort'],
        introSeen: true,
      };
      expect(savePlayer(player)).toBe(true);
      expect(loadPlayer()).toEqual(player);
      player = completeCase(readyToFinish(flowers, player), flowers);
      expect(savePlayer(player)).toBe(true);
      expect(loadPlayer()).toEqual(player);
      expect(loadPlayer().unlocked).toContain('park-flowerpot');
    }
  });

  it('preserves core clues and solved IDs when a Park session changes difficulty', () => {
    const master = caseById('park-kite-tails', 'master');
    const player = readyToFinish(master, {
      ...getInitialPlayer(),
      difficulty: 'junior',
      completed: [...bakeryCompleted, 'park-wrong-bench', 'park-flower-signs'],
    });
    expect(savePlayer(player)).toBe(true);
    const loaded = loadPlayer();
    expect(loaded.session?.solved).toEqual(master.puzzles.map((puzzle) => puzzle.id));
    expect(loaded.session?.clues).toEqual(
      caseById(master.id, 'junior').clues.map((clue) => clue.id),
    );
    const completed = completeCase(loaded, caseById(master.id, 'junior'));
    expect(completed.completed).toContain(master.id);
    expect(completed.coins).toBe(60);
    expect(
      completeCase(readyToFinish(caseById(master.id, 'master'), completed), master).coins,
    ).toBe(60);
  });

  it('migrates an unversioned save and supplies new field defaults', () => {
    values.set(
      SAVE_KEY,
      JSON.stringify({
        nickname: '  Acorn  ',
        completed: ['missing-cookies'],
        coins: 40,
        stars: 3,
      }),
    );
    const player = loadPlayer();
    expect(player.nickname).toBe('Acorn');
    expect(player.version).toBe(1);
    expect(player.music).toBe(false);
    expect(player.unlocked).toContain('cookie-trophy');
    expect(JSON.parse(values.get(SAVE_KEY)!).version).toBe(1);
  });

  it('recovers corrupt JSON and sanitizes invalid saved fields', () => {
    values.set(SAVE_KEY, '{nope');
    expect(loadPlayer()).toEqual(getInitialPlayer());
    values.set(
      SAVE_KEY,
      JSON.stringify({
        version: 1,
        coins: -20,
        stars: 'many',
        hat: 'helmet',
        completed: ['invented'],
        equipped: { shelf: 'rug' },
        session: {
          caseId: 'missing-cookies',
          clues: ['cookie-trays', 'invented'],
          solved: ['cookie-total', 'invented'],
        },
      }),
    );
    const player = loadPlayer();
    expect(player.coins).toBe(0);
    expect(player.stars).toBe(0);
    expect(player.hat).toBe('cap');
    expect(player.completed).toEqual([]);
    expect(player.equipped).toEqual({});
    expect(player.session?.clues).toEqual(['cookie-trays']);
    expect(player.session?.solved).toEqual(['cookie-total']);
  });

  it('returns a safe default and a failure signal when storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Blocked');
      },
      setItem: () => {
        throw new Error('Blocked');
      },
    });
    expect(loadPlayer()).toEqual(getInitialPlayer());
    expect(savePlayer(getInitialPlayer())).toBe(false);
  });

  it('preserves a future-version save instead of overwriting it', () => {
    const future = JSON.stringify({ version: 2, coins: 999 });
    values.set(SAVE_KEY, future);
    expect(loadPlayer()).toEqual(getInitialPlayer());
    expect(savePlayer(getInitialPlayer())).toBe(false);
    expect(values.get(SAVE_KEY)).toBe(future);
  });
});
