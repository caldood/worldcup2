import { getStreakMultiplier } from '../../utils/shotLogic';

interface PortfolioHUDProps {
  portfolioValue: number;
  streak: number;
  roundLabel?: string;
}

export function PortfolioHUD({ portfolioValue, streak, roundLabel }: PortfolioHUDProps) {
  const multiplier = getStreakMultiplier(streak);

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/80">Portfolio</div>
        <div className="font-display text-2xl font-extrabold tabular-nums text-white">
          ${portfolioValue.toLocaleString()}
        </div>
      </div>
      {roundLabel && (
        <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-white/60">{roundLabel}</div>
      )}
      <div className="text-right">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">Streak</div>
        <div className="font-display text-lg font-extrabold tabular-nums text-amber-300">
          {streak > 0 ? `${streak} 🔥` : '—'}
          {multiplier > 1 && <span className="ml-1 text-xs text-amber-200">x{multiplier}</span>}
        </div>
      </div>
    </div>
  );
}
