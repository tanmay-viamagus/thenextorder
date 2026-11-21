#!/usr/bin/env python3
"""Viamagus brochure v2 (21 Nov 2026), from the user's sketch: A4 roll (letter) fold, 3 mm bleed.

Outside sheet, left to right:  A flap (97)      | B back (100)        | C cover (100)
                               Build/Operate/Hire | customers, contact | logo, certifications
Inside sheet,  left to right:  C' Synthia (100) | B' Velocity (100)   | A' Select (97)

Same look as the physical branding (booth backdrops): white paper, Outfit headlines, mono labels,
the mark's three colours, one per product, a colour band under a white top.
Facts are the ones already verified for v1 and the select site (CEO-confirmed 26 Oct 2026).

Writes print.html (2 pages, 303 x 216 mm) and guides.html (same, with trim and fold lines).
"""
import base64
import pathlib
import re

HERE = pathlib.Path(__file__).parent
A = HERE / "assets"
BL = 3  # bleed, mm

CY, VI, AM, PU, INK = "#00C7CE", "#BE65FF", "#F5B83D", "#6608A9", "#0B0A0E"


def b64(p, mime):
    return f"data:{mime};base64," + base64.b64encode((A / p).read_bytes()).decode()


VEL = b64("velocity-purple.svg", "image/svg+xml")
SYN = b64("synthia-purple.svg", "image/svg+xml")
LOGO = b64("viamagus-logo-purple.png", "image/png")
CLIENTS = [("nestle", "Nestlé"), ("cocacola", "Coca-Cola"), ("hdfc", "HDFC Life"),
           ("titan", "Titan"), ("adnoc", "ADNOC"), ("hitachi", "Hitachi")]


def logo_w(f, area=118, max_w=21.5, max_h=12.5):
    """Width (mm) that gives every client logo the same visual weight (equal area, capped)."""
    vb = re.search(r'viewBox="([^"]+)"', (A / "clients" / f"{f}.svg").read_text()).group(1).split()
    ar = float(vb[2]) / float(vb[3])
    w = (area * ar) ** .5
    return round(min(w, max_w, max_h * ar), 2)


def qr(name, size):
    svg = (A / f"qr-{name}.svg").read_text()
    return re.sub(r"<svg ", f'<svg width="{size}mm" height="{size}mm" shape-rendering="crispEdges" ', svg, 1)


# the mark's three pieces (viewBox 0 0 30.4941 11.8959)
P_V = "M0,0 L6.7765,11.8958 L13.5529,0 Z"
P_S = "M16.9414,0 L20.3296,5.9479 L20.3396,11.8955 L10.165,11.8955 Z"
P_X = "M23.7177,0 L30.4941,11.8955 L20.3196,11.8955 L20.3296,5.9479 Z"
BOX = {"v": (0, 0, 13.5529, 11.8958, P_V, CY), "s": (10.165, 0, 10.1746, 11.8955, P_S, VI),
       "x": (20.3196, 0, 10.1745, 11.8955, P_X, AM)}


def piece(which, w_mm, cls="pc", fill=None, stroke=None):
    x, y, w, h, d, c = BOX[which]
    paint = f'fill="none" stroke="{stroke}" stroke-width="{w / w_mm * .35:.3f}"' if stroke else f'fill="{fill or c}"'
    return (f'<svg class="{cls}" width="{w_mm}mm" height="{w_mm * h / w:.2f}mm" viewBox="{x} {y} {w} {h}">'
            f'<path d="{d}" {paint}/></svg>')


def mark(w_mm, gap=0):
    """The whole mark; gap (in mark units) pulls the pieces apart."""
    h = 11.8959
    parts = (f'<path d="{P_V}" fill="{CY}" transform="translate({-gap},0)"/>'
             f'<path d="{P_S}" fill="{VI}"/>'
             f'<path d="{P_X}" fill="{AM}" transform="translate({gap},0)"/>')
    vb_w = 30.4941 + 2 * gap
    return (f'<svg class="mk" width="{w_mm}mm" height="{w_mm * h / vb_w:.2f}mm" '
            f'viewBox="{-gap} 0 {vb_w} {h}">{parts}</svg>')


