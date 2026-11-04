import { rsvpCalendar } from "@/content/rsvp";
import { calendarFile } from "@/lib/rsvp";

/** GET /rsvp/calendar.ics — the evening for Apple Calendar, Outlook and the rest, offered once a guest replies. */
export function GET() {
  return new Response(calendarFile(rsvpCalendar), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="The-NEXT-Order.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
