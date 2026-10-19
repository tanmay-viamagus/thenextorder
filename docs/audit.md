# Audit and fixes — 17 October 2026

What a visitor and a scripted audit found on the deployed build (`main` @ 783c883), and what changed.

## Broken or underdeveloped

| # | Finding | How it was found | Fix |
| --- | --- | --- | --- |
| 1 | Keyboard focus landed on invisible text: 18 of 30 tab stops were links at opacity 0 or offscreen | Scripted Tab walk measuring the focused element's opacity and position | Each beat is a segment; focusing anything inside one scrolls straight to where that beat is fully shown. Now 0 invisible stops. |
| 2 | Invisible links intercepted clicks on visible ones (Velocity's link was covered by a hidden later beat) | `elementFromPoint` on each visible link | Only the active beat receives pointer events. Now 0 blocked. |
| 3 | Mobile was forced through the desktop interaction: 13 screens of pinned scrubbing | Mobile run | "Flow layout" for screens under 900 px, for reduced motion and without JavaScript: the same beats in normal reading order, with no pinning. |
| 4 | Lenis smooth scroll took over wheel scrolling, which counts as scroll-jacking | Code review against the brief | Lenis removed. Scroll is native; only the animation values are eased. |
| 5 | The three eras weren't explicit; the inflection point rested on one statistic; the old order had no evidence and read as a caricature | Narrative review | Rebuilt as Era 01 (with nasscom evidence that the model worked), Era 02 (four dated signals: investing, experimenting, stalling, leading) and Era 03 (three equal forces, a convergence beat, then the closing line). |
| 6 | ViaMagus Select was framed as filling vacancies ("not 50 CVs") | Brief §2 | Now "Talent built ahead of demand", using viamagusselect.ai's own description of its trained, vetted bench. |
| 7 | The film showed a statistic with a small source footnote, and some lines were 40–56 px | Brief §7 | The statistic beat is replaced by "Now everything else must catch up."; all read-lines are 64 px or larger; small demo labels are hidden in the film. |
| 8 | The share image was a 732 KB PNG | Asset check | Converted to a 164 KB JPEG. |
| 9 | The "Re-order" button was near-invisible (opacity 0–0.4) | Tab walk | Removed. |
| 10 | Text wrapped mid-word at "AI-native" | Screenshot | Non-breaking hyphen. |
| 11 | The convergence row was invisible without JavaScript | No-JS run | Fixed. |

All site links return 200. Gartner (403) and McKinsey (timeout) refuse scripted requests but open in a browser; both were verified at source.

## Brief vs brand

The brief mentions "electric blue … where supported by the brand". The brand audit (`docs/brand-audit.md`) found ViaMagus to be purple `#6608A9` and magenta `#FC60DB` on near-black. The only blue-cyan in the family is Velocity AI's own gradient (`#9500FF → #00C7CE`), which is used for Velocity. No electric blue was introduced.

## Checks run on the final build

- `npm run build`, `tsc --noEmit` and `eslint`: pass.
- axe (WCAG 2.0/2.1 A and AA) at 1440×900, at 390×844 and with reduced motion: 0 violations.
- Tab walk: 0 invisible focus stops. Click audit: 0 blocked visible links.
- Scroll frame rate on desktop: 60 fps (headless Chrome, scripted scroll).
- No JavaScript: all copy visible; figures show their full values.
- No horizontal overflow at any tested width. Zero console errors.

**Not tested:** Safari, Firefox, real phones, the venue display.

## Round 2 — "I don't like the UI" (bold colour fields)

Feedback: the smoke background, too dark overall, a basic layout, and demos that looked cheap. The chosen direction was **bold colour fields**.

- **Flat full-bleed fields from the verified palette:** ViaMagus purple (arrival, Era 03, invitation), Select paper (old order), magenta (inflection), white (signals), Velocity cyan, Synthia violet, Select amber, and black once, for the mark. There is no light field on the site; the film keeps its own look.
- **Editorial grid:** each field opens with a hairline strip (index · era · label), then poster-scale type on 12 columns.
- **Demos replaced by verified statements:**
  - Velocity: ~~3 months~~ → 3–4 weeks.
  - Synthia: a ledger, "AI output · Draft / Named officer · Signed ✓", from the official line "Every AI output is a draft until a named officer signs it".
  - Select: **48h**.
- **No pinned scrolling.** Reveals, count-ups and drifting verbs are driven by IntersectionObserver and native scroll. The page is about 11 screens on desktop, down from about 18.
- **Header** takes the colour and ink of the field beneath it, so it never sits over text.
- **Synthia logo** is rendered in ink (`filter: brightness(0)`) on the violet field for contrast. The official site also has a dark lockup; swap it in if brand prefers.

Checks: build, types and lint pass; axe shows 0 violations (desktop, mobile, reduced motion); 0 invisible focus stops; 0 blocked links; 60 fps.

## Round 3 — launch pass

- **Efficiency is now the thread.** The eyebrow reads "The future of GCC efficiency"; Era 01 is "Efficiency meant more people."; Era 03 is "Efficiency, redefined." with *Build in weeks, not quarters · Operate with control · Scale capability ahead of demand*.
- **New section: "Four seats. Four questions."** One question each for the site leader, CTO, COO and CHRO, marked in the source as framing to confirm against the event plan.
- **Stacked colour fields:** each field slides over the previous one (native scroll, desktop with motion only), and the covered field dims by the true overlap. Keyboard focus scrolls to where a field is fully uncovered: all 33 tab stops verified visible.
- **Honesty fixes:** the "Hosted by" and "Featuring" lines, "To be announced", one CTA label, and the Velocity caption "Velocity AI's stated delivery model".
- **The film now uses the same colour fields.**

Checks: lint, types and build pass; axe 0 violations (desktop, mobile, reduced motion); 59–60 fps; 0 blocked links; 0 invisible or covered tab stops; no horizontal overflow; no console errors.

---

## Round 5 — "The Order" (living-cells rebuild)

**Feedback addressed:**
- **Cluttered, no animation, nothing to interact with, a generic structure.** The site is now one particle system that keeps rebuilding itself. The cursor parts the cells, press-and-hold breaks the title, and you hover or tap the forces. Seat chips change the question.
- **The video made no sense.** The film is now the site's own story on a clock, with the same visuals, so the two reinforce each other.
- **Scientific CTA placement.** See the README, "Where the CTA sits, and why".

**Verified:**
- Builds clean: `tsc`, `eslint`, `next build`.
- Screenshots at 1440×900 and 390×844 for every chapter and every film beat, with no page errors.
- The no-JS render hides no text, and the pill leaves the tab order when hidden.
- Focusing into a chapter brings it on screen.
- Swiftshader holds about 43 fps.

**Fixed during the pass:**
- On phones, the forces clusters collided with the panel. They now sit in one row, and the panel clears the pill.
- Button labels wrapped onto two lines.
- The pill was focusable while hidden.
- The finale question was hidden without JS.
- Word spacing was lost in the kinetic text.

**Known / not done:**
- **Axe contrast false positive.** Axe reports the ink-on-paper and ink-on-magenta headlines as ink on black, because it can't see the WebGL canvas that paints those fields. Actual contrast is about 17:1 on paper and about 7:1 on magenta. With no WebGL, CSS paints the same fields.
- **Hardware.** Not tested on real phones, low-end laptops or a venue screen.
- **Event details.** These are still placeholders in `event.ts`.

---

## Round 6 — "The Shift" (brief: reimagine as an exceptional event experience)

**Audit of the previous version (the five biggest weaknesses):**
1. Its concept, floating particles and glowing orbs, is the very thing the brief rules out.
2. The story was AI-led ("AI changed the rules", agentic-AI statistics) rather than about the centre's mandate, ownership and value, which is what the corrected strategy notes ask for.
3. There was no real registration: the CTA only linked out to viamagus.com.
4. The hero depended on an animation assembling before the name could be read, and the essential details were tiny.
5. Metadata was generic: no canonical URL, sitemap or robots file, and a social description that didn't mention the event.

**What changed:**
- **Concept:** The Shift, the mandate as architecture.
- **Narrative:** THEN → NOW → NEXT, following the corrected GCC strategy notes (internal, not committed). GCC → GIC → ? appears only as a labelled, exploratory question.
- **Figures:** verified and mandate-focused. EY 2025: 92% beyond cost arbitrage, 52% shared accountability, 67% innovation teams. BCG: 8%. nasscom/Zinnov: 1,700+ GCCs.
- **Three practices:** three equal plates. Each has a working diagram built only from verbatim claims on the official pages, and the verbs share one size.
- **Registration:** real, stored in Neon, with a private responses page and CSV export.
- **Film:** rebuilt to the brief's storyboard.
- **Social:** a new OG image, plus canonical URL, sitemap and robots.

**Verified (Oct 2026):**
- **Build:** `tsc`, `eslint` and `next build` all pass.
- **Accessibility:** axe WCAG 2.1 AA reports 0 violations on `/`, `/register` and `/film` at 1440 and 390 px.
- **No JavaScript:** no hidden text.
- **Keyboard:** the walk through the home page found 0 problems at 1440 px. At 390 px one stop remains: the sticky CTA bar mid-transition.
- **Registration end to end:** a browser submission was stored, appeared on `/register/response` and exported as CSV. The responses page returns 401 without credentials or with a wrong password. The API rejects invalid input, and the honeypot is ignored. Test rows were deleted afterwards.
- **Screenshots:** every scene at 1440×900 and 390×844, and every film beat at 1920×1080, with no console errors.
- **Quotes:** every product quote was re-checked verbatim against the live pages.

**Not done / needs the owner:**
- **Event details.** Date, venue, format and speakers aren't confirmed, so they show as "To be announced".
- **Confirmation emails.** None are sent; registrants see an on-screen confirmation only.
- **Hardware.** Not tested on real phones or the LED wall.
- **Video file.** There is no MP4 of the film.


---

## Round 7 — "Show, don't tell" (final creative redesign)

**Why the previous version still felt basic:** it presented the strategy rather than staging it. It had three text-led acts, a row of figures, a four-question lens, a naming exercise and seat tabs: the notes, typeset.

**What changed:**
- **Seven sections became four scenes**, held together by one motif: identical cells cut by a threshold.
- **The shift is now a single artwork**, showing grid → crack → owned volumes. It carries the story with three headlines and two sourced figures, and the film reuses it.
- **Practices:** three equal panels joined by one line that flows into the mark.
- **Close:** the title's shift resolves beside the form.
- **Removed:** the then/now/next essays, the value lens, the GCC → GIC naming section and the seat questions. The ideas survive in the composition; the strategy notes are not published.

**Simulated review.** I critiqued the rendered pages from about 50 simulated viewpoints: CEOs/MDs, site heads, technology leaders, CHROs, TA leads, mobile scanners, and people deciding whether to attend. These are design-review lenses, not user research. Findings acted on:
1. **Too many blanks:** four "To be announced" rows read as unfinished, so they became one honest status line.
2. **No plain description:** the close lacked a one-sentence "what"; it now has one.
3. **Host link implicit:** the practices section is now labelled "Hosted by ViaMagus".
4. **Mobile:** the pinned scene is shorter (300vh), and the bar hides over the artwork.

What held up: the cut title, the transformation, and the open "?" volume, which reads as respectful rather than prescriptive.

**Verified:**
- **Build:** `tsc`, `eslint` and `next build` all pass.
- **Accessibility:** axe WCAG 2.1 AA reports 0 violations on `/`, `/register` and `/film` at 1440 and 390 px.
- **No JavaScript:** no hidden text.
- **Keyboard:** 29 focus stops with 0 problems at 1440 px.
- **Registration:** both forms store to Neon, and `/register/response` and the CSV work. Test rows were deleted.
- **Screenshots:** every scene and state at 1440×900 and 390×844, and film beats at 1920×1080, with no console errors.


---

## Round 8 — the clock

**Feedback:** "still boring … looks AI made; use a clock or something to show the animation and timings."

**What changed:**
- **Identity:** the event now runs on a real clock that keeps India time. The paper-grid, mono-label look that read as templated is gone.
- **The clock does the storytelling:** a live clock in the hero, a scroll-turned eras dial, the three practices as the three hands of one clock, a countdown at the close, and a timing dial in the film.

**Verified:**
- **Build:** `tsc`, `eslint` and `next build` pass.
- **Accessibility:** axe WCAG 2.1 AA reports 0 violations on `/`, `/register` and `/film` at 1440 and 390 px.
- **No JavaScript:** no hidden text.
- **Keyboard:** 29 focus stops with 0 problems at 1440 px.
- **Registration:** end-to-end test passed, and test rows were deleted.
- **Screenshots:** every scene at both widths and every film beat at 1920×1080, with no console errors.


---

## Round 9 — finesse

**Feedback:** the landing felt cluttered (the clock crossed the title, the CTAs and the film button); there were too few reasons to engage with the products; the film needed directing; and the form should be short, selectable and paired with a moving showcase.

**What changed:**
- **Hero:** two columns, words left and a complete clock right, with nothing crossing. The film is a quiet play link, and the details sit in one mono line.
- **Practices:** each has a "who it's for" line and "Explore it at the event", which preselects that practice on `/register`.
- **Form:** three typed fields. Seat, interests and focus are tap-to-select chips (native radios and checkboxes). The new fields are stored, and `/register/response` counts interest by practice.
- **`/register`:** a live showcase on the left (three-hands clock with a spotlight cycling through the practices, and the countdown), with the form on the right.
- **Film, re-directed:** a hook, a lockstep old order, a crack then 92%, one big transformation per practice, and three hands locking at twelve as the payoff.

**Verified:**
- **Build:** `tsc`, `eslint` and `next build` pass.
- **Accessibility:** axe WCAG 2.1 AA reports 0 violations on `/`, `/register` and `/film` at 1440 and 390 px.
- **No JavaScript:** no hidden text.
- **Keyboard:** chips show a visible focus ring.
- **Registration end to end:** preselect, validation, chips stored, and the responses page and CSV all work. Test rows were deleted.
- **Film:** checked frame by frame at 1920×1080.


---

## Round 10 — the shift, the year, a place in the conversation

**Changes:**
- **Hero:** the ordinary clock is replaced by a ring system that breaks and reorganises along the title's cut line, with the film integrated at its centre.
- **The year:** the minute dial becomes an exact 12-month cycle with a real "Today" mark. The copy is reworked to "Built to execute → Then the mandate grew → Built to own, create and lead".
- **Countdown:** removed, along with its component, styles and the `startsAt` field.
- **Call to action:** one throughout, "Request your place", with a larger button and a hover arrow. Product links are rebuilt as "Explore it at the event →" and "Visit product ↗ + domain".
- **Form:** a required LinkedIn profile field, validated on the client and the server.
- **Bot protection:** BotID, honeypot, signed timing token and rate limiting.

**Navigation:** on production, every primary CTA opened `/register` at scrollY 0 with no hash, at 1440 and 390 px. The jump couldn't be reproduced. The home page's form section id was renamed from `register` to `request`, so no `#register` anchor exists.

**Verified locally:**
- `npm test`: 2 of 2 pass.
- Server-side checks:
  - no token: 400;
  - forged token: 400;
  - submitted under 2.5 s: 429;
  - bad LinkedIn link: 400 with a field error;
  - honeypot filled: 200, nothing stored;
  - valid submission: 200, stored with the canonical URL;
  - burst from one connection: 429.
- **Browser E2E:** the LinkedIn error keeps the other data and moves focus; the submission appears on `/register/response` and in the CSV.
- **Build and audits:** `tsc`, `eslint` and the build pass. axe: 0 violations at 1440 and 390 px. No-JS: no hidden text.


---

## Round 11 — the ring of years, actions that say what they do, a film that tells it

**What changed:**
- **Year ring:** the 12-month ring is now 2001–2030, with marked boundaries at 2020 and 2025. The "Today" mark is removed.
- **Centre:** shows the running year, then era · headline · a line a leader recognises · a sourced figure.
- **Product actions:**
  - "Let's build / Let's automate / Let's hire" (to each product's site), as colour-coded blocks.
  - "Bring a … to the room" (to `/register` with the product preselected).
- **Close:** three steps.
- **Buttons:** one system — a purple block, an attached arrow cell, and a magenta base line on hover.
- **Film:** opens on the cut ring twisting into the next order; the old order counts 2001→2019; the inflection runs the marker across 2020 and 2025.

**Regression fixed:** the previous dead-CSS sweep matched `.ec…` prefixes and also removed `.eco__h`, `.eco__k`, `.eco__top`, `.eco__lede` and `.eco__close`, which flattened the "Three hands. One clock." heading. They are restored, and every selector was diffed against the earlier release.

**Also fixed:** a console warning from the inline `<script>` in the layout, now a client flag component. BotID now fails closed on Vercel and is skipped off Vercel, instead of throwing a 500.

**Verified:** `tsc`, `eslint`, `npm test` (2/2) and the build pass. axe reports 0 violations at 1440 and 390 px. No-JS: no hidden text. The server-side protection matrix passes on a local production build.
