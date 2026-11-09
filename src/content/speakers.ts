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
 *     part: "Moderator",
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
  /** Their part in the group, when it differs from the rest, e.g. "Moderator": a tag on the portrait's corner */
  part?: string;
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

// From the organisers' sheet of 7 Nov 2026: the keynote, the speaker, and each panel with its moderator,
// in the sheet's order. Left off until the sheet says more: Emmanuel Gosula (his company is named after
// 11 Nov), Anurag Asthana (tentative), and anyone still in discussion. Sheetal Srikanth is on the sheet for
// Aikam's logo, not on stage. The panels' themes are the agenda's (content/event.ts): technology for the
// first, HR for the second.
// Bios, designations and photos as supplied in bios/, except: Sheena Bhalla's bio, condensed from her own
// speaker profile; Srinidhi Reddy Kongari's photo, cropped closer from her full-length one; and, where
// nothing was supplied, the designation from the sheet. Photos not supplied are from public pages that name
// them with their company: Phani Nagarjuna's from an Elets summit page, Srinivas Dasari's his LinkedIn photo
// (via TheOrg, at a larger size), Venugopal Rao Sankineni's from the Global Pharma Partnering Summit (small),
// and Sravanti Chekragari's and Vijayashree Pathikonda's cropped from awards-jury posters. Supplied
// headshots would be better for all five. Sravanti's surname is spelt as on her LinkedIn and Adaps pages
// (the sheet has "Chekragiri").
export const speakerGroups: SpeakerGroup[] = [
  {
    title: "Keynote",
    people: [
      {
        name: "Phani Nagarjuna",
        role: "Chief Advisor",
        company: "Aikam",
        photo: "/speakers/phani-nagarjuna.jpg",
        linkedin: "https://www.linkedin.com/in/phaninagarjuna",
      },
    ],
  },
  {
    title: "Speakers",
    people: [
      {
        name: "Sheena Bhalla",
        role: "Founder",
        company: "ModuleXero",
        photo: "/speakers/sheena-bhalla.jpg",
        linkedin: "https://www.linkedin.com/in/sheenabhalla",
        bio: "Sheena Bhalla is Founder of ModuleXero, a think tank and learning venture exploring what responsible leadership looks like in the age of AI, where she runs the Responsible Leadership Initiative. She spent over eight years at Google leading APAC-wide Google News Initiative programmes, including the GNI Data Labs, Subscription Lab and Design Accelerator. She is a Global Council Member of She Shapes AI and an advisor to AI for Good Asia.",
      },
    ],
  },
  {
    title: "Technology panel",
    note: "Rethinking GCC strategy in an AI-first world",
    people: [
      {
        name: "Rashi Srivastava",
        role: "Global Chief Digital Officer",
        company: "Qentelli",
        photo: "/speakers/rashi-srivastava.jpg",
        linkedin: "https://www.linkedin.com/in/rashi-srivastava-954633",
        bio: "Rashi Srivastava is Global Chief Digital Officer at Qentelli, which she joined as its first employee in 2015 and helped scale into a global digital transformation company of 1,500+ people. With over two decades in technology across Kyocera, Wipro and Cigniti, she sits on the NASSCOM Regional Council, co-chairs the FTCCI Women’s Wing and mentors startups.",
      },
      {
        name: "Anurag Garg",
        role: "Senior Vice President, GCC and Regional Technology Leader",
        company: "Ryan",
        photo: "/speakers/anurag-garg.jpg",
        linkedin: "https://www.linkedin.com/in/agarg01",
        bio: "Anurag Garg is Senior Vice President, GCC and Regional Technology Leader at Ryan. An engineering executive with over 25 years of global leadership, he has built and scaled three Global Capability Centres from zero to 1,500+ engineers. At Experian, he established the Hyderabad Global Innovation Center and directed engineering for Ascend, its cloud-native credit analytics platform.",
      },
      {
        name: "Saurabh Bali",
        role: "India Leader and Vice President of Global Strategy",
        company: "Ensemble Health Partners",
        photo: "/speakers/saurabh-bali.jpg",
        bio: "Saurabh Bali is India Leader and Vice President of Global Strategy at Ensemble Health Partners, where he heads the company’s India GCC. With over 25 years in healthcare operations, he has built, scaled and led Global Capability Centres in India. Earlier, he spent over six years at R1 RCM, rising from Hyderabad Site Head to Vice President, India Operations.",
      },
      {
        name: "Srinivas “Sunny” Dasari",
        role: "VP R&D, Site Leader",
        company: "WS Audiology",
        photo: "/speakers/srinivas-dasari.jpg",
        linkedin: "https://www.linkedin.com/in/dasari22",
      },
      {
        name: "Sayantan Bose",
        role: "Managing Director – Clients & Markets",
        company: "Protiviti India",
        photo: "/speakers/sayantan-bose.jpg",
        linkedin: "https://www.linkedin.com/in/sayantan-bose-8967b817",
        bio: "Sayantan Bose is Managing Director – Clients & Markets at Protiviti India, where he leads the firm’s GCC business across India. A consulting and advisory leader with over 26 years’ experience, including nine at EY, he sits on the CII Telangana GCC Advisory Forum and FTCCI’s ICT Committee, and co-founded Hyderabad Mavericks, ecosystem partner for The NEXT Order.",
        part: "Moderator",
      },
    ],
  },
  {
    title: "HR panel",
    note: "Hiring and people leadership in the age of the agentic workforce",
    people: [
      {
        name: "Vijayashree Pathikonda",
        role: "Global Head of Human Resources – Senior Vice President",
        company: "NationsBenefits",
        photo: "/speakers/vijayashree-pathikonda.jpg",
        bio: "Vijayashree Pathikonda is Global Head of Human Resources – Senior Vice President at NationsBenefits, where she leads HR strategy and operations across the US, India and LATAM. An HR leader with over 20 years’ experience across technology, manufacturing and consulting, she has held senior HR roles at Eastman, FICOSA, Verisk and Polycom, and co-founded Valeur Consulting. She has built HR functions from the ground up, cut attrition at NationsBenefits from 45% to 9%, and led digital HR transformation and post-merger integration.",
      },
      {
        name: "Venugopal Rao Sankineni",
        role: "Head of GCC Relationships, Life Sciences",
        company: "Government of Telangana",
        photo: "/speakers/venugopal-rao-sankineni.jpg",
        linkedin: "https://www.linkedin.com/in/venugopal-rao-sankineni-ba520519",
      },
      {
        name: "Sravanti Chekragari",
        role: "Chief Operating Officer",
        company: "Adaps",
        photo: "/speakers/sravanti-chekragari.jpg",
        linkedin: "https://www.linkedin.com/in/sravanti-chekragari-98642310",
      },
      {
        name: "Srinidhi Reddy Kongari",
        role: "Client Partner – GCC Accounts",
        company: "Viamagus",
        photo: "/speakers/srinidhi-reddy-kongari.jpg",
        bio: "Srinidhi Reddy Kongari is Founder of Aarambh App, a women-first strength training platform, and Client Partner – GCC Accounts (Fractional) at Viamagus, where she partners with Hyderabad GCC leaders on becoming AI-native. She previously led strategy and partnerships at MATH, the AI/ML Centre of Excellence at T-Hub, and has mentored candidates for global Master in Management programmes. She is an alumna of ESSEC Business School and NIT Warangal.",
        part: "Moderator",
      },
    ],
  },
];

/** Everyone, in page order: for the section's own check and the event's structured data. */
export const allSpeakers = speakerGroups.flatMap((g) => g.people);
