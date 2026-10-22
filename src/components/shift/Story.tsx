import type { ReactNode } from "react";

/**
 * The thread through the page: one story in five chapters — how GCCs
 * evolved → what's new → the answer → the evening → your place. The header
 * carries it as a line with five stops that fills as you read (Chrome sets
 * --sf0…--sf3 and the stops' state); each chapter ends by handing the reader
 * to the next with the question that chapter answers.
 */
export const CHAPTERS = [
  { id: "evolve", n: "01", label: "How GCCs evolved" },
  { id: "theme", n: "02", label: "What’s new" },
  { id: "practices", n: "03", label: "The answer" },
  { id: "evening", n: "04", label: "3 December" },
  { id: "request", n: "05", label: "Your place" },
] as const;

export function StoryNav() {
  return (
    <nav className="hdr__nav story" aria-label="The story, in five chapters">
      <ol>
        {CHAPTERS.map((c, k) => (
          <li key={c.id} data-for={c.id}>
            <a href={`#${c.id}`}>
              <span className="story__dot" aria-hidden="true" />
              <b>{c.n}</b>{" "}
              <span className="story__lab">{c.label}</span>
            </a>
            {k < CHAPTERS.length - 1 ? (
              <span className="story__seg" aria-hidden="true">
                <i style={{ ["--f" as string]: `var(--sf${k}, 0)` }} />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
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

/** The end of a chapter: the question it leaves, and the way into the next. */
export function Handoff({ to, children }: { to: (typeof CHAPTERS)[number]["id"]; children: ReactNode }) {
  const c = CHAPTERS.find((x) => x.id === to)!;
  return (
    <a className="handoff" href={`#${c.id}`} data-reveal>
      <span className="handoff__k">
        <span className="chap">{c.n}</span>Next · {c.label}
      </span>
      <span className="handoff__q">{children}</span>
      <span className="handoff__arr" aria-hidden="true">
        ↓
      </span>
    </a>
  );
}
