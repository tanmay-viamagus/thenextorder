import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { agenda, agendaNote, contactEmail, event } from "@/content/event";
import { confirmationEmail } from "@/lib/confirmation-email";
import { siteUrl } from "@/lib/site-url";

/**
 * Sends the confirmation email through Resend (Vercel Marketplace).
 *
 * Needs RESEND_API_KEY, and the sending domain (thenextorder.events)
 * verified in that Resend account. The event's domain has no mailbox, so
 * replies go to Shreenath's own inbox. CONFIRMATION_FROM and
 * CONFIRMATION_REPLY_TO override them. Without a key nothing is sent and the
 * registration is unaffected — it is already saved by the time this runs.
 */
export const DEFAULT_FROM = "Shreenath Rao <shreenath.rao@thenextorder.events>";
export const DEFAULT_REPLY_TO = "Shreenath.rao@viamagus.com";

const BROCHURE = path.join(process.cwd(), "src/assets/the-next-order-brochure.pdf");
export const BROCHURE_NAME = "The-NEXT-Order-Brochure.pdf";

export type SendResult = { sent: true; id: string } | { sent: false; reason: string };

export async function sendConfirmation(to: string, p: { name: string; updated: boolean }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY is not set" };

  const { subject, html, text } = confirmationEmail(p, {
    date: event.date ?? "",
    time: event.time ?? "",
    venue: [event.venue, event.city].filter(Boolean).join(", "),
    format: event.format ?? "",
    agenda,
    agendaNote: agendaNote.replace(/^Tentative\.\s*/, ""),
    contactEmail,
    siteUrl: siteUrl(),
  });

  const { data, error } = await new Resend(key).emails.send({
    from: process.env.CONFIRMATION_FROM || DEFAULT_FROM,
    replyTo: process.env.CONFIRMATION_REPLY_TO || DEFAULT_REPLY_TO,
    to: [to],
    subject,
    html,
    text,
    attachments: [{ filename: BROCHURE_NAME, content: await readFile(BROCHURE), contentType: "application/pdf" }],
  });
  if (error || !data) return { sent: false, reason: error ? `${error.name}: ${error.message}` : "no response" };
  return { sent: true, id: data.id };
}
