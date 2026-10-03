import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Check, Hand, Plus, RotateCw, Undo2 } from 'lucide-react';
import { publicAsset } from '../assets';
import type { Puzzle, TilePlacement } from '../game';
import { placeTile } from '../tilePlacement';

type PicturePuzzle = Extract<Puzzle, { type: 'tiles' }>;
type DropTarget = number | 'tray' | null;
type Drag = {
  tileId: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  size: number;
  lift: number;
  active: boolean;
  target: DropTarget;
};

function TilePicture({
  puzzle,
  sourceIndex,
  turns,
}: {
  puzzle: PicturePuzzle;
  sourceIndex: number;
  turns: number;
}) {
  return (
    <span
      className="tile-crop"
      aria-hidden="true"
      style={{
        backgroundImage: `url("${publicAsset(puzzle.image)}")`,
        backgroundSize: `${puzzle.columns * 100}% ${puzzle.rows * 100}%`,
        backgroundPosition: `${((sourceIndex % puzzle.columns) / (puzzle.columns - 1)) * 100}% ${(Math.floor(sourceIndex / puzzle.columns) / (puzzle.rows - 1)) * 100}%`,
        transform: `rotate(${turns * 90}deg)`,
      }}
    />
  );
}

export function TilesPuzzle({
  puzzle,
  placements,
  onChange,
  disabled,
  onFeedback,
}: {
  puzzle: PicturePuzzle;
  placements: (TilePlacement | null)[];
  onChange: (placements: (TilePlacement | null)[]) => void;
  disabled: boolean;
  onFeedback: (message: string) => void;
}) {
  const [turns, setTurns] = useState<Record<string, number>>(() =>
    Object.fromEntries(puzzle.tiles.map((tile) => [tile.id, tile.initialTurns])),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  // The ref also tracks movement before React's next render and guards additional fingers.
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLElement>(null);
  const instructionsId = useId();
  const selectedTile = puzzle.tiles.find((tile) => tile.id === selected);
  const selectedOnBoard = placements.some((placement) => placement?.tileId === selected);
  const draggedTile = puzzle.tiles.find((tile) => tile.id === drag?.tileId);
  const pieceNumber = (id: string) => puzzle.tiles.findIndex((tile) => tile.id === id) + 1;
  const squareName = (index: number) =>
    `row ${Math.floor(index / puzzle.columns) + 1}, column ${(index % puzzle.columns) + 1}`;

  useEffect(() => {
    const cancel = () => {
      dragRef.current = null;
      setDrag(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dragRef.current) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = true;
        cancel();
      }
    };
    window.addEventListener('blur', cancel);
    window.addEventListener('keydown', escape, true);
    return () => {
      window.removeEventListener('blur', cancel);
      window.removeEventListener('keydown', escape, true);
    };
  }, []);

  function selectTile(id: string) {
    setSelected(id);
    onFeedback('');
  }

  function putTile(id: string, target: number) {
    const source = placements.findIndex((placement) => placement?.tileId === id);
    const occupied = placements[target];
    onChange(placeTile(placements, { tileId: id, turns: turns[id] }, target));
    setSelected(id);
    onFeedback(
      source === target
        ? `Piece ${pieceNumber(id)} is in ${squareName(target)}.`
        : occupied
          ? source >= 0
            ? 'Pieces swapped. Look at how their edges join.'
            : 'Piece placed. The other piece is back in the tray.'
          : 'Piece placed. Look at how the edges join.',
    );
  }

  function returnTile(id: string) {
    onChange(placements.map((placement) => (placement?.tileId === id ? null : placement)));
    setSelected(id);
    onFeedback(`Piece ${pieceNumber(id)} is back in the tray.`);
  }

  function targetAt(x: number, y: number): DropTarget {
    let closest: number | null = null;
    let distance = Infinity;
    // A small margin makes drops along a square's border forgiving without revealing answers.
    boardRef.current?.querySelectorAll<HTMLButtonElement>('[data-tile-slot]').forEach((slot) => {
      const rect = slot.getBoundingClientRect();
      if (x < rect.left - 10 || x > rect.right + 10 || y < rect.top - 10 || y > rect.bottom + 10)
        return;
      const toCenter = Math.hypot(
        x - (rect.left + rect.width / 2),
        y - (rect.top + rect.height / 2),
      );
      if (toCenter < distance) {
        closest = Number(slot.dataset.tileSlot);
        distance = toCenter;
      }
    });
    if (closest !== null) return closest;
    const tray = trayRef.current?.getBoundingClientRect();
    return tray && x >= tray.left && x <= tray.right && y >= tray.top && y <= tray.bottom
      ? 'tray'
      : null;
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (disabled || !event.isPrimary || event.button !== 0 || dragRef.current) return;
    suppressClick.current = false;
    const size = Math.max(56, Math.min(event.currentTarget.getBoundingClientRect().width, 112));
    dragRef.current = {
      tileId: id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      size,
      lift: event.pointerType === 'touch' ? size / 2 + 14 : 0,
      active: false,
      target: null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (
      !current.active &&
      Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 7
    )
      return;
    event.preventDefault();
    // Keep existing feedback in place so the centered dialog cannot shift during a drag.
    if (!current.active) setSelected(current.tileId);
    const next = {
      ...current,
      active: true,
      x: event.clientX,
      y: event.clientY,
      target: targetAt(event.clientX, event.clientY),
    };
    dragRef.current = next;
    setDrag(next);
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDrag(null);
    suppressClick.current = current.active || cancelled;
    if (!current.active || cancelled || disabled) return;
    const target = targetAt(event.clientX, event.clientY);
    if (typeof target === 'number') putTile(current.tileId, target);
    else if (target === 'tray') returnTile(current.tileId);
    else onFeedback('Piece kept in its spot. Try dropping it on a square.');
  }

  function dragEvents(id: string) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => startDrag(event, id),
      onPointerMove: moveDrag,
      onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => endDrag(event),
      onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => endDrag(event, true),
      onLostPointerCapture: (event: ReactPointerEvent<HTMLButtonElement>) => endDrag(event, true),
      onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(),
    };
  }

  return (
    <div
      className="tiles-puzzle"
      onPointerDownCapture={(event) => {
        if (event.isPrimary && !dragRef.current) suppressClick.current = false;
      }}
      onClickCapture={(event) => {
        if (event.detail !== 0 && (suppressClick.current || dragRef.current?.active)) {
          suppressClick.current = false;
          event.stopPropagation();
        }
      }}
    >
      <p id={instructionsId} className="tile-instructions">
        Drag a piece into the picture.{puzzle.rotation && ' Select a piece, then tap Rotate.'}
      </p>
      <div className="tile-workspace">
        <section className="tile-board-panel" aria-label="Your picture">
          <h3 className="tile-section-heading">
            Your picture{' '}
            <span>
              {placements.filter(Boolean).length}/{placements.length}
            </span>
          </h3>
          <div
            className="tile-board"
            role="group"
            aria-label="Picture assembly board"
            aria-describedby={instructionsId}
            ref={boardRef}
            style={{ gridTemplateColumns: `repeat(${puzzle.columns}, minmax(44px, 1fr))` }}
          >
            {placements.map((placement, index) => {
              const tile = puzzle.tiles.find((entry) => entry.id === placement?.tileId);
              return (
                <button
                  key={index}
                  type="button"
                  className={`tile-slot ${tile ? 'occupied' : ''} ${tile?.id === selected ? 'selected' : ''} ${drag?.tileId === tile?.id && tile ? 'drag-source' : ''} ${drag?.target === index ? 'drop-target' : ''}`}
                  data-tile-slot={index}
                  data-tile-id={tile?.id}
                  aria-pressed={!!tile && tile.id === selected}
                  aria-label={`${squareName(index)}. ${tile ? `Piece ${pieceNumber(tile.id)}: ${tile.label}. ${tile.description} Turned ${placement!.turns * 90} degrees. Tap to select.` : 'Empty. Tap to place the selected piece.'}`}
                  disabled={disabled}
                  {...(tile ? dragEvents(tile.id) : {})}
                  onClick={(event) => {
                    if (event.detail !== 0 && suppressClick.current) return;
                    if (tile) selectTile(tile.id);
                    else if (selected) putTile(selected, index);
                    else onFeedback('Choose a piece from the tray first.');
                  }}
                >
                  {tile && placement ? (
                    <TilePicture
                      puzzle={puzzle}
                      sourceIndex={tile.sourceIndex}
                      turns={placement.turns}
                    />
                  ) : (
                    <Plus size={24} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
        <section
          ref={trayRef}
          className={`tile-tray-panel ${drag?.target === 'tray' ? 'drop-target' : ''}`}
          aria-label="Piece tray"
        >
          <h3 className="tile-section-heading">Pieces</h3>
          <div className="tile-palette" role="group" aria-label="Picture fragments">
            {puzzle.tiles.map((tile, index) =>
              placements.some((placement) => placement?.tileId === tile.id) ? (
                <span
                  key={tile.id}
                  className="tile-placeholder"
                  aria-label={`Piece ${index + 1} is on the board`}
                >
                  <Check size={22} aria-hidden="true" />
                  <span className="tile-number" aria-hidden="true">
                    {index + 1}
                  </span>
                </span>
              ) : (
                <button
                  key={tile.id}
                  type="button"
                  className={`tile-fragment ${selected === tile.id ? 'selected' : ''} ${drag?.tileId === tile.id ? 'drag-source' : ''}`}
                  data-tile-id={tile.id}
                  aria-pressed={selected === tile.id}
                  aria-label={`Piece ${index + 1}: ${tile.label}. ${tile.description} Turned ${turns[tile.id] * 90} degrees. Drag to the picture or tap to select.`}
                  disabled={disabled}
                  {...dragEvents(tile.id)}
                  onClick={(event) => {
                    if (event.detail !== 0 && suppressClick.current) return;
                    selectTile(tile.id);
                  }}
                >
                  <TilePicture
                    puzzle={puzzle}
                    sourceIndex={tile.sourceIndex}
                    turns={turns[tile.id]}
                  />
                  <span className="tile-number" aria-hidden="true">
                    {index + 1}
                  </span>
                </button>
              ),
            )}
          </div>
        </section>
      </div>
      <div className="tile-drop-hint" role="status">
        <Hand size={16} aria-hidden="true" />
        {drag?.target === 'tray'
          ? 'Release to return to the tray'
          : typeof drag?.target === 'number'
            ? 'Release to drop here'
            : 'Drag a piece into the picture'}
      </div>
      <div className="tile-toolbar">
        <span className="tile-selection" role="status">
          {selectedTile ? `Piece ${pieceNumber(selectedTile.id)} selected` : 'Choose a piece'}
        </span>
        <div className="tile-controls">
          {puzzle.rotation && (
            <button
              type="button"
              className="button secondary"
              disabled={disabled || !selected || !!drag}
              aria-label="Rotate selected piece clockwise"
              onClick={() => {
                if (!selected) return;
                const nextTurn = (turns[selected] + 1) % 4;
                setTurns({ ...turns, [selected]: nextTurn });
                onChange(
                  placements.map((placement) =>
                    placement?.tileId === selected ? { ...placement, turns: nextTurn } : placement,
                  ),
                );
                onFeedback(`Piece ${pieceNumber(selected)} turned to ${nextTurn * 90} degrees.`);
              }}
            >
              <RotateCw size={20} aria-hidden="true" /> Rotate
            </button>
          )}
          <button
            type="button"
            className="button secondary"
            disabled={disabled || !selectedOnBoard || !!drag}
            aria-label="Return selected piece to tray"
            onClick={() => selected && returnTile(selected)}
          >
            <Undo2 size={20} aria-hidden="true" /> Return
          </button>
        </div>
      </div>
      <p className="tile-help">You can also tap a piece, then an empty square.</p>
      {drag && draggedTile && (
        <div
          className="tile-drag-preview"
          aria-hidden="true"
          style={{ left: drag.x, top: drag.y - drag.lift, width: drag.size, height: drag.size }}
        >
          <TilePicture
            puzzle={puzzle}
            sourceIndex={draggedTile.sourceIndex}
            turns={turns[draggedTile.id]}
          />
        </div>
      )}
    </div>
  );
}
