import type { Difficulty } from '../game';

const difficultyLabels: Record<Difficulty, string> = {
  junior: 'Junior Detective',
  detective: 'Detective',
  master: 'Master Detective',
};

export function DifficultySelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}) {
  return (
    <>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as Difficulty)}
      >
        {Object.entries(difficultyLabels).map(([difficulty, name]) => (
          <option key={difficulty} value={difficulty}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}
