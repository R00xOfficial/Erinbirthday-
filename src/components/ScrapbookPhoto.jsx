import { asset } from '../asset.js';

/**
 * A polaroid with a strip of tape and a handwritten caption.
 * Rendered as a button when `onClick` is provided.
 */
export default function ScrapbookPhoto({
  src,
  alt = '',
  caption,
  tilt = 0,
  tape = true,
  onClick,
  className = '',
  children,
  label,
  ...rest
}) {
  const Tag = onClick ? 'button' : 'figure';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`polaroid ${onClick ? 'polaroid--button' : ''} ${className}`}
      style={{ '--tilt': `${tilt}deg` }}
      onClick={onClick}
      aria-label={onClick ? label || caption || alt : undefined}
      {...rest}
    >
      {tape && <span className="tape" aria-hidden="true" />}
      <span className="polaroid__img">
        <img src={asset(src)} alt={onClick ? '' : alt} loading="lazy" decoding="async" />
      </span>
      {caption && <span className="polaroid__caption">{caption}</span>}
      {children}
    </Tag>
  );
}
