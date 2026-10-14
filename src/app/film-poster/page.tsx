import type { Metadata } from "next";
import { PosterField } from "@/components/film/PosterField";

// Internal: renders one frame of the film's light field, screenshotted to public/film-poster.jpg.
export const metadata: Metadata = { title: "Film poster", robots: { index: false, follow: false } };

export default function FilmPoster() {
  return <PosterField />;
}
