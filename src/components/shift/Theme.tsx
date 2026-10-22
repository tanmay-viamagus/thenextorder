import { theme } from "@/content/story";

/**
 * What the room will explore — from the event brief. A horizon (today → +10 →
 * +20 years) and three shifts. Each shift is drawn as a pair — today, then
 * next — with words under both, so the drawing never has to be decoded:
 *   talent      three roles → two of them, plus two new ones
 *   technology  people each doing a task → one person leading a row of agents
 *   leadership  a fan of AI options → one path chosen, by a leader
 * The next panel plays once when the shift scrolls into view.
 */
type Phase = "today" | "next";

/** a role: a card with a person in it */
function Role({ x, w, fresh = false, k = 0 }: { x: number; w: number; fresh?: boolean; k?: number }) {
  const cx = x + w / 2;
  return (
    <g className={`thx-role${fresh ? " is-new" : ""}`} style={{ ["--k" as string]: k }}>
      <rect x={x} y={16} width={w} height={48} rx="2" />
      <circle cx={cx} cy={33} r={w > 28 ? 6 : 5} />
      <path d={`M${cx - w * 0.28} 54 C${cx - w * 0.28} 43 ${cx + w * 0.28} 43 ${cx + w * 0.28} 54 Z`} />
      {fresh ? (
        <text x={cx} y={78} textAnchor="middle">
          NEW
        </text>
      ) : null}
    </g>
  );
}

function TalentArt({ phase }: { phase: Phase }) {
  if (phase === "today")
    return (
      <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
        {[0, 1, 2].map((k) => (
          <Role key={k} x={6 + k * 38} w={32} />
        ))}
      </svg>
    );
  return (
    <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
      {[0, 1, 2, 3].map((k) => (
        <Role key={k} x={3 + k * 29} w={25} fresh={k > 1} k={k} />
      ))}
    </svg>
  );
}

/** a person: head and shoulders */
function Person({ x, y, s = 1, lead = false }: { x: number; y: number; s?: number; lead?: boolean }) {
  return (
    <g className={`thx-person${lead ? " is-lead" : ""}`}>
      <circle cx={x} cy={y} r={6 * s} />
      <path d={`M${x - 11 * s} ${y + 21 * s} C${x - 11 * s} ${y + 9 * s} ${x + 11 * s} ${y + 9 * s} ${x + 11 * s} ${y + 21 * s} Z`} />
    </g>
  );
}

function TechnologyArt({ phase }: { phase: Phase }) {
  if (phase === "today")
    return (
      <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
        {[0, 1, 2].map((k) => {
          const x = 22 + k * 38;
          return (
            <g key={k}>
              <Person x={x} y={14} s={0.85} />
              <rect className="thx-task" x={x - 9} y={52} width={18} height={18} />
              <path className="thx-tie" d={`M${x} 34 L${x} 52`} />
            </g>
          );
        })}
      </svg>
    );
  return (
    <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
      <Person x={60} y={10} s={0.85} lead />
      {[0, 1, 2, 3].map((k) => {
        const x = 15 + k * 30;
        return (
          <g key={k} className="thx-agent" style={{ ["--k" as string]: k }}>
            <path className="thx-wire" d={`M60 31 C60 44 ${x} 42 ${x} 54`} />
            <rect x={x - 10} y={54} width={20} height={20} />
            <circle cx={x} cy={64} r={3} />
          </g>
        );
      })}
    </svg>
  );
}

const ENDS = [12, 32, 52, 72];

function LeadershipArt({ phase }: { phase: Phase }) {
  if (phase === "today")
    return (
      <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
        {ENDS.map((y) => (
          <g key={y} className="thx-opt">
            <path d={`M30 42 C46 42 58 ${y} 98 ${y}`} />
            <text x={106} y={y + 3.5} textAnchor="middle">
              ?
            </text>
          </g>
        ))}
        <path className="thx-stem" d="M16 42 L30 42" />
        <circle className="thx-node" cx="16" cy="42" r="6" />
      </svg>
    );
  return (
    <svg className="thx-art" viewBox="0 0 120 84" aria-hidden="true">
      {ENDS.filter((y) => y !== 52).map((y) => (
        <path key={y} className="thx-opt thx-opt--off" d={`M30 42 C46 42 58 ${y} 98 ${y}`} />
      ))}
      <path className="thx-chosen" d="M16 42 L30 42 C46 42 58 52 98 52" pathLength={1} />
      <Person x={16} y={14} s={0.7} lead />
      <circle className="thx-node is-lead" cx="16" cy="42" r="6" />
      <g className="thx-tick">
        <circle cx="106" cy="52" r="10" />
        <path d="M100.5 52 l4 4 l7 -8" />
      </g>
    </svg>
  );
}

const ART = { talent: TalentArt, technology: TechnologyArt, leadership: LeadershipArt };

export function Theme() {
  return (
    <section id="theme" className="th" data-tone="light" data-act="theme" aria-labelledby="th-h">
      <div className="th__hd" data-reveal>
        <p className="th__k">{theme.kicker}</p>
        <h2 id="th-h" className="th__h">
          {theme.headline}
        </h2>
        <p className="th__lede">{theme.lede}</p>
      </div>

      {/* the horizon the conversation spans */}
      <div className="th__hz" data-reveal aria-label="Horizon: today, ten years, twenty years">
        <span className="th__hzline" aria-hidden="true" />
        {theme.horizon.map((h, k) => (
          <span key={h} className={`th__hzm th__hzm--${k}`}>
            <i aria-hidden="true" />
            {h}
          </span>
        ))}
      </div>

      <ol className="th__shifts">
        {theme.shifts.map((s, k) => {
          const Art = ART[s.k as keyof typeof ART];
          return (
            <li key={s.k} className={`th__s th__s--${s.k}`} data-reveal style={{ ["--i" as string]: k }}>
              <p className="th__word">{s.word}</p>
              {/* today → next, drawn and labelled */}
              <div className="thx" aria-hidden="true">
                <div className="thx__p thx__p--today">
                  <Art phase="today" />
                  <span className="thx__k">Today</span>
                  <span className="thx__t">{s.today}</span>
                </div>
                <span className="thx__arr" />
                <div className="thx__p thx__p--next">
                  <Art phase="next" />
                  <span className="thx__k">Next</span>
                  <span className="thx__t">{s.next}</span>
                </div>
              </div>
              <p className="sr-only">
                Today: {s.today}. Next: {s.next}
              </p>
              <p className="th__line">{s.line}</p>
              <p className="th__note">{s.note}</p>
              <ul className="th__topics">
                {s.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="th__host">
                <span>At the event</span>
                <b>{s.host.name}</b> {s.host.line}
              </p>
            </li>
          );
        })}
      </ol>

    </section>
  );
}
