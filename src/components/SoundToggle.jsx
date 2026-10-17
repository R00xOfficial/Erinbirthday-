import { toggleSound, useSound } from '../sound.js';

/** Floating music/sound switch. Little equaliser bars dance while the song plays. */
export default function SoundToggle() {
  const { enabled, playing } = useSound();
  return (
    <button
      type="button"
      className={`sound-toggle ${enabled ? '' : 'is-off'} ${playing ? 'is-playing' : ''}`}
      onClick={toggleSound}
      aria-pressed={enabled}
      aria-label={enabled ? 'Sound on — tap to mute' : 'Sound off — tap to turn on'}
      data-no-sparkle
    >
      {enabled && playing ? (
        <span className="eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : (
        <span className="sound-toggle__icon" aria-hidden="true">
          {enabled ? '♪' : '🔇'}
        </span>
      )}
    </button>
  );
}
