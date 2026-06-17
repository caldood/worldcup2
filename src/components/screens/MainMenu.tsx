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
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-600 via-emerald-700 to-emerald-950 px-8 text-center">
      <div className="animate-pop-in relative flex flex-col items-center gap-1">
        <div
          className="pointer-events-none absolute top-2 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative text-6xl drop-shadow-lg">⚽</div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">Goal Trader</h1>
        <p className="text-sm font-medium text-emerald-100/90">Score goals. Grow your portfolio.</p>
      </div>

      {hasProgress && (
        <div className="rounded-2xl bg-black/25 px-5 py-3 text-center shadow-inner ring-1 ring-white/10">
          <div className="text-xs uppercase tracking-wider text-emerald-200/80">Portfolio Value</div>
          <div className="font-display text-2xl font-extrabold text-white">${state.portfolioValue.toLocaleString()}</div>
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
