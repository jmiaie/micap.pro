export const CONTACT_EMAIL = "info@micap.pro";

export const SITE = {
  name: "Micap LLC",
  url: "https://micap.pro",
  locale: "en_US",
  description:
    "Micap LLC is a boutique multinational consultancy. Four practices — software, business, construction, and real estate — for enterprise clients.",
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
    card: "Scoping, architecture, and delivery advice for enterprises deciding what software is worth building.",
    eyebrow: "01  ·  Software",
    lede: "Technical counsel for clients who need software judged the way a capital project is judged: scope, risk, and what it will cost to run.",
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
        body: "The client keeps a written view they can hand to their team, a vendor, or to Micap AI when the work belongs in the lab.",
      },
    ],
    background: [
      "Our consultants advise in Python and TypeScript, on AWS, with Terraform, Docker, Kubernetes, and PostgreSQL.",
      "Micap LLC’s software division is the consulting practice. Micap AI, at micap.ai, is the sister company: the Software Lab and AI Engineering firm. Product builds and lab work live there.",
    ],
  },
  {
    slug: "business",
    nav: "Business",
    index: "02",
    title: "Business Consulting",
    card: "Fractional Executive Services: our executives step into the C-suite seat — CFO, COO, CTO, CAIO, CMO/GTM, and CXO — and run it.",
    eyebrow: "02  ·  Business",
    lede: "Operating advice and Fractional Executive Services for enterprise and growth-stage clients. Our executives step into the seat and run it, from the operating cadence to the capital plan.",
    description:
      "Business consulting from Micap LLC, including Fractional Executive Services for enterprise and growth-stage clients. Our executives step into and run the seat: fractional CFO, COO, CTO, CAIO, CMO/GTM, and CXO leadership, plus interim leadership, board and investor work, operating cadence, and capital planning.",
    media: "business",
    covers: [
      {
        title: "Fractional Executive Services",
        body: "Our executives step into and run the seat: CFO, COO, CTO, CAIO, CMO/GTM, and CXO, plus interim leadership, board and investor work, operating cadence, and capital planning. Scoped to the decision.",
      },
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
        body: "Many enterprise decisions are a project, a property, and a P&L at once. The engagement treats them as one decision.",
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
        body: "The question the client has to answer, in their words, before any framework is applied.",
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
        body: "A document the client can use. The length follows the decision, not a template.",
      },
    ],
    background: [
      "The business practice works on how a portfolio of initiatives is sequenced, staffed, and paid for, including Fractional Executive Services when the client needs an executive in the seat without a full-time hire.",
      "That advice sits next to capital-program experience on the order of $27 million a year: the cost of getting the sequence wrong, and the discipline of keeping it right.",
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
      "The construction practice brings owner’s-representative experience on a multi-billion-dollar Class A+ portfolio.",
      "Capital programs in that work ran about $27 million a year across more than 3,600 units and 30 commercial assets: construction management, value engineering, and cost-overrun prevention. These figures describe practice capability. They are not a client roster.",
    ],
  },
  {
    slug: "real-estate",
    nav: "Real Estate",
    index: "04",
    title: "Real Estate Consulting",
    card: "Capital, acquisitions, and value-add for owners of portfolios and single assets.",
    eyebrow: "04  ·  Real Estate",
    lede: "Advice on capital, acquisitions, and value-add. For clients deciding what to buy, what to improve, and what a number is actually worth.",
    description:
      "Real estate consulting from Micap LLC. Capital, acquisitions, and value-add for enterprise and private owners.",
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
        title: "Markets",
        body: "Portfolio and asset work, including Southern California and Maricopa County, Arizona. The advice stays specific to the property in front of the client.",
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
        body: "A view the client can use while the decision is still open.",
      },
    ],
    background: [
      "The real estate practice advises on capital, acquisitions, and value-add for multifamily and commercial property.",
      "That work draws on owner’s-side experience with a multi-billion-dollar Class A+ portfolio: capital programs of about $27 million a year, more than 3,600 units, and 30 commercial assets.",
      "Micap advises on the decision. This page is not an offer of securities and not a brokerage solicitation.",
    ],
  },
];

