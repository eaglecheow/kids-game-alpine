function FlowerSymbol({ kind, x, y }: { kind: 'round' | 'star' | 'bell'; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#725f58" strokeWidth="2">
      <path d="M15 19v17m0-7-8-5m8 7 8-6" stroke="#4d755e" fill="none" />
      {kind === 'round' && <circle cx="15" cy="12" r="10" fill="#e9b495" />}
      {kind === 'star' && <path d="m15 1 4 7 8-1-5 7 5 7-9-1-5 7-1-9-9-3 8-4Z" fill="#f1d386" />}
      {kind === 'bell' && <path d="M8 5q7-6 14 0l5 16q-12 5-24 0Z" fill="#b7bed8" />}
      <circle cx="15" cy="13" r="3" fill="#fff0b7" stroke="none" />
    </g>
  );
}

function Basket({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#806a50" strokeWidth="3">
      <path d="M13 19Q13 1 29 1t16 18" fill="none" strokeWidth="4" />
      <path d="M3 19h52l-6 30H9Z" fill="#d3ad79" />
      <path d="M8 28h42m-39 9h36m-28-17 2 27m8-27v27m10-27-2 27" stroke="#ae865c" />
      <path d="M20 18h19l-3 15H23Z" fill="#f2e4bf" />
      <path
        d="M29 24q-10-11-10-1 0 5 8 3-7 4-3 7 4 1 5-6 1 7 5 6 4-3-3-7 8 2 8-3 0-10-10 1Z"
        fill="#dfaa88"
        strokeWidth="1"
      />
    </g>
  );
}

