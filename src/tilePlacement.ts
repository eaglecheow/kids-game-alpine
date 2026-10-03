import type { TilePlacement } from './game';

export function placeTile(
  placements: (TilePlacement | null)[],
  tile: TilePlacement,
  target: number,
): (TilePlacement | null)[] {
  if (!Number.isInteger(target) || target < 0 || target >= placements.length) {
    return placements;
  }

  const source = placements.findIndex((placement) => placement?.tileId === tile.tileId);
  const displaced = placements[target];
  const next = placements.map((placement) =>
    placement?.tileId === tile.tileId ? null : placement,
  );

  if (source >= 0 && source !== target) next[source] = displaced;
  next[target] = { ...tile };
  return next;
}
