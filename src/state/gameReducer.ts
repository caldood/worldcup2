import { BRACKET } from '../data/bracket';
import { COSMETICS, DEFAULT_COSMETICS } from '../data/cosmetics';
import { evaluateAchievements } from '../data/achievements';
import { BASE_PAYOUTS, computeShot, getStreakMultiplier } from '../utils/shotLogic';
import type { GameState, ShotOutcome, Side } from '../types';

export const STORAGE_KEY = 'goal-trader-save-v1';

export const initialState: GameState = {
  portfolioValue: 0,
  currentRoundIndex: 0,
  currentStreak: 0,
  roundsWon: [],
  unlockedCosmetics: [...DEFAULT_COSMETICS],
  selectedCosmetics: {
    stadium: 'stadium-sunset',
    ball: 'ball-classic',
    jersey: 'jersey-emerald',
    celebration: 'celebrate-classic',
  },
  unlockedAchievements: [],
  stats: {
    totalShots: 0,
    totalGoals: 0,
    topCorners: 0,
    greatGoals: 0,
    misses: 0,
    bestStreak: 0,
    matchesWon: 0,
  },
  isChampion: false,
  soundEnabled: true,
};

export type GameAction =
  | { type: 'TAKE_SHOT'; power: number; accuracy: number; keeperSide: Side }
  | { type: 'COMPLETE_MATCH'; won: boolean }
  | { type: 'SELECT_COSMETIC'; category: keyof GameState['selectedCosmetics']; id: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; state: GameState };

export interface ShotDispatchResult {
  outcome: ShotOutcome;
  newlyUnlockedAchievements: string[];
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return { ...initialState, ...parsed, stats: { ...initialState.stats, ...parsed.stats } };
  } catch {
    return initialState;
  }
}

export function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, game still playable.
  }
}

/** Computes a single shot's result without mutating state; used by the reducer and the UI. */
export function resolveShot(state: GameState, power: number, accuracy: number, keeperSide: Side): ShotOutcome {
  const { result, placement, saved, overBar, beatKeeper } = computeShot(power, accuracy, keeperSide);
  const isGoal = result !== 'miss';
  const streakAfterShot = isGoal ? state.currentStreak + 1 : 0;
  const multiplier = isGoal ? getStreakMultiplier(streakAfterShot) : 1;
  const basePayout = BASE_PAYOUTS[result];
  const payout = Math.round(basePayout * multiplier);
  return { result, basePayout, multiplier, payout, power, accuracy, keeperSide, placement, saved, overBar, beatKeeper };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TAKE_SHOT': {
      const outcome = resolveShot(state, action.power, action.accuracy, action.keeperSide);
      const isGoal = outcome.result !== 'miss';
      const newStreak = isGoal ? state.currentStreak + 1 : 0;
      const stats = {
        ...state.stats,
        totalShots: state.stats.totalShots + 1,
        totalGoals: state.stats.totalGoals + (isGoal ? 1 : 0),
        topCorners: state.stats.topCorners + (outcome.result === 'topCorner' ? 1 : 0),
        greatGoals: state.stats.greatGoals + (outcome.result === 'great' ? 1 : 0),
        misses: state.stats.misses + (outcome.result === 'miss' ? 1 : 0),
        bestStreak: Math.max(state.stats.bestStreak, newStreak),
      };
      const nextState: GameState = {
        ...state,
        portfolioValue: state.portfolioValue + outcome.payout,
        currentStreak: newStreak,
        stats,
      };
      const newlyUnlocked = evaluateAchievements(nextState, newStreak);
      return newlyUnlocked.length
        ? { ...nextState, unlockedAchievements: [...nextState.unlockedAchievements, ...newlyUnlocked] }
        : nextState;
    }
    case 'COMPLETE_MATCH': {
      if (!action.won) return state;
      const round = BRACKET[state.currentRoundIndex];
      if (!round) return state;
      const roundsWon = state.roundsWon.includes(round.id) ? state.roundsWon : [...state.roundsWon, round.id];
      const unlockedCosmetics = round.unlockReward
        ? Array.from(new Set([...state.unlockedCosmetics, ...rewardCosmeticIds(round.unlockReward)]))
        : state.unlockedCosmetics;
      const isLastRound = state.currentRoundIndex >= BRACKET.length - 1;
      const nextState: GameState = {
        ...state,
        roundsWon,
        unlockedCosmetics,
        currentRoundIndex: isLastRound ? state.currentRoundIndex : state.currentRoundIndex + 1,
        isChampion: state.isChampion || isLastRound,
        stats: { ...state.stats, matchesWon: state.stats.matchesWon + 1 },
      };
      const newlyUnlocked = evaluateAchievements(nextState, state.currentStreak);
      return newlyUnlocked.length
        ? { ...nextState, unlockedAchievements: [...nextState.unlockedAchievements, ...newlyUnlocked] }
        : nextState;
    }
    case 'SELECT_COSMETIC':
      return {
        ...state,
        selectedCosmetics: { ...state.selectedCosmetics, [action.category]: action.id },
      };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'RESET_GAME':
      return initialState;
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

const COSMETIC_REWARD_MAP: Record<string, string[]> = COSMETICS.reduce<Record<string, string[]>>((map, c) => {
  if (c.unlockedBy !== 'default') {
    map[c.unlockedBy] = map[c.unlockedBy] ? [...map[c.unlockedBy], c.id] : [c.id];
  }
  return map;
}, {});

function rewardCosmeticIds(roundId: string): string[] {
  return COSMETIC_REWARD_MAP[roundId] ?? [];
}
