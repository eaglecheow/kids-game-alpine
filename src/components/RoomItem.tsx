export function RoomItem({ id, size = 80 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g stroke="#53695d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {id === 'lamp' && (
          <>
            <ellipse cx="50" cy="90" rx="27" ry="5" fill="#c7c5a2" stroke="none" opacity=".4" />
            <path d="M33 86q0-8 17-8t17 8v3H33z" fill="#6e9481" />
            <path d="M50 79V37m0 19 8-10" fill="none" strokeWidth="4" />
            <path d="M43 12h14l18 30H25z" fill="#e2bd78" />
            <path d="M43 16 33 37m24-21 10 21" fill="none" stroke="#f6dca4" />
            <ellipse cx="50" cy="42" rx="25" ry="4" fill="#f5d89a" />
            <path d="M50 45v4" stroke="#cba166" strokeWidth="4" />
            <path d="M60 44v15" fill="none" strokeWidth="1.5" />
            <circle cx="60" cy="61" r="2" fill="#d8ac6d" strokeWidth="1.5" />
          </>
        )}
        {id === 'globe' && (
          <>
            <ellipse cx="50" cy="91" rx="25" ry="4" fill="#c7c5a2" stroke="none" opacity=".4" />
            <path d="M47 70v14m-13 5q2-7 16-7t17 7H34z" fill="#bd966b" />
            <path d="M71 13q22 19 4 45-11 17-28 15" fill="none" stroke="#b2956d" strokeWidth="5" />
            <path d="M73 13 28 66" fill="none" stroke="#8b8866" strokeWidth="3" />
            <circle cx="49" cy="39" r="28" fill="#a8cdca" />
            <path
              d="M30 20l12 2 3 8-8 9-12-5-4 7 1-13zm21 21 10 1 3 10-8 12-7-5-3-10zm20-20 6 16-8 9-8-4 1-10-6-7z"
              fill="#85ad82"
              stroke="none"
            />
            <path
              d="M23 34q26 11 53 2M39 14q-11 23 6 51m15-49q13 26-5 49"
              fill="none"
              stroke="#6e9e94"
              strokeWidth="1.3"
              opacity=".6"
            />
            <path d="M33 20q6-6 14-6" fill="none" stroke="#d3e5d0" strokeWidth="3" />
          </>
        )}
        {id === 'cookie-trophy' && (
          <>
            <ellipse cx="50" cy="92" rx="26" ry="4" fill="#c7c5a2" stroke="none" opacity=".4" />
            <path
              d="M38 51H23v9q1 17 20 15m19-24h15v9q-1 17-20 15"
              fill="none"
              stroke="#b29354"
              strokeWidth="5"
            />
            <path d="M32 49h36l-3 20q-2 10-15 10T35 69z" fill="#e4c47b" />
            <path d="M47 79v7h-17v6h40v-6H53v-7" fill="#d4ad66" />
            <path d="M37 52h26" stroke="#f5dd97" strokeWidth="3" />
            <circle cx="50" cy="32" r="22" fill="#d9ab6d" stroke="#ac8052" />
            <circle cx="48" cy="30" r="19" fill="#e5ba7f" stroke="none" />
            <path
              d="M36 24l5 1-1 5-5-1m16-11 5 3-2 4-5-2m-4 14 4-2 3 5-5 2m13-10 4-2 1 4-3 3m-27 7 4 1-1 4-4-1"
              fill="#89624c"
              stroke="none"
            />
            <path d="M49 59l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z" fill="#fff0ba" stroke="none" />
          </>
        )}
        {id === 'magnifying-poster' && (
          <>
            <path d="M18 6h64v87H18z" fill="#bf936a" />
            <path d="M24 12h52v69H24z" fill="#f2d69f" strokeWidth="1.5" />
            <path d="M29 19h14m-14 6h10M58 71h11" fill="none" stroke="#cfb07c" strokeWidth="2" />
            <path d="M52 48l15 18" stroke="#7a9380" strokeWidth="8" />
            <path d="M52 49l15 18" strokeWidth="3" />
            <circle cx="43" cy="38" r="16" fill="#b3d0ba" strokeWidth="4" />
            <circle cx="43" cy="38" r="11" fill="#cde0c8" stroke="none" />
            <path d="M36 35q2-6 8-6" fill="none" stroke="#eff0d7" strokeWidth="3" />
            <path d="M29 86h42" stroke="#e3bc88" strokeWidth="2" />
          </>
        )}
        {id === 'hamster-plush' && (
          <>
            <ellipse cx="50" cy="92" rx="29" ry="4" fill="#c7c5a2" stroke="none" opacity=".4" />
            <path d="M29 61q-7-9-13 0-6 13 11 19m46-19q7-9 13 0 6 13-11 19" fill="#c99b6c" />
            <path d="M27 62q0-24 23-24 24 0 24 24v13q0 17-24 17-23 0-23-17z" fill="#d5ad7a" />
            <ellipse cx="50" cy="72" rx="16" ry="18" fill="#f0d8ae" stroke="none" />
            <ellipse cx="34" cy="87" rx="12" ry="7" fill="#c99b6c" />
            <ellipse cx="66" cy="87" rx="12" ry="7" fill="#c99b6c" />
            <circle cx="28" cy="23" r="14" fill="#d5ad7a" />
            <circle cx="72" cy="23" r="14" fill="#d5ad7a" />
            <circle cx="28" cy="23" r="7" fill="#e8b9a0" stroke="none" />
            <circle cx="72" cy="23" r="7" fill="#e8b9a0" stroke="none" />
            <path d="M23 37q0-22 27-22 28 0 28 22 2 23-28 26-29-3-27-26z" fill="#d5ad7a" />
            <ellipse cx="50" cy="48" rx="18" ry="13" fill="#f0d8ae" stroke="none" />
            <circle cx="37" cy="36" r="3" fill="#53695d" stroke="none" />
            <circle cx="63" cy="36" r="3" fill="#53695d" stroke="none" />
            <path d="M46 43q4-4 8 0l-4 4z" fill="#b28262" stroke="none" />
            <path d="M50 47v5m-6-1q6 8 12 0" fill="none" strokeWidth="1.7" />
            <path d="M23 44l-8-2m9 8-9 2m62-8 8-2m-9 8 9 2" strokeWidth="1.5" />
            <path d="M50 75v10" stroke="#cfb488" strokeWidth="1.5" strokeDasharray="2 3" />
          </>
        )}
        {id === 'pigeon-statue' && (
          <>
            <ellipse cx="50" cy="93" rx="29" ry="4" fill="#c7c5a2" stroke="none" opacity=".4" />
            <path d="M30 81h40v11H30z" fill="#a7b5a1" />
            <path d="M35 74h30v8H35z" fill="#bdc7ae" />
            <path d="M46 66v8m12-8v8" fill="none" stroke="#859782" strokeWidth="3" />
            <path
              d="M33 53q-2-13 12-30 5-12 17-11 15 2 14 17-1 9-13 13 14 22-6 28-14 5-29-8l-12 4 8-14z"
              fill="#93ada6"
            />
            <path d="M36 47q22-6 23 12-8 13-22 0" fill="#7b9b92" strokeWidth="2" />
            <path d="M46 33q9 9 19 5" fill="none" stroke="#b7c7b1" strokeWidth="4" />
            <path d="M74 27l10 5-12 3z" fill="#bfc5a9" strokeWidth="1.7" />
            <circle cx="65" cy="24" r="2.5" fill="#53695d" stroke="none" />
            <path d="M60 17l9 3M42 86h16" fill="none" strokeWidth="1.5" />
          </>
        )}
        {id === 'bookshelf' && (
          <>
            <path d="M13 7h74v83H13z" fill="#b99169" />
            <path d="M20 14h60v67H20z" fill="#dfc6a0" strokeWidth="1.5" />
            <path d="M23 15h10v27H23z" fill="#7faaa2" strokeWidth="1.3" />
            <path d="M35 20h9v22h-9z" fill="#d59a80" strokeWidth="1.3" />
            <path d="M46 16h10v26H46z" fill="#d6be75" strokeWidth="1.3" />
            <path d="m58 20 10-2 5 23-10 2z" fill="#a9b894" strokeWidth="1.3" />
            <path d="M28 20v16m11-11v11m12-14v14m12-10 3 11" stroke="#e7dcc0" strokeWidth="1.5" />
            <path d="M23 55h24v7H23z" fill="#d19b7b" strokeWidth="1.3" />
            <path d="M25 49h27v6H25z" fill="#88a699" strokeWidth="1.3" />
            <path d="M56 51h9v27h-9z" fill="#d7bc77" strokeWidth="1.3" />
            <path d="M67 53h10v25H67z" fill="#7da19a" strokeWidth="1.3" />
            <path d="M60 57v15m12-13v13M28 70h20" stroke="#e7dcc0" strokeWidth="1.5" />
            <path d="M17 42h66v6H17zM17 78h66v6H17z" fill="#b99169" strokeWidth="1.8" />
            <path d="M17 91v4m66-4v4" strokeWidth="5" />
          </>
        )}
        {id === 'rug' && (
          <>
            <path d="M18 45h64l13 44H5z" fill="#d69f79" stroke="#aa8565" strokeWidth="2" />
            <path d="M25 52h50l9 30H16z" fill="#e9c58e" stroke="#f3dca6" strokeWidth="2" />
            <path d="M50 57l16 11-16 10-16-10z" fill="#97ae8e" stroke="none" />
            <path d="M50 61l9 7-9 6-9-6z" fill="#f1dbac" stroke="none" />
            <path
              d="M8 91v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5"
              stroke="#ba9570"
              strokeWidth="2"
            />
            <path
              d="M21 49v-6m8 6v-6m8 6v-6m8 6v-6m8 6v-6m8 6v-6m8 6v-6m8 6v-6"
              stroke="#ba9570"
              strokeWidth="1.5"
            />
          </>
        )}
      </g>
    </svg>
  );
}
