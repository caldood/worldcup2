import { useEffect, useState, type ReactElement } from 'react';
import type { ShotOutcome, Side } from '../../types';

interface GoalFrameProps {
  outcome: ShotOutcome | null;
  ballEmoji: string;
  /** Side the keeper is leaning toward while the player aims (the readable "tell"). */
  keeperLean?: Side | null;
}

// Drawn from shaded shapes rather than an emoji so the keeper reads as a real goalkeeper: a
// gradient yellow/black kit, padded gloves, socks and boots, and a wide ready-to-block stance.
function GoalkeeperSprite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gk-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#e0a90b" />
        </linearGradient>
        <linearGradient id="gk-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b58d" />
          <stop offset="100%" stopColor="#cd9264" />
        </linearGradient>
      </defs>

      {/* arms raised wide (behind the torso) with dark cuffs */}
      <line x1="35" y1="42" x2="14" y2="15" stroke="url(#gk-shirt)" strokeWidth="13" strokeLinecap="round" />
      <line x1="65" y1="42" x2="86" y2="15" stroke="url(#gk-shirt)" strokeWidth="13" strokeLinecap="round" />
      <circle cx="15" cy="16" r="6.5" fill="#1f2937" />
      <circle cx="85" cy="16" r="6.5" fill="#1f2937" />
      {/* padded gloves with a wrist cuff and palm crease */}
      <rect x="5" y="3" width="17" height="18" rx="6.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M9 13 h9" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="7" y="16" width="13" height="5" rx="2" fill="#facc15" />
      <rect x="78" y="3" width="17" height="18" rx="6.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M82 13 h9" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="80" y="16" width="13" height="5" rx="2" fill="#facc15" />

      {/* socks with a coloured turnover + layered boots */}
      <rect x="31" y="84" width="12" height="30" rx="5" fill="#111827" />
      <rect x="57" y="84" width="12" height="30" rx="5" fill="#111827" />
      <rect x="31" y="84" width="12" height="5" rx="2" fill="#facc15" />
      <rect x="57" y="84" width="12" height="5" rx="2" fill="#facc15" />
      <rect x="26" y="111" width="21" height="10" rx="4" fill="#0b1220" />
      <rect x="54" y="111" width="21" height="10" rx="4" fill="#0b1220" />
      <rect x="26" y="118" width="21" height="3.5" rx="1.5" fill="#020617" />
      <rect x="54" y="118" width="21" height="3.5" rx="1.5" fill="#020617" />

      {/* shorts */}
      <rect x="33" y="66" width="34" height="22" rx="6" fill="#0b1220" />
      <rect x="33" y="66" width="34" height="4" rx="2" fill="#1f2937" />

      {/* jersey with volume shading, collar and a number */}
      <rect x="31" y="34" width="38" height="34" rx="9" fill="url(#gk-shirt)" stroke="#a16207" strokeWidth="1.5" />
      <rect x="33" y="36" width="10" height="30" rx="5" fill="#ffffff" opacity="0.14" />
      <rect x="57" y="36" width="11" height="30" rx="5" fill="#000000" opacity="0.1" />
      <path d="M42 35 Q50 41 58 35 L58 33 Q50 39 42 33 Z" fill="#1f2937" />
      <text x="50" y="58" textAnchor="middle" fontSize="15" fontWeight="700" fill="#a16207" fontFamily="Arial, sans-serif">
        1
      </text>

      {/* neck + head + hair */}
      <rect x="45" y="28" width="10" height="8" fill="url(#gk-skin)" />
      <circle cx="50" cy="18" r="12" fill="url(#gk-skin)" stroke="#b07d4f" strokeWidth="1" />
      <path d="M38.5 18 a11.5 11.5 0 0 1 23 0 q-11.5 -7 -23 0 z" fill="#3b2412" />
    </svg>
  );
}

