import { useRef, useState } from 'react';
import { asset } from '../asset.js';
import { burstFrom } from '../fx.js';
import { sfx } from '../sound.js';

/** A polaroid that flips over on tap, with the memory handwritten on the back. */
export default function FlipPolaroid({ src, alt, caption, memory, tilt = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);

  const toggle = () => {
    setFlipped((f) => !f);
    sfx.whoosh();
    setTimeout(() => sfx.flip(), 260);
    burstFrom(ref.current, { count: 10, spread: 110, size: [8, 16] }, 0.5, 0.45);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`flip ${flipped ? 'is-flipped' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
      onClick={toggle}
      aria-pressed={flipped}
      aria-label={flipped ? `${caption}: ${memory}. Tap to flip back.` : `${caption} — tap to read the memory on the back`}
      data-no-sparkle
    >
      <span className="flip__inner">
        <span className="flip__face flip__front polaroid" aria-hidden={flipped}>
          <span className="tape" aria-hidden="true" />
          <span className="polaroid__img">
            <img src={asset(src)} alt={alt} decoding="async" />
          </span>
          <span className="polaroid__caption">{caption}</span>
        </span>
        <span className="flip__face flip__back" aria-hidden={!flipped}>
          <span className="flip__memory">{memory}</span>
          <span className="flip__hint">tap to flip back ↺</span>
        </span>
      </span>
    </button>
  );
}
