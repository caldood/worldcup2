import type { BracketRound } from '../types';

export const SHOTS_PER_MATCH = 5;

// Fictional clubs only — no real teams, flags, or trademarks. Each opponent riffs on a
// top footballing nation's economic stereotype rather than its actual team or flag.
export const BRACKET: BracketRound[] = [
  {
    id: 'round16',
    name: 'Round of 16',
    opponent: {
      id: 'pampas',
      name: 'Pampas Peso Printers',
      emoji: '💵',
      color: '#5dade2',
      requiredGoals: 2,
      speedMultiplier: 1,
    },
    unlockReward: 'round16',
  },
  {
    id: 'quarter',
    name: 'Quarterfinal',
    opponent: {
      id: 'bundesbank',
      name: 'Bundesbank Austerity XI',
      emoji: '🏦',
      color: '#94a3b8',
      requiredGoals: 3,
      speedMultiplier: 1.18,
    },
    unlockReward: 'quarter',
  },
  {
    id: 'semi',
    name: 'Semifinal',
    opponent: {
      id: 'baguette',
      name: 'Banque de Baguette Bears',
      emoji: '🥖',
      color: '#38bdf8',
      requiredGoals: 3,
      speedMultiplier: 1.35,
    },
    unlockReward: 'semi',
  },
  {
    id: 'final',
    name: 'Final',
    opponent: {
      id: 'samba',
      name: 'Rio Real Bull Run',
      emoji: '🐂',
      color: '#facc15',
      requiredGoals: 4,
      speedMultiplier: 1.55,
    },
    unlockReward: 'final',
  },
];
