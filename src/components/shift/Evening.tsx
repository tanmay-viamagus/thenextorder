import { agenda, agendaNote, contactEmail, organisers } from "@/content/event";
import { ViaMagusMark } from "@/components/Brand";

/**
 * The evening — from the brochure. A doorway of light that opens as the
 * section arrives (the brochure's cover), the tentative agenda as a lit line
 * running from 3:30 PM into the dinner, and who is behind the evening beside
 * it (the date and place are already in the heading — not repeated).
 * Only the start is timed; the rest stays "to be announced".
 */
function Doorway() {
  return (
    <div className="evg-door" aria-hidden="true">
      <span className="evg-door__glow" />
      <span className="evg-door__open" />
      <span className="evg-door__leaf" />
      <span className="evg-door__floor" />
      <span className="evg-door__beam" />
    </div>
  );
}

/** The book, still under wraps: a cover that stays blurred until the night. */
function Book() {
  return (
    <span className="evg-book" aria-hidden="true">
      <span className="evg-book__spine" />
      <span className="evg-book__cover">
        <span className="evg-book__t" />
        <span className="evg-book__t evg-book__t--s" />
      </span>
      <span className="evg-book__band">3 Dec</span>
    </span>
  );
}

export function Evening() {
  return (
    <section id="evening" className="evg" data-tone="dark" data-act="evening" aria-labelledby="evg-h">
      <div className="evg__hd" data-reveal>
        <div className="evg__hl">
          <p className="evg__k">
            <span className="chap">06</span>The evening
          </p>
          <h2 id="evg-h" className="evg__h">
            Thursday 3 December.
            <span>From 3:30 PM · T-Hub, Hyderabad</span>
          </h2>
        </div>
        <Doorway />
      </div>

      <div className="evg__grid">
        <div className="evg__plan">
          <p className="evg__pk">
            Tentative agenda <span>{agendaNote.replace(/^Tentative\. /, "")}</span>
          </p>
          <ol className="evg__agenda">
            {agenda.map((a, k) => (
              <li key={a.k} className={`evg__it evg__it--${a.k}`} data-reveal style={{ ["--i" as string]: k }}>
                <span className="evg__time">{a.time ?? ""}</span>
                <span className="evg__dot" aria-hidden="true" />
                <span className="evg__body">
                  <span className="evg__t">
                    {a.t}
                    {a.tag ? <em className="evg__tag">{a.tag}</em> : null}
                  </span>
                  {a.d ? <span className="evg__d">{a.d}</span> : null}
                </span>
                {a.k === "book" ? <Book /> : null}
              </li>
            ))}
          </ol>
        </div>

        <aside className="evg__card" data-reveal aria-label="Organised by">
          {organisers.map((o, k) => (
            <div key={o.name} className={`evg__org evg__org--${k}`}>
              <p className="evg__role">{o.role}</p>
              <p className="evg__name">
                {k === 0 ? <ViaMagusMark className="evg__mark" /> : null}
                {o.name}
              </p>
              <p className="evg__oline">{o.line}</p>
            </div>
          ))}
          <p className="evg__mail">
            Questions? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </aside>
      </div>
    </section>
  );
}
