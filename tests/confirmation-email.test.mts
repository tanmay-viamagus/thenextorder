import assert from "node:assert/strict";
import { test } from "node:test";
import { confirmationEmail, SIGNATORY } from "../src/lib/confirmation-email.ts";
import { agenda, contactEmail, event } from "../src/content/event.ts";

const facts = {
  date: event.date!,
  time: event.time!,
  venue: `${event.venue}, ${event.city}`,
  format: event.format!,
  agenda,
  agendaNote: "Timings, speakers and final panel themes to be announced.",
  contactEmail,
  siteUrl: "https://thenextorder.vercel.app",
};

test("carries the event's details, the whole agenda and the signature", () => {
  const { subject, html, text } = confirmationEmail({ name: "Asha Rao", updated: false }, facts);
  assert.match(subject, /The NEXT Order, 3 December/);
  for (const s of ["Thursday 3 December 2026", "From 3:30 PM", "T-Hub, Hyderabad", "By invitation", ...agenda.map((a) => a.t)]) {
    assert.ok(html.includes(s), `html: ${s}`);
    assert.ok(text.includes(s), `text: ${s}`);
  }
  assert.ok(html.includes("Dear Asha Rao,"));
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
  const { html } = confirmationEmail({ name: `<img src=x onerror=alert(1)> "Bob" & co`, updated: false }, facts);
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt; &quot;Bob&quot; &amp; co"));
});
