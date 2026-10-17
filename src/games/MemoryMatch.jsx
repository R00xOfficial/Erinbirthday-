import { useEffect, useReducer, useRef, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import HeartBurst from '../components/HeartBurst.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import { Heart } from '../components/Icons.jsx';
import { asset } from '../asset.js';
import { burstFrom } from '../fx.js';
import { sfx } from '../sound.js';

const MISMATCH_DELAY = 900;

function shuffled(pairs) {
  const deck = pairs.flatMap((p) => [
    { key: `${p.id}-a`, pairId: p.id },
    { key: `${p.id}-b`, pairId: p.id },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// One reducer owns the whole board so a tap during the mismatch delay can
// never leave cards half-flipped or let a pair be matched twice.
function reducer(state, action) {
  switch (action.type) {
    case 'flip': {
      const i = action.index;
      const card = state.deck[i];
      if (state.locked || state.flipped.includes(i) || state.matched.includes(card.pairId)) return state;
      if (state.flipped.length === 0) return { ...state, flipped: [i] };
      const j = state.flipped[0];
      if (state.deck[j].pairId === card.pairId) {
        return { ...state, flipped: [], matched: [...state.matched, card.pairId], lastMatch: card.pairId };
      }
      return { ...state, flipped: [j, i], locked: true };
    }
    case 'hide':
      return { ...state, flipped: [], locked: false };
    case 'restart':
      return { deck: shuffled(action.pairs), flipped: [], matched: [], locked: false, lastMatch: null };
    default:
      return state;
  }
}

export default function MemoryMatch({ pairs, finalMessage, matchedPairs = [], onMatch, onRestart }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    deck: shuffled(pairs),
    flipped: [],
    // Restore saved matches, ignoring ids that no longer exist in the content.
    matched: matchedPairs.filter((id) => pairs.some((p) => p.id === id)),
    locked: false,
    lastMatch: null,
  }));
  const [burst, setBurst] = useState(0);
  const cardRefs = useRef([]);
  const byId = Object.fromEntries(pairs.map((p) => [p.id, p]));
  const done = state.matched.length === pairs.length;

  useEffect(() => {
    if (!state.locked) return;
    const s = setTimeout(() => sfx.bloop(), 380);
    const t = setTimeout(() => dispatch({ type: 'hide' }), MISMATCH_DELAY);
    return () => {
      clearTimeout(s);
      clearTimeout(t);
    };
  }, [state.locked]);

  useEffect(() => {
    if (!state.lastMatch) return;
    onMatch?.(state.lastMatch);
    setBurst(Date.now());
    if (state.matched.length === pairs.length) setTimeout(() => sfx.success(), 350);
    else setTimeout(() => sfx.chime(state.matched.length * 2), 250);
    // Hearts pop out of both matched cards once they've finished flipping.
    const t = setTimeout(() => {
      state.deck.forEach((card, i) => {
        if (card.pairId === state.lastMatch) burstFrom(cardRefs.current[i], { count: 12, spread: 70, size: [8, 18] });
      });
    }, 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lastMatch]);

  const latest = state.lastMatch && byId[state.lastMatch];

  return (
    <GameCard className="match-card">
      <HeartBurst trigger={burst} count={done ? 20 : 8} />
      <ProgressIndicator
        total={pairs.length}
        done={state.matched.length}
        label={done ? 'All pairs found!' : `${state.matched.length} of ${pairs.length} pairs`}
      />

      <div className="match-grid">
        {state.deck.map((card, i) => {
          const pair = byId[card.pairId];
          const isMatched = state.matched.includes(card.pairId);
          const faceUp = isMatched || state.flipped.includes(i);
          const isWrong = state.locked && state.flipped.includes(i);
          return (
            <button
              key={card.key}
              ref={(el) => (cardRefs.current[i] = el)}
              type="button"
              className={`mcard ${faceUp ? 'is-up' : ''} ${isMatched ? 'is-matched' : ''} ${isWrong ? 'is-wrong' : ''} ${done ? 'is-won' : ''}`}
              style={{ '--i': i }}
              onClick={() => {
                if (!state.locked && !faceUp) sfx.flip();
                dispatch({ type: 'flip', index: i });
              }}
              aria-label={faceUp ? pair.label : `Card ${i + 1}, face down`}
              aria-pressed={faceUp}
            >
              <span className="mcard__inner">
                <span className="mcard__back" aria-hidden="true">
                  <Heart size={22} color="#fff" />
                </span>
                <span className="mcard__front" aria-hidden="true">
                  {pair.src ? (
                    <img src={asset(pair.src)} alt="" loading="lazy" />
                  ) : (
                    <span className="mcard__emoji">{pair.emoji}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="match-memory" aria-live="polite">
        {done ? (
          <>
            <p className="handwritten reward-text">{finalMessage}</p>
            <ul className="memory-notes">
              {pairs.map((p) => (
                <li key={p.id} className="memory-note">
                  <strong>{p.label}</strong> {p.memory}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                dispatch({ type: 'restart', pairs });
                onRestart?.();
              }}
            >
              Play again
            </button>
          </>
        ) : latest ? (
          <p className="memory-note memory-note--pop" key={latest.id}>
            <strong>{latest.label}</strong> {latest.memory}
          </p>
        ) : (
          <p className="muted">Tap two cards to flip them.</p>
        )}
      </div>
    </GameCard>
  );
}