// Shaded white-and-navy USA kit: gradient shirt with a shoulder yoke and number, navy shorts with
// red trim, socks with a red turnover and proper boots. At rest both legs stand straight and apart;
// on the shot the kicking leg swings forward into the ball (the two rotating groups are preserved).
function KickerSprite({ className, kicking }: { className?: string; kicking?: boolean }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="kk-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe2ea" />
        </linearGradient>
        <linearGradient id="kk-shorts" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#274aa0" />
          <stop offset="100%" stopColor="#16235c" />
        </linearGradient>
        <linearGradient id="kk-sock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfd8e3" />
        </linearGradient>
        <linearGradient id="kk-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b58d" />
          <stop offset="100%" stopColor="#cd9264" />
        </linearGradient>
      </defs>

      {/* planted leg, straight at rest, braces back slightly as the other leg swings */}
      <g transform={`rotate(${kicking ? -14 : -2} 38 70)`} style={{ transition: 'transform 0.18s ease-out' }}>
        <rect x="31" y="66" width="14" height="48" rx="7" fill="url(#kk-sock)" stroke="#1d4ed8" strokeWidth="1.5" />
        <rect x="31" y="99" width="14" height="4.5" fill="#dc2626" />
        <rect x="27" y="106" width="21" height="11" rx="4" fill="#111827" />
        <rect x="27" y="113" width="21" height="4" rx="2" fill="#020617" />
      </g>

      {/* kicking leg, straight at rest, swings forward into the ball on the shot */}
      <g transform={`rotate(${kicking ? 62 : 2} 58 70)`} style={{ transition: 'transform 0.18s ease-out' }}>
        <rect x="51" y="66" width="14" height="48" rx="7" fill="url(#kk-sock)" stroke="#1d4ed8" strokeWidth="1.5" />
        <rect x="51" y="99" width="14" height="4.5" fill="#dc2626" />
        <rect x="47" y="106" width="21" height="11" rx="4" fill="#111827" />
        <rect x="47" y="113" width="21" height="4" rx="2" fill="#020617" />
      </g>

      {/* jersey with a navy shoulder yoke, volume shading and a number (hem tucks into the shorts) */}
      <rect x="32" y="23" width="36" height="40" rx="9" fill="url(#kk-shirt)" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M32 30 Q50 19 68 30 L68 24 Q50 15 32 24 Z" fill="#1e3a8a" />
      <rect x="34" y="31" width="9" height="29" rx="4" fill="#ffffff" opacity="0.55" />
      <rect x="58" y="31" width="9" height="29" rx="4" fill="#0b1f4d" opacity="0.07" />
      <text x="50" y="52" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e3a8a" fontFamily="Arial, sans-serif">
        9
      </text>

      {/* shorts over the jersey hem, navy with red side stripes and a centre seam */}
      <rect x="33" y="58" width="34" height="22" rx="8" fill="url(#kk-shorts)" />
      <rect x="33" y="58" width="34" height="4" rx="2" fill="#2f57b8" />
      <rect x="33" y="58" width="4" height="22" fill="#dc2626" />
      <rect x="63" y="58" width="4" height="22" fill="#dc2626" />
      <rect x="49.2" y="62" width="1.6" height="18" fill="#0b1f4d" opacity="0.4" />

      {/* arms: white sleeve + skin forearm + hand, with a red cuff; right arm up for balance */}
      <line x1="35" y1="32" x2="22" y2="44" stroke="url(#kk-shirt)" strokeWidth="10" strokeLinecap="round" />
      <line x1="23" y1="43" x2="15" y2="51" stroke="url(#kk-skin)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="14" cy="52" r="4.5" fill="url(#kk-skin)" />
      <line x1="65" y1="31" x2="79" y2="22" stroke="url(#kk-shirt)" strokeWidth="10" strokeLinecap="round" />
      <line x1="78" y1="23" x2="86" y2="15" stroke="url(#kk-skin)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="87" cy="14" r="4.5" fill="url(#kk-skin)" />
      <circle cx="23" cy="43" r="2.4" fill="#dc2626" />
      <circle cx="78" cy="23" r="2.4" fill="#dc2626" />

      {/* neck + head + hair */}
      <rect x="45" y="19" width="10" height="7" fill="url(#kk-skin)" />
      <circle cx="50" cy="13" r="11" fill="url(#kk-skin)" stroke="#b07d4f" strokeWidth="1" />
      <path d="M39 13 a11 11 0 0 1 22 0 q-11 -6.5 -22 0 z" fill="#4a3220" />
    </svg>
  );
}

// Small spread of national flags scattered across the crowd strip above the goal. France is
// pulled out and always placed first so every band is guaranteed to include it.
const FRANCE_FLAG = '🇫🇷';
const CROWD_FLAGS = ['🇺🇸', '🇧🇷', '🇦🇷', '🇩🇪', FRANCE_FLAG, '🇯🇵', '🇪🇸', '🇮🇹', '🇲🇽', '🇳🇬', '🇰🇷', '🇬🇧', '🇵🇹', '🇳🇱'];
const OTHER_CROWD_FLAGS = CROWD_FLAGS.filter((flag) => flag !== FRANCE_FLAG);

// Skin/hair/shirt color triples cycled across the crowd so neighbouring fans don't look cloned.
const CROWD_PALETTE: { skin: string; hair: string; shirt: string }[] = [
  { skin: '#e8b08a', hair: '#2d1b0e', shirt: '#ef4444' },
  { skin: '#c98a5e', hair: '#1c1410', shirt: '#3b82f6' },
  { skin: '#f3c9a3', hair: '#5c3a21', shirt: '#facc15' },
  { skin: '#8d5a3c', hair: '#0f0f0f', shirt: '#22c55e' },
  { skin: '#e8b08a', hair: '#7c4a25', shirt: '#a855f7' },
  { skin: '#c98a5e', hair: '#2d1b0e', shirt: '#f8fafc' },
  { skin: '#f3c9a3', hair: '#1c1410', shirt: '#fb923c' },
  { skin: '#8d5a3c', hair: '#5c3a21', shirt: '#06b6d4' },
];

// Deterministically lays out a grid of tiny "person" shapes (head + shoulders) standing in for a
// packed crowd, sized to a given SVG viewBox. No randomness so renders are stable across re-paints.
function crowdPeople(viewBoxWidth: number, viewBoxHeight: number, rows: number, cols: number) {
  const people: ReactElement[] = [];
  const rowH = viewBoxHeight / rows;
  const colW = viewBoxWidth / cols;
  const headR = Math.min(rowH, colW) * 0.32;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const palette = CROWD_PALETTE[i % CROWD_PALETTE.length];
      // Stagger alternate rows and jitter slightly by index so the grid doesn't look mechanically regular.
      const jitterX = ((i % 5) - 2) * (colW * 0.08);
      const rowOffset = r % 2 === 1 ? colW * 0.5 : 0;
      const cx = colW * (c + 0.5) + rowOffset + jitterX;
      if (cx > viewBoxWidth + colW || cx < -colW) continue;
      const cy = rowH * (r + 0.62);
      const shoulderW = headR * 2.3;
      const shoulderH = rowH * 0.46;
      people.push(
        <g key={`${r}-${c}`}>
          <rect
            x={cx - shoulderW / 2}
            y={cy - shoulderH * 0.15}
            width={shoulderW}
            height={shoulderH}
            rx={shoulderH * 0.35}
            fill={palette.shirt}
          />
          <circle cx={cx} cy={cy - headR * 1.05} r={headR} fill={palette.skin} />
          <path
            d={`M ${cx - headR} ${cy - headR * 1.05} a ${headR} ${headR} 0 0 1 ${headR * 2} 0 z`}
            fill={palette.hair}
          />
        </g>,
      );
    }
  }
  return people;
}

