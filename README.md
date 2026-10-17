# The NEXT Order — ViaMagus event microsite

One living system of cells tells the whole story. About 5,600 square particles, the cell from the ViaMagus mark, rebuild themselves chapter by chapter as you scroll:

1. **The title.** The cells assemble "THE NEXT ORDER." The cursor parts them, and press-and-hold breaks the title apart.
2. **The pyramid.** A rigid pyramid stands for the old order.
3. **The shatter.** The pyramid explodes on magenta: "AI changed the rules."
4. **8%.** "of GCCs lead."
5. **The three forces.** Three turning clusters, one each for Velocity AI, Synthia AI and ViaMagus Select. Hover or tap one to open it.
6. **The ViaMagus mark** on black, with the closing line.
7. **The invitation.** Every cell converges into a single square behind the button.

Scrolling is native. There's no scroll-jacking, and the chapters sit on sticky stages. The 30-second film is the same engine on a clock. Built with Next.js 16 (App Router), React 19, raw WebGL and plain CSS. No animation libraries.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | The seven chapters above |
| `/film` | The 30 s film for event screens: the same cells on a clock, with venue-size captions. Optional synthesised score (M). `?t=18` pauses on a second |
| `/og-card` | Internal 1200×630 card, screenshotted to `public/og-image.jpg` (noindex) |

## Where the CTA sits, and why

The CTA appears at four points, each where a reader's intent peaks. There is only ever one ask: **Request an invitation**.

- **Above the fold** in the arrival, next to "Watch the film". It catches people who arrive already decided.
- **At the emotional peak:** "Be in the room" sits directly under *8% of GCCs lead*, the moment of highest tension.
- **A floating pill** in the thumb zone, on the chapters without their own CTA (the old order, the shatter, the forces, the mark). It hides wherever a CTA is already on screen, so there are never two at once.
- **The finale:** every cell on the page converges into one square, and the button sits on it. The whole story ends on the ask.

## Before sharing

1. **Fill in `src/content/event.ts`:** date, city, venue, format, speakers and the RSVP link. Until then the site says "To be announced", and the button sends interest to `viamagus.com/#contact`. Nothing is invented.
2. **Site URL:** on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` makes share links absolute. Set `NEXT_PUBLIC_SITE_URL` to override it.
3. **Sign-off:** brand values come from the live sites (`docs/brand-audit.md`). Claims are quoted from the official product pages, with sources noted in `src/content/story.ts`.

## Where things live

```
src/content/            story.ts (all copy + claim sources), event.ts (verified facts only), film.ts (film timeline)
src/components/order/   engine.ts (WebGL cells + spring physics), formations.ts (shapes), story.ts (the formation sequence), OrderSite.tsx (chapters + interaction)
src/components/film/    FilmPlayer (same engine on a clock), FilmOverlay, score.ts (Web Audio)
src/styles/             order.css (site), film-player.css (film), shared.css (logos), film.css (OG card)
docs/                   audit.md, self-audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

## Accessibility and fallbacks

- **Reduced motion:** the cells sit still in each shape, with no springs or scatter. Text appears without movement, and the film opens paused on the mark.
- **No WebGL:** each chapter falls back to its flat colour field, and all copy stays readable.
- **No JavaScript:** all text renders.
- **Keyboard:** every control is reachable. Focusing into a chapter brings it on screen, and the hidden pill leaves the tab order.
- **Screen readers:** the force panel is announced through `aria-live`, and the film has a text description.
