import { useSafeId } from '../lib/shapes';

type SvgProps = { className?: string };

/** Gold-foil flourish divider */
export function Divider({ className = '' }: SvgProps) {
  const id = useSafeId('dv');
  return (
    <svg className={className} viewBox="0 0 260 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-l`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#b8913f" stopOpacity="0" />
          <stop offset="1" stopColor="#b8913f" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#b8913f" stopOpacity="0" />
          <stop offset="1" stopColor="#b8913f" />
        </linearGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f6b2a" />
          <stop offset="0.35" stopColor="#f1d893" />
          <stop offset="0.6" stopColor="#a9803a" />
          <stop offset="1" stopColor="#e2c47c" />
        </linearGradient>
      </defs>
      <path d="M6 12H95" stroke={`url(#${id}-l)`} strokeWidth="0.9" />
      <path d="M165 12H254" stroke={`url(#${id}-r)`} strokeWidth="0.9" />
      <g fill={`url(#${id}-g)`}>
        <path d="M130 4.2 135.8 12 130 19.8 124.2 12Z" />
        <path d="M121 12C116 6.3 109 5.8 102.5 9.4 107.8 10 111.3 11 113.4 12 111.3 13 107.8 14 102.5 14.6 109 18.2 116 17.7 121 12Z" />
        <path d="M139 12C144 6.3 151 5.8 157.5 9.4 152.2 10 148.7 11 146.6 12 148.7 13 152.2 14 157.5 14.6 151 18.2 144 17.7 139 12Z" />
        <circle cx="98.5" cy="12" r="1.7" />
        <circle cx="161.5" cy="12" r="1.7" />
      </g>
      <circle cx="130" cy="12" r="1.5" fill="#f8f2e4" />
    </svg>
  );
}

/** Filigree ornament for the inner corners of the ivory card (top-left orientation). */
export function CornerFlourish({ className = '' }: SvgProps) {
  const id = useSafeId('cf');
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f6b2a" />
          <stop offset="0.35" stopColor="#e6cb86" />
          <stop offset="0.62" stopColor="#a8803a" />
          <stop offset="1" stopColor="#d6b76e" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 31C5 16.5 16.5 5 31 5" strokeWidth="0.95" />
        <path d="M12 22.5C12 16.5 16.5 12 22.5 12C26.6 12 28.2 15.4 26.3 17.6C24.6 19.5 21.6 18.4 22.3 16.2" strokeWidth="0.85" />
        <path d="M31 5C36 5 39.6 6.6 43 10" strokeWidth="0.7" />
        <path d="M5 31C5 36 6.6 39.6 10 43" strokeWidth="0.7" />
      </g>
      <g fill={`url(#${id})`}>
        <path d="M31.5 8.6C34.4 6.4 38.3 6.6 40.8 8.8 37.8 9.9 34.7 10.1 31.5 8.6Z" />
        <path d="M8.6 31.5C6.4 34.4 6.6 38.3 8.8 40.8 9.9 37.8 10.1 34.7 8.6 31.5Z" />
        <path d="M3 0.8 5.2 3 3 5.2 0.8 3Z" />
        <circle cx="44" cy="12" r="1" />
        <circle cx="12" cy="44" r="1" />
      </g>
    </svg>
  );
}

/** Thin hand-drawn flourish (inherits currentColor) */
export function Flourish({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 140 12" fill="none" aria-hidden="true">
      <path d="M2 6C28 6 44 1.5 70 6C96 10.5 112 6 138 6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M70 2.6 72.6 6 70 9.4 67.4 6Z" fill="currentColor" />
    </svg>
  );
}

export function PinIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21.5s-6.5-6.2-6.5-11.3A6.5 6.5 0 0 1 12 3.7a6.5 6.5 0 0 1 6.5 6.5c0 5.1-6.5 11.3-6.5 11.3Z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </svg>
  );
}

