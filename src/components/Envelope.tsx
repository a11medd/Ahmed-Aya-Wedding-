import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import type { Geo } from '../lib/geometry';
import { insetTrianglePoints } from '../lib/geometry';
import { useSafeId } from '../lib/shapes';
import { useLang } from '../i18n';
import { InvitationCard } from './InvitationCard';
import { LaurelSpray } from './Laurel';
import { Flourish, SpeakerIcon } from './Ornaments';
import { WaxSeal } from './WaxSeal';
import handTop from '../assets/gloved-hand-top.png';
import handBottom from '../assets/gloved-hand-bottom.png';

export type Stage = 'sealed' | 'opening' | 'rising' | 'handoff' | 'settle' | 'done';

interface SceneProps {
  stage: Stage;
  geo: Geo;
  ready: boolean;
  onOpen: () => void;
  targetRef: RefObject<HTMLDivElement | null>;
}

/** Shading, seams and the cast shadow of the closed flap on the pocket. */
function PocketArt({ W, H, flapH, vTip }: { W: number; H: number; flapH: number; vTip: number }) {
  const id = useSafeId('pk');
  const curve = `M0 ${H}Q${W * 0.3} ${H * 0.64} ${W / 2} ${vTip}Q${W * 0.7} ${H * 0.64} ${W} ${H}`;
  const aboveCurve = `M0 0H${W}V${H}Q${W * 0.7} ${H * 0.64} ${W / 2} ${vTip}Q${W * 0.3} ${H * 0.64} 0 ${H}Z`;
  return (
    <svg className="pocket-art" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <filter id={`${id}-b6`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-b3`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <linearGradient id={`${id}-bf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`${id}-above`}>
          <path d={aboveCurve} />
        </clipPath>
      </defs>

      {/* side flaps: lit from the left */}
      <polygon points={`0,0 ${W / 2},${vTip} ${W / 2},${H} 0,${H}`} fill="#fff" fillOpacity="0.04" />
      <polygon points={`${W},0 ${W / 2},${vTip} ${W / 2},${H} ${W},${H}`} fill="#000" fillOpacity="0.28" />

      {/* soft shadow of the bottom flap edge onto the side flaps */}
      <g clipPath={`url(#${id}-above)`}>
        <path d={curve} fill="none" stroke="#180202" strokeOpacity="0.8" strokeWidth="7" filter={`url(#${id}-b3)`} />
      </g>
      {/* bottom flap tone + crisp paper edge */}
      <path d={`${curve}Z`} fill={`url(#${id}-bf)`} />
      <path d={curve} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="1" />

      {/* edges of the pocket opening */}
      <polyline points={`0,0 ${W / 2},${vTip} ${W},0`} fill="none" stroke="#fff" strokeOpacity="0.13" strokeWidth="1.4" />

      {/* shadow cast by the closed flap */}
      <polygon className="flap-cast" points={`0,-6 ${W},-6 ${W / 2},${flapH + 9}`} fill="#000" opacity="0.85" filter={`url(#${id}-b6)`} />
      <polyline className="flap-cast" points={`0,1 ${W / 2},${flapH + 2} ${W},1`} fill="none" stroke="#000" strokeOpacity="0.9" strokeWidth="3" filter={`url(#${id}-b3)`} />
    </svg>
  );
}

/** Thin shadow the pocket edge throws onto the card behind it. */
function PocketShadow({ W, H, vTip }: { W: number; H: number; vTip: number }) {
  const id = useSafeId('ps');
  return (
    <svg className="env-pocket-shadow" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <polyline points={`0,-2 ${W / 2},${vTip - 3} ${W},-2`} fill="none" stroke="#140d03" strokeOpacity="0.55" strokeWidth="6" filter={`url(#${id})`} />
    </svg>
  );
}

