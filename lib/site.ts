export const CONTACT_EMAIL = "jmilam@micap.pro";

export const SITE = {
  name: "Micap LLC",
  url: "https://micap.pro",
  locale: "en_US",
  description:
    "Micap LLC is Jeffrey Milam’s consulting firm. Four divisions — software, business, construction, and real estate — owner-side, and led directly.",
} as const;

export type MediaKey =
  | "home"
  | "software"
  | "business"
  | "construction"
  | "real-estate"
  | "about"
  | "contact";

export type MediaAsset = {
  mp4: string;
  webm: string;
  poster: string;
  srcSet: string;
  width: number;
  height: number;
};

export const media: Record<MediaKey, MediaAsset> = {
  home: asset("home"),
  software: asset("software"),
  business: asset("business"),
  construction: asset("construction"),
  "real-estate": asset("real-estate"),
  about: asset("about"),
  contact: asset("contact"),
};

function asset(name: string): MediaAsset {
  return {
    mp4: `/media/${name}.mp4`,
    webm: `/media/${name}.webm`,
    poster: `/media/${name}-1600.webp`,
    srcSet: `/media/${name}-800.webp 800w, /media/${name}-1600.webp 1600w`,
    width: 1600,
    height: 900,
  };
}

export type Practice = {
  slug: "software" | "business" | "construction" | "real-estate";
  nav: string;
  index: string;
  title: string;
  card: string;
  eyebrow: string;
  lede: string;
  description: string;
  media: MediaKey;
  covers: { title: string; body: string }[];
  approachTitle: string;
  approach: { title: string; body: string }[];
  background: string[];
};

