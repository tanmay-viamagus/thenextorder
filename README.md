# The NEXT Order — ViaMagus event microsite

Six screens, one idea each, about 40 seconds end to end, plus a 30-second crescendo film. The film plays fullscreen from the site and loops at `/film` for the event screens. Built with Next.js 16 (App Router), React 19 and plain CSS. There are no animation libraries.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | 01 Hook (the title sorts itself; Watch the film) · 02 The film (logo on black) · 03 The shift (pyramid → three forces) · 04 Build / Operate / Scale (scroll pulls a thread that drops three shutters) · 05 The 8% signal · 06 The invitation |
| `/film` | The 30 s film for event screens: WebGL light field, optional synthesised score (M). `?t=22` pauses on a second |
| `/film-poster` | Internal: renders the light-field still saved as `public/film-poster.jpg` (noindex) |
| `/og-card` | Internal 1200×630 card, screenshotted to `public/og-image.png` (noindex) |

## Before sharing

1. **Fill in `src/content/event.ts`:** date, city, venue, format, speakers and the RSVP link. Until then the site says "Shared with invitees", and the button sends interest to `viamagus.com/#contact`. Nothing is invented. `docs/self-audit.md` explains why these fields matter most.
2. **Site URL:** on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` makes share links absolute automatically. Set `NEXT_PUBLIC_SITE_URL` to override it with a custom domain.
3. **Sign-off:** the brand values come from the live sites (`docs/brand-audit.md`), and the claims are quoted from the official product pages (sources noted in `src/content/story.ts`).

## Where things live

```
src/content/      story.ts (all copy + claim sources), event.ts (verified facts only), film.ts (timeline)
src/components/   TitleSort, ShiftGrid, Triptych + ForcesShutters (the thread), ForceVisuals, Frames, Director
src/components/film/  FilmPlayer, FilmOverlay, shader.ts (light field), score.ts (Web Audio)
src/styles/       frames.css (site), shutters.css (the thread), film-player.css (film), film.css (OG card)
docs/             self-audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

Accessibility: semantic sections, keyboard-operable toggle and links, `prefers-reduced-motion` shows every frame in its final state, and without JavaScript the title renders in order.
