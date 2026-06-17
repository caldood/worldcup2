import type { BracketRound } from '../types';

export const SHOTS_PER_MATCH = 5;

// Fictional clubs only — no real teams, flags, or trademarks.
export const BRACKET: BracketRound[] = [
  {
    id: 'round16',
    name: 'Round of 16',
    opponent: {
      id: 'coral',
      name: 'Coral Strikers',
      emoji: '🔶',
      color: '#fb923c',
      requiredGoals: 2,
      speedMultiplier: 1,
    },
    unlockReward: 'round16',
  },
  {
    id: 'quarter',
    name: 'Quarterfinal',
    opponent: {
      id: 'ironwall',
      name: 'Iron Wall United',
      emoji: '⚙️',
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
      id: 'velocity',
      name: 'Velocity FC',
      emoji: '⚡',
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
      id: 'dynasty',
      name: 'Golden Dynasty',
      emoji: '👑',
      color: '#facc15',
      requiredGoals: 4,
      speedMultiplier: 1.55,
    },
    unlockReward: 'final',
  },
];
