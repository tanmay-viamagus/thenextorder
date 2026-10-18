# The NEXT Order — ViaMagus event microsite

**Concept: The Shift.** One motif, a field of identical cells cut by a threshold, carries the whole story. Very little is said.

1. **Opening:** "THE NEXT ORDER" is cut along a line. Everything above the line shifts with the pointer, the type and the field of cells alike.
2. **The shift:** a single artwork in a pinned scene, with native scrolling throughout. A strict grid of identical cells ("The work you were given") cracks along the line and slides ("Then the walls moved"). The cells then fuse into owned volumes (product, platforms, decisions, quality, capability, efficiency), with the old grid kept as the foundation and one volume left open ("What will your centre own next?"). There are three headlines and two sourced figures.
3. **The practices:** Velocity AI, Synthia AI and ViaMagus Select as three equal panels joined by one continuous line, which flows into the ViaMagus mark.
4. **Closing:** the title returns with its shift resolved, next to the registration form.

The strategy notes shape the composition and what's left out. They aren't published.

```bash
npm install
vercel env pull .env.local --yes   # DATABASE_URL (Neon) + RESPONSES_PASSWORD
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | Opening · the shift (pinned artwork) · the three practices · the close, with the registration form |
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

1. **Fill in `src/content/event.ts`:** date, city and venue, format, and speakers. Until then the site shows "To be announced" and invents nothing. Details in the internal event plan that are still marked "to finalise" are not published.
2. **Site URL:** canonical links, the sitemap and OG URLs use `NEXT_PUBLIC_SITE_URL`, falling back to the Vercel production URL. Set it if a custom domain is added.
3. **Sign-off:** the strategy follows the corrected GCC strategy notes (internal; a local copy lives at `docs/strategy-notes.md`, which is git-ignored because this repo is public). Every figure and product quote has its source next to it in `src/content/story.ts`.

## Where things live

```
src/content/            story.ts (all copy + sources), event.ts (verified facts only), film.ts (film timeline)
src/components/shift/   Site (the page), ShiftArt (the grid → crack → volumes artwork, also used by the film),
                        Mechanisms (the three practice diagrams), Interactive (cut title, reveals, header), InviteForm
src/components/film/    FilmPlayer (the 30 s film), FilmOverlay, score.ts (Web Audio)
src/lib/                registrations.ts (Neon), site-url.ts
src/proxy.ts            Basic auth for /register/response
src/styles/             shift.css (site + register), film-player.css (film), film.css (OG card), shared.css (logos)
docs/                   audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

## Accessibility and fallbacks

- **Semantics:** sections are semantic and each has a labelled heading.
- **Keyboard:** focusing a caption in the pinned scene moves the artwork to that state, and focusing into any section reveals it immediately.
- **Reduced motion:** the pinned artwork snaps between its three states with no tweening. Nothing else moves.
- **No JavaScript:** all text renders. The form needs JavaScript to submit; without it, a notice gives the contact email instead.
- **Contrast and audit:** axe (WCAG 2.1 AA) passes on `/`, `/register` and `/film` at 1440 and 390 px wide.
