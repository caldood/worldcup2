import type { Side, ShotResult } from '../types';

export const BASE_PAYOUTS: Record<ShotResult, number> = {
  topCorner: 500,
  great: 250,
  goal: 100,
  miss: 0,
};

// Power bands (0-100 from the meter). Power now controls pace/height, not just a pass/fail edge.
export const POWER = {
  // At or below this the shot is a weak roller the keeper smothers.
  WEAK_MAX: 22,
  // At or above this the shot is driven hard enough to clear a diving keeper into the roof of the net.
  DRIVEN_MIN: 60,
  // At or above this it sails over the bar.
  OVER_MIN: 90,
};

// The meter value the player is trying to stop on for each side. Corners sit near the ends, where
// hitting them precisely is the hard, high-value play; the centre is the safe medium option.
const AIM_TARGET: Record<Side, number> = { left: 22, center: 50, right: 78 };

/** Which side of the goal an aim-meter value places the ball toward. */
export function placementSide(accuracy: number): Side {
  if (accuracy < 36) return 'left';
  if (accuracy > 64) return 'right';
  return 'center';
}

export interface ShotResolution {
  result: ShotResult;
  placement: Side;
  saved: boolean;
  overBar: boolean;
  beatKeeper: boolean;
}

/**
 * Resolves a penalty as a duel: place the ball away from where the keeper dives, judge the power
 * (too soft is smothered, too hard sails over), and beat a keeper who guesses right only with a
 * pinpoint, driven corner.
 */
export function computeShot(power: number, accuracy: number, keeperSide: Side): ShotResolution {
  const placement = placementSide(accuracy);
  const imprecision = Math.abs(accuracy - AIM_TARGET[placement]);
  const corner = placement !== 'center';
  const driven = power >= POWER.DRIVEN_MIN && power < POWER.OVER_MIN;
  const pinpoint = imprecision <= 9;
  const keeperOnIt = keeperSide === placement;
  // A pinpoint corner hit with real pace clears any keeper — the one unstoppable shot.
  const unstoppable = corner && pinpoint && driven;

  // Power failures come first — they blow the shot regardless of placement.
  if (power <= POWER.WEAK_MAX) return { result: 'miss', placement, saved: true, overBar: false, beatKeeper: false };
  if (power >= POWER.OVER_MIN) return { result: 'miss', placement, saved: false, overBar: true, beatKeeper: false };

  // Keeper guessed this side: only the unstoppable shot beats them, everything else is saved.
  if (keeperOnIt && !unstoppable) {
    return { result: 'miss', placement, saved: true, overBar: false, beatKeeper: false };
  }

  const beatKeeper = keeperOnIt && unstoppable;
  if (unstoppable) return { result: 'topCorner', placement, saved: false, overBar: false, beatKeeper };
  if (corner && pinpoint) return { result: 'great', placement, saved: false, overBar: false, beatKeeper };
  if (imprecision <= 18 && driven) return { result: 'great', placement, saved: false, overBar: false, beatKeeper };
  return { result: 'goal', placement, saved: false, overBar: false, beatKeeper };
}

/** Bull Market multiplier tiers based on the current consecutive-goal streak. */
export function getStreakMultiplier(streak: number): number {
  if (streak >= 5) return 3;
  if (streak >= 4) return 2;
  if (streak >= 3) return 1.5;
  if (streak >= 2) return 1.2;
  return 1;
}

/**
 * How likely the keeper is to read the shot and dive onto it regardless of its early lean.
 * Easy keepers (multiplier 1) never read you; tougher keepers increasingly do, capped so a smart
 * player can always still beat them with an unstoppable corner.
 */
export function keeperReadChance(speedMultiplier: number): number {
  return Math.max(0, Math.min(0.38, (speedMultiplier - 1) * 0.85));
}
