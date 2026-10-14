import Link from "next/link";
import type { CSSProperties } from "react";
import { event, interestUrl, knownFacts, officialLinks, pending, recap, whenWhere } from "@/content/event";
import { forces, forcesHeadline, forcesLede, hook, invite, signal, title } from "@/content/story";
import { SelectWordmark, SynthiaLogo, VelocityWordmark, ViaMagusLogo, ViaMagusMark } from "./Brand";
import { SelectVisual, SynthiaVisual, VelocityVisual } from "./ForceVisuals";
import { ShiftFrame } from "./ShiftFrame";
import { TitleSort } from "./TitleSort";

export const FRAMES = [
  { id: "hook", label: "The Next Order" },
  { id: "shift", label: "The shift" },
  { id: "forces", label: "Three forces" },
  { id: "signal", label: "The signal" },
  { id: "invite", label: "Your next move" },
];

export function Header() {
  return (
    <>
      <a className="skip-link" href="#invite">
        Skip to the invitation
      </a>
      <header className="hdr">
        <ViaMagusLogo href={officialLinks.viamagus} />
        <nav className="hdr__right" aria-label="Frames">
          <ol className="hdr__dots">
            {FRAMES.map((f, i) => (
              <li key={f.id}>
                <a href={`#${f.id}`} data-dot={f.id} aria-current={i === 0 ? "true" : undefined}>
                  <span className="sr-only">{f.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <span className="hdr__count" aria-hidden="true">
            <span id="frame-no">01</span> / 05
          </span>
          <Link className="hdr__film" href="/film">
            <span className="play" aria-hidden="true" />
            Film
          </Link>
        </nav>
      </header>
    </>
  );
}

/* 01 — the hook */
export function Hook() {
  const line = whenWhere();
  return (
    <section id="hook" className="frame frame--hook" data-frame="" data-tone="purple" aria-label="The Next Order">
      <div className="hook">
        <TitleSort lines={title} className="hook__title" showReplay />
        <p className="hook__line">{hook}</p>
      </div>
      <div className="frame__foot">
        <p>
          {invite.from}
          <span className="sep" aria-hidden="true" />
          {line ?? "For GCC leaders · By invitation"}
        </p>
        <a className="cue" href="#shift" aria-label="Next: the shift">
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

/* 02 — the shift */
export function Shift() {
  return (
    <section id="shift" className="frame frame--shift" data-frame="" data-tone="light" aria-labelledby="shift-h">
      <ShiftFrame />
    </section>
  );
}

/* 03 — three forces */
const MARKS = {
  velocity: <VelocityWordmark />,
  synthia: <SynthiaLogo height={34} />,
  select: <SelectWordmark />,
};
const VISUALS = { velocity: <VelocityVisual />, synthia: <SynthiaVisual />, select: <SelectVisual /> };

export function Forces() {
  return (
    <section id="forces" className="frame frame--forces" data-frame="" data-tone="dark" aria-labelledby="forces-h">
      <header className="forces__head">
        <h2 id="forces-h" className="h-xl">
          {forcesHeadline}
        </h2>
        <p className="forces__lede">{forcesLede}</p>
      </header>
      <ol className="forces">
        {forces.map((f, i) => (
          <li key={f.key} className={`force force--${f.key}`} style={{ "--i": i } as CSSProperties}>
            <div className="force__top">
              <span className="force__verb">
                <span className="force__no">0{i + 1}</span> {f.verb}
              </span>
              <span className="force__mark">{MARKS[f.key]}</span>
            </div>
            <div className="force__visual">{VISUALS[f.key]}</div>
            <div className="force__copy">
              <h3 className="force__claim">{f.claim}</h3>
              <p className="force__detail">{f.detail}</p>
              <a className="force__link" href={f.href} target="_blank" rel="noopener noreferrer">
                {f.source} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 04 — the signal */
export function Signal() {
  return (
    <section id="signal" className="frame frame--signal" data-frame="" data-tone="dark" aria-labelledby="signal-h">
      <div className="signal">
        <div className="signal__figure">
          <h2 id="signal-h" className="signal__num">
            <span>{signal.figure}</span>%
          </h2>
          <p className="signal__finding">{signal.finding}</p>
          <p className="signal__src">
            <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer">
              {signal.source}
            </a>
          </p>
        </div>
        <div className="signal__grid" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => {
            const lit = [7, 22, 34, 46, 58, 63, 79, 91].indexOf(i);
            return <i key={i} className={lit >= 0 ? "dot dot--lit" : "dot"} style={{ "--k": lit } as CSSProperties} />;
          })}
        </div>
      </div>
      <div className="signal__after">
        <p className="signal__counter">
          {signal.counter}{" "}
          <a href={signal.counterUrl} target="_blank" rel="noopener noreferrer">
            {signal.counterSource}
          </a>
        </p>
        <p className="signal__closing">{signal.closing}</p>
      </div>
    </section>
  );
}

/* 05 — the invitation */
export function Invite() {
  const rows = [
    { k: "For", v: knownFacts.audience },
    { k: "When & where", v: whenWhere() },
    ...(event.format ? [{ k: "Format", v: event.format }] : []),
    { k: "Hosted by", v: knownFacts.host },
  ];
  return (
    <section id="invite" className="frame frame--invite" data-frame="" data-tone="purple" aria-labelledby="invite-h">
      <div className="invite">
        <div className="invite__lead">
          <h2 id="invite-h" className="h-xl">
            <span className="line">{invite.headline[0]}</span>
            <span className="line line--em">{invite.headline[1]}</span>
          </h2>
          <p className="invite__pos">{invite.positioning}</p>
        </div>
        <div className="card">
          <p className="card__eyebrow">
            <ViaMagusMark className="card__mark" /> {invite.from}
          </p>
          <p className="card__title">The NEXT Order</p>
          <dl className="card__rows">
            {rows.map((r) => (
              <div key={r.k}>
                <dt>{r.k}</dt>
                <dd className={r.v ? "" : "is-pending"}>{r.v ?? pending}</dd>
              </div>
            ))}
            {event.speakers.length ? (
              <div>
                <dt>With</dt>
                <dd>{event.speakers.map((s) => `${s.name}, ${s.role}`).join(" · ")}</dd>
              </div>
            ) : null}
          </dl>
          <a
            className="card__cta"
            href={event.registrationUrl ?? interestUrl}
            target={event.registrationUrl ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            {event.registrationUrl ? "Request your invitation" : "Register your interest"} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <footer className="foot">
        <ViaMagusLogo />
        <ul>
          <li>
            <a href={officialLinks.velocity} target="_blank" rel="noopener noreferrer">
              Velocity AI
            </a>
          </li>
          <li>
            <a href={officialLinks.synthia} target="_blank" rel="noopener noreferrer">
              Synthia AI
            </a>
          </li>
          <li>
            <a href={officialLinks.select} target="_blank" rel="noopener noreferrer">
              ViaMagus Select
            </a>
          </li>
        </ul>
        <p>© {new Date().getFullYear()} ViaMagus Technologies Pvt. Ltd.</p>
      </footer>
    </section>
  );
}

/** Post-event: appears only once real recap material is added to content/event.ts. */
export function Recap() {
  if (!recap.summary && !recap.insights.length && !recap.photos.length) return null;
  return (
    <section id="recap" className="frame frame--recap" data-frame="" data-tone="light" aria-labelledby="recap-h">
      <h2 id="recap-h" className="h-xl">
        What we heard
      </h2>
      {recap.summary ? <p className="recap__summary">{recap.summary}</p> : null}
      <ol className="recap__insights">
        {recap.insights.map((x) => (
          <li key={x.title}>
            <h3>{x.title}</h3>
            <p>{x.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
