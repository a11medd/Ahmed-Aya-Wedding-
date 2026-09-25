import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { HERO_VIDEO } from '../config';
import { mulberry32 } from '../lib/shapes';
import portrait from '../assets/couple-portrait.jpg';

/**
 * Behind the couple's names.
 *  • Default: an animated cinematic portrait of the bride & groom — slow
 *    camera push-in, a drifting golden light sweep and floating sparkles.
 *  • If HERO_VIDEO.url is set: that film plays instead (muted, looping, inline).
 * In the envelope preview only the still frame is shown.
 */
export function HeroVideo({ preview = false }: { preview?: boolean }) {
  if (HERO_VIDEO.url && !preview) return <CustomFilm url={HERO_VIDEO.url} />;
  return <CinematicPortrait still={preview} />;
}

function CinematicPortrait({ still }: { still: boolean }) {
  const sparkles = useMemo(() => {
    const r = mulberry32(27);
    return Array.from({ length: 16 }, () => ({
      left: 6 + r() * 88,
      top: 8 + r() * 62,
      size: 2 + r() * 3.5,
      dur: 3.2 + r() * 4,
      delay: -r() * 7,
      drift: -(10 + r() * 26),
    }));
  }, []);

  return (
    <div className={`hero-cine${still ? ' is-still' : ''}`} aria-hidden="true">
      <img className="hero-media hero-cine__img" src={portrait} alt="" draggable={false} />
      {!still && (
        <>
          <span className="hero-cine__sweep" />
          <span className="hero-cine__flare" />
          <span className="hero-cine__sparkles">
            {sparkles.map((p, i) => (
              <i
                key={i}
                style={
                  {
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    width: p.size,
                    height: p.size,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                    '--rise': `${p.drift}px`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        </>
      )}
    </div>
  );
}

function CustomFilm({ url }: { url: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch(() => undefined);
    tryPlay();
    const onTouch = () => tryPlay();
    window.addEventListener('touchstart', onTouch, { passive: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  return (
    <>
      <img className="hero-media" src={portrait} alt="" draggable={false} />
      <video
        ref={ref}
        className={`hero-media hero-media--video${playing ? ' is-playing' : ''}`}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
      />
    </>
  );
}