// Deterministic pseudo-random in [0, 1) from a numeric seed, so scattered flag positions stay
// put across re-renders (the frame re-renders on every shot phase change) instead of jumping around.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Scatters a moderate, non-repeating spread of flags across a crowd band: x anywhere across the
// width, y biased toward the upper portion (`topRangeUnits`) so flags wave above the fans' heads.
// Coordinates are worked out in the band's SVG viewBox units (matched 1:1 to real pixels, same
// trick `crowdPeople` uses) so the overlap check below compares true on-screen distances rather
// than mismatched x/y percentages. Each flag is placed via a handful of deterministic candidate
// tries, picking the first that clears `minDist` from every flag already placed.
function scatterFlags(
  count: number,
  seed: number,
  bandWidthUnits: number,
  bandHeightUnits: number,
  topRangeUnits: [number, number],
  minDist: number,
) {
  const [topMin, topMax] = topRangeUnits;
  const placed: { x: number; y: number }[] = [];
  return Array.from({ length: count }, (_, i) => {
    const flag = i === 0 ? FRANCE_FLAG : OTHER_CROWD_FLAGS[(i - 1 + seed) % OTHER_CROWD_FLAGS.length];
    let candidate = { x: bandWidthUnits / 2, y: (topMin + topMax) / 2 };
    let bestClearance = -Infinity;
    for (let attempt = 0; attempt < 50; attempt++) {
      const x = pseudoRandom(seed + i * 17.23 + attempt * 3.71) * bandWidthUnits;
      const y = topMin + pseudoRandom(seed + i * 23.11 + attempt * 5.93 + 1) * (topMax - topMin);
      const clearance = placed.reduce((min, p) => Math.min(min, Math.hypot(p.x - x, p.y - y)), Infinity);
      if (clearance > bestClearance) {
        bestClearance = clearance;
        candidate = { x, y };
      }
      if (clearance >= minDist) break;
    }
    placed.push(candidate);
    return {
      flag,
      left: (candidate.x / bandWidthUnits) * 100,
      top: (candidate.y / bandHeightUnits) * 100,
      key: `${seed}-${i}`,
    };
  });
}

