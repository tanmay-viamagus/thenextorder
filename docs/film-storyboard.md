# The NEXT Order — 30-second event-screen film

**Purpose:** a silent loop on the venue screen, in a room with ambient light, watched in glances. Every beat carries one short message in large, high-contrast type. There are no statistics, footnotes or small print, and the three offerings get equal screen time.

**Status:**
- **Implemented:** a live, browser-rendered loop at `/film` (also opens fullscreen from the site). It is composed on a fixed 1920×1080 stage and scaled to fit any screen.
- **Not done:** a rendered video file. None exists; see "Before export" below.

Timings are defined in `src/content/film.ts`.

## Design rules for the venue screen

- **Type size:** minimum 64 px on the 1080 p stage for any line meant to be read; headlines are 120–330 px. On a 4K wall that doubles.
- **Pacing:** one message per beat, held for at least 1.5 s after it lands, so a guest looking up mid-loop can read it.
- **Contrast:** white, lilac `#F2D0FF`, magenta `#FC60DB`, the Velocity gradient or Select amber, on near-black. The light field sits behind and never behind small text.
- **No dependency on sound.** The optional score adds energy but carries no information.
- **Equal weight:** Build, Operate and Scale drop together as three equal shutters, then each gets an equal camera push.
- **Seamless loop:** the last frame (one magenta cell on black) is the first frame.

## Storyboard

| Time | Beat | On screen (exact copy) | Visual direction | Transition out |
| --- | --- | --- | --- | --- |
| 0.0–2.2 | Arrival | **Every enterprise runs on an order.** | Letterboxed black. A magenta cell blinks; the line types across in lilac at 92 px. | Hard cut with a small flash |
| 2.2–4.4 | The old order | **THE OLD ORDER.** | 96 navy cells pop into a rigid grid; the title wipes in as large outline type. The light is drained to grey. | The grid begins to crack |
| 4.4–6.2 | The crack | **Built to scale people.** | The grid falls and spins away; the line punches in from blur. | The letterbox bursts open |
| 6.2–8.0 | The inflection | **AI CHANGED THE RULES.** | Full purple light floods in; cyan/magenta channel split on the type; big flash. | Cut on flash |
| 8.0–10.0 | Catch up | **Now everything else must catch up.** | Two lines punch in; "catch up." in magenta. | Thread draws across the top |
| 10.0–11.1 | Three forces | **Build. · Operate. · Scale.** with the *Velocity AI*, *Synthia AI* and *ViaMagus Select* marks | Three equal shutters drop on a magenta thread, one beat each; the thread lights when all three hang together. | Camera push |
| 11.1–17.5 | The push | **A shippable release every Friday.** · **AI that follows your SOP — and stops for your sign-off.** · **Talent built ahead of demand.** | The camera pushes into each shutter in turn (about 2 s each) while the others dim; each live demo plays (weekly releases, the human sign-off gate, the shortlist). | Flash cut |
| 17.5–21.0 | The rush | **Build. Operate. Scale. Engineering. Intelligence. Talent. Three forces. One order.** | One word every 0.4 s at 250 px, each on a flash; "ONE ORDER." holds. | Cut to black |
| 21.0–22.0 | Silence | *(one magenta cell)* | Total black; the cell pulses once. | — |
| 22.0–25.2 | The mark | **viamagus** logo | The two halves of the ViaMagus mark fly in and lock on black; shockwave rings; a magenta light sweeps across the mark; the wordmark resolves. | Flash |
| 25.2–28.4 | The name | **THE NEXT ORDER.** · **Everything an enterprise needs to become AI-native.** | The title sorts itself into order; the closing line rises at 68 px; the brightest light of the loop. | Fade |
| 28.4–30.0 | The invitation | **An invitation from ViaMagus** · **For GCC leaders** *(+ date and venue once confirmed)* | Two lines at 120 px and 64 px, then fade to the single cell, which is frame one. | Loop |

The claims match the verified wording on the site (`src/content/story.ts`). The Select claim, "Talent built ahead of demand", comes from viamagusselect.ai's description of its trained, vetted bench.

## Before export (needs confirmation from the venue)

The display hasn't been tested. Before producing a file, confirm:

1. **Native resolution and aspect ratio** of the screen (for example 3840×2160 16:9, or an LED wall with a non-standard pixel map). The stage is 16:9; another ratio needs a re-composed export.
2. **Playback method:** a browser on a connected machine (use `/film` fullscreen), or a media player that needs a file (H.264/HEVC MP4 or ProRes, frame rate).
3. **Brightness and viewing distance:** the light field is tuned for a dark-to-dim room. In bright ambient light, raise the minimum text size and consider a solid background.
4. **Loop behaviour on the player:** confirm it loops without a black gap between plays.

To render a file once those are known, screen-record `/film` at the confirmed resolution and 60 fps for exactly 30.0 s from a fresh load. Then check that the first and last frames match.
