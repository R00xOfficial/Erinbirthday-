import { Suspense, useEffect, useRef, useState } from 'react';
import { Heart } from './Icons.jsx';

function Placeholder({ minHeight }) {
  return (
    <div className="lazy-ph" style={{ minHeight }} aria-hidden="true">
      <span className="lazy-ph__heart">
        <Heart size={26} color="#F4A7BB" />
      </span>
    </div>
  );
}

/**
 * Doesn't render (or download) its children until she scrolls near it.
 * A soft shimmering placeholder holds the space until then.
 */
export default function LazyMount({ minHeight = 420, margin = '700px', children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (show) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show, margin]);

  return (
    <div ref={ref} className={`lazy ${show ? 'is-loaded' : ''}`}>
      {show ? <Suspense fallback={<Placeholder minHeight={minHeight} />}>{children}</Suspense> : <Placeholder minHeight={minHeight} />}
    </div>
  );
}
