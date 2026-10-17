# The NEXT Order — ViaMagus event microsite

A sequence of flat colour fields in the ViaMagus palette, with poster-scale type on a 12-column grid. It tells the Three Eras story: arrival, the old order, the inflection point with four sourced signals, then the next order (Build · Operate · Scale, each in its own colour) and the mark on black. A 30-second film plays fullscreen from the site and loops at `/film` for event screens. Built with Next.js 16 (App Router), React 19 and plain CSS. There are no animation libraries.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | Act I arrival · Era 01 the old order · Era 02 the inflection point (four signals) · Era 03 the next order (Build / Operate / Scale + convergence) · the ViaMagus mark and the closing line · the invitation |
| `/film` | The 30 s film for event screens: WebGL light field, optional synthesised score (M). `?t=22` pauses on a second |
| `/film-poster` | Internal: renders the light-field still saved as `public/film-poster.jpg` (noindex) |
| `/og-card` | Internal 1200×630 card, screenshotted to `public/og-image.jpg` (noindex) |

## Before sharing

1. **Fill in `src/content/event.ts`:** date, city, venue, format, speakers and the RSVP link. Until then the site says "Shared with invitees", and the button sends interest to `viamagus.com/#contact`. Nothing is invented. `docs/self-audit.md` explains why these fields matter most.
2. **Site URL:** on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` makes share links absolute automatically. Set `NEXT_PUBLIC_SITE_URL` to override it with a custom domain.
3. **Sign-off:** the brand values come from the live sites (`docs/brand-audit.md`), and the claims are quoted from the official product pages (sources noted in `src/content/story.ts`).

## Where things live

```
src/content/      story.ts (all copy + claim sources), event.ts (verified facts only), film.ts (timeline)
src/components/   site/Sections (the colour fields), site/Motion (reveals, count-ups, header ink, cursor), TitleSort, Triptych + ForceVisuals (film)
src/components/film/  FilmPlayer, FilmOverlay, shader.ts (light field), score.ts (Web Audio)
src/styles/       site.css (site), shared.css (title, logos), shutters.css + film-player.css (film), film.css (OG card)
docs/             audit.md (issues found and fixed), self-audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

Accessibility: semantic sections, keyboard-operable toggle and links, `prefers-reduced-motion` shows every frame in its final state, and without JavaScript the title renders in order.
