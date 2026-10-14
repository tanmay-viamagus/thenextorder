# Brand audit — The NEXT Order

Audited 14 October 2026 from the live production sites. Every value below was read from the shipped CSS or HTML, not from screenshots. File names refer to the hashed Next.js chunks served at the time of the audit and will change on the next ViaMagus deploy.

## Sources inspected

| Site | What was read |
| --- | --- |
| https://viamagus.com/ | HTML (`<body>` font classes, `<h1>`/`<h2>` inline styles), stylesheet `/_next/static/chunks/0x912w6i5n6en.css` (`:root` tokens, `@font-face`), `/viamagus-logo.svg`, `/vmLogo.ico` |
| https://viamagus.com/synthia-ai | HTML (hero `<h1>`, inline colours), `/synthia-ai-logo-white.svg`, `/logos/synthia-ai-lockup-dark.svg` |
| https://viamagus.com/velocity-ai | HTML (hero `<h1>`, `.vai-gtext` rule, inline colours) |
| https://www.viamagusselect.ai/ | HTML with inline `<style>` (`--ink`, `--paper`, `--purple` … tokens, `.wordmark`, `.vm-logo`), Google Fonts preloads |

There was no local code or design source in this repository, so the live sites are the only authority used. Nothing disagreed between sites on the shared tokens (`#6608a9` appears on all four).

## Master brand — ViaMagus

From `:root` in `0x912w6i5n6en.css` on viamagus.com:

| Token (official name) | Value | Used in this microsite for |
| --- | --- | --- |
| `--color-primary` | `#6608a9` | Structural purple: horizons, frames, focus ring |
| `--color-primary-dark` | `#2f0050` | Deep glows, gradient stops |
| `--color-primary-darker` | `#1d0031` | Darkest gradient stop |
| `--color-secondary` | `#fc60db` | Magenta light at the core of the horizon line; sparing accents |
| `--color-background-dark` | `#010103` | Page background |
| `--color-background-light` / `--color-text-light` | `#fcfdff` | Primary text on dark |
| `--color-text-muted` | `#909091` | Secondary text on dark (6.6:1 on `#010103`) |
| `--color-text-secondary` | `#5d6085` | Decorative lines only (fails AA for body text on black) |
| `--color-border-dark` | `#2f3254` | Hairlines, architectural grid |
| `--color-border` | `#cdcee4` | Hairlines on light |
| `--focus-ring` | `2px solid #6608a9` | Reused as-is (lightened to `#B784EC` on dark for visibility) |

Also frequent in viamagus.com markup: `#F2D0FF` (pale lilac highlight, 14 uses). Used here for the light inside the gateway.

### Typography — ViaMagus

- **Outfit** is the display and body face. Every `<h1>`/`<h2>` on viamagus.com sets `font-family: var(--font-outfit)`. The hero `<h1>` uses `line-height: 1.1; letter-spacing: -0.02em` at weight 400. `@font-face` ships weights 400 and 600. The microsite loads the Google variable font and uses 300–600.
- **Josefin Sans 500** is used only for the "viamagus" logotype. The Select stylesheet comment confirms this: *"the Viamagus logo (mark + 'viamagus' in Josefin Sans, as on viamagus.com)"*.
- **Geist Mono** is the site's `--font-mono` (`--default-mono-font-family`). The microsite uses it for labels, act numbers and timecodes.
- Poppins and Plus Jakarta Sans are also loaded on viamagus.com, for secondary body text. They are not used here, to keep the page light.

### Logo

- Mark: `/viamagus-logo.svg`, two triangles with `fill="currentColor"`, saved unmodified as `public/brand/viamagus-mark.svg`. Because it inherits `currentColor`, it is rendered in `#fcfdff` on dark, as on viamagus.com.
- Lockup: the mark followed by "viamagus" in Josefin Sans 500, lowercase. This matches the markup used on viamagusselect.ai (`.vm-logo`).
- Favicon: `/vmLogo.ico` (a 32×32 PNG), copied as `src/app/icon.png`.

## Sub-brands

### Velocity AI (viamagus.com/velocity-ai)

| Value | Source |
| --- | --- |
| `linear-gradient(90deg, #9500FF 0%, #00C7CE 100%)` | `.vai-gtext` rule (gradient text in the hero) |
| `#9500FF` (26 uses), `#CE93FF` (34), `#5EEEF3` (6) | Inline styles |
| `#0A0A12` (18) | Dark section background |
| Outfit 400, `letter-spacing: -.025em`, `line-height: 1.06` | Hero `<h1>` inline style |

There is no standalone Velocity AI logo file on the site; the name is set as text. The microsite does the same: "Velocity AI" in Outfit with the official gradient.

### Synthia AI (viamagus.com/synthia-ai)

| Value | Source |
| --- | --- |
| `#a76ae0` (30 uses) | Hero `<h1>` highlight ("AI-Native") |
| `#be65ff` (13), `#9400ff` (13), `#c9a6f0` (6) | Inline styles |
| Logo | `/synthia-ai-logo-white.svg`, used unmodified (`public/brand/synthia-ai-logo-white.svg`) |

### ViaMagus Select (viamagusselect.ai)

From the inline `:root` styles:

| Token | Value |
| --- | --- |
| `--ink` | `#0E0D12` |
| `--paper` | `#F4F2EC` |
| `--sheet` | `#FCFBF8` |
| `--purple` | `#6608a9` (same as master primary) |
| `--purple-tint` | `#B784EC` |
| `--amber` | `#F5B83D` |
| `--ink-2` | `#55525C` |
| `--paper-2` | `#A9A5B0` |
| `--sans` | `"Archivo"` |
| `--mono` | `"JetBrains Mono"` |

Wordmark (`.wordmark`): "Viamagus" in Archivo 700, `letter-spacing: -.01em`, followed by "select" in weight 400 at 62% opacity. The site writes the brand as "Viamagus select". This microsite keeps the event brief's spelling "ViaMagus Select" in running copy and uses the official wordmark styling in the hero scene.

## Decisions for the event identity (redesign)

1. **Flat brand fields, no glow.** Frames alternate between ViaMagus purple `#6608a9` (hook, invitation), light `#fcfdff` (the shift), and `#010103` (forces, signal). This sets the site apart from dark AI landing pages and is unmistakably ViaMagus.
2. **One motif: the cell.** A square appears as the full stop of the title, the people in the shift, the weeks in Velocity, the CVs in Select and the 8 of 100 in the signal. It is always magenta `#fc60db` (ViaMagus secondary) when it marks what matters.
3. **Each force keeps its own world:** Velocity `#0A0A12` with its `#9500FF → #00C7CE` gradient; Synthia `#1D0031` (ViaMagus primary-darker) with `#BE65FF`; Select paper `#F4F2EC`, ink `#0E0D12`, amber `#F5B83D` and Archivo.
4. **Type:** Outfit throughout, sentence case for headlines. Uppercase is reserved for the event name. Geist Mono is used only for sources and log lines. Josefin Sans 500 is used only in the ViaMagus logotype.
5. **Derived values:** the lilac `#F2D0FF` (frequent in viamagus.com markup) for secondary text on purple; `#4a4f70` and `#3a405e` as mid-tones of `--color-text-neutral #26304d` for the pyramid's layers.
