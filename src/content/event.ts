/**
 * Verified event facts only.
 *
 * Every field stays `null` until Viamagus confirms it; the UI then shows the
 * neutral fallback instead of a guessed value. Filling these in is the single
 * biggest lever on whether a GCC leader says yes — see docs/self-audit.md.
 */
export type EventDetails = {
  /** e.g. "Thursday, 12 March 2027" */
  date: string | null;
  /** e.g. "From 3:30 PM" */
  time: string | null;
  /** ISO start, for calendars and structured data */
  start: string | null;
  /** e.g. "Bengaluru" */
  city: string | null;
  venue: string | null;
  /** e.g. "Closed-door · 30 GCC leaders · Chatham House rule" */
  format: string | null;
  /** Named hosts or speakers, e.g. [{ name: "…", role: "…" }] */
  speakers: { name: string; role: string }[];
  /** The confirmed RSVP destination. */
  registrationUrl: string | null;
};

// confirmed in the event brochure (Oct 2026)
export const event: EventDetails = {
  date: "Thursday 3 December 2026",
  time: "From 3:30 PM",
  start: "2026-12-03T15:30:00+05:30",
  city: "Hyderabad",
  venue: "T-Hub",
  format: "By invitation",
  speakers: [],
  registrationUrl: null,
};

/** Until a dedicated RSVP exists, interest goes to the official Viamagus contact section. */
export const interestUrl = "https://viamagus.com/#contact";

/** The contact address published on viamagus.com (verified Oct 2026). The invitation form addresses requests here. */
export const contactEmail = "hi@viamagus.com";

export const pending = "To be announced";

/** What is already true about the event, from the brief. */
export const knownFacts = {
  audience: "Hyderabad’s GCC leaders",
  host: "Viamagus",
  /** ecosystem partner — local visibility and credibility in Hyderabad’s GCC community */
  partner: "Hyderabad Mavericks",
  /** the brochure’s line on the partner */
  partnerLine:
    "Hyderabad Mavericks is a group of leaders supporting Hyderabad as a thriving ecosystem for GCC growth, innovation and start-ups.",
};

/** Organised by — the final brochure's lines, verbatim. Sits with the agenda. */
export const organisers: { role: string; name: string; line: string; logo?: "mavericks" }[] = [
  {
    role: "Organised by",
    name: "Viamagus",
    line: "Viamagus is a technology company that builds platforms and solutions for large MNCs and GCCs, and the AI talent to run them.",
  },
  {
    role: "Ecosystem partner",
    name: "Hyderabad Mavericks",
    line: "Hyderabad Mavericks is a group of leaders supporting Hyderabad as a thriving ecosystem for GCC growth, innovation and start-ups.",
    logo: "mavericks",
  },
];

/** The tentative agenda, from the final brochure. Only the start is timed; the rest is announced later. */
export const agenda: { k: string; t: string; time?: string; kind?: string; tag?: string }[] = [
  { k: "arrive", time: "3:30 PM", t: "Arrival and registration" },
  { k: "welcome", t: "Welcome address" },
  { k: "panel-1", kind: "Panel discussion", t: "Rethinking GCC strategy in an AI-first world" },
  { k: "talk", kind: "Expert talk", t: "Adopting responsible AI" },
  { k: "panel-2", kind: "Panel discussion", t: "Hiring and people leadership in the age of the agentic workforce" },
  { k: "demo", t: "Synthia AI, live demo", tag: "Live" },
  { k: "dinner", t: "Cocktail dinner" },
];
export const agendaNote = "Tentative. Timings, speakers and final panel themes to be announced.";

export function whenWhere(e: EventDetails = event): string | null {
  const parts = [e.date, [e.venue, e.city].filter(Boolean).join(", ")].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

/** Post-event continuity: the recap frame renders only once real material exists. */
export const recap: {
  summary: string | null;
  insights: { title: string; body: string }[];
  photos: { src: string; alt: string }[];
} = {
  summary: null,
  insights: [],
  photos: [],
};

export const officialLinks = {
  viamagus: "https://viamagus.com/",
  velocity: "https://viamagus.com/velocity-ai",
  synthia: "https://viamagus.com/synthia-ai",
  select: "https://www.viamagusselect.ai/",
  linkedin: "https://www.linkedin.com/company/viamagusselect/?viewAsMember=true",
  privacy: "https://viamagus.com/privacy-policy",
} as const;

/** One line: when and where, e.g. "Thursday 3 December 2026 · From 3:30 PM · T-Hub, Hyderabad". Unconfirmed parts say so. */
export function statusLine(e: EventDetails = event): string {
  const place = [e.venue, e.city].filter(Boolean).join(", ");
  const parts: string[] = [];
  if (e.date) parts.push(e.date);
  if (e.time) parts.push(e.time);
  if (e.venue) parts.push(place);
  else {
    if (e.city) parts.push(e.city);
    parts.push(e.date ? "Venue to be announced" : "Date & venue to be announced");
  }
  return parts.join(" · ");
}
