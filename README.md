# The NEXT Order — ViaMagus event microsite

**Concept: The next hour.** The NEXT Order runs on a real clock that keeps India time.

1. **Opening:** a live clock on black. The cut title's upper half ticks forward each second and snaps back on the minute.
2. **The eras:** scrolling turns one hand through a full revolution, with native scrolling throughout.
   - **12→4, the old order:** regular, identical ticks.
   - **4→8, the inflection point:** the ticks crack out of line.
   - **8→12, the next order:** the ticks fuse into owned arcs (product, platforms, decisions, capability), with one left open.
   - The headline sits inside the dial, with two sourced figures.
3. **Three hands. One clock.** A live clock whose hands are the three practices: Velocity AI the second hand, Synthia AI the minute hand, ViaMagus Select the hour hand. All three are pinned on the ViaMagus mark. Hovering a practice lights its hand.
4. **Closing:** a countdown that starts as soon as `event.startsAt` is set (until then it shows dashes), beside the registration form.

The film uses the same clocks, and a timing dial (one arc per scene, a playhead and a running timecode) shows where you are in the 30 seconds.

```bash
npm install
vercel env pull .env.local --yes   # DATABASE_URL (Neon) + RESPONSES_PASSWORD
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | Live clock · the eras dial (pinned) · three hands, one clock · countdown + registration |
| `/register` | The shareable registration page, with the same form |
| `/register/response` | **Private.** Every registration, counts by seat, and a CSV download. Protected by HTTP Basic auth (user `viamagus`, password = `RESPONSES_PASSWORD`) |
| `/film` | The 30 s event-screen film (1920×1080 stage, scales to any screen). `?t=17` pauses on a second. M toggles the synthesised score |
| `/og-card` | Internal 1200×630 card, screenshotted to `public/og-image.jpg` (noindex) |
| `/sitemap.xml`, `/robots.txt` | Generated. `robots.txt` blocks `/register/response`, `/api/` and `/og-card` |

## Registrations

- **Storage:** each form posts to `POST /api/register`, which stores the entry in **Neon Postgres**. The database was provisioned through the Vercel Marketplace as the resource `thenextorder-registrations` on team `shreenath-1591s-projects`, and `DATABASE_URL` is injected automatically.
- **One row per email:** registering again updates the existing row.
- **Validation and spam:** inputs are validated on both the client and the server, and a hidden honeypot field filters bots.
- **Where to read them:** `/register/response`, or download the CSV there. Cells are protected against spreadsheet-formula injection.
- **Changing the password:** `vercel env rm RESPONSES_PASSWORD` and then `vercel env add RESPONSES_PASSWORD`, followed by a redeploy.
- **Shared database:** development, preview and production all write to the same database. Delete test rows before launch.

## Before sharing

1. **Fill in `src/content/event.ts`:** date, `startsAt` (an ISO time with offset, which switches on the live countdown), city and venue, format, and speakers. Until then the site shows "To be announced" and invents nothing. Details in the internal event plan that are still marked "to finalise" are not published.
2. **Site URL:** canonical links, the sitemap and OG URLs use `NEXT_PUBLIC_SITE_URL`, falling back to the Vercel production URL. Set it if a custom domain is added.
3. **Sign-off:** the strategy follows the corrected GCC strategy notes (internal; a local copy lives at `docs/strategy-notes.md`, which is git-ignored because this repo is public). Every figure and product quote has its source next to it in `src/content/story.ts`.

## Where things live

```
src/content/            story.ts (all copy + sources), event.ts (verified facts only), film.ts (film timeline)
src/components/clock/   Clock (LiveClock, EraClock, HandsClock, Countdown, FilmDial, StillClock)
src/components/shift/   Site (the page), Mechanisms (the three practice diagrams), Interactive (cut title, reveals, header), InviteForm
src/components/film/    FilmPlayer (the 30 s film), FilmOverlay, score.ts (Web Audio)
src/lib/                registrations.ts (Neon), site-url.ts
src/proxy.ts            Basic auth for /register/response
src/styles/             shift.css (site + register), film-player.css (film), film.css (OG card), shared.css (logos)
docs/                   audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

## Accessibility and fallbacks

- **Semantics:** sections are semantic and each has a labelled heading.
- **Keyboard:** focusing a caption in the eras dial turns the hand to that era, and focusing into any section reveals it immediately.
- **Reduced motion:** the hands step instead of sweeping, the eras hand jumps era by era, and the title doesn't tick.
- **No JavaScript:** all text renders. The form needs JavaScript to submit; without it, a notice gives the contact email instead.
- **Contrast and audit:** axe (WCAG 2.1 AA) passes on `/`, `/register` and `/film` at 1440 and 390 px wide.
