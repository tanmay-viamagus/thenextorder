import { Resend } from "resend";
import { agenda, event, siteAddress } from "@/content/event";
import { greetingName, SIGNATORY } from "@/lib/confirmation-email";
import { DEFAULT_FROM, DEFAULT_REPLY_TO, type SendResult } from "@/lib/send-confirmation";
import { welcomeEmail } from "@/lib/welcome-email";

/**
 * Sends the check-in welcome email through Resend, from the same sender as the
 * confirmation email (CONFIRMATION_FROM / CONFIRMATION_REPLY_TO override it).
 * Without RESEND_API_KEY nothing is sent; the check-in itself is already saved.
 */
export async function sendWelcome(to: string, name: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY is not set" };

  const { subject, html, text } = welcomeEmail({ greeting: greetingName(name) }, {
    venue: [event.venue, event.city].filter(Boolean).join(", "),
    agenda,
    siteUrl: siteAddress,
    signatory: SIGNATORY,
  });
  const { data, error } = await new Resend(key).emails.send({
    from: process.env.CONFIRMATION_FROM || DEFAULT_FROM,
    replyTo: process.env.CONFIRMATION_REPLY_TO || DEFAULT_REPLY_TO,
    to: [to],
    subject,
    html,
    text,
  });
  if (error || !data) return { sent: false, reason: error ? `${error.name}: ${error.message}` : "no response" };
  return { sent: true, id: data.id };
}
