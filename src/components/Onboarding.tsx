import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Player } from '../game';
import { Character } from './Character';
import { DifficultySelect } from './DifficultySelect';

export function Onboarding({
  player,
  onComplete,
}: {
  player: Player;
  onComplete: (changes: Partial<Player>) => void;
}) {
  const [nickname, setNickname] = useState(player.onboarded ? player.nickname : '');
  const [avatar, setAvatar] = useState(player.avatar);
  const [hat, setHat] = useState(player.hat);
  const [difficulty, setDifficulty] = useState(player.difficulty);
  return (
    <form
      className="onboarding"
      onSubmit={(event) => {
        event.preventDefault();
        onComplete({ nickname: nickname.trim() || 'Scout', avatar, hat, difficulty });
      }}
    >
      <div className="eyebrow">EVERY GREAT MYSTERY NEEDS YOU</div>
      <h2>Hello, little detective.</h2>
      <p>Let's get you ready for your first adventure.</p>
      <div className="avatar-preview">
        <Character who="detective" size={115} avatar={avatar} hat={hat} />
        <span>YOUR NEW ADVENTURE LOOK</span>
      </div>
      <label className="field-label" htmlFor="nickname">
        Pick a detective nickname
      </label>
      <input
        autoFocus
        id="nickname"
        maxLength={16}
        placeholder="How about Scout?"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
      />
      <small className="small muted">A made-up name is perfect. It stays on this device.</small>
      <fieldset>
        <legend>Choose your detective</legend>
        <div className="avatar-options">
          {[0, 1, 2, 3].map((item) => (
            <button
              type="button"
              aria-label={`Detective avatar ${item + 1}`}
              aria-pressed={avatar === item}
              className={avatar === item ? 'selected' : ''}
              key={item}
              onClick={() => setAvatar(item)}
            >
              <Character who="detective" size={60} avatar={item} hat={hat} />
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Top it off</legend>
        <div className="hat-options">
          {(['cap', 'beanie', 'bow'] as const).map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={hat === item}
              className={hat === item ? 'selected' : ''}
              onClick={() => setHat(item)}
            >
              {item === 'cap'
                ? '🧢 Detective cap'
                : item === 'beanie'
                  ? '🎩 Cozy beanie'
                  : '🎀 Lucky bow'}
            </button>
          ))}
        </div>
      </fieldset>
      <DifficultySelect
        id="onboard-difficulty"
        label="Choose your adventure level"
        value={difficulty}
        onChange={setDifficulty}
      />
      <button type="submit" className="button primary full">
        Let's do some detecting <ArrowRight size={18} />
      </button>
    </form>
  );
}
