/**
 * Everything the visitor reads. The narrative is THEN → NOW → NEXT: how a
 * global centre's mandate can grow, told as three eras. It follows the
 * corrected GCC strategy notes (internal; local copy at docs/strategy-notes.md, not committed):
 *  - the story is the centre's mandate, ownership, capability and value — not AI;
 *  - centres differ; nothing here says every GCC follows one path;
 *  - GCC → GIC → ? is a naming question, labelled exploratory, never a prediction.
 *
 * Every figure is quoted from its publisher (docs/next-order-research.md).
 * Every product line is quoted from the official product page (source beside it).
 */

export type Evidence = {
  figure: string;
  finding: string;
  source: string;
  date: string;
  url: string;
};

export const tagline = "Where was your centre, where is it now — and where could it go next?";

export const description =
  "An invitation from ViaMagus to India’s GCC leaders: a conversation about where global centres go next — what they own, the value they create and the capabilities they’ll need.";

/* ---------------------------------------------------------------- THEN */
export const then = {
  sheet: "01",
  era: "The old order",
  label: "Then",
  headline: "The room you were given.",
  body: "Many centres began by bringing defined work in‑house: enterprise systems, finance and accounts, technology operations, internal platforms. The brief was written elsewhere. The job was to run it well — and many did.",
  caveat: "Centres began in different places. This is one common starting point, not everyone’s.",
  bays: ["Enterprise systems", "Finance & accounts", "Technology operations", "Internal platforms"],
  evidence: {
    figure: "1,700+",
    finding: "GCCs in India, employing over 1.9 million people.",
    source: "nasscom & Zinnov, India GCC Landscape Report",
    date: "FY2024",
    url: "https://nasscom.in/knowledge-center/publications/india-gcc-landscape-report-5-year-journey",
  } satisfies Evidence,
};

/* ---------------------------------------------------------------- NOW */
const EY = {
  source: "EY GCC Pulse Survey 2025 · India-based GCCs",
  date: "Nov 2025",
  url: "https://www.ey.com/en_in/newsroom/2025/11/58-percent-gccs-in-india-investing-in-agentic-ai-two-third-creating-dedicated-innovation-teams-to-globalize-ideas-ey-gcc-pulse-survey-2025",
};

export const now = {
  sheet: "02",
  era: "The inflection point",
  label: "Now",
  headline: "The walls are moving.",
  body: "Some centres still run what they were given. Others now own products, platforms, decisions and outcomes. Most sit somewhere in between — and are being asked to prove the value of where they stand.",
  evidence: [
    { figure: "92%", finding: "aim to deliver value beyond cost arbitrage.", ...EY },
    { figure: "52%", finding: "hold shared accountability for global decisions. Another 26% are formally consulted.", ...EY },
    { figure: "67%", finding: "are creating dedicated innovation teams to generate, test and globalise ideas from India.", ...EY },
  ] satisfies Evidence[],
  counterpoint: {
    figure: "8%",
    finding: "of GCCs have advanced significantly across innovation, competitive differentiation and operational efficiency.",
    source: "BCG, Rewriting the Global Capability Center Playbook",
    date: "Jun 2025",
    url: "https://www.bcg.com/publications/2025/india-rewriting-the-global-capability-center-playbook",
  } satisfies Evidence,
  /** the value lens from the strategy notes — a lens, not a maturity ladder */
  lens: [
    { k: "Product", q: "Is what we build getting stronger?" },
    { k: "Systems + quality", q: "Do our systems work, and is quality reliable?" },
    { k: "Efficiency", q: "Is the work more effective — not only cheaper?" },
    { k: "Capability + scale", q: "Can we grow capability without losing quality?" },
  ],
  lensNote: "A lens, not a ladder. Every centre weighs these differently.",
};

/* ---------------------------------------------------------------- the naming question (exploratory) */
export const naming = {
  sheet: "02·B",
  labels: [
    { k: "GCC", v: "Global Capability Centre" },
    { k: "GIC", v: "Global In‑house Centre — or Global Innovation Centre, depending on who you ask" },
  ],
  body: "There is no agreed next name, and a new name doesn’t make a new mandate. So try it the other way round: start with what your centre owns.",
  owns: ["Products", "Platforms", "Decisions", "Quality", "Innovation", "Capability", "Outcomes"],
  note: "Exploratory. Your label — not an industry term or a prediction.",
};

