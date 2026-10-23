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
 * The brochure's cover, as a room — drawn so every edge meets: the walls run
 * into the door's frame, and the light on the floor starts exactly at the
 * door's sill, as wide as the door, and spreads towards the viewer. The
 * walls and floor run on past the picture's edges, so the room fills any
 * screen without cropping the door.
 *
 * The room itself is still. Its light lives on separate layers drawn to the
 * same coordinates, so each moves without disturbing the drawing: a violet
 * halo around the opening, violet light on the walls beside the frame, the
 * door's reflection on the floor, a gleam travelling down the door's edge and
 * a ripple of light running out along the floor.
 */
const ROOM = { viewBox: "0 0 400 800", preserveAspectRatio: "xMidYMid meet" } as const;

function Doorway() {
  // the door: x 160–240, y 60–520 in a 400 × 800 room
  return (
    <div className="sy-room" aria-hidden="true">
      <svg className="sy-room__base" {...ROOM} focusable="false">
        <defs>
          <linearGradient id="sy-door" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e6ff" />
            <stop offset="0.55" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ecdcff" />
          </linearGradient>
          <linearGradient id="sy-wall-l" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0d0a14" />
            <stop offset="0.7" stopColor="#2a1a45" />
            <stop offset="1" stopColor="#7b5ab0" />
          </linearGradient>
          <linearGradient id="sy-wall-r" x1="400" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0d0a14" />
            <stop offset="0.7" stopColor="#2a1a45" />
            <stop offset="1" stopColor="#7b5ab0" />
          </linearGradient>
          <linearGradient id="sy-beam" x1="0" y1="520" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f2d0ff" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#c9a2f0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c9a2f0" stopOpacity="0.04" />
          </linearGradient>
          {/* the whole floor catches the door's light: brightest at the sill, violet to the walls */}
          <radialGradient id="sy-floor" cx="200" cy="520" r="520" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#d9c6ff" stopOpacity="0.62" />
            <stop offset="0.35" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="0.75" stopColor="#4c2a8a" stopOpacity="0.32" />
            <stop offset="1" stopColor="#2a1a45" stopOpacity="0.28" />
          </radialGradient>
          <filter id="sy-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        {/* the floor, then the walls running into the door's frame */}
        <polygon points="-300,1210 160,520 240,520 700,1210" fill="#0c0a11" />
        <polygon points="-300,1210 160,520 240,520 700,1210" fill="url(#sy-floor)" />
        <polygon points="-300,-112 160,60 160,520 -300,1210" fill="url(#sy-wall-l)" />
        <polygon points="700,-112 240,60 240,520 700,1210" fill="url(#sy-wall-r)" />
        {/* the opening, its light bleeding a little past the frame */}
        <rect x="160" y="60" width="80" height="460" fill="#fff" filter="url(#sy-soft)" opacity="0.7" />
        <rect x="160" y="60" width="80" height="460" fill="url(#sy-door)" />
        {/* the light on the floor: from the sill, exactly the door's width, spreading out */}
        <polygon points="160,520 240,520 394,1000 6,1000" fill="url(#sy-beam)" />
      </svg>

      {/* the halo around the opening */}
      <svg className="sy-room__l sy-halo" {...ROOM} focusable="false">
        <defs>
          <radialGradient id="sy-glow" cx="200" cy="290" r="250" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ead5ff" stopOpacity="0.7" />
            <stop offset="0.42" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="-300" y="-200" width="1000" height="1000" fill="url(#sy-glow)" />
      </svg>

      {/* violet light on the walls beside the frame */}
      <svg className="sy-room__l sy-violet" {...ROOM} focusable="false">
        <defs>
          <linearGradient id="sy-violet-l" x1="160" y1="0" x2="30" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sy-violet-r" x1="240" y1="0" x2="370" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="30,11 160,60 160,520 30,715" fill="url(#sy-violet-l)" />
        <polygon points="370,11 240,60 240,520 370,715" fill="url(#sy-violet-r)" />
      </svg>

      {/* the door's reflection on the floor, and violet light along the floor's edges */}
      <svg className="sy-room__l sy-reflect" {...ROOM} focusable="false">
        <defs>
          <linearGradient id="sy-mirror" x1="0" y1="520" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="#e9d5ff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#c4b5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sy-edge" x1="0" y1="520" x2="0" y2="820" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c4b5fd" stopOpacity="0.8" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <filter id="sy-blur-2" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <polygon points="160,520 240,520 250,700 150,700" fill="url(#sy-mirror)" filter="url(#sy-blur-2)" />
        <path d="M160 520 L-40 820 M240 520 L440 820" stroke="url(#sy-edge)" strokeWidth="2" filter="url(#sy-blur-2)" />
      </svg>

      {/* a gleam down the door's inner edge */}
      <svg className="sy-room__l" {...ROOM} focusable="false">
        <defs>
          <linearGradient id="sy-sweep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="sy-door-clip">
            <rect x="160" y="60" width="80" height="460" />
          </clipPath>
        </defs>
        <g clipPath="url(#sy-door-clip)">
          <rect className="sy-sweep" x="160" y="-60" width="7" height="160" fill="url(#sy-sweep)" />
        </g>
      </svg>

      {/* a ripple of light running out from the sill along the floor */}
      <svg className="sy-room__l" {...ROOM} focusable="false">
        <defs>
          <linearGradient id="sy-ripple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5e8ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#f5e8ff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#f5e8ff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="sy-floor-clip">
            <polygon points="-300,1210 160,520 240,520 700,1210" />
          </clipPath>
        </defs>
        <g clipPath="url(#sy-floor-clip)">
          <rect className="sy-ripple" x="-300" y="470" width="1000" height="70" fill="url(#sy-ripple)" />
        </g>
      </svg>
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
                    {a.time ? (
                      <span className="sy__kind sy__at-m" aria-hidden="true">
                        {a.time}
                      </span>
                    ) : null}
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
