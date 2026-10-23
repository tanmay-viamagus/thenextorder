import { agenda, agendaNote, event, organisers } from "@/content/event";
import { MavericksLogo, ViaMagusMark } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { FILM_DURATION } from "@/content/film";
import { ChapterLabel, Handoff } from "./Story";

const filmLength = `${Math.floor(FILM_DURATION / 60)}:${String(FILM_DURATION % 60).padStart(2, "0")}`;

/**
 * 02 The symposium — one page. Left: the date, the place, what's on the
 * table, the film and who is behind it. Right: the tentative agenda as the
 * brochure gives it. The chapter's hand-off closes the page. On a phone the
 * agenda is its own swipe.
 */
export function Evening() {
  const sub = [event.time, [event.venue, event.city].filter(Boolean).join(", "), event.format].filter(Boolean);
  return (
    <section id="evening" className="sy" data-tone="dark" data-act="evening" aria-labelledby="sy-h">
      <div className="sy__grid">
        <div className="sy__l" data-reveal>
          <p className="sy__k">
            <ChapterLabel id="evening" />
          </p>
          <h2 id="sy-h" className="sy__h">
            Thursday 3 December.
          </h2>
          <p className="sy__sub">
            {sub.map((x, k) => (
              <span key={x}>
                {k ? <i aria-hidden="true">·</i> : null}
                {x}
              </span>
            ))}
          </p>
          <p className="sy__table">
            On the table: how GCCs hire, build and lead as AI reshapes them, over the next 10 to 20 years.
          </p>

          <div id="film" className="sy__film">
            <FilmButton className="fl__btn">
              <span className="fl__btnplay" aria-hidden="true">
                <span className="tri" />
              </span>
              Play the film
            </FilmButton>
            <p>
              <b>The film · {filmLength}</b> The old order, the shift, and what comes next.
            </p>
          </div>

          <dl className="sy__orgs" aria-label="Who is behind the symposium">
            {organisers.map((o, k) => (
              <div key={o.name}>
                <dt>{o.role}</dt>
                <dd>
                  <span className="sy__oname">
                    {o.logo === "mavericks" ? (
                      <MavericksLogo className="sy__logo" height={22} />
                    ) : (
                      <>
                        {k === 0 ? <ViaMagusMark className="sy__mark" /> : null}
                        {o.name}
                      </>
                    )}
                  </span>
                  <span className="sy__oline">{o.line}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="sy__r" data-reveal>
          <p className="sy__lab">
            Tentative agenda <span>{agendaNote.replace(/^Tentative\. /, "")}</span>
          </p>
          <ol className="sy__agenda">
            {agenda.map((a) => (
              <li key={a.k} className={a.time ? "is-first" : undefined}>
                {a.time || a.kind ? <span className="sy__kind">{a.time ?? a.kind}</span> : null}
                <span className="sy__t">
                  {a.t}
                  {a.tag ? <em className="sy__tag">{a.tag}</em> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Handoff to="theme" lead="Panels, a talk, a live demo and dinner." ask="Why should your centre be in the room?" />
    </section>
  );
}
