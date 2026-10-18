import { useParallax } from '../parallax.js';

/** Wrapper that gives its children a gentle parallax drift. */
export default function Px({ speed = 0.1, max, className = '', children, as: Tag = 'div', ...rest }) {
  const ref = useParallax(speed, max);
  return (
    <Tag ref={ref} className={`px ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
