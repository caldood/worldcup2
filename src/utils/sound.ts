let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface ToneOptions {
  freq: number;
  duration: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
  glideTo?: number;
}

function tone({ freq, duration, type = 'sine', delay = 0, gain = 0.18, glideTo }: ToneOptions) {
  const audio = getCtx();
  if (!audio) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sfx = {
  tap: () => tone({ freq: 520, duration: 0.06, type: 'square', gain: 0.12 }),
  lock: () => tone({ freq: 720, duration: 0.08, type: 'triangle', gain: 0.14 }),
  goal: () => {
    tone({ freq: 440, duration: 0.12, type: 'triangle' });
    tone({ freq: 660, duration: 0.18, delay: 0.1, type: 'triangle' });
  },
  great: () => {
    tone({ freq: 520, duration: 0.1, type: 'triangle' });
    tone({ freq: 780, duration: 0.12, delay: 0.09, type: 'triangle' });
    tone({ freq: 1040, duration: 0.2, delay: 0.18, type: 'triangle' });
  },
  topCorner: () => {
    [0, 0.08, 0.16, 0.24].forEach((delay, i) => {
      tone({ freq: 600 + i * 220, duration: 0.16, delay, type: 'triangle', gain: 0.16 });
    });
  },
  miss: () => tone({ freq: 220, duration: 0.3, type: 'sawtooth', gain: 0.14, glideTo: 80 }),
  drawdown: () => tone({ freq: 180, duration: 0.4, type: 'sawtooth', gain: 0.12, glideTo: 60 }),
  win: () => {
    [523, 659, 784, 1046].forEach((freq, i) => tone({ freq, duration: 0.22, delay: i * 0.12, type: 'triangle' }));
  },
  lose: () => {
    [392, 330, 261].forEach((freq, i) => tone({ freq, duration: 0.3, delay: i * 0.15, type: 'sawtooth', gain: 0.12 }));
  },
  unlock: () => {
    tone({ freq: 880, duration: 0.1, type: 'sine' });
    tone({ freq: 1320, duration: 0.18, delay: 0.1, type: 'sine' });
  },
};

export function primeAudio() {
  getCtx();
}
