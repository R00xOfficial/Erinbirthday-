// Sound for the site: our song in the background, plus little synthesised
// effects (no audio files needed). Phones only allow sound after a tap, so
// the music starts from the first envelope tap. One master switch mutes all.
import { useSyncExternalStore } from 'react';
import { asset } from './asset.js';

const PREF_KEY = 'erin-birthday-sound';
// The song file itself is mastered ~8 dB quieter (iPhones ignore element
// volume), so it sits under the sound effects on every device.
const MUSIC_VOLUME = 1;

let ctx = null;
let sfxBus = null;
let noiseBuf = null;
let enabled = readPref();
let music = null;
let musicStarted = false;
let ducked = false;
let fadeFrame = 0;
let snapshot = { enabled, playing: false };
const listeners = new Set();

function readPref() {
  try {
    return window.localStorage.getItem(PREF_KEY) !== 'off';
  } catch {
    return true;
  }
}

function notify() {
  snapshot = { enabled, playing: Boolean(music && !music.paused) };
  listeners.forEach((fn) => fn());
}

export function useSound() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => snapshot,
    () => snapshot
  );
}

// ── Audio context ─────────────────────────────────────────────────────────────
function getCtx() {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  ctx = new AC();
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 1.1;
  // Gentle limiter so overlapping effects never crackle.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 6;
  limiter.ratio.value = 8;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  sfxBus.connect(limiter).connect(ctx.destination);
  return ctx;
}

/** Resume audio on the first tap anywhere (browsers start it suspended). */
export function installAudioUnlock() {
  const unlock = () => {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
  };
  document.addEventListener('pointerdown', unlock, { passive: true });
  document.addEventListener('touchend', unlock, { passive: true });
  return () => {
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('touchend', unlock);
  };
}

// ── Music ─────────────────────────────────────────────────────────────────────
function musicEl() {
  if (!music) {
    music = new Audio(asset('audio/our-song.mp3'));
    music.loop = true;
    music.preload = 'auto';
    music.addEventListener('play', notify);
    music.addEventListener('pause', notify);
  }
  return music;
}

// iOS ignores element volume, so there the song simply starts/stops; elsewhere it fades.
function fadeTo(target, ms, done) {
  cancelAnimationFrame(fadeFrame);
  const a = musicEl();
  const from = a.volume;
  const start = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - start) / ms);
    try {
      a.volume = from + (target - from) * k;
    } catch {
      /* read-only on some platforms */
    }
    if (k < 1) fadeFrame = requestAnimationFrame(step);
    else done?.();
  };
  fadeFrame = requestAnimationFrame(step);
}

function playMusic() {
  const a = musicEl();
  const p = a.play();
  if (p?.catch) p.catch(() => notify());
  fadeTo(MUSIC_VOLUME, 2500);
}

/** Call from inside a tap handler. Starts the song once; later calls are ignored. */
export function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  if (!enabled) return;
  const a = musicEl();
  try {
    a.volume = 0;
  } catch {
    /* ignore */
  }
  playMusic();
}

/** Restart our song from the beginning (finale "play our song"). */
export function playSongFromStart() {
  musicStarted = true;
  if (!enabled) setEnabled(true);
  const a = musicEl();
  a.currentTime = 0;
  if (a.paused) playMusic();
}

export function pauseSong() {
  if (!music) return;
  fadeTo(0, 400, () => music.pause());
}

/** Quietly step aside while a video plays. */
export function duckMusic(on) {
  ducked = on;
  if (!music) return;
  if (on) fadeTo(0, 300, () => music.pause());
  else if (enabled && musicStarted) playMusic();
}

