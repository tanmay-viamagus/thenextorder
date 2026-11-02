/**
 * Speakers and panellists: the one place to add, edit, remove or reorder
 * them. The page shows the groups in this order and each group's people in
 * the order listed. A group with nobody in it is left off the page, and so is
 * the whole section while every group is empty.
 *
 * Only what has been supplied: never a guessed title, company or photo.
 * `npm test` checks every entry (tests/showcase.test.mts).
 *
 * An entry, with every field:
 *
 *   {
 *     name: "Full name",
 *     role: "Designation",
 *     company: "Organisation",
 *     photo: "/speakers/full-name.jpg",
 *     linkedin: "https://www.linkedin.com/in/handle",
 *   },
 */
export type Speaker = {
  /** As they want it printed */
  name: string;
  /** Their designation, e.g. "Chief Technology Officer"; left out until supplied */
  role?: string;
  /** Left out for someone speaking independently */
  company?: string;
  /**
   * A file in public/speakers/, e.g. "/speakers/full-name.jpg": a portrait
   * (shown 4:5, cropped from the centre), JPG, PNG, WebP or AVIF, at least
   * 800 px wide. Without one, their initials stand in.
   */
  photo?: string;
  /** Where the face sits, as CSS object-position, if the centre crop cuts it, e.g. "50% 20%" */
  photoFocus?: string;
  /** Their profile, e.g. "https://www.linkedin.com/in/handle" */
  linkedin?: string;
};

export type SpeakerGroup = {
  /** e.g. "Speakers", "Panellists", or one panel's name */
  title: string;
  /** A line beside the title, e.g. the panel's theme */
  note?: string;
  people: Speaker[];
};

/** The section's own words. */
export const speakersCopy = {
  label: "On stage",
  title: ["The people shaping", "what’s next."],
  intro: "Who you’ll hear on 3 December, on how GCCs hire, build and lead as AI reshapes them.",
};

// from the speaker sheet and photos supplied on 2 Nov 2026; Sayantan Bose's designation is from his LinkedIn profile
export const speakerGroups: SpeakerGroup[] = [
  {
    title: "Speakers",
    people: [
      {
        name: "Sheena Bhalla",
        company: "ModuleXero",
        photo: "/speakers/sheena-bhalla.jpg",
        linkedin: "https://www.linkedin.com/in/sheenabhalla",
      },
    ],
  },
  {
    title: "Panellists",
    people: [
      // company yet to be revealed
      { name: "Emmanuel", linkedin: "https://www.linkedin.com/in/emmanuelgosula" },
      { name: "Rashi Srivastava", company: "Quentelli" },
      { name: "Anurag Asthana", company: "Olympus" },
      { name: "Anurag Garg", company: "Ryan" },
      { name: "Saurabh Bali", company: "Ensemble" },
      // not on the sheet: group and company to confirm
      { name: "Sheetal Srikanth", photo: "/speakers/sheetal-srikanth.jpg", linkedin: "https://www.linkedin.com/in/sheetal-srikanth" },
    ],
  },
  {
    title: "Moderator",
    people: [
      {
        name: "Sayantan Bose",
        role: "Managing Director, Clients & Markets",
        company: "Protiviti",
        photo: "/speakers/sayantan-bose.jpg",
        linkedin: "https://www.linkedin.com/in/sayantan-bose-8967b817",
      },
    ],
  },
];

/** Everyone, in page order: for the section's own check and the event's structured data. */
export const allSpeakers = speakerGroups.flatMap((g) => g.people);
