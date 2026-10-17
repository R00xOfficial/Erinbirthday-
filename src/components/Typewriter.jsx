import { useEffect, useState } from 'react';
import { reducedMotion } from '../fx.js';

/** Types `text` out a few characters at a time. Screen readers get the full text at once. */
export default function Typewriter({ text, speed = 22, className = '', as: Tag = 'p' }) {
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0));

  useEffect(() => {
    if (reducedMotion()) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <Tag className={`typewriter ${className}`} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <span className="typewriter__ghost" aria-hidden="true">
        {text.slice(n)}
      </span>
    </Tag>
  );
}
