import { Heart } from './Icons.jsx';

/** Row of little hearts that fill in as items are completed. */
export default function ProgressIndicator({ total, done, label }) {
  return (
    <div className="progress" role="status" aria-live="polite">
      <span className="progress__hearts" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <Heart key={i} size={18} className={i < done ? 'is-on' : ''} color={i < done ? '#C94F78' : '#F0D5DD'} />
        ))}
      </span>
      <span className="progress__label">{label}</span>
    </div>
  );
}
