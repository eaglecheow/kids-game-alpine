import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canPlayCase,
  casesFor,
  completeCase,
  decorations,
  getInitialPlayer,
  validateAnswer,
  type GameCase,
  type Player,
} from './game';
import { loadPlayer, SAVE_KEY, savePlayer } from './storage';

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
      const cases = casesFor(difficulty);
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
    const standard = casesFor('detective');
    expect(standard[0].puzzles.map((puzzle) => puzzle.answer)).toEqual([48, 12, 1]);
    expect(standard[1].puzzles.map((puzzle) => puzzle.answer)).toEqual([2500, 10, 0]);
    expect(casesFor('master')[2].puzzles[1].answer).toBe(1.5);
  });

  it('accepts exact finite numbers and checks every sequence card in order', () => {
    const cases = casesFor('master');
    const sugar = cases[2].puzzles[1];
    expect(validateAnswer(sugar, 1.5)).toBe(true);
    expect(validateAnswer(sugar, 1)).toBe(false);
    expect(validateAnswer(sugar, Number.NaN)).toBe(false);
    expect(validateAnswer(sugar, ['1.5'])).toBe(false);
    const sequence = cases[2].puzzles[0];
    if (sequence.type !== 'sequence') throw new Error('Recipe must use sequence puzzle');
    expect(validateAnswer(sequence, [...sequence.answer].reverse())).toBe(false);
    expect(validateAnswer(sequence, sequence.answer.slice(1))).toBe(false);
    expect(validateAnswer(cases[0].puzzles[2], 0)).toBe(false);
  });
});

describe('progression and rewards', () => {
  it('unlocks each mystery after the previous one and rejects unknown cases', () => {
    const player = getInitialPlayer();
    expect(canPlayCase(player, 'missing-cookies')).toBe(true);
    expect(canPlayCase(player, 'giant-cupcake')).toBe(false);
    expect(canPlayCase(player, 'mystery-recipe')).toBe(false);
    expect(canPlayCase(player, 'unknown')).toBe(false);
    const first = casesFor(player.difficulty)[0];
    const completed = completeCase(readyToFinish(first), first);
    expect(canPlayCase(completed, 'giant-cupcake')).toBe(true);
    expect(canPlayCase(completed, 'mystery-recipe')).toBe(false);
  });

  it('requires the matching session and every puzzle before rewarding a case', () => {
    const first = casesFor('detective')[0];
    const player = getInitialPlayer();
    expect(completeCase(player, first)).toBe(player);
    const unfinished = readyToFinish(first);
    unfinished.session!.solved.pop();
    expect(completeCase(unfinished, first)).toBe(unfinished);
    const locked = casesFor('detective')[1];
    const lockedPlayer = readyToFinish(locked);
    expect(completeCase(lockedPlayer, locked)).toBe(lockedPlayer);
  });

  it('awards each case once, preserves preferences, and totals the full adventure', () => {
    let player = { ...getInitialPlayer(), nickname: 'Star', sound: false };
    for (const gameCase of casesFor(player.difficulty)) {
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
    for (const gameCase of casesFor(player.difficulty)) {
      player = completeCase(readyToFinish(gameCase, player), gameCase);
    }
    const shopTotal = decorations
      .filter((item) => !player.unlocked.includes(item.id))
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
    const first = casesFor('detective')[0];
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
