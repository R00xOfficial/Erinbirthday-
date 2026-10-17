import { Heart, Sparkle, Flower } from './Icons.jsx';

// A small, fixed set of drifting decorations — CSS-animated, no JS per frame.
const ITEMS = [
  { kind: 'heart', x: 6, size: 14, dur: 22, delay: 0 },
  { kind: 'sparkle', x: 18, size: 12, dur: 26, delay: 6 },
  { kind: 'flower', x: 30, size: 18, dur: 30, delay: 12 },
  { kind: 'heart', x: 44, size: 10, dur: 24, delay: 3 },
  { kind: 'sparkle', x: 57, size: 10, dur: 28, delay: 15 },
  { kind: 'heart', x: 68, size: 16, dur: 27, delay: 9 },
  { kind: 'flower', x: 80, size: 14, dur: 32, delay: 4 },
  { kind: 'heart', x: 91, size: 12, dur: 23, delay: 17 },
  { kind: 'sparkle', x: 36, size: 9, dur: 25, delay: 20 },
  { kind: 'heart', x: 74, size: 9, dur: 29, delay: 24 },
];

export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className="ambient__item"
          style={{ left: `${it.x}%`, animationDuration: `${it.dur}s`, animationDelay: `-${it.delay}s` }}
        >
          {it.kind === 'heart' && <Heart size={it.size} color="#F4A7BB" />}
          {it.kind === 'sparkle' && <Sparkle size={it.size} color="#E3C77A" />}
          {it.kind === 'flower' && <Flower size={it.size} color="#E8DFF8" />}
        </span>
      ))}
    </div>
  );
}