SEL_LOGO = b64("viamagus-select-logo_purple.svg", "image/svg+xml")
SELECT = f'<img class="wm-select" src="{SEL_LOGO}" alt="Viamagus Select">'

# --------------------------------------------------------------------------- the "show" diagrams
# Each is an SVG in mm (82 x 46), drawn in the panel's colour.


def viz_synthia():
    """Paper in, verified data out, a named person signs."""
    doc = lambda x, y, r: (
        f'<g transform="translate({x} {y}) rotate({r})">'
        f'<rect width="17" height="22" rx="1" fill="#fff" stroke="#CFC9DA" stroke-width=".3"/>'
        f'<path d="M3 4h11M3 6.6h8M3 9.2h10M3 11.8h6" stroke="#D9D4E2" stroke-width=".9" stroke-linecap="round"/>'
        f'<path d="M3 15.5c1.4-1.6 2.2 1.6 3.6 0s2.2 1.6 3.6 0 2.2 1.6 3.6 0" fill="none" stroke="#8D86A0" stroke-width=".45" stroke-linecap="round"/>'
        f'<path d="M3 19h7" stroke="#D9D4E2" stroke-width=".9" stroke-linecap="round"/></g>')
    rows = ""
    for i, (k, w) in enumerate((("Vendor", 15), ("Invoice no.", 11), ("Amount", 13), ("Due date", 10))):
        y = 6.5 + i * 6.2
        rows += (f'<text x="44" y="{y + 1.2}" class="vz-k">{k}</text>'
                 f'<rect x="58" y="{y - .9}" width="{w}" height="2.6" rx="1.3" fill="#EDE6F7"/>'
                 f'<circle cx="77.4" cy="{y + .4}" r="1.9" fill="{VI}"/>'
                 f'<path d="M76.5 {y + .45}l.7.7 1.3-1.4" fill="none" stroke="{INK}" stroke-width=".42" stroke-linecap="round" stroke-linejoin="round"/>')
    return f'''<svg class="vz" viewBox="0 0 82 46" width="82mm" height="46mm">
{doc(3, 9, -8)}{doc(9, 7, 4)}{doc(14.5, 10, -2)}
<path d="M34.5 21.5h5.2" stroke="{INK}" stroke-width=".5"/><path d="M38.6 20.1l1.6 1.4-1.6 1.4" fill="none" stroke="{INK}" stroke-width=".5"/>
<rect x="41.5" y="1.5" width="39" height="29" rx="1.6" fill="#fff" stroke="{INK}" stroke-width=".35"/>
{rows}
<rect x="41.5" y="34" width="39" height="10" rx="1.6" fill="{INK}"/>
<text x="44" y="39.9" class="vz-w">Signed off</text>
<path d="M62 40.2c1.2-2.6 2.2 1.4 3.4-.6s1.6 1.6 3 0 1.4 .9 2.6 .3" fill="none" stroke="{VI}" stroke-width=".5" stroke-linecap="round"/>
<text x="78.6" y="39.9" class="vz-w" text-anchor="end">✓</text>
</svg>'''


