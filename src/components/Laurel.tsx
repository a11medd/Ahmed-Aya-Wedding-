import { useMemo, type CSSProperties } from 'react';
import { useSafeId } from '../lib/shapes';

const LEAF = 'M0 0C3.8-4.6 4.6-11.4 0-18.5C-4.6-11.4-3.8-4.6 0 0Z';

interface Leaf {
  x: number;
  y: number;
  r: number;
  s: number;
}

function buildBranch(len: number, pairs: number, bend: number) {
  const pt = (t: number) => ({ x: 2 * (1 - t) * t * bend, y: -len * t });
  const deg = (t: number) => (Math.atan2(-len, 2 * bend * (1 - 2 * t)) * 180) / Math.PI + 90;
  const leaves: Leaf[] = [];
  for (let i = 0; i < pairs; i++) {
    const u = i / (pairs - 1);
    const s = 1.06 - u * 0.46;
    for (const side of [-1, 1]) {
      const t = 0.3 + u * 0.6 + (side > 0 ? 0.035 : 0);
      const p = pt(t);
      leaves.push({ x: p.x, y: p.y, r: deg(t) + side * 40, s: side > 0 ? s * 0.93 : s });
    }
  }
  const tip = pt(1);
  leaves.push({ x: tip.x, y: tip.y + 3, r: deg(1), s: 0.62 });
  return { stem: `M0 0Q${bend} ${-len / 2} 0 ${-len}`, leaves };
}

/**
 * Two engraved gold-leaf laurel branches fanning out from the flap tip,
 * following the flap edges. The foil gradient is continuous across the spray.
 */
export function LaurelSpray({ className, style, angle = 26, len = 106 }: { className?: string; style?: CSSProperties; angle?: number; len?: number }) {
  const id = useSafeId('laurel');
  const branch = useMemo(() => buildBranch(len, 6, -9), [len]);

  const shapes = (
    <>
      <path d={branch.stem} fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      {branch.leaves.map((l, i) => (
        <path key={i} d={LEAF} fill="#fff" transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.r.toFixed(1)}) scale(${l.s.toFixed(3)})`} />
      ))}
    </>
  );

  const veins = branch.leaves.map((l, i) => (
    <g key={i} transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.r.toFixed(1)}) scale(${l.s.toFixed(3)})`}>
      <path d={LEAF} fill="none" stroke="#3e2906" strokeOpacity="0.55" strokeWidth="0.5" />
      <path d="M0-1.8V-15.5" stroke="#4d340a" strokeOpacity="0.6" strokeWidth="0.55" strokeLinecap="round" />
    </g>
  ));

  return (
    <svg className={className} style={style} viewBox="-110 -130 220 135" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="-95" y1="-125" x2="95" y2="0">
          <stop offset="0" stopColor="#8d6a2b" />
          <stop offset="0.18" stopColor="#f3dc98" />
          <stop offset="0.36" stopColor="#b88e3f" />
          <stop offset="0.52" stopColor="#fff1c6" />
          <stop offset="0.7" stopColor="#a67c33" />
          <stop offset="0.86" stopColor="#ecd08b" />
          <stop offset="1" stopColor="#8a6628" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-110" y="-130" width="220" height="135">
          <g transform={`rotate(${-angle})`}>{shapes}</g>
          <g transform={`scale(-1 1) rotate(${-angle})`}>{shapes}</g>
        </mask>
        <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0.9" stdDeviation="0.7" floodColor="#000" floodOpacity="0.9" />
        </filter>
      </defs>
      <g filter={`url(#${id}-f)`}>
        <rect x="-110" y="-130" width="220" height="135" fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
      </g>
      <g transform={`rotate(${-angle})`}>{veins}</g>
      <g transform={`scale(-1 1) rotate(${-angle})`}>{veins}</g>
    </svg>
  );
}
