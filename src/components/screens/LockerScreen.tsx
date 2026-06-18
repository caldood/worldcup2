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

  const handleResetGame = () => {
    if (window.confirm('Reset your portfolio, streak, bracket progress, and unlocked cosmetics? This cannot be undone.')) {
      dispatch({ type: 'RESET_GAME' });
      onBack();
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onBack}
          className="rounded-full bg-gradient-to-b from-white/15 to-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 shadow-sm ring-1 ring-white/10 active:from-white/10 active:to-white/5"
        >
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
                    className={`relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl bg-gradient-to-br p-3 shadow-md shadow-black/30 transition-transform ${cosmetic.preview} ${
                      selected
                        ? 'ring-3 ring-white shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                        : unlocked
                          ? 'ring-1 ring-white/20 active:scale-95'
                          : 'ring-1 ring-white/10'
                    }`}
                  >
                    {/* darken locked tiles with a scrim instead of washing out the whole swatch */}
                    {!unlocked && <div className="absolute inset-0 bg-black/55" aria-hidden="true" />}
                    <div className={`relative text-3xl drop-shadow ${unlocked ? '' : 'opacity-90'}`}>
                      {unlocked ? cosmetic.emoji : '🔒'}
                    </div>
                    <div className={`relative text-xs font-bold drop-shadow ${unlocked ? 'text-white' : 'text-white/70'}`}>
                      {cosmetic.name}
                    </div>
                    {selected && (
                      <div className="relative -mb-0.5 rounded-full bg-white/90 px-2 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                        Equipped
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-white/10 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <Button variant="secondary" className="w-full text-sm" onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}>
          {state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </Button>
        <Button variant="ghost" className="w-full text-sm text-rose-300" onClick={handleResetGame}>
          ↺ Reset Progress
        </Button>
      </div>
    </div>
  );
}
