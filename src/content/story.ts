/**
 * Everything the visitor reads. Five frames, one idea each.
 *
 * Product claims are quoted or closely paraphrased from the official sites,
 * with the source sentence noted beside each — nothing here is invented.
 */

export const title = ["The Next", "Order"] as const;

export const hook = "The operating model that built your GCC won’t run it next.";

export const shift = {
  label: "The shift",
  last: {
    name: "The last order",
    headline: "Built to scale people.",
    caption: "Layers of functions. Work handed down the pyramid. Growth meant more of everything.",
  },
  next: {
    name: "The next order",
    headline: "Built to scale capability.",
    caption: "The same talent, re-ordered around three forces — with AI working inside the system, not beside it.",
  },
  legendPeople: "People",
  legendAgents: "AI agents",
};

export type ForceKey = "velocity" | "synthia" | "select";

export const forces: {
  key: ForceKey;
  verb: string;
  name: string;
  claim: string;
  detail: string;
  href: string;
  source: string;
}[] = [
  {
    key: "velocity",
    verb: "Build",
    name: "Velocity AI",
    claim: "A shippable release every Friday.",
    // viamagus.com/velocity-ai: "Three-month timelines become three-to-four weeks,
    // with a shippable submodule delivered every single Friday."
    detail: "Three-month timelines become three-to-four weeks.",
    href: "https://viamagus.com/velocity-ai",
    source: "viamagus.com/velocity-ai",
  },
  {
    key: "synthia",
    verb: "Operate",
    name: "Synthia AI",
    claim: "AI that follows your SOP — and stops for your sign-off.",
    // viamagus.com/synthia-ai: "The AI stops where you told it to and waits for a person."
    // "Every action logged — AI and human — is fully auditable."
    detail: "Every action, AI and human, logged and auditable.",
    href: "https://viamagus.com/synthia-ai",
    source: "viamagus.com/synthia-ai",
  },
  {
    key: "select",
    verb: "Scale",
    name: "ViaMagus Select",
    claim: "Not 50 CVs. 3–5 people you can hire.",
    // viamagusselect.ai: "3–5 people you can hire. Not 50 CVs."
    // "Your GCC’s next AI hire, shortlisted in 48 hours"
    detail: "Engineer-vetted AI talent, shortlisted in 48 hours.",
    href: "https://www.viamagusselect.ai/",
    source: "viamagusselect.ai",
  },
];

export const forcesHeadline = "Build. Operate. Scale.";
export const forcesLede = "Three forces. One operating model.";

export const signal = {
  label: "The signal",
  figure: 8,
  finding: "of GCCs qualify as top performers across market advantage, innovation and efficiency.",
  source: "BCG, Rewriting the Global Capability Center Playbook, June 2025 · GCC Survey 2024, N = 150",
  sourceUrl: "https://www.bcg.com/publications/2025/india-rewriting-the-global-capability-center-playbook",
  counter: "Meanwhile, 58% of India-based GCCs are already investing in agentic AI.",
  counterSource: "EY GCC Pulse Survey, Nov 2025",
  counterUrl:
    "https://www.ey.com/en_in/newsroom/2025/11/58-percent-gccs-in-india-investing-in-agentic-ai-two-third-creating-dedicated-innovation-teams-to-globalize-ideas-ey-gcc-pulse-survey-2025",
  closing: "The next order won’t wait for everyone to catch up.",
};

export const invite = {
  label: "Your next move",
  headline: ["The future of your GCC", "is something to build."],
  positioning: "Everything an enterprise needs to become AI-native.",
  from: "An invitation from ViaMagus",
};
