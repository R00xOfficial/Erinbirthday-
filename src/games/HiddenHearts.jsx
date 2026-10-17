import { useEffect, useRef, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import HeartBurst from '../components/HeartBurst.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import ScrapbookPhoto from '../components/ScrapbookPhoto.jsx';
import { Heart } from '../components/Icons.jsx';
import { burstFrom } from '../fx.js';
import { sfx } from '../sound.js';

const HINT_AFTER = 9000;

const petals = (cx, cy, r, color) =>
  [0, 72, 144, 216, 288].map((a) => (
    <ellipse key={a} cx={cx} cy={cy - r * 0.7} rx={r * 0.45} ry={r * 0.8} fill={color} transform={`rotate(${a} ${cx} ${cy})`} />
  ));

/** The garden illustration (400×300). Hidden-heart spots line up with objects in it. */
function Garden({ neigh = 0 }) {
  return (
    <svg className="garden__art" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8DFF8" />
          <stop offset="1" stopColor="#FFE9EF" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#gsky)" />
      {/* sun */}
      <circle cx="52" cy="48" r="26" fill="#FFE7A3" />
      <circle cx="52" cy="48" r="36" fill="#FFE7A3" opacity=".35" />
      {/* clouds */}
      <g fill="#fff" className="g-cloud">
        <ellipse cx="296" cy="54" rx="42" ry="16" />
        <ellipse cx="312" cy="44" rx="26" ry="18" />
        <ellipse cx="280" cy="46" rx="20" ry="14" />
        <ellipse cx="170" cy="34" rx="28" ry="10" opacity=".8" />
      </g>
      {/* hills */}
      <path d="M0 190 Q100 140 210 180 T400 165 V300 H0Z" fill="#CBE8D9" />
      <path d="M0 225 Q120 195 240 222 T400 210 V300 H0Z" fill="#A6D8C2" />
      {/* tree */}
      <rect x="342" y="160" width="12" height="60" rx="4" fill="#9C7461" />
      <g className="g-sway g-tree">
        <circle cx="348" cy="138" r="34" fill="#7FC2A5" />
        <circle cx="326" cy="152" r="22" fill="#8CCBAF" />
        <circle cx="370" cy="154" r="22" fill="#8CCBAF" />
      </g>
      {/* bench */}
      <rect x="178" y="186" width="62" height="8" rx="3" fill="#B98670" />
      <rect x="178" y="176" width="62" height="6" rx="3" fill="#B98670" />
      <rect x="184" y="194" width="5" height="18" fill="#8F6656" />
      <rect x="229" y="194" width="5" height="18" fill="#8F6656" />
      {/* flowers */}
      {[
        [30, 252, '#F4A7BB'],
        [72, 228, '#C94F78'],
        [110, 262, '#E8DFF8'],
        [150, 240, '#F4A7BB'],
        [262, 258, '#C9B8EE'],
        [300, 236, '#F4A7BB'],
        [372, 262, '#C94F78'],
      ].map(([x, y, c], i) => (
        <g key={`${x}-${y}`} className="g-sway" style={{ animationDelay: `${-i * 0.7}s` }}>
          <rect x={x - 1.5} y={y} width="3" height="30" fill="#5FA584" />
          {petals(x, y, 9, c)}
          <circle cx={x} cy={y} r="4" fill="#FFF1C9" />
        </g>
      ))}
      {/* a very silly horse, for Erin */}
      <g transform="translate(92 128)">
        <g key={neigh} className={`g-horse ${neigh ? 'is-hopping' : ''}`}>
        <path className="g-tail" d="M14 34 q-14 6 -10 26" stroke="#4A3328" strokeWidth="5" strokeLinecap="round" fill="none" />
        {[18, 28, 52, 62].map((x) => (
          <g key={x}>
            <rect x={x} y="44" width="6" height="30" rx="2" fill="#B07F5A" />
            <rect x={x - 0.5} y="70" width="7" height="6" rx="1.5" fill="#3A2A24" />
          </g>
        ))}
        <ellipse cx="40" cy="40" rx="30" ry="15" fill="#C99A74" />
        <path d="M30 34 c-3 -4 -9 -2 -6 3 l6 6 l6 -6 c3 -5 -3 -7 -6 -3z" fill="#2B2226" />
        <path d="M58 36 L66 6 L80 10 L72 44 Z" fill="#C99A74" />
        <path d="M67 3 Q60 18 57 36" stroke="#4A3328" strokeWidth="6" strokeLinecap="round" fill="none" />
        <g className="g-head">
        <path d="M72 0 L74 -10 L79 -1 Z" fill="#B07F5A" />
        <ellipse cx="82" cy="10" rx="16" ry="10" transform="rotate(25 82 10)" fill="#C99A74" />
        <ellipse cx="92" cy="17" rx="8" ry="7" fill="#E2BFA0" />
        <circle cx="96" cy="14" r="1.2" fill="#3A2A24" />
        <circle cx="79" cy="4" r="5" fill="#fff" stroke="#2B2226" strokeWidth="1.2" />
        <circle cx="81" cy="6.5" r="2.2" fill="#2B2226" />
        <circle cx="88" cy="5" r="4" fill="#fff" stroke="#2B2226" strokeWidth="1.2" />
        <circle cx="86.5" cy="2.5" r="1.8" fill="#2B2226" />
        <path d="M89 25 q4 8 8 1" fill="#F4A7BB" />
        <rect x="85" y="19" width="13" height="6" rx="1.5" fill="#fff" stroke="#2B2226" strokeWidth="1" />
        <path d="M89.3 19 v6 M93.6 19 v6" stroke="#2B2226" strokeWidth="0.8" />
        </g>
        </g>
      </g>
      {/* tiny butterflies */}
      <g className="g-fly">
        <path className="g-wing" d="M150 92 q-8 -10 -2 -12 q4 0 2 12 q8 -10 12 -6 q0 6 -12 6" fill="#C9B8EE" />
      </g>
      <g className="g-fly g-fly--2">
        <path className="g-wing" d="M248 98 q-6 -8 -1 -9 q3 0 1 9 q6 -8 9 -5 q0 5 -9 5" fill="#F4A7BB" />
      </g>
    </svg>
  );
}

export default function HiddenHearts({ hearts, foundHearts = [], onFind, onRestart, rewardPhoto, rewardCaption }) {
  const [found, setFound] = useState(() => foundHearts.filter((id) => hearts.some((h) => h.id === id)));
  const [latest, setLatest] = useState(null);
  const [flying, setFlying] = useState([]);
  const [hintId, setHintId] = useState(null);
  const [burst, setBurst] = useState(0);
  const [neigh, setNeigh] = useState(0);
  const sceneRef = useRef(null);
  const counterRef = useRef(null);
  const done = found.length === hearts.length;

  // After a quiet spell, gently pulse near one undiscovered heart.
  useEffect(() => {
    setHintId(null);
    if (done) return;
    const t = setTimeout(() => {
      const next = hearts.find((h) => !found.includes(h.id));
      if (next) setHintId(next.id);
    }, HINT_AFTER);
    return () => clearTimeout(t);
  }, [found, hearts, done]);

  const collect = (heart, e) => {
    if (found.includes(heart.id)) return;
    const next = [...found, heart.id];
    setFound(next);
    setLatest(heart);
    onFind?.(heart.id);
    burstFrom(e.currentTarget, { count: 12, spread: 64, size: [7, 15] });
    sfx.pop();
    if (next.length === hearts.length) setTimeout(() => sfx.success(), 300);
    else setTimeout(() => sfx.chime(next.length * 2), 120);

    // Fly a copy of the heart up to the counter.
    const scene = sceneRef.current?.getBoundingClientRect();
    const counter = counterRef.current?.getBoundingClientRect();
    const from = e.currentTarget.getBoundingClientRect();
    if (scene && counter) {
      const fly = {
        id: heart.id,
        x: heart.x,
        y: heart.y,
        dx: counter.left + counter.width / 2 - (from.left + from.width / 2),
        dy: counter.top + counter.height / 2 - (from.top + from.height / 2),
      };
      setFlying((f) => [...f, fly]);
      setTimeout(() => setFlying((f) => f.filter((x) => x.id !== heart.id)), 900);
    }
    if (next.length === hearts.length) setBurst(Date.now());
  };

  const restart = () => {
    setFound([]);
    setLatest(null);
    onRestart?.();
  };

  return (
    <GameCard className="hearts-card">
      <HeartBurst trigger={burst} count={20} />
      <div ref={counterRef}>
        <ProgressIndicator
          total={hearts.length}
          done={found.length}
          label={done ? 'All hearts found!' : `${hearts.length - found.length} still hiding`}
        />
      </div>

      <div className="garden" ref={sceneRef}>
        <Garden neigh={neigh} />
        <button
          type="button"
          className="garden__horse"
          onClick={() => {
            setNeigh(Date.now());
            sfx.neigh();
            setTimeout(() => sfx.clipclop(), 150);
          }}
          aria-label="A very silly horse"
        />
        {neigh > 0 && (
          <span key={neigh} className="garden__neigh" role="status">
            neigh! 🐴
          </span>
        )}
        {hearts.map((h) => {
          const isFound = found.includes(h.id);
          return (
            <button
              key={h.id}
              type="button"
              className={`garden__heart ${isFound ? 'is-found' : ''} ${hintId === h.id ? 'is-hint' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={(e) => collect(h, e)}
              disabled={isFound}
              aria-label={isFound ? 'Heart found' : 'Hidden heart'}
            >
              <Heart size={isFound ? 20 : 13} color={isFound ? '#2B2226' : '#EBA3B8'} />
            </button>
          );
        })}
        {flying.map((f) => (
          <span
            key={f.id}
            className="garden__fly"
            style={{ left: `${f.x}%`, top: `${f.y}%`, '--dx': `${f.dx}px`, '--dy': `${f.dy}px` }}
            aria-hidden="true"
          >
            <Heart size={24} color="#2B2226" />
          </span>
        ))}
      </div>

      <div className="hearts-note" aria-live="polite">
        {done ? (
          <div className="game-reward">
            <ScrapbookPhoto src={rewardPhoto} alt="A funny photo of us" tilt={-3} className="reward-photo" />
            <p className="handwritten reward-text">{rewardCaption}</p>
            <ul className="memory-notes">
              {hearts.map((h) => (
                <li key={h.id} className="memory-note">
                  {h.note}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--ghost" onClick={restart}>
              Hide them again
            </button>
          </div>
        ) : latest ? (
          <p className="memory-note memory-note--pop" key={latest.id}>
            {latest.note}
          </p>
        ) : (
          <p className="muted">Look closely — inside flowers, behind clouds…</p>
        )}
      </div>
    </GameCard>
  );
}
