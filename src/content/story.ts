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
  "The NEXT Order: an invite-only evening for Hyderabad’s GCC leaders and decision-makers on the next order of talent, technology and leadership. Thursday 3 December 2026, from 3:30 PM, at T-Hub, Hyderabad. Organised by ViaMagus with Hyderabad Mavericks.";

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

/* ---------------------------------------------------------------- the three practices (equal weight) */
export type PracticeKey = "velocity" | "synthia" | "select";

export const practices: {
  key: PracticeKey;
  n: string;
  verb: string;
  name: string;
  /** who it's for, in a GCC leader's terms */
  for: string;
  /** verbatim from the official page */
  line: string;
  /** the way into the conversation at the event */
  room: string;
  /** the action on the product's own site */
  go: string;
  href: string;
  source: string;
}[] = [
  {
    key: "velocity",
    n: "A",
    verb: "Build",
    name: "Velocity AI",
    for: "For centres taking on product ownership.",
    // viamagus.com/velocity-ai: "Three-month timelines become three-to-four weeks, with a shippable submodule delivered every single Friday."
    line: "Three-month timelines become three-to-four weeks.",
    room: "Bring a build challenge to the room",
    go: "Let’s build",
    href: "https://viamagus.com/velocity-ai",
    source: "viamagus.com/velocity-ai",
  },
  {
    key: "synthia",
    n: "B",
    verb: "Operate",
    name: "Synthia AI",
    for: "For centres running processes for the enterprise.",
    // viamagus.com/synthia-ai
    line: "Every AI output is a draft until a named officer signs it.",
    room: "Bring a process to the room",
    go: "Let’s automate",
    href: "https://viamagus.com/synthia-ai",
    source: "viamagus.com/synthia-ai",
  },
  {
    key: "select",
    n: "C",
    verb: "Scale",
    name: "ViaMagus Select",
    for: "For centres building capability they don’t have yet.",
    // viamagusselect.ai (hero headline)
    line: "The mandate is yours. So is the team.",
    room: "Bring a hiring brief to the room",
    go: "Let’s hire",
    href: "https://www.viamagusselect.ai/",
    source: "viamagusselect.ai",
  },
];

export const convergence = "Everything an enterprise needs to become AI‑native.";

/* ---------------------------------------------------------------- the invitation */
/** The one call to action, everywhere. Places are confirmed by invitation, so it asks — it never promises. */
export const cta = { primary: "Request your place", submit: "Request my place" };

export const invite = {
  line: "An invitation for Hyderabad’s GCC leaders.",
  who: "For GCC heads and site leaders; CTOs, CIOs and engineering leaders; CHROs and talent leaders.",
  what: "A ViaMagus event on where global centres go next: what they own, the value they create and the capabilities they’ll need.",
  /** the what, in one sentence — used where there's room for only one */
  summary:
    "An invite-only evening at T-Hub, Hyderabad, for GCC leaders and decision-makers — on how AI is reshaping how GCCs hire, build and lead.",
  /** added from the event brief */
  theme:
    "This edition explores how AI and the coming wave of superintelligence are reshaping talent, technology and leadership — for GCC leaders and decision-makers across Hyderabad.",
};

/* ---------------------------------------------------------------- the theme (from the event brief) */
export const theme = {
  kicker: "Why this event",
  headline: "AI is reshaping how GCCs hire, build and lead.",
  lede: "One evening for Hyderabad’s GCC leaders on how centres are thinking about the next 10 to 20 years — as AI and the coming wave of superintelligence reshape talent, technology and leadership.",
  horizon: ["Today", "+10 years", "+20 years"],
  shifts: [
    {
      k: "talent",
      word: "Talent",
      line: "Roles are changing. New ones are emerging.",
      note: "Which roles your centre will need — and which it will grow into.",
      topics: ["Roles that are changing", "Roles that are emerging", "Skills GCCs will need"],
      host: { name: "select by Viamagus", line: "Talent partner for GCCs" },
      today: "The roles you hire for",
      next: "Roles change. New ones appear.",
    },
    {
      k: "technology",
      word: "Technology",
      line: "Agentic workforces, led by people.",
      note: "Rethinking how technology gets built when agents do the work and humans lead and oversee it.",
      topics: ["Building systems with AI", "Agentic workforces", "Human oversight"],
      host: { name: "Synthia AI and Velocity AI", line: "Two ways to put AI to work" },
      today: "People do the work",
      next: "Agents do the work. People lead it.",
    },
    {
      k: "leadership",
      word: "Leadership",
      line: "Sound decisions about AI.",
      note: "How leaders adapt to make AI decisions they can stand behind.",
      topics: ["How leaders adapt", "Becoming AI decision-makers"],
      host: { name: "AI upskilling", line: "For GCC leaders" },
      today: "Many AI options",
      next: "One sound call, owned by a leader.",
    },
  ],
  expect: [
    { n: "01", t: "Leadership panels and discussions", d: "Two leadership panels. Topics and speakers to be announced." },
    { n: "02", t: "Networking with Hyderabad’s GCC leaders", d: "From arrivals at 3:30 PM through cocktails and the networking dinner." },
  ],
};

/* ---------------------------------------------------------------- how ViaMagus fits (from the event brief) */
export const positioning = {
  lede: "ViaMagus builds technology platforms and solutions for large MNCs and GCCs. ViaMagus Select brings the talent and hiring support to scale them.",
  programme: {
    k: "For leaders",
    title: "AI training",
    line: "Upskills leaders to become AI decision-makers.",
  },
  /* Build-Operate-Transfer — the brochure’s words */
  bot: {
    k: "select · Build-Operate-Transfer",
    title: "The GCC before your GCC.",
    line: "We stand up and run your India team until your GCC is ready, then it transfers to you.",
    steps: [
      { k: "build", word: "Build", when: "8 weeks", d: "We stand up your India team — engineers AI-native in eight weeks." },
      { k: "operate", word: "Operate", when: "Until you’re ready", d: "We run it until your GCC is ready." },
      { k: "transfer", word: "Transfer", when: "Then", d: "It transfers to you." },
    ],
  },
};
