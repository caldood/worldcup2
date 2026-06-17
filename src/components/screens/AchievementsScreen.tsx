import { useGame } from '../../state/useGame';
import { ACHIEVEMENTS } from '../../data/achievements';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const { state } = useGame();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="rounded-full bg-black/30 px-3 py-1.5 text-sm font-semibold text-white/80 active:bg-black/50">
          ← Back
        </button>
        <h1 className="font-display text-lg font-extrabold uppercase tracking-wide">Achievements</h1>
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
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  unlocked ? 'border-amber-300/40 bg-amber-400/10' : 'border-white/10 bg-white/5 opacity-50'
                }`}
              >
                <div className="text-2xl">{unlocked ? achievement.emoji : '🔒'}</div>
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
