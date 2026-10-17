import { useEffect, useRef, useState } from 'react';
import { Heart } from './Icons.jsx';
import { burstFrom, reducedMotion } from '../fx.js';
import { sfx } from '../sound.js';

const OPENING_MS = 650;

/**
 * A sealed envelope that opens on tap and unfolds the letter (children)
 * beneath it. Opening is staged: the envelope wobbles, the wax seal pops off
 * in a burst of hearts, then the flap opens and the letter writes itself in.
 * Controlled via `opened` / `onOpen` so the state can persist.
 */
export default function EnvelopeReveal({ opened, onOpen, onStart, label = 'tap to open', children, className = '' }) {
  const [opening, setOpening] = useState(false);
  const sealRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const open = () => {
    if (opened || opening) return;
    // Called synchronously inside the tap so phones allow audio to start.
    onStart?.();
    sfx.pop();
    setTimeout(() => sfx.paper(), 280);
    setTimeout(() => sfx.chime(5), 700);
    if (reducedMotion()) {
      onOpen?.();
      return;
    }
    setOpening(true);
    burstFrom(sealRef.current, { count: 22, spread: 130, size: [10, 24] });
    timer.current = setTimeout(() => {
      setOpening(false);
      onOpen?.();
    }, OPENING_MS);
  };

  const state = opened ? 'is-open' : opening ? 'is-opening' : '';
  return (
    <div className={`envelope-reveal ${state} ${className}`}>
      <button
        type="button"
        className="envelope"
        onClick={open}
        disabled={opened}
        aria-expanded={opened}
        aria-label={opened ? 'Envelope opened' : `Open the envelope (${label})`}
        data-no-sparkle
      >
        <span className="envelope__back" aria-hidden="true" />
        <span className="envelope__paper" aria-hidden="true" />
        <span className="envelope__front" aria-hidden="true" />
        <span className="envelope__flap" aria-hidden="true" />
        <span className="envelope__seal" ref={sealRef} aria-hidden="true">
          <Heart size={22} color="#fff" />
        </span>
      </button>
      {!opened && <p className="envelope__label">{label}</p>}
      {opened && <div className="letter">{children}</div>}
    </div>
  );
}