export function BowTieIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 10.2 3.6 6.9c-.7-.4-1.4.1-1.4.9v8.4c0 .8.7 1.3 1.4.9l6.4-3.3Z" />
      <path d="m14 10.2 6.4-3.3c.7-.4 1.4.1 1.4.9v8.4c0 .8-.7 1.3-1.4.9L14 13.8Z" />
      <rect x="10" y="9.5" width="4" height="5" rx="1.2" />
    </svg>
  );
}

export function WhatsAppIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.5a9.44 9.44 0 0 0-8.1 14.28L2.5 21.5l4.86-1.4A9.44 9.44 0 1 0 12.04 2.5Zm0 17.2a7.74 7.74 0 0 1-3.95-1.08l-.28-.17-2.88.83.85-2.8-.19-.29a7.76 7.76 0 1 1 6.45 3.51Z" />
      <path d="M16.3 13.9c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.73.91-.14.16-.27.18-.5.06-.23-.12-.98-.36-1.87-1.15-.69-.62-1.16-1.38-1.3-1.61-.13-.23-.01-.36.1-.47.11-.11.23-.27.35-.41.12-.14.16-.23.23-.39.08-.16.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.29c-.21.23-.82.8-.82 1.95s.84 2.26.96 2.42c.12.16 1.65 2.52 4 3.53.56.24 1 .39 1.34.5.56.18 1.07.15 1.48.09.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.27Z" />
    </svg>
  );
}

export function InstagramIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function SpeakerIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
      <path d="M18 6.5a7.8 7.8 0 0 1 0 11" />
    </svg>
  );
}

export function NoteIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3.2v11.3a2.6 2.6 0 1 1-1.6-2.4V7.3l-8 1.8v7.6A2.6 2.6 0 1 1 7.8 14.3V5.4L19 3.2Z" />
    </svg>
  );
}

/* ───────────── Symbol ornaments (❧ ✦ ◈ ♡) drawn as gold SVG ───────────── */

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9c7631" />
        <stop offset="0.35" stopColor="#f3dc9c" />
        <stop offset="0.62" stopColor="#b8913f" />
        <stop offset="1" stopColor="#ecd18a" />
      </linearGradient>
    </defs>
  );
}

/** ✦ four-point star */
export function StarMark({ className = '' }: SvgProps) {
  const id = useSafeId('st');
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <GoldDefs id={id} />
      <path d="M12 1.5C12.7 8 16 11.3 22.5 12 16 12.7 12.7 16 12 22.5 11.3 16 8 12.7 1.5 12 8 11.3 11.3 8 12 1.5Z" fill={`url(#${id})`} />
    </svg>
  );
}

/** ◈ diamond within a diamond */
export function DiamondMark({ className = '' }: SvgProps) {
  const id = useSafeId('dm');
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <GoldDefs id={id} />
      <path d="M12 1.8 22.2 12 12 22.2 1.8 12Z" fill="none" stroke={`url(#${id})`} strokeWidth="1.3" />
      <path d="M12 7 17 12 12 17 7 12Z" fill={`url(#${id})`} />
    </svg>
  );
}

