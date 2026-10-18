// One scroll loop drives every parallax element. Positions are all read
// first, then all transforms written, so scrolling never thrashes layout.
// Disabled entirely when reduced motion is on.
import { useEffect, useRef } from 'react';
import { reducedMotion } from './fx.js';

const items = new Map(); // el -> { speed, offset, max }
const layers = new Set(); // { el, speed, height }
let frame = 0;
let listening = false;

function update() {
  frame = 0;
  const vh = window.innerHeight;
  const mid = vh / 2;
  const reads = [];
  items.forEach((it, el) => {
    const r = el.getBoundingClientRect();
    const naturalTop = r.top - it.offset;
    // Skip work for things well off-screen.
    if (naturalTop > vh * 1.5 || naturalTop + r.height < -vh * 0.5) return reads.push([el, it, null]);
    const delta = naturalTop + r.height / 2 - mid;
    reads.push([el, it, Math.max(-it.max, Math.min(it.max, delta * it.speed))]);
  });
  for (const [el, it, y] of reads) {
    if (y === null || Math.abs(y - it.offset) < 0.3) continue;
    it.offset = y;
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  }
  const sy = window.scrollY;
  layers.forEach((l) => {
    const y = -((sy * l.speed) % l.height);
    l.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}

/** Ref for an element that drifts at `speed` relative to scroll (+ lags, − leads). */
export function useParallax(speed, max = 70) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    items.set(el, { speed, offset: 0, max });
    listen();
    schedule();
    return () => {
      items.delete(el);
      el.style.transform = '';
    };
  }, [speed, max]);
  return ref;
}

/** Register a repeating background layer that scrolls at `speed` and wraps every `height` px. */
export function registerLayer(el, speed, height) {
  if (!el || reducedMotion()) return () => {};
  const layer = { el, speed, height };
  layers.add(layer);
  listen();
  schedule();
  return () => layers.delete(layer);
}
