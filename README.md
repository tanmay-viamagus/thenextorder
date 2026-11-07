# The NEXT Order — Viamagus event microsite

**Concept: the shift.**

1. **Opening.** "THE NEXT ORDER", full width, cut by a magenta line across the screen; one line, one action, the details.
1a. **One story — current state → problem → answer → the event** (chapters 01–05, alternating light and dark): **01 Then** · how a GCC evolved, ending at "the next order" (light) → **02 What's new** · the problem (midnight): "AI is reshaping how GCCs hire, build and lead" — each verb a button, its topics always visible, and under each column "Answered by …" linking down to the practice; it ends "Three shifts need three answers. Here's what Viamagus brings ↓" → **03 The answer** · hosted by Viamagus (paper): *Hire. Build. Operate.* — three equal panels, Viamagus Select (technology talent), Velocity AI (AI-speed product engineering), Synthia AI (governed AI workflows and business processes), then Build-Operate-Transfer and AI training — closing "See it, and the people behind it, on 3 December ↓" → the film band and **04 The evening** (midnight, the doorway in full) → **05 Your place** (light). The GIC → GCC → ? board (`NameBoard.tsx`) is kept in the repo but not on the page.
   - Below the line, the old order: aligned and grey.
   - Above it, the next order: turned out of alignment, lilac, and partly fused into owned arcs.
   - Title and ring shift with the pointer, and the ring's centre plays the film ("See what's changing").
1c. **The theme** (from the event brief): "The next decade is being decided now." A horizon (today → +10 → +20 years), three shifts with line drawings, and "In the room":
   - **Talent:** roles changing, new ones emerging.
   - **Technology:** agentic workforces, led and overseen by people.
   - **Leadership:** sound AI decisions.
   - **In the room:** leadership discussions, preparing for the next 10–20 years, and networking across Hyderabad's GCCs.
2. **How a GCC evolves.** One editorial line illustration on ivory that evolves through five stages, driven by scroll (pinned, native) or the timeline set on the ground line:
   - **01 The origin:** a recognisable headquarters with people at its entrance, and an empty plot in India.
   - **02 The arrival:** a modest India centre, joined to HQ by "the mandate", with a brief travelling along it.
   - **03 The operating centre:** a bigger building whose glass front shows teams at desks; briefs go in and finished work comes back.
   - **04 The ownership shift:** a tower signed Product · Platforms · Engineering, a glass room on the roof ("Decisions made here"), and purple products flowing back to HQ.
   - **05 The next order:** links to other markets, and a crane building what's NEXT.

   The stage in focus is sharp and earlier ones step back. From 04 the caption closes with the capability gap and one link to Viamagus Select. On phones the camera pans across the scene. It is a conceptual journey, not a rule. The earlier ring of years (`components/clock/YearCycle.tsx`) is kept for later.
