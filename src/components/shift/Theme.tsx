import { theme } from "@/content/story";
import { ChapterLabel, Handoff } from "./Story";

/**
 * Why attend — the final brochure's "Why this event" page, set for the
 * screen: one question as the headline, the theme beside it, the three
 * conversations as three equal columns, who it's for and what to expect,
 * and the brochure's closing line. Nothing moves and nothing is greyed out:
 * everything here is meant to be read.
 */
export function Theme() {
  return (
    <section id="theme" className="wa" data-tone="light" data-act="theme" aria-labelledby="wa-h">
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

      {/* the three conversations, as the brochure lists them */}
      <ol className="wa__cols" data-reveal>
        {theme.shifts.map((s, k) => (
          <li key={s.k} className="wa__col">
            <p className="wa__n">0{k + 1}</p>
            <h3 className="wa__t">
              {s.word}
              <span aria-hidden="true">.</span>
            </h3>
            <ul className="wa__list">
              {s.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="wa__pair" data-reveal>
        <div>
          <h3 className="wa__k">Who is this for</h3>
          <ul className="wa__list">
            {theme.who.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="wa__k">What to expect</h3>
          <ul className="wa__list">
            {theme.expect.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="wa__close" data-reveal>
        {theme.close[0]} <span>{theme.close[1]}</span>
      </p>

      <Handoff to="request" lead="Places are by invitation." ask="Will you be in the room?" />
    </section>
  );
}
