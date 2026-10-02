type CharacterProps = {
  who: 'ben' | 'hamster' | 'pip' | 'detective';
  size?: number;
  expression?: 'happy' | 'thinking';
  avatar?: number;
  hat?: 'cap' | 'beanie' | 'bow';
};

const names = {
  ben: 'Baker Ben',
  hamster: 'Professor Hamster',
  pip: 'Pip the Pigeon',
  detective: 'Junior detective',
};

export function Character({
  who,
  size = 100,
  expression = 'happy',
  avatar = 0,
  hat = 'cap',
}: CharacterProps) {
  const skin = ['#f8c393', '#ce9468', '#936248', '#e8b080'][avatar % 4];
  const hair = ['#583e32', '#382c2b', '#292c30', '#ae6536'][avatar % 4];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${names[who]}, ${expression}`}
    >
      <circle
        cx="100"
        cy="100"
        r="95"
        fill={
          who === 'ben'
            ? '#f6e2bb'
            : who === 'hamster'
              ? '#dcebdd'
              : who === 'pip'
                ? '#dce9ed'
                : '#f8e5ce'
        }
      />
      {who === 'ben' && (
        <g stroke="#384945" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M42 189v-33q6-29 33-32h49q29 4 35 32v33" fill="#71a7a0" />
          <path d="M69 132l11 57h42l9-57-19 12H90z" fill="#dd805e" />
          <path d="M80 157h40v32H80z" fill="#f5c894" strokeWidth="2" />
          <path d="M77 130l23 15-16 11-16-21m55-5-23 15 16 11 16-21" fill="#fff7e6" />
          <circle cx="62" cy="89" r="12" fill="#f8c393" />
          <circle cx="139" cy="89" r="12" fill="#f8c393" />
          <path d="M63 65q4-25 37-25t37 25v35q-1 35-37 36-37-1-37-36z" fill="#f8c393" />
          <path
            d="M65 74q-10-18-2-27l18-12h39l17 15q6 9-1 22l-6-15H72z"
            fill="#72503a"
            stroke="none"
          />
          <path
            d="M68 54c-20 0-26-26-8-35 10-5 19-1 23 6 2-22 31-23 36-2 18-14 39 4 30 22-3 6-9 9-17 9l-5 16H73z"
            fill="#fffdf1"
          />
          <path d="M72 58h57v13H72z" fill="#f2e8ce" />
          <ellipse cx="80" cy="99" rx="10" ry="6" fill="#ec9b84" stroke="none" />
          <ellipse cx="121" cy="99" rx="10" ry="6" fill="#ec9b84" stroke="none" />
          <path
            d={expression === 'thinking' ? 'M76 79l11-4m25 3h10' : 'M77 78q5-3 10 0m25 0q5-3 10 0'}
            fill="none"
          />
          <ellipse cx="84" cy="88" rx="3" ry="4.5" fill="#384945" stroke="none" />
          <ellipse cx="117" cy="88" rx="3" ry="4.5" fill="#384945" stroke="none" />
          <path d="M100 88q-8 6-5 12h9" fill="#efab80" stroke="#bd7e5a" strokeWidth="2" />
          <path
            d="M100 103q-8-11-18-3l-7 9q17 9 25-1 9 10 25 1l-7-9q-10-8-18 3"
            fill="#72503a"
            stroke="none"
          />
          <path d="M89 117q12 10 23 0" fill="#fff7df" strokeWidth="2.5" />
        </g>
      )}
      {who === 'hamster' && (
        <g stroke="#384945" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M45 190v-31q3-28 33-34h45q28 7 32 34v31" fill="#fffdf0" />
          <path d="M78 128l22 20 21-20-6 61H86z" fill="#76aaa0" />
          <path d="M75 128l-9 24 15 8-11 17 21 13m34-62 9 24-15 8 11 17-21 13" fill="#f8f3e3" />
          <path d="M127 163h19v15h-19z" fill="#fffdf0" strokeWidth="2" />
          <path d="M134 151v14m7-10v10" stroke="#de8564" />
          <circle cx="60" cy="61" r="24" fill="#c89963" />
          <circle cx="140" cy="61" r="24" fill="#c89963" />
          <circle cx="60" cy="61" r="13" fill="#edb99c" stroke="none" />
          <circle cx="140" cy="61" r="13" fill="#edb99c" stroke="none" />
          <path d="M51 91q-1-38 49-39 50 1 49 39 7 40-49 45-54-5-49-45" fill="#d5ad79" />
          <path d="M84 54l5-14 9 9 7-18 5 22" fill="#d5ad79" />
          <ellipse cx="100" cy="111" rx="30" ry="24" fill="#f2dfba" stroke="none" />
          <circle cx="79" cy="86" r="19" fill="#f8f6de" fillOpacity=".6" />
          <circle cx="121" cy="86" r="19" fill="#f8f6de" fillOpacity=".6" />
          <path d="M98 85h5M52 77l8 5m80 0 8-5" fill="none" />
          <path
            d={expression === 'thinking' ? 'M71 78l13-4m30 5h13' : 'M71 77q8-5 14 0m29 0q8-5 14 0'}
            fill="none"
            strokeWidth="2.5"
          />
          <circle cx="79" cy="87" r="3.5" fill="#384945" stroke="none" />
          <circle cx="121" cy="87" r="3.5" fill="#384945" stroke="none" />
          <path d="M92 106q8-7 16 0l-8 7z" fill="#bd805c" stroke="none" />
          <path d="M100 112v7m-9-1q9 11 18 0" fill="none" strokeWidth="2.5" />
          <path d="M95 122h10v8H95z" fill="#fffdf0" strokeWidth="1.7" />
          <path d="M100 122v7" strokeWidth="1.5" />
          <path d="M58 105l-13-3m14 11-15 3m98-11 13-3m-14 11 15 3" fill="none" strokeWidth="2" />
          <path d="M47 177q-7-9-11-2-7 1-2 10l11 7 9-9" fill="#d5ad79" />
          <path
            d="M39 169l-5-16h13l-4 16 11 17q1 7-9 7H31q-8-1-5-7z"
            fill="#c5e4cd"
            strokeWidth="2.5"
          />
          <path d="M29 182h21l3 6q0 4-9 4H32q-6 0-3-10" fill="#80b49a" stroke="none" />
          <circle cx="39" cy="179" r="2" fill="#fffdf0" stroke="none" />
        </g>
      )}
      {who === 'pip' && (
        <g stroke="#384945" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M59 182q-20-30-11-58l17-30 68 1q22 30 16 59l-20 28" fill="#91abae" />
          <path d="M58 127q-17 30 3 49l17-14-1-23M141 128q16 30-3 49l-14-15 1-22" fill="#708f98" />
          <path d="M76 91q10-8 42-2l15 25-15 20-35-3-14-21" fill="#609590" stroke="none" />
          <path d="M78 114q21 14 41-1" fill="none" stroke="#b4c8b3" strokeWidth="6" />
          <path d="M68 74q0-31 29-36 31-4 39 22v24q-2 34-34 34-35-5-34-31z" fill="#a9bdbe" />
          <path d="M82 43q-1-11 9-14 1 11 11 8 1-13 8-15 0 18 10 20" fill="#a9bdbe" />
          <ellipse cx="104" cy="87" rx="31" ry="24" fill="#bdcdcb" stroke="none" />
          <circle cx="87" cy="72" r="5" fill="#fffef1" stroke="none" />
          <circle cx="119" cy="72" r="5" fill="#fffef1" stroke="none" />
          <circle cx="88" cy="73" r="3.5" fill="#384945" stroke="none" />
          <circle cx="118" cy="73" r="3.5" fill="#384945" stroke="none" />
          <path
            d={expression === 'thinking' ? 'M78 63l14 4m19-4 13-4' : 'M79 61l14 5m17 0 14-5'}
            fill="none"
          />
          <path d="M100 78l20 12-20 11-8-11z" fill="#e9b86c" />
          <path d="M95 91h22" fill="none" strokeWidth="2" />
          <ellipse cx="82" cy="92" rx="6" ry="4" fill="#dfafa1" stroke="none" />
          <path d="M75 128l51 47" stroke="#b28963" strokeWidth="9" />
          <rect x="100" y="156" width="34" height="28" rx="7" fill="#d8ab74" />
          <path d="M100 166h34" fill="none" strokeWidth="2" />
          <circle cx="117" cy="169" r="2.5" fill="#384945" stroke="none" />
          <path
            d="M76 183v9m-10 1 10-3 10 3m35-10v9m-10 1 10-3 10 3"
            fill="none"
            stroke="#b38565"
            strokeWidth="5"
          />
        </g>
      )}
      {who === 'detective' && (
        <g stroke="#384945" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 190v-31q3-29 37-34h46q32 5 37 34v31" fill="#dd8b59" />
          <path d="M81 133l19 14 20-14-7 56H89z" fill="#f2c67b" />
          <path d="M77 129l-12 24 17 5-11 16 19 16m33-61 12 24-17 5 11 16-19 16" fill="#e4a570" />
          <path d="M108 144l29 35" stroke="#8a694a" strokeWidth="6" />
          <rect x="121" y="172" width="24" height="18" rx="4" fill="#b89c70" strokeWidth="2" />
          <path d="M91 121v17q9 12 18 0v-17" fill={skin} />
          <circle cx="61" cy="86" r="11" fill={skin} />
          <circle cx="139" cy="86" r="11" fill={skin} />
          <path d="M62 61q4-30 38-30 36 1 38 30v40q-4 31-38 34-34-4-38-34z" fill={skin} />
          <path
            d="M63 81q-13-30 4-44 13-15 36-11 40 0 35 52l-10-25-13 13-15-20-19 21-11-6z"
            fill={hair}
            stroke="none"
          />
          {hat === 'cap' && (
            <g>
              <path d="M54 55q2-29 47-32 36 0 42 32z" fill="#6b9e94" />
              <path d="M50 55q44-13 97 0l10 11q-54-5-101 1z" fill="#50887f" />
              <path d="M90 28v20m28-17v18" fill="none" stroke="#8db6a6" strokeWidth="3" />
              <circle cx="103" cy="41" r="7" fill="#f2d595" strokeWidth="2" />
              <path d="M103 37v7m-3-3h6" strokeWidth="1.5" />
            </g>
          )}
          {hat === 'beanie' && (
            <g>
              <path d="M56 53q2-34 44-34 40 1 44 34z" fill="#d79870" />
              <path d="M66 40h70m-58-9h46" stroke="#e9b58b" strokeWidth="3" />
              <rect x="54" y="49" width="93" height="17" rx="7" fill="#c17b57" />
              <path
                d="M64 53v9m11-9v9m11-9v9m11-9v9m11-9v9m11-9v9m11-9v9"
                stroke="#e4a984"
                strokeWidth="2"
              />
              <circle cx="100" cy="16" r="11" fill="#e6b381" />
            </g>
          )}
          {hat === 'bow' && (
            <g>
              <path d="M66 42q36-29 68-2" fill="none" stroke="#88aca0" strokeWidth="7" />
              <path d="M122 43q-29-24-32-4-4 14 29 13 27 9 27-7-2-22-24-2" fill="#e99f91" />
              <circle cx="121" cy="46" r="6" fill="#ca7e75" />
            </g>
          )}
          <path
            d={expression === 'thinking' ? 'M77 76l12-5m23 5h12' : 'M78 74q6-3 11 0m23 0q6-3 11 0'}
            fill="none"
            stroke={hair}
            strokeWidth="2.5"
          />
          <ellipse cx="85" cy="85" rx="3.5" ry="5" fill="#384945" stroke="none" />
          <ellipse cx="118" cy="85" rx="3.5" ry="5" fill="#384945" stroke="none" />
          <path d="M100 90l-3 9h7" fill="none" strokeWidth="2" strokeOpacity=".5" />
          <ellipse cx="78" cy="101" rx="8" ry="5" fill="#dd9b84" fillOpacity=".7" stroke="none" />
          <ellipse cx="124" cy="101" rx="8" ry="5" fill="#dd9b84" fillOpacity=".7" stroke="none" />
          <path
            d={expression === 'thinking' ? 'M95 114q6-3 12 0' : 'M89 110q12 15 25 0z'}
            fill={expression === 'happy' ? '#fff9e8' : 'none'}
            strokeWidth="2.5"
          />
          <circle cx="58" cy="168" r="13" fill="#f5d688" strokeWidth="2" />
          <path d="M58 161l2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" fill="#b68c4f" stroke="none" />
        </g>
      )}
    </svg>
  );
}
