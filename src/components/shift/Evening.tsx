import { agenda, agendaNote, event, organisers } from "@/content/event";
import { MavericksLogo, ViaMagusMark } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { FILM_DURATION } from "@/content/film";
import { Icon, type IconName } from "./Icons";
import { ChapterLabel } from "./Story";

const filmLength = `${Math.floor(FILM_DURATION / 60)}:${String(FILM_DURATION % 60).padStart(2, "0")}`;

/** one line icon per agenda item */
const AGENDA_ICON: Record<string, IconName> = {
  arrive: "users",
  welcome: "users",
  "panel-1": "chat",
  talk: "bulb",
  "panel-2": "chart",
  demo: "sparkle",
  dinner: "cocktail",
};

/** The brochure's cover, as a room: a lit doorway at the back, light across the floor, glass at the sides. */
function Doorway() {
  return (
    <div className="sy-room" aria-hidden="true">
      <span className="sy-room__glow" />
      <span className="sy-room__wall sy-room__wall--l" />
      <span className="sy-room__wall sy-room__wall--r" />
      <span className="sy-room__open" />
      <span className="sy-room__floor" />
    </div>
  );
}

/**
 * 02 The meeting point — one page, as the reference: on the left the date,
 * the place, what's on the table and the tentative agenda as a timeline; on
 * the right the film and who is behind it; the lit doorway behind them. On a
 * phone the agenda and the organisers are a swipe each.
 */
export function Evening() {
  const where = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <section id="evening" className="sy" data-tone="dark" data-act="evening" aria-labelledby="sy-h">
      <Doorway />
      <div className="sy__grid">
        <div className="sy__l">
          <div className="sy__when" data-reveal>
            <p className="sy__k">
              <ChapterLabel id="evening" />
            </p>
            <h2 id="sy-h" className="sy__h">
              Thursday <span className="sy__date">3 December.</span>
            </h2>
            <p className="sy__sub">
              <span className="sy__time">{event.time}</span>
              <i aria-hidden="true">·</i>
              <span>{where}</span>
              <i aria-hidden="true">·</i>
              <span>{event.format}</span>
            </p>
            <p className="sy__table">
              On the table: how GCCs hire, build and lead as AI reshapes them, over the next 10 to 20 years.
            </p>
          </div>

          <div className="sy__agenda-col" data-reveal>
            <p className="sy__lab">
              Tentative agenda <span>{agendaNote.replace(/^Tentative\. /, "")}</span>
            </p>
            <ol className="sy__agenda">
              {agenda.map((a) => (
                <li key={a.k} className={a.time ? "is-first" : undefined}>
                  <span className="sy__time-at">{a.time ?? ""}</span>
                  <span className="sy__stop" aria-hidden="true" />
                  <span className="sy__icon">
                    <Icon name={AGENDA_ICON[a.k] ?? "users"} />
                  </span>
                  <span className="sy__what">
                    {a.kind ? <span className="sy__kind">{a.kind}</span> : null}
                    <span className="sy__t">{a.t}</span>
                  </span>
                  {a.tag ? <em className="sy__tag">{a.tag}</em> : <span />}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="sy__r">
          <div id="film" className="sy__film" data-reveal>
            <p className="sy__fk">The film · {filmLength}</p>
            <p className="sy__ft">
              See what’s <span>changing.</span>
            </p>
            <p className="sy__fd">The old order, the shift, and what comes next.</p>
            <FilmButton className="fl__btn sy__play">
              <span className="fl__btnplay" aria-hidden="true">
                <span className="tri" />
              </span>
              Play the film
            </FilmButton>
          </div>

          <aside className="sy__orgs" aria-label="Who is behind the symposium" data-reveal>
            <p className="sy__lab">Who is behind it</p>
            {organisers.map((o, k) => (
              <div key={o.name} className="sy__org">
                <p className="sy__role">{o.role}</p>
                <p className="sy__oname">
                  {o.logo === "mavericks" ? (
                    <MavericksLogo className="sy__logo" height={26} />
                  ) : (
                    <>
                      {k === 0 ? <ViaMagusMark className="sy__mark" /> : null}
                      {o.name}
                    </>
                  )}
                </p>
                <p className="sy__oline">{o.line}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
