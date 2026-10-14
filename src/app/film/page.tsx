import type { Metadata } from "next";
import { Film } from "@/components/Film";

export const metadata: Metadata = {
  title: "The Film | The NEXT Order | ViaMagus",
  description: "The 30-second event film for The NEXT Order — silent, looping, 16:9, for the event screens.",
};

export default function FilmPage() {
  return <Film />;
}
