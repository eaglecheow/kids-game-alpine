import { describe, expect, it } from 'vitest';
import { canPlayCase, canVisitPark, getInitialPlayer } from './game';

const requirements: Record<string, string[]> = {
  'missing-cookies': [],
  'giant-cupcake': ['missing-cookies'],
  'mystery-recipe': ['giant-cupcake'],
  'park-wrong-bench': ['missing-cookies', 'giant-cupcake', 'mystery-recipe'],
  'park-flower-signs': ['missing-cookies', 'giant-cupcake', 'mystery-recipe', 'park-wrong-bench'],
  'park-kite-tails': ['missing-cookies', 'giant-cupcake', 'mystery-recipe', 'park-flower-signs'],
};
const ids = Object.keys(requirements);

// Include out-of-order completions that can arrive from older or edited saves.
const completionSets = Array.from({ length: 2 ** ids.length }, (_, mask) => ({
  completed: ids.filter((_, index) => mask & (1 << index)),
}));

describe('case unlock compatibility', () => {
  it.each(completionSets)(
    'preserves prerequisites for saved completions $completed',
    ({ completed }) => {
      const player = { ...getInitialPlayer(), completed };
      for (const [id, prerequisites] of Object.entries(requirements)) {
        expect(canPlayCase(player, id), id).toBe(
          prerequisites.every((prerequisite) => completed.includes(prerequisite)),
        );
      }
      expect(canVisitPark(player)).toBe(canPlayCase(player, 'park-wrong-bench'));
      expect(canPlayCase(player, 'unknown-case')).toBe(false);
      expect(canPlayCase(player, '')).toBe(false);
      expect(player.completed).toEqual(completed);
    },
  );
});