function setEnabled(on) {
  enabled = on;
  try {
    window.localStorage.setItem(PREF_KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  if (!on && music) fadeTo(0, 400, () => music.pause());
  if (on && musicStarted && !ducked) playMusic();
  notify();
}

export function toggleSound() {
  // Sound is on but the song hasn't started yet (e.g. a return visit):
  // this tap starts it rather than muting.
  if (enabled && (!musicStarted || (music && music.paused && !ducked))) {
    musicStarted = false;
    startMusic();
    notify();
    return;
  }
  musicStarted = true;
  setEnabled(!enabled);
}

/** On return visits the envelope is already open, so start the song on the first tap anywhere. */
export function startMusicOnFirstTap() {
  const go = (e) => {
    if (e.target.closest?.('.sound-toggle')) return; // the toggle handles itself
    document.removeEventListener('click', go, true);
    startMusic();
  };
  document.addEventListener('click', go, true);
  return () => document.removeEventListener('click', go, true);
}

// ── Synth helpers ─────────────────────────────────────────────────────────────
function ready() {
  if (!enabled) return null;
  const c = getCtx();
  if (!c) return null;
  if (c.state === 'suspended') c.resume().catch(() => {});
  return c;
}

function tone({ freq, to, type = 'sine', dur = 0.15, vol = 0.2, attack = 0.005, delay = 0 }) {
  const c = ready();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(sfxBus);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise({ dur = 0.2, vol = 0.2, freq = 1200, to, q = 1, type = 'bandpass', delay = 0, attack = 0.01 }) {
  const c = ready();
  if (!c) return;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
}

const NOTES = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093]; // C6 pentatonic-ish
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── The sound effects ─────────────────────────────────────────────────────────
export const sfx = {
  tick: () => tone({ freq: 1800, dur: 0.04, vol: 0.05 }),
  pop: () => {
    tone({ freq: 520, to: 1250, dur: 0.09, vol: 0.22 });
    noise({ dur: 0.03, vol: 0.06, freq: 3000 });
  },
  chime: (step = 0) => {
    const base = 880 * Math.pow(2, step / 12);
    tone({ freq: base, type: 'triangle', dur: 0.4, vol: 0.12 });
    tone({ freq: base * 1.26, type: 'triangle', dur: 0.45, vol: 0.1, delay: 0.07 });
  },
  sparkle: () => {
    for (let i = 0; i < 4; i++) tone({ freq: pick(NOTES) * 1.5, type: 'triangle', dur: 0.18, vol: 0.05, delay: i * 0.05 });
  },
  success: () => {
    [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.45, vol: 0.13, delay: i * 0.1 }));
    setTimeout(() => sfx.sparkle(), 420);
  },
  whoosh: () => noise({ dur: 0.38, vol: 0.18, freq: 350, to: 2600, q: 0.8, attack: 0.08 }),
  flip: () => {
    noise({ dur: 0.07, vol: 0.12, freq: 2500, type: 'highpass' });
    tone({ freq: 950, to: 620, dur: 0.06, vol: 0.06 });
  },
  slide: () => {
    noise({ dur: 0.09, vol: 0.12, freq: 900, to: 500, q: 2 });
    tone({ freq: 190, to: 150, dur: 0.06, vol: 0.12, delay: 0.05 });
  },
  shatter: () => {
    for (let i = 0; i < 9; i++) tone({ freq: 2000 + Math.random() * 2400, type: 'triangle', dur: 0.25, vol: 0.05, delay: i * 0.045 });
    noise({ dur: 0.25, vol: 0.08, freq: 5000, type: 'highpass' });
  },
  bloop: () => {
    tone({ freq: 420, to: 230, dur: 0.22, vol: 0.16 });
    tone({ freq: 330, to: 170, dur: 0.26, vol: 0.14, delay: 0.16 });
  },
  boing: () => {
    tone({ freq: 180, to: 520, dur: 0.14, vol: 0.16, type: 'triangle' });
    tone({ freq: 520, to: 140, dur: 0.3, vol: 0.14, type: 'triangle', delay: 0.13 });
  },
  thud: () => {
    tone({ freq: 150, to: 55, dur: 0.22, vol: 0.4 });
    noise({ dur: 0.1, vol: 0.25, freq: 700, type: 'lowpass' });
  },
  paper: () => {
    for (let i = 0; i < 5; i++) noise({ dur: 0.07, vol: 0.06, freq: 2500 + Math.random() * 3000, q: 0.6, delay: i * 0.06 });
  },
  shimmer: () => {
    for (let i = 0; i < 14; i++) tone({ freq: pick(NOTES) * (Math.random() < 0.5 ? 1 : 2), type: 'triangle', dur: 0.3, vol: 0.045, delay: i * 0.11 });
  },
  clipclop: () => {
    [0, 0.16, 0.32, 0.48].forEach((d, i) => {
      tone({ freq: i % 2 ? 620 : 820, to: 300, dur: 0.06, vol: 0.2, delay: d });
      noise({ dur: 0.03, vol: 0.08, freq: 2000, delay: d });
    });
  },
  /** A cartoon whinny: a rising squeal that wobbles down in pulses, then a snort. */
  neigh: () => {
    const c = ready();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(1150, t + 0.14);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.5);
    osc.frequency.exponentialRampToValueAtTime(380, t + 1.15);

    const vib = c.createOscillator();
    const vibDepth = c.createGain();
    vib.frequency.value = 17;
    vibDepth.gain.value = 70;
    vib.connect(vibDepth).connect(osc.frequency);

    const formant = c.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = 1300;
    formant.Q.value = 1.3;

    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(0.28, t + 0.06);
    amp.gain.setValueAtTime(0.28, t + 0.9);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    // "hee-hee-hee" pulsing
    const trem = c.createOscillator();
    const tremDepth = c.createGain();
    trem.frequency.value = 10;
    tremDepth.gain.setValueAtTime(0, t);
    tremDepth.gain.linearRampToValueAtTime(0.16, t + 0.35);
    trem.connect(tremDepth).connect(amp.gain);

    osc.connect(formant).connect(amp).connect(sfxBus);
    [osc, vib, trem].forEach((o) => {
      o.start(t);
      o.stop(t + 1.25);
    });
    noise({ dur: 0.22, vol: 0.28, freq: 450, q: 0.8, delay: 1.25, attack: 0.02 });
  },
};
