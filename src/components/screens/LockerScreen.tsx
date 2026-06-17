import { useGame } from '../../state/useGame';
import { COSMETICS } from '../../data/cosmetics';
import type { CosmeticCategory } from '../../types';
import { Button } from '../ui/Button';

const CATEGORY_LABELS: Record<CosmeticCategory, string> = {
  stadium: '🏟️ Stadiums',
  ball: '⚽ Balls',
  jersey: '👕 Jerseys',
  celebration: '🎉 Celebrations',
};

const CATEGORIES: CosmeticCategory[] = ['stadium', 'ball', 'jersey', 'celebration'];

interface LockerScreenProps {
  onBack: () => void;
}

export function LockerScreen({ onBack }: LockerScreenProps) {
  const { state, dispatch } = useGame();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="rounded-full bg-black/30 px-3 py-1.5 text-sm font-semibold text-white/80 active:bg-black/50">
          ← Back
        </button>
        <h1 className="font-display text-lg font-extrabold uppercase tracking-wide">Locker</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {CATEGORIES.map((category) => (
          <div key={category} className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-white/70">{CATEGORY_LABELS[category]}</h2>
            <div className="grid grid-cols-2 gap-3">
              {COSMETICS.filter((c) => c.category === category).map((cosmetic) => {
                const unlocked = state.unlockedCosmetics.includes(cosmetic.id);
                const selected = state.selectedCosmetics[category] === cosmetic.id;
                return (
                  <button
                    key={cosmetic.id}
                    disabled={!unlocked}
                    onClick={() => dispatch({ type: 'SELECT_COSMETIC', category, id: cosmetic.id })}
                    className={`flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br p-3 ${cosmetic.preview} ${
                      selected ? 'ring-3 ring-white' : 'ring-1 ring-white/20'
                    } ${unlocked ? '' : 'opacity-35'}`}
                  >
                    <div className="text-3xl">{unlocked ? cosmetic.emoji : '🔒'}</div>
                    <div className="text-xs font-bold text-white drop-shadow">{cosmetic.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 bg-black/20 p-3">
        <Button variant="secondary" className="w-full text-sm" onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}>
          {state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </Button>
      </div>
    </div>
  );
}
