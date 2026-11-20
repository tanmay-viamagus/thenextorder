/**
 * The email a guest receives the moment the registration desk checks them in
 * (/checkin): "Viamagus presents The NEXT Order", a personal welcome from
 * Shreenath Rao, the evening's running order and a pointer to the Viamagus
 * booth. Guests know the evening as The NEXT Order; this is where they meet
 * Viamagus as the host behind it.
 *
 * Pure, like confirmation-email.ts, with no imports (the tests load it directly):
 * everything comes in as arguments, the greeting name and signature included. Tables
 * and inline styles, as email clients need.
 */
export type WelcomeFacts = {
  venue: string;
  agenda: { t: string; time?: string; kind?: string }[];
  siteUrl: string;
  /** who signs it, e.g. SIGNATORY from confirmation-email.ts */
  signatory: { name: string; title: string };
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const C = {
  dark: "#0B0A0E",
  purple: "#7C3AED",
  lilac: "#C4B5FD",
  ink: "#0B0A0E",
  ink2: "#6B6B74",
  line: "#E5E2E8",
  muted: "#B9B4C4",
};
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const LABEL = `font:600 11px/1.4 ${SANS};letter-spacing:2px;text-transform:uppercase;`;

/** `greeting` is the name to greet them by: greetingName() in confirmation-email.ts. */
export function welcomeEmail(p: { greeting: string }, f: WelcomeFacts) {
  const name = p.greeting;
  const subject = `Welcome to The NEXT Order, ${name}`;
  const preheader = "Viamagus presents The NEXT Order. You’re checked in, and the evening is yours.";
  const paras = [
    "Welcome. You’re checked in, and we’re delighted you’re here.",
    "Viamagus presents The NEXT Order: an evening for the leaders deciding what Hyderabad’s GCCs become next. We have kept the room small and the conversations honest, and we built every part of tonight around the people in it.",
    "Our team is with you all evening. Whatever you need, find anyone from Viamagus and consider it done.",
    "This is how we work with every customer. We go where they are, we take the trouble to understand what they are building, and we stay until it is right. Tonight we hope you get a feel for that.",
  ];
  const booth = "Do visit the Viamagus booth. It is where we show how we build, operate and hire for GCCs, and we would love to hear what you are working on.";

  const agendaRows = f.agenda
    .map(
      (a) => `<tr>
  <td style="padding:10px 0;border-top:1px solid ${C.line};width:84px;vertical-align:top;font:600 12px/1.6 ${SANS};color:${C.purple};">${esc(a.time ?? "")}</td>
  <td style="padding:10px 0;border-top:1px solid ${C.line};vertical-align:top;">
    ${a.kind ? `<div style="${LABEL}color:${C.ink2};">${esc(a.kind)}</div>` : ""}
    <div style="font:500 15px/1.5 ${SANS};color:${C.ink};">${esc(a.t)}</div>
  </td>
</tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F2F7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F2F7;">
<tr><td align="center" style="padding:28px 14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <tr><td style="background:${C.dark};padding:44px 40px 40px;border-radius:14px 14px 0 0;">
      <p style="margin:0;${LABEL}letter-spacing:4px;color:${C.lilac};">Viamagus presents</p>
      <p style="margin:14px 0 0;font:700 40px/1.05 ${SANS};letter-spacing:-1px;color:#FFFFFF;">The NEXT Order</p>
      <p style="margin:18px 0 0;font:15px/1.5 ${SANS};color:${C.muted};">You’re checked in · ${esc(f.venue)}</p>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:40px 40px 8px;">
      <p style="margin:0 0 18px;font:16px/1.65 ${SANS};color:${C.ink};">Dear ${esc(name)},</p>
      ${paras.map((t) => `<p style="margin:0 0 18px;font:16px/1.65 ${SANS};color:${C.ink};">${esc(t)}</p>`).join("\n      ")}
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:12px 40px 8px;">
      <p style="margin:0 0 6px;${LABEL}color:${C.purple};">This evening</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${agendaRows}</table>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:22px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:#F6F2FD;border-left:3px solid ${C.purple};border-radius:0 10px 10px 0;padding:16px 18px;font:15px/1.6 ${SANS};color:${C.ink};">${esc(booth)}</td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:28px 40px 36px;">
      <p style="margin:0;font:16px/1.65 ${SANS};color:${C.ink};">With warm regards,</p>
      <p style="margin:14px 0 0;font:600 16px/1.4 ${SANS};color:${C.ink};">${esc(f.signatory.name)}</p>
      <p style="margin:2px 0 0;font:14px/1.4 ${SANS};color:${C.ink2};">${esc(f.signatory.title)}</p>
    </td></tr>
    <tr><td style="background:${C.dark};padding:22px 40px;border-radius:0 0 14px 14px;">
      <p style="margin:0;font:12px/1.6 ${SANS};color:${C.muted};">Organised by Viamagus · Ecosystem partner Hyderabad Mavericks</p>
      <p style="margin:4px 0 0;font:12px/1.6 ${SANS};color:${C.muted};"><a href="${esc(f.siteUrl)}" style="color:${C.lilac};text-decoration:none;">${esc(f.siteUrl.replace(/^https?:\/\//, ""))}</a> · Questions? Just reply to this email.</p>
    </td></tr>
  </table>
  <p style="margin:18px 0 0;font:12px/1.5 ${SANS};color:${C.ink2};">You’re receiving this because you were checked in at The NEXT Order.</p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    "VIAMAGUS PRESENTS",
    "THE NEXT ORDER",
    `You’re checked in · ${f.venue}`,
    "",
    `Dear ${name},`,
    "",
    ...paras.flatMap((t) => [t, ""]),
    "THIS EVENING",
    ...f.agenda.map((a) => `${a.time ? `${a.time}  ` : ""}${a.kind ? `${a.kind}: ` : ""}${a.t}`),
    "",
    booth,
    "",
    "With warm regards,",
    f.signatory.name,
    f.signatory.title,
    "",
    `${f.siteUrl} · Questions? Just reply to this email.`,
  ].join("\n");

  return { subject, html, text };
}
