import { useEffect, useState } from 'react';
import type { ShotOutcome } from '../../types';

interface GoalFrameProps {
  outcome: ShotOutcome | null;
  ballEmoji: string;
}

// Drawn from flat polygons/shapes rather than an emoji so the keeper reads as a real
// goalkeeper: yellow/black kit, gloves, and a wide ready-to-block stance facing the camera.
function GoalkeeperSprite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      {/* legs, wide ready stance */}
      <polygon points="46,70 40,128 30,128 38,70" fill="#1e293b" />
      <polygon points="54,70 60,128 70,128 62,70" fill="#1e293b" />
      {/* boots */}
      <polygon points="26,122 40,122 40,130 24,130" fill="#0f172a" />
      <polygon points="60,122 74,122 76,130 60,130" fill="#0f172a" />
      {/* shorts */}
      <rect x="36" y="64" width="28" height="18" rx="3" fill="#0f172a" />
      {/* jersey */}
      <polygon points="30,26 70,26 66,68 34,68" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
      <rect x="46" y="26" width="8" height="42" fill="#854d0e" opacity="0.5" />
      {/* arms raised wide, ready to block */}
      <line x1="32" y1="32" x2="8" y2="6" stroke="#facc15" strokeWidth="13" strokeLinecap="round" />
      <line x1="68" y1="32" x2="92" y2="6" stroke="#facc15" strokeWidth="13" strokeLinecap="round" />
      {/* gloves */}
      <circle cx="7" cy="5" r="9" fill="#f8fafc" stroke="#854d0e" strokeWidth="2" />
      <circle cx="93" cy="5" r="9" fill="#f8fafc" stroke="#854d0e" strokeWidth="2" />
      {/* neck + head */}
      <rect x="44" y="20" width="12" height="8" fill="#d8a675" />
      <circle cx="50" cy="14" r="13" fill="#d8a675" stroke="#7c4a25" strokeWidth="1.5" />
      <path d="M37 9 a13 13 0 0 1 26 0 z" fill="#2d1b0e" />
    </svg>
  );
}

// Drawn from flat polygons/shapes too: white-and-red USA kit, mid-strike with the kicking
// leg swung forward and the arms out for balance.
function KickerSprite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      {/* planted leg */}
      <polygon points="42,68 38,118 28,120 34,68" fill="#1e3a8a" />
      <polygon points="24,114 38,114 36,122 22,122" fill="#0f172a" />
      {/* kicking leg, swung forward */}
      <polygon points="58,70 86,96 80,104 54,80" fill="#1e3a8a" />
      <polygon points="78,98 92,108 88,116 76,106" fill="#0f172a" />
      {/* shorts */}
      <rect x="34" y="62" width="30" height="18" rx="3" fill="#1e3a8a" />
      {/* jersey, white with a navy/red USA sash and collar stripe */}
      <defs>
        <clipPath id="kicker-jersey-clip">
          <polygon points="30,24 70,24 66,66 34,66" />
        </clipPath>
      </defs>
      <polygon points="30,24 70,24 66,66 34,66" fill="#f8fafc" stroke="#b91c1c" strokeWidth="2" />
      <g clipPath="url(#kicker-jersey-clip)">
        <polygon points="22,18 40,18 56,72 38,72" fill="#1e3a8a" />
        <polygon points="40,18 48,18 64,72 56,72" fill="#b91c1c" />
      </g>
      <rect x="30" y="24" width="40" height="6" fill="#b91c1c" />
      {/* arms bent for balance */}
      <line x1="32" y1="32" x2="14" y2="46" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
      <line x1="68" y1="32" x2="84" y2="20" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
      <circle cx="13" cy="48" r="6" fill="#d8a675" />
      <circle cx="85" cy="18" r="6" fill="#d8a675" />
      {/* neck + head */}
      <rect x="44" y="18" width="12" height="8" fill="#d8a675" />
      <circle cx="50" cy="13" r="12" fill="#d8a675" stroke="#7c4a25" strokeWidth="1.5" />
      <path d="M38 8 a12 12 0 0 1 24 0 z" fill="#1f2937" />
    </svg>
  );
}

