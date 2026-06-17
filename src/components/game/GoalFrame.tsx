import { useEffect, useState } from 'react';
import type { ShotOutcome } from '../../types';

interface GoalFrameProps {
  outcome: ShotOutcome | null;
  ballEmoji: string;
  kickerEmoji?: string;
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

const BALL_START = { x: 50, y: 97 };
const KICKER_POS = { x: 50, y: 95 };
// Up near the crossbar so the keeper's sprite doesn't overlap the kicker below.
const KEEPER_POS = { x: 50, y: 60 };
// The pitch/turf strip starts here; net targets live above it, between this and the crossbar.
const GRASS_TOP = 84;

function markerPosition(outcome: ShotOutcome): { x: number; y: number } {
  const { result, accuracy, power } = outcome;
  if (result === 'miss') {
    if (power > 97) return { x: 50, y: -22 };
    if (power < 15) return { x: 50, y: 90 };
    return { x: accuracy < 50 ? -14 : 114, y: 48 };
  }
  const x = Math.min(88, Math.max(12, accuracy));
  const y = result === 'topCorner' ? 12 : result === 'great' ? 30 : 58;
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

export function GoalFrame({ outcome, ballEmoji, kickerEmoji = '🏃' }: GoalFrameProps) {
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
          'linear-gradient(180deg, #bce6ff 0%, #d7f6e4 20%, #eafff2 50%, #eafff2 84%, #6cc257 84%, #4f9e3f 100%)',
      }}
    >
      {/* crowd silhouette */}
      <div
        className="absolute inset-x-0 top-0 h-[9%] opacity-40"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(20,30,40,0.55) 0 5px, transparent 5px 10px)' }}
      />

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
          bottom: `${100 - GRASS_TOP}%`,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 14%), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 11%)',
        }}
      />

      {/* goalposts + crossbar */}
      <div className="absolute rounded-sm bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ left: '6%', width: '2.5%', top: 0, bottom: `${100 - GRASS_TOP}%` }} />
      <div className="absolute rounded-sm bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ right: '6%', width: '2.5%', top: 0, bottom: `${100 - GRASS_TOP}%` }} />
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
          transform: dive
            ? `translate(-50%, -50%) translateX(${flying ? dive.x : 0}px) translateY(${flying && dive.jump ? -26 : 0}px) rotate(${flying ? dive.rotate : 0}deg)`
            : 'translate(-50%, -50%)',
          transition: 'transform 0.42s cubic-bezier(.33,.9,.4,1)',
          transitionDelay: flying ? '70ms' : '0ms',
        }}
      >
        <GoalkeeperSprite className="h-[72px] w-14 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]" />
      </div>

      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${phase === 'flying' ? 'animate-kick-lunge' : ''}`}
        style={{ left: `${KICKER_POS.x}%`, top: `${KICKER_POS.y}%` }}
      >
        <div className="relative text-5xl drop-shadow-md">
          {kickerEmoji}
          <span className="absolute -right-1.5 top-1 text-base drop-shadow">🇺🇸</span>
        </div>
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
    </div>
  );
}
