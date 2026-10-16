import { FilmOverlay } from "@/components/film/FilmOverlay";
import { Finale, Forces, Header, Hero, Invite, Order, Signal } from "@/components/world/Chapters";
import { World } from "@/components/world/World";

export default function Home() {
  return (
    <>
      <World />
      <Header />
      <main>
        <Hero />
        <Order />
        <Forces />
        <Signal />
        <Finale />
        <Invite />
      </main>
      <FilmOverlay />
    </>
  );
}
