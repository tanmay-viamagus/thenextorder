# Self-audit — would a GCC leader come?

Written from the seat of the reader: a GCC head in India who gets ten event invites a week, opens this one from LinkedIn on a phone between meetings, and decides in under a minute.

## Draft 1 (cinematic long-scroll) — verdict: no

| What I saw as a GCC head | Why it failed |
| --- | --- |
| About 25 screens of scrolling | I'd leave after two. Nobody scrolls that far on a phone. |
| Paragraphs of approved copy ("We built enterprises to operate in a different world…") | Consultant prose. It tells me, it doesn't show me anything. |
| A synthwave grid floor, purple glows, uppercase mono labels, explainer diagrams | Looks like every AI landing page of the last two years. |
| Three products described in general terms | I couldn't say what any of them actually does for me. |
| No date, no format, no stake for me | No reason to say yes. |

## Draft 2 (this version) — five screens, about 40 seconds

| Frame | What I take away in five seconds | Would it keep me? |
| --- | --- | --- |
| 01 Hook | The letters arrive scrambled and sort themselves into THE NEXT ORDER. Then: "The operating model that built your GCC won't run it next." | Yes. It's a provocation aimed at me, and the motion *is* the idea. |
| 02 The shift | A pyramid of 100 people becomes three connected blocks with AI agents inside. "Built to scale people" becomes "Built to scale capability". | Yes. One look, no reading. The "same talent" framing doesn't threaten me with headcount cuts. |
| 03 Three forces | A release every Friday versus one a quarter; an AI that stops for sign-off; 50 CVs down to 3–5 people. | Yes. Each is a concrete, checkable claim taken from the official product sites. |
| 04 The signal | Only **8%** of GCCs are top performers (BCG), while 58% of India's GCCs already invest in agentic AI (EY). | Yes. This is the stake: am I in the 8%? |
| 05 Invitation | Who it's for, who's hosting, a clear call to action. | **Not yet.** See below. |

### Honest verdict

I would **register interest**, but I would not **commit a date** to this yet. The story, design and proof now earn attention. What's missing is information only ViaMagus can supply, and it decides attendance more than any design choice:

1. **Date, city and venue.** "Shared with invitees" reads as unfinished to a senior leader.
2. **Format and size.** For example: "Closed-door. 30 GCC leaders. Chatham House rule." Exclusivity is the strongest pull for this audience.
3. **Who else is in the room.** One or two named speakers or hosts, or peer GCCs attending.
4. **What I leave with.** One tangible takeaway, such as a benchmark, a working session or a playbook.
5. **A real RSVP.** "Register your interest" currently goes to the general viamagus.com contact section.

All five slots already exist in `src/content/event.ts`. Fill them in and the invitation card, the hook's footer line and the film's reveal update automatically. Nothing has been invented to fill them.

## Checks that stay in place

- **Product claims:** every one is quoted from the official sites (velocity-ai, synthia-ai, viamagusselect.ai), with the source sentence noted in `src/content/story.ts`.
- **Research:** both figures are verified against the original publisher pages (`docs/next-order-research.md`).
- **Brand:** colours and fonts come from the live ViaMagus stylesheets (`docs/brand-audit.md`).

## Draft 3: feedback round

| Feedback | Change |
| --- | --- |
| "The film is in a corner; how will anyone get to it?" | Added a *Watch the film* button on the first screen, a dedicated black frame (02) with the ViaMagus mark and a large play button, and a header button. All three open the film fullscreen over the page. |
| "Animations take too long to load and aren't smooth" | The title sort is now pure CSS and starts on first paint instead of waiting for JavaScript; the full sort takes about 1.5 s. The shift re-orders after 0.8 s with shorter transitions, and cells use transform-only motion. |
| "The film should be separate, direct, creative, a climax" | Rebuilt the film as its own 30 s crescendo: tension, fast cuts, a word rush, one second of silence, the logo slam on black, then the title. It has a live WebGL light field (the background image), flashes and camera shake on hits, and an optional synthesised score. |
| "ViaMagus logo looks best on black" | The film's climax is the mark assembling on pure black; the film frame on the site is black with the mark. |
| Three-forces cards "can be much better" | Replaced the three cards with one stage: *Build. Operate. Scale.* is the tab bar. One force owns the frame at a time in its own colours, advancing automatically. Visuals never show a blank or broken mid-state. |

## Draft 4: the thread and the shutters, audited as a GCC head

