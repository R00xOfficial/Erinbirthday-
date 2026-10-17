import { pauseSong, playSongFromStart, useSound } from '../sound.js';

/** "Our song" card on the last page — plays the song from the top. */
export default function SongCard({ song }) {
  const { playing } = useSound();
  return (
    <div className={`song-card ${playing ? 'is-playing' : ''}`}>
      <span className="song-card__disc" aria-hidden="true">
        <span className="song-card__label">🖤</span>
      </span>
      <span className="song-card__text">
        <span className="song-card__kicker">our song</span>
        <span className="song-card__title">{song.title}</span>
        <span className="song-card__artist">{song.artist}</span>
      </span>
      <button
        type="button"
        className="song-card__btn"
        onClick={() => (playing ? pauseSong() : playSongFromStart())}
        aria-label={playing ? 'Pause our song' : 'Play our song from the start'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      {song.spotifyId && (
        <a
          className="song-card__link"
          href={`https://open.spotify.com/track/${song.spotifyId}`}
          target="_blank"
          rel="noreferrer"
        >
          open in Spotify
        </a>
      )}
    </div>
  );
}