def viz_velocity():
    """Three months becomes three to four weeks; something ships every Friday."""
    days = ""
    for w in range(4):
        for d in range(5):
            x = 4 + w * 19.6 + d * 3.6
            fri = d == 4
            days += (f'<rect x="{x}" y="33" width="2.7" height="{6 if fri else 4}" rx=".6" '
                     f'fill="{CY if fri else "#E3E0E8"}" {"" if fri else "transform=" + chr(34) + "translate(0 1)" + chr(34)}/>')
        days += f'<text x="{4 + w * 19.6}" y="44" class="vz-k">Week {w + 1}</text>'
    return f'''<svg class="vz" viewBox="0 0 82 46" width="82mm" height="46mm">
<text x="0" y="3.4" class="vz-k">Traditional build</text>
<rect x="0" y="5.2" width="82" height="6" rx="1" fill="#ECEAF0"/>
<text x="80.5" y="9.4" class="vz-k" text-anchor="end">3 months</text>
<text x="0" y="18.4" class="vz-k">With Velocity AI</text>
<rect x="0" y="20.2" width="24" height="6" rx="1" fill="{CY}"/>
<text x="26.5" y="24.4" class="vz-b">3 to 4 weeks</text>

{days}
<rect x="54.2" y="27.5" width="1.8" height="1.8" rx=".3" fill="#00C7CE"/><text x="82" y="29.2" class="vz-k vz-c" text-anchor="end">ships every Friday</text>
</svg>'''


def viz_select():
    """One open role, a wide pool, 3 to 5 vetted dossiers in 48 working hours."""
    import random
    rnd = random.Random(7)
    pool = ""
    for i in range(46):
        x = 15 + rnd.random() * 26
        spread = 3 + (x - 15) * -0.0 + 16 * (1 - (x - 15) / 34)
        y = 23 + (rnd.random() - .5) * 2 * spread
        pool += f'<circle cx="{x:.2f}" cy="{y:.2f}" r=".85" fill="#D9D4E2"/>'
    cards = ""
    for i in range(5):
        y = 8.5 + i * 6.4
        faint = i >= 3
        cards += (f'<rect x="56" y="{y}" width="24" height="5" rx=".9" fill="{"#fff" if faint else AM}" '
                  f'stroke="{AM if faint else "none"}" stroke-width=".3" {"stroke-dasharray=" + chr(34) + ".8 .6" + chr(34) if faint else ""}/>'
                  f'<circle cx="58.6" cy="{y + 2.5}" r="1.2" fill="{"#F7E3B5" if faint else "#fff"}"/>'
                  f'<rect x="61" y="{y + 1.4}" width="{11 - i}" height="1.1" rx=".5" fill="{"#F2DDA9" if faint else INK}"/>'
                  f'<rect x="61" y="{y + 3}" width="7" height=".8" rx=".4" fill="{"#F2DDA9" if faint else "#6B4A00"}"/>')
    return f'''<svg class="vz" viewBox="0 0 82 46" width="82mm" height="46mm">
<circle cx="6" cy="23" r="5.2" fill="{INK}"/><text x="6" y="24.3" class="vz-w" text-anchor="middle">1</text>
<text x="6" y="33.4" class="vz-k" text-anchor="middle">open role</text>
<path d="M13 5 L46 19.5 L46 26.5 L13 41 Z" fill="#F6F4F8"/>
{pool}
<path d="M47.5 23h5.6" stroke="{INK}" stroke-width=".5"/><path d="M52 21.6l1.6 1.4-1.6 1.4" fill="none" stroke="{INK}" stroke-width=".5"/>
{cards}
<text x="80" y="44.6" class="vz-k" text-anchor="end">3 to 5 vetted dossiers</text>
<text x="29" y="3.4" class="vz-k" text-anchor="middle">48 working hours</text>
<path d="M14 5h30" stroke="{INK}" stroke-width=".3"/><path d="M14 4v2M44 4v2" stroke="{INK}" stroke-width=".3"/>
</svg>'''


def score_bar():
    return f'''<svg class="sb" viewBox="0 0 82 9" width="82mm" height="9mm">
<rect x="0" y="2" width="61.5" height="2.4" rx="1.2" fill="#EAE7EE"/>
<rect x="61.5" y="2" width="20.5" height="2.4" rx="1.2" fill="{AM}"/>
<path d="M61.5 .4v5.6" stroke="{INK}" stroke-width=".45"/>
<text x="0" y="8.6" class="vz-k">0</text><text x="61.5" y="8.6" class="vz-b" text-anchor="middle">75</text><text x="82" y="8.6" class="vz-k" text-anchor="end">100</text>
</svg>'''


