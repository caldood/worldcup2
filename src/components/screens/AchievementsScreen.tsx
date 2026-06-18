import { useGame } from '../../state/useGame';
import { ACHIEVEMENTS } from '../../data/achievements';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const { state } = useGame();
  const unlockedCount = ACHIEVEMENTS.filter((a) => state.unlockedAchievements.includes(a.id)).length;

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="flex items-center gap-3 p-4 pb-2">
        <button
          onClick={onBack}
          className="rounded-full bg-gradient-to-b from-white/15 to-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 shadow-sm ring-1 ring-white/10 active:from-white/10 active:to-white/5"
        >
          ← Back
        </button>
        <h1 className="font-display text-lg font-extrabold uppercase tracking-wide">Achievements</h1>
        <div className="ml-auto rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-300/30">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </div>
      </div>

      {/* overall progress toward collecting every milestone */}
      <div className="px-4 pb-3">
        <div className="h-2 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-[width] duration-500"
            style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="mb-3 text-xs text-white/50">
          Finance-themed milestones — bragging rights only, no effect on gameplay.
        </div>
        <div className="flex flex-col gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 shadow-md shadow-black/20 transition-colors ${
                  unlocked
                    ? 'border-amber-300/40 bg-gradient-to-r from-amber-400/20 to-amber-300/5'
                    : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <div
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl ring-1 ${
                    unlocked
                      ? 'bg-amber-400/15 ring-amber-300/40 shadow-[0_0_10px_rgba(250,204,21,0.35)]'
                      : 'bg-black/25 ring-white/10'
                  }`}
                >
                  {/* always show the themed icon; dim + desaturate it while still locked */}
                  <span className={unlocked ? '' : 'opacity-40 grayscale'}>{achievement.emoji}</span>
                  {!unlocked && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-[10px] ring-1 ring-white/15">
                      🔒
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold ${unlocked ? 'text-amber-100' : 'text-white/80'}`}>{achievement.name}</div>
                  <div className="text-xs text-white/55">{achievement.description}</div>
                </div>
                {unlocked && <div className="ml-auto text-lg text-amber-300 drop-shadow">✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