**What now works:**
- **The opening.** The first five seconds earn attention: the self-sorting title, the provocation, and a film button that invites a click.
- **The film is the strongest asset.** It has a cold open, the old order collapsing, a word rush, real silence, then the ViaMagus mark locking on black under a light sweep. It feels like a launch, not a brochure. I would forward it.
- **Three forces, one system.** Pulling the thread drops all three shutters side by side, and the thread lights when the set is complete. That makes "one operating model" visible instead of claimed. The demos only start once the set is complete, so the payoff is earned.
- **Credibility.** Every number has a named source, and every product claim is ViaMagus's own published wording.

**What would still stop me committing a date:**
1. **No date, venue, format or host names.** This is still the deciding gap (see draft 2), and only ViaMagus can fill it.
2. **It can read as three product pitches.** A GCC head attends for peers and insight, not for a vendor's portfolio. One line on what I leave with ("a working session on X", "the benchmark") would rebalance it. That line has to come from the event plan; I haven't invented one.
3. **Proof.** "A release every Friday" is ViaMagus's own claim. A single linked case study would make it land; the official site has them, so link one once you choose which can be named.

**Verdict:** I'd watch the film to the end, scroll to the invitation, and register interest. I'd book the date once items 1 and 2 exist.

## Draft 5: full redesign, one world

**Critique of draft 4 (why it wasn't good enough):** it was a deck of six unrelated slides in different colours. The best asset (the film's light on black) was hidden behind a button. Visuals read as product-UI diagrams, there was too much chrome (dots, counters, toggles, legends), and native scroll stepping made it feel stiff.

**Redesign:**
- **The site is the film, played by your scroll.** The light field sits fixed behind every chapter.
- **The colour tells the story.** The old order drains it to grey, "AI changed the rules" floods it back, each force retints the light (Velocity violet-cyan, Synthia violet, Select amber), and the finale goes to black for the mark.
- **Type and motion over UI.** Giant verbs fill with colour as you scroll, and the mark assembles on black with a shockwave.
- **Minimal chrome.** The only navigation is a thin magenta progress thread, plus *Watch the film* and *Request an invitation*.
- **Smooth.** Lenis smooth scroll (as on viamagusselect.ai) runs at 60 fps in testing.

**As a GCC head now:** this looks and feels like a serious, high-design launch from a company that knows what it is doing. The story lands without reading: grey becomes colour, three forces, 8%, the mark. I would watch, scroll to the end, and register interest. The deciding gaps are unchanged and are not design problems: date and venue, format, named hosts or peers, and one concrete takeaway.

## Draft 7 — final audit before launch, seat by seat

| Seat | What they'll think now | Remaining gap (honest) |
| --- | --- | --- |
| **Site leader / MD** | "This is about the thing I'm measured on: efficiency beyond cost." The thread from *Efficiency meant more people* → *AI changed the rules* → *Efficiency, redefined.* lands in under a minute. The question "When cost per head is no longer the advantage, what does a GCC compete on?" is the reason to come. | No date, venue, format or peers in the room. This is still the deciding factor, and only ViaMagus can fill it. |
| **CTO** | "~~3 months~~ → 3–4 weeks" stops the scroll. "Why are AI tools speeding up engineers but not delivery?" is a question I'm asked by my board. | It's ViaMagus's own claim (now captioned as such). One nameable case study would make it bulletproof. |
| **COO** | "Draft / Signed ✓" is the governance answer regulated GCCs need. | Same as above: proof is the vendor's own. |
| **CHRO** | "How do you build AI capability faster than you can hire it?" plus "Talent built ahead of demand" is the right reframing. | "48h" is a hiring metric; the capability-building story is in the copy, not the visual. |
| **CFO** (implicit) | The signals are dated, sourced and labelled as surveys or forecasts. Nothing over-claims. | No efficiency or ROI figure for the event's own thesis; deliberately none, since inventing one would be worse. |

**Corrected in this pass:** "Hosted by" now says ViaMagus; Velocity AI, Synthia AI and ViaMagus Select are listed as featured offerings, not co-hosts. "To be announced" replaces "Shared with invitees", which implied a guest list. The calls to action are one consistent "Request an invitation".

**Needs confirmation before you promote this widely:** the four questions frame the conversation; confirm they match the event plan. Fill in `src/content/event.ts` (date, venue, format, speakers, RSVP link).

**Verdict:** as a GCC head in India I'd stop, watch the film, read to the end and request an invitation. I'd commit once the date and the room are named.
