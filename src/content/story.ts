/**
 * Every word the visitor reads. Deliberately few: the artwork carries the
 * story (components/shift/ShiftArt.tsx); the words name each moment.
 *
 * Shaped by the corrected GCC strategy notes (internal; not published):
 * the story is a centre's evolving mandate and value — not AI; centres
 * differ, so the next state is a question, not a prescription; Viamagus
 * Select is framed by the mandate it serves, never by CV supply.
 *
 * Figures are quoted from their publishers (docs/next-order-research.md);
 * product lines are verbatim from the official pages (source beside each).
 */

export type Evidence = { figure: string; finding: string; source: string; date: string; url: string };

export const description =
  "The NEXT Order: an invite-only symposium for Hyderabad’s GCC leaders and decision-makers on the next order of talent, technology and leadership. Thursday 3 December 2026, from 3:30 PM, at T-Hub, Hyderabad. Organised by Viamagus with Hyderabad Mavericks.";

export const tagline = "Where was your centre, where is it now — and where could it go next?";

/** The three eras on the ring of years — one headline, one line a leader recognises, one sourced number. */
export const shift: { n: string; years: string; era: string; headline: string; line: string; evidence?: Evidence }[] = [
  {
    n: "I",
    years: "2016–2019",
    era: "The old order",
    headline: "Built to execute.",
    line: "The brief came from HQ. Success was measured in cost, SLAs and headcount.",
    evidence: {
      figure: "1,700+",
      finding: "GCCs in India today",
      source: "nasscom & Zinnov",
      date: "FY2024",
      url: "https://nasscom.in/knowledge-center/publications/india-gcc-landscape-report-5-year-journey",
    },
  },
  {
    n: "II",
    years: "2020–2024",
    era: "The inflection point",
    headline: "Then the mandate grew.",
    line: "The question changed from ‘how much cheaper?’ to ‘what can you own?’",
    evidence: {
      figure: "92%",
      finding: "of India-based GCCs now aim beyond cost arbitrage",
      source: "EY GCC Pulse Survey",
      date: "2025",
      url: "https://www.ey.com/en_in/newsroom/2025/11/58-percent-gccs-in-india-investing-in-agentic-ai-two-third-creating-dedicated-innovation-teams-to-globalize-ideas-ey-gcc-pulse-survey-2025",
    },
  },
  {
    n: "III",
    years: "2025 onward",
    era: "The next order",
    headline: "Built to own, create and lead.",
    line: "Products, platforms and decisions — run from India. What will yours own next?",
  },
];

export const convergence = "Everything an enterprise needs to become AI‑native.";

/* ---------------------------------------------------------------- the invitation */
/** The one call to action, everywhere. Places are confirmed by invitation, so it asks — it never promises. */
export const cta = { primary: "Request your place", submit: "Request my place" };

export const invite = {
  line: "An invitation for Hyderabad’s GCC leaders.",
  who: "For GCC heads and site leaders; CTOs, CIOs and engineering leaders; CHROs and talent leaders.",
  what: "A Viamagus event on where global centres go next: what they own, the value they create and the capabilities they’ll need.",
  /** the what, in one sentence — used where there's room for only one */
  summary:
    "An invite-only symposium at T-Hub, Hyderabad, for GCC leaders and decision-makers — on how AI is reshaping the way GCCs hire, build and lead.",
  /** added from the event brief */
  theme:
    "This edition explores how AI and the coming wave of superintelligence are reshaping talent, technology and leadership — for GCC leaders and decision-makers across Hyderabad.",
};

/* ---------------------------------------------------------------- the theme (from the event brief) */
export const theme = {
  /** the final brochure's "Why this event", verbatim */
  question: ["Your centre was built to execute.", "What will it own next?"],
  headline: "AI is reshaping how GCCs hire, build and lead.",
  lede: "A conversation on how centres are thinking about the next 10 to 20 years.",
  /** the headline's three verbs, each with the brochure's topics — nothing more */
  shifts: [
    { k: "talent", word: "Talent", verb: "Hire", topics: ["Roles that are changing", "Roles that are emerging", "Skills GCCs will need"] },
    { k: "technology", word: "Technology", verb: "Build", topics: ["Building systems with AI", "Agentic workforces", "Human oversight"] },
    { k: "leadership", word: "Leadership", verb: "Lead", topics: ["How leaders adapt", "Becoming AI decision-makers"] },
  ],
  who: ["GCC heads and site leaders", "CTOs, CIOs and engineering leaders", "CHROs and talent leaders"],
  expect: [
    "Leadership panels and discussions",
    "A practical playbook for responsible AI",
    "Networking with Hyderabad’s GCC leaders",
    "Leave with a sharper case for HQ",
  ],
  close: ["Every centre’s plan is different.", "That is the conversation."],
};

