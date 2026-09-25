/**
 * Envelope + card geometry. Everything is derived from the viewport so the
 * envelope is as large as possible on phones while never overflowing.
 */
export interface Geo {
  /** envelope width / height */
  W: number;
  H: number;
  /** depth of the triangular top flap */
  flapH: number;
  /** y of the V-shaped pocket opening tip */
  vTip: number;
  seal: number;
  sealTop: number;
  ctaTop: number;
  /** real width of the invitation card on the page */
  cardW: number;
  /** visual width of the card while it sits inside the envelope */
  innerW: number;
  /** scale factor card → envelope */
  k: number;
  cardLeft: number;
  cardTop: number;
  /** un-scaled height of the preview window of the card */
  cardHpx: number;
  /** how far the card slides up out of the pocket */
  rise: number;
  /** how far the envelope glides down while the flap opens */
  shift: number;
  /** distance the envelope falls away during the hand-off */
  drop: number;
}

export function readViewport() {
  const vw = document.documentElement.clientWidth || window.innerWidth;
  const vh = window.innerHeight;
  return { vw, vh };
}

export function computeGeo({ vw, vh }: { vw: number; vh: number }): Geo {
  // Horizontal rectangular envelope (ratio ~1.58) matching the reference photo
  const W = Math.round(Math.max(280, Math.min(vw * 0.92, 480, vh * 0.55 * 1.55)));
  const H = Math.round(W * 0.62);
  const flapH = Math.round(H * 0.56);
  const vTip = Math.round(H * 0.50);
  const seal = Math.round(Math.min(W * 0.22, 88));
  const sealCY = flapH - Math.round(seal * 0.04);
  const sealTop = sealCY - Math.round(seal / 2);
  const ctaTop = Math.round(sealCY + seal / 2 + H * 0.08);

  const cardW = Math.round(Math.min(vw - 24, 520));
  const innerW = Math.round(W * 0.92);
  const k = innerW / cardW;
  const cardLeft = Math.round((W - innerW) / 2);
  const cardTop = Math.round(H * 0.04);
  const visH = H * 0.96 - cardTop;
  const cardHpx = Math.round(visH / k);
  // keep the bottom of the card hidden behind the pocket while it rises
  const rise = Math.round(Math.min(cardTop + visH - vTip - 6, H * 0.65));

  const envTop = (vh - H) / 2;
  const shift = Math.max(Math.round(H * 0.08), Math.round(rise - cardTop + 20 - envTop));
  const drop = Math.round(vh * 0.95);

  return { W, H, flapH, vTip, seal, sealTop, ctaTop, cardW, innerW, k, cardLeft, cardTop, cardHpx, rise, shift, drop };
}

/**
 * Poly-line for a gold hairline running parallel to the two slanted edges of
 * the flap triangle (0,0) (W,0) (W/2,h), inset by `d` pixels.
 */
export function insetTrianglePoints(W: number, h: number, d: number) {
  const L = Math.hypot(W / 2, h);
  const nx = h / L;
  const ny = -(W / 2) / L;
  const t0 = (-d * ny) / h;
  const x0 = t0 * (W / 2) + d * nx;
  const t1 = (W / 2 - d * nx) / (W / 2);
  const yTip = t1 * h + d * ny;
  const f = (n: number) => n.toFixed(1);
  return `${f(x0)},0 ${f(W / 2)},${f(yTip)} ${f(W - x0)},0`;
}
