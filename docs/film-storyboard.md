# The film — storyboard (30 s, loops)

The film is the site's story on a clock. It runs on the same engine and the same formations, with one large caption per beat. Nothing depends on sound, so it works muted on a venue screen. It begins and ends in drifting chaos, which makes the loop seamless. The timeline lives in `src/content/film.ts`.

| Time | Cells form | Caption | Field |
| --- | --- | --- | --- |
| 0–1 s | Drifting chaos | — | Black |
| 1–3.6 s | THE NEXT ORDER. | An invitation from ViaMagus | Black |
| 3.6–7.6 s | A rigid pyramid with a magenta apex | Efficiency used to mean more people. | Paper |
| 7.6–10.6 s | The pyramid shatters | AI changed the rules. | Magenta |
| 10.6–14.2 s | 8% (8 in magenta, % in white) | of GCCs lead. | Black |
| 14.2–21.4 s | Three turning clusters; each swells in turn at 15.4 / 17.4 / 19.4 s | Build. Operate. Scale., then each force's verified proof: 3 months → 3–4 weeks · Draft → Signed ✓ · 48h | Ink |
| 21.4–25.4 s | The ViaMagus mark | Everything an enterprise needs to become AI-native. | Black |
| 25.4–29 s | THE NEXT ORDER. | For GCC leaders · date & venue (or "An invitation from ViaMagus") | Black |
| 29–30 s | Back to chaos (the loop) | — | Black |

**Score:** optional, toggled with M and synthesised live with Web Audio. A kick lands on each formation change and on each force, hats run under the forces, a riser leads into the mark, and a sub-bass boom hits when it lands. A pad plays under the name.

**Venue notes:** use `/film` fullscreen. The controls hide after 2 s idle, and Space pauses. Captions scale with the viewport. This has **not** been tested on a real venue display, so check legibility and frame rate on the actual screen before the event. In headless software rendering it holds about 43 fps at 1440×900.
