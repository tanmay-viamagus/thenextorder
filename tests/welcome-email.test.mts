import assert from "node:assert/strict";
import { test } from "node:test";
import { welcomeEmail } from "../src/lib/welcome-email.ts";
import { greetingName, SIGNATORY } from "../src/lib/confirmation-email.ts";
import { agenda, event } from "../src/content/event.ts";

const facts = { venue: `${event.venue}, ${event.city}`, agenda, siteUrl: "https://thenextorder.events", signatory: SIGNATORY };
const mail = (name: string) => welcomeEmail({ greeting: greetingName(name) }, facts);

test("welcomes the guest by name, from Viamagus, with the evening's running order", () => {
  const { subject, html, text } = mail("Asha Rao");
  assert.equal(subject, "Welcome to The NEXT Order, Asha");
  assert.ok(html.includes("Dear Asha,") && text.includes("Dear Asha,"));
  assert.ok(html.includes("Viamagus presents") && text.startsWith("VIAMAGUS PRESENTS\nTHE NEXT ORDER"));
  assert.ok(html.includes("You’re checked in · The Marvel, T-Hub, Hyderabad"));
  for (const a of agenda) assert.ok(html.includes(a.t) && text.includes(a.t), a.t);
  assert.ok(html.includes("Viamagus booth") && text.includes("Viamagus booth"));
  assert.ok(html.includes(SIGNATORY.name) && text.includes(`${SIGNATORY.name}\n${SIGNATORY.title}`));
});

test("keeps a title in the greeting and escapes what the desk typed", () => {
  assert.match(mail("Dr. Meera Iyer").subject, /Dr\. Meera Iyer$/);
  const { html } = mail("<b>Sam</b>");
  assert.ok(html.includes("Dear &lt;b&gt;Sam&lt;/b&gt;,") && !html.includes("<b>Sam</b>"));
});

test("no dates, no dashes in the copy, and the Viamagus spelling", () => {
  const { html, text } = mail("Asha");
  assert.ok(!/December|ViaMagus|Viamagus Select/.test(html + text));
  assert.ok(!/—|–/.test(text));
});
