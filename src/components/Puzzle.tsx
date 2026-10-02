import { useState } from 'react';
import { ArrowDown, ArrowUp, Check, GripVertical, Lightbulb, Sparkles } from 'lucide-react';
import { validateAnswer, type Puzzle as PuzzleData } from '../game';

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
  const [dragged, setDragged] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= cards.length || from === to) return;
    setCards((current) => {
      const next = [...current];
      const [card] = next.splice(from, 1);
      next.splice(to, 0, card);
      return next;
    });
  };
  const check = () => {
    const answer =
      puzzle.type === 'sequence'
        ? cards
        : puzzle.type === 'choice'
          ? choice
          : number.trim()
            ? Number(number)
            : NaN;
    const correct = answer !== null && validateAnswer(puzzle, answer as number | string[]);
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
        <div className="sequence-list">
          <p className="small muted">
            Drag the handles, or use the arrows to put the story in order.
          </p>
          {cards.map((card, index) => (
            <div
              className={`sequence-card ${dragged === index ? 'dragging' : ''}`}
              key={card}
              data-card-index={index}
            >
              <button
                className="drag-handle"
                aria-label={`Drag ${card}`}
                disabled={success}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragged(index);
                }}
                onPointerUp={(event) => {
                  const row = document
                    .elementFromPoint(event.clientX, event.clientY)
                    ?.closest('[data-card-index]');
                  if (row) move(index, Number(row.getAttribute('data-card-index')));
                  setDragged(null);
                }}
                onPointerCancel={() => setDragged(null)}
              >
                <GripVertical size={19} />
              </button>
              <span className="sequence-number">{index + 1}</span>
              <span className="sequence-text">{card}</span>
              <div className="sequence-arrows">
                <button
                  aria-label={`Move ${card} up`}
                  disabled={success || index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  aria-label={`Move ${card} down`}
                  disabled={success || index === cards.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
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
