import { agenda, agendaNote, contactEmail, event, organisers } from "@/content/event";
import { ViaMagusMark } from "@/components/Brand";
import { Handoff } from "./Story";

/**
 * The evening — from the brochure. One grid: the date and a doorway of light
 * (the brochure's cover) on top; below, under one rule, the tentative agenda
 * as evenly spaced rows on a single line, and who is behind the evening
 * beside it, starting on the same line. Only the start is timed.
 */
function Doorway() {
  return (
    <div className="evn-door" aria-hidden="true">
      <span className="evn-door__glow" />
      <span className="evn-door__open" />
      <span className="evn-door__leaf" />
      <span className="evn-door__floor" />
      <span className="evn-door__beam" />
    </div>
  );
}

export function Evening() {
  const sub = [event.time, [event.venue, event.city].filter(Boolean).join(", "), event.format].filter(Boolean);
  return (
    <section id="evening" className="evn" data-tone="dark" data-act="evening" aria-labelledby="evn-h">
      <header className="evn__hd" data-reveal>
        <div className="evn__title">
          <p className="evn__k">
            <span className="chap">04</span>The evening
          </p>
          <h2 id="evn-h" className="evn__h">
            Thursday 3 December.
          </h2>
          <p className="evn__sub">
            {sub.map((x, k) => (
              <span key={x}>
                {k ? <i aria-hidden="true">·</i> : null}
                {x}
              </span>
            ))}
          </p>
          <p className="evn__table">
            On the table: how GCCs hire, build and lead as AI reshapes them, over
            the next 10 to 20 years.
          </p>
        </div>
        <Doorway />
      </header>

      <div className="evn__body">
        <div className="evn__agenda">
          <p className="evn__lab">
            Tentative agenda
            <span>{agendaNote.replace(/^Tentative\. /, "")}</span>
          </p>
          <ol className="evn__list">
            {agenda.map((a, k) => (
              <li key={a.k} className={`evn__row evn__row--${a.k}`} data-reveal style={{ ["--i" as string]: k }}>
                <span className="evn__time">{a.time ?? ""}</span>
                <span className="evn__dot" aria-hidden="true" />
                <span className="evn__what">
                  <span className="evn__t">{a.t}</span>
                  {a.d ? <span className="evn__d">{a.d}</span> : null}
                </span>
                <span className="evn__side">
                  {a.tag ? <em className="evn__tag">{a.tag}</em> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="evn__orgs" aria-label="Who is behind the evening" data-reveal>
          <p className="evn__lab">Who is behind it</p>
          {organisers.map((o, k) => (
            <div key={o.name} className="evn__org">
              <p className="evn__role">{o.role}</p>
              <p className="evn__name">
                {k === 0 ? <ViaMagusMark className="evn__mark" /> : null}
                {o.name}
              </p>
              <p className="evn__oline">{o.line}</p>
            </div>
          ))}
          <p className="evn__mail">
            Questions? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </aside>
      </div>
      <Handoff to="request">Places are by invitation. Will you be in the room?</Handoff>
    </section>
  );
}
