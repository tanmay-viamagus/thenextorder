import { theme } from "@/content/story";
import { Icon, type IconName } from "./Icons";
import { ChapterLabel, Handoff } from "./Story";

const TOPIC_ICON: Record<string, IconName> = { talent: "users", technology: "chip", leadership: "chart" };

/**
 * 03 The conversation — a split page. Left (about a third): an
 * architectural light installation — translucent planes, angular glass,
 * lavender shadow and warm light — with the chapter label above and the
 * three conversations named below; its light drifts slowly (CSS only, long
 * staggered cycles, still with reduced motion). Right: the brochure's "Why
 * this event" — the question, the theme beside it, the three conversations
 * as equal rows, who it's for and what to expect, and the closing line as
 * the hand-off. Each row's arrow opens the form with that conversation
 * ticked.
 */
function Installation() {
  return (
    <div className="wa-art" aria-hidden="true">
      <span className="wa-art__base" />
      <span className="wa-art__plane wa-art__plane--1" />
      <span className="wa-art__plane wa-art__plane--2" />
      <span className="wa-art__plane wa-art__plane--3" />
      <span className="wa-art__plane wa-art__plane--4" />
      <span className="wa-art__shard wa-art__shard--1" />
      <span className="wa-art__shard wa-art__shard--2" />
      <span className="wa-art__opening" />
      <span className="wa-art__beam" />
      <span className="wa-art__edge wa-art__edge--1" />
      <span className="wa-art__edge wa-art__edge--2" />
      <span className="wa-art__floor" />
    </div>
  );
}

export function Theme() {
  return (
    <section id="theme" className="wa" data-tone="light" data-act="theme" aria-labelledby="wa-h">
      <div className="wa__side">
        <Installation />
        <p className="th__k wa__k-side">
          <ChapterLabel id="theme" />
        </p>
        <p className="wa__names" aria-hidden="true">
          {theme.shifts.map((s) => (
            <span key={s.k}>{s.word}</span>
          ))}
        </p>
      </div>

      <div className="wa__main">
        <div className="wa__head" data-reveal>
          <h2 id="wa-h" className="wa__h">
            Your centre was <br />
            built to execute. <span>{theme.question[1]}</span>
          </h2>
          <p className="wa__lede">
            <strong>{theme.headline}</strong> {theme.lede}
          </p>
        </div>

        <ol className="wa__rows" data-reveal>
          {theme.shifts.map((s, k) => (
            <li key={s.k} className="wa__rowi">
              <span className="wa__n">0{k + 1}</span>
              <span className="wa__tile">
                <Icon name={TOPIC_ICON[s.k]} />
              </span>
              <h3 className="wa__t">
                {s.word}
                <span aria-hidden="true">.</span>
              </h3>
              <ul className="wa__list">
                {s.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a className="wa__go" href={`/register?interest=${s.k}`}>
                <span className="sr-only">Request your place — interested in {s.word.toLowerCase()}</span>
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ol>

        <div className="wa__pair" data-reveal>
          <div>
            <h3 className="wa__k">Who is this for</h3>
            <div className="wa__row">
              <span className="wa__tile">
                <Icon name="users" />
              </span>
              <ul className="wa__list">
                {theme.who.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="wa__k">What to expect</h3>
            <div className="wa__row">
              <span className="wa__tile">
                <Icon name="chat" />
              </span>
              <ul className="wa__list">
                {theme.expect.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* the brochure's closing line is the page's hand-off */}
        <Handoff to="request" lead={theme.close[0]} ask={theme.close[1]} />
      </div>
    </section>
  );
}
