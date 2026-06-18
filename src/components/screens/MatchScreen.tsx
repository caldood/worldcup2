import { useCallback, useRef, useState } from 'react';
import { useGame } from '../../state/useGame';
import { resolveShot } from '../../state/gameReducer';
import { BRACKET, SHOTS_PER_MATCH } from '../../data/bracket';
import { COSMETICS } from '../../data/cosmetics';
import { MeterBar, type Zone } from '../game/MeterBar';
import { PortfolioHUD } from '../game/PortfolioHUD';
import { GoalFrame } from '../game/GoalFrame';
import { ResultOverlay } from '../game/ResultOverlay';
import { Button } from '../ui/Button';
import { sfx } from '../../utils/sound';
import { placementSide, keeperReadChance } from '../../utils/shotLogic';
import type { ShotOutcome, ShotResult, Side } from '../../types';

const SIDES: Side[] = ['left', 'center', 'right'];
const randomSide = (): Side => SIDES[Math.floor(Math.random() * SIDES.length)];

/** Short status line under the meters reacting to how the shot resolved. */
function resultPrompt(outcome: ShotOutcome): string {
  if (outcome.result === 'topCorner') return outcome.beatKeeper ? 'Unstoppable! 🎯' : 'Top corner! 🎯';
  if (outcome.result === 'great') return 'Great strike!';
  if (outcome.result === 'goal') return 'Goal!';
  if (outcome.saved) return 'Keeper saves it! 🧤';
  if (outcome.overBar) return 'Over the bar!';
  return 'Flashed wide!';
}

// Aim bands: the two gold corners (≈22 / ≈78) are the high-value, hard-to-hit targets; the emerald
// centre band is the safe medium option. Aim away from whichever side the keeper is leaning.
const ACCURACY_ZONES: Zone[] = [
  { left: 13, width: 18, className: 'bg-amber-400/55' },
  { left: 40, width: 20, className: 'bg-emerald-400/40' },
  { left: 69, width: 18, className: 'bg-amber-400/55' },
];

// Power bands: weak roller (left, red) → controlled (green) → driven/keeper-beating (gold) → over the
// bar (right, red). Land it in the gold to keep every option open.
const POWER_ZONES: Zone[] = [
  { left: 0, width: 22, className: 'bg-rose-500/40' },
  { left: 22, width: 38, className: 'bg-emerald-400/30' },
  { left: 60, width: 30, className: 'bg-amber-400/55' },
  { left: 90, width: 10, className: 'bg-rose-500/45' },
];

// Matches the flight-to-impact timing in GoalFrame so the sfx/overlay land with the ball.
const IMPACT_DELAY = 460;

const CONFETTI_COLORS = ['bg-emerald-400', 'bg-amber-300', 'bg-sky-300', 'bg-rose-400', 'bg-violet-400'];
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 53) % 600,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

const RESULT_DOT: Record<ShotResult, string> = {
  topCorner: 'bg-yellow-400',
  great: 'bg-orange-400',
  goal: 'bg-emerald-400',
  miss: 'bg-rose-500',
};

interface MatchScreenProps {
  roundIndex: number;
  onExit: () => void;
}

type Phase = 'power' | 'accuracy' | 'result' | 'matchEnd';

