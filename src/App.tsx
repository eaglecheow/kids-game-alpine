import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  Coins,
  Compass,
  Download,
  Home,
  Lightbulb,
  LockKeyhole,
  Map,
  Music2,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  WifiOff,
  X,
} from 'lucide-react';
import {
  casesFor,
  completeCase,
  canPlayCase,
  canVisitPark,
  decorations,
  type Player,
  type Difficulty,
  type Clue,
  type GameCase,
} from './game';
import { loadPlayer, savePlayer } from './storage';
import { Character } from './components/Character';
import { RoomItem } from './components/RoomItem';
import { Modal } from './components/Modal';
import { Puzzle } from './components/Puzzle';
import { ParkScene, ParkEvidence } from './components/ParkScene';
import { playSound, setMusic } from './audio';
import { publicAsset } from './assets';

type Page = 'town' | 'bakery' | 'park' | 'case' | 'clubhouse' | 'files';
type Overlay =
  | 'onboard'
  | 'welcome'
  | 'settings'
  | 'intro'
  | 'notebook'
  | 'dialogue'
  | 'puzzle'
  | 'conclusion'
  | 'reveal'
  | 'rewards'
  | 'install'
  | null;
interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
const difficultyLabels: Record<Difficulty, string> = {
  junior: 'Junior Detective',
  detective: 'Detective',
  master: 'Master Detective',
};
const characterNames = { ben: 'Baker Ben', hamster: 'Professor Hamster', pip: 'Pip the Pigeon' };
const locations = [
  { name: 'Library', x: 24, y: 38, locked: true, className: 'library' },
  { name: 'The Bakery', x: 50, y: 57, locked: false, className: 'bakery' },
  { name: 'Sunny Park', x: 76, y: 43, locked: true, className: 'park' },
  { name: 'My Clubhouse', x: 20, y: 85, locked: false, className: 'clubhouse' },
  { name: 'Science Museum', x: 79, y: 85, locked: true, className: 'museum' },
];
const locationDetails = {
  bakery: {
    name: "Ben's Bakery",
    scene: publicAsset('bakery-scene.svg'),
    alt: 'Inside the bakery: trays of cookies, flour, recipes, and a mysterious experiment',
  },
  park: {
    name: 'Sunny Park',
    scene: publicAsset('park-scene.svg'),
    alt: 'Sunny Park with two picnic benches, flowerbeds, and grounded display kites',
  },
};

