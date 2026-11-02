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
 *   { name: "Organisation", logo: "/organisations/organisation.svg", treatment: "mono", scale: 1 },
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
   * "mono" (the default): greyscale and quiet, its own colours on hover.
   * "original": its own colours always, for a logo known by its colour.
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

export const organisations: Organisation[] = [];
