import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { asset } from '../asset.js';

/**
 * Full-screen photo viewer. Swipe or use the arrows to move through `photos`;
 * close with the button, Escape, or by tapping the backdrop.
 */
export default function PhotoLightbox({ photos, index, onIndex, onClose }) {
  const closeRef = useRef(null);
  const touch = useRef(null);
  const [dir, setDir] = useState(0);
  const open = index !== null && index >= 0 && index < photos.length;
  const count = photos.length;

  const go = useCallback(
    (delta) => {
      setDir(delta);
      onIndex((i) => (i + delta + count) % count);
    },
    [onIndex, count]
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, go]);

  if (!open) return null;
  const photo = photos[index];

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || 'Photo'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="Close photo">
        ×
      </button>
      <figure className={`lightbox__figure ${dir > 0 ? 'from-right' : dir < 0 ? 'from-left' : 'from-zoom'}`} key={index}>
        {photo.video ? (
          <video
            src={asset(photo.video)}
            poster={asset(photo.src)}
            controls
            playsInline
            preload="metadata"
            aria-label={photo.alt || photo.caption || 'Video'}
          />
        ) : (
          <img src={asset(photo.src)} alt={photo.alt || photo.caption || ''} />
        )}
        <figcaption>
          {photo.caption && <span className="lightbox__caption">{photo.caption}</span>}
          {photo.date && <span className="lightbox__date">{photo.date}</span>}
        </figcaption>
      </figure>
      {count > 1 && (
        <div className="lightbox__nav">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo">
            ‹
          </button>
          <span className="lightbox__count">
            {index + 1} / {count}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next photo">
            ›
          </button>
        </div>
      )}
    </div>,
    document.body
  );
}
