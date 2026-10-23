/**
 * The email a guest receives after requesting a place: a thank-you from
 * Shreenath Rao, the event's details, the tentative agenda and the brochure
 * (attached by the sender). It confirms the request, not a seat — places are
 * confirmed by invitation, as the site says.
 *
 * Pure: everything it shows comes in as arguments, so it can be rendered and
 * tested on its own. Built from tables and inline styles, as email clients
 * need.
 */
export type ConfirmationFacts = {
  date: string;
  time: string;
  venue: string;
  format: string;
  agenda: { t: string; time?: string; kind?: string }[];
  agendaNote: string;
  contactEmail: string;
  siteUrl: string;
};

export type ConfirmationInput = { name: string; updated: boolean };

export const SIGNATORY = { name: "Shreenath Rao", title: "CEO, Viamagus" } as const;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const C = {
  dark: "#0B0A0E",
  cream: "#F7F5F0",
  purple: "#7C3AED",
  accent: "#A855F7",
  ink: "#0B0A0E",
  ink2: "#6B6B74",
  line: "#E5E2E8",
};
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const LABEL = `font:600 11px/1.4 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${C.purple};`;

export function confirmationEmail(p: ConfirmationInput, f: ConfirmationFacts) {
  const name = p.name.trim();
  const subject = p.updated
    ? "Your updated request for The NEXT Order, 3 December"
    : "Your request for The NEXT Order, 3 December";
  const opening = p.updated
    ? "Thank you for updating your request for a place at The NEXT Order. We have your new details."
    : "Thank you for requesting a place at The NEXT Order, our invite-only symposium for Hyderabad’s GCC leaders and decision-makers.";
  const next =
    "Your request is with the Viamagus team. Places are confirmed by invitation, and we’ll be in touch before 3 December.";
  const brochure = "I’ve attached the brochure, with the themes we’ll take up and the agenda as it stands.";
  const close = "AI is reshaping how GCCs hire, build and lead. Every centre’s plan is different — that is the conversation, and I hope you’ll be part of it.";
  const details: [string, string][] = [
    ["Date", f.date],
    ["Time", f.time],
    ["Venue", f.venue],
    ["Format", f.format],
  ];
  const preheader = `${f.date} · ${f.time} · ${f.venue}. The brochure is attached.`;

  const rows = details
    .map(
      ([k, v]) => `<tr>
  <td style="padding:10px 0;border-top:1px solid ${C.line};width:96px;vertical-align:top;${LABEL}color:${C.ink2};">${esc(k)}</td>
  <td style="padding:10px 0;border-top:1px solid ${C.line};font:500 15px/1.5 ${SANS};color:${C.ink};">${esc(v)}</td>
</tr>`,
    )
    .join("");

  const agendaRows = f.agenda
    .map(
      (a) => `<tr>
  <td style="padding:9px 0;border-top:1px solid ${C.line};width:80px;vertical-align:top;font:600 12px/1.6 ${SANS};color:${C.purple};">${esc(a.time ?? "")}</td>
  <td style="padding:9px 0;border-top:1px solid ${C.line};font:15px/1.5 ${SANS};color:${C.ink};">${
    a.kind ? `<span style="${LABEL}color:${C.ink2};">${esc(a.kind)}</span><br>` : ""
  }${esc(a.t)}</td>
</tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
    <tr><td style="background:${C.dark};padding:36px 40px 32px;border-radius:14px 14px 0 0;">
      <p style="margin:0 0 18px;font:600 11px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;color:#C4B5FD;">Viamagus presents</p>
      <p style="margin:0;font:800 34px/1.05 ${SANS};letter-spacing:-0.5px;color:#FFFFFF;">THE NEXT <span style="color:${C.accent};">ORDER.</span></p>
      <p style="margin:12px 0 0;font:500 15px/1.5 ${SANS};color:#D9D4E4;">talent, technology and leadership.</p>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:36px 40px 8px;">
      <p style="margin:0 0 18px;font:500 17px/1.6 ${SANS};color:${C.ink};">Dear ${esc(name)},</p>
      <p style="margin:0 0 16px;font:16px/1.65 ${SANS};color:${C.ink};">${esc(opening)}</p>
      <p style="margin:0 0 16px;font:16px/1.65 ${SANS};color:${C.ink};">${esc(next)}</p>
      <p style="margin:0 0 28px;font:16px/1.65 ${SANS};color:${C.ink};">${esc(brochure)}</p>
      <p style="margin:0 0 6px;${LABEL}">The evening</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 30px;">${rows}</table>
      <p style="margin:0 0 6px;${LABEL}">Tentative agenda</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${agendaRows}</table>
      <p style="margin:10px 0 30px;font:13px/1.5 ${SANS};color:${C.ink2};">${esc(f.agendaNote)}</p>
      <p style="margin:0 0 26px;font:16px/1.65 ${SANS};color:${C.ink};">${esc(close)}</p>
      <p style="margin:0;font:16px/1.65 ${SANS};color:${C.ink};">Warm regards,</p>
      <p style="margin:14px 0 0;font:600 16px/1.4 ${SANS};color:${C.ink};">${esc(SIGNATORY.name)}</p>
      <p style="margin:2px 0 36px;font:14px/1.4 ${SANS};color:${C.ink2};">${esc(SIGNATORY.title)}</p>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:0 40px 36px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="border:1px solid ${C.purple};border-radius:999px;">
          <a href="${esc(f.siteUrl)}" style="display:inline-block;padding:13px 24px;font:500 15px/1 ${SANS};color:${C.ink};text-decoration:none;">The NEXT Order <span style="color:${C.purple};">&rarr;</span></a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="background:${C.dark};padding:22px 40px;border-radius:0 0 14px 14px;">
      <p style="margin:0;font:12px/1.6 ${SANS};color:#B9B4C4;">Organised by Viamagus · Ecosystem partner Hyderabad Mavericks</p>
      <p style="margin:4px 0 0;font:12px/1.6 ${SANS};color:#B9B4C4;">Questions? Reply to this email, or write to <a href="mailto:${esc(f.contactEmail)}" style="color:#D8B4FE;">${esc(f.contactEmail)}</a>.</p>
    </td></tr>
  </table>
  <p style="margin:18px 0 0;font:12px/1.5 ${SANS};color:${C.ink2};">You’re receiving this because this address was used to request a place at The NEXT Order.</p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `Dear ${name},`,
    "",
    opening,
    "",
    next,
    "",
    brochure,
    "",
    "THE EVENING",
    ...details.map(([k, v]) => `${k}: ${v}`),
    "",
    "TENTATIVE AGENDA",
    ...f.agenda.map((a) => `${a.time ? `${a.time}  ` : ""}${a.kind ? `${a.kind}: ` : ""}${a.t}`),
    f.agendaNote,
    "",
    close,
    "",
    "Warm regards,",
    SIGNATORY.name,
    SIGNATORY.title,
    "",
    f.siteUrl,
    `Questions? Reply to this email, or write to ${f.contactEmail}.`,
  ].join("\n");

  return { subject, html, text };
}
