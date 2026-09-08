import { useLanguage } from "./useLanguage";
import { useCountdown } from "./useCountdown";
import { invitation, ui, type Language, type Text } from "./invitation";
import { HeroScene, CoupleFigures } from "./illustrations/Couple";
import { StoryScene } from "./illustrations/Story";
import { Calendar, DetailGlyph, DinnerTable, Flower, Rings, Sprig, Venue } from "./illustrations/Spots";
import { Rsvp } from "./Rsvp";
import "./styles.css";

const inv = invitation;

function Section({ id, title, children, className = "" }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`section ${className}`}>
      <h2 className="title"><span>{title}</span></h2>
      {children}
    </section>
  );
}

function Countdown({ lang }: { lang: Language }) {
  const t = ui[lang];
  const r = useCountdown(inv.dateISO);
  const fmt = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en", { minimumIntegerDigits: 2 });
  if (r.over) return <p className="today">{t.today}</p>;
  const tiles: [number, string][] = [[r.days, t.days], [r.hours, t.hours], [r.minutes, t.minutes], [r.seconds, t.seconds]];
  return (
    <div className="countdown" role="timer" aria-live="off">
      {tiles.map(([n, label]) => (
        <div className="tile" key={label}>
          <span className="num">{fmt.format(n)}</span>
          <span className="lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [lang, toggle] = useLanguage();
  const t = ui[lang];
  const L = (x: Text) => x[lang];

  return (
    <div className="page">
      <button type="button" className="lang" onClick={toggle} lang={lang === "en" ? "ar" : "en"} aria-label={t.switchTo}>
        {t.switchTo}
      </button>

      <header className="hero">
        <HeroScene className="hero-art" />
        <div className="hero-copy">
          <p className="hero-initials">{L(inv.couple.brideShort)} ♥ {L(inv.couple.groomShort)}</p>
          <p className="kicker">{t.kicker}</p>
          <h1 className="names">
            <span>{L(inv.couple.brideShort)}</span>
            <span className="amp">{t.amp}</span>
            <span>{L(inv.couple.groomShort)}</span>
          </h1>
          <p className="hero-date">{L(inv.dateShort)}</p>
          <p className="hero-venue">{L(inv.venue)} · {L(inv.time)}</p>
        </div>
        <a className="scroll-hint" href="#countdown">
          <span>{t.scrollHint}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M 5 9 L 12 16 L 19 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </header>

      <main>
        <Section id="countdown" title={t.countdown}>
          <p className="until">{t.until} {L(inv.dateBig)}</p>
          <Countdown lang={lang} />
          <Calendar className="spot" />
        </Section>

        <Section id="invitation" title={t.invitation} className="invite">
          <Sprig className="corner corner-tl" />
          <Sprig className="corner corner-br" flip />
          <p className="lead">{L(inv.invite.head)}</p>
          <p className="body">{L(inv.invite.body)}</p>
          <p className="fullnames">
            <span>{L(inv.couple.bride)}</span>
            <span className="amp">{t.amp}</span>
            <span>{L(inv.couple.groom)}</span>
          </p>
          <p className="body message">{L(inv.message)}</p>
        </Section>

        <Section id="date" title={t.theDate}>
          <Rings className="spot" />
          <p className="big-date">{L(inv.date)}</p>
          <div className="times">
            <div><span className="lbl">{t.doorsOpen}</span><span className="val">{L(inv.time)}</span></div>
            <div><span className="lbl">{t.entrance}</span><span className="val">{L(inv.entrance)}</span></div>
          </div>
        </Section>

        <Section id="venue" title={t.theCelebration}>
          <Venue className="spot spot-wide" />
          <div className="card venue-card">
            <p className="venue-kicker">{t.theVenue}</p>
            <p className="venue-name">{L(inv.venue)}</p>
            <p className="venue-loc">{L(inv.location)}</p>
            <p className="venue-time">{L(inv.date)} · {L(inv.time)}</p>
            <a className="btn" href={inv.mapUrl} target="_blank" rel="noopener noreferrer">{t.mapButton}</a>
          </div>
          <DinnerTable className="spot spot-wide" />
          <p className="dinner">{L(inv.dinner)}</p>
        </Section>

        <Section id="details" title={t.theDetails}>
          <ul className="details">
            {inv.details.map((d) => (
              <li key={d.icon}>
                <DetailGlyph icon={d.icon} className="glyph" />
                <div>
                  <span className="lbl">{L(d.label)}</span>
                  <span className="val">{L(d.value)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="story" title={t.ourStory}>
          <StoryScene className="story-art" />
          <p className="body story">{L(inv.story)}</p>
        </Section>

        <Section id="rsvp" title={t.rsvp}>
          <p className="lead">{L(inv.rsvpPlate.head)}</p>
          <p className="body">{L(inv.rsvpPlate.body)}</p>
          <p className="body">{t.rsvpBody}</p>
          <Rsvp lang={lang} t={t} />
        </Section>

        <section className="closing">
          <Flower className="corner corner-tl flower" />
          <Flower className="corner corner-br flower" />
          <svg className="closing-art" viewBox="40 316 310 310" aria-hidden="true">
            <defs><clipPath id="medallion"><circle cx="195" cy="471" r="150" /></clipPath></defs>
            <circle cx="195" cy="471" r="150" fill="#ffe9a8" />
            <CoupleFigures clipPath="url(#medallion)" />
            <circle cx="195" cy="471" r="150" fill="none" stroke="#3b2a22" strokeWidth="4" />
          </svg>
          <p className="kicker">{t.withLove}</p>
          <p className="fullnames">
            <span>{L(inv.couple.bride)}</span>
            <span className="amp">{t.amp}</span>
            <span>{L(inv.couple.groom)}</span>
          </p>
          <p className="body">{L(inv.closing)}</p>
          <p className="hero-date">{L(inv.dateShort)}</p>
        </section>
      </main>

      <footer className="foot">
        <span>♥</span> {L(inv.couple.brideShort)} {t.amp} {L(inv.couple.groomShort)} · {L(inv.dateShort)}
      </footer>
    </div>
  );
}