// Ball sits ahead (toward the goal, smaller y) and off to one side of where the kicker stands,
// like a real penalty spot rather than glued to his feet. KICKER_POS.y is kept well clear of the
// field container's bottom edge so the (tall) kicker sprite never gets clipped.
const BALL_START = { x: 54, y: 75 };
const KICKER_POS = { x: 45, y: 78 };
// Goal line: bottom edge of the posts/net. Keeping this well above the foreground turf (instead of
// stretching the net almost to the kicker's feet) opens up a real stretch of open pitch in between,
// which is where the penalty-box markings live, so the shot has somewhere to travel.
const GOAL_LINE = 46;
// Feet anchored on the goal line itself (see the bottom-anchored transform below) so the keeper
// reads as standing in the goal mouth rather than floating centered in the open net.
const KEEPER_POS = { x: 50, y: GOAL_LINE };
// The close-up foreground turf strip starts here; the open pitch between GOAL_LINE and here is what
// sells the penalty-kick distance.
const GRASS_TOP = 84;

// Horizontal goal-mouth position (percent) the ball heads toward, by which side it was placed.
const SIDE_X: Record<Side, number> = { left: 28, center: 50, right: 72 };
// Corners are pushed harder toward the posts for the higher tiers so they read as real corners.
const CORNER_X: Record<Side, number> = { left: 19, center: 50, right: 81 };

function markerPosition(outcome: ShotOutcome): { x: number; y: number } {
  const { result, placement, saved, overBar, power } = outcome;

  if (result === 'miss') {
    if (overBar) return { x: 50, y: -24 }; // sailed over the bar
    if (saved && power <= 22) return { x: SIDE_X[placement], y: 52 }; // weak roller smothered low
    if (saved) return { x: SIDE_X[placement], y: 27 }; // keeper got a hand to it at the dive
    return { x: placement === 'left' ? -12 : placement === 'right' ? 112 : 50, y: 24 }; // flashed wide
  }

  if (result === 'topCorner') return { x: CORNER_X[placement], y: 9 };
  if (result === 'great') return { x: CORNER_X[placement], y: 16 };
  return { x: SIDE_X[placement], y: 27 }; // plain goal
}

// Keeper dives to the side it committed to (independent of the ball — that's the whole point now).
function keeperDive(side: Side): { x: number; rotate: number; jump: boolean } {
  if (side === 'left') return { x: -82, rotate: -78, jump: false };
  if (side === 'right') return { x: 82, rotate: 78, jump: false };
  return { x: 0, rotate: 0, jump: true }; // springs up to guard the middle
}

