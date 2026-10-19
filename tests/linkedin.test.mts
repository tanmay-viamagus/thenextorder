import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeLinkedIn } from "../src/lib/linkedin.ts";

const ok = (v: string, url: string) => {
  const r = normalizeLinkedIn(v);
  assert.equal(r.ok, true, v);
  if (r.ok) assert.equal(r.url, url);
};
const bad = (v: string) => assert.equal(normalizeLinkedIn(v).ok, false, v);

test("accepts personal profile links and canonicalises them", () => {
  ok("https://www.linkedin.com/in/tanmay-agarwal", "https://www.linkedin.com/in/tanmay-agarwal");
  ok("  linkedin.com/in/tanmay-agarwal/  ", "https://www.linkedin.com/in/tanmay-agarwal");
  ok("http://in.linkedin.com/in/jane_doe-123", "https://www.linkedin.com/in/jane_doe-123");
  ok("https://www.linkedin.com/in/jane?trk=public", "https://www.linkedin.com/in/jane");
});

test("rejects other LinkedIn pages, lookalike domains and malformed input", () => {
  for (const v of [
    "",
    "linkedin",
    "https://linkedin.com/company/viamagus",
    "https://www.linkedin.com/in/",
    "https://www.linkedin.com.evil.com/in/jane",
    "https://evil.com/linkedin.com/in/jane",
    "https://notlinkedin.com/in/jane",
    "https://user:pw@www.linkedin.com/in/jane",
    "https://www.linkedin.com:8443/in/jane",
    "ftp://www.linkedin.com/in/jane",
  ])
    bad(v);
});
