import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import type { Geo } from '../lib/geometry';
import { insetTrianglePoints } from '../lib/geometry';
import { useSafeId } from '../lib/shapes';
import { useLang } from '../i18n';
import { InvitationCard } from './InvitationCard';
import { LaurelSpray } from './Laurel';
import { Flourish, SpeakerIcon } from './Ornaments';
import { WaxSeal } from './WaxSeal';

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
  // Bottom flap pointing UP from bottom corners to a point hidden under the top flap (e.g. W/2, vTip - 20)
  const bottomTip = vTip - 30; 
  return (
    <svg className="pocket-art" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <filter id={`${id}-b6`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-b3`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <linearGradient id={`${id}-shadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* The base pocket paper is handled by the CSS background, we just add the shadows/seams here */}
      
      {/* Left side flap subtle shadow */}
      <polygon points={`0,0 ${W/2},${bottomTip} 0,${H}`} fill="#fff" fillOpacity="0.02" />
      {/* Right side flap subtle shadow */}
      <polygon points={`${W},0 ${W/2},${bottomTip} ${W},${H}`} fill="#000" fillOpacity="0.15" />

      {/* Bottom flap going UP over the side flaps */}
      <polygon points={`0,${H} ${W/2},${bottomTip} ${W},${H}`} fill={`url(#${id}-shadow)`} />
      
      {/* Crisp seams for the bottom flap edges */}
      <polyline points={`0,${H} ${W/2},${bottomTip} ${W},${H}`} fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points={`0,${H} ${W/2},${bottomTip} ${W},${H}`} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="3" filter={`url(#${id}-b3)`} strokeLinejoin="round" />

      {/* shadow cast by the closed top flap */}
      <polygon className="flap-cast" points={`0,-6 ${W},-6 ${W / 2},${flapH + 9}`} fill="#000" opacity="0.65" filter={`url(#${id}-b6)`} />
      <polyline className="flap-cast" points={`0,0 ${W / 2},${flapH + 2} ${W},0`} fill="none" stroke="#000" strokeOpacity="0.7" strokeWidth="3" filter={`url(#${id}-b3)`} />
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
      <polyline points={`0,-2 ${W / 2},${vTip - 3} ${W},-2`} fill="none" stroke="#140d03" strokeOpacity="0.55" strokeWidth="6" filter={`url(#${id})`} strokeLinejoin="round" />
    </svg>
  );
}

/** Shading and edge highlights on the top flap. */
function FlapArt({ W, flapH }: { W: number; flapH: number }) {
  const id = useSafeId('fl');
  return (
    <svg className="flap-art" width={W} height={flapH} viewBox={`0 0 ${W} ${flapH}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0202" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <polygon points={`0,0 ${W},0 ${W / 2},${flapH}`} fill={`url(#${id}-s)`} />
      <line x1="0" y1="0.6" x2={W} y2="0.6" stroke="#fff" strokeOpacity="0.1" strokeWidth="1.2" />
      <line x1="0" y1="0" x2={W / 2} y2={flapH} stroke="#fff" strokeOpacity="0.15" strokeWidth="1.6" />
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
  const maskId = useSafeId('mask');
  const pocketMask = `url(#${maskId}-pocket)`;
  const flapMask = `url(#${maskId}-flap)`;

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
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <mask id={`${maskId}-pocket`}>
            <polygon points={`0,0 ${W / 2},${vTip} ${W},0 ${W},${H} 0,${H}`} fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          </mask>
          <mask id={`${maskId}-flap`}>
            <polygon points={`0,0 ${W},0 ${W / 2},${flapH}`} fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          </mask>
        </defs>
      </svg>

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

            <div
              className="env-card-mask"
              style={{
                position: 'absolute',
                top: -3000,
                left: 0,
                width: W,
                height: H + 3000 - 4,
                zIndex: 2,
                overflow: (stage === 'handoff' || stage === 'settle') ? 'visible' : 'hidden',
                WebkitMaskImage: (stage === 'handoff' || stage === 'settle') ? 'none' : '-webkit-radial-gradient(white, black)',
                transform: 'translateZ(0)',
                pointerEvents: 'none'
              }}
            >
              <div
                className="card-preview"
                style={{
                  transform: cardTransform,
                  width: cardW,
                  transformOrigin: 'top left',
                  transition: 'transform 1.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'absolute',
                  top: 3000,
                  left: 0,
                  pointerEvents: 'auto'
                }}
                aria-hidden="true"
                onTransitionEnd={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (stage === 'rising') window.scrollTo(0, 0);
                }}
              >
                <InvitationCard />
              </div>
            </div>

            <PocketShadow W={W} H={H} vTip={vTip} />

            <div className="env-pocket">
              <div className="pocket-paper paper-obsidian" style={{ mask: pocketMask, WebkitMaskImage: pocketMask }}>
                <PocketArt W={W} H={H} flapH={flapH} vTip={vTip} />
              </div>
            </div>

            <div className="env-flap">
              <div className="flap-face flap-front paper-obsidian" style={{ mask: flapMask, WebkitMaskImage: flapMask }}>
                <FlapArt W={W} flapH={flapH} />
              </div>
              <div className="flap-face flap-back liner" style={{ mask: flapMask, WebkitMaskImage: flapMask }}>
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
