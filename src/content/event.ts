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
  city: null,
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
  audience: "India’s GCC leaders",
  host: "ViaMagus",
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