/* ---------------------------------------------------------------- NEXT */
export const next = {
  sheet: "03",
  era: "The next order",
  label: "Next",
  headline: "The room you’ll build.",
  question: "What should the next chapter of your GCC look like?",
  body: "Not every centre should take the same path. But every centre will be asked what it owns, what value it creates and what it needs to grow — by people who weren’t in the room when it was set up.",
  rooms: ["Product", "Platforms", "Decisions", "Quality", "Capability"],
};

/** Framing questions, one per seat. These frame the conversation; they are not the agenda. */
export const seats: { seat: string; q: string }[] = [
  { seat: "CEO / MD", q: "What does your centre own today that it didn’t three years ago — and what should it own next?" },
  { seat: "Site leader", q: "How do you make the case to global leadership for your centre’s next mandate?" },
  { seat: "Technology leader", q: "Which products and platforms should be built from India — not just run from here?" },
  { seat: "CHRO / Talent", q: "Which capabilities does the next mandate need — before it arrives?" },
];

/* ---------------------------------------------------------------- the three practices (equal weight) */
export type PracticeKey = "velocity" | "synthia" | "select";

export const practices: {
  key: PracticeKey;
  n: string;
  verb: string;
  name: string;
  role: string;
  line: string;
  /** verbatim from the official page */
  quotes: string[];
  href: string;
  source: string;
}[] = [
  {
    key: "velocity",
    n: "A",
    verb: "Build",
    name: "Velocity AI",
    role: "AI-native engineering",
    // viamagus.com/velocity-ai
    line: "When the next mandate is a product, it has to ship.",
    quotes: [
      "Three-month timelines become three-to-four weeks, with a shippable submodule delivered every single Friday.",
      "Velocity AI is the operating model rebuilt for AI-native delivery.",
      "Shippable means shippable: to production, not just to a reviewer’s browser.",
    ],
    href: "https://viamagus.com/velocity-ai",
    source: "viamagus.com/velocity-ai",
  },
  {
    key: "synthia",
    n: "B",
    verb: "Operate",
    name: "Synthia AI",
    role: "AI-native business processes",
    // viamagus.com/synthia-ai
    line: "When the next mandate is a process, it has to stay in control.",
    quotes: [
      "Every business process becomes a governed, auditable, continuously-improving AI workflow.",
      "The AI follows your playbook, not its own.",
      "Every AI output is a draft until a named officer signs it.",
    ],
    href: "https://viamagus.com/synthia-ai",
    source: "viamagus.com/synthia-ai",
  },
  {
    key: "select",
    n: "C",
    verb: "Scale",
    name: "ViaMagus Select",
    role: "Specialist technology talent",
    // viamagusselect.ai
    line: "When the next mandate needs capability you don’t have yet, it needs the right people — judged by engineers.",
    quotes: [
      "The mandate is yours. So is the team.",
      "We match pre-vetted engineers from our bench, engineers who ship AI assess them, and you get written verdicts in 48 hours.",
      "Recruiters send CVs. We send verdicts.",
    ],
    href: "https://www.viamagusselect.ai/",
    source: "viamagusselect.ai",
  },
];

export const convergence = {
  line: "Everything an enterprise needs to become AI‑native.",
  by: "Build · Operate · Scale — three practices, one ViaMagus.",
};

/* ---------------------------------------------------------------- your next move */
export const invite = {
  sheet: "04",
  headline: "Your next move.",
  what: "The NEXT Order is a ViaMagus event for India’s GCC leaders about where global centres go next: what they own, the value they create and the capabilities they’ll need.",
  why: "Because a centre’s next mandate is rarely handed over. It is earned and argued for — and it helps to think it through with peers making the same case.",
  who: ["GCC CEOs, MDs and senior executives", "Site heads and site leaders", "Technology and engineering leaders", "CHROs, HR and talent acquisition leaders"],
};
