export function Heart({ size = 24, color = 'currentColor', className, title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path
        fill={color}
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}

export function Sparkle({ size = 16, color = 'currentColor', className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={color} d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z" />
    </svg>
  );
}

export function Flower({ size = 22, color = '#F4A7BB', className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} rx="4" ry="7" cy="-5.5" fill={color} transform={`rotate(${a})`} />
      ))}
      <circle r="3.4" fill="#FFF1C9" />
    </svg>
  );
}
