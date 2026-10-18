import { ViaMagusLogo, ViaMagusMark, SelectWordmark, SynthiaLogo, VelocityWordmark } from "@/components/Brand";
import { FilmButton } from "@/components/film/FilmOverlay";
import { event, knownFacts, officialLinks, pending } from "@/content/event";
import { convergence, invite, naming, next, now, practices, seats, tagline, then, type Evidence } from "@/content/story";
import { Chrome, NameTheCentre, Reveal, Seats, ShiftTitle } from "./Interactive";
import { InviteForm } from "./InviteForm";
import { SelectMech, SynthiaMech, VelocityMech } from "./Mechanisms";
import { Plan } from "./Plan";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

function Sheet({ n, era, label }: { n: string; era: string; label: string }) {
  return (
    <p className="sheet">
      <span>Sheet {n}</span>
      <span>{era}</span>
      <span className="sheet__l">{label}</span>
    </p>
  );
}

function Source({ e }: { e: Pick<Evidence, "source" | "date" | "url"> }) {
  return (
    <a className="src" href={e.url} {...ext}>
      {e.source}, {e.date}
      <NewTab />
    </a>
  );
}

const details: [string, string | null][] = [
  ["Date", event.date],
  ["City & venue", [event.venue, event.city].filter(Boolean).join(", ") || null],
  ["Format", event.format],
  ["Speakers", event.speakers.length ? event.speakers.map((s) => s.name).join(", ") : null],
  ["Host", knownFacts.host],
];

const MECH = { velocity: VelocityMech, synthia: SynthiaMech, select: SelectMech };
const MARK = { velocity: VelocityWordmark, synthia: () => <SynthiaLogo height={30} />, select: SelectWordmark };

