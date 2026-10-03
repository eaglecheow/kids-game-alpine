import { useState } from 'react';
import { ArrowUp, Check, Lightbulb, Sparkles } from 'lucide-react';
import { publicAsset } from '../assets';
import { SequenceCards } from './SequenceCards';
import { TilesPuzzle } from './TilesPuzzle';
import {
  validateAnswer,
  type Puzzle as PuzzleData,
  type PuzzleAnswer,
  type TilePlacement,
} from '../game';

function SortPicture({ icon, picture }: { icon: string; picture?: string }) {
  return picture ? (
    <svg
      className="sort-picture"
      viewBox="0 0 160 100"
      width="160"
      height="100"
      aria-hidden="true"
      focusable="false"
    >
      <use href={publicAsset(picture)} />
    </svg>
  ) : (
    <span aria-hidden="true">{icon}</span>
  );
}

export function Puzzle({
  puzzle,
  onSolved,
  junior,
}: {
  puzzle: PuzzleData;
  onSolved: () => void;
  junior: boolean;
}) {
  const [number, setNumber] = useState('');
  const [choice, setChoice] = useState<number | null>(null);
  const [cards, setCards] = useState(puzzle.type === 'sequence' ? puzzle.cards : []);
  const [hint, setHint] = useState(junior);
  const [feedback, setFeedback] = useState('');
  const [success, setSuccess] = useState(false);
  const [route, setRoute] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [placements, setPlacements] = useState<(TilePlacement | null)[]>(() =>
    puzzle.type === 'tiles' ? Array(puzzle.rows * puzzle.columns).fill(null) : [],
  );
  const check = () => {
    const answer: PuzzleAnswer | null =
      puzzle.type === 'sequence'
        ? cards
        : puzzle.type === 'choice'
          ? choice
          : puzzle.type === 'route'
            ? route
            : puzzle.type === 'sort'
              ? assigned
              : puzzle.type === 'tiles'
                ? placements
                : number.trim()
                  ? Number(number)
                  : NaN;
    const correct = answer !== null && validateAnswer(puzzle, answer);
    setSuccess(correct);
    setFeedback(correct ? puzzle.success : `Let's look a little closer. ${puzzle.hint}`);
  };
  return (
    <div className="puzzle-content">
      <div className="puzzle-label">
        <Sparkles size={16} /> A CLUE NEEDS YOUR CLEVER THINKING
      </div>
      <h2>{puzzle.title}</h2>
      <p className="puzzle-question">{puzzle.question}</p>
      {puzzle.type === 'number' && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            check();
          }}
        >
          <label className="answer-label" htmlFor="number-answer">
            Your discovery
          </label>
          <div className="number-answer">
            <input
              autoFocus
              id="number-answer"
              inputMode="decimal"
              type="number"
              min="0"
              step="any"
              value={number}
              onChange={(event) => {
                setNumber(event.target.value);
                setFeedback('');
              }}
              disabled={success}
              placeholder="?"
            />
            <span>{puzzle.unit ?? 'in total'}</span>
          </div>
        </form>
      )}
      {puzzle.type === 'choice' && (
        <div className="answer-options">
          {puzzle.options.map((option, index) => (
            <button
              className={`answer-option ${choice === index ? 'selected' : ''}`}
              key={option}
              onClick={() => {
                setChoice(index);
                setFeedback('');
              }}
              disabled={success}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {choice === index && <Check size={18} />}
            </button>
          ))}
        </div>
      )}
      {puzzle.type === 'sequence' && (
        <SequenceCards
          cards={cards}
          disabled={success}
          onChange={(next) => {
            setCards(next);
            setFeedback('');
          }}
        />
      )}
      {puzzle.type === 'route' && (
        <div className="route-puzzle">
          <p className="small muted">Start at S. Choose neighboring path squares to reach F.</p>
          <div className="route-legend">
            <span>S: {puzzle.landmarks[puzzle.start] ?? 'Start'}</span>
            {puzzle.checkpoints.map((cell, index) => (
              <span key={cell}>
                {index + 1}: {puzzle.landmarks[cell] ?? 'Clue stop'}
              </span>
            ))}
            <span>F: {puzzle.landmarks[puzzle.end] ?? 'Finish'}</span>
          </div>
          <div
            className="route-grid"
            role="group"
            aria-label="Investigation map"
            style={{ gridTemplateColumns: `repeat(${puzzle.columns}, minmax(44px, 1fr))` }}
          >
            {Array.from({ length: puzzle.rows * puzzle.columns }, (_, index) => {
              const row = Math.floor(index / puzzle.columns);
              const column = index % puzzle.columns;
              const cell = `r${row + 1}c${column + 1}`;
              const blocked = puzzle.blocked.includes(cell);
              const step = route.indexOf(cell);
              const checkpoint = puzzle.checkpoints.indexOf(cell);
              const current = route.at(-1) === cell;
              const marker =
                cell === puzzle.start
                  ? 'S'
                  : cell === puzzle.end
                    ? 'F'
                    : checkpoint >= 0
                      ? checkpoint + 1
                      : blocked
                        ? '🌿'
                        : '·';
              return (
                <button
                  key={cell}
                  className={`route-cell ${blocked ? 'blocked' : ''} ${step >= 0 ? 'visited' : ''} ${current ? 'current' : ''} ${cell in puzzle.landmarks ? 'landmark' : ''}`}
                  aria-label={`Row ${row + 1}, column ${column + 1}. ${puzzle.landmarks[cell] ?? (blocked ? 'Flowerbed, blocked' : 'Open path')}. ${cell === puzzle.start ? 'Start. ' : cell === puzzle.end ? 'Finish. ' : checkpoint >= 0 ? `Stop ${checkpoint + 1}. ` : ''}${step >= 0 ? `Path step ${step + 1}${current ? ', current position' : ''}.` : 'Not visited.'}`}
                  aria-current={current ? 'location' : undefined}
                  disabled={success || blocked}
                  onClick={() => {
                    if (route.length === 0) {
                      if (cell !== puzzle.start) {
                        setFeedback('Begin at the square marked S.');
                        return;
                      }
                    } else {
                      if (step >= 0) {
                        setFeedback(
                          'Use Undo to step back before changing this part of your path.',
                        );
                        return;
                      }
                      const last = route.at(-1)!.match(/^r(\d+)c(\d+)$/)!;
                      const distance =
                        Math.abs(row + 1 - Number(last[1])) +
                        Math.abs(column + 1 - Number(last[2]));
                      if (distance !== 1) {
                        setFeedback('Choose a square next to your current position.');
                        return;
                      }
                    }
                    setRoute([...route, cell]);
                    setFeedback('');
                  }}
                >
                  <span aria-hidden="true">{marker}</span>
                  {step >= 0 && (
                    <span className="route-step" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="small puzzle-selection" role="status">
            {route.length === 0
              ? 'Choose S to begin your investigation path.'
              : `${route.length} squares visited. Current position: ${puzzle.landmarks[route.at(-1)!] ?? route.at(-1)}.`}
          </p>
          <div className="puzzle-tools">
            <button
              className="button secondary"
              disabled={success || route.length === 0}
              onClick={() => {
                setRoute(route.slice(0, -1));
                setFeedback('');
              }}
            >
              Undo last step
            </button>
            <button
              className="button secondary"
              disabled={success || route.length === 0}
              onClick={() => {
                setRoute([]);
                setFeedback('');
              }}
            >
              Reset path
            </button>
          </div>
        </div>
      )}
      {puzzle.type === 'sort' && (
        <div className="sort-puzzle">
          <p className="small muted">
            Choose an object, then choose its tray. You can move it again.
          </p>
          <div className="sort-objects" role="group" aria-label="Objects to sort">
            {puzzle.objects.map((object) => {
              const tray = puzzle.trays.find((entry) => entry.id === assigned[object.id]);
              return (
                <button
                  key={object.id}
                  className={`sort-object ${selectedObject === object.id ? 'selected' : ''}`}
                  aria-pressed={selectedObject === object.id}
                  aria-label={`${object.label}. ${object.description}. ${tray ? `In ${tray.label}` : 'Unsorted'}.`}
                  disabled={success}
                  onClick={() => {
                    setSelectedObject(object.id);
                    setFeedback('');
                  }}
                >
                  <SortPicture icon={object.icon} picture={object.picture} />
                  <strong>{object.label}</strong>
                  <small>{object.description}</small>
                  <small>{tray ? `In ${tray.label}` : 'Unsorted'}</small>
                </button>
              );
            })}
          </div>
          <p className="small puzzle-selection" role="status">
            {selectedObject
              ? `${puzzle.objects.find((object) => object.id === selectedObject)!.label} selected. Choose its tray.`
              : 'Choose an object to sort.'}
          </p>
          <div className="sort-trays" role="group" aria-label="Sorting trays">
            {puzzle.trays.map((tray) => (
              <button
                key={tray.id}
                className="sort-tray"
                aria-label={`${tray.label}. ${tray.rule}. ${puzzle.objects.filter((object) => assigned[object.id] === tray.id).length} objects placed here.`}
                disabled={success || selectedObject === null}
                onClick={() => {
                  setAssigned({ ...assigned, [selectedObject!]: tray.id });
                  setFeedback(
                    `${puzzle.objects.find((object) => object.id === selectedObject)!.label} moved to ${tray.label}.`,
                  );
                }}
              >
                <strong>
                  <SortPicture icon={tray.icon} picture={tray.picture} /> {tray.label}
                </strong>
                <small>{tray.rule}</small>
                <small className="sort-tray-items">
                  {puzzle.objects
                    .filter((object) => assigned[object.id] === tray.id)
                    .map((object) => (
                      <span key={object.id}>
                        <SortPicture icon={object.icon} picture={object.picture} /> {object.label}
                      </span>
                    ))}
                </small>
              </button>
            ))}
          </div>
          <div className="puzzle-tools">
            <button
              className="button secondary"
              disabled={success || selectedObject === null || !assigned[selectedObject]}
              onClick={() => {
                const next = { ...assigned };
                delete next[selectedObject!];
                setAssigned(next);
                setFeedback('Object returned to the unsorted group.');
              }}
            >
              Return selected object
            </button>
          </div>
        </div>
      )}
      {puzzle.type === 'tiles' && (
        <TilesPuzzle
          puzzle={puzzle}
          placements={placements}
          onChange={setPlacements}
          disabled={success}
          onFeedback={setFeedback}
        />
      )}
      {hint && !success && (
        <div className="hint">
          <Lightbulb size={20} />
          <p>{puzzle.hint}</p>
        </div>
      )}
      {feedback && (
        <div className={`puzzle-feedback ${success ? 'success' : ''}`} role="status">
          <span>{success ? '✨' : '🔎'}</span>
          <p>{feedback}</p>
        </div>
      )}
      <div className="puzzle-actions">
        {!success ? (
          <>
            <button className="text-button" onClick={() => setHint(!hint)}>
              <Lightbulb size={18} />
              {hint ? 'Hide hint' : 'A little hint?'}
            </button>
            <button className="button primary" onClick={check}>
              Try my answer <ArrowUp className="arrow-right" size={18} />
            </button>
          </>
        ) : (
          <button className="button primary full" onClick={onSolved}>
            Add discovery to notebook <Check size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
