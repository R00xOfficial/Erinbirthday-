import { useEffect, useState } from 'react';
import { Heart } from './Icons.jsx';

const COLORS = ['#2B2226', '#F4A7BB', '#2B2226', '#C94F78', '#fff'];

/**
 * A short burst of hearts floating up. Re-triggers whenever `trigger` changes
 * to a new truthy value. Purely decorative.
 */
export default function HeartBurst({ trigger, count = 14 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: `${trigger}-${i}`,
        x: Math.random() * 100,
        drift: (Math.random() - 0.5) * 80,
        size: 12 + Math.random() * 18,
        delay: Math.random() * 300,
        color: COLORS[i % COLORS.length],
      }))
    );
    const t = setTimeout(() => setHearts([]), 2900);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!hearts.length) return null;
  return (
    <div className="burst" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="burst__heart"
          style={{ left: `${h.x}%`, '--drift': `${h.drift}px`, animationDelay: `${h.delay}ms` }}
        >
          <Heart size={h.size} color={h.color} />
        </span>
      ))}
    </div>
  );
}