export function Site() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Chrome />
      <Reveal />

      <header className="hdr">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <nav className="hdr__nav" aria-label="The story">
          <a href="#then" data-for="I">
            <i>I</i> Then
          </a>
          <a href="#now" data-for="II">
            <i>II</i> Now
          </a>
          <a href="#next" data-for="III">
            <i>III</i> Next
          </a>
          <a href="#attend" data-for="IV">
            <i>IV</i> Attend
          </a>
        </nav>
        <div className="hdr__end">
          <FilmButton className="hdr__film">
            <span className="tri" aria-hidden="true" /> Film
          </FilmButton>
          <a className="btn btn--shift btn--sm" href="/register">
            Register
          </a>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------ ACT I · the hero */}
        <section id="top" className="hero" data-tone="light" aria-labelledby="hero-h">
          <p className="hero__meta">
            <span>Sheet 00 — An invitation from ViaMagus</span>
            <span>For {knownFacts.audience}</span>
          </p>
          <h1 id="hero-h" className="sr-only">
            The NEXT Order — an invitation from ViaMagus for India’s GCC leaders
          </h1>
          <ShiftTitle lines={["THE ", "NEXT", "ORDER."]} cutLine={2} edges={["↓ The mandate you were given", "The mandate you take ↑"]} />
          <div className="hero__foot">
            <p className="hero__q">{tagline}</p>
            <div className="hero__cta">
              <a className="btn btn--shift" href="#attend">
                Request an invitation <span aria-hidden="true">→</span>
              </a>
              <FilmButton className="btn btn--line">
                <span className="tri" aria-hidden="true" /> Watch the film <span className="dim">30s</span>
              </FilmButton>
            </div>
            <dl className="tblock" aria-label="Event details">
              <div>
                <dt>Event</dt>
                <dd>The NEXT Order</dd>
              </div>
              <div>
                <dt>For</dt>
                <dd>GCC leaders, India</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{event.date ?? pending}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{[event.venue, event.city].filter(Boolean).join(", ") || pending}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>{knownFacts.host}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------ ACT I · THEN */}
        <section id="then" className="scene scene--then" data-tone="light" data-act="I" aria-labelledby="then-h">
          <Sheet n={then.sheet} era={then.era} label={then.label} />
          <div className="scene__grid">
            <div className="scene__copy" data-reveal>
              <h2 id="then-h" className="h-mon">
                {then.headline}
              </h2>
              <p className="lede">{then.body}</p>
              <p className="caveat">{then.caveat}</p>
              <div className="fig">
                <p className="fig__n">{then.evidence.figure}</p>
                <p className="fig__t">{then.evidence.finding}</p>
                <Source e={then.evidence} />
              </div>
            </div>
            <Plan stage="then" bays={then.bays} label="Floor plan: a small India centre inside a global enterprise, laid out as briefed — enterprise systems, finance and accounts, technology operations, internal platforms." />
          </div>
        </section>

        {/* ------------------------------------------------ ACT II · NOW */}
        <section id="now" className="scene scene--now" data-tone="light" data-act="II" aria-labelledby="now-h">
          <Sheet n={now.sheet} era={now.era} label={now.label} />
          <div className="scene__grid scene__grid--flip">
            <Plan stage="now" label="Floor plan: the same centre, its walls moving outward beyond the original brief." />
            <div className="scene__copy" data-reveal>
              <h2 id="now-h" className="h-mon">
                {now.headline}
              </h2>
              <p className="lede">{now.body}</p>
            </div>
          </div>

          <div className="dims" data-reveal>
            <p className="dims__k">What India-based centres report</p>
            <ul className="dims__row">
              {now.evidence.map((e) => (
                <li key={e.figure} className="dim-item">
                  <span className="dim-item__n">{e.figure}</span>
                  <span className="dim-item__t">{e.finding}</span>
                </li>
              ))}
            </ul>
            <Source e={now.evidence[0]} />
          </div>

          <div className="counter" data-reveal>
            <p className="counter__k">A different lens, a different survey</p>
            <p className="counter__n">{now.counterpoint.figure}</p>
            <p className="counter__t">{now.counterpoint.finding}</p>
            <Source e={now.counterpoint} />
            <p className="counter__so">Ambition and arrival are different things.</p>
          </div>

          <div className="lens" data-reveal>
            <p className="lens__k">The questions every centre is asked</p>
            <ol className="lens__row">
              {now.lens.map((l, i) => (
                <li key={l.k} style={{ ["--i" as string]: i }}>
                  <span className="lens__w">{l.k}</span>
                  <span className="lens__q">{l.q}</span>
                </li>
              ))}
            </ol>
            <p className="lens__note">{now.lensNote}</p>
          </div>
        </section>

        {/* ------------------------------------------------ the naming question (exploratory) */}
        <section id="name" className="scene scene--name" data-tone="dark" aria-labelledby="name-h">
          <Sheet n={naming.sheet} era="An open question" label="Exploratory" />
          <h2 id="name-h" className="name__h">
            <span>GCC</span>
            <span className="name__arrow" aria-hidden="true">
              →
            </span>
            <span>GIC</span>
            <span className="name__arrow" aria-hidden="true">
              →
            </span>
            <span className="name__q">?</span>
            <span className="sr-only">: what will global centres be called next?</span>
          </h2>
          <div className="name__grid">
            <dl className="name__defs">
              {naming.labels.map((l) => (
                <div key={l.k}>
                  <dt>{l.k}</dt>
                  <dd>{l.v}</dd>
                </div>
              ))}
              <div>
                <dt>Next?</dt>
                <dd>No agreed name. Names change; mandate matters.</dd>
              </div>
            </dl>
            <div>
              <p className="name__body">{naming.body}</p>
              <NameTheCentre owns={naming.owns} note={naming.note} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ ACT III · NEXT */}
        <section id="next" className="scene scene--next" data-tone="light" data-act="III" aria-labelledby="next-q">
          <Sheet n={next.sheet} era={next.era} label={next.label} />
          <h2 id="next-q" className="next__q" data-reveal>
            {next.question}
          </h2>
          <div className="scene__grid">
            <div className="scene__copy" data-reveal>
              <p className="h-mon h-mon--sm">{next.headline}</p>
              <p className="lede">{next.body}</p>
              <Seats seats={seats} />
            </div>
            <Plan stage="next" rooms={next.rooms} label="Floor plan: a larger centre that owns product, platforms, decisions, quality and capability — with one room left open, yours to draw." />
          </div>
        </section>

        {/* ------------------------------------------------ the three practices */}
        <section id="practices" className="wall" data-tone="dark" aria-labelledby="practices-h">
          <div className="wall__hd">
            <p className="sheet sheet--dark">
              <span>Sheets A–C</span>
              <span>ViaMagus</span>
              <span className="sheet__l">Build · Operate · Scale</span>
            </p>
            <h2 id="practices-h" className="wall__h">
              Three ways to take on the next mandate.
            </h2>
            <p className="wall__lede">ViaMagus brings three practices into the room. Each answers a different part of the question.</p>
          </div>
          {practices.map((p) => {
            const Mech = MECH[p.key];
            const Mark = MARK[p.key];
            return (
              <article key={p.key} id={p.key} className={`plate plate--${p.key}`} aria-labelledby={`${p.key}-h`}>
                <div className="plate__copy" data-reveal>
                  <p className="plate__n">
                    <span>Sheet {p.n}</span>
                    <span>{p.role}</span>
                  </p>
                  <h3 id={`${p.key}-h`} className="plate__verb">
                    {p.verb}.<span className="sr-only"> {p.name}</span>
                  </h3>
                  <div className="plate__mark" aria-hidden="true">
                    <Mark />
                  </div>
                  <p className="plate__line">{p.line}</p>
                  <ul className="plate__quotes">
                    {p.quotes.map((q) => (
                      <li key={q}>“{q}”</li>
                    ))}
                  </ul>
                  <a className="plate__link" href={p.href} {...ext}>
                    {p.source} ↗<NewTab />
                  </a>
                </div>
                <Mech />
              </article>
            );
          })}
        </section>

        {/* ------------------------------------------------ convergence */}
        <section id="converge" className="converge" data-tone="dark" aria-labelledby="converge-h">
          <div className="converge__fig" data-reveal aria-hidden="true">
            <svg viewBox="0 0 600 300" className="converge__lines">
              <path className="cl cl--v" d="M40 0 C 40 150, 300 120, 300 210" pathLength={1} />
              <path className="cl cl--s" d="M300 0 V 210" pathLength={1} />
              <path className="cl cl--x" d="M560 0 C 560 150, 300 120, 300 210" pathLength={1} />
            </svg>
            <ViaMagusMark className="converge__mark" />
          </div>
          <h2 id="converge-h" className="converge__h" data-reveal>
            {convergence.line}
          </h2>
          <p className="converge__by" data-reveal>
            {convergence.by}
          </p>
        </section>

        {/* ------------------------------------------------ ACT IV · attend */}
        <section id="attend" className="scene scene--attend" data-tone="light" data-act="IV" aria-labelledby="attend-h">
          <Sheet n={invite.sheet} era="Your next move" label="Attend" />
          <div className="attend">
            <div className="attend__copy">
              <h2 id="attend-h" className="h-mon">
                {invite.headline}
              </h2>
              <dl className="brief">
                <div>
                  <dt>What</dt>
                  <dd>{invite.what}</dd>
                </div>
                <div>
                  <dt>Why</dt>
                  <dd>{invite.why}</dd>
                </div>
                <div>
                  <dt>Who</dt>
                  <dd>
                    <ul>
                      {invite.who.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <dl className="tblock tblock--attend" aria-label="Event details">
                {details.map(([k, val]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className={val ? undefined : "is-pending"}>{val ?? pending}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <InviteForm source="site" />
          </div>
        </section>
      </main>

      <footer className="ftr" data-tone="dark">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <p>The NEXT Order — an invitation from ViaMagus.</p>
        <ul>
          <li>
            <a href={officialLinks.velocity} {...ext}>
              Velocity AI<NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.synthia} {...ext}>
              Synthia AI<NewTab />
            </a>
          </li>
          <li>
            <a href={officialLinks.select} {...ext}>
              ViaMagus Select<NewTab />
            </a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
          <li>
            <a href="/film">The film</a>
          </li>
        </ul>
      </footer>

      <div className="bar" aria-hidden="false">
        <a className="btn btn--shift" href="#attend">
          Request an invitation <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