export function MatchScreen({ roundIndex, onExit }: MatchScreenProps) {
  const { state, dispatch } = useGame();
  const round = BRACKET[roundIndex];

  const [phase, setPhase] = useState<Phase>('power');
  const [shotIndex, setShotIndex] = useState(0);
  const [goalsThisMatch, setGoalsThisMatch] = useState(0);
  const [shotHistory, setShotHistory] = useState<ShotResult[]>([]);
  const [lockedPower, setLockedPower] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ShotOutcome | null>(null);
  const [matchWon, setMatchWon] = useState<boolean | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  // The side the keeper commits to (shown as a lean while aiming); decided when the power is locked.
  const [keeperLean, setKeeperLean] = useState<Side | null>(null);

  const powerGetter = useRef<() => number>(() => 0);
  const accuracyGetter = useRef<() => number>(() => 0);

  const ballEmoji = COSMETICS.find((c) => c.id === state.selectedCosmetics.ball)?.emoji ?? '⚽';
  const stadium = COSMETICS.find((c) => c.id === state.selectedCosmetics.stadium);

  const resetForNextShot = useCallback(() => {
    setLockedPower(null);
    setOutcome(null);
    setShowOverlay(false);
    setKeeperLean(null);
    setPhase('power');
  }, []);

  const handleTap = useCallback(() => {
    const play = (fn: () => void) => {
      if (state.soundEnabled) fn();
    };

    if (phase === 'power') {
      const power = powerGetter.current();
      setLockedPower(power);
      play(sfx.lock);
      // Keeper commits now and telegraphs it with a lean, giving the player something to read.
      setKeeperLean(randomSide());
      setPhase('accuracy');
      return;
    }
    if (phase === 'accuracy' && lockedPower !== null) {
      const accuracy = accuracyGetter.current();
      // Tougher keepers can "read" the shot at the last instant and dive onto the placed side,
      // overriding their early lean; easy keepers always honour their tell.
      const committed = keeperLean ?? randomSide();
      const reads = Math.random() < keeperReadChance(round.opponent.speedMultiplier);
      const keeperSide: Side = reads ? placementSide(accuracy) : committed;

      const computed = resolveShot(state, lockedPower, accuracy, keeperSide);
      setOutcome(computed);
      dispatch({ type: 'TAKE_SHOT', power: lockedPower, accuracy, keeperSide });

      const isGoal = computed.result !== 'miss';
      const newGoals = goalsThisMatch + (isGoal ? 1 : 0);
      setGoalsThisMatch(newGoals);
      setShotHistory((prev) => [...prev, computed.result]);
      setPhase('result');
      setShowOverlay(false);

      // Let the ball reach the net before the impact sound/result card land.
      window.setTimeout(() => {
        if (computed.result === 'topCorner') play(sfx.topCorner);
        else if (computed.result === 'great') play(sfx.great);
        else if (computed.result === 'goal') play(sfx.goal);
        else play(sfx.miss);
        setShowOverlay(true);
      }, IMPACT_DELAY);

      const nextShotIndex = shotIndex + 1;
      window.setTimeout(() => {
        if (nextShotIndex >= SHOTS_PER_MATCH) {
          const won = newGoals >= round.opponent.requiredGoals;
          dispatch({ type: 'COMPLETE_MATCH', won });
          setMatchWon(won);
          setPhase('matchEnd');
          play(won ? sfx.win : sfx.lose);
        } else {
          setShotIndex(nextShotIndex);
          resetForNextShot();
        }
      }, 1400);
    }
  }, [
    phase,
    lockedPower,
    keeperLean,
    state,
    dispatch,
    goalsThisMatch,
    shotIndex,
    round.opponent.requiredGoals,
    round.opponent.speedMultiplier,
    resetForNextShot,
  ]);

  const handleRetry = () => {
    setShotIndex(0);
    setGoalsThisMatch(0);
    setShotHistory([]);
    setMatchWon(null);
    resetForNextShot();
  };

  const isPlayable = phase === 'power' || phase === 'accuracy';
  const shotMissed = phase === 'result' && showOverlay && outcome?.result === 'miss';

  return (
    <div className={`relative flex h-full flex-col bg-gradient-to-b ${stadium?.preview ?? 'from-emerald-700 to-emerald-900'}`}>
      <div className="bg-black/25">
        <div className="flex items-center justify-between px-3 pt-2">
          <button
            onClick={onExit}
            className="rounded-full bg-gradient-to-b from-white/15 to-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 shadow-sm ring-1 ring-white/10 active:from-white/10 active:to-white/5"
          >
            ← Exit
          </button>
          <div className="text-xs font-bold uppercase tracking-wider text-white/70">{round.name}</div>
        </div>
        <PortfolioHUD portfolioValue={state.portfolioValue} streak={state.currentStreak} />
      </div>

      <div className="flex items-center justify-center gap-3 py-2 text-sm text-white/90">
        <span className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 ring-1 ring-white/10">
          <span className="text-base">{round.opponent.emoji}</span> {round.opponent.name}
        </span>
        <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold ring-1 ring-white/10">
          Need {round.opponent.requiredGoals}/{SHOTS_PER_MATCH} to win
        </span>
      </div>

      <div className="flex justify-center gap-2 pb-2">
        {Array.from({ length: SHOTS_PER_MATCH }).map((_, i) => {
          const result = shotHistory[i];
          const isNext = !result && i === shotHistory.length && isPlayable;
          return (
            <div
              key={i}
              className={`h-3 w-3 rounded-full border transition-all ${
                result
                  ? `${RESULT_DOT[result]} border-white/50 shadow-[0_0_6px_rgba(255,255,255,0.5)]`
                  : isNext
                    ? 'animate-pulse border-white/80 bg-white/30'
                    : 'border-white/40 bg-white/10'
              }`}
            />
          );
        })}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div key={shotMissed ? `miss-${shotIndex}` : 'frame'} className={`w-full ${shotMissed ? 'animate-shake' : ''}`}>
          <GoalFrame outcome={outcome} ballEmoji={ballEmoji} keeperLean={phase === 'accuracy' ? keeperLean : null} />
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-white/70">
            {phase === 'power' && 'Tap to set POWER'}
            {phase === 'accuracy' && '⚠ Aim away from the keeper'}
            {phase === 'result' && outcome && resultPrompt(outcome)}
            {phase === 'matchEnd' && ' '}
          </div>
          <MeterBar
            speed={0.55 * round.opponent.speedMultiplier}
            indicatorClassName="bg-emerald-300 shadow-[0_0_8px_#6ee7b7]"
            trackClassName="bg-black/30"
            zones={POWER_ZONES}
            active={phase === 'power'}
            lockedValue={phase === 'power' ? null : lockedPower}
            onValueRef={(getValue) => {
              powerGetter.current = getValue;
            }}
          />
          <MeterBar
            speed={0.85 * round.opponent.speedMultiplier}
            indicatorClassName="bg-sky-300 shadow-[0_0_8px_#7dd3fc]"
            trackClassName="bg-rose-900/40"
            zones={ACCURACY_ZONES}
            active={phase === 'accuracy'}
            lockedValue={phase === 'accuracy' ? null : outcome ? outcome.accuracy : null}
            onValueRef={(getValue) => {
              accuracyGetter.current = getValue;
            }}
          />
        </div>
      </div>

      {isPlayable && (
        <button
          aria-label="Tap to play"
          onPointerDown={handleTap}
          className="absolute inset-0 z-10"
          style={{ background: 'transparent' }}
        />
      )}

      {phase === 'result' && outcome && showOverlay && <ResultOverlay outcome={outcome} />}

      {phase === 'matchEnd' && matchWon !== null && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6">
          {matchWon && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
              {CONFETTI.map((c, i) => (
                <div
                  key={i}
                  className={`absolute top-0 h-2 w-2 rounded-sm animate-confetti ${c.color}`}
                  style={{ left: `${c.left}%`, animationDelay: `${c.delay}ms` }}
                />
              ))}
            </div>
          )}
          <div className="animate-pop-in flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-emerald-950/95 p-6 text-center shadow-2xl ring-1 ring-white/10">
            <div className="text-5xl">{matchWon ? '🏆' : '📉'}</div>
            <div className="font-display text-2xl font-extrabold">{matchWon ? 'MATCH WON!' : 'MATCH LOST'}</div>
            <div className="text-white/70">
              You scored {goalsThisMatch}/{SHOTS_PER_MATCH} goals vs {round.opponent.name} (needed {round.opponent.requiredGoals})
            </div>
            {matchWon && state.isChampion && roundIndex === BRACKET.length - 1 && (
              <div className="text-amber-300 font-semibold">You're the World Cup Champion! 👑</div>
            )}
            <div className="flex w-full gap-3">
              {!matchWon && (
                <Button variant="secondary" className="flex-1" onClick={handleRetry}>
                  Retry
                </Button>
              )}
              <Button className="flex-1" onClick={onExit}>
                {matchWon ? 'Continue' : 'Back'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