# --------------------------------------------------------------------------- outside
# the official seals, as on the select site (public/v3/assets/badge-*.svg)
SEALS = [("iso27001", "ISO 27001 certified"), ("iso9001", "ISO 9001 certified"), ("soc2", "SOC 2 Type 2 compliant"),
         ("hipaa", "HIPAA compliant"), ("nasscom", "NASSCOM partner")]
CLAUDE = ("claude-partner-select", "Claude Partner Network, Select Services Partner")


def cover():
    seals = "".join(f'<li><img src="{b64("certs/badge-" + f + ".svg", "image/svg+xml")}" alt="{n}"></li>' for f, n in SEALS)
    cl = f'<img class="cv-claude" src="{b64("certs/badge-" + CLAUDE[0] + ".svg", "image/svg+xml")}" alt="{CLAUDE[1]}">'
    return f'''
<div class="cv-mark">{mark(112, gap=1.1)}</div>
<div class="cv-body">
  <img class="cv-logo" src="{LOGO}" alt="viamagus">
  <h1 class="cv-h">Become<br><span class="cv-g">AI‑native</span><i class="d v"></i></h1>
  <p class="cv-l">Everything an enterprise needs to get there, from one partner.</p>
</div>
<div class="cv-cert">
  <p class="k">Certified and trusted</p>
  <ul class="seals">{seals}</ul>
  {cl}
</div>'''


def flap():
    rows = [
        ("v", "Build", "c", "Velocity AI", "Products and platforms, engineered with AI from day one.",
         "3 to 4×", "faster engineering"),
        ("s", "Operate", "v", "Synthia AI", "The work behind the business, run by AI and signed off by people.",
         "&gt;97%", "extraction accuracy"),
        ("x", "Hire", "a", "Select", "Engineer‑vetted talent, inside your GCC in days.",
         "48 h", "to vetted dossiers"),
    ]
    r = "".join(
        f'''<li><div class="fl-ic">{piece(p, 13 if p == "v" else 9.8)}</div>
<div><p class="fl-v">{v}<i class="d {c}"></i></p><p class="fl-p">{prod}</p>
<p class="fl-x {c}"><b>{n}</b><span>{nt}</span></p></div></li>'''
        for p, v, c, prod, t, n, nt in rows)
    return f'''
<p class="k">Three ways to work with us</p>
<h2 class="fl-h">Start with one.<br>Grow into all three.</h2>
<ol class="fl-rows">{r}</ol>
<p class="open">Open the flap <i>→</i></p>'''


def back():
    logos = "".join(f'<li><img src="{b64("clients/" + f + ".svg", "image/svg+xml")}" alt="{n}" style="width:{logo_w(f)}mm"></li>'
                    for f, n in CLIENTS)
    return f'''
<p class="k">Trusted by teams at</p>
<ul class="logos">{logos}</ul>
<div class="big"><b>350,000+</b><span>engineering hours since 2014</span></div>
<p class="offices"><span>Bengaluru</span><span>New York</span><span>Zug</span></p>
<blockquote class="bk-q"><p>AI does the heavy lifting.<br><em>Your people make the call.</em></p></blockquote>
<div class="contact">
  <div class="qr-t">{qr("home", 21)}</div>
  <div>
    <p class="k">Let’s talk</p>
    <p class="c-m">hi@viamagus.com</p>
    <p class="c-w">viamagus.com</p>
  </div>
</div>
<p class="legal">Viamagus Technologies Pvt. Ltd.</p>'''


# --------------------------------------------------------------------------- inside
def offers(items, cols=1):
    lis = "".join(f"<li><b>{n}</b></li>" for n, _ in items)
    return f'<ul class="of of{cols}">{lis}</ul>'


