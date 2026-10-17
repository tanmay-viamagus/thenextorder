import { FilmOverlay } from "@/components/film/FilmOverlay";
import { Motion } from "@/components/site/Motion";
import {
  Convergence,
  Finale,
  Forces,
  Header,
  Hero,
  Invite,
  NextIntro,
  OldOrder,
  Questions,
  Rules,
  Signals,
} from "@/components/site/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <OldOrder />
        <Rules />
        <Signals />
        <NextIntro />
        <Forces />
        <Convergence />
        <Questions />
        <Finale />
        <Invite />
      </main>
      <Motion />
      <FilmOverlay />
    </>
  );
}
