/**
 * Everything the visitor reads, organised as the Three Eras.
 *
 * Product claims are quoted or closely paraphrased from the official sites
 * (source sentence noted beside each). Research signals are verified against
 * the original publisher pages — see docs/next-order-research.md.
 */

export const title = ["The Next", "Order"] as const;

export const hook = "The operating model that built your GCC won’t run it next.";

export const eras = ["The old order", "The inflection point", "The next order"] as const;

export type Signal = {
  figure: string;
  headline: string;
  finding: string;
  kind: "Survey" | "Forecast" | "Industry estimate";
  population: string;
  source: string;
  date: string;
  url: string;
};

/* Era 01 — the old order. It worked; the evidence says so. */
export const oldOrder = {
  kicker: "Era 01 · The old order",
  headline: "Built to scale people.",
  body: "Cost advantage, process discipline and teams that grew layer by layer built India’s GCC ecosystem. That model still works. It wasn’t designed for what comes next.",
  evidence: {
    figure: "1,700+",
    headline: "",
    finding: "GCCs in India, employing over 1.9 million people.",
    kind: "Industry estimate",
    population: "India, FY2024",
    source: "nasscom & Zinnov, India GCC Landscape Report",
    date: "2024",
    url: "https://nasscom.in/knowledge-center/publications/india-gcc-landscape-report-5-year-journey",
  } satisfies Signal,
};

/* Era 02 — the inflection point. Four signals, one arc: investing, experimenting, stalling, leading. */
export const inflection = {
  kicker: "Era 02 · The inflection point",
  headline: "AI changed the rules.",
  body: "Investment is moving fast. Operating models are not. The signals:",
  signals: [
    {
      figure: "58%",
      headline: "The money is moving.",
      finding: "of India-based GCCs are already investing in agentic AI — and another 29% plan to within a year.",
      kind: "Survey",
      population: "GCCs operating from India, Aug–Oct 2025",
      source: "EY GCC Pulse Survey",
      date: "Nov 2025",
      url: "https://www.ey.com/en_in/newsroom/2025/11/58-percent-gccs-in-india-investing-in-agentic-ai-two-third-creating-dedicated-innovation-teams-to-globalize-ideas-ey-gcc-pulse-survey-2025",
    },
    {
      figure: "23%",
      headline: "Few are scaling.",
      finding: "of respondents say their organisations are scaling an agentic AI system somewhere in the enterprise. 62% are at least experimenting.",
      kind: "Survey",
      population: "Global, 1,993 respondents, Jun–Jul 2025",
      source: "McKinsey, The state of AI in 2025",
      date: "Nov 2025",
      url: "https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/the-state-of-ai-in-2025-vf.pdf",
    },
    {
      figure: "40%+",
      headline: "Many will stall.",
      finding: "of agentic AI projects will be canceled by the end of 2027 — on escalating costs, unclear business value or inadequate risk controls.",
      kind: "Forecast",
      population: "Gartner prediction",
      source: "Gartner",
      date: "Jun 2025",
      url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027",
    },
    {
      figure: "8%",
      headline: "Few lead.",
      finding: "of GCCs qualify as top performers across market advantage, innovation and enterprise efficiency.",
      kind: "Survey",
      population: "GCC Survey 2024, N = 150, global",
      source: "BCG, Rewriting the Global Capability Center Playbook",
      date: "Jun 2025",
      url: "https://www.bcg.com/publications/2025/india-rewriting-the-global-capability-center-playbook",
    },
  ] satisfies Signal[],
  closing: "The next order won’t wait for everyone to catch up.",
};

/* Era 03 — the next order: three forces, equal weight. */
export type ForceKey = "velocity" | "synthia" | "select";

export const nextOrder = {
  kicker: "Era 03 · The next order",
  headline: "Three forces. One operating model.",
  closing: "Everything an enterprise needs to become AI\u2011native.",
};

export const forces: {
  key: ForceKey;
  verb: string;
  name: string;
  role: string;
  claim: string;
  detail: string;
  why: string;
  href: string;
  source: string;
}[] = [
  {
    key: "velocity",
    verb: "Build",
    name: "Velocity AI",
    role: "AI-native engineering",
    claim: "A shippable release every Friday.",
    // viamagus.com/velocity-ai: "Three-month timelines become three-to-four weeks,
    // with a shippable submodule delivered every single Friday."
    // "Velocity AI is the operating model rebuilt for AI-native delivery."
    detail: "Three-month timelines become three-to-four weeks — an engineering operating model rebuilt for AI-native delivery.",
    why: "Adding AI tools to an old delivery model doesn’t change the pace. Changing the model does.",
    href: "https://viamagus.com/velocity-ai",
    source: "viamagus.com/velocity-ai",
  },
  {
    key: "synthia",
    verb: "Operate",
    name: "Synthia AI",
    role: "AI-enabled operations",
    claim: "AI that follows your SOP — and stops for your sign-off.",
    // viamagus.com/synthia-ai: "Every business process becomes a governed, auditable,
    // continuously-improving AI workflow." "The AI stops where you told it to and waits for a person."
    detail: "Business processes become governed, auditable AI workflows. Every action, AI and human, is logged.",
    why: "Intelligence only creates value when it runs inside the work — with control built in.",
    href: "https://viamagus.com/synthia-ai",
    source: "viamagus.com/synthia-ai",
  },
  {
    key: "select",
    verb: "Scale",
    name: "ViaMagus Select",
    role: "Talent & capability",
    claim: "Talent built ahead of demand.",
    // viamagusselect.ai: "Your shortlist comes from a bench we build ahead of demand: engineers
    // trained in our 6–8 week AI-native programme and vetted by our own engineers."
    // "Engineer-vetted AI talent, shortlisted in 48 hours."
    detail: "Engineers trained in a 6–8 week AI-native programme, vetted by ViaMagus engineers, shortlisted for your GCC in 48 hours.",
    why: "The next capability isn’t hired from a CV database. It’s built.",
    href: "https://www.viamagusselect.ai/",
    source: "viamagusselect.ai",
  },
];

export const invite = {
  headline: ["The future of your GCC", "is something to build."],
  positioning: "Everything an enterprise needs to become AI\u2011native.",
  from: "An invitation from ViaMagus",
};
