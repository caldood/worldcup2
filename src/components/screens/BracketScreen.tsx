import { useGame } from '../../state/useGame';
import { BRACKET } from '../../data/bracket';
import { Button } from '../ui/Button';
import { PortfolioHUD } from '../game/PortfolioHUD';

interface BracketScreenProps {
  onPlayRound: (index: number) => void;
  onNavigate: (screen: 'locker' | 'achievements' | 'menu') => void;
}

export function BracketScreen({ onPlayRound, onNavigate }: BracketScreenProps) {
  const { state } = useGame();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <PortfolioHUD portfolioValue={state.portfolioValue} streak={state.currentStreak} />

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <h1 className="mb-4 mt-2 text-center font-display text-xl font-extrabold uppercase tracking-wide text-white/90">
          World Cup Bracket
        </h1>

        <div className="flex flex-col gap-3">
          {BRACKET.map((round, i) => {
            const won = state.roundsWon.includes(round.id);
            const isCurrent = i === state.currentRoundIndex && !state.isChampion;
            const isPlayable = i <= state.currentRoundIndex;
            const locked = !isPlayable && !won;

            return (
              <div
                key={round.id}
                className={`flex items-center justify-between rounded-2xl border p-4 ${
                  locked
                    ? 'border-white/10 bg-white/5 opacity-50'
                    : isCurrent
                      ? 'border-amber-300/60 bg-amber-400/10 animate-pulse-glow'
                      : 'border-emerald-400/40 bg-emerald-400/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{won ? '✅' : locked ? '🔒' : round.opponent.emoji}</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/60">{round.name}</div>
                    <div className="font-bold text-white">{round.opponent.name}</div>
                  </div>
                </div>
                <Button
                  variant={isCurrent ? 'primary' : 'secondary'}
                  disabled={locked}
                  onClick={() => onPlayRound(i)}
                  className="px-4 py-2 text-sm"
                >
                  {won ? 'Replay' : 'Play'}
                </Button>
              </div>
            );
          })}
        </div>

        {state.isChampion && (
          <div className="mt-5 rounded-2xl border border-amber-300/50 bg-amber-400/10 p-4 text-center">
            <div className="text-3xl">👑</div>
            <div className="font-display text-lg font-extrabold text-amber-300">World Cup Champion!</div>
            <div className="text-sm text-white/70">Replay any round to keep growing your portfolio.</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-white/10 bg-black/20 p-3">
        <Button variant="secondary" className="flex-1 text-sm" onClick={() => onNavigate('locker')}>
          🎽 Locker
        </Button>
        <Button variant="secondary" className="flex-1 text-sm" onClick={() => onNavigate('achievements')}>
          🏅 Achievements
        </Button>
        <Button variant="ghost" className="flex-1 text-sm" onClick={() => onNavigate('menu')}>
          ⌂ Menu
        </Button>
      </div>
    </div>
  );
}
