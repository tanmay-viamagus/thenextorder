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

/**
 * The brochure's cover, as a room — drawn as one picture so every edge
 * meets: the walls run into the door's frame, and the light on the floor
 * starts exactly at the door's sill, as wide as the door, and spreads
 * towards the viewer.
 */
function Doorway() {
  // the door: x 160–240, y 60–520 in a 400 × 800 room
  return (
    <svg className="sy-room" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sy-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e6ff" />
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecdcff" />
        </linearGradient>
        <linearGradient id="sy-wall-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d0a14" />
          <stop offset="0.7" stopColor="#2a1a45" />
          <stop offset="1" stopColor="#7b5ab0" />
        </linearGradient>
        <linearGradient id="sy-wall-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#0d0a14" />
          <stop offset="0.7" stopColor="#2a1a45" />
          <stop offset="1" stopColor="#7b5ab0" />
        </linearGradient>
        <linearGradient id="sy-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2d0ff" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#c9a2f0" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c9a2f0" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="sy-glow" cx="200" cy="290" r="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e9c8ff" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#9b5cf0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#9b5cf0" stopOpacity="0" />
        </radialGradient>
        <filter id="sy-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="sy-deep" x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <linearGradient id="sy-sweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sy-door-clip">
          <rect x="160" y="60" width="80" height="460" />
        </clipPath>
      </defs>
      {/* the floor, then the walls running into the door's frame */}
      <polygon points="0,760 160,520 240,520 400,760 400,800 0,800" fill="#0c0a11" />
      <polygon points="0,0 160,60 160,520 0,760" fill="url(#sy-wall-l)" />
      <polygon points="400,0 240,60 240,520 400,760" fill="url(#sy-wall-r)" />
      {/* the glow around the opening — it breathes */}
      <rect className="sy-halo" x="0" y="0" width="400" height="640" fill="url(#sy-glow)" />
      {/* depth: a faint glow just behind the door */}
      <rect className="sy-depth" x="150" y="70" width="100" height="440" fill="#e9d4ff" filter="url(#sy-deep)" />
      {/* the opening, its light bleeding a little past the frame */}
      <rect x="160" y="60" width="80" height="460" fill="#fff" filter="url(#sy-soft)" opacity="0.7" />
      <rect x="160" y="60" width="80" height="460" fill="url(#sy-door)" />
      {/* a slow sweep of light down the door's inner edge */}
      <g clipPath="url(#sy-door-clip)">
        <rect className="sy-sweep" x="160" y="-60" width="7" height="160" fill="url(#sy-sweep)" />
      </g>
      {/* the light on the floor: from the sill, exactly the door's width, spreading out */}
      <polygon className="sy-spill" points="160,520 240,520 330,800 70,800" fill="url(#sy-beam)" />
    </svg>
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
