# The film — storyboard (42 s, 16:9, loops, readable without sound)

The film is browser-rendered at `/film`, not a video file. It plays on a 1920×1080 stage that scales to any screen. It reuses the site's own artwork: the shifting grid and the three practice diagrams. The timeline lives in `src/content/film.ts`, and the motion in `src/styles/film-player.css`.

Timings: title 0–4 · old order 4–9 · inflection 9–15 · Build 15–20 · Operate 20–25 · Hire (Select) 25–30 · payoff 30–36 · close 36–42. Each beat holds long enough to read from the back of a room.

Directed for a room: one idea per beat, a few words at most, every product as one big transformation, and a payoff.

| Time | Beat | On screen |
| --- | --- | --- |
| 00–03 | **Hook** | Inside a giant clock face; the magenta second hand ticks three times and the camera pulls back. On the third tick, "THE NEXT ORDER." slams in on its cut line. "For India's GCC leaders" |
| 03–06 | **The old order** | Rows of identical units step left in lockstep, once a second. "The work you were given." **1,700+** GCCs in India (nasscom & Zinnov, FY2024) |
| 06–10 | **The inflection point** | The eras dial: ticks crack out of line, then fuse into owned arcs. "Then the walls moved." gives way to **92%**: "of India-based GCCs aim to deliver value beyond cost arbitrage" (EY GCC Pulse Survey 2025) |
| 10–14 | **BUILD · Velocity AI** | Behind it, the first piece of the ViaMagus mark (the left triangle) drifts in. "3 months" is struck through and "3–4 weeks" lands. "A shippable submodule, every Friday." |
| 14–18 | **OPERATE · Synthia AI** | The second piece (the left peak). An AI output marked DRAFT gets a **SIGNED ✓ · Named officer** stamp. "Every AI output is a draft until a named officer signs it." |
| 18–22 | **SCALE · ViaMagus Select** | The third piece (the right peak). A counter runs 50 → 3; "CVs a search sends" becomes "pass — each with a written verdict". "The mandate is yours. So is the team." |
| 22–26 | **Payoff** | The three pieces (cyan, violet, amber) fly in from three directions, spinning, and lock together into the exact ViaMagus mark at 24.5 s. A magenta pulse, they turn white, "viamagus" appears beneath. "Three practices. One ViaMagus." |
| 26–30 | **Close** | "Everything an enterprise needs to become AI-native." then "THE NEXT ORDER." with the register URL. A hard cut back to the hook for the loop |

**Timing on screen:** a thin timeline bar across the top: one segment per scene, a playhead, the timecode (00:12 / 00:30) and the current scene's name. No clock motifs in the film.

**Score:** optional, toggled with M and synthesised live. A kick lands on each scene and hats run under the practices. A riser leads into the convergence, a boom hits when the mark lands, and a pad plays under the close.

**Venue notes:** use `/film` fullscreen. The controls hide after 2 s idle, Space pauses and Escape closes the overlay. This has **not** been tested on the actual LED wall, so check legibility and timing on the real screen. **No MP4 exists.** If the venue needs a video file, record `/film` at 1920×1080 (for example with OBS or a Playwright video capture) and check the result.
