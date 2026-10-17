import { FilmOverlay } from "@/components/film/FilmOverlay";
import { Finale, Header, Hero, Inflection, Invite, NextOrder, OldOrder } from "@/components/world/Chapters";
import { World } from "@/components/world/World";

export default function Home() {
  return (
    <>
      <World />
      <Header />
      <main>
        <Hero />
        <OldOrder />
        <Inflection />
        <NextOrder />
        <Finale />
        <Invite />
      </main>
      <FilmOverlay />
    </>
  );
}
