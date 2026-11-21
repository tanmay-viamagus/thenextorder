#!/usr/bin/env python3
"""Review files for the v2 brochure, built from the same markup as print.html (text stays vector).

review.html   A3 landscape pages: each panel on its own page (in the order a guest meets them),
              then the opening sequence, one step per page. Everything at true size.
artboard.html One board: the two printer's sheets, the six panels, the opening sequence.

Render: node render.mjs $PWD/review.html Viamagus-brochure_review.pdf
        node render.mjs $PWD/artboard.html Viamagus-brochure_artboard.pdf
"""
import pathlib

import gen

HERE = pathlib.Path(__file__).parent
OUT_SHEET = gen.sheet(gen.OUT, "outside")
INN_SHEET = gen.sheet(gen.INN, "inside")
OUT_GUIDES = gen.sheet(gen.OUT, "outside", True)
INN_GUIDES = gen.sheet(gen.INN, "inside", True)


def clip(sheet, x0, x1):
    """The trimmed sheet between x0 and x1 (mm from the left trim edge)."""
    return (f'<div class="clip" style="width:{x1 - x0}mm"><div class="at" style="left:{-(3 + x0)}mm">{sheet}</div></div>')


def spread(*parts):
    return '<div class="spread">' + "".join(parts) + "</div>"


# the panels, in the order a guest meets them
PANELS = [
    ("Outside", "Cover", "the front: what a guest picks up", OUT_SHEET, 197, 297),
    ("Outside", "Flap", "seen as soon as the cover opens (97 mm, folds in first)", OUT_SHEET, 0, 97),
    ("Inside", "Synthia AI", "Operate (inside left)", INN_SHEET, 0, 100),
    ("Inside", "Velocity AI", "Build (inside middle)", INN_SHEET, 100, 200),
    ("Inside", "Select", "Hire (inside right, 97 mm)", INN_SHEET, 200, 297),
    ("Outside", "Back", "clients, numbers, contact", OUT_SHEET, 97, 197),
]

# the opening sequence (same steps as Brochure_how-it-opens.jpg)
STAGES = [
    ("1", "Closed", "Folded, cover up. 100 × 210 mm.", clip(OUT_SHEET, 197, 297)),
    ("2", "Cover opened", "The cover swings open to the left: Synthia AI inside it, the flap on the right.",
     spread(clip(INN_SHEET, 0, 103), clip(OUT_SHEET, 0, 97))),
    ("3", "Flap opened", "The flap swings open to the right: the full inside, Operate · Build · Hire. 297 × 210 mm.",
     clip(INN_SHEET, 0, 297)),
    ("4", "Turned over", "The back: clients, numbers and how to reach us.", clip(OUT_SHEET, 97, 197)),
]

BASE = """
.clip{position:relative;overflow:hidden;height:210mm;flex:none;background:#fff}
.clip .at{position:absolute;top:-3mm}
.clip .sheet{break-after:auto}
.spread{display:flex;box-shadow:0 1.5mm 6mm rgba(40,30,60,.18)}
.r-k{font-family:"Geist Mono",monospace;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:#6608A9}
.r-h{font-family:Outfit,sans-serif;font-weight:700;font-size:20pt;letter-spacing:-.025em;color:#0B0A0E;margin-top:2mm;line-height:1.05}
.r-t{font-size:9pt;color:#55515F;margin-top:1.6mm}
"""

REVIEW_CSS = BASE + """
@page{size:420mm 297mm;margin:0}
.rp{width:420mm;height:297mm;background:#EEECF2;break-after:page;position:relative;display:flex;flex-direction:column;align-items:center;padding:18mm 0 0}
.rp:last-child{break-after:auto}
.rp header{width:384mm}
.rp .stage{margin-top:12mm;display:flex;justify-content:center}
.rp .stage>.clip{box-shadow:0 1.5mm 6mm rgba(40,30,60,.18)}
.rp .n{position:absolute;right:18mm;bottom:12mm;font-family:"Geist Mono",monospace;font-size:7pt;letter-spacing:.12em;color:#8D86A0}
"""


