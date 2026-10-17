// Tiny particle engine for the little moments: hearts and sparkles that pop
// out of taps, matches and reveals. Plain DOM + Web Animations API, so bursts
// never re-render React. Everything is a no-op when reduced motion is on.

const HEART =
  '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>';
const SPARKLE =
  '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z"/></svg>';

const PALETTE = ['#2B2226', '#F4A7BB', '#C94F78', '#2B2226', '#E3C77A', '#FBD3DF'];

let layer = null;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function getLayer() {
  if (layer && document.body.contains(layer)) return layer;
  layer = document.createElement('div');
  layer.className = 'fx-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  return layer;
}

function particle(x, y, { size, color, shape }) {
  const el = document.createElement('span');
  el.className = 'fx-particle';
  el.style.left = `${x - size / 2}px`;
  el.style.top = `${y - size / 2}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.color = color;
  el.innerHTML = shape === 'sparkle' ? SPARKLE : HEART;
  getLayer().appendChild(el);
  return el;
}

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * Radial burst of hearts/sparkles from a viewport point.
 * opts: count, spread (px), size [min,max], colors, duration, gravity (px)
 */
export function burst(x, y, opts = {}) {
  if (reducedMotion() || typeof document === 'undefined') return;
  const {
    count = 12,
    spread = 90,
    size = [10, 22],
    colors = PALETTE,
    duration = 900,
    gravity = 40,
    sparkles = 0.35,
  } = opts;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.4, 0.4);
    const dist = rand(spread * 0.45, spread);
    const s = rand(size[0], size[1]);
    const el = particle(x, y, {
      size: s,
      color: colors[i % colors.length],
      shape: Math.random() < sparkles ? 'sparkle' : 'heart',
    });
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const rot = rand(-50, 50);
    const anim = el.animate(
      [
        { transform: 'translate(0,0) scale(0.2) rotate(0deg)', opacity: 0 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(1.15) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${dx}px, ${dy + gravity}px) scale(0.6) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: duration + rand(-150, 200), easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => el.remove();
  }
}

/** Burst from the centre of an element (or a fraction of its box). */
export function burstFrom(el, opts = {}, fx = 0.5, fy = 0.5) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width * fx, r.top + r.height * fy, opts);
}

/** Hearts drifting down over the whole screen, swaying as they fall. */
export function rain(count = 36, opts = {}) {
  if (reducedMotion() || typeof document === 'undefined') return;
  const { colors = PALETTE, size = [14, 30], duration = [2600, 4200] } = opts;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < count; i++) {
    const s = rand(size[0], size[1]);
    const el = particle(rand(0, w), -30, {
      size: s,
      color: colors[i % colors.length],
      shape: Math.random() < 0.2 ? 'sparkle' : 'heart',
    });
    const sway = rand(30, 80) * (Math.random() < 0.5 ? -1 : 1);
    const anim = el.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
        { transform: `translate(${sway}px, ${h * 0.35}px) rotate(${sway / 2}deg)`, opacity: 1, offset: 0.25 },
        { transform: `translate(${-sway}px, ${h * 0.7}px) rotate(${-sway / 2}deg)`, opacity: 1, offset: 0.7 },
        { transform: `translate(${sway / 2}px, ${h + 60}px) rotate(${sway}deg)`, opacity: 0 },
      ],
      { duration: rand(duration[0], duration[1]), delay: rand(0, 1400), easing: 'linear', fill: 'both' }
    );
    anim.onfinish = () => el.remove();
  }
}

/** Small sparkle puff wherever a button is pressed — gives every tap a little life. */
export function installTapSparkles() {
  if (typeof document === 'undefined') return () => {};
  const onDown = (e) => {
    const btn = e.target.closest?.('button');
    if (!btn || btn.disabled || btn.dataset.noSparkle !== undefined) return;
    burst(e.clientX, e.clientY, { count: 7, spread: 38, size: [6, 12], duration: 600, gravity: 8, sparkles: 0.6 });
  };
  document.addEventListener('pointerdown', onDown, { passive: true });
  return () => document.removeEventListener('pointerdown', onDown);
}
