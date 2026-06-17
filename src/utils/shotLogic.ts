import type { ShotResult } from '../types';

export const BASE_PAYOUTS: Record<ShotResult, number> = {
  topCorner: 500,
  great: 250,
  goal: 100,
  miss: 0,
};

/** Power and accuracy are both 0-100, locked from the meter position on tap. */
export function computeShotResult(power: number, accuracy: number): ShotResult {
  // Shot must be hit with enough conviction but not blasted over the bar.
  if (power < 15 || power > 97) return 'miss';

  const distanceFromCenter = Math.abs(accuracy - 50);
  if (distanceFromCenter <= 5) {
    // Pinpoint accuracy needs well-judged power too, otherwise it's still a great goal.
    return power >= 55 && power <= 90 ? 'topCorner' : 'great';
  }
  if (distanceFromCenter <= 15) return 'great';
  if (distanceFromCenter <= 32) return 'goal';
  return 'miss';
}

/** Bull Market multiplier tiers based on the current consecutive-goal streak. */
export function getStreakMultiplier(streak: number): number {
  if (streak >= 5) return 3;
  if (streak >= 4) return 2;
  if (streak >= 3) return 1.5;
  if (streak >= 2) return 1.2;
  return 1;
}
