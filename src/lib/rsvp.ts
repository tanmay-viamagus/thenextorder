/**
 * A reply to the invitation, the way a calendar invite takes one: yes,
 * tentative or no, from a guest who gives their name, work email and
 * organisation. Shared by the RSVP page (/rsvp), its API (/api/rsvp) and the
 * tests; no imports, so `npm test` can load it as it is. Storage is
 * lib/rsvp-store.ts; the page's words are content/rsvp.ts.
 */
export const REPLIES = ["yes", "tentative", "no"] as const;
export type Reply = (typeof REPLIES)[number];

export const isReply = (v: unknown): v is Reply => typeof v === "string" && (REPLIES as readonly string[]).includes(v);

export type RsvpInput = { name: string; email: string; organisation: string; reply: Reply; source: string };

/** "rsvp", or "rsvp:<the ref the link carried>": lower case, letters, digits and . _ - only */
export function rsvpSource(ref: unknown): string {
  const r = String(ref ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return r ? `rsvp:${r}` : "rsvp";
}

export function validateRsvp(raw: Record<string, unknown>): { ok: true; data: RsvpInput } | { ok: false; errors: Record<string, string> } {
  const s = (k: string, max: number) => String(raw[k] ?? "").trim().slice(0, max);
  const reply = s("reply", 16).toLowerCase();
  const errors: Record<string, string> = {};
  if (!isReply(reply)) errors.reply = "Please choose Yes, Tentative or No.";
  const data = {
    name: s("name", 120),
    email: s("email", 200).toLowerCase(),
    organisation: s("organisation", 160),
    reply: reply as Reply,
    source: rsvpSource(String(raw.ref ?? "")),
  };
  if (!data.name) errors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please add a valid work email.";
  if (!data.organisation) errors.organisation = "Please add your organisation.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/* ---------------------------------------------------------------- the calendar entry */
/**
 * The event as calendars take it. Only the start is confirmed, so it goes in
 * as an all-day entry on the day, with the time in its title (as the
 * hold-the-date file does) rather than with an invented end time.
 */
export type CalendarEvent = {
  title: string;
  /** ISO start with its offset, e.g. "2026-12-03T15:30:00+05:30": its date is the day */
  start: string;
  place: string;
  details: string;
  url: string;
  /** shared with the hold-the-date file, so a calendar updates one entry rather than adding a second */
  uid: string;
};

/** The day as calendars write a date ("20261203"), or `plus` days after it. */
function day(start: string, plus = 0) {
  const d = new Date(`${start.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + plus);
  return d.toISOString().slice(0, 10);
}
const compact = (isoDay: string) => isoDay.replace(/-/g, "");

/** "Add to calendar" links: Google Calendar, and Outlook on the web (Microsoft 365). */
export function calendarLinks(c: CalendarEvent) {
  const q = (o: Record<string, string>) => new URLSearchParams(o).toString();
  return {
    google: `https://calendar.google.com/calendar/render?${q({
      action: "TEMPLATE",
      text: c.title,
      dates: `${compact(day(c.start))}/${compact(day(c.start, 1))}`,
      details: c.details,
      location: c.place,
    })}`,
    outlook: `https://outlook.office.com/calendar/0/deeplink/compose?${q({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: c.title,
      startdt: day(c.start),
      enddt: day(c.start, 1),
      allday: "true",
      body: c.details,
      location: c.place,
    })}`,
  };
}

/** Text as iCalendar escapes it (RFC 5545 §3.3.11). */
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines longer than 75 octets fold onto the next, which starts with a space (RFC 5545 §3.1). */
function fold(line: string) {
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** The .ics file: one all-day entry, for Apple Calendar, Outlook and the rest. */
export function calendarFile(c: CalendarEvent, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Viamagus//The NEXT Order//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${c.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(day(c.start))}`,
    `DTEND;VALUE=DATE:${compact(day(c.start, 1))}`,
    `SUMMARY:${icsText(c.title)}`,
    `LOCATION:${icsText(c.place)}`,
    `DESCRIPTION:${icsText(c.details)}`,
    `URL:${c.url}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n")
    .concat("\r\n");
}
