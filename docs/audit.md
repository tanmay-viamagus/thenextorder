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