type Phase = 'idle' | 'flying' | 'impact';

export function GoalFrame({ outcome, ballEmoji, keeperLean }: GoalFrameProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [trackedOutcome, setTrackedOutcome] = useState(outcome);

  // New shot landed: snap back to the resting pose before the flight effect kicks off.
  if (outcome !== trackedOutcome) {
    setTrackedOutcome(outcome);
    setPhase('idle');
  }

  useEffect(() => {
    if (!outcome) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('flying')));
    const impactTimer = window.setTimeout(() => setPhase('impact'), 460);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(impactTimer);
    };
  }, [outcome]);

  const target = outcome ? markerPosition(outcome) : null;
  const flying = phase === 'flying' || phase === 'impact';
  const ballPos = flying && target ? target : BALL_START;
  const dive = outcome ? keeperDive(outcome.keeperSide) : null;
  // Pre-shot "tell": the keeper shifts and tilts toward the side it will guard so a sharp player can
  // read it and aim the other way. A centred commit just stands tall in the middle.
  const leanX = keeperLean === 'left' ? -22 : keeperLean === 'right' ? 22 : 0;
  const leanRotate = keeperLean === 'left' ? -8 : keeperLean === 'right' ? 8 : 0;
  const isGoalImpact = phase === 'impact' && outcome && outcome.result !== 'miss';
  const isWhiffImpact = phase === 'impact' && outcome && outcome.result === 'miss';
  // A save is its own beat — the keeper meets the ball rather than the ball flying clean past.
  const isSaveImpact = phase === 'impact' && outcome && outcome.saved;
  // Ball closer to the grass casts a bigger, darker shadow than one high in the air.
  const groundedness = Math.max(0.3, Math.min(1, ballPos.y / GRASS_TOP));

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
      {/* upper stands: a purely additive extension above the existing goal scene, so the crowd
          reads as a full stadium bowl towering over the goal rather than a thin strip pinned to it.
          Nothing in the scene below is touched or repositioned. */}
      <div className="relative aspect-[16/4] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 25" preserveAspectRatio="none" aria-hidden="true">
          {crowdPeople(100, 25, 6, 17)}
        </svg>
        <div className="pointer-events-none absolute top-3 left-[10%] h-12 w-12 rounded-full bg-amber-100/40 blur-xl" />
        <div className="pointer-events-none absolute top-3 right-[10%] h-12 w-12 rounded-full bg-amber-100/40 blur-xl" />
        <div className="absolute inset-0">
          {scatterFlags(10, 1, 100, 25, [1.5, 14.5], 11).map(({ flag, left, top, key }) => (
            <span
              key={key}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl leading-none drop-shadow-sm"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {flag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative aspect-[16/9] w-full overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #bce6ff 0%, #cdeec2 11%, #9ed98e 46%, #6cc257 84%, #4f9e3f 100%)',
        }}
      >
      {/* crowd: dark stand structure, a tiled multicolor dot pattern standing in for packed fans,
          and a scatter of national flags waving above them */}
      <div className="absolute inset-x-0 top-0 h-[11%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 6.1875" preserveAspectRatio="none" aria-hidden="true">
          {crowdPeople(100, 6.1875, 3, 19)}
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black/60" />
        <div className="absolute inset-0">
          {scatterFlags(6, 31, 100, 6.1875, [0.6, 3.7], 5.5).map(({ flag, left, top, key }) => (
            <span
              key={key}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-base leading-none drop-shadow-sm"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {flag}
            </span>
          ))}
        </div>
      </div>

      {/* stadium floodlight glow, shining down over the crowd */}
      <div className="pointer-events-none absolute -top-6 left-[8%] h-16 w-16 rounded-full bg-amber-100/50 blur-xl" />
      <div className="pointer-events-none absolute -top-6 right-[8%] h-16 w-16 rounded-full bg-amber-100/50 blur-xl" />

      {/* soft sunlight sheen across the open pitch, just for depth, no field markings */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: '11%',
          bottom: `${100 - GRASS_TOP}%`,
          background: 'radial-gradient(60% 70% at 50% 25%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 75%)',
        }}
      />

      {/* net grid, framed inside the posts */}
      <div
        className="absolute rounded-sm border-2 border-white/90"
        style={{
          left: '7%',
          right: '7%',
          top: '4%',
          bottom: `${100 - GOAL_LINE}%`,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 14%), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 11%)',
        }}
      />

      {/* goalposts + crossbar */}
      <div className="absolute rounded-sm bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ left: '6%', width: '2.5%', top: 0, bottom: `${100 - GOAL_LINE}%` }} />
      <div className="absolute rounded-sm bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ right: '6%', width: '2.5%', top: 0, bottom: `${100 - GOAL_LINE}%` }} />
      <div className="absolute rounded-sm bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ left: '6%', right: '6%', top: 0, height: '4%' }} />

      {isGoalImpact && (
        <div
          key={`${outcome.power}-${outcome.accuracy}-ripple`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 animate-net-ripple"
          style={{ left: `${target!.x}%`, top: `${target!.y}%`, width: 26, height: 26 }}
        />
      )}

      <div
        className="absolute"
        style={{
          left: `${KEEPER_POS.x}%`,
          top: `${KEEPER_POS.y}%`,
          transform:
            flying && dive
              ? `translate(-50%, -100%) translateX(${dive.x}px) translateY(${dive.jump ? -26 : 0}px) rotate(${dive.rotate}deg)`
              : `translate(-50%, -100%) translateX(${leanX}px) rotate(${leanRotate}deg)`,
          transition: 'transform 0.42s cubic-bezier(.33,.9,.4,1)',
          transitionDelay: flying ? '70ms' : '0ms',
        }}
      >
        <GoalkeeperSprite className="h-20 w-[60px] drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]" />
      </div>

      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${phase === 'flying' ? 'animate-kick-lunge' : ''}`}
        style={{ left: `${KICKER_POS.x}%`, top: `${KICKER_POS.y}%` }}
      >
        <KickerSprite className="h-20 w-16 drop-shadow-md" kicking={flying} />
      </div>

      {/* ground shadow, tracks the ball and shrinks as it gets airborne */}
      <div
        className="absolute -translate-x-1/2 rounded-full bg-black/40 blur-[1.5px]"
        style={{
          left: `${ballPos.x}%`,
          top: `${Math.min(96, ballPos.y + 3)}%`,
          width: 16 * groundedness,
          height: 5 * groundedness,
          opacity: 0.15 + 0.35 * groundedness,
          transition: 'left 0.42s cubic-bezier(.28,.74,.34,1), top 0.42s cubic-bezier(.28,.74,.34,1), width 0.42s, height 0.42s, opacity 0.42s',
        }}
      />

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-md"
        style={{
          left: `${ballPos.x}%`,
          top: `${ballPos.y}%`,
          transition: 'left 0.42s cubic-bezier(.28,.74,.34,1), top 0.42s cubic-bezier(.28,.74,.34,1), transform 0.42s ease-out',
          transform: `scale(${phase === 'impact' ? 1.15 : flying ? 0.82 : 1}) rotate(${flying ? 620 : 0}deg)`,
        }}
      >
        {ballEmoji}
      </div>

      {isSaveImpact && (
        <div
          key={`${outcome.power}-${outcome.accuracy}-save`}
          className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow"
          style={{ left: `${target!.x}%`, top: `${target!.y}%` }}
        >
          🧤
        </div>
      )}

      {isWhiffImpact && !isSaveImpact && (
        <div
          key={`${outcome.power}-${outcome.accuracy}-whiff`}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-xl animate-float-up"
          style={{ left: `${target!.x}%`, top: `${target!.y}%` }}
        >
          💨
        </div>
      )}

      {/* subtle vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 28px 6px rgba(0,0,0,0.18)' }}
      />
      </div>
    </div>
  );
}
