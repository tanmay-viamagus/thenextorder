import { theme } from "@/content/story";
import { Icon, type IconName } from "./Icons";
import { ChapterLabel, Handoff } from "./Story";

const TOPIC_ICON: Record<string, IconName> = { talent: "users", technology: "chip", leadership: "chart" };

/**
 * 03 The conversation — the final brochure's "Why this event", on one page:
 * the question as the headline with the theme beside it; the three
 * conversations as three columns, each with its icon; who it's for and what
 * to expect; and the brochure's closing line as the hand-off. Nothing moves
 * and nothing is greyed out. On a phone "who" and "what" are a second swipe.
 */
export function Theme() {
  return (
    <section id="theme" className="wa" data-tone="light" data-act="theme" aria-labelledby="wa-h">
      <div className="wa__glass" aria-hidden="true" />
      <p className="th__k" data-reveal>
        <ChapterLabel id="theme" />
      </p>

      <div className="wa__head" data-reveal>
        <h2 id="wa-h" className="wa__h">
          {theme.question[0]} <span>{theme.question[1]}</span>
        </h2>
        <p className="wa__lede">
          <strong>{theme.headline}</strong> {theme.lede}
        </p>
      </div>

      <ol className="wa__cols" data-reveal>
        {theme.shifts.map((s, k) => (
          <li key={s.k} className="wa__col">
            <p className="wa__n">0{k + 1}</p>
            <div className="wa__row">
              <span className="wa__tile">
                <Icon name={TOPIC_ICON[s.k]} />
              </span>
              <div>
                <h3 className="wa__t">
                  {s.word}
                  <span aria-hidden="true">.</span>
                </h3>
                <ul className="wa__list">
                  {s.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
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
    </section>
  );
}
