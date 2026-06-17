import type { ShotOutcome } from '../../types';

interface ResultOverlayProps {
  outcome: ShotOutcome;
}

const RESULT_COPY: Record<ShotOutcome['result'], { title: string; emoji: string; color: string }> = {
  topCorner: { title: 'TOP CORNER!', emoji: '🎯', color: 'text-yellow-300' },
  great: { title: 'GREAT GOAL!', emoji: '🔥', color: 'text-orange-300' },
  goal: { title: 'GOAL!', emoji: '⚽', color: 'text-emerald-300' },
  miss: { title: 'MISS', emoji: '❌', color: 'text-rose-400' },
};

export function ResultOverlay({ outcome }: ResultOverlayProps) {
  const copy = RESULT_COPY[outcome.result];
  const isGoal = outcome.result !== 'miss';
  const showBullMarket = isGoal && outcome.multiplier > 1;

  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${isGoal ? 'animate-flash-green' : 'animate-flash-red'}`}>
      <div className="animate-pop-in flex flex-col items-center gap-2 text-center">
        <div className="text-6xl drop-shadow-lg">{copy.emoji}</div>
        <div className={`font-display text-4xl font-extrabold tracking-wide drop-shadow-md ${copy.color}`}>{copy.title}</div>
        {isGoal && (
          <div className="font-display text-3xl font-extrabold text-white drop-shadow">
            +${outcome.payout.toLocaleString()}
          </div>
        )}
        {showBullMarket && (
          <div className="mt-1 rounded-full bg-amber-400/90 px-4 py-1 text-sm font-bold uppercase tracking-wider text-amber-950 animate-pulse-glow">
            🐂 Bull Market x{outcome.multiplier}
          </div>
        )}
        {!isGoal && (
          <div className="mt-1 rounded-full bg-rose-500/90 px-4 py-1 text-sm font-bold uppercase tracking-wider text-white">
            📉 Drawdown
          </div>
        )}
      </div>
    </div>
  );
}
