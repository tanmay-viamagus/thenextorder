// node shot.mjs <abs html> <pdf> <png-prefix> [dsf]: PDF at the CSS page size, plus a PNG of each top-level page
import { chromium } from "/Users/apple/Documents/outreachtracker/node_modules/playwright-core/index.mjs";
const [, , html, pdf, png, dsf] = process.argv;
const b = await chromium.launch({ executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell" });
const p = await b.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: +(dsf || 1) });
await p.goto("file://" + html, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
await p.pdf({ path: pdf, printBackground: true, preferCSSPageSize: true });
const s = await p.$$("body > section, body > .ab");
for (let i = 0; i < s.length; i++) await s[i].screenshot({ path: `${png}-${i + 1}.png` });
await b.close();