/** Shading, edge highlights and the gold-foil hairline on the top flap. */
function FlapArt({ W, flapH }: { W: number; flapH: number }) {
  const id = useSafeId('fl');
  const hairline = insetTrianglePoints(W, flapH, Math.max(7, W * 0.026));
  return (
    <svg className="flap-art" width={W} height={flapH} viewBox={`0 0 ${W} ${flapH}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0202" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2={flapH}>
          <stop offset="0" stopColor="#7d5c22" />
          <stop offset="0.22" stopColor="#f2da96" />
          <stop offset="0.45" stopColor="#a67d34" />
          <stop offset="0.62" stopColor="#fff0c0" />
          <stop offset="0.82" stopColor="#b08a3e" />
          <stop offset="1" stopColor="#e7ca84" />
        </linearGradient>
      </defs>
      <polygon points={`0,0 ${W},0 ${W / 2},${flapH}`} fill={`url(#${id}-s)`} />
      <polyline points={hairline} fill="none" stroke={`url(#${id}-g)`} strokeWidth="1.2" opacity="0.8" />
      <line x1="0" y1="0.6" x2={W} y2="0.6" stroke="#fff" strokeOpacity="0.1" strokeWidth="1.2" />
      <line x1="0" y1="0" x2={W / 2} y2={flapH} stroke="#fff" strokeOpacity="0.2" strokeWidth="1.6" />
      <line x1={W} y1="0" x2={W / 2} y2={flapH} stroke="#000" strokeOpacity="0.25" strokeWidth="1.6" />
    </svg>
  );
}

export function EnvelopeScene({ stage, geo, ready, onOpen, targetRef }: SceneProps) {
  const { t } = useLang();
  const envRef = useRef<HTMLDivElement>(null);
  const [handoff, setHandoff] = useState<{ x: number; y: number } | null>(null);
  const { W, H, flapH, vTip, seal, sealTop, ctaTop, cardW, innerW, k, cardLeft, cardTop, cardHpx, rise, shift, drop } = geo;

  // Measure where the real card sits on the page so the preview can glide onto it.
  useLayoutEffect(() => {
    if (stage !== 'handoff') return;
    const env = envRef.current;
    const target = targetRef.current;
    if (!env || !target) return;
    const e = env.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    setHandoff({ x: t.left - e.left, y: t.top - e.top });
  }, [stage, targetRef]);

  const late = stage === 'handoff' || stage === 'settle';
  let cardTransform = `translate3d(${cardLeft}px, ${cardTop}px, 0) scale(${k})`;
  if (stage === 'rising' || (late && !handoff)) {
    cardTransform = `translate3d(${cardLeft - innerW * 0.02}px, ${cardTop - rise}px, 0) scale(${k * 1.04})`;
  }
  if (late && handoff) cardTransform = `translate3d(${handoff.x}px, ${handoff.y}px, 0) scale(1)`;

  const vars = {
    '--w': `${W}px`,
    '--h': `${H}px`,
    '--flap-h': `${flapH}px`,
    '--seal': `${seal}px`,
    '--seal-top': `${sealTop}px`,
    '--cta-top': `${ctaTop}px`,
    '--shift': `${shift}px`,
    '--drop': `${drop}px`,
  } as CSSProperties;

  const pocketClip = `polygon(0px 0px, ${W / 2}px ${vTip}px, ${W}px 0px, ${W}px ${H}px, 0px ${H}px)`;
  const Lw = W * 0.8;
  const Lh = (Lw * 135) / 220;
  const laurelStyle: CSSProperties = { width: Lw, height: Lh, left: (W - Lw) / 2, top: sealTop + seal / 2 - (Lh * 130) / 135 };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div className={`scene stage-${stage}${ready ? ' is-ready' : ''}`} style={vars} dir="ltr">
      {/* Elegant eyebrow above envelope matching reference photo */}
      <p className="scene-eyebrow eyebrow-lux lang-fade" aria-hidden="true">
        <span className="eyebrow-line" />
        <span className="eyebrow-text">{t.invited}</span>
        <span className="eyebrow-line" />
      </p>

      <div className="env-float">
        <div className="env-shift">
          <div
            ref={envRef}
            className="envelope"
            role="button"
            tabIndex={stage === 'sealed' ? 0 : -1}
            aria-label={t.openAria}
            aria-disabled={stage !== 'sealed'}
            onClick={onOpen}
            onKeyDown={onKeyDown}
          >
            <div className="env-shadow" />

            <div className="env-back liner">
              <span className="env-back__depth" />
            </div>

            <div className="env-card-wrap" style={{ width: cardW, transform: cardTransform }} aria-hidden="true">
              <div className="env-card-focus" style={{ height: cardHpx }}>
                <InvitationCard preview />
              </div>
            </div>

            <PocketShadow W={W} H={H} vTip={vTip} />

            <div className="env-pocket">
              <div className="pocket-paper paper-obsidian" style={{ clipPath: pocketClip, WebkitClipPath: pocketClip }}>
                <PocketArt W={W} H={H} flapH={flapH} vTip={vTip} />
              </div>
            </div>

            <div className="env-flap">
              <div className="flap-face flap-front paper-obsidian">
                <FlapArt W={W} flapH={flapH} />
                <LaurelSpray className="flap-laurel" style={laurelStyle} />
              </div>
              <div className="flap-face flap-back liner">
                <span className="flap-back__shade" />
              </div>
              <div className="flap-seal">
                <span className="seal-halo" />
                <span className="seal-burst" />
                <div className="seal-inner">
                  <WaxSeal />
                </div>
              </div>
            </div>

            {/* White satin gloved hands holding the envelope */}
            <div className="env-hands" aria-hidden="true">
              <img src={handTop} alt="" className="env-hand env-hand--top" />
              <img src={handBottom} alt="" className="env-hand env-hand--bottom" />
            </div>

            <div className="env-sheen" aria-hidden="true">
              <span />
            </div>

            <div className="env-cta" aria-hidden="true">
              <span className="env-cta__fade lang-fade">
                <span className="env-cta__text">{t.cta}</span>
              </span>
              <Flourish className="env-cta__flourish" />
            </div>
          </div>
        </div>
      </div>

      <p className="scene-hint lang-fade">
        <SpeakerIcon className="scene-hint__icon" />
        <span>{t.soundHint}</span>
      </p>
    </div>
  );
}
