/**
 * LinkedIn profile URLs: format validation only. Passing this check means the
 * link is shaped like a LinkedIn personal profile — not that the profile exists
 * or belongs to the person. The team reviews it by hand.
 *
 * Accepts linkedin.com, www.linkedin.com and two-letter country subdomains
 * (e.g. in.linkedin.com); a missing scheme or http:// is upgraded to https://.
 * Returns the canonical https://www.linkedin.com/in/<slug>.
 */
const HOST = /^(?:www\.|[a-z]{2}\.)?linkedin\.com$/;
const PATH = /^\/in\/([A-Za-z0-9\-_%.]{3,100})\/?$/;

export function normalizeLinkedIn(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const v = raw.trim();
  if (!v) return { ok: false, error: "Please add your LinkedIn profile link." };
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
  } catch {
    return { ok: false, error: "That doesn’t look like a link. Try https://www.linkedin.com/in/your-profile" };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return { ok: false, error: "Please use an https:// LinkedIn link." };
  if (u.username || u.password || u.port) return { ok: false, error: "Please use a plain LinkedIn profile link." };
  if (!HOST.test(u.hostname.toLowerCase())) return { ok: false, error: "Please use a linkedin.com profile link." };
  const m = PATH.exec(u.pathname);
  if (!m) return { ok: false, error: "Please use your personal profile link — it looks like linkedin.com/in/your-name" };
  return { ok: true, url: `https://www.linkedin.com/in/${m[1]}` };
}
