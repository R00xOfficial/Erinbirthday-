/** Rounded card that frames each mini-game so it feels part of the page. */
export default function GameCard({ children, className = '' }) {
  return <div className={`game-card ${className}`}>{children}</div>;
}
