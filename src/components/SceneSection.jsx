import Reveal from './Reveal.jsx';

export default function SceneSection({ id, eyebrow, title, intro, className = '', children }) {
  return (
    <section id={id} className={`scene ${className}`} aria-labelledby={title ? `${id}-title` : undefined}>
      {(eyebrow || title || intro) && (
        <Reveal className="scene__header">
          {eyebrow && <p className="scene__eyebrow">{eyebrow}</p>}
          {title && (
            <h2 id={`${id}-title`} className="scene__title">
              {title}
            </h2>
          )}
          {title && (
            <svg className="squiggle" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength="1" d="M2 8 C 20 2, 35 13, 55 7 S 90 2, 110 8 S 150 13, 170 6 S 192 5, 198 8" />
            </svg>
          )}
          {intro && <p className="scene__intro">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  );
}
