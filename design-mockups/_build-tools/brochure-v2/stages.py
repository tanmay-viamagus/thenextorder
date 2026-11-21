#!/usr/bin/env python3
"""Compose the opening sequence from p-1.png (outside) and p-2.png (inside), rendered at DSF 3."""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PX = 3 * 96 / 25.4  # px per mm
o, i = Image.open("p-1.png").convert("RGB"), Image.open("p-2.png").convert("RGB")

def cut(img, x0, x1):  # x in trimmed-sheet mm
    return img.crop((round((3 + x0) * PX), round(3 * PX), round((3 + x1) * PX), round(213 * PX)))

C, B, A = cut(o, 197, 297), cut(o, 97, 197), cut(o, 0, 97)
INSIDE = cut(i, 0, 297)
stage2 = Image.new("RGB", (round(200 * PX), round(210 * PX)), "white")
stage2.paste(cut(i, 0, 100), (0, 0))
stage2.paste(cut(i, 100, 103), (round(100 * PX), 0))
stage2.paste(A, (round(103 * PX), 0))

shots = [("1  Closed", C), ("2  Cover opened", stage2), ("3  Flap opened", INSIDE), ("4  Turned over", B)]
S = 0.42
shots = [(t, im.resize((round(im.width * S), round(im.height * S)), Image.LANCZOS)) for t, im in shots]
pad, gap, lab = 70, 60, 70
W = pad * 2 + sum(im.width for _, im in shots) + gap * (len(shots) - 1)
H = pad * 2 + lab + max(im.height for _, im in shots)
bg = Image.new("RGB", (W, H), (238, 236, 242))
try:
    f = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 30)
except OSError:
    f = ImageFont.load_default()
d = ImageDraw.Draw(bg)
x = pad
for t, im in shots:
    sh = Image.new("L", (im.width + 60, im.height + 60), 0)
    ImageDraw.Draw(sh).rectangle((30, 34, 30 + im.width, 34 + im.height), fill=90)
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    bg.paste((60, 50, 80), (x - 30, pad + lab - 30), sh)
    bg.paste(im, (x, pad + lab))
    d.text((x, pad), t, fill=(28, 26, 34), font=f)
    x += im.width + gap
bg.save(sys.argv[1], quality=92)
print(bg.size)
