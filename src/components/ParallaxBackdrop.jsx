import { useEffect, useRef } from 'react';
import { registerLayer } from '../parallax.js';
import { Heart, Flower, Sparkle } from './Icons.jsx';

// Three depth layers behind everything. Each layer's art is drawn twice,
// stacked, so it can wrap seamlessly as she scrolls.
const FAR = [
  { x: 8, y: 6, s: 260, c: 'rgba(244,167,187,0.30)' },
  { x: 70, y: 22, s: 300, c: 'rgba(232,223,248,0.55)' },
  { x: 20, y: 48, s: 240, c: 'rgba(232,223,248,0.45)' },
  { x: 78, y: 66, s: 280, c: 'rgba(251,211,223,0.40)' },
  { x: 4, y: 84, s: 220, c: 'rgba(244,167,187,0.25)' },
];

const MID = [
  { k: 'flower', x: 6, y: 12, s: 34, r: -12 },
  { k: 'star', x: 88, y: 8, s: 22, r: 0 },
  { k: 'heart', x: 92, y: 34, s: 26, r: 14 },
  { k: 'flower', x: 3, y: 42, s: 26, r: 20 },
  { k: 'star', x: 12, y: 63, s: 18, r: 0 },
  { k: 'flower', x: 90, y: 58, s: 30, r: -8 },
  { k: 'heart', x: 6, y: 82, s: 22, r: -16 },
  { k: 'star', x: 86, y: 88, s: 20, r: 0 },
];

const NEAR = [
  { x: 95, y: 18, s: 14, c: '#2B2226' },
  { x: 2, y: 30, s: 12, c: '#F4A7BB' },
  { x: 94, y: 50, s: 10, c: '#C94F78' },
  { x: 3, y: 70, s: 14, c: '#2B2226' },
  { x: 93, y: 78, s: 12, c: '#F4A7BB' },
];

function Art({ kind }) {
  if (kind === 'far')
    return FAR.map((b, i) => (
      <span
        key={i}
        className="plx-blob"
        style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, background: `radial-gradient(circle, ${b.c}, transparent 70%)` }}
      />
    ));
  if (kind === 'mid')
    return MID.map((m, i) => (
      <span key={i} className="plx-doodle" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: `rotate(${m.r}deg)` }}>
        {m.k === 'flower' && <Flower size={m.s} color="#E8DFF8" />}
        {m.k === 'star' && <Sparkle size={m.s} color="#E3C77A" />}
        {m.k === 'heart' && <Heart size={m.s} color="#FBD3DF" />}
      </span>
    ));
  return NEAR.map((n, i) => (
    <span key={i} className="plx-near" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
      <Heart size={n.s} color={n.c} />
    </span>
  ));
}

function Layer({ kind, speed }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let unregister = () => {};
    const setup = () => {
      unregister();
      const h = Math.round(window.innerHeight * 1.6);
      el.style.setProperty('--tile', `${h}px`);
      unregister = registerLayer(el, speed, h);
    };
    setup();
    window.addEventListener('resize', setup);
    return () => {
      window.removeEventListener('resize', setup);
      unregister();
    };
  }, [speed]);
  return (
    <div className={`plx-layer plx-layer--${kind}`}>
      <div className="plx-track" ref={ref}>
        <div className="plx-tile">
          <Art kind={kind} />
        </div>
        <div className="plx-tile">
          <Art kind={kind} />
        </div>
      </div>
    </div>
  );
}

export default function ParallaxBackdrop() {
  return (
    <div className="plx" aria-hidden="true">
      <Layer kind="far" speed={0.12} />
      <Layer kind="mid" speed={0.32} />
      <Layer kind="near" speed={0.6} />
    </div>
  );
}
