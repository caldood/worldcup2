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
import type { ShotOutcome, ShotResult } from '../../types';

// Bands mirror the |accuracy-50| thresholds in computeShotResult: <=5 top corner, <=15 great, <=32 goal.
const ACCURACY_ZONES: Zone[] = [
  { left: 18, width: 17, className: 'bg-emerald-400/40' },
  { left: 65, width: 17, className: 'bg-emerald-400/40' },
  { left: 35, width: 10, className: 'bg-orange-400/50' },
  { left: 55, width: 10, className: 'bg-orange-400/50' },
  { left: 45, width: 10, className: 'bg-yellow-400/70' },
];

const POWER_ZONES: Zone[] = [{ left: 15, width: 82, className: 'bg-emerald-400/35' }];

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

  const powerGetter = useRef<() => number>(() => 0);
  const accuracyGetter = useRef<() => number>(() => 0);

  const ballEmoji = COSMETICS.find((c) => c.id === state.selectedCosmetics.ball)?.emoji ?? '⚽';
  const stadium = COSMETICS.find((c) => c.id === state.selectedCosmetics.stadium);

  const resetForNextShot = useCallback(() => {
    setLockedPower(null);
    setOutcome(null);
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
      setPhase('accuracy');
      return;
    }
    if (phase === 'accuracy' && lockedPower !== null) {
      const accuracy = accuracyGetter.current();
      const computed = resolveShot(state, lockedPower, accuracy);
      setOutcome(computed);
      dispatch({ type: 'TAKE_SHOT', power: lockedPower, accuracy });

      if (computed.result === 'topCorner') play(sfx.topCorner);
      else if (computed.result === 'great') play(sfx.great);
      else if (computed.result === 'goal') play(sfx.goal);
      else play(sfx.miss);

      const isGoal = computed.result !== 'miss';
      const newGoals = goalsThisMatch + (isGoal ? 1 : 0);
      setGoalsThisMatch(newGoals);
      setShotHistory((prev) => [...prev, computed.result]);
      setPhase('result');

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
  }, [phase, lockedPower, state, dispatch, goalsThisMatch, shotIndex, round.opponent.requiredGoals, resetForNextShot]);

  const handleRetry = () => {
    setShotIndex(0);
    setGoalsThisMatch(0);
    setShotHistory([]);
    setMatchWon(null);
    resetForNextShot();
  };

  const isPlayable = phase === 'power' || phase === 'accuracy';

  return (
    <div className={`relative flex h-full flex-col bg-gradient-to-b ${stadium?.preview ?? 'from-emerald-700 to-emerald-900'}`}>
      <div className="bg-black/25">
        <div className="flex items-center justify-between px-3 pt-2">
          <button onClick={onExit} className="rounded-full bg-black/30 px-3 py-1.5 text-sm font-semibold text-white/80 active:bg-black/50">
            ← Exit
          </button>
          <div className="text-xs font-bold uppercase tracking-wider text-white/70">{round.name}</div>
        </div>
        <PortfolioHUD portfolioValue={state.portfolioValue} streak={state.currentStreak} />
      </div>

      <div className="flex items-center justify-center gap-3 py-2 text-sm text-white/90">
        <span>
          {round.opponent.emoji} {round.opponent.name}
        </span>
        <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold">
          Need {round.opponent.requiredGoals}/{SHOTS_PER_MATCH} to win
        </span>
      </div>

      <div className="flex justify-center gap-2 pb-2">
        {Array.from({ length: SHOTS_PER_MATCH }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full border border-white/40 ${shotHistory[i] ? RESULT_DOT[shotHistory[i]] : 'bg-white/10'}`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <GoalFrame outcome={outcome} ballEmoji={ballEmoji} />

        <div className="w-full max-w-sm space-y-3">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-white/70">
            {phase === 'power' && 'Tap to set POWER'}
            {phase === 'accuracy' && 'Tap to set AIM'}
            {phase === 'result' && (outcome?.result !== 'miss' ? 'Nice strike!' : 'Better luck next shot')}
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

      {phase === 'result' && outcome && <ResultOverlay outcome={outcome} />}

      {phase === 'matchEnd' && matchWon !== null && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6">
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
