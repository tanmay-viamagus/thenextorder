import { theme } from "@/content/story";

/**
 * What the room will explore — from the event brief. A horizon (today → +10 →
 * +20 years) and three shifts, each with a small line drawing that plays once
 * when it scrolls into view: roles flipping to new ones (talent), people
 * leading a row of agents (technology), a decision path chosen (leadership).
 * Then what attendees can expect in the room.
 */
function TalentArt() {
  const cells = [0, 1, 2, 3, 4, 5];
  const fresh = [2, 4];
  return (
    <svg className="th-art" viewBox="0 0 240 150" aria-hidden="true">
      {cells.map((k) => {
        const x = 12 + (k % 3) * 76;
        const y = 12 + Math.floor(k / 3) * 66;
        const isNew = fresh.includes(k);
        return (
          <g key={k} className={`th-role${isNew ? " is-new" : ""}`} style={{ ["--k" as string]: k }}>
            <rect x={x} y={y} width="64" height="56" />
            <circle cx={x + 32} cy={y + 20} r="7" />
            <path d={`M${x + 20} ${y + 44} C${x + 20} ${y + 32} ${x + 44} ${y + 32} ${x + 44} ${y + 44}`} />
            {isNew ? (
              <text x={x + 32} y={y + 54} textAnchor="middle">
                NEW
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function TechnologyArt() {
  const agents = [0, 1, 2, 3, 4];
  return (
    <svg className="th-art" viewBox="0 0 240 150" aria-hidden="true">
      {/* the people who lead */}
      <g className="th-lead">
        <circle cx="120" cy="22" r="9" />
        <path d="M104 52 C104 38 136 38 136 52 Z" />
      </g>
      {agents.map((k) => {
        const x = 20 + k * 44;
        return (
          <g key={k} className="th-agent" style={{ ["--k" as string]: k }}>
            <path className="th-wire" d={`M120 58 C120 82 ${x + 14} 78 ${x + 14} 100`} />
            <rect x={x} y="100" width="28" height="28" />
            <circle cx={x + 14} cy="114" r="4" />
          </g>
        );
      })}
      <text className="th-tag" x="120" y="146" textAnchor="middle">
        AGENTS · HUMAN-LED
      </text>
    </svg>
  );
}

function LeadershipArt() {
  return (
    <svg className="th-art" viewBox="0 0 240 150" aria-hidden="true">
      <path className="th-path" d="M20 120 L100 120" />
      <path className="th-path th-path--alt" d="M100 120 C140 120 150 70 210 60" />
      <path className="th-path th-path--chosen" d="M100 120 C140 120 150 128 210 128" pathLength={1} />
      <circle className="th-node" cx="100" cy="120" r="9" />
      <circle className="th-end th-end--alt" cx="214" cy="60" r="7" />
      <g className="th-end th-end--chosen">
        <circle cx="214" cy="128" r="12" />
        <path d="M207 128 l5 5 l9 -10" />
      </g>
      <text className="th-tag" x="100" y="100" textAnchor="middle">
        DECISION
      </text>
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
              <Art />
              <p className="th__word">{s.word}</p>
              <p className="th__line">{s.line}</p>
              <p className="th__note">{s.note}</p>
            </li>
          );
        })}
      </ol>

      <div className="th__room" data-reveal>
        <p className="th__k">In the room</p>
        <ol className="th__exp">
          {theme.expect.map((e) => (
            <li key={e.n}>
              <b>{e.n}</b>
              <span className="th__et">{e.t}</span>
              <span className="th__ed">{e.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