export const practices: Practice[] = [
  {
    slug: "software",
    nav: "Software",
    index: "01",
    title: "Software Development & Tech Consulting",
    card: "Scoping, architecture, and delivery advice for owners deciding what software is worth building.",
    eyebrow: "01  ·  Software",
    lede: "Technical counsel for owners who need software judged the way a capital project is judged: scope, risk, and what it will cost to run.",
    description:
      "Software development and technology consulting from Micap LLC. Scoping, architecture, and delivery advice, with lab and AI engineering at sister firm Micap AI.",
    media: "software",
    covers: [
      {
        title: "Scope before a build",
        body: "A plain account of what the system has to do, what it does not have to do, and which decision the software is supposed to change.",
      },
      {
        title: "Architecture review",
        body: "An owner-side read of a TypeScript or Python design: boundaries, data, and the parts that will be expensive to change later.",
      },
      {
        title: "Cloud and delivery",
        body: "Advisory on AWS, Terraform, Docker, Kubernetes, and PostgreSQL, and oversight when an internal team or a vendor is the one building.",
      },
      {
        title: "A clean handoff",
        body: "When the work is a product build or applied AI, it belongs with Micap AI, the sister firm. This division decides whether that handoff is the right one.",
      },
    ],
    approachTitle: "How a software engagement runs",
    approach: [
      {
        title: "Name the decision",
        body: "Build, buy, or wait. The engagement starts from that choice, not from a tool list.",
      },
      {
        title: "Write the scope",
        body: "Scope in plain language, including the work that will not be done.",
      },
      {
        title: "Review the plan",
        body: "Architecture and delivery are checked against that scope, including what it will cost to operate.",
      },
      {
        title: "Leave a record",
        body: "The owner keeps a written view they can hand to a team, a vendor, or to Micap AI when the work belongs in the lab.",
      },
    ],
    background: [
      "Jeffrey Milam builds software and does AI engineering in Python and TypeScript, on AWS, with Terraform, Docker, Kubernetes, and PostgreSQL.",
      "Micap LLC’s software division is the consulting practice. Micap AI, at micap.ai, is the sister company: the Software Lab and AI Engineering firm. Product builds and lab work live there.",
    ],
  },
  {
    slug: "business",
    nav: "Business",
    index: "02",
    title: "Business Consulting",
    card: "Operating counsel for owners, when a decision crosses a project, a property, and a P&L.",
    eyebrow: "02  ·  Business",
    lede: "Operating advice for owners. The work is grounded in program management and an executive business education, and it is led by the person you hire.",
    description:
      "Business consulting from Micap LLC. Owner-side advice on programs, operations, and decisions that cross a project, a property, and a P&L.",
    media: "business",
    covers: [
      {
        title: "A portfolio of initiatives",
        body: "Which efforts run now, which wait, and how people and money are sequenced so the important work is the work that moves.",
      },
      {
        title: "Where process costs",
        body: "A look at the steps that protect an outcome, and the steps that only add time. The recommendation stays specific to the operation in front of us.",
      },
      {
        title: "Decisions that cross a desk",
        body: "Many owner decisions are a project, a property, and a P&L at once. The engagement treats them as one decision.",
      },
      {
        title: "A technical issue, in business terms",
        body: "Construction and software questions translated into cost, time, and what the owner is actually choosing.",
      },
    ],
    approachTitle: "How a business engagement runs",
    approach: [
      {
        title: "Start from the decision",
        body: "The question the owner has to answer, in their words, before any framework is applied.",
      },
      {
        title: "Separate the problems",
        body: "An operating problem and a project problem ask for different work. They get named separately.",
      },
      {
        title: "Put time and money in order",
        body: "Sequence the effort so the scarce resource lands where the decision requires it.",
      },
      {
        title: "Leave a short written view",
        body: "A document the owner can use. The length follows the decision, not a template.",
      },
    ],
    background: [
      "Jeffrey Milam completed an Executive MBA at the Quantic School of Business and Technology in 2025, with a 4.0 GPA.",
      "From 2015 to 2019 he was a Technical Program Manager and Senior Construction Services Manager / CapEx Product Owner at Equity Residential, running capital programs of about $27 million a year. That work is the practical base of the business practice: programs, owners, and the cost of getting the sequence wrong.",
    ],
  },
  {
    slug: "construction",
    nav: "Construction",
    index: "03",
    title: "Construction Consulting",
    card: "Owner’s representation for capital projects: scope, cost, schedule, and cost-overrun prevention.",
    eyebrow: "03  ·  Construction",
    lede: "Owner’s-representative support for capital projects. Scope, cost, schedule, and the work of keeping an overrun from becoming the plan.",
    description:
      "Construction consulting from Micap LLC. Owner’s representation, construction management, value engineering, and cost-overrun prevention.",
    media: "construction",
    covers: [
      {
        title: "Owner’s representation",
        body: "A seat on the owner’s side of capital and construction programs, from the documents through the field.",
      },
      {
        title: "Construction management",
        body: "Design, procurement, and delivery held to the scope the owner actually approved.",
      },
      {
        title: "Value engineering",
        body: "Cost taken out where it does not damage the asset. The point is a better project, not a cheaper bid that returns as a change order.",
      },
      {
        title: "Cost-overrun prevention",
        body: "Contingencies, change control, and a definition of done that the budget can survive.",
      },
    ],
    approachTitle: "How a construction engagement runs",
    approach: [
      {
        title: "Read it from the owner’s side",
        body: "Drawings, budget, and contract, with the owner’s risk as the question.",
      },
      {
        title: "Find the usual slip",
        body: "Where cost and schedule move on this kind of work, named before they move.",
      },
      {
        title: "Stay through the changes",
        body: "Procurement, changes, and the field coordination those changes require.",
      },
      {
        title: "Close with a record",
        body: "Decisions, costs, and what done means, in a form the owner can keep.",
      },
    ],
    background: [
      "Jeffrey Milam holds a B.S. in Construction Management and Technology from Arizona State University, 2015.",
      "From 2015 to 2019, at Equity Residential, he was a Technical Program Manager and Senior Construction Services Manager / CapEx Product Owner, and owner’s representative on a $3 billion Class A+ portfolio. Capital programs ran about $27 million a year across more than 3,600 units and 30 commercial assets. The work was construction management, value engineering, and cost-overrun prevention.",
    ],
  },
  {
    slug: "real-estate",
    nav: "Real Estate",
    index: "04",
    title: "Real Estate Consulting",
    card: "Capital, acquisitions, and value-add, read with a builder’s eye and a buyer’s basis.",
    eyebrow: "04  ·  Real Estate",
    lede: "Advice on capital, acquisitions, and value-add. For owners deciding what to buy, what to improve, and what a number is actually worth.",
    description:
      "Real estate consulting from Micap LLC. Capital, acquisitions, and value-add advice, informed by hands-on work in Southern California and Maricopa County, Arizona.",
    media: "real-estate",
    covers: [
      {
        title: "Acquisitions",
        body: "Basis, condition, and the work the price assumes will happen after closing. The question is what the number leaves unsaid.",
      },
      {
        title: "Capital",
        body: "A capital plan for the asset in front of you: what the work costs, when it has to happen, and what can wait.",
      },
      {
        title: "Value-add",
        body: "Improvements read the way a builder reads them. Scope, sequence, and the cost of doing the work while the asset is occupied or leased.",
      },
      {
        title: "Markets with hands-on work",
        body: "Wholesale and flip experience in San Diego and Southern California, and in Maricopa County, Arizona. The advice is informed by that work. It is still advice, specific to the asset you bring.",
      },
    ],
    approachTitle: "How a real estate engagement runs",
    approach: [
      {
        title: "Start with the asset",
        body: "The property, the basis, and the work the price assumes.",
      },
      {
        title: "Separate the questions",
        body: "What to buy, and what the capital plan looks like after closing, are different decisions.",
      },
      {
        title: "Price the work",
        body: "Value-add costed the way the construction will actually run.",
      },
      {
        title: "Write it down before money moves",
        body: "A view the owner can use while the decision is still open.",
      },
    ],
    background: [
      "Jeffrey Milam has bought and sold property hands-on: wholesale and flip work in San Diego, Southern California, and Maricopa County, Arizona.",
      "The same years at Equity Residential were an owner’s-side view of a large multifamily and commercial portfolio: a $3 billion Class A+ portfolio, capital programs of about $27 million a year, more than 3,600 units, and 30 commercial assets.",
      "Micap advises on the decision. This page is not an offer of securities and not a brokerage solicitation.",
    ],
  },
];

