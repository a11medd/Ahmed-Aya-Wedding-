import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DRESS_COLORS, EVENT, LINKS, MUSIC, whatsappUrl } from '../config';
import { useCountdown } from '../hooks/useCountdown';
import type { MusicStatus } from '../hooks/useMusic';
import { useLang } from '../i18n';
import { mulberry32 } from '../lib/shapes';
import { ClockIcon, DiamondMark, FleuronRow, GuidelineGlyph, NoteIcon, PinIcon, StarMark, WhatsAppIcon, InstagramIcon } from './Ornaments';
import { Reveal } from './Reveal';
import { WaxSeal } from './WaxSeal';

/* ───────────────────────── Backdrop ───────────────────────── */

export function Backdrop() {
  const dust = useMemo(() => {
    const r = mulberry32(2027);
    return Array.from({ length: 22 }, () => ({
      left: r() * 100,
      size: 1.2 + r() * 2.4,
      dur: 16 + r() * 18,
      delay: -r() * 34,
      drift: (r() - 0.5) * 90,
      o: 0.25 + r() * 0.6,
    }));
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__texture" />
      <div className="backdrop__spot" />
      <div className="backdrop__vignette" />
      <div className="dust">
        {dust.map((p, i) => (
          <span
            key={i}
            style={
              {
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                '--drift': `${p.drift}px`,
                '--o': p.o,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Shared heading ───────────────────────── */

function SectionHeading({ kicker, title, subtitle, ornament }: { kicker?: string; title: string; subtitle?: string; ornament?: ReactNode }) {
  return (
    <Reveal>
      {kicker && <p className="section-kicker">{kicker}</p>}
      <h2 className="section-title">
        <span className="foil-light">
          {title.split('&').map((part, i) => (
            <span key={i}>
              {i > 0 && <span className="amp-g">&amp;</span>}
              {part}
            </span>
          ))}
        </span>
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {ornament}
    </Reveal>
  );
}

/* ───────────────────────── The Big Day · Countdown ───────────────────────── */

export function Countdown() {
  const { t, num } = useLang();
  const c = t.countdown;
  const { days, hours, minutes, seconds, done } = useCountdown(EVENT.dateISO);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="section lang-fade" aria-label={c.aria}>
      <SectionHeading kicker={c.kicker} title={c.title} subtitle={c.subtitle} />

      <Reveal delay={120}>
        <div className="countdown-stage">
          <span className="orb orb--a" aria-hidden="true" />
          <span className="orb orb--b" aria-hidden="true" />
          {done ? (
            <p className="countdown-done foil-light">{c.done}</p>
          ) : (
            <div className="countdown-grid" role="timer" aria-live="off">
              {values.map((value, i) => (
                <div key={i} className="glass-tile">
                  <StarMark className="tile-star" />
                  <span key={value} className="tile-num">
                    {num(String(value).padStart(2, '0'))}
                  </span>
                  <span className="tile-label">{c.units[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={200}>
        <FleuronRow center="heart" className="fleuron-row" />
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Save The Date · Calendar ───────────────────────── */

export function SaveTheDate() {
  const { t, num } = useLang();
  const c = t.calendar;
  const { year, monthIndex, day } = EVENT.calendar;
  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const count = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    return [...Array<null>(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [year, monthIndex]);

  return (
    <section className="section lang-fade" aria-label={c.aria}>
      <SectionHeading title={c.title} ornament={<FleuronRow center="star" className="fleuron-row fleuron-row--tight" />} />

      <Reveal delay={120}>
        <div className="glass-panel calendar">
          <div className="calendar-head">
            <span className="calendar-month">{c.monthYear}</span>
          </div>
          <div className="calendar-grid" role="grid" aria-label={c.monthYear}>
            {c.weekdays.map((d) => (
              <span key={d} className="calendar-wd" role="columnheader">
                {d}
              </span>
            ))}
            {cells.map((n, i) =>
              n === null ? (
                <span key={`b${i}`} className="calendar-day is-blank" aria-hidden="true" />
              ) : (
                <span key={n} role="gridcell" className={`calendar-day${n === day ? ' is-wedding' : ''}`} aria-label={n === day ? c.weddingDay : undefined}>
                  {n === day && (
                    <svg className="calendar-heart" viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M20 34S5 25.2 5 15.2A7.6 7.6 0 0 1 20 11.4 7.6 7.6 0 0 1 35 15.2C35 25.2 20 34 20 34Z" />
                    </svg>
                  )}
                  <span className="calendar-num">{num(n)}</span>
                </span>
              ),
            )}
          </div>
          <p className="calendar-caption">{c.caption}</p>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <FleuronRow center="heart" className="fleuron-row" />
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Schedule ───────────────────────── */

export function Schedule() {
  const { t } = useLang();
  const s = t.schedule;
  return (
    <section className="section lang-fade" aria-label={s.aria}>
      <SectionHeading kicker={s.kicker} title={s.title} />

      <div className="timeline">
        {s.items.map((item, i) => (
          <Reveal key={i} delay={120 + i * 90}>
            <div className="timeline-item">
              <DiamondMark className="timeline-mark" />
              <p className="timeline-time">
                <span className="foil-light">{item.time}</span>
                <small>{item.meridiem}</small>
              </p>
              <p className="timeline-title">{item.title}</p>
              <p className="timeline-note">{item.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Venue ───────────────────────── */

export function Venue() {
  const { t } = useLang();
  const v = t.venue;
  return (
    <section className="section lang-fade" aria-label={v.aria}>
      <SectionHeading kicker={v.kicker} title={v.title} />

      <Reveal delay={120}>
        <div className="venue-arch">
          <div className="venue-arch__inner">
            <span className="venue-medallion" aria-hidden="true">
              <PinIcon className="venue-medallion__icon" />
            </span>
            <p className="venue-name">
              <span className="foil-light">{v.name}</span>
            </p>
            <FleuronRow center="star" className="venue-fleuron" />
            <p className="venue-meta">{v.date}</p>
            <p className="venue-meta venue-meta--time">
              <ClockIcon className="venue-meta__icon" />
              {v.time}
            </p>

            <a className="btn-foil venue-btn" href={LINKS.maps} target="_blank" rel="noopener noreferrer">
              <span className="btn-foil__inner">
                <PinIcon className="btn-foil__icon" />
                <span className="btn-foil__label">{v.button}</span>
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Good to Know ───────────────────────── */

const GUIDELINE_ICONS = ['gown', 'invitation', 'adults'] as const;

export function Guidelines() {
  const { t } = useLang();
  const g = t.guidelines;
  return (
    <section className="section lang-fade" aria-label={g.aria}>
      <SectionHeading kicker={g.kicker} title={g.title} subtitle={g.subtitle} />

      <div className="guidelines">
        {g.items.map((item, i) => (
          <Reveal key={i} delay={90 + i * 70}>
            <article className="glass-panel guideline">
              <span className="guideline-medallion" aria-hidden="true">
                <GuidelineGlyph name={GUIDELINE_ICONS[i] ?? 'invitation'} className="guideline-icon" />
              </span>
              <h3 className="guideline-title">{item.title}</h3>
              <p className="guideline-text">{item.text}</p>
              {i === 0 && (
                <ul className="swatches" aria-label={g.colorsAria}>
                  {DRESS_COLORS.map((c, ci) => (
                    <li key={ci} className="swatch">
                      <span className="swatch-chip" style={{ '--c': c.color, '--s': c.shade } as CSSProperties} />
                      <span className="swatch-name">{g.colors[ci]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── With Love & Gratitude ───────────────────────── */

export function Gratitude() {
  const { t } = useLang();
  const g = t.gratitude;
  return (
    <section className="section gratitude lang-fade" aria-label={g.aria}>
      <SectionHeading title={g.title} />
      <Reveal delay={100}>
        <div className="glass-panel gratitude-card">
          <p className="gratitude-text">{g.text}</p>
          <FleuronRow center="heart" className="fleuron-row fleuron-row--tight" />
        </div>
      </Reveal>

      <Reveal delay={180}>
        <a className="btn-foil btn-foil--solid rsvp-btn" href={whatsappUrl(g.whatsappMessage)} target="_blank" rel="noopener noreferrer">
          <span className="btn-foil__inner">
            <WhatsAppIcon className="btn-foil__icon" />
            <span className="btn-foil__label">{g.rsvp}</span>
          </span>
        </a>
        <p className="rsvp-note">{g.rsvpNote}</p>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Footer — names, date & venue ───────────────────────── */

export function NamesDateVenue() {
  const { t } = useLang();
  return (
    <section className="section footer-info lang-fade">
      <Reveal>
        <div className="footer-seal">
          <WaxSeal glint={false} />
        </div>
        <p className="footer-names">
          <span className="foil-light">{t.hero.groom}</span>
          <i>{t.hero.amp}</i>
          <span className="foil-light">{t.hero.bride}</span>
        </p>
        <p className="footer-date">{t.footer.date}</p>
        <p className="footer-venue">
          <PinIcon className="footer-venue__icon" />
          {t.venue.name}
        </p>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <section className="section footer lang-fade">
      <Reveal>
        <div className="footer-credits-section">
          <p className="footer-credits">{t.footer.credits}</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/a11med.osama?stkn=ZXA5anF3cTI4c3Bl&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="footer-social__icon" />
            </a>
            <a href="https://wa.me/201099561048" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon className="footer-social__icon" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Language toggle ───────────────────────── */

export function LangToggle() {
  const { t, lang, toggle } = useLang();
  const target = lang === 'en' ? 'ar' : 'en';
  return (
    <button type="button" className="lang-btn" onClick={toggle} aria-label={t.toggle.aria} lang={target}>
      <svg className="lang-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.8" />
        <path d="M3.4 12h17.2M12 3.2c2.4 2.4 3.6 5.4 3.6 8.8s-1.2 6.4-3.6 8.8M12 3.2C9.6 5.6 8.4 8.6 8.4 12s1.2 6.4 3.6 8.8" />
      </svg>
      <span className="lang-btn__label">{t.toggle.label}</span>
    </button>
  );
}

/* ───────────────────────── Music toggle ───────────────────────── */

export function MusicToggle({ status, visible, onToggle }: { status: MusicStatus; visible: boolean; onToggle: () => void }) {
  const { t } = useLang();
  const playing = status === 'playing';
  const [toast, setToast] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (!playing || shown.current) return;
    shown.current = true;
    setToast(true);
    const timer = window.setTimeout(() => setToast(false), 4200);
    return () => window.clearTimeout(timer);
  }, [playing]);

  return (
    <div className={`music${visible ? ' is-visible' : ''}`}>
      <span className={`music-toast${toast ? ' is-shown' : ''}`} role="status" lang="en">
        <NoteIcon className="music-toast__icon" />
        <span>
          {MUSIC.title} <em>— {MUSIC.artist}</em>
        </span>
      </span>
      <button
        type="button"
        className={`music-btn${playing ? ' is-playing' : ''}`}
        onClick={onToggle}
        aria-label={playing ? t.music.mute : t.music.play}
        aria-pressed={playing}
      >
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <svg className="music-slash" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19 19 5" />
        </svg>
      </button>
    </div>
  );
}
