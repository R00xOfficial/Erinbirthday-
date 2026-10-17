import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, visible]. `visible` flips to true once, the first time the
 * element scrolls into view. Falls back to visible when IntersectionObserver
 * is unavailable so content never stays hidden.
 */
export function useReveal(options = { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisible(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return [ref, visible];
}
