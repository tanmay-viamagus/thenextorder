# The film — storyboard (30 s, 16:9, loops, readable without sound)

The film is browser-rendered at `/film`, not a video file. It plays on a 1920×1080 stage that scales to any screen. It reuses the site's own artwork: the shifting grid and the three practice diagrams. The timeline lives in `src/content/film.ts`, and the motion in `src/styles/film-player.css`.

Directed for a room: one idea per beat, a few words at most, every product as one big transformation, and a payoff.

| Time | Beat | On screen |
| --- | --- | --- |
| 00–03 | **Hook** | Inside a giant clock face; the magenta second hand ticks three times and the camera pulls back. On the third tick, "THE NEXT ORDER." slams in on its cut line. "For India's GCC leaders" |
| 03–06 | **The old order** | Rows of identical units step left in lockstep, once a second. "The work you were given." **1,700+** GCCs in India (nasscom & Zinnov, FY2024) |
| 06–10 | **The inflection point** | The eras dial: ticks crack out of line, then fuse into owned arcs. "Then the walls moved." gives way to **92%**: "of India-based GCCs aim to deliver value beyond cost arbitrage" (EY GCC Pulse Survey 2025) |
| 10–14 | **BUILD · Velocity AI** | Cyan second hand spinning. "3 months" is struck through and "3–4 weeks" lands. "A shippable submodule, every Friday." |
| 14–18 | **OPERATE · Synthia AI** | Violet minute hand. An AI output marked DRAFT gets a **SIGNED ✓ · Named officer** stamp. "Every AI output is a draft until a named officer signs it." |
| 18–22 | **SCALE · ViaMagus Select** | Amber hour hand. A counter runs 50 → 3; "CVs a search sends" becomes "pass — each with a written verdict". "The mandate is yours. So is the team." |
| 22–26 | **Payoff** | Three hands, cyan, violet and amber, spin at their own speeds and lock together on twelve at 24.5 s, with a ring pulse, over the ViaMagus mark. "Three hands. One clock." |
| 26–30 | **Close** | "Everything an enterprise needs to become AI-native." then "THE NEXT ORDER." with the register URL. A hard cut back to the hook for the loop |

**Timing on screen:** a small dial in the top-right shows one arc per scene, a playhead hand, the timecode (00:12 / 00:30) and the current scene's name.

**Score:** optional, toggled with M and synthesised live. A kick lands on each scene and hats run under the practices. A riser leads into the convergence, a boom hits when the mark lands, and a pad plays under the close.

**Venue notes:** use `/film` fullscreen. The controls hide after 2 s idle, Space pauses and Escape closes the overlay. This has **not** been tested on the actual LED wall, so check legibility and timing on the real screen. **No MP4 exists.** If the venue needs a video file, record `/film` at 1920×1080 (for example with OBS or a Playwright video capture) and check the result.
