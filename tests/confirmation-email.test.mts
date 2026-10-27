import assert from "node:assert/strict";
import { test } from "node:test";
import { confirmationEmail, greetingName, SIGNATORY } from "../src/lib/confirmation-email.ts";
import { agenda, event } from "../src/content/event.ts";

const facts = {
  date: event.date!,
  time: event.time!,
  venue: `${event.venue}, ${event.city}`,
  format: event.format!,
  agenda,
  agendaNote: "Timings, speakers and final panel themes to be announced.",
  siteUrl: "https://thenextorder.events",
};

test("carries the event's details, the whole agenda and the signature", () => {
  const { subject, html, text } = confirmationEmail({ name: "Asha Rao", updated: false }, facts);
  assert.match(subject, /The NEXT Order, 3 December/);
  for (const s of ["Thursday 3 December 2026", "From 3:30 PM", "T-Hub, Hyderabad", "By invitation", ...agenda.map((a) => a.t)]) {
    assert.ok(html.includes(s), `html: ${s}`);
    assert.ok(text.includes(s), `text: ${s}`);
  }
  assert.ok(html.includes("Dear Asha,"));
  assert.ok(html.includes("Request received") && text.startsWith("REQUEST RECEIVED"));
  assert.ok(html.includes("Places</td>") && !html.includes("Format</td>"));
  assert.ok(html.includes('href="https://thenextorder.events/#evening"') && html.includes("See the agenda and the film"));
  assert.ok(html.includes('href="https://thenextorder.events/the-next-order.ics"') && text.includes("/the-next-order.ics"));
  assert.ok(html.includes("Questions? Just reply to this email.") && !/hi@viamagus\.com/.test(html + text));
  assert.ok(html.includes(SIGNATORY.name) && html.includes(SIGNATORY.title));
  assert.ok(text.includes(`${SIGNATORY.name}\n${SIGNATORY.title}`));
  assert.match(html, /brochure/);
});

test("confirms the request, not a seat", () => {
  const { html } = confirmationEmail({ name: "A", updated: false }, facts);
  assert.match(html, /Places are confirmed by invitation/);
  assert.doesNotMatch(html, /your place is confirmed|see you on/i);
});

test("an update says so", () => {
  const { subject, html } = confirmationEmail({ name: "A", updated: true }, facts);
  assert.match(subject, /updated request/);
  assert.match(html, /updating your request/);
});

test("a name can't inject markup", () => {
  const { html } = confirmationEmail({ name: `Dr. <img src=x onerror=alert(1)> "Bob" & co`, updated: false }, facts);
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes("Dr. &lt;img src=x onerror=alert(1)&gt; &quot;Bob&quot; &amp; co"));
  const first = confirmationEmail({ name: `<b>Bob</b> Smith`, updated: false }, facts).html;
  assert.ok(first.includes("Dear &lt;b&gt;Bob&lt;/b&gt;,") && !first.includes("<b>Bob"));
});

test("greets by first name, or the whole name after a title", () => {
  assert.equal(greetingName("  Asha   Rao "), "Asha");
  assert.equal(greetingName("Dr. Priya Raman"), "Dr. Priya Raman");
  assert.equal(greetingName("prof Rao"), "prof Rao");
  assert.equal(greetingName("Drew Barry"), "Drew");
  assert.equal(greetingName("Madonna"), "Madonna");
});
