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
      <div className="flex items-center gap-3 p-4">
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
                className={`flex items-center gap-3 rounded-2xl border p-3 shadow-md shadow-black/20 ${
                  unlocked
                    ? 'border-amber-300/40 bg-gradient-to-r from-amber-400/15 to-amber-300/5'
                    : 'border-white/10 bg-white/5 opacity-50'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/20 text-xl ring-1 ring-white/10">
                  {unlocked ? achievement.emoji : '🔒'}
                </div>
                <div>
                  <div className="font-bold text-white">{achievement.name}</div>
                  <div className="text-xs text-white/60">{achievement.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