export const practiceBySlug = Object.fromEntries(
  practices.map((practice) => [practice.slug, practice]),
) as Record<Practice["slug"], Practice>;

export const fractionalEngagements = [
  {
    title: "Fractional CFO, COO, and CTO",
    body: "Our executives step into the finance, operations, or technology seat and run it part time, inside the client’s team and reporting rhythm.",
  },
  {
    title: "Fractional CXO",
    body: "Our executives step into the C-suite seat the company needs, including chief experience, and run that scope.",
  },
  {
    title: "Fractional CAIO",
    body: "Our executives take the Chief AI Officer seat and run it: AI strategy, governance, adoption roadmaps, and vendor and model selection, tied to the operating plan.",
  },
  {
    title: "Fractional GTM and CMO-style leadership",
    body: "Our executives step into go-to-market leadership and run it: strategy, positioning, demand generation, and revenue and marketing operations.",
  },
  {
    title: "Interim leadership",
    body: "Our executives run the seat for a defined stretch while a search is underway or a transition is in motion, with a written scope and an end date.",
  },
  {
    title: "Board and investor advisory",
    body: "Our executives step into the board and investor rhythm and carry the work in the room: the numbers, the narrative, and the decisions on the table.",
  },
  {
    title: "Operating cadence",
    body: "Our executives install and run the weekly and monthly rhythm that keeps a portfolio of initiatives moving, and shows where it has stalled.",
  },
  {
    title: "Capital planning",
    body: "Our executives run the capital plan against the operating plan, including what is spent now and what can wait.",
  },
];

export const whyMicap = [
  {
    index: "01",
    title: "Client-side",
    body: "Scope, cost, and risk are read from your side of the table. The engagement is there to protect the outcome you are paying for.",
  },
  {
    index: "02",
    title: "Practice leads",
    body: "Our consultants stay on the engagement. The people you meet are the people who do the work.",
  },
  {
    index: "03",
    title: "One firm",
    body: "Construction, capital programs, acquisitions, and software sit in one practice. Useful when a decision touches more than one of them.",
  },
  {
    index: "04",
    title: "Specific",
    body: "Recommendations stay tied to the asset, the budget, and the schedule. The writing is as long as the decision requires.",
  },
];

export const firmCapabilities = [
  {
    term: "Owner’s representation",
    detail:
      "Experience on a multi-billion-dollar Class A+ portfolio, from the documents through the field.",
  },
  {
    term: "Capital programs",
    detail:
      "Programs of about $27 million a year, across more than 3,600 units and 30 commercial assets.",
  },
  {
    term: "Construction",
    detail:
      "Construction management, value engineering, and cost-overrun prevention.",
  },
  {
    term: "Real estate",
    detail:
      "Capital, acquisitions, and value-add for multifamily and commercial property.",
  },
  {
    term: "Fractional Executive Services",
    detail:
      "Our executives step into and run the seat: CFO, COO, CTO, CAIO, CMO/GTM, and CXO, plus interim leadership and board work, for enterprise and growth-stage clients.",
  },
  {
    term: "Software",
    detail:
      "Python, TypeScript, AWS, Terraform, Docker, Kubernetes, and PostgreSQL. Lab and AI engineering sit with sister firm Micap AI.",
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
  areaServed: "Worldwide",
  knowsAbout: [
    "Software consulting",
    "Business consulting",
    "Fractional Executive Services",
    "Fractional executive leadership",
    "Fractional CXO",
    "Fractional CAIO",
    "Go-to-market leadership",
    "Construction consulting",
    "Real estate consulting",
    "Owner's representation",
    "Capital planning",
  ],
};