def product(*, label, pc, color, logo, tag, viz, stat, stat_t, extra, items, cols, q, qlabel, qurl):
    return f'''
<div class="top">
  <div class="hd"><p class="k">{label}</p>{pc}</div>
  <div class="wm">{logo}</div>
  <p class="tag">{tag}</p>
  <div class="viz">{viz}</div>
  <div class="stat {color}"><b>{stat}</b><span>{stat_t}</span></div>
  {extra}
</div>
<i class="acc {color}"></i>
<div class="band {color}">
  <p class="k of-k">What we offer</p>
  {offers(items, cols)}
  <div class="ft"><div class="qr-t">{qr(q, 16)}</div><div><b>{qlabel}</b><span>{qurl}</span></div></div>
</div>'''


def synthia():
    return product(
        label="Operate", pc=piece("s", 9), color="v",
        logo=f'<img class="wm-synthia" src="{SYN}" alt="Synthia AI">',
        tag="The platform for AI‑native business operations.",
        viz=viz_synthia(), stat="&gt;97%", stat_t="document extraction accuracy",
        extra="",
        items=[("AI Analytics", "Every answer. One source."), ("Back‑Office Processing", "Documents into decision‑ready data."),
               ("Physical Forms", "Handwriting into validated data."), ("Contract Analysis", "Dense contracts, audit‑ready."),
               ("Audio Analysis", "Conversations into verified insight."), ("Voice and Video Agents", "High‑volume calls, live co‑pilots.")],
        cols=2, q="operate", qlabel="See Synthia AI at work", qurl="viamagus.com/synthia-ai")


def velocity():
    return product(
        label="Build", pc=piece("v", 11.6), color="c",
        logo=f'<img class="wm-velocity" src="{VEL}" alt="Velocity AI">',
        tag="AI‑native product engineering.",
        viz=viz_velocity(), stat="3 to 4×", stat_t="faster than traditional engineering",
        extra="",
        items=[("Legacy Modernization", "Legacy code onto a modern stack."), ("Agentic AI Kits", "Our playbook, in your team’s hands."),
               ("Technical Due Diligence", "AI‑augmented audit: architecture, security, DevOps."), ("0‑1 Builds", "Idea to production‑grade v1, fast.")],
        cols=2, q="build", qlabel="See Velocity AI at work", qurl="viamagus.com/velocity-ai")


def select():
    return product(
        label="Hire", pc=piece("x", 9), color="a",
        logo=SELECT,
        tag="Engineer‑vetted technology talent for GCCs in India.",
        viz=viz_select(), stat="48 h", stat_t="from open role to vetted dossiers",
        extra="",
        items=[("Resource augmentation", "Vetted engineers on your roadmap."), ("Fractional AI leadership", "Senior AI leaders, as long as you need."),
               ("AI services", "Modernisation, guardrails, AI CoE set‑up."), ("Build, then own", "From month 13, the team is yours.")],
        cols=2, q="hire", qlabel="Meet Select", qurl="viamagusselect.ai")


OUT = [("A", 0, 97, flap), ("B", 97, 100, back), ("C", 197, 100, cover)]
INN = [("Cp", 0, 100, synthia), ("Bp", 100, 100, velocity), ("Ap", 200, 97, select)]

CSS = (HERE / "style.css").read_text()
FONTS = ('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">')


def sheet(panels, side, guides=False):
    ps = "".join(f'<section class="pn pn-{n}" style="left:{BL + x}mm;width:{w}mm">{fn()}</section>' for n, x, w, fn in panels)
    extra = ""
    if guides:
        extra = "".join(f'<i class="fold" style="left:{BL + x}mm"></i>' for _, x, _, _ in panels[1:]) + '<i class="trim"></i>'
    # full-bleed backgrounds that run under the panels (the inside colour band)
    under = '' if side == "inside" else ""
    return f'<div class="sheet {side}">{under}{ps}{extra}</div>'


def page(body):
    return f'<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{CSS}</style></head><body>{body}</body></html>'


if __name__ == "__main__":
    (HERE / "print.html").write_text(page(sheet(OUT, "outside") + sheet(INN, "inside")))
    (HERE / "guides.html").write_text(page(sheet(OUT, "outside", True) + sheet(INN, "inside", True)))
    print("ok")
