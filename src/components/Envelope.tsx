import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import type { Geo } from '../lib/geometry';
import { useLang } from '../i18n';
import { InvitationCard } from './InvitationCard';
import { Flourish } from './Ornaments';
import { WaxSeal } from './WaxSeal';
import envelopeBack from '../assets/envelope-back.jpg';
import leftFlapImg from '../assets/envelope-left-flap.png';
import rightFlapImg from '../assets/envelope-right-flap.png';

export type Stage = 'sealed' | 'opening' | 'rising' | 'handoff' | 'settle' | 'done';

interface SceneProps {
  stage: Stage;
  geo: Geo;
  ready: boolean;
  onOpen: () => void;
  targetRef: RefObject<HTMLDivElement | null>;
}

export function EnvelopeScene({ stage, geo, ready, onOpen, targetRef }: SceneProps) {
  const { t } = useLang();
  const envRef = useRef<HTMLDivElement>(null);
  const [handoff, setHandoff] = useState<{ x: number; y: number } | null>(null);
  const { W, H, seal, sealTop, ctaTop, cardW, innerW, k, cardLeft, cardTop, rise, shift, drop } = geo;

  // Measure where the real card sits on the page early to avoid mid-animation layout thrashing
  useLayoutEffect(() => {
    const measure = () => {
      const env = envRef.current;
      const target = targetRef.current;
      if (!env || !target) return;
      const e = env.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      if (t.width > 0 && e.width > 0) {
        setHandoff({ x: t.left - e.left, y: t.top - e.top });
      }
    };
    measure();
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetRef, stage]);

  const late = stage === 'handoff' || stage === 'settle';
  let cardTransform = `translate3d(${cardLeft}px, ${cardTop}px, 0) scale(${k})`;
  if (stage === 'rising' || (late && !handoff)) {
    cardTransform = `translate3d(${cardLeft}px, ${cardTop - rise}px, 0) scale(${k * 1.02})`;
  }
  if (late && handoff) {
    cardTransform = `translate3d(${handoff.x}px, ${handoff.y}px, 0) scale(1)`;
  }

  const vars = {
    '--w': `${W}px`,
    '--h': `${H}px`,
    '--seal': `${seal}px`,
    '--seal-top': `${sealTop}px`,
    '--cta-top': `${ctaTop}px`,
    '--shift': `${shift}px`,
    '--drop': `${drop}px`,
  } as CSSProperties;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div className={`scene stage-${stage}${ready ? ' is-ready' : ''}`} style={vars} dir="ltr">
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
            {/* Ambient drop shadow */}
            <div className="env-shadow" />

            {/* Envelope Back / Interior */}
            <div className="env-back">
              <img src={envelopeBack} alt="" className="env-back__img" draggable={false} />
            </div>

            {/* The invitation card inside the envelope */}
            <div
              className="env-card-wrap"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                pointerEvents: 'none',
              }}
            >
              <div
                className="card-preview"
                style={{
                  transform: cardTransform,
                  width: cardW,
                  transformOrigin: 'top left',
                  transition:
                    stage === 'opening'
                      ? 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'transform 1.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: stage === 'sealed' ? 0 : 1,
                  willChange: 'transform, opacity',
                  pointerEvents: late ? 'auto' : 'none',
                }}
                aria-hidden="true"
              >
                <InvitationCard preview={true} />
              </div>
            </div>

            {/* LEFT FLAP */}
            <div className="env-gate-flap env-gate-flap--left" aria-hidden="true">
              <div className="env-gate-flap__face env-gate-flap__face--front">
                <img src={leftFlapImg} alt="" className="env-flap-art" draggable={false} />
              </div>
            </div>

            {/* RIGHT FLAP (with wax seal affixed) */}
            <div className="env-gate-flap env-gate-flap--right" aria-hidden="true">
              <div className="env-gate-flap__face env-gate-flap__face--front">
                <img src={rightFlapImg} alt="" className="env-flap-art" draggable={false} />
              </div>

              {/* Wax seal mounted directly ON the right flap */}
              <div className="flap-seal">
                <span className="seal-halo" />
                <span className="seal-burst" />
                <div className="seal-inner">
                  <WaxSeal />
                </div>
              </div>
            </div>

            {/* Soft light sheen */}
            <div className="env-sheen" aria-hidden="true">
              <span />
            </div>

            {/* CTA Prompt ("اضغط لفتح الدعوة") */}
            <div className="env-cta" aria-hidden="true">
              <span className="env-cta__fade lang-fade">
                <span className="env-cta__text">{t.cta}</span>
              </span>
              <Flourish className="env-cta__flourish" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
