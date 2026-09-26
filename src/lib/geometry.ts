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
  const vw = Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
  const vh = Math.round(window.visualViewport?.height || window.innerHeight);
  return { vw, vh };
}

export function computeGeo({ vw, vh }: { vw: number; vh: number }): Geo {
  // Mobile: full viewport screen (<= 600px width)
  const isMobile = vw <= 600;
  const W = isMobile ? vw : Math.round(Math.min(420, vw * 0.94));
  const H = isMobile ? vh : Math.round(Math.min(vh * 0.88, W * 1.72));

  // Deep Euro V-flap meeting gracefully near center on mobile
  const flapH = Math.round(H * (isMobile ? 0.50 : 0.55));
  const vTip = Math.round(H * (isMobile ? 0.44 : 0.48));

  // Wax seal proportions
  const seal = Math.round(Math.min(W * (isMobile ? 0.36 : 0.40), isMobile ? 140 : 150));
  const sealCY = flapH - Math.round(seal * 0.04);
  const sealTop = sealCY - Math.round(seal / 2);
  const ctaTop = Math.round(sealCY + seal / 2 + (isMobile ? 26 : H * 0.08));

  const cardW = Math.round(Math.max(240, Math.min(vw - 24, 520)));
  const innerW = Math.round(W * 0.92);
  const k = innerW / cardW;
  const cardLeft = Math.round((W - innerW) / 2);
  const cardTop = Math.round(H * (isMobile ? 0.03 : 0.04));
  const visH = H * 0.96 - cardTop;
  const cardHpx = Math.round(visH / k);
  // keep the bottom of the card hidden behind the pocket while it rises
  const rise = Math.round(Math.min(cardTop + visH - vTip - 6, H * (isMobile ? 0.42 : 0.50)));

  const envTop = (vh - H) / 2;
  const shift = Math.max(Math.round(H * 0.06), Math.round(rise - cardTop + 16 - envTop));
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
