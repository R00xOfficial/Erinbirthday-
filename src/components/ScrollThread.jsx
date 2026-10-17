import { useEffect, useRef } from 'react';
import { Heart } from './Icons.jsx';

/** A thin thread across the top of the screen with a heart travelling along it as she scrolls. */
export default function ScrollThread() {
  const fill = useRef(null);
  const heart = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      if (heart.current) heart.current.style.left = `calc(${p * 100}% - ${p * 16}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="thread" aria-hidden="true">
      <span className="thread__fill" ref={fill} />
      <span className="thread__heart" ref={heart}>
        <Heart size={16} color="#2B2226" />
      </span>
    </div>
  );
}
