import { useCallback, useEffect, useRef, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import HeartBurst from '../components/HeartBurst.jsx';
import { asset } from '../asset.js';
import { useReveal } from '../hooks/useReveal.js';
import { burstFrom, reducedMotion } from '../fx.js';

const SIZE = 3;
const BLANK = SIZE * SIZE - 1; // tile id 8 is the empty space
const SOLVED = Array.from({ length: SIZE * SIZE }, (_, i) => i);

const neighbours = (pos) => {
  const r = Math.floor(pos / SIZE);
  const c = pos % SIZE;
  const out = [];
  if (r > 0) out.push(pos - SIZE);
  if (r < SIZE - 1) out.push(pos + SIZE);
  if (c > 0) out.push(pos - 1);
  if (c < SIZE - 1) out.push(pos + 1);
  return out;
};

const isSolved = (tiles) => tiles.every((t, i) => t === i);

// History is the path of blank positions since the solved state. Stepping
// straight back cancels out, so the path stays short and reversing it always
// solves the board.
const pushPath = (path, pos) =>
  path.length >= 2 && path[path.length - 2] === pos ? path.slice(0, -1) : [...path, pos];

function slide(state, pos) {
  const blankPos = state.tiles.indexOf(BLANK);
  if (!neighbours(blankPos).includes(pos)) return state;
  const tiles = state.tiles.slice();
  [tiles[blankPos], tiles[pos]] = [tiles[pos], tiles[blankPos]];
  return { tiles, path: pushPath(state.path, pos) };
}

/**
 * Scramble by making random *legal* moves from the solved board, so the
 * puzzle is always solvable. Never undo the previous move, and never end solved.
 */
function scramble(moves) {
  let state = { tiles: SOLVED.slice(), path: [BLANK] };
  let prev = -1;
  let i = 0;
  while (i < moves || isSolved(state.tiles) || state.path.length < 12) {
    const blankPos = state.tiles.indexOf(BLANK);
    const options = neighbours(blankPos).filter((p) => p !== prev);
    const pick = options[Math.floor(Math.random() * options.length)];
    state = slide(state, pick);
    prev = blankPos;
    i++;
  }
  return state;
}

export default function SlidingPuzzle({ src, alt, caption, shuffleMoves = 80, complete, onComplete }) {
  const [board, setBoard] = useState(() =>
    complete ? { tiles: SOLVED.slice(), path: [BLANK] } : scramble(shuffleMoves)
  );
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [autoSolving, setAutoSolving] = useState(false);
  const [burst, setBurst] = useState(0);
  // The photo starts whole and shatters into tiles when it scrolls into view.
  const [intact, setIntact] = useState(!complete && !reducedMotion());
  const [shattering, setShattering] = useState(false);
  const [bump, setBump] = useState({ id: null, n: 0 });
  const [boardRef, boardVisible] = useReveal({ threshold: 0.45 });
  const solved = isSolved(board.tiles) && !intact;
  const reported = useRef(complete);

  useEffect(() => {
    if (!intact || !boardVisible) return;
    const t = setTimeout(() => {
      setShattering(true);
      setIntact(false);
    }, 650);
    return () => clearTimeout(t);
  }, [intact, boardVisible]);

  useEffect(() => {
    if (!shattering) return;
    const t = setTimeout(() => setShattering(false), 1300);
    return () => clearTimeout(t);
  }, [shattering]);

  useEffect(() => {
    if (solved && !reported.current) {
      reported.current = true;
      setAutoSolving(false);
      setBurst(Date.now());
      setTimeout(() => burstFrom(boardRef.current, { count: 36, spread: 200, size: [12, 28], duration: 1300 }), 350);
      onComplete?.();
    }
  }, [solved, onComplete]);

  // "Finish it for me": walk the recorded path back to the solved state.
  useEffect(() => {
    if (!autoSolving) return;
    const steps = board.path.length;
    const id = setInterval(() => {
      setBoard((b) => {
        if (b.path.length < 2) return b;
        return slide(b, b.path[b.path.length - 2]);
      });
    }, Math.max(45, Math.min(170, 5000 / steps)));
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSolving]);

  const tap = useCallback(
    (pos) => {
      if (solved || autoSolving || intact) return;
      const next = slide(board, pos);
      if (next === board) return;
      setBump((b) => ({ id: board.tiles[pos], n: b.n + 1 }));
      setBoard(next);
      setMoves((m) => m + 1);
    },
    [board, solved, autoSolving, intact]
  );

  const restart = () => {
    reported.current = false;
    setShattering(!reducedMotion());
    setBoard(scramble(shuffleMoves));
    setMoves(0);
    setPeek(false);
    setAutoSolving(false);
  };

  const blankPos = board.tiles.indexOf(BLANK);
  const movable = new Set(neighbours(blankPos));
  const img = asset(src);

  return (
    <GameCard className="puzzle-card">
      <HeartBurst trigger={burst} count={18} />
      <div className="puzzle__toolbar">
        <span className="pill" aria-live="polite">
          {solved ? 'Solved!' : `${moves} ${moves === 1 ? 'move' : 'moves'}`}
        </span>
        {!solved && (
          <span className="puzzle__tools">
            <button
              type="button"
              className={`chip ${peek ? 'is-on' : ''}`}
              aria-pressed={peek}
              onClick={() => setPeek((p) => !p)}
            >
              Peek
            </button>
            <button
              type="button"
              className={`chip ${numbers ? 'is-on' : ''}`}
              aria-pressed={numbers}
              onClick={() => setNumbers((n) => !n)}
            >
              Hint
            </button>
          </span>
        )}
      </div>

      <div
        ref={boardRef}
        className={`puzzle ${solved ? 'is-solved' : ''} ${intact ? 'is-intact' : ''} ${shattering ? 'is-shattering' : ''}`}
        role="group"
        aria-label={solved ? `${alt} — solved` : 'Sliding puzzle board'}
      >
        {SOLVED.map((id) => {
          const pos = intact ? id : board.tiles.indexOf(id);
          const r = Math.floor(pos / SIZE);
          const c = pos % SIZE;
          const hr = Math.floor(id / SIZE);
          const hc = id % SIZE;
          const isBlank = id === BLANK;
          const canMove = movable.has(pos) && !solved && !intact;
          const bumped = bump.id === id ? (bump.n % 2 ? 'bump-a' : 'bump-b') : '';
          return (
            <button
              key={id}
              type="button"
              className={`puzzle__tile ${isBlank ? 'is-blank' : ''} ${canMove ? 'can-move' : ''}`}
              style={{ transform: `translate(${c * 100}%, ${r * 100}%)`, '--d': `${(id * 7) % 9}` }}
              onClick={() => tap(pos)}
              tabIndex={isBlank || solved ? -1 : 0}
              aria-hidden={isBlank || undefined}
              aria-disabled={!canMove}
              aria-label={`Piece ${id + 1}${canMove ? ', can slide' : ''}`}
            >
              <span
                className={`puzzle__face ${bumped}`}
                style={{
                  backgroundImage: `url("${img}")`,
                  backgroundPosition: `${hc * 50}% ${hr * 50}%`,
                }}
              >
                {numbers && !isBlank && !solved && <span className="puzzle__num">{id + 1}</span>}
              </span>
            </button>
          );
        })}
        {peek && !solved && (
          <img className="puzzle__peek" src={img} alt="" aria-hidden="true" onClick={() => setPeek(false)} />
        )}
      </div>

      {solved ? (
        <div className="game-reward">
          <p className="handwritten reward-text">{caption}</p>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Play again
          </button>
        </div>
      ) : (
        <div className="puzzle__footer">
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Shuffle again
          </button>
          {moves >= 25 && (
            <button type="button" className="btn btn--soft" onClick={() => setAutoSolving(true)} disabled={autoSolving}>
              {autoSolving ? 'Putting us together…' : 'Finish it for me'}
            </button>
          )}
        </div>
      )}
    </GameCard>
  );
}
