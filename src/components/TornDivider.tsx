import { useMemo } from 'react';
import { mulberry32, useSafeId } from '../lib/shapes';

interface TornDividerProps {
  variant?: 1 | 2 | 3;
  className?: string;
}

/**
 * Generates an organic, hyper-realistic hand-torn paper edge path (deckled edge).
 * Combines gentle macro draping, medium tear angles, and micro-jagged paper fiber teeth.
 */
function generateTornPaths(seedNumber: number, width = 1200, height = 140) {
  const rnd = mulberry32(seedNumber);
  const numSteps = 160;
  const dx = width / numSteps;

  const points: Array<[number, number]> = [];
  const fiberPoints: Array<[number, number]> = [];

  // Random phase offsets for organic variation between variants
  const phase1 = rnd() * Math.PI * 2;
  const phase2 = rnd() * Math.PI * 2;
  const phase3 = rnd() * Math.PI * 2;

  for (let i = 0; i <= numSteps; i++) {
    const x = i * dx;
    const u = i / numSteps;

    // 1. Gentle macro curve across the paper sheet (amplitude ~6px)
    const macro =
      Math.sin(u * Math.PI * 2 + phase1) * 3.8 +
      Math.cos(u * Math.PI * 4 + phase2) * 2.2;

    // 2. Medium tear angle variations (amplitude ~3.5px)
    const medium =
      Math.sin(u * Math.PI * 11 + phase3) * 1.8 +
      Math.cos(u * Math.PI * 19 + phase1) * 1.4;

    // 3. Micro jagged tears & paper fiber rips (amplitude ~1.8px)
    const micro = (rnd() - 0.5) * 3.2;

    // Extra little fiber tuft every few points
    const tuft = rnd() > 0.85 ? (rnd() - 0.4) * 2.5 : 0;

    const baseY = 20 + macro + medium + micro + tuft;
    // Keep baseline safely within [10, 30]
    const clampedY = Math.max(10, Math.min(30, baseY));

    points.push([Number(x.toFixed(1)), Number(clampedY.toFixed(1))]);

    // Fiber fringe (exposed cotton pulp layer, sits 1.5 - 2.8px slightly higher and more ragged)
    const fiberY = Math.max(6, clampedY - 1.6 - rnd() * 2.0);
    fiberPoints.push([Number(x.toFixed(1)), Number(fiberY.toFixed(1))]);
  }

  // Build main paper polygon: starts bottom-left, goes up to first point,
  // follows torn edge to right, then down to bottom-right, and closes at bottom-left.
  let mainPath = `M 0,${height} L 0,${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    mainPath += ` L ${points[i][0]},${points[i][1]}`;
  }
  mainPath += ` L ${width},${height} Z`;

  // Build fiber fringe polygon (exposed torn pulp layer under/behind the tear)
  let fiberPath = `M 0,${height} L 0,${fiberPoints[0][1]}`;
  for (let i = 1; i < fiberPoints.length; i++) {
    fiberPath += ` L ${fiberPoints[i][0]},${fiberPoints[i][1]}`;
  }
  fiberPath += ` L ${width},${height} Z`;

  // Ragged stroke line along the very edge of the fiber rim
  let rimLine = `M 0,${fiberPoints[0][1]}`;
  for (let i = 1; i < fiberPoints.length; i++) {
    rimLine += ` L ${fiberPoints[i][0]},${fiberPoints[i][1]}`;
  }

  return { mainPath, fiberPath, rimLine };
}

const SEEDS: Record<number, number> = {
  1: 202711,
  2: 508492,
  3: 884719,
};

export function TornDivider({ variant = 1, className = '' }: TornDividerProps) {
  const gradId = useSafeId(`torn-fiber-${variant}`);
  const seed = SEEDS[variant] ?? SEEDS[1];
  const { mainPath, fiberPath, rimLine } = useMemo(
    () => generateTornPaths(seed, 1200, 140),
    [seed]
  );

  return (
    <div className={`torn-divider ${className}`} aria-hidden="true">
      <svg
        viewBox="0 -14 1200 78"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f7f0e3" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ebdcc5" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. Cotton pulp fiber fringe (slightly peeking out from behind the torn paper edge) */}
        <path
          d={fiberPath}
          fill={`url(#${gradId})`}
          className="torn-divider__fiber"
        />

        {/* 2. Micro frayed highlight along the fiber rim */}
        <path
          d={rimLine}
          fill="none"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="torn-divider__rim"
        />

        {/* 3. Main torn paper sheet matching the section background */}
        <path
          d={mainPath}
          className="torn-divider__main"
        />
      </svg>
    </div>
  );
}
