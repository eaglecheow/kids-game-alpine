import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Coins,
  Layers2,
  Move,
  Package,
  Sparkles,
} from 'lucide-react';
import { decorations, type Player, type RoomPlacement } from '../game';
import { clampRoomPosition, defaultRoomPlacement, getRoomItemSize } from '../clubhouse';
import { playSound } from '../audio';
import { Character } from './Character';
import { RoomItem } from './RoomItem';
import './Clubhouse.css';

interface Drag {
  id: string;
  pointerId: number;
  source: HTMLButtonElement;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  moved: boolean;
  roomRect: DOMRect;
}

export function Clubhouse({
  player,
  onChange,
}: {
  player: Player;
  onChange: (changes: Partial<Player>) => void;
}) {
  const roomRef = useRef<HTMLElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const selected = player.roomItems.find((item) => item.id === selectedId);
  const selectedItem = decorations.find((item) => item.id === selected?.id);
  const dragging = drag?.moved ?? false;

  const finishDrag = () => {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (current?.source.hasPointerCapture(current.pointerId)) {
      current.source.releasePointerCapture(current.pointerId);
    }
  };

  useEffect(() => {
    const cancel = () => {
      const current = dragRef.current;
      if (!current) return;
      suppressClick.current = current.id;
      dragRef.current = null;
      setDrag(null);
      if (current.source.hasPointerCapture(current.pointerId)) {
        current.source.releasePointerCapture(current.pointerId);
      }
      setStatus('Move cancelled. Your room stayed the same.');
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') cancel();
    };
    window.addEventListener('keydown', escape);
    window.addEventListener('blur', cancel);
    window.addEventListener('resize', cancel);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('resize', cancel);
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    let frame: number;
    const scrollWithTreasure = () => {
      const current = dragRef.current;
      if (!current?.moved) return;
      // A collection can be below the room on phones. Holding a treasure at the
      // screen edge lets the child carry it back to the room without releasing it.
      const edge = 80;
      const speed =
        current.clientY < edge
          ? -12 * (1 - Math.max(0, current.clientY) / edge)
          : current.clientY > window.innerHeight - edge
            ? 12 * (1 - Math.max(0, window.innerHeight - current.clientY) / edge)
            : 0;
      if (speed) window.scrollBy(0, speed);
      const roomRect = roomRef.current?.getBoundingClientRect();
      if (
        roomRect &&
        (roomRect.top !== current.roomRect.top || roomRect.left !== current.roomRect.left)
      ) {
        const next = { ...current, roomRect };
        dragRef.current = next;
        setDrag(next);
      }
      frame = requestAnimationFrame(scrollWithTreasure);
    };
    frame = requestAnimationFrame(scrollWithTreasure);
    return () => cancelAnimationFrame(frame);
  }, [dragging]);

  const nameFor = (id: string) => decorations.find((item) => item.id === id)!.name;
  const focusInRoom = (id: string) => {
    requestAnimationFrame(() => {
      roomRef.current?.querySelector<HTMLButtonElement>(`[data-room-item="${id}"]`)?.focus();
    });
  };

  const selectOrPlace = (id: string, keyboardClick: boolean) => {
    if (suppressClick.current === id && !keyboardClick) {
      suppressClick.current = null;
      return;
    }
    const item = decorations.find((decoration) => decoration.id === id)!;
    const owned = player.unlocked.includes(id);
    if (!owned && player.coins < item.price) return;
    const placed = player.roomItems.some((placement) => placement.id === id);
    if (!placed) {
      onChange({
        coins: owned ? player.coins : player.coins - item.price,
        unlocked: owned ? player.unlocked : [...player.unlocked, id],
        roomItems: [...player.roomItems, defaultRoomPlacement(id)],
      });
      setStatus(`${item.name} placed! Drag it anywhere or use the move buttons.`);
      playSound('click', player.sound);
    } else {
      setStatus(`${item.name} selected. Drag it or use the move buttons.`);
    }
    setSelectedId(id);
    focusInRoom(id);
  };

  const startDrag = (event: PointerEvent<HTMLButtonElement>, id: string, inRoom: boolean) => {
    if (!event.isPrimary || event.button !== 0 || dragRef.current) return;
    suppressClick.current = null;
    if (!player.unlocked.includes(id)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const current: Drag = {
      id,
      pointerId: event.pointerId,
      source: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      clientX: event.clientX,
      clientY: event.clientY,
      offsetX: inRoom ? event.clientX - (rect.left + rect.width / 2) : 0,
      offsetY: inRoom ? event.clientY - (rect.top + rect.height / 2) : 0,
      moved: false,
      roomRect: roomRef.current!.getBoundingClientRect(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = current;
    setDrag(current);
    setSelectedId(id);
  };

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const next = {
      ...current,
      clientX: event.clientX,
      clientY: event.clientY,
      roomRect: roomRef.current!.getBoundingClientRect(),
      moved:
        current.moved ||
        Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 5,
    };
    dragRef.current = next;
    setDrag(next);
  };

  const dropDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.moved) {
      suppressClick.current = current.id;
      const rect = roomRef.current!.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        const position = clampRoomPosition(
          current.id,
          ((event.clientX - current.offsetX - rect.left) / rect.width) * 100,
          ((event.clientY - current.offsetY - rect.top) / rect.height) * 100,
        );
        const placement = { id: current.id, ...position };
        const placed = player.roomItems.some((item) => item.id === current.id);
        onChange({
          roomItems: placed
            ? player.roomItems.map((item) => (item.id === current.id ? placement : item))
            : [...player.roomItems, placement],
        });
        setStatus(`${nameFor(current.id)} placed. Looking good!`);
        playSound('click', player.sound);
        focusInRoom(current.id);
      } else {
        setStatus('Drop inside the room to place your treasure. Your room stayed the same.');
      }
    }
    finishDrag();
  };

  const cancelDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    suppressClick.current = dragRef.current.id;
    finishDrag();
    setStatus('Move cancelled. Your room stayed the same.');
  };

  const moveItem = (item: RoomPlacement, dx: number, dy: number) => {
    const position = clampRoomPosition(item.id, item.x + dx, item.y + dy);
    onChange({
      roomItems: player.roomItems.map((entry) =>
        entry.id === item.id ? { ...item, ...position } : entry,
      ),
    });
    setStatus(
      `${nameFor(item.id)} moved to ${Math.round(position.x)}% across, ${Math.round(position.y)}% down.`,
    );
  };

  const putAway = (id: string) => {
    onChange({ roomItems: player.roomItems.filter((item) => item.id !== id) });
    setSelectedId(null);
    setStatus(`${nameFor(id)} is back in your collection. You can place it again anytime.`);
    requestAnimationFrame(() => document.getElementById(`collection-${id}`)?.focus());
  };

  const handleItemKey = (event: KeyboardEvent<HTMLButtonElement>, item: RoomPlacement) => {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 5 : 1;
      moveItem(item, direction[0] * step, direction[1] * step);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      putAway(item.id);
    }
  };

  const reorder = (front: boolean) => {
    if (!selected) return;
    const others = player.roomItems.filter((item) => item.id !== selected.id);
    onChange({ roomItems: front ? [...others, selected] : [selected, ...others] });
    setStatus(`${nameFor(selected.id)} moved to the ${front ? 'front' : 'back'}.`);
  };

  const roomRect = drag?.moved ? drag.roomRect : null;
  const inside = !!(
    drag &&
    roomRect &&
    drag.clientX >= roomRect.left &&
    drag.clientX <= roomRect.right &&
    drag.clientY >= roomRect.top &&
    drag.clientY <= roomRect.bottom
  );
  const ghostPosition =
    drag && roomRect
      ? clampRoomPosition(
          drag.id,
          ((drag.clientX - drag.offsetX - roomRect.left) / roomRect.width) * 100,
          ((drag.clientY - drag.offsetY - roomRect.top) / roomRect.height) * 100,
        )
      : null;

  return (
    <div className="clubhouse-layout">
      <div className="clubhouse-workspace">
        <p className="room-instructions" id="room-instructions">
          <Move size={18} aria-hidden="true" /> Drag your treasures anywhere. There’s room for them
          all!
        </p>
        <section
          ref={roomRef}
          className={`clubhouse-room freeform-room ${drag?.moved && inside ? 'is-dragging' : ''}`}
          aria-label="Your decorated detective clubhouse"
          aria-describedby="room-instructions"
        >
          <div className="room-window" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="room-bunting" aria-hidden="true">
            ▾ ▾ ▾ ▾ ▾ ▾
          </div>
          <div className="room-shelf" aria-hidden="true" />
          <div className="room-desk" aria-hidden="true" />
          <div className="room-detective" aria-hidden="true">
            <Character who="detective" size={150} avatar={player.avatar} hat={player.hat} />
          </div>
          <div className="room-name">{player.nickname}'s clubhouse</div>
          {!player.roomItems.length && (
            <div className="room-empty-hint">
              <Sparkles size={24} />
              <span>Choose a treasure to make this room yours.</span>
            </div>
          )}
          {player.roomItems.map((item, index) => {
            const size = getRoomItemSize(item.id);
            return (
              <button
                key={item.id}
                data-room-item={item.id}
                className={`placed-decoration ${selectedId === item.id ? 'selected' : ''} ${drag?.moved && drag.id === item.id ? 'drag-origin' : ''}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${size.width}%`,
                  height: `${size.height}%`,
                  zIndex: index + 5,
                }}
                aria-label={nameFor(item.id)}
                aria-pressed={selectedId === item.id}
                aria-describedby="room-keyboard-help"
                onFocus={() => setSelectedId(item.id)}
                onClick={(event) => selectOrPlace(item.id, event.detail === 0)}
                onPointerDown={(event) => startDrag(event, item.id, true)}
                onPointerMove={moveDrag}
                onPointerUp={dropDrag}
                onPointerCancel={cancelDrag}
                onLostPointerCapture={cancelDrag}
                onKeyDown={(event) => handleItemKey(event, item)}
                onDragStart={(event) => event.preventDefault()}
              >
                <RoomItem id={item.id} />
              </button>
            );
          })}
        </section>
        <div className="room-controls" aria-label="Move your selected treasure">
          {selected && selectedItem ? (
            <>
              <div className="room-selection">
                <small>YOUR SELECTED TREASURE</small>
                <strong>{selectedItem.name}</strong>
              </div>
              <div className="room-move-buttons" role="group" aria-label="Move treasure">
                <button aria-label="Move left" onClick={() => moveItem(selected, -2, 0)}>
                  <ArrowLeft size={18} />
                </button>
                <button aria-label="Move up" onClick={() => moveItem(selected, 0, -2)}>
                  <ArrowUp size={18} />
                </button>
                <button aria-label="Move down" onClick={() => moveItem(selected, 0, 2)}>
                  <ArrowDown size={18} />
                </button>
                <button aria-label="Move right" onClick={() => moveItem(selected, 2, 0)}>
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="room-item-actions">
                <button
                  onClick={() => reorder(true)}
                  disabled={player.roomItems.at(-1)?.id === selected.id}
                >
                  <Layers2 size={16} />
                  Bring to front
                </button>
                <button
                  onClick={() => reorder(false)}
                  disabled={player.roomItems[0]?.id === selected.id}
                >
                  <Layers2 size={16} />
                  Send to back
                </button>
                <button onClick={() => putAway(selected.id)}>
                  <Package size={16} />
                  Put away
                </button>
              </div>
            </>
          ) : (
            <p className="room-controls-hint">
              <Move size={20} />
              Choose a treasure in your collection to place or move it.
            </p>
          )}
          <p id="room-keyboard-help">
            You can also use the move buttons, or focus a room item and use arrow keys. Shift +
            arrow moves farther.
          </p>
        </div>
        <p className="room-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
      <aside className="decoration-shop" aria-label="Your treasure collection and shop">
        <div className="shop-title">
          <h3>
            <Sparkles size={20} />A little room magic
          </h3>
          <p>
            Drag a treasure into your room, or tap to place it. Tap a placed treasure to move it.
          </p>
        </div>
        <p className="room-collection-count">
          {player.roomItems.length} in your room · {player.unlocked.length} owned
        </p>
        <div className="decorations-grid">
          {decorations.map((item) => {
            const owned = player.unlocked.includes(item.id);
            const placed = player.roomItems.some((placement) => placement.id === item.id);
            return (
              <button
                id={`collection-${item.id}`}
                key={item.id}
                className={`decoration-item ${placed ? 'equipped' : ''} ${owned ? 'owned' : ''} ${selectedId === item.id ? 'selected' : ''}`}
                disabled={!owned && player.coins < item.price}
                aria-label={`${item.name}: ${placed ? 'placed, select to move' : owned ? 'place in room' : `buy and place for ${item.price} coins`}`}
                aria-pressed={selectedId === item.id}
                onClick={(event) => selectOrPlace(item.id, event.detail === 0)}
                onPointerDown={(event) => startDrag(event, item.id, false)}
                onPointerMove={moveDrag}
                onPointerUp={dropDrag}
                onPointerCancel={cancelDrag}
                onLostPointerCapture={cancelDrag}
                onDragStart={(event) => event.preventDefault()}
              >
                <span className="decoration-icon">
                  <RoomItem id={item.id} size={42} />
                </span>
                <strong>{item.name}</strong>
                <small>
                  {placed ? (
                    <>
                      <Check size={13} />
                      Placed · move
                    </>
                  ) : owned ? (
                    'Place in room'
                  ) : (
                    <>
                      <Coins size={13} />
                      {item.price} · buy & place
                    </>
                  )}
                </small>
              </button>
            );
          })}
        </div>
      </aside>
      {drag?.moved &&
        roomRect &&
        ghostPosition &&
        createPortal(
          <div
            aria-hidden="true"
            className={`room-drag-preview ${inside ? '' : 'outside'}`}
            style={{
              left: inside
                ? roomRect.left + (roomRect.width * ghostPosition.x) / 100
                : drag.clientX - drag.offsetX,
              top: inside
                ? roomRect.top + (roomRect.height * ghostPosition.y) / 100
                : drag.clientY - drag.offsetY,
              width: (roomRect.width * getRoomItemSize(drag.id).width) / 100,
              height: (roomRect.height * getRoomItemSize(drag.id).height) / 100,
            }}
          >
            <RoomItem id={drag.id} />
          </div>,
          document.body,
        )}
    </div>
  );
}
