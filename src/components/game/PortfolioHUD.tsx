import { useEffect, useRef, useState } from 'react';
import { getStreakMultiplier } from '../../utils/shotLogic';

interface PortfolioHUDProps {
  portfolioValue: number;
  streak: number;
  roundLabel?: string;
}

export function PortfolioHUD({ portfolioValue, streak, roundLabel }: PortfolioHUDProps) {
  const multiplier = getStreakMultiplier(streak);
  const prevValueRef = useRef(portfolioValue);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (portfolioValue > prevValueRef.current) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 450);
      prevValueRef.current = portfolioValue;
      return () => window.clearTimeout(timer);
    }
    prevValueRef.current = portfolioValue;
  }, [portfolioValue]);

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-black/30 via-black/15 to-black/30 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-6px_12px_rgba(0,0,0,0.25)] ring-1 ring-white/10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-base ring-1 ring-emerald-300/30">
          💰
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/80">Portfolio</div>
          <div
            className={`font-display text-2xl font-extrabold tabular-nums text-white drop-shadow-sm ${pulse ? 'animate-value-pop text-emerald-300' : ''}`}
          >
            ${portfolioValue.toLocaleString()}
          </div>
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