/** ❧ ♡ ❧  or  ❧ ✦ ❧ — flanked by fading hairlines */
export function FleuronRow({ center = 'heart', className = '' }: SvgProps & { center?: 'heart' | 'star' }) {
  const id = useSafeId('fr');
  const g = `url(#${id})`;
  // A single ❧ (hedera leaf with curling stem), pointing right; mirrored for the left side.
  const fleuron = (
    <>
      <path d="M1 12.5C5 12.5 7.5 11 9.2 8.6" fill="none" stroke={g} strokeWidth="1" strokeLinecap="round" />
      <path d="M9.2 8.6C9.8 5.2 13.4 3.4 16.6 5.1 18.8 6.3 19.4 9.3 22.8 9.8 20.4 12.4 16.6 14.1 13.1 13.3 10.1 12.6 8.6 10.7 9.2 8.6Z" fill={g} />
      <path d="M11 10.6C13.5 9.4 16.4 9.1 19.6 9.6" fill="none" stroke="#1a1408" strokeOpacity="0.45" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M4.4 12.3C4 14.6 5.4 16.4 7.4 16.2 8.8 16 9.2 14.4 8.1 13.8" fill="none" stroke={g} strokeWidth="0.9" strokeLinecap="round" />
    </>
  );
  return (
    <svg className={className} viewBox="0 0 220 24" fill="none" aria-hidden="true">
      <GoldDefs id={id} />
      <defs>
        <linearGradient id={`${id}-l`} x1="0" x2="1">
          <stop offset="0" stopColor="#c9a45a" stopOpacity="0" />
          <stop offset="1" stopColor="#c9a45a" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M4 12H70" stroke={`url(#${id}-l)`} strokeWidth="0.8" />
      <path d="M216 12H150" stroke={`url(#${id}-l)`} strokeWidth="0.8" />
      <g transform="translate(96 0) scale(-1 1)">{fleuron}</g>
      <g transform="translate(124 0)">{fleuron}</g>
      {center === 'heart' ? (
        <path
          d="M110 17.6S103.9 13.8 103.9 9.7A3.25 3.25 0 0 1 110 8.1 3.25 3.25 0 0 1 116.1 9.7C116.1 13.8 110 17.6 110 17.6Z"
          stroke={g}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M110 4.5C110.4 9.2 112.8 11.6 117.5 12 112.8 12.4 110.4 14.8 110 19.5 109.6 14.8 107.2 12.4 102.5 12 107.2 11.6 109.6 9.2 110 4.5Z" fill={g} />
      )}
    </svg>
  );
}

/* ───────────── Guideline icons ───────────── */

export function GuidelineGlyph({ name, className = '' }: SvgProps & { name: 'gown' | 'no-white' | 'invitation' | 'adults' }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {name === 'gown' && (
        <>
          <path d="M9.4 2.8c.3 1.7 1.3 2.6 2.6 2.6s2.3-.9 2.6-2.6" />
          <path d="M9.4 2.8 8.6 7.4l1.2 1.9L6 20.6c2 .9 4 1.3 6 1.3s4-.4 6-1.3L14.2 9.3l1.2-1.9-.8-4.6" />
          <path d="M9.8 9.3h4.4" />
        </>
      )}
      {name === 'no-white' && (
        <>
          <circle cx="12" cy="12" r="9.2" />
          <path d="M10.2 6.6c.2 1 .8 1.5 1.8 1.5s1.6-.5 1.8-1.5M10.2 6.6l-.5 2.6.7 1-2.1 6.4c1.2.5 2.5.8 3.7.8s2.5-.3 3.7-.8l-2.1-6.4.7-1-.5-2.6" />
          <path d="M5.5 18.5 18.5 5.5" />
        </>
      )}
      {name === 'invitation' && (
        <>
          <rect x="2.8" y="5.8" width="18.4" height="13.2" rx="1.4" />
          <path d="m3.4 6.7 8.6 6.5 8.6-6.5" />
          <path d="M12 17.2s-2.3-1.4-2.3-3 1.6-1.9 2.3-.9c.7-1 2.3-.6 2.3.9s-2.3 3-2.3 3Z" fill="currentColor" stroke="none" />
        </>
      )}
      {name === 'adults' && (
        <>
          <g transform="rotate(-14 8 12)">
            <path d="M5.8 3h4.4l-.4 5.4a1.8 1.8 0 0 1-3.6 0Z" />
            <path d="M8 10.2V19M5.8 19h4.4" />
          </g>
          <g transform="rotate(14 16 12)">
            <path d="M13.8 3h4.4l-.4 5.4a1.8 1.8 0 0 1-3.6 0Z" />
            <path d="M16 10.2V19M13.8 19h4.4" />
          </g>
          <path d="M12 1.2v1.6M10.3 2.1l.8 1M13.7 2.1l-.8 1" />
        </>
      )}
    </svg>
  );
}

export function ClockIcon({ className = '' }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 2" />
    </svg>
  );
}