const BALL_START = { x: 50, y: 97 };
const KICKER_POS = { x: 50, y: 95 };
// Centered in the (now much shorter) net so the goal reads as far away rather than filling the frame.
const KEEPER_POS = { x: 50, y: 25 };
// Goal line: bottom edge of the posts/net. Keeping this well above the foreground turf (instead of
// stretching the net almost to the kicker's feet) opens up a real stretch of open pitch in between,
// which is where the penalty-box markings live, so the shot has somewhere to travel.
const GOAL_LINE = 46;
// The close-up foreground turf strip starts here; the open pitch between GOAL_LINE and here is what
// sells the penalty-kick distance.
const GRASS_TOP = 84;

function markerPosition(outcome: ShotOutcome): { x: number; y: number } {
  const { result, accuracy, power } = outcome;
  if (result === 'miss') {
    if (power > 97) return { x: 50, y: -22 };
    if (power < 15) return { x: 50, y: 68 };
    return { x: accuracy < 50 ? -14 : 114, y: 26 };
  }
  const x = Math.min(88, Math.max(12, accuracy));
  const y = result === 'topCorner' ? 9 : result === 'great' ? 18 : 33;
  return { x, y };
}

// Keeper dives toward the ball's side; top corners and wide misses beat them clean.
function keeperDive(outcome: ShotOutcome): { x: number; rotate: number; jump: boolean } {
  const { result, accuracy } = outcome;
  if (result === 'topCorner') return { x: (accuracy - 50) * 1.1, rotate: 0, jump: true };
  if (result === 'miss' && (accuracy <= 20 || accuracy >= 80)) return { x: 0, rotate: 0, jump: false };
  const dir = accuracy < 50 ? -1 : 1;
  return { x: dir * 85, rotate: dir * 80, jump: false };
}

type Phase = 'idle' | 'flying' | 'impact';

export function GoalFrame({ outcome, ballEmoji }: GoalFrameProps) {
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
  const dive = outcome ? keeperDive(outcome) : null;
  const isGoalImpact = phase === 'impact' && outcome && outcome.result !== 'miss';
  const isWhiffImpact = phase === 'impact' && outcome && outcome.result === 'miss';
  // Ball closer to the grass casts a bigger, darker shadow than one high in the air.
  const groundedness = Math.max(0.3, Math.min(1, ballPos.y / GRASS_TOP));

  return (
    <div
      className="relative mx-auto aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
      style={{
        background:
          'linear-gradient(180deg, #bce6ff 0%, #cdeec2 11%, #9ed98e 46%, #6cc257 84%, #4f9e3f 100%)',
      }}
    >
      {/* crowd: dark stand structure plus a tiled multicolor dot pattern standing in for packed fans */}
      <div className="absolute inset-x-0 top-0 h-[11%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-conic-gradient(from 0deg, #f87171 0deg 90deg, #fbbf24 90deg 180deg, #60a5fa 180deg 270deg, #34d399 270deg 360deg)',
            backgroundSize: '5px 5px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black/60" />
      </div>

      {/* stadium floodlight glow, shining down over the crowd */}
      <div className="pointer-events-none absolute -top-6 left-[8%] h-16 w-16 rounded-full bg-amber-100/50 blur-xl" />
      <div className="pointer-events-none absolute -top-6 right-[8%] h-16 w-16 rounded-full bg-amber-100/50 blur-xl" />

      {/* turf mowing stripes */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: `${GRASS_TOP}%`,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 9%, transparent 9% 18%)',
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

      {/* penalty box, drawn in forced perspective (narrow near the goal, wide toward the kicker) to
          sell the open stretch of pitch between the goal line and the spot */}
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline points="30,50 16,84" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
        <polyline points="70,50 84,84" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
        <path d="M 40,50 Q 50,66 60,50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
        <circle cx="50" cy="70" r="1.4" fill="rgba(255,255,255,0.7)" />
      </svg>

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
          transform: dive
            ? `translate(-50%, -50%) translateX(${flying ? dive.x : 0}px) translateY(${flying && dive.jump ? -26 : 0}px) rotate(${flying ? dive.rotate : 0}deg)`
            : 'translate(-50%, -50%)',
          transition: 'transform 0.42s cubic-bezier(.33,.9,.4,1)',
          transitionDelay: flying ? '70ms' : '0ms',
        }}
      >
        <GoalkeeperSprite className="h-14 w-11 drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]" />
      </div>

      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${phase === 'flying' ? 'animate-kick-lunge' : ''}`}
        style={{ left: `${KICKER_POS.x}%`, top: `${KICKER_POS.y}%` }}
      >
        <KickerSprite className="h-20 w-16 drop-shadow-md" />
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

      {isWhiffImpact && (
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
  );
}
