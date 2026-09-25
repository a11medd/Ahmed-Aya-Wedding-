import { useCallback, useEffect, useRef, useState } from 'react';
import { EnvelopeScene, type Stage } from './components/Envelope';
import { InvitationCard } from './components/InvitationCard';
import { Backdrop, Countdown, NamesDateVenue, Footer, Gratitude, Guidelines, LangToggle, MusicToggle, SaveTheDate, Schedule, Venue } from './components/Sections';
import { useLang } from './i18n';
import { useMusic } from './hooks/useMusic';
import { computeGeo, readViewport } from './lib/geometry';

/** Unboxing choreography: stage → next stage after N ms */
const NEXT: Partial<Record<Stage, Stage>> = { opening: 'rising', rising: 'handoff', handoff: 'settle', settle: 'done' };
const DURATION: Partial<Record<Stage, number>> = { opening: 1500, rising: 1550, handoff: 1250, settle: 520 };
const DURATION_REDUCED: Partial<Record<Stage, number>> = { opening: 250, rising: 250, handoff: 700, settle: 400 };

export default function App() {
  const [stage, setStage] = useState<Stage>('sealed');
  const [ready, setReady] = useState(false);
  const [geo, setGeo] = useState(() => computeGeo(readViewport()));
  const music = useMusic();
  const { t } = useLang();
  const pageCardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  // Fade the envelope in once the luxury typefaces are ready (with a safety timeout).
  useEffect(() => {
    let alive = true;
    const reveal = () => {
      if (alive) setReady(true);
    };
    const timer = window.setTimeout(reveal, 1800);
    document.fonts?.ready.then(() => window.setTimeout(reveal, 120)).catch(reveal);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  // Keep geometry responsive (but never mid-animation).
  useEffect(() => {
    const onResize = () => {
      if (stageRef.current === 'sealed' || stageRef.current === 'done') setGeo(computeGeo(readViewport()));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Advance through the stages.
  useEffect(() => {
    const next = NEXT[stage];
    if (!next) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = (reduce ? DURATION_REDUCED : DURATION)[stage] ?? 1000;
    const timer = window.setTimeout(() => setStage(next), ms);
    return () => window.clearTimeout(timer);
  }, [stage]);

  // Lock scrolling until the invitation is fully revealed.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', stage !== 'done');
    if (stage === 'rising') window.scrollTo(0, 0);
    if (stage === 'done') setGeo(computeGeo(readViewport()));
  }, [stage]);

  const open = useCallback(() => {
    if (stageRef.current !== 'sealed') return;
    music.start(); // inside the user gesture → allowed to play with sound
    setStage('opening');
    try {
      navigator.vibrate?.(14);
    } catch {
      /* haptics are optional */
    }
  }, [music]);

  const pageMounted = stage !== 'sealed';
  const pageVisible = stage === 'handoff' || stage === 'settle' || stage === 'done';

  return (
    <>
      <Backdrop />

      {pageMounted && (
        <main className={`page${pageVisible ? ' is-visible' : ''}`} aria-hidden={!pageVisible}>
          <p className="eyebrow-lux lang-fade">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">{t.invited}</span>
            <span className="eyebrow-line" />
          </p>

          <div ref={pageCardRef} className="page-card" style={{ width: geo.cardW }}>
            <InvitationCard />
          </div>

          <Countdown />
          <SaveTheDate />
          <Schedule />
          <Venue />
          <Guidelines />
          <Gratitude />
          <NamesDateVenue />
          <Footer />
        </main>
      )}

      {stage !== 'done' && <EnvelopeScene stage={stage} geo={geo} ready={ready} onOpen={open} targetRef={pageCardRef} />}

      <MusicToggle status={music.status} visible={stage !== 'sealed'} onToggle={music.toggle} />
      <LangToggle />
    </>
  );
}
