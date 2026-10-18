# The film — storyboard (30 s, 16:9, loops, readable without sound)

The film is browser-rendered at `/film`, not a video file. It plays on a 1920×1080 stage that scales to any screen. It reuses the site's own drawings: the floor plans and the three practice diagrams. The timeline lives in `src/content/film.ts`, and the motion in `src/styles/film-player.css`.

| Time | Scene | On screen |
| --- | --- | --- |
| 00–03 | **The NEXT Order** | The cut title on drawing paper. The threshold line draws, then everything above it shifts. "For India's GCC leaders" |
| 03–06 | **The old order** | "The room you were given." The plan draws: a small India centre inside a global enterprise, with four bays and rows of desks |
| 06–10 | **The inflection point** | "The walls are moving." The room's walls physically expand. **92%** of India-based GCCs aim to deliver value beyond cost arbitrage (EY GCC Pulse Survey 2025) |
| 10–14 | **Velocity AI — BUILD** | A 3-month bar compresses to 3–4 weeks, with a ship tick every Friday. "Three-month timelines become three-to-four weeks." |
| 14–18 | **Synthia AI — OPERATE** | SOP → AI drafts → named officer signs ✓ → logged. "Every AI output is a draft until a named officer signs it." |
| 18–22 | **ViaMagus Select — SCALE** | 50 CVs → 4 worth an engineer's time → 3 pass. "The mandate is yours. So is the team." |
| 22–26 | **Convergence** | Three lines (cyan, violet, amber) draw down and meet in the ViaMagus mark. "Build. Operate. Scale." |
| 26–30 | **Close** | "Everything an enterprise needs to become AI-native." The register URL appears, then the threshold rises and wipes back to paper, where the title begins again |

**Score:** optional, toggled with M and synthesised live. A kick lands on each scene and hats run under the practices. A riser leads into the convergence, a boom hits when the mark lands, and a pad plays under the close.

**Venue notes:** use `/film` fullscreen. The controls hide after 2 s idle, Space pauses and Escape closes the overlay. This has **not** been tested on the actual LED wall, so check legibility and timing on the real screen. **No MP4 exists.** If the venue needs a video file, record `/film` at 1920×1080 (for example with OBS or a Playwright video capture) and check the result.
