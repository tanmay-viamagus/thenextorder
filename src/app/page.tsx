import { Director } from "@/components/Director";
import { Forces, Header, Hook, Invite, Recap, Shift, Signal } from "@/components/Frames";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hook />
        <Shift />
        <Forces />
        <Signal />
        <Recap />
        <Invite />
      </main>
      <Director />
    </>
  );
}
