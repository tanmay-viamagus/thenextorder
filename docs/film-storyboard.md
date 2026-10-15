# The NEXT Order — the film (30 s)

**What it is:** a 30-second crescendo, built separately from the site's animations. It starts with tension, speeds up through fast cuts, rushes to a peak, goes silent for one second, then the ViaMagus logo slams in on black. It plays on a fixed 1920×1080 stage scaled to any screen, over a live WebGL light field in ViaMagus colours. The light intensifies with the story, flashes on every cut, and the camera shakes on every hit.

**Where it plays:**
- On the site: the *Watch the film* button on the first screen, the black film frame (02), or the header button. All three open it fullscreen over the page; Esc closes it.
- On event screens: `/film`.

**Sound:** off by default. *Sound on* (or **M**) plays a score synthesised in the browser with no audio files: a pulse, hats, a riser, a kick on every rush word, a sub-bass boom under the logo, and a pad under the title. The film never depends on sound.

**Status:** implemented and running live. No video file has been rendered. Timings are in `src/content/film.ts`.

| Time | Scene | On screen | Motion and light | Sound |
| --- | --- | --- | --- | --- |
| 0.0–2.2 | Cursor | Letterboxed. A magenta cell blinks on black. *Every enterprise runs on an order.* types out. | Light field off; letterbox bars closed through the old order. | — |
| 2.2–4.4 | The old order | 96 navy cells pop into a rigid grid. **THE OLD ORDER.** wipes in as outline type. | Desaturated, low light, small flash on the cut. | Kick and snap; the pulse begins |
| 4.4–6.2 | The crack | The grid breaks; each cell falls and spins away. **Built to scale people.** punches in. | Colour starts to return. | Hit |
| 6.2–8.0 | The rules | The letterbox bursts open. **AI CHANGED THE RULES.** slams in with cyan/magenta channel split. | Full purple burst and big flash. | Hit |
| 8.0–10.0 | The signal | **8%** (magenta) slams in from blur. *of GCCs are top performers.* · BCG · GCC Survey 2024, N = 150 · June 2025 | Pulled back. | Hit |
| 10.0–11.1 | The thread | A magenta thread runs across the top. Three shutters drop on it in turn (Build, Operate, Scale), each with its cord and cell handle, until all three hang side by side and the thread lights. | Flash on each drop. | Kick on each drop |
| 11.1–17.5 | The push | The camera pushes into each shutter in turn (Velocity: *A shippable release every Friday.* · Synthia: *AI that follows your SOP — and stops for your sign-off.* · Select: *Not 50 CVs. 3–5 people you can hire.*) while the other two dim. Each demo plays live. | Hit at 12.1, 14.0 and 15.9 s. | Kick on each push; hats run underneath |
| 17.5–21.0 | The rush | *Build. Operate. Scale. Engineering. Intelligence. Talent. Three forces.* one word every 0.4 s, then **ONE ORDER.** holds. | Full energy, flash on every word. | Kick per word over a rising noise sweep |
| 21.0–22.0 | Silence | Black. One magenta cell pulses once. | Light cut to zero. | Nothing |
| 22.0–25.2 | The logo | The two halves of the ViaMagus mark fly in, spinning, and lock. Two shockwave rings, then a magenta light sweeps across the mark. *viamagus* resolves from blur and wide tracking. | Black with a faint purple halo. | Sub-bass boom |
| 25.2–28.4 | The title | **THE NEXT ORDER.** sorts itself (fast). *Everything an enterprise needs to become AI-native.* | Light field at its brightest. | Pad chord |
| 28.4–30.0 | The invitation | *An invitation from ViaMagus* · *For GCC leaders* (plus date and venue once set in `event.ts`). Fades to the single cell, which is also the first frame of the loop. | Down to embers. | Pad releases |

All claims are the same verified ones used on the site (see `src/content/story.ts` and `docs/next-order-research.md`).

**Event screens:** open `/film` and press F11. Controls and the cursor hide after 2.2 s. **Space** pauses, **M** toggles sound. `?t=22` opens paused at a given second. With *Reduce motion* on, it opens paused on the logo.

**Rendering a file (not done):** screen-record `/film` at 3840×2160, 60 fps, for 30.0 s from a fresh load, with *Sound on* if you want the score. Then trim the recording to exactly 30.0 s.
