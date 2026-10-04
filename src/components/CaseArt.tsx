import { publicAsset } from '../assets';
import type { GameCase } from '../game';

export function CaseArt({ gameCase }: { gameCase: GameCase }) {
  if (gameCase.location === 'park') {
    const images: Record<string, string> = {
      'park-wrong-bench': publicAsset('park-bench-thumb.svg'),
      'park-flower-signs': publicAsset('park-flowers-thumb.svg'),
      'park-kite-tails': publicAsset('park-kites-thumb.svg'),
    };
    return (
      <img
        className="case-art park-case-art"
        src={images[gameCase.id]}
        alt={gameCase.description}
      />
    );
  }
  return (
    <CookieArt
      cupcake={gameCase.id === 'giant-cupcake'}
      recipe={gameCase.id === 'mystery-recipe'}
    />
  );
}

function CookieArt({ cupcake = false, recipe = false }: { cupcake?: boolean; recipe?: boolean }) {
  return (
    <svg viewBox="0 0 220 140" className="case-art" aria-hidden="true">
      <ellipse cx="114" cy="120" rx="75" ry="12" fill="#ecb569" opacity=".25" />
      {recipe ? (
        <g transform="rotate(-8 110 72)">
          <rect x="53" y="27" width="117" height="92" rx="7" fill="#c0cbb2" />
          <rect
            x="47"
            y="20"
            width="117"
            height="92"
            rx="7"
            fill="#fff8df"
            stroke="#d5be92"
            strokeWidth="2"
          />
          <path
            d="M65 64h81M65 80h61M65 96h74"
            stroke="#b2b594"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M83 49v-7c-10 0-7-14 1-11 3-8 13-8 16 0 8-3 11 11 1 11v7Z" fill="#e7c09a" />
          <circle cx="143" cy="40" r="6" fill="#dc9d6d" />
        </g>
      ) : cupcake ? (
        <>
          <path d="M66 74h92l-15 48H83Z" fill="#e47e73" />
          <path d="m88 85 7 31m18-31v31m20-31-7 31" stroke="#ffc3ac" strokeWidth="6" />
          <path
            d="M61 75c-13-24 8-40 26-39-2-25 41-30 49-10 26-3 38 24 24 48Z"
            fill="#fff5de"
            stroke="#ead7b5"
            strokeWidth="2"
          />
          <circle cx="117" cy="24" r="11" fill="#db665c" />
          <path
            d="m83 57 6 3m39-15 6 4m-24 17 5-2m38-6 6 2"
            stroke="#e49b4d"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x="31"
            y="50"
            width="153"
            height="68"
            rx="14"
            fill="#8ea7a1"
            transform="rotate(-7 108 84)"
          />
          <rect
            x="37"
            y="53"
            width="140"
            height="56"
            rx="9"
            fill="#c6d5cb"
            transform="rotate(-7 108 84)"
          />
          {[
            [65, 73],
            [105, 66],
            [146, 65],
            [79, 99],
            [126, 94],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="20" fill="#c68337" />
              <circle cx={x} cy={y - 2} r="18" fill="#edb45f" />
              <path
                d={`m${x - 8} ${y - 6} 4 -2m8 3 4 2m-11 9 4 2m6-14 2 1`}
                stroke="#805436"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ))}
          <path
            d="m166 28 5-10m-19 12-3-9m28 23 10-3"
            stroke="#ecac47"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      <path d="m29 30 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#e9a93b" />
    </svg>
  );
}
