import type { ReactNode } from "react";

/**
 * The thread through the page: one journey in four chapters — the road so
 * far (how GCCs are evolving) → the meeting point (the symposium: the film
 * and the agenda) → the conversation (why attend) → your place (the form).
 * Every chapter name comes from here: the header's line, each chapter's
 * label and each hand-off all say the same thing.
 *
 * The header carries the story as one straight line with four evenly spaced
 * stops; it fills as you read (Chrome sets --sp, 0 → 1, and the stops'
 * state). Each chapter ends the same way: a line drawn across, a statement,
 * and the question the next chapter answers.
 */
export const CHAPTERS = [
  { id: "evolve", n: "01", label: "The road so far" },
  { id: "evening", n: "02", label: "The meeting point" },
  { id: "theme", n: "03", label: "The conversation" },
  { id: "request", n: "04", label: "Your place" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const chapter = (id: ChapterId) => CHAPTERS.find((c) => c.id === id)!;

/** A chapter's label: the stop on the line, its number and its name. */
export function ChapterLabel({ id }: { id: ChapterId }) {
  const c = chapter(id);
  return (
    <span className="chapter">
      <span className="chap">
        {c.n}
        <span className="chapter__of">/{String(CHAPTERS.length).padStart(2, "0")}</span>
      </span>
      {c.label}
    </span>
  );
}

export function StoryNav() {
  return (
    <nav className="hdr__nav story" aria-label="The story, in four chapters">
      <ol>
        {CHAPTERS.map((c) => (
          <li key={c.id} data-for={c.id}>
            <a href={`#${c.id}`}>
              <span className="story__dot" aria-hidden="true" />
              <span className="story__lab">
                <b>{c.n}</b> <span className="story__name">{c.label}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <span className="story__track" aria-hidden="true">
        <i />
      </span>
    </nav>
  );
}

/** Phones: the same line, as a hairline under the header. */
export function StoryStrip() {
  return (
    <span className="story-m" aria-hidden="true">
      <i />
    </span>
  );
}

/** The end of a chapter: a statement, the question it leaves, and the way into the next. */
export function Handoff({ to, lead, ask }: { to: ChapterId; lead: ReactNode; ask: ReactNode }) {
  const c = chapter(to);
  return (
    <a className="handoff" href={`#${c.id}`} data-reveal>
      <span className="handoff__k">
        Next <span aria-hidden="true">→</span> {c.n}
        <span className="handoff__of">/{String(CHAPTERS.length).padStart(2, "0")}</span>
        <span className="handoff__dash" aria-hidden="true" />
        {c.label}
      </span>
      <span className="handoff__q">
        {lead} <span className="handoff__ask">{ask}</span>
      </span>
      <span className="handoff__arr" aria-hidden="true">
        ↓
      </span>
    </a>
  );
}
