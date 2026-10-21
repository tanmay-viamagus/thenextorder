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

export const event: EventDetails = {
  date: null,
  // confirmed in the event brief (Oct 2026); the venue is still being finalised
  city: "Hyderabad",
  venue: null,
  format: null,
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
};

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

/** One honest line: what is confirmed, and what is still to be announced. e.g. "Hyderabad · Date & venue to be announced". */
export function statusLine(e: EventDetails = event): string {
  const parts: string[] = [];
  if (e.city) parts.push(e.city);
  if (e.date && e.venue) parts.push(e.date, e.venue);
  else if (e.date) parts.push(e.date, "Venue to be announced");
  else if (e.venue) parts.push(e.venue, "Date to be announced");
  else parts.push("Date & venue to be announced");
  if (e.format) parts.push(e.format);
  return parts.join(" · ");
}
