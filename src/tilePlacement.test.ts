import { describe, expect, it } from 'vitest';
import type { TilePlacement } from './game';
import { placeTile } from './tilePlacement';

const first: TilePlacement = { tileId: 'first', turns: 1 };
const second: TilePlacement = { tileId: 'second', turns: 3 };

describe('picture tile placement', () => {
  it('places a tray piece in an empty square', () => {
    expect(placeTile([null, null], first, 1)).toEqual([null, first]);
  });

  it('moves a board piece into an empty square without duplicating it', () => {
    expect(placeTile([first, null, second], first, 1)).toEqual([null, first, second]);
  });

  it('swaps occupied board squares while preserving both rotations', () => {
    expect(placeTile([first, second, null], first, 1)).toEqual([second, first, null]);
  });

  it('returns a displaced board piece to the tray when placing a tray piece', () => {
    expect(placeTile([null, second], first, 1)).toEqual([null, first]);
  });

  it('updates a piece in its own square without duplicating or removing it', () => {
    const rotated = { ...first, turns: 2 };
    expect(placeTile([first, second], rotated, 0)).toEqual([rotated, second]);
  });

  it.each([-1, 2, 0.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'leaves the board unchanged for invalid square %s',
    (target) => {
      const placements = [first, second];
      expect(placeTile(placements, first, target)).toBe(placements);
    },
  );

  it('does not mutate the original board or either piece during a swap', () => {
    const source = Object.freeze({ ...first });
    const destination = Object.freeze({ ...second });
    const placements = [source, destination];
    Object.freeze(placements);

    const result = placeTile(placements, source, 1);

    expect(result).toEqual([second, first]);
    expect(result).not.toBe(placements);
    expect(result[1]).not.toBe(source);
    expect(placements).toEqual([first, second]);
  });
});
