# The NEXT Order — ViaMagus event microsite

Five screens, one idea each, about 40 seconds end to end, plus a 30-second film for the event screens. Built with Next.js 16 (App Router), React 19 and plain CSS. There are no animation libraries.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | 01 Hook (the title sorts itself) · 02 The shift (pyramid → three forces) · 03 Build / Operate / Scale · 04 The 8% signal · 05 The invitation |
| `/film` | The silent, looping 30 s film (16:9). `?t=12` pauses on a second; `?debug` shows the timecode |
| `/og-card` | Internal 1200×630 card, screenshotted to `public/og-image.png` (noindex) |

## Before sharing

1. **Fill in `src/content/event.ts`:** date, city, venue, format, speakers and the RSVP link. Until then the site says "Shared with invitees", and the button sends interest to `viamagus.com/#contact`. Nothing is invented. `docs/self-audit.md` explains why these fields matter most.
2. **Site URL:** on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` makes share links absolute automatically. Set `NEXT_PUBLIC_SITE_URL` to override it with a custom domain.
3. **Sign-off:** the brand values come from the live sites (`docs/brand-audit.md`), and the claims are quoted from the official product pages (sources noted in `src/content/story.ts`).

## Where things live

```
src/content/      story.ts (all copy + claim sources), event.ts (verified facts only), film.ts (timeline)
src/components/   TitleSort, ShiftGrid, ForceVisuals, Frames, Director (in-view + header), Film
src/styles/       frames.css (site), film.css (film + OG card)
docs/             self-audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

Accessibility: semantic sections, keyboard-operable toggle and links, `prefers-reduced-motion` shows every frame in its final state, and without JavaScript the title renders in order.
