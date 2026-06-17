import type { BracketRound } from '../types';

export const SHOTS_PER_MATCH = 5;

// Real top footballing nations, each paired with a wink at its real-world economic
// reputation, with their actual flags front and center — this is the World Cup, after all.
export const BRACKET: BracketRound[] = [
  {
    id: 'round16',
    name: 'Round of 16',
    opponent: {
      id: 'argentina',
      name: 'Argentina Peso Printers',
      emoji: '🇦🇷',
      color: '#75aadb',
      requiredGoals: 2,
      speedMultiplier: 1,
    },
    unlockReward: 'round16',
  },
  {
    id: 'quarter',
    name: 'Quarterfinal',
    opponent: {
      id: 'germany',
      name: 'Germany Trade Surplus XI',
      emoji: '🇩🇪',
      color: '#dd0000',
      requiredGoals: 3,
      speedMultiplier: 1.18,
    },
    unlockReward: 'quarter',
  },
  {
    id: 'semi',
    name: 'Semifinal',
    opponent: {
      id: 'france',
      name: 'France Striking United',
      emoji: '🇫🇷',
      color: '#0055a4',
      requiredGoals: 3,
      speedMultiplier: 1.35,
    },
    unlockReward: 'semi',
  },
  {
    id: 'final',
    name: 'Final',
    opponent: {
      id: 'brazil',
      name: 'Brazil Red Card Risk',
      emoji: '🇧🇷',
      color: '#facc15',
      requiredGoals: 4,
      speedMultiplier: 1.55,
    },
    unlockReward: 'final',
  },
];
