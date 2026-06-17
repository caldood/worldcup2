import type { Achievement, GameState } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-dividend', name: 'First Dividend', description: 'Score your first goal', emoji: '🪙' },
  { id: 'ipo-day', name: 'IPO Day', description: 'Win your first match', emoji: '📈' },
  { id: 'top-corner-trader', name: 'Top Corner Trader', description: 'Score a Top Corner goal', emoji: '🎯' },
  { id: 'bull-run', name: 'Bull Run', description: 'Reach a 5-goal streak', emoji: '🐂' },
  { id: 'black-swan', name: 'Black Swan Event', description: 'Rack up 5 total misses', emoji: '🦢' },
  { id: 'unicorn-status', name: 'Unicorn Status', description: 'Reach a $5,000 portfolio', emoji: '🦄' },
  { id: 'market-cap', name: 'Market Cap Milestone', description: 'Reach a $10,000 portfolio', emoji: '💎' },
  { id: 'hedge-fund-manager', name: 'Hedge Fund Manager', description: 'Become World Cup Champion', emoji: '🏆' },
];

/** Returns ids of newly-unlocked achievements given the latest state + streak info. */
export function evaluateAchievements(state: GameState, bestStreakThisShot: number): string[] {
  const unlocked = new Set(state.unlockedAchievements);
  const newlyUnlocked: string[] = [];
  const maybeUnlock = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      unlocked.add(id);
      newlyUnlocked.push(id);
    }
  };

  maybeUnlock('first-dividend', state.stats.totalGoals >= 1);
  maybeUnlock('ipo-day', state.stats.matchesWon >= 1);
  maybeUnlock('top-corner-trader', state.stats.topCorners >= 1);
  maybeUnlock('bull-run', bestStreakThisShot >= 5);
  maybeUnlock('black-swan', state.stats.misses >= 5);
  maybeUnlock('unicorn-status', state.portfolioValue >= 5000);
  maybeUnlock('market-cap', state.portfolioValue >= 10000);
  maybeUnlock('hedge-fund-manager', state.isChampion);

  return newlyUnlocked;
}
