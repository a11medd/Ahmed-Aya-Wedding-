import { useSafeId } from '../lib/shapes';
import './HeroReveal.css';

export function HeroReveal({ stage }: { stage: string }) {
  const active = stage !== 'sealed' && stage !== 'opening';
  const animating = stage === 'handoff' || stage === 'settle' || stage === 'done';
  
  return (
    <div className={`hero-reveal ${active ? 'is-active' : ''} ${animating ? 'is-animating' : ''}`} aria-hidden="true">
      <div className="hero-bg" />
      <div className="hero-monogram">
        <svg viewBox="0 0 200 200" className="hero-monogram-svg">
          {/* Double circle */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="#f0ead8" strokeWidth="1.5" className="hero-circle hero-circle-1" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="#f0ead8" strokeWidth="1" className="hero-circle hero-circle-2" />
          
          {/* A & A Monogram matching Wax Seal */}
          <g className="hero-letters" fill="#400707" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}>
            <text x="76" y="113" fontSize="42" fontFamily="'Cinzel Decorative','Cinzel',serif" fontWeight="700">
              A
            </text>
            <text x="124" y="113" fontSize="42" fontFamily="'Cinzel Decorative','Cinzel',serif" fontWeight="700">
              A
            </text>
            <text
              x="100"
              y="117"
              fontSize="36"
              fontFamily="'Cormorant Garamond',serif"
              fontStyle="italic"
              fontWeight="600"
            >
              &amp;
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
