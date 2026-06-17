import { useEffect, useState } from 'react';
import type { ShotOutcome } from '../../types';

interface GoalFrameProps {
  outcome: ShotOutcome | null;
  ballEmoji: string;
  keeperEmoji?: string;
}

const BALL_START = { x: 50, y: 102 };

function markerPosition(outcome: ShotOutcome): { x: number; y: number } {
  const { result, accuracy, power } = outcome;
  if (result === 'miss') {
    if (power > 97) return { x: 50, y: -22 };
    if (power < 15) return { x: 50, y: 58 };
    return { x: accuracy < 50 ? -14 : 114, y: 48 };
  }
  const x = Math.min(92, Math.max(8, accuracy));
  const y = result === 'topCorner' ? 10 : result === 'great' ? 28 : 56;
  return { x, y };
}

// Keeper dives toward the ball's side; top corners and wide misses beat them clean.
function keeperDive(outcome: ShotOutcome): { x: number; rotate: number; jump: boolean } {
  const { result, accuracy } = outcome;
  if (result === 'topCorner') return { x: (accuracy - 50) * 1.1, rotate: 0, jump: true };
  if (result === 'miss' && (accuracy <= 20 || accuracy >= 80)) return { x: 0, rotate: 0, jump: false };
  const dir = accuracy < 50 ? -1 : 1;
  return { x: dir * 78, rotate: dir * 80, jump: false };
}

type Phase = 'idle' | 'flying' | 'impact';

export function GoalFrame({ outcome, ballEmoji, keeperEmoji = '🧤' }: GoalFrameProps) {
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

  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl bg-[linear-gradient(180deg,#e8fff3_0%,#cdebd9_100%)]">
      {/* net grid */}
      <div
        className="absolute inset-2 rounded-sm border-2 border-white/90"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12%), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 10%)',
        }}
      />

      {isGoalImpact && (
        <div
          key={`${outcome.power}-${outcome.accuracy}-ripple`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 animate-net-ripple"
          style={{ left: `${target!.x}%`, top: `${target!.y}%`, width: 26, height: 26 }}
        />
      )}

      <div
        className="absolute bottom-2 left-1/2 text-3xl ease-out"
        style={{
          transform: dive
            ? `translateX(calc(-50% + ${flying ? dive.x : 0}px)) translateY(${flying && dive.jump ? -18 : 0}px) rotate(${flying ? dive.rotate : 0}deg)`
            : 'translateX(-50%)',
          transition: 'transform 0.42s cubic-bezier(.33,.9,.4,1)',
          transitionDelay: flying ? '70ms' : '0ms',
        }}
      >
        {keeperEmoji}
      </div>

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
