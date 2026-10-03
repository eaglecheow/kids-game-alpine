import {
  casesFor,
  decorations,
  getInitialPlayer,
  type CaseSession,
  type Difficulty,
  type Player,
  type RoomPlacement,
} from './game';
import { clampRoomPosition } from './clubhouse';

export const SAVE_KEY = 'tiny-town-detectives.player';

const stringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string'))]
    : [];
const count = (value: unknown): number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
const object = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

function restorePlayer(value: unknown): Player | null {
  const saved = object(value);
  if (
    !saved ||
    (saved.version !== undefined &&
      saved.version !== 0 &&
      saved.version !== 1 &&
      saved.version !== 2)
  )
    return null;
  const defaults = getInitialPlayer();
  const difficulty: Difficulty =
    saved.difficulty === 'junior' || saved.difficulty === 'master' ? saved.difficulty : 'detective';
  const cases = casesFor(difficulty);
  const completed = stringList(saved.completed).filter((id) =>
    cases.some((gameCase) => gameCase.id === id),
  );
  const unlocked = [
    ...new Set([
      ...stringList(saved.unlocked).filter((id) => decorations.some((item) => item.id === id)),
      ...cases
        .filter((gameCase) => completed.includes(gameCase.id))
        .map((gameCase) => gameCase.rewards.decoration),
    ]),
  ];
  const roomItems =
    saved.version === 2
      ? restoreRoomItems(saved.roomItems, unlocked)
      : migrateEquipped(saved.equipped, unlocked);
  const rawSession = object(saved.session);
  const caseDefinition = cases.find((gameCase) => gameCase.id === rawSession?.caseId);
  const session: CaseSession | null =
    rawSession && caseDefinition
      ? {
          caseId: caseDefinition.id,
          clues: stringList(rawSession.clues).filter((id) =>
            caseDefinition.clues.some((clue) => clue.id === id),
          ),
          solved: stringList(rawSession.solved).filter((id) =>
            caseDefinition.puzzles.some((puzzle) => puzzle.id === id),
          ),
          introSeen: rawSession.introSeen === true,
        }
      : null;

  return {
    ...defaults,
    nickname:
      typeof saved.nickname === 'string' && saved.nickname.trim()
        ? saved.nickname.trim().slice(0, 18)
        : defaults.nickname,
    avatar: count(saved.avatar),
    hat: saved.hat === 'beanie' || saved.hat === 'bow' ? saved.hat : 'cap',
    difficulty,
    stars: count(saved.stars),
    coins: count(saved.coins),
    completed,
    stickers: stringList(saved.stickers),
    unlocked,
    roomItems,
    sound: typeof saved.sound === 'boolean' ? saved.sound : defaults.sound,
    music: typeof saved.music === 'boolean' ? saved.music : defaults.music,
    onboarded: saved.onboarded === true,
    session,
  };
}

function restoreRoomItems(value: unknown, unlocked: string[]): RoomPlacement[] {
  const roomItems: RoomPlacement[] = [];
  if (!Array.isArray(value)) return roomItems;
  const seen = new Set<string>();
  for (const entry of value) {
    const item = object(entry);
    if (
      !item ||
      typeof item.id !== 'string' ||
      !unlocked.includes(item.id) ||
      seen.has(item.id) ||
      typeof item.x !== 'number' ||
      !Number.isFinite(item.x) ||
      typeof item.y !== 'number' ||
      !Number.isFinite(item.y)
    )
      continue;
    seen.add(item.id);
    roomItems.push({ id: item.id, ...clampRoomPosition(item.id, item.x, item.y) });
  }
  return roomItems;
}

function migrateEquipped(value: unknown, unlocked: string[]): RoomPlacement[] {
  const equipped = object(value) ?? {};
  // Keep familiar locations, with floor pieces behind the smaller objects.
  const positions = {
    floor: { x: 48, y: 80 },
    wall: { x: 76, y: 26 },
    desk: { x: 25, y: 55 },
    shelf: { x: 73, y: 52 },
  };
  return Object.entries(positions).flatMap(([slot, position]) => {
    const id = equipped[slot];
    if (
      typeof id !== 'string' ||
      !unlocked.includes(id) ||
      !decorations.some((item) => item.id === id && item.slot === slot)
    )
      return [];
    const { x, y } = id === 'bookshelf' ? { x: 85, y: 77 } : position;
    return [{ id, ...clampRoomPosition(id, x, y) }];
  });
}

export function loadPlayer(): Player {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return getInitialPlayer();
    const saved: unknown = JSON.parse(raw);
    const player = restorePlayer(saved);
    if (!player) return getInitialPlayer();
    if (object(saved)?.version !== 2) savePlayer(player);
    return player;
  } catch {
    return getInitialPlayer();
  }
}

export function savePlayer(player: Player): boolean {
  try {
    // Preserve saves written by a future version instead of silently replacing them.
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try {
        const version = object(JSON.parse(raw))?.version;
        if (typeof version === 'number' && version > 2) return false;
      } catch {
        /* An unreadable save can be replaced by the current adventure. */
      }
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    return true;
  } catch {
    return false;
  }
}

export function resetPlayerProgress(player: Player): Player | null {
  const reset: Player = {
    ...getInitialPlayer(),
    nickname: player.nickname,
    avatar: player.avatar,
    hat: player.hat,
    difficulty: player.difficulty,
    sound: player.sound,
    music: player.music,
    onboarded: player.onboarded,
  };

  return savePlayer(reset) ? reset : null;
}
