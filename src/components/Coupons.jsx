import { useEffect, useState } from 'react';
import Reveal from './Reveal.jsx';

const CONFIRM_WINDOW = 3500;

/**
 * Tear-off coupons. Tap once to arm, again to redeem (so a stray tap doesn't
 * use one up). Redeemed coupons get a stamp and stay redeemed via `redeemed`.
 */
export default function Coupons({ items, redeemed = {}, onRedeem, onUndo, redeemNote }) {
  const [armed, setArmed] = useState(null);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), CONFIRM_WINDOW);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <div className="coupons">
      {items.map((c, i) => {
        const usedOn = redeemed[c.id];
        const isArmed = armed === c.id;
        return (
          <Reveal key={c.id} delay={(i % 3) * 60}>
            <article className={`coupon ${usedOn ? 'is-redeemed' : ''}`} aria-label={`Coupon: ${c.title}`}>
              <div className="coupon__stub" aria-hidden="true">
                <span className="coupon__emoji">{c.emoji}</span>
              </div>
              <div className="coupon__body">
                <p className="coupon__kicker">valid for one</p>
                <h3 className="coupon__title">{c.title}</h3>
                {c.detail && <p className="coupon__detail">{c.detail}</p>}
                {usedOn ? (
                  <p className="coupon__used">
                    redeemed {usedOn} ·{' '}
                    <button type="button" className="coupon__undo" onClick={() => onUndo?.(c.id)}>
                      undo
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    className={`coupon__btn ${isArmed ? 'is-armed' : ''}`}
                    onClick={() => {
                      if (isArmed) {
                        setArmed(null);
                        onRedeem?.(c.id);
                      } else {
                        setArmed(c.id);
                      }
                    }}
                  >
                    {isArmed ? 'Tap again to redeem' : 'Use this coupon'}
                  </button>
                )}
              </div>
              {usedOn && (
                <span className="coupon__stamp" aria-hidden="true">
                  redeemed 🖤
                </span>
              )}
            </article>
            {usedOn && <p className="coupon__note">{redeemNote}</p>}
          </Reveal>
        );
      })}
    </div>
  );
}
