# The NEXT Order — ViaMagus event microsite

**Concept: the shift.**

1. **Opening.** "THE NEXT ORDER", full width, cut by a magenta line across the screen; one line, one action, the details.
1b. **GCC → GIC → ?** A split-flap board pinned while you scroll: the middle letter flips C → I, then flips once more to a magenta "?" — not written yet. The name will follow the mandate; labelled as an open question, not a prediction.
   - Below the line, the old order: aligned and grey.
   - Above it, the next order: turned out of alignment, lilac, and partly fused into owned arcs.
   - Title and ring shift with the pointer, and the ring's centre plays the film ("See what's changing").
2. **How a GCC evolves.** A pinned scene with five stages, driven by scroll or by the 01–05 buttons. One organisational form evolves throughout:
   - **01 The origin:** a solid tower in the home market, with the decision node on top.
   - **02 The arrival:** a bridge, and one block in India.
   - **03 The operating centre:** India fills with teams, and work flows in.
   - **04 The ownership shift:** the blocks fuse into Product, Platforms and Engineering; work flows back in purple; a decision node appears in India.
   - **05 The next order:** India connects out across the organisation and builds what's NEXT.

   From 04 a restrained ViaMagus Select note names the capability gap. It is a conceptual journey, not a rule. The earlier ring of years (`components/clock/YearCycle.tsx`) is kept for later and is still used in the film.
3. **Three hands. One clock.** Velocity AI, Synthia AI and ViaMagus Select. Each gets a diagram, a colour-coded action to its own site ("Let's build", "Let's automate", "Let's hire") and "Bring a … to the room", which preselects it on `/register`.
3b. **The film**, near the end only: "See what's changing" with a play button, above the practices playing as a story (progress bars, the three-hands clock, each practice's transformation); it restarts at Build when it comes into view.
4. **Closing.** "Find your place in the conversation", with three steps (request, review, invitation) beside the form.

There is one call to action everywhere: **Request your place**. It goes to `/register`, which opens at the top. Places are confirmed by invitation.

```bash
npm install
vercel env pull .env.local --yes   # DATABASE_URL (Neon), RESPONSES_PASSWORD, FORM_SECRET
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm test           # LinkedIn URL validation
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
- **Validation:** every field is validated on the client and again on the server. The LinkedIn link must be an https personal profile on linkedin.com (or a country subdomain), and is stored in canonical form. This checks the format only; it does not verify identity.
- **Bot protection, all enforced server-side in `POST /api/register`:**
  - Vercel BotID (invisible; `checkBotId()`). If BotID itself fails on Vercel, the request is refused; off Vercel (local) it is skipped.
  - A hidden honeypot field.
  - A signed form token from `GET /api/register/token`. Submissions without it, with a forged one, or within 2.5 s are refused.
  - Per-IP rate limiting (6 attempts per 10 minutes), with IPs stored only as salted hashes.
  - Without `FORM_SECRET`, every submission is refused (fail closed).
- **Optional:** BotID Deep Analysis can be switched on in the Vercel dashboard under Firewall → Configure.
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
src/components/clock/   ShiftRing (hero), YearCycle (the year), Clock (HandsClock, FilmDial)
src/components/shift/   Site (the page), Mechanisms (the three practice diagrams), Interactive (cut title, reveals, header), InviteForm
src/components/film/    FilmPlayer (the 30 s film), FilmOverlay, score.ts (Web Audio)
src/lib/                registrations.ts (Neon), guard.ts (token + rate limit), linkedin.ts, site-url.ts
src/instrumentation-client.ts  BotID client
tests/                  linkedin.test.mts (npm test)
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
