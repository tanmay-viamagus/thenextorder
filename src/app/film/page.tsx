import type { Metadata } from "next";
import { FilmPlayer } from "@/components/film/FilmPlayer";

export const metadata: Metadata = {
  title: "The Film | The NEXT Order | ViaMagus",
  description: "The 30-second film for The NEXT Order — for the event screens.",
};

export default function FilmPage() {
  return (
    <main className="film-page">
      <h1 className="sr-only">The NEXT Order — the film</h1>
      <FilmPlayer mode="page" />
    </main>
  );
}
