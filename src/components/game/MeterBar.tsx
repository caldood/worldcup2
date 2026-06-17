import { useEffect, useRef } from 'react';

export interface Zone {
  /** Absolute position band on the 0-100 track */
  left: number;
  width: number;
  className: string;
}

interface MeterBarProps {
  /** Sweeps per second across the 0-100 range and back */
  speed: number;
  /** Color classes for the moving indicator */
  indicatorClassName: string;
  trackClassName: string;
  zones?: Zone[];
  lockedValue: number | null;
  active: boolean;
  onValueRef?: (getValue: () => number) => void;
}

/**
 * A horizontal bar with an indicator that ping-pongs between 0 and 100.
 * Animates via direct DOM mutation (not React state) so it stays smooth on mobile Safari.
 */
export function MeterBar({ speed, indicatorClassName, trackClassName, zones, lockedValue, active, onValueRef }: MeterBarProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsedSec = (now - startRef.current) / 1000;
      const phase = (elapsedSec * speed) % 1;
      const value = phase < 0.5 ? phase * 2 * 100 : (1 - phase) * 2 * 100;
      valueRef.current = value;
      if (indicatorRef.current) {
        indicatorRef.current.style.left = `${value}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, speed]);

  useEffect(() => {
    onValueRef?.(() => valueRef.current);
  }, [onValueRef]);

  const displayValue = lockedValue ?? 0;

  return (
    <div className={`relative h-5 w-full overflow-hidden rounded-full border-2 border-white/30 ${trackClassName}`}>
      {zones?.map((zone, i) => (
        <div
          key={i}
          className={`absolute top-0 h-full ${zone.className}`}
          style={{ left: `${zone.left}%`, width: `${zone.width}%` }}
        />
      ))}
      {lockedValue === null ? (
        <div
          ref={indicatorRef}
          className={`absolute top-0 h-full w-[3px] -translate-x-1/2 ${indicatorClassName}`}
          style={{ left: '0%' }}
        />
      ) : (
        <div
          className="absolute top-0 h-full w-[3px] -translate-x-1/2 bg-white shadow-[0_0_8px_white]"
          style={{ left: `${displayValue}%` }}
        />
      )}
    </div>
  );
}