function CaseArt({ gameCase }: { gameCase: GameCase }) {
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

export default function App() {
  const [player, setPlayer] = useState<Player>(loadPlayer);
  const [page, setPage] = useState<Page>('town');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [puzzleId, setPuzzleId] = useState('');
  const [lastCase, setLastCase] = useState('missing-cookies');
  const [wasReplay, setWasReplay] = useState(false);
  const [conclusionFeedback, setConclusionFeedback] = useState('');
  const [notice, setNotice] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [cached, setCached] = useState(Boolean(navigator.serviceWorker?.controller));
  const [saveError, setSaveError] = useState(false);
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const cases = casesFor(player.difficulty);
  const visibleCases =
    page === 'bakery' || page === 'park' ? cases.filter((item) => item.location === page) : cases;
  const caseNumber = (item: GameCase) =>
    cases
      .filter((candidate) => candidate.location === item.location)
      .findIndex((candidate) => candidate.id === item.id) + 1;
  const parkAvailable = canVisitPark(player);
  const bakeryCompleted = cases.filter(
    (item) => item.location === 'bakery' && player.completed.includes(item.id),
  ).length;
  const activeCase = cases.find((item) => item.id === player.session?.caseId);
  const featuredCase =
    activeCase ??
    cases.find((item) => canPlayCase(player, item.id) && !player.completed.includes(item.id)) ??
    cases[0];
  const rewardedCase = cases.find((item) => item.id === lastCase) ?? cases[0];
  const selectedPuzzle = activeCase?.puzzles.find((item) => item.id === puzzleId);
  const currentClue =
    activeCase?.clues.find((item) => item.id === selectedClue?.id) ?? selectedClue;
  const clueText = (clue: Clue) =>
    clue.discovery && player.session?.solved.includes(clue.puzzleId ?? '')
      ? clue.discovery
      : clue.description;
  const solvedCount = player.session?.solved.length ?? 0;
  const allReady =
    !!activeCase &&
    activeCase.puzzles.every((item) => player.session?.solved.includes(item.id)) &&
    activeCase.clues.every((clue) => player.session?.clues.includes(clue.id));
  const update = (changes: Partial<Player>) => setPlayer((current) => ({ ...current, ...changes }));
  useEffect(() => {
    setSaveError(!savePlayer(player));
  }, [player]);
  useEffect(() => {
    const online = () => setOffline(false);
    const disconnected = () => setOffline(true);
    const ready = () => setCached(true);
    const installation = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    window.addEventListener('online', online);
    window.addEventListener('offline', disconnected);
    window.addEventListener('pwa-ready', ready);
    window.addEventListener('beforeinstallprompt', installation);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', disconnected);
      window.removeEventListener('pwa-ready', ready);
      window.removeEventListener('beforeinstallprompt', installation);
      setMusic(false);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const navigate = (next: Page) => {
    setPage(next);
    setOverlay(null);
    playSound('click', player.sound);
  };
  const startCase = (requestedId: string) => {
    let id = requestedId;
    if (player.session && player.session.caseId !== id) {
      id = player.session.caseId;
      setNotice('Let’s finish your open mystery first. Your discoveries are safe!');
    }
    if (!player.onboarded) {
      setOverlay('onboard');
      return;
    }
    if (!canPlayCase(player, id)) {
      setNotice('Solve the previous mystery to open this case!');
      return;
    }
    if (player.session?.caseId !== id)
      update({ session: { caseId: id, clues: [], solved: [], introSeen: false } });
    setPage('case');
    setOverlay(player.session?.caseId === id && player.session.introSeen ? null : 'intro');
    if (player.music) setMusic(true);
  };
  const discover = (clue: Clue) => {
    if (!player.session) return;
    if (!player.session.clues.includes(clue.id)) {
      update({ session: { ...player.session, clues: [...player.session.clues, clue.id] } });
      playSound('clue', player.sound);
    }
    setSelectedClue(clue);
    setOverlay('dialogue');
  };
  const solvePuzzle = () => {
    if (!player.session || !selectedPuzzle) return;
    if (!player.session.solved.includes(selectedPuzzle.id))
      update({
        session: { ...player.session, solved: [...player.session.solved, selectedPuzzle.id] },
      });
    playSound('success', player.sound);
    setOverlay(null);
    setNotice('Aha! A new discovery is in your notebook.');
  };
  const award = () => {
    if (!activeCase) return;
    setLastCase(activeCase.id);
    setWasReplay(player.completed.includes(activeCase.id));
    setPlayer(completeCase(player, activeCase));
    setOverlay('rewards');
    playSound('success', player.sound);
  };
  const openClubhouse = () => {
    if (!player.onboarded) setOverlay('onboard');
    else navigate('clubhouse');
  };
  const collectedClues =
    activeCase?.clues.filter((clue) => player.session?.clues.includes(clue.id)) ?? [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button
            className="brand"
            onClick={() => navigate('town')}
            aria-label="Tiny Town Detectives home"
          >
            <span className="brand-icon">
              <Search size={32} strokeWidth={2.7} />
              <span className="brand-spark">✦</span>
            </span>
            <span>
              TINY TOWN<strong>DETECTIVES</strong>
            </span>
          </button>
          <nav className="main-nav" aria-label="Main navigation">
            <button
              className={
                page === 'town' || page === 'bakery' || page === 'park' || page === 'case'
                  ? 'active'
                  : ''
              }
              onClick={() => navigate('town')}
            >
              <Map size={18} />
              Town Map
            </button>
            <button className={page === 'clubhouse' ? 'active' : ''} onClick={openClubhouse}>
              <Home size={18} />
              My Clubhouse
            </button>
            <button className={page === 'files' ? 'active' : ''} onClick={() => navigate('files')}>
              <BookOpen size={18} />
              Case Files
            </button>
          </nav>
          <div className="header-player">
            <span className="currency star-currency" title="Detective stars">
              <Star size={18} fill="currentColor" />
              {player.stars}
            </span>
            <span className="currency coin-currency" title="Coins">
              <Coins size={18} />
              {player.coins}
            </span>
            <span className="header-divider" />
            <button
              className="profile-button"
              aria-label="Customize detective and settings"
              onClick={() => setOverlay('settings')}
            >
              <Character who="detective" size={44} avatar={player.avatar} hat={player.hat} />
            </button>
            <button
              className="icon-button settings-button"
              aria-label="Settings"
              onClick={() => setOverlay('settings')}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>
      {offline && (
        <div className="offline-banner">
          <WifiOff size={16} /> You're offline.{' '}
          {cached ? 'Tiny Town is ready to explore!' : 'Your saved adventure is still here.'}
        </div>
      )}
      {saveError && (
        <div className="offline-banner">
          We couldn’t save this adventure on this device. Check your browser’s storage settings.
        </div>
      )}
      <main>
        {page === 'town' && (
          <>
            <section className="page-intro">
              <div>
                <div className="eyebrow">
                  <span className="tiny-star">✦</span> EVERY CLUE COUNTS.
                </div>
                <h1>
                  {player.onboarded ? (
                    <>
                      Welcome back, <span>{player.nickname}.</span>
                    </>
                  ) : (
                    <>
                      A little town. <span>A big adventure.</span>
                    </>
                  )}
                </h1>
                <p>Curious things are happening in Tiny Town. Ready to crack the case?</p>
              </div>
              <button
                className="button primary hero-button"
                onClick={() =>
                  player.onboarded ? startCase(featuredCase.id) : setOverlay('onboard')
                }
              >
                <Search size={20} />
                {player.onboarded ? 'Continue Adventure' : 'Start Detecting'}
                <ArrowRight size={18} />
              </button>
            </section>
            <div className="town-layout">
              <section className="map-panel" aria-label="Interactive town map">
                <div className="map-panel-title">
                  <span>
                    <Compass size={18} />
                    EXPLORE TINY TOWN
                  </span>
                  <span className="map-weather">
                    <span>☀</span> A lovely day for a mystery
                  </span>
                </div>
                <div className="town-map">
                  <img
                    src={publicAsset('town-map.svg')}
                    alt="An illustrated town with a bakery, clubhouse, library, park, and science museum connected by winding paths"
                  />
                  {locations.map((originalLocation) => {
                    const location =
                      originalLocation.className === 'park'
                        ? { ...originalLocation, locked: !parkAvailable }
                        : originalLocation;
                    return (
                      <button
                        key={location.name}
                        style={{ left: `${location.x}%`, top: `${location.y}%` } as CSSProperties}
                        className={`map-location ${location.className} ${location.locked ? 'locked' : 'unlocked'}`}
                        aria-label={
                          location.className === 'park' && location.locked
                            ? `Sunny Park locked. Solve the three Bakery mysteries. ${bakeryCompleted} of 3 solved`
                            : location.locked
                              ? `${location.name}, coming soon`
                              : `Visit ${location.name}`
                        }
                        onClick={() =>
                          location.locked
                            ? setNotice(
                                location.className === 'park'
                                  ? `Solve the three Bakery mysteries to visit Sunny Park. ${bakeryCompleted} of 3 solved.`
                                  : `${location.name} is coming in a future adventure.`,
                              )
                            : location.className === 'bakery'
                              ? navigate('bakery')
                              : location.className === 'park'
                                ? navigate('park')
                                : openClubhouse()
                        }
                      >
                        {location.locked ? (
                          <LockKeyhole size={14} />
                        ) : location.className === 'bakery' || location.className === 'park' ? (
                          <Search size={17} />
                        ) : (
                          <Home size={16} />
                        )}
                        <span>{location.name}</span>
                        {!location.locked && <ArrowRight size={14} />}
                        {location.locked && (
                          <span className="soon">
                            {location.className === 'park' ? `${bakeryCompleted}/3` : 'SOON'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <div className="map-tip">
                    <span className="tip-pin" />
                    Tap a place to explore
                  </div>
                  <div className="bakery-ping">
                    <span />A mystery awaits!
                  </div>
                </div>
                <div className="map-panel-footer">
                  <span>
                    <span className="status-dot" />
                    {parkAvailable
                      ? 'Sunny Park is open for a picnic mystery'
                      : 'Your adventure starts at the Bakery'}
                  </span>
                  <span>
                    <LockKeyhole size={13} /> More places to discover soon
                  </span>
                </div>
              </section>
              <aside className="town-sidebar">
                <section className="featured-case">
                  <div className="card-eyebrow">
                    <span className="little-file">
                      <Search size={16} />
                    </span>
                    {activeCase ? 'YOUR OPEN CASE' : 'ON THE CASE BOARD'}
                    <span className="new-pill">
                      {player.completed.includes(featuredCase.id) ? 'REPLAY' : 'NEW'}
                    </span>
                  </div>
                  <div className="case-picture">
                    <CaseArt gameCase={featuredCase} />
                    <span className="case-number">
                      {locationDetails[featuredCase.location].name} · CASE{' '}
                      {String(caseNumber(featuredCase)).padStart(2, '0')}
                    </span>
                    <span className="art-spark">✦</span>
                  </div>
                  <div className="featured-case-content">
                    <span className="category-tag">{featuredCase.tag}</span>
                    <h2>{featuredCase.title}</h2>
                    <p>{featuredCase.description}</p>
                    <div className="case-meta">
                      <span>
                        <Sparkles size={15} />3 puzzles
                      </span>
                      <span>
                        <Compass size={15} />
                        5–10 min
                      </span>
                    </div>
                    <button
                      className="button primary full"
                      onClick={() => startCase(featuredCase.id)}
                    >
                      {activeCase
                        ? 'Pick up the clues'
                        : player.completed.includes(featuredCase.id)
                          ? 'Replay mystery'
                          : "Let's investigate"}
                      <ArrowRight size={19} />
                    </button>
                  </div>
                </section>
                <section className="detective-tip">
                  <div className="tip-heading">
                    <Lightbulb size={17} />
                    <span>A DETECTIVE'S LITTLE TIP</span>
                  </div>
                  <div className="tip-body">
                    <Character who="hamster" size={78} />
                    <p>
                      “Look closely, ask questions, and follow your curiosity!”
                      <small>Professor Hamster</small>
                    </p>
                  </div>
                </section>
              </aside>
            </div>
            <section className="town-bottom">
              <div className="adventure-progress">
                <span className="progress-badge">
                  <ShieldCheck size={27} />
                </span>
                <div>
                  <h3>A little more curious, every day.</h3>
                  <p>
                    {player.completed.length} of {cases.length} mysteries solved
                  </p>
                </div>
                <div
                  className="progress-track"
                  aria-label={`${player.completed.length} of ${cases.length} cases completed`}
                >
                  {cases.map((item) => (
                    <span
                      key={item.id}
                      className={player.completed.includes(item.id) ? 'filled' : ''}
                    />
                  ))}
                </div>
              </div>
              <button className="notebook-teaser" onClick={() => setOverlay('notebook')}>
                <span className="notebook-illustration">
                  <BookOpen size={29} />
                </span>
                <div>
                  <h3>Your trusty notebook</h3>
                  <p>Big discoveries. Little details.</p>
                </div>
                <ArrowRight size={19} />
              </button>
            </section>
          </>
        )}
        {(page === 'bakery' || page === 'park' || page === 'files') && (
          <>
            <button className="back-link" onClick={() => navigate('town')}>
              <ChevronLeft size={18} />
              Back to town
            </button>
            <section className="page-intro">
              <div>
                <div className="eyebrow">
                  {page === 'bakery'
                    ? 'SOMETHING SMELLS MYSTERIOUS'
                    : page === 'park'
                      ? 'A PICNIC NEEDS YOUR CLEVER THINKING'
                      : 'YOUR DETECTIVE ADVENTURES'}
                </div>
                <h1>
                  {page === 'bakery' ? (
                    <>
                      Welcome to <span>Ben's Bakery.</span>
                    </>
                  ) : page === 'park' ? (
                    <>
                      Welcome to <span>Sunny Park.</span>
                    </>
                  ) : (
                    <>
                      One clue closer <span>to the truth.</span>
                    </>
                  )}
                </h1>
                <p>
                  {page === 'bakery'
                    ? 'Fresh bread, friendly faces, and a sprinkle of mystery.'
                    : page === 'park'
                      ? 'Help your three friends get Sunny Park ready for a picnic.'
                      : 'Every solved case tells a story. Which one will you uncover next?'}
                </p>
              </div>
              <div className="character-lineup">
                <Character who="ben" size={86} />
                <Character who="hamster" size={70} />
                <Character who="pip" size={70} />
              </div>
            </section>
            {page === 'park' && (
              <section className="park-overview" aria-label="Your Sunny Park repairs">
                <ParkScene completed={player.completed} />
                <p>
                  {visibleCases.filter((item) => player.completed.includes(item.id)).length} of 3
                  Park mysteries solved · Each discovery brings our picnic closer.
                </p>
              </section>
            )}
            <section className="cases-grid">
              {visibleCases.map((item) => {
                const index = caseNumber(item) - 1;
                const available = canPlayCase(player, item.id);
                const complete = player.completed.includes(item.id);
                return (
                  <article className={`case-card ${!available ? 'case-locked' : ''}`} key={item.id}>
                    <div className={`case-cover cover-${index}`}>
                      <CaseArt gameCase={item} />

                      <span className="case-number">
                        {page === 'files' && `${locationDetails[item.location].name} · `}CASE{' '}
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {complete && (
                        <span className="solved-pill">
                          <Check size={14} />
                          SOLVED
                        </span>
                      )}
                    </div>
                    <div className="case-card-body">
                      <span className="category-tag">{item.tag}</span>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <div className="case-meta">
                        <span>
                          <Sparkles size={16} />3 puzzles
                        </span>
                        <span>
                          <Star size={15} />
                          {item.rewards.stars} stars
                        </span>
                      </div>
                      <button
                        className={`button full ${available ? 'primary' : 'secondary'}`}
                        disabled={!available}
                        onClick={() => startCase(item.id)}
                      >
                        {complete
                          ? 'Play again'
                          : player.session?.caseId === item.id
                            ? 'Resume mystery'
                            : available
                              ? 'Open mystery'
                              : item.location === 'park' && !parkAvailable
                                ? 'Solve the three Bakery mysteries'
                                : `Solve case ${index} to unlock`}
                        {available ? <ArrowRight size={18} /> : <LockKeyhole size={16} />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
            <div className="friendly-note">
              <Character who="pip" size={55} />
              <p>
                {page === 'park'
                  ? '“Look for matching shapes. A little clue can solve a big muddle.”'
                  : '“Me? Suspicious? I just came for the breadcrumbs.”'}{' '}
                <span>— Pip</span>
              </p>
            </div>
          </>
        )}
        {page === 'case' && activeCase && (
          <>
            <div className="case-page-top">
              <button className="back-link" onClick={() => navigate(activeCase.location)}>
                <ChevronLeft size={18} />
                Leave & save
              </button>
              <button className="button notebook-button" onClick={() => setOverlay('notebook')}>
                <BookOpen size={18} />
                Detective notebook <span>{collectedClues.length}</span>
              </button>
            </div>
            <section className="page-intro compact">
              <div>
                <div className="eyebrow">
                  CASE {String(caseNumber(activeCase)).padStart(2, '0')} ·{' '}
                  {locationDetails[activeCase.location].name.toUpperCase()}
                </div>
                <h1>{activeCase.title}</h1>
                <p>Talk to your friends. Inspect the scene. The clues are all around you.</p>
              </div>
              <div className="puzzle-progress">
                <span>{solvedCount}/3</span>
                <small>discoveries made</small>
              </div>
            </section>
            <div className="investigation-layout">
              <section
                className={`bakery-scene ${activeCase.location === 'park' ? 'park-investigation' : ''}`}
              >
                {activeCase.location === 'park' ? (
                  <ParkScene
                    completed={player.completed}
                    solved={player.session?.solved}
                    replayCaseId={activeCase.id}
                  />
                ) : (
                  <img src={locationDetails.bakery.scene} alt={locationDetails.bakery.alt} />
                )}
                {activeCase.clues.map((clue, index) => (
                  <button
                    key={clue.id}
                    aria-label={`Inspect ${clue.title}`}
                    title={clue.title}
                    className={`clue-hotspot ${player.session?.solved.includes(clue.puzzleId ?? '') ? 'found' : ''}`}
                    style={{
                      left: `${clue.hotspot?.x ?? [21, 51, 78, 39, 89, 65][index]}%`,
                      top: `${clue.hotspot?.y ?? [51, 37, 61, 78, 29, 84][index]}%`,
                    }}
                    onClick={() => discover(clue)}
                  >
                    <span>
                      {player.session?.clues.includes(clue.id) ? (
                        <Check size={21} />
                      ) : activeCase.location === 'park' ? (
                        <span aria-hidden="true">{clue.icon}</span>
                      ) : (
                        <Search size={21} />
                      )}
                    </span>
                    <strong>{clue.title}</strong>
                  </button>
                ))}
                <div className="scene-caption">
                  <Sparkles size={17} />
                  {activeCase.location === 'park'
                    ? 'Choose an object to inspect.'
                    : 'Follow the magnifying glasses to discover clues.'}
                </div>
              </section>
              <aside className="investigation-sidebar">
                <h3>
                  <Compass size={20} />
                  Your next steps
                </h3>
                {activeCase.location === 'park' && (
                  <div className="park-clue-list">
                    <p className="small muted">Choose an object to inspect.</p>
                    {activeCase.clues.map((clue) => (
                      <button key={clue.id} onClick={() => discover(clue)}>
                        {clue.icon} {clue.title}
                        {player.session?.clues.includes(clue.id) && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="checklist">
                  <p className={collectedClues.length === activeCase.clues.length ? 'done' : ''}>
                    <span>
                      {collectedClues.length === activeCase.clues.length ? (
                        <Check size={16} />
                      ) : (
                        '1'
                      )}
                    </span>
                    Gather the clues{' '}
                    <small>
                      {collectedClues.length}/{activeCase.clues.length}
                    </small>
                  </p>
                  <p className={solvedCount === 3 ? 'done' : ''}>
                    <span>{solvedCount === 3 ? <Check size={16} /> : '2'}</span>Make discoveries{' '}
                    <small>{solvedCount}/3</small>
                  </p>
                  <p>
                    <span>3</span>Solve the mystery
                  </p>
                </div>
                <div className="scene-friends">
                  <span className="eyebrow">EVERYONE HAS A STORY</span>
                  {(['ben', 'hamster', 'pip'] as const).map((who) => (
                    <button
                      key={who}
                      onClick={() => {
                        const clue = activeCase.clues.find((item) => item.character === who);
                        if (clue) discover(clue);
                      }}
                    >
                      <Character who={who} size={58} />
                      <span>
                        {characterNames[who]}
                        <small>
                          Let's chat <ArrowRight size={13} />
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  className="button primary full"
                  disabled={!allReady}
                  onClick={() => {
                    setConclusionFeedback('');
                    setOverlay('conclusion');
                  }}
                >
                  Review the evidence <ArrowRight size={18} />
                </button>
                {!allReady && (
                  <p className="small muted center">
                    Gather every clue and make 3 discoveries first.
                  </p>
                )}
              </aside>
            </div>
          </>
        )}
        {page === 'clubhouse' && (
          <>
            <section className="page-intro">
              <div>
                <div className="eyebrow">YOUR VERY OWN DETECTIVE HQ</div>
                <h1>
                  Make yourself <span>at home.</span>
                </h1>
                <p>A cozy place for big ideas. Decorate with your hard-earned discoveries.</p>
              </div>
              <div className="clubhouse-coins">
                <Coins size={23} />
                {player.coins}
                <span>to make it yours</span>
              </div>
            </section>
            <div className="clubhouse-layout">
              <section className="clubhouse-room" aria-label="Your decorated detective clubhouse">
                <div className="room-window">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className={`wall-poster ${player.equipped.wall ? 'has-item' : ''}`}>
                  {player.equipped.wall ? <RoomItem id={player.equipped.wall} size={125} /> : '🔍'}
                  <small>STAY CURIOUS</small>
                </div>
                <div className="room-bunting">▾ ▾ ▾ ▾ ▾ ▾</div>
                <div className="room-shelf">
                  <span>
                    {player.equipped.shelf ? (
                      <RoomItem id={player.equipped.shelf} size={85} />
                    ) : (
                      '🗂️'
                    )}
                  </span>
                  <span className="trophy-stars">{player.stickers.join(' ') || '✦'}</span>
                </div>
                <div className="room-desk">
                  <span>
                    {player.equipped.desk ? <RoomItem id={player.equipped.desk} size={95} /> : '✏️'}
                  </span>
                  <div className="desk-book">📖</div>
                </div>
                <div className={`room-rug ${player.equipped.floor === 'rug' ? 'has-rug' : ''}`} />
                {player.equipped.floor === 'bookshelf' && (
                  <div className="room-floor-item">
                    <RoomItem id="bookshelf" size={150} />
                  </div>
                )}
                <div className="room-detective">
                  <Character who="detective" size={150} avatar={player.avatar} hat={player.hat} />
                </div>
                <div className="room-name">{player.nickname}'s clubhouse</div>
              </section>
              <aside className="decoration-shop">
                <div className="shop-title">
                  <h3>
                    <Sparkles size={20} />A little room magic
                  </h3>
                  <p>Choose a treasure. Find its cozy spot.</p>
                </div>
                <div className="decorations-grid">
                  {decorations.map((item) => {
                    const owned = player.unlocked.includes(item.id);
                    const equipped = player.equipped[item.slot] === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`decoration-item ${equipped ? 'equipped' : ''}`}
                        disabled={!owned && player.coins < item.price}
                        onClick={() => {
                          if (!owned && player.coins < item.price) return;
                          update({
                            coins: owned ? player.coins : player.coins - item.price,
                            unlocked: owned ? player.unlocked : [...player.unlocked, item.id],
                            equipped: { ...player.equipped, [item.slot]: equipped ? '' : item.id },
                          });
                          playSound('click', player.sound);
                        }}
                      >
                        <span className="decoration-icon">
                          <RoomItem id={item.id} size={42} />
                        </span>
                        <strong>{item.name}</strong>
                        <small>
                          {equipped ? (
                            <>
                              <Check size={13} />
                              Placed
                            </>
                          ) : owned ? (
                            'Place in room'
                          ) : (
                            <>
                              <Coins size={13} />
                              {item.price}
                            </>
                          )}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
            <div className="sticker-strip">
              <h3>Your sticker collection</h3>
              {player.stickers.length ? (
                player.stickers.map((sticker) => (
                  <span className="earned-sticker" key={sticker}>
                    {sticker}
                  </span>
                ))
              ) : (
                <p>Your first sticker is hiding in a bakery mystery.</p>
              )}
              <button className="text-button" onClick={() => startCase(featuredCase.id)}>
                Find another adventure <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </main>
      <footer>
        <span>
          <span className="footer-spark">✦</span>Small town. Big imaginations.
        </span>
        <div>
          {cached && (
            <span className="offline-ready">
              <span className="status-dot" />
              Offline ready
            </span>
          )}
          <span className="local-save">
            <ShieldCheck size={14} />
            {saveError ? 'Adventure is not saved' : 'Saved on this device'}
          </span>
          <button
            aria-label={player.sound ? 'Turn sound effects off' : 'Turn sound effects on'}
            onClick={() => update({ sound: !player.sound })}
          >
            {player.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="install-link" onClick={() => setOverlay('install')}>
            <Download size={15} />
            Install adventure
          </button>
        </div>
      </footer>
      {notice && (
        <div className="toast" role="status">
          <Sparkles size={18} />
          {notice}
          <button aria-label="Dismiss notification" onClick={() => setNotice('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {overlay === 'onboard' && (
        <Modal label="Create your detective" onClose={() => setOverlay(null)}>
          <Onboarding
            player={player}
            onComplete={(changes) => {
              update({ ...changes, onboarded: true });
              if (player.onboarded) setOverlay(null);
              else {
                setPage('clubhouse');
                setOverlay('welcome');
              }
            }}
          />
        </Modal>
      )}
      {overlay === 'welcome' && (
        <Modal label="Welcome to the clubhouse" onClose={() => setOverlay(null)}>
          <div className="welcome-content">
            <div className="welcome-badge">
              <Home size={43} />
            </div>
            <div className="eyebrow">WELCOME TO THE TEAM</div>
            <h2>Your detective HQ is ready!</h2>
            <p>
              Keep your clues here, collect your treasures, and make this little place your own.
            </p>
            <div className="unlock-note">
              <Check size={20} />
              <span>Ben's Bakery is open. Your first case awaits!</span>
            </div>
            <button className="button primary full" onClick={() => startCase(cases[0].id)}>
              Begin the first mystery <ArrowRight size={19} />
            </button>
          </div>
        </Modal>
      )}
      {overlay === 'settings' && (
        <Modal label="Detective settings" onClose={() => setOverlay(null)}>
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
                  onChange={(event) => update({ nickname: event.target.value })}
                  onBlur={() => {
                    if (!player.nickname.trim()) update({ nickname: 'Detective' });
                  }}
                />
                <small>Only saved on this device.</small>
              </div>
            </div>
            <label className="field-label" htmlFor="difficulty">
              Adventure level
            </label>
            <select
              id="difficulty"
              value={player.difficulty}
              onChange={(event) => update({ difficulty: event.target.value as Difficulty })}
            >
              {Object.entries(difficultyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
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
                  update({ sound: !player.sound });
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
                  update({ music: !player.music });
                  setMusic(!player.music);
                }}
              >
                <span />
              </button>
            </div>
            <button className="button secondary full" onClick={() => setOverlay('onboard')}>
              Change my detective look <Sparkles size={17} />
            </button>
          </div>
        </Modal>
      )}
      {overlay === 'intro' && activeCase && (
        <Modal
          label="Mystery introduction"
          onClose={() => {
            if (player.session) update({ session: { ...player.session, introSeen: true } });
            setOverlay(null);
          }}
        >
          <div className="dialogue-content">
            <Character who="ben" size={138} />
            <div className="eyebrow">BAKER BEN NEEDS YOUR HELP</div>
            <h2>{activeCase.title}</h2>
            {activeCase.location === 'park' && (
              <ParkScene
                completed={player.completed}
                solved={player.session?.solved}
                replayCaseId={activeCase.id}
              />
            )}
            <p className="dialogue-bubble">{activeCase.intro}</p>
            <button
              className="button primary full"
              onClick={() => {
                if (player.session) update({ session: { ...player.session, introSeen: true } });
                setOverlay(null);
              }}
            >
              I'll get to the bottom of this! <Search size={19} />
            </button>
          </div>
        </Modal>
      )}
      {overlay === 'notebook' && (
        <Modal label="Detective notebook" wide onClose={() => setOverlay(null)}>
          <div className="notebook-content">
            <div className="eyebrow">
              <BookOpen size={17} /> THE LITTLE DETAILS MATTER
            </div>
            <h2>Detective notebook</h2>
            <p>{activeCase ? activeCase.title : 'Your discoveries will be right here.'}</p>
            {collectedClues.length ? (
              <div className="clue-grid">
                {collectedClues.map((clue) => (
                  <article className="clue-card" key={clue.id}>
                    <span>{clue.icon}</span>
                    <h3>{clue.title}</h3>
                    {activeCase?.location === 'park' && (
                      <ParkEvidence
                        clueId={clue.id}
                        solved={player.session?.solved.includes(clue.puzzleId ?? '')}
                      />
                    )}
                    <p>{clueText(clue)}</p>
                    {clue.puzzleId && (
                      <small>
                        {player.session?.solved.includes(clue.puzzleId)
                          ? '✓ Discovery complete'
                          : '🔎 More to discover'}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-notebook">
                <Search size={46} />
                <h3>A fresh page for a fresh adventure.</h3>
                <p>Open a mystery and inspect a clue to add it here.</p>
                <button className="button primary" onClick={() => startCase(featuredCase.id)}>
                  Explore {locationDetails[featuredCase.location].name} <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
      {overlay === 'dialogue' && currentClue && (
        <Modal
          label={`Talk to ${characterNames[currentClue.character]}`}
          onClose={() => setOverlay(null)}
        >
          <div className="dialogue-content">
            <Character who={currentClue.character} size={128} />
            <div className="eyebrow">{characterNames[currentClue.character]}</div>
            <h2>{currentClue.title}</h2>
            {activeCase?.location === 'park' && (
              <ParkEvidence
                clueId={currentClue.id}
                solved={player.session?.solved.includes(currentClue.puzzleId ?? '')}
              />
            )}
            <p className="dialogue-bubble">{clueText(currentClue)}</p>
            <div className="clue-collected">
              <BookOpen size={17} />
              Clue added to your notebook
            </div>
            {currentClue.puzzleId && !player.session?.solved.includes(currentClue.puzzleId) ? (
              <button
                className="button primary full"
                onClick={() => {
                  setPuzzleId(currentClue.puzzleId!);
                  setOverlay('puzzle');
                }}
              >
                Let's take a closer look <Search size={18} />
              </button>
            ) : (
              <button className="button primary full" onClick={() => setOverlay(null)}>
                Keep exploring <ArrowRight size={18} />
              </button>
            )}
          </div>
        </Modal>
      )}
      {overlay === 'puzzle' && selectedPuzzle && (
        <Modal label={selectedPuzzle.title} onClose={() => setOverlay(null)}>
          <Puzzle
            key={`${selectedPuzzle.id}-${player.difficulty}`}
            puzzle={selectedPuzzle}
            junior={player.difficulty === 'junior'}
            onSolved={solvePuzzle}
          />
        </Modal>
      )}
      {overlay === 'conclusion' && activeCase && (
        <Modal label="Review evidence and solve mystery" wide onClose={() => setOverlay(null)}>
          <div className="conclusion-content">
            <div className="eyebrow">CONNECT THE LITTLE DOTS</div>
            <h2>So, what really happened?</h2>
            <p>Look through your clues, detective. Which story fits?</p>
            <div className="evidence-strip">
              {collectedClues.map((clue) => (
                <div key={clue.id}>
                  <span>{clue.icon}</span>
                  <strong>{clue.title}</strong>
                  {activeCase.location === 'park' && (
                    <ParkEvidence
                      clueId={clue.id}
                      solved={player.session?.solved.includes(clue.puzzleId ?? '')}
                    />
                  )}
                  <p>{clueText(clue)}</p>
                </div>
              ))}
            </div>
            <div className="answer-options">
              {activeCase.conclusions.map((answer, index) => (
                <button
                  className="answer-option"
                  key={answer}
                  onClick={() => {
                    if (index === activeCase.answer) {
                      setOverlay('reveal');
                      playSound('success', player.sound);
                    } else
                      setConclusionFeedback(
                        'A curious idea! Read the clues once more. Which explanation matches every discovery?',
                      );
                  }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  {answer}
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
            {conclusionFeedback && (
              <p className="hint" role="status">
                {conclusionFeedback}
              </p>
            )}
          </div>
        </Modal>
      )}
      {overlay === 'reveal' && activeCase && (
        <Modal label="Mystery reveal" onClose={() => setOverlay(null)}>
          <div className="reveal-content">
            <div className="celebration-stars">
              ✦ <Star size={54} fill="currentColor" /> ✦
            </div>
            <div className="eyebrow">MYSTERY SOLVED!</div>
            <h2>You followed the clues!</h2>
            <div className="reveal-characters">
              <Character who="ben" size={88} />
              <Character who="hamster" size={78} />
              <Character who="pip" size={78} />
            </div>
            <p className="dialogue-bubble">{activeCase.reveal}</p>
            <button className="button primary full" onClick={award}>
              {activeCase.repairLabel ?? 'Collect my rewards'} <Sparkles size={19} />
            </button>
          </div>
        </Modal>
      )}
      {overlay === 'rewards' && (
        <Modal
          label="Detective rewards"
          onClose={() => {
            setOverlay(null);
            setPage('clubhouse');
          }}
        >
          <div className="reward-content">
            <div className="reward-sticker">{rewardedCase.rewards.sticker}</div>
            <div className="eyebrow">CASE CLOSED. CURIOSITY OPEN.</div>
            <h2>{wasReplay ? 'Another mystery well solved!' : 'Wonderful detective work!'}</h2>
            <p>{rewardedCase.title}</p>
            {rewardedCase.location === 'park' && <ParkScene completed={player.completed} />}
            <div className="reward-row">
              <div>
                <Star size={29} fill="currentColor" />
                <strong>{wasReplay ? 0 : rewardedCase.rewards.stars}</strong>
                <span>Detective stars</span>
              </div>
              <div>
                <Coins size={29} />
                <strong>{wasReplay ? 0 : rewardedCase.rewards.coins}</strong>
                <span>Coins</span>
              </div>
              <div>
                <span className="reward-decoration">
                  {decorations.find((item) => item.id === rewardedCase.rewards.decoration)?.icon}
                </span>
                <strong>{wasReplay ? 'Yours!' : 'New!'}</strong>
                <span>Room treasure</span>
              </div>
            </div>
            <p className="small muted">
              {wasReplay
                ? 'This case’s treasures are already yours. Replays are just for fun!'
                : 'Rewards are earned once per mystery. Replays are just for fun!'}
            </p>
            <button className="button primary full" onClick={() => navigate('clubhouse')}>
              Back to my clubhouse <Home size={18} />
            </button>
          </div>
        </Modal>
      )}
      {overlay === 'install' && (
        <Modal label="Install Tiny Town Detectives" onClose={() => setOverlay(null)}>
          <div className="welcome-content">
            <div className="welcome-badge">
              <Download size={42} />
            </div>
            <h2>Take Tiny Town with you.</h2>
            <p>
              Install your little adventure to play from your home screen, even without internet
              after your first visit.
            </p>
            {install ? (
              <button
                className="button primary full"
                onClick={async () => {
                  await install.prompt();
                  await install.userChoice;
                  setInstall(null);
                  setOverlay(null);
                }}
              >
                Install adventure <Download size={18} />
              </button>
            ) : (
              <div className="hint">
                <p>
                  On iPhone or iPad, open Safari's Share menu and choose{' '}
                  <strong>Add to Home Screen</strong>. On other browsers, use the address bar's
                  install icon or the browser menu.
                </p>
              </div>
            )}
            <small className="muted">Offline play is enabled in the production build.</small>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Onboarding({
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
      <label className="field-label" htmlFor="onboard-difficulty">
        Choose your adventure level
      </label>
      <select
        id="onboard-difficulty"
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value as Difficulty)}
      >
        {Object.entries(difficultyLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button type="submit" className="button primary full">
        Let's do some detecting <ArrowRight size={18} />
      </button>
    </form>
  );
}