export const practiceBySlug = Object.fromEntries(
  practices.map((practice) => [practice.slug, practice]),
) as Record<Practice["slug"], Practice>;

export const whyMicap = [
  {
    index: "01",
    title: "Owner-side",
    body: "Scope, cost, and risk are read from your side of the table. The engagement is there to protect the outcome you are paying for.",
  },
  {
    index: "02",
    title: "Senior-led",
    body: "Jeffrey Milam does the work he is hired for. The judgment you retain is the judgment in the work.",
  },
  {
    index: "03",
    title: "Cross-trained",
    body: "Construction management, capital programs, acquisitions, and software sit in one practice. Useful when a decision touches more than one of them.",
  },
  {
    index: "04",
    title: "Specific",
    body: "Recommendations stay tied to the asset, the budget, and the schedule. The writing is as long as the decision requires.",
  },
];

export const founderFacts = [
  {
    term: "Education",
    detail:
      "B.S. Construction Management and Technology, Arizona State University, 2015. Executive MBA, Quantic School of Business and Technology, 2025, 4.0 GPA.",
  },
  {
    term: "Equity Residential, 2015–2019",
    detail:
      "Technical Program Manager and Senior Construction Services Manager / CapEx Product Owner. Owner’s representative on a $3 billion Class A+ portfolio. Capital programs of about $27 million a year across more than 3,600 units and 30 commercial assets.",
  },
  {
    term: "The work there",
    detail:
      "Construction management, value engineering, and cost-overrun prevention.",
  },
  {
    term: "Real estate, hands-on",
    detail:
      "Wholesale and flip experience in San Diego, Southern California, and Maricopa County, Arizona.",
  },
  {
    term: "Software",
    detail:
      "Python, TypeScript, AWS, Terraform, Docker, Kubernetes, and PostgreSQL.",
  },
];

export const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/software/", priority: 0.8 },
  { path: "/business/", priority: 0.8 },
  { path: "/construction/", priority: 0.8 },
  { path: "/real-estate/", priority: 0.8 },
  { path: "/about/", priority: 0.6 },
  { path: "/contact/", priority: 0.6 },
];

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Micap LLC",
  url: "https://micap.pro",
  email: CONTACT_EMAIL,
  image: "https://micap.pro/og.png",
  description: SITE.description,
  founder: {
    "@type": "Person",
    name: "Jeffrey Milam",
    jobTitle: "Founder",
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Arizona State University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Quantic School of Business and Technology",
      },
    ],
  },
  areaServed: "US",
  knowsAbout: [
    "Software consulting",
    "Business consulting",
    "Construction consulting",
    "Real estate consulting",
    "Owner's representation",
    "Capital planning",
  ],
};
