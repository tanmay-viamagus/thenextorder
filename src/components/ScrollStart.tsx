/**
 * Opening the site always opens on the event: the browser doesn't put a
 * returning visitor back where they left off; a fresh link to a section
 * (/#evening) still goes there (Chrome re-aims it once the page is live).
 */
export function ScrollStart() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{history.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type!=="navigate"&&location.hash){history.replaceState(history.state,"",location.pathname+location.search)}if(!location.hash){window.scrollTo(0,0)}}catch(e){}})();`,
      }}
    />
  );
}