export function ParkScene({
  completed,
  solved = [],
  replayCaseId,
}: {
  completed: string[];
  solved?: string[];
  replayCaseId?: string;
}) {
  const repaired = (id: string) => completed.includes(id) && replayCaseId !== id;
  const picnic = repaired('park-wrong-bench');
  const flowers = repaired('park-flower-signs');
  const kites = repaired('park-kite-tails');
  const found = (id: string) => solved.includes(id);
  const description = [
    picnic
      ? 'Basket at the butterfly picnic, with a secured sign.'
      : 'Empty butterfly picnic blanket and a loose arrow pointing toward the sunflower bench.',
    flowers
      ? 'Flower signs match the round, star, and bell blossoms.'
      : 'The outer flower signs do not match their healthy blossoms; a map hangs upside down.',
    kites
      ? 'Three grounded display kites have their tails.'
      : 'Three grounded display kites have empty tail loops beside a craft box.',
    ...solved
      .filter((id) => !kites || id !== 'park-kites-route')
      .map(
        (id) =>
          ({
            'park-bench-route': 'The inspected trolley path and basket are visible.',
            'park-bench-sort': 'The basket tag is grouped with butterfly tags.',
            'park-bench-tiles': 'The original left-pointing sign picture is restored.',
            'park-flowers-route': 'Three observed beds are outlined.',
            'park-flowers-sort': 'Flower labels are grouped in their tray.',
            'park-flowers-tiles': 'The upright master map is visible.',
            'park-kites-route': 'The craft box is open, showing three intact ribbon rolls.',
            'park-kites-sort': 'Three patterned tails form one group.',
            'park-kites-tiles': 'Dashed outlines connect the missing tails to their display kites.',
          })[id],
      )
      .filter(Boolean),
  ].join(' ');

  return (
    <div className="park-scene-art">
      <img src="/park-scene.svg" alt={`Sunny Park. ${description}`} />
      <svg className="park-scene-overlay" viewBox="0 0 900 560" aria-hidden="true">
        <g stroke="#7c8066" strokeWidth="3" strokeLinejoin="round">
          <path
            d={picnic ? 'M477 174h-59l-14 16 14 16h59Z' : 'M419 174h59l14 16-14 16h-59Z'}
            fill="#f1d08a"
          />
          <path
            d="M444 185q-8-11-8-3 0 5 7 3-6 4-2 7 3 0 3-5 1 5 4 5 4-3-2-7 7 2 7-3 0-8-9 3Z"
            fill="#e6b590"
            stroke="#725f58"
            strokeWidth="1"
          />
          {picnic ? (
            <>
              <rect x="435" y="209" width="20" height="12" rx="3" fill="#c4d0b9" stroke="#617a65" />
              <circle cx="439" cy="215" r="2" fill="#617a65" />
              <circle cx="451" cy="215" r="2" fill="#617a65" />
            </>
          ) : (
            <>
              <path d="M435 210h19v9h-19Z" fill="#d4d5bc" transform="rotate(12 444 214)" />
              <path d="M452 215q23-6 39 7" fill="none" stroke="#d49a83" strokeWidth="5" />
              <path d="M454 220q29-6 41 10" fill="none" stroke="#e6b79a" />
            </>
          )}
        </g>
        {!picnic && (
          <path
            d="M147 310q0-20 17-20t17 20m-45 0h56l-5 27h-45Z"
            fill="none"
            stroke="#916f5d"
            strokeWidth="3"
            strokeDasharray="5 5"
          />
        )}
        {(picnic || found('park-bench-route')) && (
          <>
            <path
              d="M450 145v48q0 43 211 59t90 57"
              fill="none"
              stroke="#557b61"
              strokeWidth="7"
              strokeDasharray="8 8"
            />
            {!picnic && <Basket x={695} y={255} />}
          </>
        )}
        {(picnic || found('park-bench-sort')) && (
          <g stroke="#7c795f" strokeWidth="2">
            <rect x="758" y="279" width="46" height="39" rx="5" fill="#fff0c9" />
            <path
              d="M781 293q-14-17-14-3 0 8 11 4-10 7-3 11 5 0 6-9 1 9 6 9 7-4-3-11 11 4 11-4 0-14-14 3Z"
              fill="#e6b590"
            />
          </g>
        )}
        {(picnic || found('park-bench-tiles')) && (
          <image href="/park-sign.svg" x="473" y="227" width="66" height="66" />
        )}
        {picnic && <Basket x={139} y={293} />}
        {(flowers || found('park-flowers-route')) && (
          <g fill="none" stroke="#557b61" strokeWidth="4" strokeDasharray="6 5">
            {[275, 450, 625].map((x) => (
              <ellipse key={x} cx={x} cy="344" rx="80" ry="31" />
            ))}
          </g>
        )}
        {(flowers || found('park-flowers-sort')) && (
          <g>
            <rect
              x="555"
              y="387"
              width="104"
              height="37"
              fill="#f5e4bf"
              stroke="#557b61"
              strokeWidth="3"
            />
            <FlowerSymbol kind="round" x={558} y={387} />
            <FlowerSymbol kind="star" x={593} y={387} />
            <FlowerSymbol kind="bell" x={628} y={387} />
          </g>
        )}
        {(flowers || found('park-flowers-tiles')) && (
          <image href="/park-flowers.svg" x="187" y="389" width="83" height="59" />
        )}
        {flowers && (
          <>
            <rect
              x="253"
              y="345"
              width="44"
              height="36"
              rx="5"
              fill="#fff0ca"
              stroke="#7d785c"
              strokeWidth="3"
            />
            <FlowerSymbol kind="round" x={259} y={346} />
            <rect
              x="603"
              y="345"
              width="44"
              height="36"
              rx="5"
              fill="#fff0ca"
              stroke="#7d785c"
              strokeWidth="3"
            />
            <FlowerSymbol kind="bell" x={609} y={346} />
            <image
              href="/park-flowers.svg"
              x="73"
              y="381"
              width="82"
              height="73"
              preserveAspectRatio="none"
            />
          </>
        )}
        {!kites && found('park-kites-route') && (
          <g stroke="#7e775e" strokeWidth="3">
            <path d="m704 417 10-25h70l-10 25Z" fill="#e2bf93" />
            <path d="M709 421h71v30h-71Z" fill="#a18567" />
            {[723, 744, 765].map((x, i) => (
              <g key={x}>
                <ellipse
                  cx={x}
                  cy="434"
                  rx="8"
                  ry="12"
                  fill={['#e3b28e', '#b7bfd8', '#efcd86'][i]}
                />
                <circle cx={x} cy="424" r="3" fill="none" />
                {i === 0 && <path d={`M${x - 5} 430h10m-10 6h10m-10 6h10`} strokeWidth="1.5" />}
                {i === 1 && (
                  <g fill="#596b72">
                    <circle cx={x - 3} cy="432" r="1.5" />
                    <circle cx={x + 3} cy="438" r="1.5" />
                  </g>
                )}
                {i === 2 && <path d={`m${x - 5} 434 3-4 4 4 3-4`} fill="none" strokeWidth="1.5" />}
              </g>
            ))}
          </g>
        )}
        {(kites || found('park-kites-sort')) && (
          <g stroke="#7e775e" strokeWidth="2">
            <rect x="748" y="490" width="60" height="31" rx="3" fill="#f5e5c7" />
            {[758, 778, 798].map((x, i) => (
              <g key={x}>
                <path
                  d={`M${x} 496q-7 8 0 18`}
                  fill="none"
                  stroke={['#d09b7d', '#939ebc', '#c7a957'][i]}
                  strokeWidth="7"
                />
                <circle cx={x} cy="496" r="3" fill="none" />
                {i === 0 && <path d={`M${x - 5} 504h5m-4 5h5`} strokeWidth="1.2" />}
                {i === 1 && <circle cx={x - 3} cy="507" r="1.3" fill="#596b72" />}
                {i === 2 && <path d={`m${x - 5} 507 2-2 2 2 2-2`} fill="none" strokeWidth="1.2" />}
              </g>
            ))}
          </g>
        )}
        {(kites || found('park-kites-tiles')) && (
          <image href="/park-kites.svg" x="525" y="469" width="65" height="58" />
        )}
        {(kites || found('park-kites-tiles')) && (
          <g fill="none" strokeWidth={kites ? 4 : 3} strokeDasharray={kites ? undefined : '4 4'}>
            {[315, 405, 495].map((x, i) => (
              <g key={x} stroke={['#ae7b61', '#828baa', '#b0954d'][i]}>
                <path d={`M${x} 472q-15 20 0 39t0 39`} />
                <path
                  d={`m${x - 9} 511 9-5 9 5-9 5Z`}
                  fill={kites ? ['#e3b28e', '#b7bfd8', '#efcd86'][i] : 'none'}
                />
                {i === 0 && <path d={`M${x - 3} 508v6m4-6v6`} strokeWidth="1.2" />}
                {i === 1 && <circle cx={x} cy="511" r="1.5" fill="#596b72" />}
                {i === 2 && <path d={`m${x - 5} 511 3-2 3 2 3-2`} strokeWidth="1.2" />}
              </g>
            ))}
          </g>
        )}
        {kites && (
          <g stroke="#557b61" strokeWidth="2">
            <rect x="807" y="423" width="38" height="32" fill="#fff8e2" stroke="none" />
            <path d="m818 426 8 9-8 12-8-12Z" fill="#efcd86" />
            <path d="M818 426v21m-8-12h16m-8 12q-4 3 0 7" fill="none" />
            <path d="m830 439 4 4 9-10" fill="none" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function ParkEvidence({ clueId, solved = false }: { clueId: string; solved?: boolean }) {
  const pictures: Record<string, string> = {
    'park-bench-picture': '/park-sign.svg',
    'park-flowers-master': '/park-flowers.svg',
    'park-kites-picture': '/park-kites.svg',
  };
  if (pictures[clueId] && solved) {
    const descriptions: Record<string, string> = {
      'park-bench-picture':
        'The original sign picture: gate at the top, butterfly bench on the left, sunflower bench on the right, and the picnic arrow pointing left toward the butterfly bench.',
      'park-flowers-master':
        'The upright master planting map: gate at the top; round flowers and their matching sign on the left, star flowers and sign in the middle, and bell flowers and sign on the right.',
      'park-kites-picture':
        'The kite-making picture shows matching striped, dotted, and zigzag kites and tails, each joined at its attachment loop on a grounded display stand.',
    };
    return <img className="park-evidence" src={pictures[clueId]} alt={descriptions[clueId]} />;
  }
  if (!['park-bench-collar', 'park-flowers-copy', 'park-kites-checklist'].includes(clueId))
    return null;
  const title =
    clueId === 'park-bench-collar'
      ? 'A loose collar lets the sign turn in the breeze. Ben’s pictorial slip shows the current right-pointing arrow, trolley, and sunflower bench.'
      : clueId === 'park-flowers-copy'
        ? 'The intact working map has its Park gate at the lower edge, with bell flowers left, star flowers middle, and round flowers right. A pictorial note with Hamster’s goggles stamp points from the copy to the label tray.'
        : 'Pip’s bird-and-satchel stamp marks a checklist picture: rolled ribbon goes into the same marked craft box.';
  return (
    <svg className="park-evidence" viewBox="0 0 360 210" role="img" aria-label={title}>
      <rect
        x="2"
        y="2"
        width="356"
        height="206"
        rx="14"
        fill="#f9edcf"
        stroke="#c5b18b"
        strokeWidth="3"
      />
      {clueId === 'park-bench-collar' && (
        <g stroke="#7c8066" strokeWidth="3" strokeLinejoin="round">
          <path d="M74 67v108" strokeWidth="8" />
          <path d="M32 54h72l18 19-18 19H32Z" fill="#f1d08a" />
          <path
            d="m45 50 5-13m2 6 16-11m40 80q32-16 37 0m-27 5q25-8 35 5"
            fill="none"
            stroke="#c59a7b"
          />
          <rect
            x="62"
            y="99"
            width="24"
            height="12"
            rx="3"
            fill="#c5d1bf"
            transform="rotate(18 74 105)"
          />
          <path d="M87 109q23-6 43 8" fill="none" stroke="#d49a83" strokeWidth="6" />
          <path d="M176 36h160v143H176Z" fill="#fff8e2" />
          <path d="M191 53h43l12 14-12 14h-43Z" fill="#efd190" />
          <path d="M259 67h35l-8-7m8 7-8 7M259 120h35l-8-7m8 7-8 7" fill="none" />
          <path d="M194 104h43l-5 22h-30Z" fill="#d3ad79" />
          <circle cx="204" cy="135" r="6" fill="#b6c4a9" />
          <circle cx="230" cy="135" r="6" fill="#b6c4a9" />
          <path d="M303 109h20v22h-20Z" fill="#d5ab7a" />
          <g fill="#f0ce78" strokeWidth="1.5">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="313"
                cy="54"
                rx="4"
                ry="7"
                transform={`rotate(${angle} 313 65)`}
              />
            ))}
            <circle cx="313" cy="65" r="7" fill="#aa8063" />
          </g>
          <text x="257" y="163" textAnchor="middle" fontSize="15" fill="#526954" stroke="none">
            Ben’s delivery slip
          </text>
        </g>
      )}
      {clueId === 'park-flowers-copy' && (
        <>
          <path d="M27 22h140v166H27Z" fill="#b18b67" stroke="#766e59" strokeWidth="3" />
          <image
            href="/park-flowers.svg"
            x="35"
            y="29"
            width="124"
            height="151"
            preserveAspectRatio="none"
            transform="rotate(180 97 104.5)"
          />
          <path d="M81 21h32v13H81Z" fill="#c5d0bd" stroke="#766e59" strokeWidth="2" />
          <path d="M207 29h127v151H207Z" fill="#fff8e2" stroke="#89785e" strokeWidth="3" />
          <image
            href="/park-flowers.svg"
            x="221"
            y="37"
            width="54"
            height="63"
            transform="rotate(180 248 68.5)"
          />
          <g stroke="#786f59" strokeWidth="1.5">
            <circle cx="310" cy="65" r="17" fill="#e0d8b8" strokeDasharray="2 2" />
            <circle cx="301" cy="58" r="5" fill="#d9b483" />
            <circle cx="319" cy="58" r="5" fill="#d9b483" />
            <ellipse cx="310" cy="67" rx="14" ry="12" fill="#d9b483" />
            <circle cx="304" cy="65" r="5" fill="#f5eccf" />
            <circle cx="316" cy="65" r="5" fill="#f5eccf" />
            <path d="M309 65h2m-4 9 3 2 3-2" fill="none" />
            <circle cx="304" cy="65" r="1.5" fill="#625f50" stroke="none" />
            <circle cx="316" cy="65" r="1.5" fill="#625f50" stroke="none" />
          </g>
          <text x="310" y="96" textAnchor="middle" fontSize="11" fill="#526954">
            Hamster
          </text>
          <path d="M247 107v22l-7-7m7 7 7-7" fill="none" stroke="#697e63" strokeWidth="4" />
          <rect
            x="219"
            y="133"
            width="100"
            height="37"
            fill="#e7d2ab"
            stroke="#89785e"
            strokeWidth="2"
          />
          <FlowerSymbol kind="bell" x={221} y={132} />
          <FlowerSymbol kind="star" x={254} y={132} />
          <FlowerSymbol kind="round" x={287} y={132} />
        </>
      )}
      {clueId === 'park-kites-checklist' && (
        <g stroke="#786f59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25 24h310v165H25Z" fill="#fff8e2" />
          <path d="m40 68 8 8 13-17m-21 64 8 8 13-17" fill="none" stroke="#7a986d" />
          <ellipse cx="87" cy="63" rx="11" ry="23" fill="#e3b28e" />
          <path d="M78 52h18m-18 10h18m-18 10h18" stroke="#b18165" strokeWidth="2" />
          <path d="M111 64h39l-10-8m10 8-10 8" fill="none" />
          <path d="M162 46h54v40h-54Z" fill="#d2b18a" />
          <path d="M159 42h60v10h-60Z" fill="#efcf9f" />
          <rect x="183" y="59" width="14" height="15" fill="#e7ddbf" />
          <path d="M185 62q3-6 8 0l-4 7-4-7" fill="#849b86" strokeWidth="1" />
          <text x="73" y="121" fontSize="15" fill="#526954" stroke="none">
            Roll spare ribbon
          </text>
          <text x="73" y="145" fontSize="15" fill="#526954" stroke="none">
            into my box.
          </text>
          <circle cx="276" cy="73" r="36" fill="#d8e1d0" stroke="#809780" strokeDasharray="3 3" />
          <path d="M258 75q-8-26 12-29 17-1 20 17l12 7-11 6q-4 15-25 10Z" fill="#a8bdad" />
          <circle cx="276" cy="58" r="3" fill="#53695d" stroke="none" />
          <path d="m269 73 13 13m-24-12h-9v14h18" fill="#c7ad81" strokeWidth="2" />
          <text
            x="276"
            y="131"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#526954"
            stroke="none"
          >
            Pip
          </text>
          <path d="M260 155h33" stroke="#b4bd9c" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}
