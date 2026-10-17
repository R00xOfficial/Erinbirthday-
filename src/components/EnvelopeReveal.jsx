import { Heart } from './Icons.jsx';

/**
 * A sealed envelope that opens on tap and unfolds the letter (children)
 * beneath it. Controlled via `opened` / `onOpen` so the state can persist.
 */
export default function EnvelopeReveal({ opened, onOpen, label = 'tap to open', children, className = '' }) {
  return (
    <div className={`envelope-reveal ${opened ? 'is-open' : ''} ${className}`}>
      <button
        type="button"
        className="envelope"
        onClick={onOpen}
        disabled={opened}
        aria-expanded={opened}
        aria-label={opened ? 'Envelope opened' : `Open the envelope (${label})`}
      >
        <span className="envelope__back" aria-hidden="true" />
        <span className="envelope__paper" aria-hidden="true" />
        <span className="envelope__front" aria-hidden="true" />
        <span className="envelope__flap" aria-hidden="true" />
        <span className="envelope__seal" aria-hidden="true">
          <Heart size={22} color="#fff" />
        </span>
      </button>
      {!opened && <p className="envelope__label">{label}</p>}
      {opened && <div className="letter">{children}</div>}
    </div>
  );
}
