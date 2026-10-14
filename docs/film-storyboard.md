# The NEXT Order — 30-second event film

**Format:** 30.0 s · 16:9 · silent · loops · composed on a fixed 1920×1080 frame and scaled to any screen.

**Status:** *implemented* as a live, browser-rendered loop at **`/film`**, using the same components as the site. *No video file has been rendered.* See "Rendering to a file" below. Timings live in `src/content/film.ts`.

## Frame by frame

| Time | Beat | On screen | Exact copy | Motion | Site frame |
| --- | --- | --- | --- | --- | --- |
| 00.0–04.5 | The Next Order | ViaMagus purple. Huge white letters, scrambled. | **THE NEXT ORDER** + magenta cell full stop. From 2.6 s: *The operating model that built your GCC won't run it next.* | Letters hold 0.65 s, then each travels vertically then horizontally into place (1.15 s, staggered). The cell full stop appears when sorting completes. | 01 Hook |
| 04.5–12.0 | The shift | White. Left: label and headline. Right: 100 cells in a four-layer pyramid. | *The shift* · **Built to scale people.** then, at 07.6 s, **Built to scale capability.** | At 07.6 s every cell travels (1.25 s, staggered) into three 7×6 blocks in the force colours. AI-agent outlines appear inside each block; dashed links and labels fade in. | 02 The shift |
| 12.0–16.0 | Build | `#0A0A12`. | *01 · Build* · **Velocity AI** (gradient) · **A shippable release every Friday.** | Two 12-week rows: one release at week 12 versus a block every week, filling left to right. | 03 Forces |
| 16.0–20.0 | Operate | `#1D0031`. | *02 · Operate* · Synthia AI logo · **AI that follows your SOP — and stops for your sign-off.** | A token runs Input → Extract → Check SOP, stops at Sign-off while the gate fills, then continues to Act. Log lines appear step by step. | 03 Forces |
| 20.0–24.0 | Scale | Select paper `#F4F2EC`. | *03 · Scale* · Viamagus select wordmark · **Not 50 CVs. 3–5 people you can hire.** · *50 CVs → 3–5 to hire · 48h* | 50 CV sheets; 47 fade and 3 turn amber and grow. | 03 Forces |
| 24.0–27.0 | The signal | Black. | **8%** (8 in magenta) · **of GCCs are top performers.** · *BCG · GCC Survey 2024 · June 2025* | 0.6 s cross-dissolve, then hold. | 04 Signal |
| 27.0–30.0 | The reveal | Purple, the same composition as 00.0. | **THE NEXT ORDER** + cell · *Everything an enterprise needs to become AI-native.* · viamagus logo | Holds. The loop returns to the scrambled title at 00.0. The re-ordering *is* the loop. | 05 Invitation |

All beats change with a 0.6 s cross-dissolve.

## System

The film reuses `TitleSort`, `ShiftGrid` and `ForceVisuals` from the site, with the same palette (`docs/brand-audit.md`) and the same type (Outfit; Archivo in the Select beat). Copy is 84–120 px headlines and at least 22 px labels on the 1080 p frame, scaling to about 2× on 4K walls. Nothing depends on sound.

## Playing it at the event

Open `/film` fullscreen (F11). Controls and the cursor hide after 2.5 s; **Space** pauses. `?t=12` opens paused at a second, and `?debug` shows the timecode. With *Reduce motion* on, it opens paused on the reveal.

## Rendering to a file (not yet done)

Screen-record `/film` fullscreen at 3840×2160, 60 fps, for exactly 30.0 s from a fresh load. Trim the result and export to H.264 or ProRes.
