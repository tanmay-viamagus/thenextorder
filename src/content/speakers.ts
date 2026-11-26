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
// in the sheet's order. Emmanuel Gosula joined the hiring panel on 21 Nov, once his new company (Fresche Solutions)
// was named. Left off until the sheet says more: Anurag Asthana (tentative), and anyone still in discussion. Sheetal Srikanth is on the sheet for
// Aikam's logo, not on stage. The panels' themes are the agenda's (content/event.ts): technology for the
// first, hiring for the second.
// Bios, designations and photos as supplied in bios/ or by the organisers (12 Nov: Venugopal, Sunny, Sravanti;
// 19 Nov: Srinidhi Reddy Kongari's designation, bio and photo, the photo cropped to a portrait from her doc's), except:
// Sheena Bhalla's bio, condensed from her own speaker profile; and, where
// nothing was supplied, the designation from the sheet. Photos not supplied are from public pages that name
// them with their company: Srinivas Dasari's his LinkedIn photo
// (via TheOrg, at a larger size), Venugopal Rao Sankineni's from the Global Pharma Partnering Summit (small),
// and Sravanti Chekragari's and Vijayashree Pathikonda's cropped from awards-jury posters. Supplied
// headshots would be better for all five. Sravanti's surname is spelt as on her LinkedIn and Adaps pages
// (the sheet has "Chekragiri").
// LinkedIn: every profile as the team recorded it when inviting them (Corner, Event, invitees; checked 12 Nov).
// Rashi Srivastava's is the one the team used (two profiles carry her name and Qentelli). Saurabh Bali's recorded
// link (linkedin.com/in/saurabhbali5) returned "not found" on 20 Nov, so his card has none until the right one is supplied.
const lineUp: SpeakerGroup[] = [
  {
    title: "Keynote",
    // Confirmed 21 Nov: the keynote after the welcome address (content/event.ts). Designation, bio and portrait
    // as supplied in the team's "Phani Nagarjuna Bio and Photo (Portrait)" doc (6 Nov), the portrait cropped to 4:5.
    people: [
      {
        name: "Phani Nagarjuna",
        // 21 Nov: designation as the organisers now want it printed (was "Founding Global CEO, Aikam")
        role: "Chief Advisor",
        company: "AIKAM Global",
        photo: "/speakers/phani-nagarjuna-2026.jpg",
        linkedin: "https://www.linkedin.com/in/phaninagarjuna",
        bio: "Phani Nagarjuna is Founding Global CEO of Aikam, the state-backed entity building a first-of-its-kind sovereign AI ecosystem in India, and founder of a stealth AI startup. A multi-time founder and C-suite executive with 30 years’ experience across Silicon Valley, enterprise and sovereign technology, he led a turnaround at Caritor and the exit of Nuevora to TPG/Sutherland. He is a World Economic Forum Expert in AI, Cybersecurity and Entrepreneurship, a strategic advisor to Kwaai, and an alumnus of Harvard Business School.",
      },
    ],
  },
  {
    title: "Expert talk",
    note: "Adopting responsible AI",
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
        linkedin: "https://www.linkedin.com/in/rashisrivastava1",
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
        role: "Vice President R&D and Site Leader",
        company: "WS Audiology",
        photo: "/speakers/srinivas-dasari.jpg",
        linkedin: "https://www.linkedin.com/in/dasari22",
        bio: "Srinivas “Sunny” Dasari is Vice President R&D and Site Leader at WS Audiology in Hyderabad. A technology executive with over 15 years in customer-facing digital products, he previously served as Senior Director R&D at WS Audiology in Copenhagen. At Cigna, he led 110 engineers across mobile, web and API teams, building 25 digital applications serving 14 million customers in 30 countries, including Coach by Cigna with Samsung.",
      },
      {
        // 26 Nov (organisers): Amith is on the technology panel as well as a host
        name: "Amith Krishnan",
        role: "Founder and CXO",
        company: "Viamagus",
        photo: "/speakers/amith-krishnan.jpg",
        bio: "Amith Krishnan is Founder and Chief Experience Officer of Viamagus, which he set up in 2012 as a specialist consultancy in user research, UX design and interface engineering for digital financial products. A product leader with over 18 years’ experience across BFSI and fintech, he was previously Head of Product Management at Kuliza and Product Manager & Consultant at Commodities Engineering. He began his career at Eka Software Solutions, rising from software engineer to Principal Consultant in Luxembourg.",
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
    title: "Hiring panel",
    note: "Hiring and people leadership in the age of the agentic workforce",
    // 21 Nov: Venugopal Rao Sankineni (Government of Telangana) first, as in the event brochure; the moderator last
    people: [
      {
        name: "Venugopal Rao Sankineni",
        role: "Vice President – Pharma, Life Sciences & Medical Devices",
        company: "Government of Telangana",
        photo: "/speakers/venugopal-rao-sankineni.jpg",
        linkedin: "https://www.linkedin.com/in/venugopal-rao-sankineni-ba520519",
        bio: "Venugopal Rao Sankineni is Vice President – Pharma, Life Sciences & Medical Devices (Policy & Investments) at the Government of Telangana, where he leads investment promotion, policy development and ecosystem building. He has helped develop the state’s 300+ acre Medical Devices Park, which has drawn over $400 million in committed investments. A technology executive with over 25 years’ experience, he earlier held leadership and consulting roles with Merck, Sanofi, Genzyme, Stryker, AstraZeneca, Dow and PVH across North America and India.",
      },
      {
        name: "Vijayashree Pathikonda",
        role: "Global Head of Human Resources – Senior Vice President",
        company: "NationsBenefits",
        photo: "/speakers/vijayashree-pathikonda.jpg",
        linkedin: "https://www.linkedin.com/in/vspathikonda",
        bio: "Vijayashree Pathikonda is Global Head of Human Resources – Senior Vice President at NationsBenefits, where she leads HR strategy and operations across the US, India and LATAM. An HR leader with over 20 years’ experience across technology, manufacturing and consulting, she has held senior HR roles at Eastman, FICOSA, Verisk and Polycom, and co-founded Valeur Consulting. She has built HR functions from the ground up, improved engagement, cut attrition, and led digital HR transformation and post-merger integration.",
      },
      {
        name: "Sravanti Chekragari",
        role: "Chief Operating Officer",
        company: "ADAPS",
        photo: "/speakers/sravanti-chekragari.jpg",
        linkedin: "https://www.linkedin.com/in/sravanti-chekragari-98642310",
        bio: "Sravanti Chekragari is Chief Operating Officer at ADAPS, where she drives enterprise-wide operations, strategic growth and multi-stakeholder alignment. A specialist in organisational design and change leadership, she previously headed the Skills Academy at Biocon Biologics and led leadership and talent development at Cadila Pharmaceuticals, Daimler’s Corporate Academy for APAC and Cigniti Technologies. She also champions education and community CSR initiatives.",
      },
      {
        // 21 Nov 2026: name, designation, company, bio and photo as supplied in the team’s "Emmanuel Gosula" doc,
        // the photo cropped closer to a portrait.
        name: "Emmanuel Gosula, PhD",
        // 21 Nov: his new GCC, as the organisers sent it (his doc gave his previous role at EPAM Systems)
        role: "Director – India GCC",
        company: "Fresche Solutions",
        photo: "/speakers/emmanuel-gosula.jpg",
        linkedin: "https://www.linkedin.com/in/emmanuelgosula",
        bio: "Emmanuel Gosula is Senior Manager and Head of People Programs at EPAM Systems, where he leads initiatives to engage, retain and develop software engineers across India and APAC. An HR leader with over 20 years’ experience, he has spent most of his career at EPAM and its predecessor, Alliance Global Services, with a stint as Regional Head – People & Culture at NTT DATA. He holds a PhD in Business Administration from Chitkara University and is pursuing XLRI Jamshedpur’s PGDM for Emerging CHROs.",
      },
      {
        name: "Srinidhi Reddy Kongari",
        role: "Fractional Client Partner – GCC Accounts",
        company: "Viamagus",
        photo: "/speakers/srinidhi-reddy-kongari-2026.jpg",
        linkedin: "https://www.linkedin.com/in/srinidhireddyk",
        bio: "Srinidhi Reddy Kongari is a Fractional Client Partner – GCC Accounts at Viamagus, where she works with Global Capability Centres (GCCs) in advancing their AI-native transformation journeys. Previously, she led Strategy & Partnerships and Corporate Programs at MATH, the AI/ML Centre of Excellence at T-Hub, where she worked closely with corporates and GCCs to identify AI-driven business opportunities, translate them into actionable use cases, and facilitate their implementation through partnerships with AI startups. Her work focused on bridging enterprise AI ambitions with India’s emerging AI innovation ecosystem. She is an alumna of ESSEC Business School and NIT Warangal.",
        part: "Moderator",
      },
    ],
  },
  {
    // 25 Nov: Viamagus's founders, the hosts. Designations, bios and photos as supplied in the team's "Amith Krishnan
    // Bio and Photo" and "Sachin Talwar Bio and Photo" docs (6 Nov), the photos cropped to 4:5. No LinkedIn supplied.
    // Listed after the panels, as on the event brochure (where they sit under "Organised by").
    title: "Hosts",
    people: [
      {
        // 26 Nov (organisers): the hosts are Shreenath, Amith and Sachin, all three founders. Photo supplied 26 Nov;
        // no bio yet.
        name: "Shreenath Rao",
        role: "Founder and CEO",
        company: "Viamagus",
        photo: "/speakers/shreenath-rao.jpg",
      },
      {
        name: "Amith Krishnan",
        role: "Founder and CXO",
        company: "Viamagus",
        photo: "/speakers/amith-krishnan.jpg",
        bio: "Amith Krishnan is Founder and Chief Experience Officer of Viamagus, which he set up in 2012 as a specialist consultancy in user research, UX design and interface engineering for digital financial products. A product leader with over 18 years’ experience across BFSI and fintech, he was previously Head of Product Management at Kuliza and Product Manager & Consultant at Commodities Engineering. He began his career at Eka Software Solutions, rising from software engineer to Principal Consultant in Luxembourg.",
      },
      {
        name: "Sachin Talwar",
        role: "Founder and CTO",
        company: "Viamagus",
        photo: "/speakers/sachin-talwar.jpg",
        bio: "Sachin Talwar is Founder and CTO of Viamagus Technologies in Bengaluru, where since 2013 he has led the end-to-end design and development of the Viamagus cloud platform for building websites, e-commerce stores, landing pages and social walls. A technologist with over 18 years’ experience in SaaS and enterprise products, he previously spent nearly five years at Eka Software Solutions, rising from software engineer to Technical Lead on its CTRM product. He is an alumnus of RV College of Engineering.",
      },
    ],
  },
];

/**
 * Bios were kept off the site from 12 Nov 2026 until the speakers approved them. 26 Nov 2026: all bios on, as supplied
 * (Vijayashree Pathikonda's in the copy she sent that day). Set this to false to hide them all again.
 */
export const showBios = true;

/** Used only when showBios is false: bios shown one by one, by name. */
export const approvedBios: ReadonlySet<string> = new Set<string>([]);

/** Bios held back even when showBios is on, by name: Emmanuel Gosula's still describes his EPAM role (he is now at
 * Fresche Solutions); the organisers are getting an updated one (26 Nov 2026). */
export const heldBios: ReadonlySet<string> = new Set<string>(["Emmanuel Gosula, PhD"]);

const shown = (p: Speaker) =>
  (showBios || approvedBios.has(p.name)) && !heldBios.has(p.name) ? p : { ...p, bio: undefined };

export const speakerGroups: SpeakerGroup[] = lineUp.map((g) => ({ ...g, people: g.people.map(shown) }));

/** Everyone, in page order: for the section's own check and the event's structured data. */
export const allSpeakers = speakerGroups.flatMap((g) => g.people).filter((p, i, all) => all.findIndex((q) => q.name === p.name) === i);
