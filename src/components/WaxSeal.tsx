import { useMemo } from 'react';
import { blobPath, useSafeId } from '../lib/shapes';

/**
 * Elegant ivory / cream wax seal with the original A & A monogram,
 * beaded ring and laurel embellishments — matching the white wax-seal
 * reference photograph.
 */
export function WaxSeal({ className = '', glint = true }: { className?: string; glint?: boolean }) {
  const uid = useSafeId('seal');
  const id = (s: string) => `${uid}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  const outer = useMemo(() => blobPath(100, 100, 91, 18, 11, 0.075), []);

  return (
    <div className={`wax-seal ${className}`}>
      <svg viewBox="0 0 200 200" className="wax-seal__svg" aria-hidden="true">
        <defs>
          {/* Beige wax body */}
          <radialGradient id={id('wax')} cx="36%" cy="30%" r="80%">
            <stop offset="0" stopColor="#f5e8d3" />
            <stop offset="0.16" stopColor="#e8d5b5" />
            <stop offset="0.42" stopColor="#d5b88c" />
            <stop offset="0.7" stopColor="#b89e7c" />
            <stop offset="1" stopColor="#8f7453" />
          </radialGradient>
          {/* Recessed well — warm beige */}
          <radialGradient id={id('well')} cx="62%" cy="66%" r="78%">
            <stop offset="0" stopColor="#e0c7a1" />
            <stop offset="0.5" stopColor="#cca97b" />
            <stop offset="1" stopColor="#a37c53" />
          </radialGradient>
          {/* Inner rim shadow */}
          <linearGradient id={id('rimIn')} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#8f7453" />
            <stop offset="0.55" stopColor="#cca97b" stopOpacity="0.5" />
            <stop offset="1" stopColor="#f5e8d3" />
          </linearGradient>
          {/* Outer rim highlight */}
          <linearGradient id={id('rimOut')} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#faf2e3" />
            <stop offset="0.5" stopColor="#d5b88c" stopOpacity="0.4" />
            <stop offset="1" stopColor="#a37c53" />
          </linearGradient>
          {/* Embossed element fill */}
          <linearGradient id={id('glyph')} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.38" stopColor="#f5e8d3" />
            <stop offset="0.72" stopColor="#b89e7c" />
            <stop offset="1" stopColor="#7a5532" />
          </linearGradient>

          {/* domed wax body with a soft specular hot-spot */}
          <filter id={id('dome')} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="7" specularConstant="0.75" specularExponent="18" lightingColor="#ffffff" result="spec">
              <fePointLight x="48" y="28" z="190" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
          </filter>

          {/* raised, embossed relief for the monogram + ring */}
          <filter id={id('emboss')} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="b" />
            <feSpecularLighting in="b" surfaceScale="2.8" specularConstant="1.2" specularExponent="14" lightingColor="#ffffff" result="s">
              <feDistantLight azimuth="225" elevation="42" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="si" />
            <feOffset in="SourceAlpha" dx="1.1" dy="1.6" result="o" />
            <feGaussianBlur in="o" stdDeviation="0.9" result="ob" />
            <feFlood floodColor="#705943" floodOpacity="0.8" />
            <feComposite in2="ob" operator="in" result="sh" />
            <feMerge>
              <feMergeNode in="sh" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="si" />
            </feMerge>
          </filter>

          <filter id={id('soft')} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" />
          </filter>

          <filter id={id('grain')} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <clipPath id={id('clip')}>
            <path d={outer} />
          </clipPath>
        </defs>

        {/* wax pool — cream base */}
        <path d={outer} fill={url('wax')} filter={url('dome')} />
        {/* subtle texture overlay */}
        <rect width="200" height="200" filter={url('grain')} clipPath={url('clip')} opacity="0.07" style={{ mixBlendMode: 'overlay' }} />

        {/* pushed-up lip around the stamp */}
        <circle cx="100" cy="100" r="75" fill="none" stroke={url('rimOut')} strokeWidth="3.2" filter={url('soft')} />
        {/* recessed stamp well */}
        <circle cx="100" cy="100" r="71" fill={url('well')} />
        <circle cx="100" cy="100" r="70" fill="none" stroke={url('rimIn')} strokeWidth="4" filter={url('soft')} />

        {/* beaded + engraved rings */}
        <g filter={url('emboss')}>
          <circle cx="100" cy="100" r="61.5" fill="none" stroke={url('glyph')} strokeWidth="2.6" strokeDasharray="0.01 5.35" strokeLinecap="round" />
          <circle cx="100" cy="100" r="55.5" fill="none" stroke={url('glyph')} strokeWidth="0.9" />
          
          {/* Top laurel embellishment matching photo */}
          <path
            d="M66 76 C76 65 124 65 134 76 M72 73 C71 68 76 66 80 70 M86 67 C87 62 93 62 95 67 M105 67 C107 62 113 62 114 67 M120 70 C124 66 129 68 128 73 M98 64 C100 60 102 60 102 64"
            fill="none"
            stroke={url('glyph')}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Bottom laurel embellishment matching photo */}
          <path
            d="M66 128 C76 139 124 139 134 128 M72 131 C71 136 76 138 80 134 M86 137 C87 142 93 142 95 137 M105 137 C107 142 113 142 114 137 M120 134 C124 138 129 136 128 131 M98 140 C100 144 102 144 102 140"
            fill="none"
            stroke={url('glyph')}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* intertwined monogram */}
        <g fill={url('glyph')} textAnchor="middle">
          <text x="76" y="113" fontSize="42" fontFamily="'Cinzel Decorative','Cinzel',serif" fontWeight="700" filter={url('emboss')}>
            A
          </text>
          <text x="124" y="113" fontSize="42" fontFamily="'Cinzel Decorative','Cinzel',serif" fontWeight="700" filter={url('emboss')}>
            A
          </text>
          <text
            x="100"
            y="117"
            fontSize="36"
            fontFamily="'Cormorant Garamond',serif"
            fontStyle="italic"
            fontWeight="600"
            stroke="#b8ad96"
            strokeWidth="1"
            paintOrder="stroke"
            filter={url('emboss')}
          >
            &amp;
          </text>
        </g>
      </svg>
      {glint && <span className="wax-seal__glint" aria-hidden="true" />}
    </div>
  );
}

/**
 * RSVP seal button — shaped like a wax seal in the envelope's dark maroon color.
 * Used for the "confirm attendance" button.
 */
export function RsvpSeal({ className = '', children, onClick, href }: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const uid = useSafeId('rsvp-seal');
  const id = (s: string) => `${uid}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  const outer = useMemo(() => blobPath(100, 100, 91, 18, 11, 0.075), []);

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: 'button' as const, onClick };

  return (
    <Tag className={`rsvp-seal ${className}`} {...linkProps as any}>
      <svg viewBox="0 0 200 200" className="rsvp-seal__svg" aria-hidden="true">
        <defs>
          {/* Dark maroon wax — exact match envelope color #400707 */}
          <radialGradient id={id('wax')} cx="36%" cy="30%" r="80%">
            <stop offset="0" stopColor="#5a0a0a" />
            <stop offset="0.16" stopColor="#4d0808" />
            <stop offset="0.42" stopColor="#400707" />
            <stop offset="0.7" stopColor="#300505" />
            <stop offset="1" stopColor="#1a0202" />
          </radialGradient>
          <radialGradient id={id('well')} cx="62%" cy="66%" r="78%">
            <stop offset="0" stopColor="#4a0808" />
            <stop offset="0.5" stopColor="#3b0606" />
            <stop offset="1" stopColor="#250303" />
          </radialGradient>
          <linearGradient id={id('rimIn')} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#1a0202" />
            <stop offset="0.55" stopColor="#300505" stopOpacity="0.5" />
            <stop offset="1" stopColor="#5a0a0a" />
          </linearGradient>
          <linearGradient id={id('rimOut')} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
            <stop offset="0" stopColor="#660b0b" />
            <stop offset="0.5" stopColor="#400707" stopOpacity="0.4" />
            <stop offset="1" stopColor="#1a0202" />
          </linearGradient>
          <linearGradient id={id('glyph')} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#730d0d" />
            <stop offset="0.38" stopColor="#5a0a0a" />
            <stop offset="0.72" stopColor="#400707" />
            <stop offset="1" stopColor="#250303" />
          </linearGradient>

          <filter id={id('dome')} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="7" specularConstant="0.6" specularExponent="18" lightingColor="#ffcece" result="spec">
              <fePointLight x="48" y="28" z="190" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
          </filter>

          <filter id={id('emboss')} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="b" />
            <feSpecularLighting in="b" surfaceScale="2.4" specularConstant="0.8" specularExponent="14" lightingColor="#ffdddd" result="s">
              <feDistantLight azimuth="225" elevation="42" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="si" />
            <feOffset in="SourceAlpha" dx="1.1" dy="1.6" result="o" />
            <feGaussianBlur in="o" stdDeviation="0.9" result="ob" />
            <feFlood floodColor="#0f0101" floodOpacity="0.72" />
            <feComposite in2="ob" operator="in" result="sh" />
            <feMerge>
              <feMergeNode in="sh" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="si" />
            </feMerge>
          </filter>

          <filter id={id('soft')} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" />
          </filter>

          <filter id={id('grain')} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <clipPath id={id('clip')}>
            <path d={outer} />
          </clipPath>
        </defs>

        {/* Maroon wax pool */}
        <path d={outer} fill={url('wax')} filter={url('dome')} />
        <rect width="200" height="200" filter={url('grain')} clipPath={url('clip')} opacity="0.1" style={{ mixBlendMode: 'overlay' }} />

        <circle cx="100" cy="100" r="75" fill="none" stroke={url('rimOut')} strokeWidth="3.2" filter={url('soft')} />
        <circle cx="100" cy="100" r="71" fill={url('well')} />
        <circle cx="100" cy="100" r="70" fill="none" stroke={url('rimIn')} strokeWidth="4" filter={url('soft')} />

        <g filter={url('emboss')}>
          <circle cx="100" cy="100" r="61" fill="none" stroke={url('glyph')} strokeWidth="1" />
          <circle cx="100" cy="100" r="58" fill="none" stroke={url('glyph')} strokeWidth="0.8" />
          <circle cx="100" cy="100" r="56" fill="none" stroke={url('glyph')} strokeWidth="0.5" />
        </g>
      </svg>
      <span className="rsvp-seal__content">{children}</span>
      <span className="rsvp-seal__glint" aria-hidden="true" />
    </Tag>
  );
}
