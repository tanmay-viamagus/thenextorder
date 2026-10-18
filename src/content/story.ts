/**
 * Every word the visitor reads. Deliberately few: the artwork carries the
 * story (components/shift/ShiftArt.tsx); the words name each moment.
 *
 * Shaped by the corrected GCC strategy notes (internal; not published):
 * the story is a centre's evolving mandate and value — not AI; centres
 * differ, so the next state is a question, not a prescription; ViaMagus
 * Select is framed by the mandate it serves, never by CV supply.
 *
 * Figures are quoted from their publishers (docs/next-order-research.md);
 * product lines are verbatim from the official pages (source beside each).
 */

export type Evidence = { figure: string; finding: string; source: string; date: string; url: string };

export const description =
  "An invitation from ViaMagus to India’s GCC leaders: a conversation about where global centres go next — what they own, the value they create and the capabilities they’ll need.";

export const tagline = "Where was your centre, where is it now — and where could it go next?";

/** The three states of the shift — one headline each. */
export const shift: { n: string; era: string; headline: string; evidence?: Evidence; coda?: string }[] = [
  {
    n: "I",
    era: "The old order",
    headline: "The work you were given.",
    evidence: {
      figure: "1,700+",
      finding: "GCCs in India, employing over 1.9 million people",
      source: "nasscom & Zinnov",
      date: "FY2024",
      url: "https://nasscom.in/knowledge-center/publications/india-gcc-landscape-report-5-year-journey",
    },
  },
  {
    n: "II",
    era: "The inflection point",
    headline: "Then the walls moved.",
    evidence: {
      figure: "92%",
      finding: "of India-based GCCs aim to deliver value beyond cost arbitrage",
      source: "EY GCC Pulse Survey",
      date: "2025",
      url: "https://www.ey.com/en_in/newsroom/2025/11/58-percent-gccs-in-india-investing-in-agentic-ai-two-third-creating-dedicated-innovation-teams-to-globalize-ideas-ey-gcc-pulse-survey-2025",
    },
  },
  {
    n: "III",
    era: "The next order",
    headline: "What will your centre own next?",
    coda: "Every centre’s plan is different. That is the conversation.",
  },
];

/* ---------------------------------------------------------------- the three practices (equal weight) */
export type PracticeKey = "velocity" | "synthia" | "select";

export const practices: {
  key: PracticeKey;
  n: string;
  verb: string;
  name: string;
  /** verbatim from the official page */
  line: string;
  href: string;
  source: string;
}[] = [
  {
    key: "velocity",
    n: "A",
    verb: "Build",
    name: "Velocity AI",
    // viamagus.com/velocity-ai: "Three-month timelines become three-to-four weeks, with a shippable submodule delivered every single Friday."
    line: "Three-month timelines become three-to-four weeks.",
    href: "https://viamagus.com/velocity-ai",
    source: "viamagus.com/velocity-ai",
  },
  {
    key: "synthia",
    n: "B",
    verb: "Operate",
    name: "Synthia AI",
    // viamagus.com/synthia-ai
    line: "Every AI output is a draft until a named officer signs it.",
    href: "https://viamagus.com/synthia-ai",
    source: "viamagus.com/synthia-ai",
  },
  {
    key: "select",
    n: "C",
    verb: "Scale",
    name: "ViaMagus Select",
    // viamagusselect.ai (hero headline)
    line: "The mandate is yours. So is the team.",
    href: "https://www.viamagusselect.ai/",
    source: "viamagusselect.ai",
  },
];

export const convergence = "Everything an enterprise needs to become AI‑native.";

/* ---------------------------------------------------------------- the invitation */
export const invite = {
  line: "An invitation for India’s GCC leaders.",
  who: "For GCC CEOs and MDs, site leaders, technology and engineering leaders, CHROs and talent leaders.",
  what: "A ViaMagus event on where global centres go next: what they own, the value they create and the capabilities they’ll need.",
};
