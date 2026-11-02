import { FilmOverlay } from "@/components/film/FilmOverlay";
import { ScrollStart } from "@/components/ScrollStart";
import { Site } from "@/components/shift/Site";
import { event, knownFacts } from "@/content/event";
import { allSpeakers } from "@/content/speakers";
import { description } from "@/content/story";
import { siteUrl } from "@/lib/site-url";

/** Structured data for search: the event as the brochure states it. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "The NEXT Order",
  description,
  startDate: event.start,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: event.venue,
    address: { "@type": "PostalAddress", addressLocality: event.city, addressCountry: "IN" },
  },
  organizer: { "@type": "Organization", name: knownFacts.host, url: "https://viamagus.com/" },
  // the people on stage, once announced (content/speakers.ts)
  ...(allSpeakers.length > 0 && {
    performer: allSpeakers.map((s) => ({
      "@type": "Person",
      name: s.name,
      ...(s.role ? { jobTitle: s.role } : {}),
      ...(s.company ? { worksFor: { "@type": "Organization", name: s.company } } : {}),
      ...(s.linkedin ? { sameAs: s.linkedin } : {}),
    })),
  }),
  url: siteUrl(),
  image: `${siteUrl()}/og-image.jpg`,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ScrollStart />
      <Site />
      <FilmOverlay />
    </>
  );
}
