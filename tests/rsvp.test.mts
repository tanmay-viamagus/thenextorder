import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calendarFile, calendarLinks, isReply, rsvpSource, validateRsvp, type CalendarEvent } from "../src/lib/rsvp.ts";

const ok = { name: " Asha Rao ", email: " Asha@Example.COM ", organisation: "Acme", reply: "Yes", ref: "guest-list" };

const evening: CalendarEvent = {
  title: "The NEXT Order · from 3:30 PM IST",
  start: "2026-12-03T15:30:00+05:30",
  place: "T-Hub, Hyderabad",
  details: "From 3:30 PM IST; at T-Hub, Hyderabad\nAn evening, by invitation\\",
  url: "https://thenextorder.events",
  uid: "the-next-order-2026-12-03@thenextorder.events",
};

test("a reply is yes, tentative or no", () => {
  for (const r of ["yes", "tentative", "no"]) assert.ok(isReply(r), r);
  for (const r of ["maybe", "YES", "", null, 1]) assert.ok(!isReply(r), String(r));
});

test("a complete reply is tidied: trimmed, email in lower case, the list from the link", () => {
  const v = validateRsvp(ok);
  assert.ok(v.ok);
  assert.deepEqual(v.data, { name: "Asha Rao", email: "asha@example.com", organisation: "Acme", reply: "yes", source: "rsvp:guest-list" });
});

test("a reply without a choice, name, valid email or organisation says which", () => {
  const v = validateRsvp({ name: " ", email: "asha@", organisation: "", reply: "maybe" });
  assert.ok(!v.ok);
  assert.deepEqual(Object.keys(v.errors).sort(), ["email", "name", "organisation", "reply"]);
});

test("the list a reply came from is kept short and safe", () => {
  assert.equal(rsvpSource(undefined), "rsvp");
  assert.equal(rsvpSource("  "), "rsvp");
  assert.equal(rsvpSource("Invitee-List"), "rsvp:invitee-list");
  assert.equal(rsvpSource("<script>x</script>"), "rsvp:script-x-script");
  assert.equal(rsvpSource("a".repeat(80)).length, "rsvp:".length + 40);
});

test("calendar links put the evening on 3 December as an all-day entry", () => {
  const { google, outlook } = calendarLinks(evening);
  const g = new URL(google).searchParams;
  assert.equal(g.get("action"), "TEMPLATE");
  assert.equal(g.get("dates"), "20261203/20261204");
  assert.equal(g.get("location"), evening.place);
  const o = new URL(outlook);
  assert.equal(o.hostname, "outlook.office.com");
  assert.equal(o.searchParams.get("startdt"), "2026-12-03");
  assert.equal(o.searchParams.get("enddt"), "2026-12-04");
  assert.equal(o.searchParams.get("allday"), "true");
});

test("the .ics file is valid iCalendar: CRLF, escaped text, folded lines", () => {
  const ics = calendarFile(evening, new Date("2026-11-04T10:00:00.123Z"));
  assert.ok(ics.endsWith("\r\n"));
  assert.ok(!/[^\r]\n/.test(ics), "every line ends in CRLF");
  const lines = ics.split("\r\n").slice(0, -1);
  for (const l of lines) assert.ok(new TextEncoder().encode(l).length <= 75, `longer than 75 octets: ${l}`);
  const unfolded = ics.replace(/\r\n /g, "");
  assert.match(unfolded, /\r\nDTSTAMP:20261104T100000Z\r\n/);
  assert.match(unfolded, /\r\nDTSTART;VALUE=DATE:20261203\r\nDTEND;VALUE=DATE:20261204\r\n/);
  assert.match(unfolded, /\r\nLOCATION:T-Hub\\, Hyderabad\r\n/);
  assert.ok(unfolded.includes("DESCRIPTION:From 3:30 PM IST\\; at T-Hub\\, Hyderabad\\nAn evening\\, by invitation\\\\\r\n"));
});

test("the RSVP's calendar entry is the same one as the hold-the-date file, so calendars update it", () => {
  const hold = readFileSync(new URL("../public/the-next-order.ics", import.meta.url), "utf8");
  const rsvp = readFileSync(new URL("../src/content/rsvp.ts", import.meta.url), "utf8");
  const uid = hold.match(/^UID:(.+)$/m)?.[1].trim();
  assert.ok(uid);
  assert.ok(rsvp.includes(`uid: "${uid}"`), "content/rsvp.ts should use the hold-the-date file's UID");
});
