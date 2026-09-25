import { VERSE, VERSE_REF } from '../config';
import { useLang } from '../i18n';
import { HeroVideo } from './HeroVideo';
import { CornerFlourish, Divider } from './Ornaments';

/**
 * The ivory invitation card — gilded edge, ivory silk frame, gold-foil rules
 * and filigree corners. Order: couple names over a bride & groom film →
 * Quranic verse → Wedding Invitation greeting.
 * Rendered twice: inside the envelope (preview) and on the page, with identical
 * layout so the hand-off between them is seamless.
 */
export function InvitationCard({ preview = false }: { preview?: boolean }) {
  const { t, dir } = useLang();
  const Title = preview ? 'div' : 'h1';
  return (
    <article className={`card-gilt${preview ? ' is-preview' : ''}`} dir={dir}>
      <div className="card-silk">
        <div className="card-panel">
          <span className="card-rule card-rule--outer" aria-hidden="true" />
          <span className="card-rule card-rule--inner" aria-hidden="true" />
          <CornerFlourish className="corner corner--tl" />
          <CornerFlourish className="corner corner--tr" />
          <CornerFlourish className="corner corner--bl" />
          <CornerFlourish className="corner corner--br" />

          <div className="card-content">
            {/* ── Names over the film ── */}
            <div className="hero-frame">
              <div className="hero-window">
                <HeroVideo preview={preview} />
                <span className="hero-glow" aria-hidden="true" />
                <span className="hero-shade" aria-hidden="true" />
                <span className="hero-hairline" aria-hidden="true" />
                <div className="hero-text lang-fade">
                  <div className="hero-top">
                    <p className="hero-kicker">{t.hero.kicker}</p>
                    <Title className="hero-names hero-names--inline" aria-label={t.hero.namesAria}>
                      <span className="hero-name">{t.hero.groom}</span>
                      <span className="hero-amp" aria-hidden="true">
                        {t.hero.amp}
                      </span>
                      <span className="hero-name">{t.hero.bride}</span>
                    </Title>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Quranic verse ── */}
            <p className="verse" lang="ar" dir="rtl">
              <span>{VERSE}</span>
            </p>
            <p className="verse-ref" lang="ar" dir="rtl" aria-label={VERSE_REF}>
              {VERSE_REF.split('·').map((part, i) => (
                <span key={i} className="verse-ref__part">
                  {i > 0 && <span className="verse-ref__sep" aria-hidden="true" />}
                  {part.trim()}
                </span>
              ))}
            </p>

            <Divider className="card-divider" />

            {/* ── Wedding Invitation ── */}
            <div className="lang-fade">
              <h2 className="invite-title foil-ink">{t.invite.title}</h2>
              <p className="invite-salutation">{t.invite.salutation}</p>
              <p className="phrasing">{t.invite.message}</p>
            </div>

            <Divider className="card-divider card-divider--end" />
            <p className="card-monogram" aria-hidden="true" dir="ltr">
              A<i>&amp;</i>A
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
