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
    <div className="relative flex h-full flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-sky-600 via-emerald-700 to-emerald-950 px-8 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 9%, transparent 9% 18%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(20,30,40,0.6) 0 5px, transparent 5px 10px)' }}
        aria-hidden="true"
      />

      <div className="animate-pop-in relative flex flex-col items-center gap-1">
        <div
          className="pointer-events-none absolute top-2 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative text-6xl drop-shadow-lg">⚽</div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">World Cup 2026</div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">Goal Trader</h1>
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

      <Button
        className="w-full max-w-xs text-lg"
        onClick={() => {
          primeAudio();
          onPlay();
        }}
      >
        {hasProgress ? 'Continue' : 'Play'}
      </Button>

      <p className="max-w-xs text-xs text-emerald-100/70">
        Tap once to set your power, tap again to aim. Score Goals, Great Goals, and Top Corners to grow your portfolio
        through the World Cup knockout bracket.
      </p>
    </div>
  );
}
