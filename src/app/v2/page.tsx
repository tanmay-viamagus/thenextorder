import type { Metadata } from "next";
import { FilmOverlay } from "@/components/film/FilmOverlay";
import { ScrollStart } from "@/components/ScrollStart";
import { Site } from "@/components/shift/Site";

// V2: the same site with the centred opening. Kept out of search; the canonical page is "/".
export const metadata: Metadata = {
  title: "The NEXT Order — V2",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeV2() {
  return (
    <>
      <ScrollStart />
      <Site variant="v2" />
      <FilmOverlay />
    </>
  );
}
