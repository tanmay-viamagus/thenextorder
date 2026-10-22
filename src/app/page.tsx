import { FilmOverlay } from "@/components/film/FilmOverlay";
import { Site } from "@/components/shift/Site";
import { event, knownFacts } from "@/content/event";
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
      {/* opening the site always opens on the event: the browser doesn't put a returning
          visitor back where they left off; a fresh link to a section (/#evening) still goes there (Chrome re-aims it once the page is live) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{history.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type!=="navigate"&&location.hash){history.replaceState(history.state,"",location.pathname+location.search)}if(!location.hash){window.scrollTo(0,0)}}catch(e){}})();`,
        }}
      />
      <Site />
      <FilmOverlay />
    </>
  );
}