def review():
    pages = []
    total = len(PANELS) + len(STAGES)
    for k, (side, name, note, sheet, x0, x1) in enumerate(PANELS, 1):
        pages.append(f'''<section class="rp"><header><p class="r-k">Panel {k} of 6 · {side} · {x1 - x0} × 210 mm</p>
<h2 class="r-h">{name}</h2><p class="r-t">{note[0].upper() + note[1:]}.</p></header>
<div class="stage">{clip(sheet, x0, x1)}</div><p class="n">{k} / {total}</p></section>''')
    for k, (n, name, note, body) in enumerate(STAGES, len(PANELS) + 1):
        pages.append(f'''<section class="rp"><header><p class="r-k">How it opens · step {n} of 4</p>
<h2 class="r-h">{name}</h2><p class="r-t">{note}</p></header>
<div class="stage">{body}</div><p class="n">{k} / {total}</p></section>''')
    return "".join(pages)


# artboard: 3 rows at true size
AW, AH = 860, 840
ART_CSS = BASE + f"""
@page{{size:{AW}mm {AH}mm;margin:0}}
.ab{{width:{AW}mm;height:{AH}mm;background:#EEECF2;padding:26mm 30mm}}
.ab h1{{font-family:Outfit,sans-serif;font-weight:800;font-size:44pt;letter-spacing:-.04em;line-height:1}}
.ab .sub{{font-size:12pt;color:#55515F;margin-top:3mm}}
.row{{margin-top:22mm}}
.row>.r-k{{font-size:9pt;border-bottom:.3mm solid #D6D2DF;padding-bottom:2.4mm;margin-bottom:8mm}}
.items{{display:flex;gap:14mm;align-items:flex-start}}
.item .cap{{font-family:"Geist Mono",monospace;font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#2B2833;margin-top:4mm}}
.item .cap b{{color:#6608A9;font-weight:500}}
.item .cap span{{display:block;color:#8D86A0;margin-top:1mm;text-transform:none;letter-spacing:.02em;font-family:Geist,sans-serif;font-size:8pt;max-width:{100}mm}}
.item>.clip,.item>.full{{box-shadow:0 1.5mm 6mm rgba(40,30,60,.18)}}
.full{{width:303mm;height:216mm;position:relative;overflow:hidden;background:#fff}}
.full .sheet{{break-after:auto}}
.arrow{{align-self:center;font-family:Outfit,sans-serif;font-size:26pt;color:#BE65FF;margin-top:-10mm}}
"""


def artboard():
    sheets = "".join(f'<div class="item"><div class="full">{s}</div><p class="cap"><b>{t}</b><span>{d}</span></p></div>'
                     for t, d, s in [("Page 1 · outside", "Flap 97 | Back 100 | Cover 100. Red: trim (solid) and folds (dashed); 3 mm bleed.", OUT_GUIDES),
                                     ("Page 2 · inside", "Synthia 100 | Velocity 100 | Select 97.", INN_GUIDES)])
    panels = "".join(f'<div class="item">{clip(s, x0, x1)}<p class="cap"><b>{k}</b> {name}<span>{side} · {x1 - x0} mm</span></p></div>'
                     for k, (side, name, _, s, x0, x1) in enumerate(PANELS, 1))
    st = []
    for n, name, note, body in STAGES:
        if st:
            st.append('<p class="arrow">→</p>')
        st.append(f'<div class="item">{body}<p class="cap"><b>{n}</b> {name}<span>{note}</span></p></div>')
    return f'''<div class="ab">
<h1>Viamagus tri‑fold brochure</h1>
<p class="sub">A4 roll fold, 297 × 210 mm flat, 100 × 210 mm folded. Everything on this board is at true size.</p>
<div class="row"><p class="r-k">The two printed sides</p><div class="items">{sheets}</div></div>
<div class="row"><p class="r-k">Each panel, in the order a guest meets them</p><div class="items">{panels}</div></div>
<div class="row"><p class="r-k">How it opens</p><div class="items">{"".join(st)}</div></div>
</div>'''


def page(css, body):
    return (f'<!doctype html><html><head><meta charset="utf-8">{gen.FONTS}<style>{gen.CSS}{css}</style></head>'
            f'<body style="background:#EEECF2">{body}</body></html>')


if __name__ == "__main__":
    (HERE / "review.html").write_text(page(REVIEW_CSS, review()))
    (HERE / "artboard.html").write_text(page(ART_CSS, artboard()))
    print("ok")
