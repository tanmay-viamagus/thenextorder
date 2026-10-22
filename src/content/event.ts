/**
 * Verified event facts only.
 *
 * Every field stays `null` until ViaMagus confirms it; the UI then shows the
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

/** Until a dedicated RSVP exists, interest goes to the official ViaMagus contact section. */
export const interestUrl = "https://viamagus.com/#contact";

/** The contact address published on viamagus.com (verified Oct 2026). The invitation form addresses requests here. */
export const contactEmail = "hi@viamagus.com";

export const pending = "To be announced";

/** What is already true about the event, from the brief. */
export const knownFacts = {
  audience: "Hyderabad’s GCC leaders",
  host: "ViaMagus",
  /** ecosystem partner — local visibility and credibility in Hyderabad’s GCC community */
  partner: "Hyderabad Mavericks",
  featuring: "Velocity AI · Synthia AI · ViaMagus Select",
  /** the brochure’s line on the partner */
  partnerLine:
    "Hyderabad Mavericks is a group of leaders supporting Hyderabad as a thriving ecosystem for GCC growth, innovation and start-ups.",
};

/** Organised by — one line each, no pitch. Sits with the agenda. */
export const organisers = [
  { role: "Organised by", name: "Viamagus", line: "Builds technology platforms and solutions for large MNCs and GCCs." },
  {
    role: "Ecosystem partner",
    name: "Hyderabad Mavericks",
    line: "A group of leaders supporting Hyderabad as a thriving ecosystem for GCC growth, innovation and start-ups.",
  },
];

/** The tentative agenda, from the brochure. Only the start is timed; the rest is announced later. */
export const agenda: { k: string; t: string; time?: string; d?: string; tag?: string }[] = [
  { k: "arrive", time: "3:30 PM", t: "Arrivals, registration and networking" },
  { k: "welcome", t: "Welcome and introduction" },
  { k: "panel-1", t: "Leadership panel I" },
  { k: "panel-2", t: "Leadership panel II" },
  { k: "demo", t: "Synthia AI, live demo", tag: "Live" },
  { k: "dinner", t: "Cocktails and networking dinner" },
];
export const agendaNote = "Tentative. Timings, panel topics and speakers to be announced.";

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
