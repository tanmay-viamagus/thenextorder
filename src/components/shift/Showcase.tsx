import Image from "next/image";
import type { CSSProperties } from "react";
import { LinkedInMark } from "@/components/Brand";
import { organisations, organisationsCopy, placeholderTiles, type Organisation } from "@/content/organisations";
import { speakerGroups, speakersCopy, type Speaker } from "@/content/speakers";
import { keep } from "@/lib/text";

/**
 * After the meeting point: who is on stage, on near-black, then the
 * organisations around the evening, on cream. Each is drawn from its data
 * file (content/speakers.ts, content/organisations.ts) and stays off the page
 * until that file has entries — the logo wall holds blank tiles meanwhile,
 * if asked to.
 */

type Copy = { label: string; title: string[]; intro: string | null };

/** two portraits a row on phones, three on tablets, four on desktops, five on wide screens */
const PORTRAIT_SIZES = "(max-width: 759px) 50vw, (max-width: 1079px) 33vw, (max-width: 1699px) 25vw, 20vw";

/** The label, the two-tone heading and a line beside it — the same head for both sections. */
function Head({ id, copy }: { id: string; copy: Copy }) {
  return (
    <div className="show__head" data-reveal>
      <div>
        <p className="show__k">{copy.label}</p>
        <h2 id={id} className="show__h">
          {copy.title[0]} <span>{copy.title[1]}</span>
        </h2>
      </div>
      {copy.intro ? <p className="show__intro">{keep(copy.intro)}</p> : null}
    </div>
  );
}

/** "Priya Raman" → "PR": what stands in until a photo is supplied. */
const initials = (name: string) => {
  const w = name.split(/\s+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[w.length - 1][0] : (w[0] ?? "").slice(0, 2)).toUpperCase();
};

/** One person: the portrait, name, designation and organisation; LinkedIn on the portrait's corner when given. */
export function SpeakerCard({ person, index }: { person: Speaker; index: number }) {
  const { name, role, company, photo, photoFocus, linkedin, bio } = person;
  return (
    <li className="spk" style={{ "--i": index } as CSSProperties}>
      <div className="spk__photo">
        {photo ? (
          // the name sits right beneath it, so the portrait needs no words of its own
          <Image src={photo} alt="" fill sizes={PORTRAIT_SIZES} style={photoFocus ? { objectPosition: photoFocus } : undefined} />
        ) : (
          <span className="spk__initials" aria-hidden="true">
            {initials(name)}
          </span>
        )}
      </div>
      <div className="spk__body">
        <h4 className="spk__name">{name}</h4>
        {role ? <p className="spk__role">{keep(role)}</p> : null}
        {company ? <p className="spk__co">{keep(company)}</p> : null}
        {/* the bio waits behind a toggle, so the cards in a row stay level */}
        {bio ? (
          <details className="spk__bio">
            <summary>
              Profile<span className="sr-only">: {name}</span>
            </summary>
            <p>{keep(bio)}</p>
          </details>
        ) : null}
      </div>
      {linkedin ? (
        <a className="spk__in" href={linkedin} target="_blank" rel="noopener noreferrer">
          <LinkedInMark />
          <span className="sr-only">{name} on LinkedIn (opens in a new tab)</span>
        </a>
      ) : null}
    </li>
  );
}

export function Speakers() {
  const groups = speakerGroups.filter((g) => g.people.length);
  if (!groups.length) return null;
  return (
    <section id="speakers" className="show show--dark" data-tone="dark" aria-labelledby="speakers-h">
      <Head id="speakers-h" copy={speakersCopy} />
      {groups.map((g) => (
        <div key={g.title} className="spk-group">
          <div className="spk-group__h" data-reveal>
            <h3>{g.title}</h3>
            {g.note ? <p>{keep(g.note)}</p> : null}
          </div>
          <ul className="spk-grid" data-reveal>
            {g.people.map((p, k) => (
              <SpeakerCard key={p.name} person={p} index={k} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** One logo, fitted inside its tile at its own proportions; the name, set in type, until a logo is supplied. */
export function LogoTile({ org, index }: { org: Organisation; index: number }) {
  const { name, logo, treatment = "mono", scale = 1 } = org;
  return (
    <li className="org" style={{ "--i": index } as CSSProperties}>
      <div className={`org__tile org__tile--${treatment}`}>
        {logo ? (
          <span className="org__logo" style={{ "--scale": Math.min(1.4, Math.max(0.6, scale)) } as CSSProperties}>
            <Image src={logo} alt={name} fill sizes="(max-width: 759px) 40vw, 240px" />
          </span>
        ) : (
          <span className="org__name">{keep(name)}</span>
        )}
      </div>
    </li>
  );
}

/** A blank tile holding a logo's place: a faint mark, nothing read out. */
function PlaceholderTile({ index }: { index: number }) {
  return (
    <li className="org" style={{ "--i": index } as CSSProperties}>
      <div className="org__tile org__tile--empty">
        <span className="org__ph" />
      </div>
    </li>
  );
}

export function Organisations() {
  const blanks = organisations.length ? 0 : placeholderTiles;
  if (!organisations.length && !blanks) return null;
  return (
    <section id="organisations" className="show show--light" data-tone="light" aria-labelledby="organisations-h">
      <Head id="organisations-h" copy={organisationsCopy} />
      <ul className="org-wall" data-reveal aria-hidden={blanks ? true : undefined}>
        {blanks
          ? Array.from({ length: blanks }, (_, k) => <PlaceholderTile key={k} index={k} />)
          : organisations.map((o, k) => <LogoTile key={o.name} org={o} index={k} />)}
      </ul>
    </section>
  );
}
