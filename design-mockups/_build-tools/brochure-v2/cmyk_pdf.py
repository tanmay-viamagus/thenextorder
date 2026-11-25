# The brochure's printer file: print.html rendered at 600 dpi (DSF 6.25 on the 1146 px = 303.2 mm sheet, bleed
# included), each sheet converted with ../cmyk/to_cmyk.py (FOGRA39, neutrals on K, the purple pinned to C71 M84 Y0 K0)
# and saved as a 2-page CMYK PDF at the exact sheet size. Also writes proof-1/2.jpg (soft proofs for the review PDF).
#   python3 cmyk_pdf.py   ->  Viamagus-brochure_print_CMYK.pdf  (copy to design-mockups/Brochure)
import os, sys, subprocess, tempfile
import numpy as np
from PIL import Image, ImageCms
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "cmyk"))
import to_cmyk as T
DPI = 600
tmp = tempfile.mkdtemp()
subprocess.run(["node", os.path.join(HERE, "render.mjs"), os.path.join(HERE, "print.html"), "-", os.path.join(tmp, "s")],
               check=True, env={**os.environ, "DSF": "6.25"})
pages = []
for i in (1, 2):
    rgb = np.asarray(Image.open(os.path.join(tmp, f"s-{i}.png")).convert("RGB"))
    c = Image.fromarray(T.convert_arr(rgb.copy()), "CMYK")
    ImageCms.applyTransform(c, T.BACK).save(os.path.join(HERE, f"proof-{i}.jpg"), quality=92)
    pages.append(c)
    print("sheet", i, c.size, f"= {c.size[0] / DPI * 25.4:.1f} x {c.size[1] / DPI * 25.4:.1f} mm")
out = os.path.join(HERE, "Viamagus-brochure_print_CMYK.pdf")
pages[0].save(out, "PDF", resolution=DPI, save_all=True, append_images=pages[1:], quality=95)
print(out, f"{os.path.getsize(out) / 1e6:.1f} MB")
