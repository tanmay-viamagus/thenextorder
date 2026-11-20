import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { CheckinDesk } from "@/components/CheckinDesk";
import { listGuests, type Guest } from "@/lib/attendance";

export const metadata: Metadata = {
  title: "Check-in | The NEXT Order",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f6f4f9" };

/**
 * /checkin — the registration desk on the evening: find a guest, tap them in,
 * add walk-ins. Behind the desk password (src/proxy.ts). Several devices can
 * run it at once; each refreshes the list every few seconds.
 */
export default async function Checkin() {
  await connection();
  let guests: Guest[] = [];
  let failed = false;
  try {
    guests = await listGuests();
  } catch (e) {
    console.error(e);
    failed = true;
  }
  return <CheckinDesk initial={guests} failed={failed} />;
}
