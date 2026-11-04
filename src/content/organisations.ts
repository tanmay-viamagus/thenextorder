/**
 * The logo wall: the one place to add, replace, remove or reorder
 * organisations. They show in the order listed; the section is left off the
 * page while the list is empty.
 *
 * Only supplied names and logo files: never a redrawn, approximated or
 * substituted logo. The wall says nothing about who is invited, attending or
 * sponsoring, and neither should anything added here.
 * `npm test` checks every entry (tests/showcase.test.mts).
 *
 * An entry, with every field:
 *
 *   { name: "Organisation", logo: "/organisations/organisation.svg", treatment: "original", scale: 1 },
 */
export type Organisation = {
  /** The organisation's name, read out in place of the logo */
  name: string;
  /**
   * The supplied logo in public/organisations/, e.g. "/organisations/acme.svg".
   * SVG is best; otherwise a PNG or WebP with a transparent background. It is
   * fitted inside its tile, never stretched or cropped. Without one, the name
   * is set in type.
   */
  logo?: string;
  /**
   * "original" (the default): its own colours. Nothing changes on hover.
   * "mono": greyscale and quiet.
   * "solid": one flat ink colour, for a logo supplied in white or too pale for the page.
   */
  treatment?: "mono" | "original" | "solid";
  /** Optical size, 0.6–1.4 (default 1): a logo that looks heavier or slighter than the rest */
  scale?: number;
};

/** The section's own words. */
export const organisationsCopy = {
  label: "Across the industry",
  title: ["Organisations shaping", "the next order."],
  intro: null as string | null,
};

/**
 * For now, the confirmed speakers' companies, in the order of the line-up
 * (content/speakers.ts). Each logo is the company's own file, from its own
 * site or brand library, with only the empty margin around it trimmed.
 */
export const organisations: Organisation[] = [
  { name: "ModuleXero", logo: "/organisations/modulexero.png", scale: 1.05 },
  { name: "Qentelli", logo: "/organisations/qentelli.svg", scale: 0.8 },
  { name: "Ryan", logo: "/organisations/ryan.png", scale: 0.82 },
  { name: "Ensemble Health Partners", logo: "/organisations/ensemble-health-partners.png" },
  { name: "Protiviti", logo: "/organisations/protiviti.svg", scale: 1.1 },
];

/**
 * Until the supplied logos arrive: blank tiles that hold the wall's shape.
 * They show only while `organisations` is empty; 0 takes the wall off the page.
 */
export const placeholderTiles = 8;
