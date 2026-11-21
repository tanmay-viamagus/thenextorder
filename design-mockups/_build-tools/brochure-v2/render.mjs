import { chromium } from "/Users/apple/Documents/outreachtracker/node_modules/playwright-core/index.mjs";
const [, , html, pdf, pngPrefix] = process.argv;
const b = await chromium.launch({ executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell" });
const p = await b.newPage({ viewport: { width: 1146, height: 817 }, deviceScaleFactor: +(process.env.DSF || 3) });
await p.goto("file://" + html, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const missing = await p.evaluate(() => ["Outfit", "Geist", "Geist Mono", "InterKit"].filter(f => !(document.fonts.check(`800 12px "${f}"`) || document.fonts.check(`400 12px "${f}"`))));
if (missing.length) console.log("FONTS MISSING", missing);
await p.waitForTimeout(500);
if (pdf && pdf !== "-") await p.pdf({ path: pdf, printBackground: true, preferCSSPageSize: true });
if (pngPrefix) {
  const s = await p.$$(".sheet");
  for (let i = 0; i < s.length; i++) await s[i].screenshot({ path: `${pngPrefix}-${i + 1}.png` });
}
// overflow check: any panel whose content is taller than the panel box
const of = await p.evaluate(() => [...document.querySelectorAll(".pn")].map(e => [e.className, e.scrollHeight - e.clientHeight]).filter(x => x[1] > 0));
if (of.length) console.log("OVERFLOW", JSON.stringify(of));
await b.close();
