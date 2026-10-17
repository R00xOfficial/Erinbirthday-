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
          {intro && <p className="scene__intro">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  );
}
