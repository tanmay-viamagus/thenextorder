import { event, knownFacts, siteAddress } from "@/content/event";
import { invite } from "@/content/story";
import type { CalendarEvent, Reply } from "@/lib/rsvp";

/**
 * The RSVP page (/rsvp): the link sent to the guest list and the invitee
 * list. The event's details, a link to the microsite, and a reply (yes,
 * tentative or no) stored with the organisers (/register/response/rsvp).
 * The event's facts come from content/event.ts; these are the page's words.
 */

/**
 * Who sent the link: /rsvp?ref=<key>. Every reply is stored with the ref it
 * arrived with, and the replies page names these two; any other ref shows as
 * it is. Add a key here to give another list its own link.
 */
export const rsvpLists: Record<string, string> = {
  "guest-list": "Rahul’s guest list",
  "invitee-list": "Viamagus invitee list",
};

/** The list a stored reply came from: "rsvp:guest-list" → "Rahul’s guest list"; another ref as it came; none → "Direct link". */
export const listName = (source: string | null) => {
  const ref = (source ?? "").replace(/^rsvp:?/, "");
  return ref ? (rsvpLists[ref] ?? ref) : "Direct link";
};

/** The three replies, as the page offers them and the replies page counts them. */
export const replyWords: Record<Reply, { label: string; hint: string }> = {
  yes: { label: "Yes", hint: "I’ll be there" },
  tentative: { label: "Tentative", hint: "Not sure yet" },
  no: { label: "No", hint: "Can’t make it" },
};

/** "3 December", from the event's date */
const onTheDay = (event.date ?? "").replace(/^\w+\s+/, "").replace(/\s+\d{4}$/, "");
const place = [event.venue, event.city].filter(Boolean).join(", ");

export const rsvpCopy = {
  kicker: invite.line.replace(/\.$/, ""),
  summary: invite.hero,
  /** the reply's heading, and the line under it */
  ask: "Will you join us?",
  askLine: "Reply as you would to a calendar invite. Your plans changed? Come back to this link and change your reply.",
  going: "Your reply",
  fine: "Your reply goes only to the Viamagus team, for this event.",
  site: "The agenda, the speakers and the film",
  /** what each reply hears back */
  done: {
    yes: { k: "You’re going", h: (name: string) => `See you on ${onTheDay}${name ? `, ${name}` : ""}.`, p: "Your reply is with the Viamagus team. Put the evening in your calendar:" },
    tentative: {
      k: "Marked tentative",
      h: (name: string) => `Thank you${name ? `, ${name}` : ""}. We’ve pencilled you in.`,
      p: "Hold the date for now, and come back to this link when you know.",
    },
    no: {
      k: "Not this time",
      h: (name: string) => `Thanks for letting us know${name ? `, ${name}` : ""}.`,
      p: `We’ll miss you on ${onTheDay}. If someone from your centre should be in the room, send them the invitation.`,
    },
  } satisfies Record<Reply, { k: string; h: (name: string) => string; p: string }>,
};

/** Directions to the venue, as a map search: the brochure names the venue, not an address. */
export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

/** The event in a guest's calendar (Google, Outlook, or the .ics file at /rsvp/calendar.ics). */
export const rsvpCalendar: CalendarEvent = {
  title: `The NEXT Order${event.time ? ` · ${event.time.replace(/^From\b/, "from")}` : ""}`,
  start: event.start ?? "",
  place,
  details: [
    [event.time, place].filter(Boolean).join(", at "),
    invite.hero,
    `Organised by ${knownFacts.host}, in collaboration with ${knownFacts.partner}.`,
    `The agenda, the speakers and the film: ${siteAddress}`,
  ].join("\n\n"),
  url: siteAddress,
  uid: "the-next-order-2026-12-03@thenextorder.events",
};
