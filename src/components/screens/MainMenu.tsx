import { useGame } from '../../state/useGame';
import { Button } from '../ui/Button';
import { primeAudio } from '../../utils/sound';

interface MainMenuProps {
  onPlay: () => void;
}

export function MainMenu({ onPlay }: MainMenuProps) {
  const { state } = useGame();
  const hasProgress = state.portfolioValue > 0 || state.stats.totalShots > 0;

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-sky-700 via-emerald-700 to-emerald-950 px-8 text-center">
      {/* twin stadium floodlights washing down from the top corners */}
      <div
        className="animate-spotlight-drift pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-spotlight-drift pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl"
        style={{ animationDelay: '-3s' }}
        aria-hidden="true"
      />
      {/* mown-grass field fading up from the base */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 9%, transparent 9% 18%)' }}
        aria-hidden="true"
      />
      {/* crowd-rail texture along the very top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(20,30,40,0.6) 0 5px, transparent 5px 10px)' }}
        aria-hidden="true"
      />
      {/* edge vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 120px 24px rgba(0,0,0,0.45)' }}
        aria-hidden="true"
      />

      <div className="animate-pop-in relative flex flex-col items-center gap-1">
        <div
          className="pointer-events-none absolute -top-1 h-28 w-28 rounded-full bg-emerald-200/40 blur-2xl"
          aria-hidden="true"
        />
        <div className="animate-float-bob relative text-7xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]">⚽</div>
        <div className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">World Cup 2026</div>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)]">
          Goal Trader
        </h1>
        <p className="text-sm font-medium text-emerald-100/90">Score goals. Grow your portfolio.</p>
      </div>

      {hasProgress && (
        <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-black/30 via-black/20 to-black/30 px-5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-base ring-1 ring-emerald-300/30">
            💰
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-emerald-200/80">Portfolio Value</div>
            <div className="font-display text-2xl font-extrabold text-white">${state.portfolioValue.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-xs overflow-hidden rounded-2xl">
        <Button
          className="w-full text-lg"
          onClick={() => {
            primeAudio();
            onPlay();
          }}
        >
          {hasProgress ? 'Continue' : 'Play'}
        </Button>
        <div
          className="animate-sheen-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          aria-hidden="true"
        />
      </div>

      <p className="max-w-xs text-xs text-emerald-100/70">
        Tap once to set your power, tap again to aim. Score Goals, Great Goals, and Top Corners to grow your portfolio
        through the World Cup knockout bracket.
      </p>
    </div>
  );
}
