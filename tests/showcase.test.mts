import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { normalizeLinkedIn } from "../src/lib/linkedin.ts";
import { organisations, organisationsCopy, placeholderTiles } from "../src/content/organisations.ts";
import { speakerGroups, speakersCopy } from "../src/content/speakers.ts";

/** a path under public/ that the page will ask for */
const served = (path: string) => existsSync(new URL(`../public${path}`, import.meta.url));
const unique = (list: string[], what: string) => {
  const seen = new Set<string>();
  for (const v of list) {
    assert.ok(!seen.has(v.toLowerCase()), `${what} listed twice: ${v}`);
    seen.add(v.toLowerCase());
  }
};

test("every speaker has a name, and is listed once", () => {
  unique(speakerGroups.map((g) => g.title), "group");
  for (const g of speakerGroups) {
    assert.ok(g.title.trim(), "a group needs a title");
    for (const p of g.people) {
      assert.ok(p.name.trim(), `a speaker in ${g.title} has no name`);
      if (p.role !== undefined) assert.ok(p.role.trim(), `${p.name}: leave role out rather than empty`);
      if (p.bio !== undefined) assert.ok(p.bio.trim(), `${p.name}: leave bio out rather than empty`);
    }
  }
  unique(speakerGroups.flatMap((g) => g.people.map((p) => p.name)), "speaker");
});

test("every speaker's photo is in public/speakers/ and LinkedIn link is a profile", () => {
  for (const p of speakerGroups.flatMap((g) => g.people)) {
    if (p.photo) {
      assert.match(p.photo, /^\/speakers\/[^/]+\.(jpe?g|png|webp|avif)$/i, `${p.name}: photo should be /speakers/<file>.jpg|png|webp|avif`);
      assert.ok(served(p.photo), `${p.name}: public${p.photo} is missing`);
    }
    if (p.linkedin) {
      const r = normalizeLinkedIn(p.linkedin);
      assert.ok(r.ok, `${p.name}: ${p.linkedin} is not a LinkedIn profile link`);
      assert.equal(p.linkedin, r.ok ? r.url : "", `${p.name}: use the canonical form`);
    }
  }
});

test("every organisation is listed once, with its supplied logo in public/organisations/", () => {
  unique(organisations.map((o) => o.name), "organisation");
  for (const o of organisations) {
    assert.ok(o.name.trim(), "an organisation has no name");
    if (o.logo) {
      assert.match(o.logo, /^\/organisations\/[^/]+\.(svg|png|webp|jpe?g|avif)$/i, `${o.name}: logo should be /organisations/<file>`);
      assert.ok(served(o.logo), `${o.name}: public${o.logo} is missing`);
    }
    if (o.treatment) assert.ok(["mono", "original", "solid"].includes(o.treatment), `${o.name}: unknown treatment`);
    if (o.scale !== undefined) assert.ok(o.scale >= 0.6 && o.scale <= 1.4, `${o.name}: scale runs 0.6–1.4`);
  }
  assert.ok(Number.isInteger(placeholderTiles) && placeholderTiles >= 0 && placeholderTiles <= 20, "placeholderTiles runs 0–20");
});

test("the logo wall's words say nothing of invitations, attendance or sponsorship", () => {
  const { label, title, intro } = organisationsCopy;
  assert.doesNotMatch([label, ...title, intro ?? ""].join(" "), /\b(guest|invit|confirm|regist|attend|sponsor|endors|partner)/i);
});

test("each section has its label and two-part heading", () => {
  for (const c of [speakersCopy, organisationsCopy]) {
    assert.ok(c.label.trim());
    assert.equal(c.title.length, 2);
  }
});
