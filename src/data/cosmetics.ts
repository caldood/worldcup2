import type { Cosmetic } from '../types';

export const COSMETICS: Cosmetic[] = [
  // Stadiums
  { id: 'stadium-sunset', category: 'stadium', name: 'Sunset Arena', emoji: '🌇', preview: 'from-orange-400 to-pink-500', unlockedBy: 'default' },
  { id: 'stadium-coral', category: 'stadium', name: 'Coral Coliseum', emoji: '🏟️', preview: 'from-orange-500 to-red-500', unlockedBy: 'round16' },
  { id: 'stadium-iron', category: 'stadium', name: 'Iron Dome', emoji: '🏛️', preview: 'from-slate-500 to-slate-700', unlockedBy: 'quarter' },
  { id: 'stadium-night', category: 'stadium', name: 'Night Lights Park', emoji: '🌃', preview: 'from-indigo-600 to-sky-500', unlockedBy: 'semi' },
  { id: 'stadium-gold', category: 'stadium', name: 'Golden Cup Stadium', emoji: '🏆', preview: 'from-yellow-400 to-amber-600', unlockedBy: 'final' },

  // Balls
  { id: 'ball-classic', category: 'ball', name: 'Classic', emoji: '⚽', preview: 'from-white to-slate-200', unlockedBy: 'default' },
  { id: 'ball-coral', category: 'ball', name: 'Coral Blaze', emoji: '🟠', preview: 'from-orange-400 to-orange-600', unlockedBy: 'round16' },
  { id: 'ball-chrome', category: 'ball', name: 'Chrome Bullet', emoji: '⚪', preview: 'from-slate-300 to-slate-500', unlockedBy: 'quarter' },
  { id: 'ball-volt', category: 'ball', name: 'Volt Strike', emoji: '🟡', preview: 'from-yellow-300 to-lime-400', unlockedBy: 'semi' },
  { id: 'ball-champion', category: 'ball', name: 'Champion Gold', emoji: '🟨', preview: 'from-amber-300 to-yellow-500', unlockedBy: 'final' },

  // Jerseys
  { id: 'jersey-emerald', category: 'jersey', name: 'Emerald Kit', emoji: '🟢', preview: 'from-emerald-400 to-emerald-600', unlockedBy: 'default' },
  { id: 'jersey-coral', category: 'jersey', name: 'Coral Kit', emoji: '🟠', preview: 'from-orange-400 to-rose-500', unlockedBy: 'round16' },
  { id: 'jersey-steel', category: 'jersey', name: 'Steel Kit', emoji: '⚙️', preview: 'from-slate-400 to-slate-600', unlockedBy: 'quarter' },
  { id: 'jersey-azure', category: 'jersey', name: 'Azure Kit', emoji: '🔵', preview: 'from-sky-400 to-blue-600', unlockedBy: 'semi' },
  { id: 'jersey-royal', category: 'jersey', name: 'Royal Gold Kit', emoji: '👑', preview: 'from-yellow-300 to-amber-500', unlockedBy: 'final' },

  // Celebrations
  { id: 'celebrate-classic', category: 'celebration', name: 'Fist Pump', emoji: '✊', preview: 'from-emerald-300 to-emerald-500', unlockedBy: 'default' },
  { id: 'celebrate-slide', category: 'celebration', name: 'Knee Slide', emoji: '🤸', preview: 'from-orange-300 to-orange-500', unlockedBy: 'round16' },
  { id: 'celebrate-spin', category: 'celebration', name: 'Backflip', emoji: '🤾', preview: 'from-slate-300 to-slate-500', unlockedBy: 'quarter' },
  { id: 'celebrate-confetti', category: 'celebration', name: 'Confetti Pop', emoji: '🎉', preview: 'from-sky-300 to-blue-500', unlockedBy: 'semi' },
  { id: 'celebrate-trophy', category: 'celebration', name: 'Trophy Lift', emoji: '🏆', preview: 'from-yellow-300 to-amber-500', unlockedBy: 'final' },
];

export const DEFAULT_COSMETICS = COSMETICS.filter((c) => c.unlockedBy === 'default').map((c) => c.id);
