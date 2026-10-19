# The film — storyboard (30 s, 16:9, loops, readable without sound)

The film is browser-rendered at `/film`, not a video file. It plays on a 1920×1080 stage that scales to any screen. It reuses the site's own artwork: the shifting grid and the three practice diagrams. The timeline lives in `src/content/film.ts`, and the motion in `src/styles/film-player.css`.

| Time | Scene | On screen |
| --- | --- | --- |
| 00–03 | **The NEXT Order** | The cut title on black beside the live clock (IST). "For India's GCC leaders" |
| 03–06 | **The old order** | "The work you were given." The eras hand sweeps 12→4 over regular ticks. **1,700+** GCCs in India (nasscom & Zinnov, FY2024) |
| 06–10 | **The inflection point** | "Then the walls moved." The hand sweeps 4→12: the ticks crack out of line, then fuse into owned arcs, one left open. **92%** (EY GCC Pulse Survey 2025). "What will your centre own next?" |
| 10–14 | **Velocity AI — BUILD** | A 3-month bar compresses to 3–4 weeks, with a ship tick every Friday. "Three-month timelines become three-to-four weeks." |
| 14–18 | **Synthia AI — OPERATE** | SOP → AI drafts → named officer signs ✓ → logged. "Every AI output is a draft until a named officer signs it." |
| 18–22 | **ViaMagus Select — SCALE** | 50 CVs → 4 worth an engineer's time → 3 pass. "The mandate is yours. So is the team." |
| 22–26 | **Convergence** | The three-hands clock: Velocity AI (seconds), Synthia AI (minutes) and ViaMagus Select (hours), pinned on the ViaMagus mark. "Three hands. One clock." |
| 26–30 | **Close** | "Everything an enterprise needs to become AI-native." The register URL appears, then the threshold rises and wipes back to paper, where the title begins again |

**Timing on screen:** a small dial in the top-right shows one arc per scene, a playhead hand, the timecode (00:12 / 00:30) and the current scene's name.

**Score:** optional, toggled with M and synthesised live. A kick lands on each scene and hats run under the practices. A riser leads into the convergence, a boom hits when the mark lands, and a pad plays under the close.

**Venue notes:** use `/film` fullscreen. The controls hide after 2 s idle, Space pauses and Escape closes the overlay. This has **not** been tested on the actual LED wall, so check legibility and timing on the real screen. **No MP4 exists.** If the venue needs a video file, record `/film` at 1920×1080 (for example with OBS or a Playwright video capture) and check the result.
