import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { GripVertical } from 'lucide-react';

type DragSession = {
  card: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  bounds: { top: number; left: number; width: number; height: number };
  scroller: HTMLElement | null;
  active: boolean;
};

function scrollParent(element: HTMLElement): HTMLElement | null {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) return parent;
  }
  return null;
}

export function SequenceCards({
  cards,
  disabled,
  onChange,
}: {
  cards: string[];
  disabled: boolean;
  onChange: (cards: string[]) => void;
}) {
  const instructionsId = useId();
  const list = useRef<HTMLOListElement>(null);
  const session = useRef<DragSession | null>(null);
  const suppressClick = useRef(false);
  const focusAfterMove = useRef<{ button: HTMLButtonElement; keyboard: boolean } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [drag, setDrag] = useState<{
    card: string;
    x: number;
    y: number;
    target: number | null;
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const dragging = drag !== null;

  useLayoutEffect(() => {
    const pending = focusAfterMove.current;
    if (pending) {
      pending.button.focus({ preventScroll: !pending.keyboard });
      focusAfterMove.current = null;
    }
  }, [cards]);

  function dropTarget(x: number, y: number) {
    const rows = list.current ? Array.from(list.current.children) : [];
    const bounds = list.current?.getBoundingClientRect();
    if (!bounds || x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) {
      return null;
    }
    let nearest: number | null = null;
    let distance = Infinity;
    rows.forEach((row, index) => {
      const rect = row.getBoundingClientRect();
      const delta = Math.abs(y - (rect.top + rect.height / 2));
      if (delta < distance) {
        nearest = index;
        distance = delta;
      }
    });
    return nearest;
  }

  // Scroll the dialog near its edges so longer recipes can be dragged on small screens.
  useEffect(() => {
    if (!dragging) return;
    let frame: number;
    let previousTime = 0;
    const update = (time: number) => {
      const current = session.current;
      if (!current?.active) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16;
      previousTime = time;
      const { scroller, x, y } = current;
      if (scroller) {
        const bounds = scroller.getBoundingClientRect();
        const top = Math.max(0, bounds.top);
        const bottom = Math.min(window.innerHeight, bounds.bottom);
        if (x >= bounds.left && x <= bounds.right && y >= top && y <= bottom) {
          const speed = y < top + 55 ? -1 : y > bottom - 55 ? 1 : 0;
          scroller.scrollTop += speed * elapsed * 0.5;
        }
      }
      const next = {
        ...current.bounds,
        card: current.card,
        x: x - current.startX,
        y: y - current.startY,
        target: dropTarget(x, y),
      };
      setDrag((old) =>
        old?.x === next.x && old.y === next.y && old.target === next.target ? old : next,
      );
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [dragging]);

  function move(card: string, to: number, keyboard = false) {
    const from = cards.indexOf(card);
    if (disabled || from < 0 || to < 0 || to >= cards.length) return;
    if (from !== to) {
      const button = list.current?.children[from].querySelector('button');
      if (button) focusAfterMove.current = { button, keyboard };
      const next = [...cards];
      next.splice(from, 1);
      next.splice(to, 0, card);
      onChange(next);
    }
    setSelected(null);
    setAnnouncement(`${card} is now step ${to + 1} of ${cards.length}.`);
  }

  function cancelDrag() {
    if (session.current?.active) {
      suppressClick.current = true;
      setAnnouncement('Move cancelled. The recipe order has not changed.');
    }
    session.current = null;
    setDrag(null);
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, card: string) {
    if (disabled || !event.isPrimary || event.button !== 0 || session.current) return;
    suppressClick.current = false;
    const scroller = scrollParent(event.currentTarget);
    const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
    session.current = {
      card,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      bounds: { top, left, width, height },
      scroller,
      active: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <div className="sequence-list">
      <p className="small muted" id={instructionsId}>
        Drag each card to put the recipe in order. You can also tap a card, then tap its new place.
        <span className="visually-hidden">
          {' '}
          With a keyboard, use Enter to select and place, or the up and down keys to move a card.
          Press Escape to cancel a move.
        </span>
      </p>
      <ol ref={list} className="sequence-cards" aria-label="Recipe steps">
        {cards.map((card, index) => {
          const isDragging = drag?.card === card;
          const target = drag?.target === index && !isDragging;
          return (
            <li
              key={card}
              className={`sequence-slot ${isDragging ? 'drag-origin' : ''} ${target ? 'drop-target' : ''}`}
              style={isDragging ? { height: drag.height } : undefined}
            >
              <button
                type="button"
                className={`sequence-card ${isDragging ? 'dragging' : ''} ${selected === card && !disabled ? 'selected' : ''}`}
                disabled={disabled}
                aria-label={`${card}. Step ${index + 1} of ${cards.length}`}
                aria-describedby={instructionsId}
                aria-pressed={selected === card && !disabled}
                style={
                  isDragging
                    ? {
                        top: drag.top,
                        left: drag.left,
                        width: drag.width,
                        height: drag.height,
                        transform: `translate(${drag.x}px, ${drag.y}px)`,
                      }
                    : undefined
                }
                onPointerDown={(event) => startDrag(event, card)}
                onPointerMove={(event) => {
                  const current = session.current;
                  if (!current || current.pointerId !== event.pointerId) return;
                  current.x = event.clientX;
                  current.y = event.clientY;
                  if (
                    !current.active &&
                    Math.hypot(current.x - current.startX, current.y - current.startY) > 6
                  ) {
                    current.active = true;
                    setSelected(null);
                    setDrag({ ...current.bounds, card, x: 0, y: 0, target: index });
                    setAnnouncement(`Picked up ${card}. Drag it to its new place.`);
                  }
                }}
                onPointerUp={(event) => {
                  const current = session.current;
                  if (!current || current.pointerId !== event.pointerId) return;
                  if (current.active) {
                    suppressClick.current = true;
                    const targetIndex = dropTarget(event.clientX, event.clientY);
                    if (targetIndex !== null) move(current.card, targetIndex);
                    else setAnnouncement('Move cancelled. Drop the card on a recipe step.');
                  }
                  session.current = null;
                  setDrag(null);
                }}
                onPointerCancel={(event) => {
                  if (session.current?.pointerId === event.pointerId) cancelDrag();
                }}
                onLostPointerCapture={(event) => {
                  if (session.current?.pointerId === event.pointerId) cancelDrag();
                }}
                onClick={(event) => {
                  if (suppressClick.current && event.detail !== 0) {
                    suppressClick.current = false;
                    return;
                  }
                  suppressClick.current = false;
                  if (selected === card) {
                    setSelected(null);
                    setAnnouncement('Selection cancelled.');
                  } else if (selected) move(selected, index, event.detail === 0);
                  else {
                    setSelected(card);
                    setAnnouncement(`${card} selected. Choose its new place in the recipe.`);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && (session.current || selected)) {
                    event.preventDefault();
                    event.stopPropagation();
                    cancelDrag();
                    setSelected(null);
                    setAnnouncement('Move cancelled. The recipe order has not changed.');
                  } else if (
                    !session.current &&
                    (event.key === 'ArrowUp' || event.key === 'ArrowDown')
                  ) {
                    event.preventDefault();
                    move(card, index + (event.key === 'ArrowUp' ? -1 : 1), true);
                  }
                }}
              >
                <span className="sequence-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="sequence-text">{card}</span>
                <GripVertical className="sequence-grip" size={22} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
      <p className="sequence-status" role="status" aria-live="polite" aria-atomic="true">
        {announcement || 'First step at the top. Last step at the bottom.'}
      </p>
    </div>
  );
}
