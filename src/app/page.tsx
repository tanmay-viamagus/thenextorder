import { Director } from "@/components/Director";
import { FilmOverlay } from "@/components/film/FilmOverlay";
import { FilmFrame, Forces, Header, Hook, Invite, Recap, Shift, Signal } from "@/components/Frames";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hook />
        <FilmFrame />
        <Shift />
        <Forces />
        <Signal />
        <Recap />
        <Invite />
      </main>
      <FilmOverlay />
      <Director />
    </>
  );
}
