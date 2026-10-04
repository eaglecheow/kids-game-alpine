import { Music2, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import type { Player } from '../game';
import { playSound, setMusic } from '../audio';
import { Character } from './Character';
import { DifficultySelect } from './DifficultySelect';

type Preferences = Pick<Player, 'nickname' | 'avatar' | 'hat' | 'difficulty' | 'sound' | 'music'>;

export function SettingsPanel({
  player,
  onChange,
  onCustomize,
  onReset,
}: {
  player: Preferences;
  onChange: (changes: Partial<Preferences>) => void;
  onCustomize: () => void;
  onReset: () => void;
}) {
  return (
    <div className="settings-content">
      <div className="eyebrow">JUST THE WAY YOU LIKE IT</div>
      <h2>Detective settings</h2>
      <div className="profile-settings">
        <Character who="detective" size={90} avatar={player.avatar} hat={player.hat} />
        <div>
          <label htmlFor="settings-nickname">Detective nickname</label>
          <input
            id="settings-nickname"
            maxLength={16}
            value={player.nickname}
            onChange={(event) => onChange({ nickname: event.target.value })}
            onBlur={() => {
              if (!player.nickname.trim()) onChange({ nickname: 'Detective' });
            }}
          />
          <small>Only saved on this device.</small>
        </div>
      </div>
      <DifficultySelect
        id="difficulty"
        label="Adventure level"
        value={player.difficulty}
        onChange={(difficulty) => onChange({ difficulty })}
      />
      <p className="small muted">Change this anytime. Your discoveries stay with you.</p>
      <div className="settings-toggle">
        <span>
          <Volume2 size={20} />
          <div>
            Little sound effects<small>A sparkle for each discovery</small>
          </div>
        </span>
        <button
          role="switch"
          aria-checked={player.sound}
          aria-label="Sound effects"
          className={`toggle ${player.sound ? 'on' : ''}`}
          onClick={() => {
            onChange({ sound: !player.sound });
            playSound('click', !player.sound);
          }}
        >
          <span />
        </button>
      </div>
      <div className="settings-toggle">
        <span>
          <Music2 size={20} />
          <div>
            Cozy background music<small>A quiet tune for curious minds</small>
          </div>
        </span>
        <button
          role="switch"
          aria-checked={player.music}
          aria-label="Background music"
          className={`toggle ${player.music ? 'on' : ''}`}
          onClick={() => {
            onChange({ music: !player.music });
            setMusic(!player.music);
          }}
        >
          <span />
        </button>
      </div>
      <button className="button secondary full" onClick={onCustomize}>
        Change my detective look <Sparkles size={17} />
      </button>
      <div className="reset-progress-section">
        <h3>Start a fresh adventure</h3>
        <p>Clear your mystery progress and rewards on this device.</p>
        <button className="button danger full" onClick={onReset}>
          <RotateCcw size={18} /> Reset all progress
        </button>
      </div>
    </div>
  );
}
