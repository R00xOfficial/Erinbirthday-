import { useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import HeartBurst from '../components/HeartBurst.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';

export default function RelationshipQuiz({ questions, finalMessage, savedAnswers = [], onAnswer, onComplete, onRestart }) {
  const valid = savedAnswers.length <= questions.length ? savedAnswers : [];
  const [answers, setAnswers] = useState(valid);
  // `step` is the question on screen; it only advances when she taps "Next",
  // so she always gets to read the reaction first.
  const [step, setStep] = useState(valid.length);
  const [burst, setBurst] = useState(0);
  const done = step >= questions.length;
  const question = questions[step];
  const chosen = answers[step];

  const choose = (i) => {
    if (chosen !== undefined) return;
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    onAnswer?.(next);
    if (question.options[i].correct) setBurst(Date.now());
  };

  const advance = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= questions.length) {
      setBurst(Date.now());
      onComplete?.();
    }
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
    onRestart?.();
  };

  return (
    <GameCard className="quiz-card">
      <HeartBurst trigger={burst} count={done ? 20 : 8} />
      <ProgressIndicator
        total={questions.length}
        done={Math.min(answers.length, questions.length)}
        label={done ? 'All done!' : `Question ${step + 1} of ${questions.length}`}
      />

      {!done && (
        <div className="quiz" key={step}>
          <p className="quiz__q">{question.q}</p>
          <div className="quiz__options">
            {question.options.map((opt, i) => {
              const picked = chosen === i;
              const state =
                chosen === undefined ? '' : picked ? (opt.correct ? 'is-right' : 'is-picked') : opt.correct ? 'is-answer' : 'is-dim';
              return (
                <button
                  key={i}
                  type="button"
                  className={`quiz__opt ${state}`}
                  onClick={() => choose(i)}
                  aria-pressed={picked}
                  disabled={chosen !== undefined && !picked}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
          <div className="quiz__reaction" aria-live="polite">
            {chosen !== undefined && (
              <>
                <p className="handwritten reaction-text">{question.options[chosen].reaction}</p>
                <button type="button" className="btn" onClick={advance}>
                  {step + 1 < questions.length ? 'Next question' : 'See my result'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {done && (
        <div className="game-reward">
          <ol className="paper-trail" aria-label="Your answers">
            {questions.map((q, qi) => (
              <li key={qi} className="paper-note" style={{ '--tilt': `${qi % 2 ? 2 : -2}deg` }}>
                <span className="paper-note__q">{q.q}</span>
                <span className="paper-note__a">{q.options[answers[qi]]?.text ?? '—'}</span>
              </li>
            ))}
          </ol>
          <p className="handwritten reward-text">{finalMessage}</p>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Play again
          </button>
        </div>
      )}
    </GameCard>
  );
}
