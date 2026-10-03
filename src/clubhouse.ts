import type { RoomPlacement } from './game';

const itemWidths: Record<string, number> = {
  lamp: 18,
  globe: 20,
  'cookie-trophy': 18,
  'magnifying-poster': 22,
  'hamster-plush': 20,
  'pigeon-statue': 18,
  bookshelf: 24,
  rug: 30,
  'park-picnic-pennant': 22,
  'park-flowerpot': 18,
  'park-kite-mobile': 20,
};

const initialPositions: Record<string, { x: number; y: number }> = {
  lamp: { x: 18, y: 52 },
  globe: { x: 38, y: 52 },
  'cookie-trophy': { x: 76, y: 50 },
  'magnifying-poster': { x: 76, y: 23 },
  'hamster-plush': { x: 57, y: 52 },
  'pigeon-statue': { x: 89, y: 68 },
  bookshelf: { x: 16, y: 81 },
  rug: { x: 48, y: 79 },
  'park-picnic-pennant': { x: 25, y: 22 },
  'park-flowerpot': { x: 77, y: 82 },
  'park-kite-mobile': { x: 51, y: 21 },
};

// The canvas is 4:3; matching percentage dimensions keep each illustration square.
export function getRoomItemSize(id: string): { width: number; height: number } {
  const width = itemWidths[id] ?? 20;
  return { width, height: (width * 4) / 3 };
}

export function clampRoomPosition(id: string, x: number, y: number): { x: number; y: number } {
  const { width, height } = getRoomItemSize(id);
  return {
    x: Math.max(width / 2, Math.min(100 - width / 2, Number.isFinite(x) ? x : 50)),
    y: Math.max(height / 2, Math.min(100 - height / 2, Number.isFinite(y) ? y : 50)),
  };
}

export function defaultRoomPlacement(id: string): RoomPlacement {
  const { x, y } = initialPositions[id] ?? { x: 50, y: 50 };
  return { id, ...clampRoomPosition(id, x, y) };
}
