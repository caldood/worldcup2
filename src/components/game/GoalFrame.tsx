import type { ShotOutcome } from '../../types';

interface GoalFrameProps {
  outcome: ShotOutcome | null;
  ballEmoji: string;
  keeperEmoji?: string;
}

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

export function GoalFrame({ outcome, ballEmoji, keeperEmoji = '🧤' }: GoalFrameProps) {
  const marker = outcome ? markerPosition(outcome) : null;

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
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl">{keeperEmoji}</div>
      {marker && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-md animate-ball-pop"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {ballEmoji}
        </div>
      )}
    </div>
  );
}
