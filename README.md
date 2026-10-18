# The NEXT Order — ViaMagus event microsite

**Concept: The Shift — the mandate drawn as architecture.** A centre's mandate is shown as a floor plan, in three stages:

- **Then:** a small room inside someone else's building, laid out as briefed.
- **Now:** its walls move outward.
- **Next:** a larger plan of rooms the centre owns, with one left open, "yours to draw".

Monumental type is cut along a single threshold line, and everything above the line shifts. The page is laid out like a set of numbered drawing sheets, in ViaMagus purple on drawing paper. Built with Next.js 16 (App Router), React 19 and plain CSS. No animation libraries.

```bash
npm install
vercel env pull .env.local --yes   # DATABASE_URL (Neon) + RESPONSES_PASSWORD
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

| Route | What it is |
| --- | --- |
| `/` | Hero, **Sheet 01** Then (the old order), **02** Now (the inflection point, with sourced figures and the value lens), **02·B** the naming question (exploratory, interactive), **03** Next (the central question, plus questions for each seat), **Sheets A–C** Build / Operate / Scale, the convergence, and **04** Attend (with the registration form) |
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
src/components/shift/   Site (the page), Plan (floor-plan drawings), Mechanisms (the three practice diagrams),
                        Interactive (shift title, reveals, header, name-the-centre, seats), InviteForm (registration)
src/components/film/    FilmPlayer (the 30 s film), FilmOverlay, score.ts (Web Audio)
src/lib/                registrations.ts (Neon), site-url.ts
src/proxy.ts            Basic auth for /register/response
src/styles/             shift.css (site + register), film-player.css (film), film.css (OG card), shared.css (logos)
docs/                   audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

## Accessibility and fallbacks

- **Semantics:** sections are semantic and each has a labelled heading.
- **Keyboard:** the seat questions use radio-group behaviour with arrow keys, and focusing into a section reveals it immediately.
- **Reduced motion:** nothing moves, and every drawing appears in its final state.
- **No JavaScript:** all text renders. The form needs JavaScript to submit; without it, a notice gives the contact email instead.
- **Contrast and audit:** axe (WCAG 2.1 AA) passes on `/`, `/register` and `/film` at 1440 and 390 px wide.
