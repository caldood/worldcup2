export type ShotResult = 'topCorner' | 'great' | 'goal' | 'miss';

/** Which third of the goal a dive/placement targets. */
export type Side = 'left' | 'center' | 'right';

export interface Opponent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  /** Goals (out of SHOTS_PER_MATCH) the player must score to win */
  requiredGoals: number;
  /** Multiplies meter speed to make timing harder */
  speedMultiplier: number;
}

export interface BracketRound {
  id: string;
  name: string;
  opponent: Opponent;
  /** Cosmetic id unlocked on winning this round, if any */
  unlockReward?: string;
}

export type CosmeticCategory = 'stadium' | 'ball' | 'jersey' | 'celebration';

export interface Cosmetic {
  id: string;
  category: CosmeticCategory;
  name: string;
  emoji: string;
  /** Hex/Tailwind color swatch used for preview */
  preview: string;
  /** Round id required to unlock, or 'default' for starter items */
  unlockedBy: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface SelectedCosmetics {
  stadium: string;
  ball: string;
  jersey: string;
  celebration: string;
}

export interface GameStats {
  totalShots: number;
  totalGoals: number;
  topCorners: number;
  greatGoals: number;
  misses: number;
  bestStreak: number;
  matchesWon: number;
}

export interface GameState {
  portfolioValue: number;
  currentRoundIndex: number;
  currentStreak: number;
  roundsWon: string[];
  unlockedCosmetics: string[];
  selectedCosmetics: SelectedCosmetics;
  unlockedAchievements: string[];
  stats: GameStats;
  isChampion: boolean;
  soundEnabled: boolean;
}

export interface ShotOutcome {
  result: ShotResult;
  basePayout: number;
  multiplier: number;
  payout: number;
  power: number;
  accuracy: number;
  /** Side the keeper committed to diving. */
  keeperSide: Side;
  /** Side of the goal the player's shot was placed toward. */
  placement: Side;
  /** Miss caused specifically by the keeper getting a hand to it (vs. wide/over). */
  saved: boolean;
  /** Miss caused by sailing over the bar (too much power). */
  overBar: boolean;
  /** Scored despite the keeper guessing the right side (an unstoppable corner). */
  beatKeeper: boolean;
}