3. **Three hands. One clock.** Velocity AI, Synthia AI and Viamagus Select. Each gets a diagram, a colour-coded action to its own site ("Let's build", "Let's automate", "Let's hire") and "Bring a … to the room", which preselects it on `/register`.
3b. **The film**, near the end only: "See what's changing" with a play button, above the practices playing as a story (progress bars, the three-hands clock, each practice's transformation); it restarts at Build when it comes into view.
4. **Closing.** "Find your place in the conversation", with three steps (request, review, invitation) beside the form.

There is one call to action everywhere: **Request your place**. It goes to `/register`, which opens at the top. Places are confirmed by invitation.

```bash
npm install
vercel env pull .env.local --yes   # DATABASE_URL (Neon), RESPONSES_PASSWORD, FORM_SECRET
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm test           # LinkedIn links, speakers and logos, RSVP replies and calendar file
```

| Route | What it is |
| --- | --- |
| `/` | Live clock · the eras dial (pinned) · three hands, one clock · countdown + registration |
| `/register` | The shareable registration page, with the same form |
| `/register/response` | **Private.** Every registration, counts by seat, and a CSV download. Protected by HTTP Basic auth (user `viamagus`, password = `RESPONSES_PASSWORD`) |
| `/rsvp` | The RSVP page sent with the invitation: the event's details, a link to the site, and a Yes / Tentative / No reply (noindex) |
| `/rsvp/calendar.ics` | The evening as a calendar file, offered after a Yes or Tentative |
| `/register/response/rsvp` | **Private.** Every RSVP, counts by reply and by list, the links to send, and a CSV download. Same password as `/register/response` |
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

## RSVPs

The RSVP page answers the invitation the way a calendar invite does: the guest chooses **Yes**, **Tentative** or **No** and gives their name, work email and organisation. After a Yes or Tentative it offers the evening for Google Calendar, Outlook and Apple Calendar (`.ics`); after a No, a prompt to pass the invitation to a colleague. No email is sent.

- **The links to send** (also listed on `/register/response/rsvp`):
  - Rahul's guest list: `https://thenextorder.events/rsvp?ref=guest-list`
  - The Viamagus invitee list: `https://thenextorder.events/rsvp?ref=invitee-list`
- **A reply button in an email:** add `&reply=yes`, `&reply=tentative` or `&reply=no` and the page opens with that reply chosen. The guest still fills in their details and sends it.
- **Another list:** add `"ref": "Its name"` to `rsvpLists` in `src/content/rsvp.ts` and send `/rsvp?ref=ref`. An unknown `ref` is still stored and shown as it is; no `ref` shows as "Direct link".
- **Storage:** `POST /api/rsvp` stores the reply in the `rsvps` table in the same Neon database as registrations (created on the first reply). There is one row per email: a changed reply updates the row and keeps the one before (`previous_reply`), and the list the first reply came from is kept.
- **Changing a reply:** the guest opens the same link again. Their browser remembers their last reply and offers it to change.
- **Protection:** the same as registration: BotID, honeypot, signed form token and per-IP rate limit. As with registration, anyone with the link can reply in any email's name; the organisers' page shows each row's email to check against the list.
- **Where to read them:** `/register/response/rsvp`, or download the CSV there.
- **Words:** the page's copy is in `src/content/rsvp.ts`; the event's facts come from `src/content/event.ts`.

## Event facts (confirmed)

- **City:** Hyderabad.
- **Audience:** Hyderabad's GCC leaders and decision-makers.
- **Ecosystem partner:** Hyderabad Mavericks.
- **Positioning:** Viamagus builds technology platforms and solutions for large MNCs and GCCs; Viamagus Select provides talent and hiring support; the AI leadership programme upskills current leaders into AI decision-makers.
- **Still to be announced:** date, venue and format.

## Before sharing

1. **`src/content/event.ts`** holds the confirmed facts from the brochure (Thursday 3 December 2026, from 3:30 PM, T-Hub, Hyderabad, by invitation) and the tentative agenda. Speakers go in `src/content/speakers.ts` (see below). Details in the internal event plan that are still marked "to finalise" are not published.
2. **Site URL:** canonical links, the sitemap and OG URLs use `NEXT_PUBLIC_SITE_URL`, falling back to the Vercel production URL. Set it if a custom domain is added.
3. **Sign-off:** the strategy follows the corrected GCC strategy notes (internal; a local copy lives at `docs/strategy-notes.md`, which is git-ignored because this repo is public). Every figure and product quote has its source next to it in `src/content/story.ts`.

## Speakers and organisations

Two sections follow 02 The meeting point: **The people shaping what’s next** (speakers and panellists, on near-black) and **Organisations shaping the next order** (the logo wall, on cream). Each is built from one data file and stays off the page until that file has entries; until the logos arrive, the wall shows blank placeholder tiles (`placeholderTiles` in `organisations.ts`, 0 to hide them). Only supplied names, details, photos and logos go in: nothing invented, redrawn or approximated.

**A speaker or panellist.** Put the photo in `public/speakers/`: a portrait at least 800 px wide, as JPG, PNG, WebP or AVIF. It is shown at 4:5, cropped from the centre. Then add an entry to the right group in `src/content/speakers.ts`:

```ts
{
  name: "Full name",
  role: "Designation",                        // optional
  company: "Organisation",                    // optional
  photo: "/speakers/full-name.jpg",           // optional: their initials stand in until it arrives
  photoFocus: "50% 20%",                      // optional: where the face sits, if the centre crop cuts it
  linkedin: "https://www.linkedin.com/in/handle", // optional
  bio: "A few lines about them.",            // optional: shown behind the card's Profile toggle
  part: "Moderator",                          // optional: their part in the group, tagged on the portrait
},
```

- **Order:** people show in the order listed, and groups in the order of `speakerGroups`.
- **Moving or removing someone:** move or delete the entry.
- **Groups:** a new category (for example one per panel, with the panel's theme as `note`) is another `{ title, note, people }` in `speakerGroups`. Empty groups don't show. Each panel's moderator sits in the panel's group with `part: "Moderator"`.
- **Wording:** the section's own label, heading and intro are in `speakersCopy`.
- **Structured data:** the speakers are also listed in the page's event data for search engines.

**An organisation.** Put the supplied logo in `public/organisations/`. SVG is best; otherwise use a PNG or WebP with a transparent background. Then add `{ name: "Organisation", logo: "/organisations/organisation.svg" }` to `organisations` in `src/content/organisations.ts`:

- **Order:** logos show in the order listed, and a short last row is centred.
- **Fit:** each logo is fitted inside its tile at its own proportions, never stretched or cropped.
- **Colour:** logos show in their own colours, with no hover effect. Set `treatment: "mono"` for a quiet greyscale logo, or `treatment: "solid"` for a logo supplied in white or too pale for the page.
- **Size:** `scale` (0.6–1.4) nudges a logo that looks heavier or slighter than the rest.
- **No logo yet:** an organisation without a `logo` shows its name in type.
- **Placeholders:** the blank tiles give way to the real logos as soon as `organisations` has an entry.
- **Wording:** the wall carries no invitation, attendance or sponsorship wording.
- **On the invitation pages:** the same logos show on `/rsvp` and `/register`, under the title, as a band headed “With leaders from” (`organisationsCopy.strip`). That line has to stay true of every logo listed, including any whose organisation has nobody on stage.

`npm test` checks both files: every photo and logo exists in `public/`, every LinkedIn link is a canonical profile link, nobody is listed twice, and the logo wall's wording stays clear of "invited", "confirmed", "sponsor" and the like. The section design is in `src/components/shift/Showcase.tsx` and `src/styles/showcase.css`.

## Where things live

```
src/content/            story.ts (all copy + sources), event.ts (verified facts only), film.ts (film timeline),
                        speakers.ts + organisations.ts (the two sections after 02)
src/components/clock/   ShiftRing (hero), YearCycle (the year), Clock (HandsClock, FilmDial)
                        rsvp.ts (the RSVP page's words and lists)
src/components/shift/   Site (the page), Mechanisms (the three practice diagrams), Interactive (cut title, reveals, header), InviteForm, Showcase (speakers, logo wall), RsvpForm
src/components/film/    FilmPlayer (the 30 s film), FilmOverlay, score.ts (Web Audio)
src/lib/                db.ts (Neon client), registrations.ts, rsvp.ts (replies + calendar), rsvp-store.ts (the rsvps table), guard.ts (token + rate limit), linkedin.ts, site-url.ts
src/instrumentation-client.ts  BotID client
tests/                  linkedin, showcase, rsvp, confirmation-email (npm test)
src/proxy.ts            Basic auth for /register/response (and its RSVPs page)
src/styles/             shift.css (site + register), showcase.css (speakers, logo wall), joins.css (where sections meet), rsvp.css (RSVP page + organisers' tabs), film-player.css (film), film.css (OG card), shared.css (logos)
docs/                   audit.md, brand-audit.md, next-order-research.md, film-storyboard.md
```

## Accessibility and fallbacks

- **Semantics:** sections are semantic and each has a labelled heading.
- **Keyboard:** focusing a caption in the eras dial turns the hand to that era, and focusing into any section reveals it immediately.
- **Reduced motion:** the hands step instead of sweeping, the eras hand jumps era by era, and the title doesn't tick.
- **No JavaScript:** all text renders. The form needs JavaScript to submit; without it, a notice gives the contact email instead.
- **Contrast and audit:** axe (WCAG 2.1 AA) passes on `/`, `/register` and `/film` at 1440 and 390 px wide.
