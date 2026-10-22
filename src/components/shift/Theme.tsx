import { theme } from "@/content/story";

/**
 * Why this event — from the brochure. The headline's three verbs, set large:
 * Hire. Build. Lead. Each arrives as an outline and fills with ink as it
 * scrolls into view; beside it, only the brochure's topics. No drawings.
 */
export function Theme() {
  return (
    <section id="theme" className="th" data-tone="light" data-act="theme" aria-labelledby="th-h">
      <div className="th__hd" data-reveal>
        <p className="th__k">
          <span className="chap">01</span>
          {theme.kicker}
        </p>
        <h2 id="th-h" className="th__h">
          {theme.headline}
        </h2>
        <p className="th__lede">{theme.lede}</p>
      </div>

      <ol className="th__rows">
        {theme.shifts.map((s, k) => (
          <li key={s.k} className={`th__row th__row--${s.k}`} data-reveal style={{ ["--i" as string]: k }}>
            <p className="th__idx">{s.word}</p>
            <p className="th__verb">
              <span className="th__fill">{s.verb}</span>
              <span className="th__dot">.</span>
            </p>
            <ul className="th__tops">
              {s.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
