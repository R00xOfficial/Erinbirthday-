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

// Control icons — drawn, so they centre exactly (text glyphs sit differently per font/OS).
const ctl = (size, children) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
    {children}
  </svg>
);

export const PlayIcon = ({ size = 20 }) => ctl(size, <path fill="currentColor" d="M8.5 5.6v12.8c0 .8.9 1.3 1.6.8l9.4-6.4c.6-.4.6-1.2 0-1.6l-9.4-6.4c-.7-.5-1.6 0-1.6.8z" transform="translate(-1.2 0)" />);

export const PauseIcon = ({ size = 20 }) =>
  ctl(
    size,
    <>
      <rect x="6" y="5" width="4.2" height="14" rx="1.4" fill="currentColor" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.4" fill="currentColor" />
    </>
  );

export const NoteIcon = ({ size = 22 }) =>
  ctl(size, <path fill="currentColor" d="M18 3.2v11.3a3.2 3.2 0 1 1-1.8-2.9V7.4l-7.4 1.7v7.6a3.2 3.2 0 1 1-1.8-2.9V5.8c0-.5.3-.9.8-1l9.2-2.1c.5-.1 1 .3 1 .8z" />);

export const MuteIcon = ({ size = 22 }) =>
  ctl(
    size,
    <>
      <path fill="currentColor" d="M4 9.2h3.2L11.6 5c.5-.4 1.2-.1 1.2.6v12.8c0 .7-.7 1-1.2.6l-4.4-4.2H4c-.6 0-1-.4-1-1v-3.6c0-.6.4-1 1-1z" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  );

export const ChevronIcon = ({ size = 24, dir = 'right' }) =>
  ctl(
    size,
    <path
      d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

export const CloseIcon = ({ size = 22 }) =>
  ctl(size, <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />);
