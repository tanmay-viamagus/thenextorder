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
 *     bio: "A few lines about them.",
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
  /** A few lines about them, as supplied: shown behind the card's "Profile" toggle */
  bio?: string;
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

// From the speaker sheet and photos supplied on 2 Nov 2026, as updated on 4 Nov (Emmanuel and Anurag Asthana
// no longer listed; Sayantan Bose's and Saurabh Bali's bios and designations, and Saurabh Bali's photo, supplied).
// Rashi Srivastava's and Anurag Garg's designations are from their LinkedIn profiles. Photos the speakers didn't
// send: Anurag Garg's from his LinkedIn, Rashi Srivastava's (not public on LinkedIn) from her Women Entrepreneurs
// Review interview. Both are small originals; a larger photo from them would sharpen their cards.
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
      {
        name: "Rashi Srivastava",
        role: "Chief Digital Officer",
        company: "Qentelli",
        photo: "/speakers/rashi-srivastava.jpg",
        linkedin: "https://www.linkedin.com/in/rashi-srivastava-954633",
      },
      {
        name: "Anurag Garg",
        role: "SVP & GCC/Regional Technology Leader",
        company: "Ryan",
        photo: "/speakers/anurag-garg.jpg",
        linkedin: "https://www.linkedin.com/in/agarg01",
      },
      {
        name: "Saurabh Bali",
        role: "India Leader and Vice President of Global Strategy",
        company: "Ensemble Health Partners",
        photo: "/speakers/saurabh-bali.jpg",
        bio: "Saurabh Bali is India Leader and Vice President of Global Strategy at Ensemble Health Partners, where he heads the company’s India GCC. With over 25 years in healthcare operations, he has built, scaled and led Global Capability Centres in India. Earlier, he spent over six years at R1 RCM, rising from Hyderabad Site Head to Vice President, India Operations.",
      },
      // not on the sheet: group and company to confirm
      { name: "Sheetal Srikanth", photo: "/speakers/sheetal-srikanth.jpg", linkedin: "https://www.linkedin.com/in/sheetal-srikanth" },
    ],
  },
  {
    title: "Moderator",
    people: [
      {
        name: "Sayantan Bose",
        role: "Managing Director – Clients & Markets",
        company: "Protiviti India",
        photo: "/speakers/sayantan-bose.jpg",
        linkedin: "https://www.linkedin.com/in/sayantan-bose-8967b817",
        bio: "Sayantan Bose is Managing Director – Clients & Markets at Protiviti India, where he leads the firm’s GCC business across India. A consulting and advisory leader with over 26 years’ experience, including nine at EY, he sits on the CII Telangana GCC Advisory Forum and FTCCI’s ICT Committee, and co-founded Hyderabad Mavericks, ecosystem partner for The NEXT Order.",
      },
    ],
  },
];

/** Everyone, in page order: for the section's own check and the event's structured data. */
export const allSpeakers = speakerGroups.flatMap((g) => g.people);
