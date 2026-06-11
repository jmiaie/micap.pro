const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#sectors", label: "Sectors" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  {
    title: "Project Management",
    body: "End-to-end delivery of complex projects — scope, schedule, budget, and risk managed with discipline from kickoff to closeout.",
  },
  {
    title: "Portfolio & Program Management",
    body: "Structure and oversight across multiple concurrent initiatives, so investment, sequencing, and resources stay aligned with strategy.",
  },
  {
    title: "Business Development",
    body: "Practical growth support: positioning, partnerships, and pipelines that turn capability into signed work.",
  },
  {
    title: "Optimization",
    body: "Process and operations review that removes friction, shortens cycles, and improves margins without disrupting delivery.",
  },
  {
    title: "Construction & Real Estate Consulting",
    body: "Owner-side advisory for acquisitions, development, and capital projects — from feasibility and budgeting through turnover.",
  },
  {
    title: "Owner & Property Advisory",
    body: "Guidance for business owners, homeowners, and property owners navigating projects, contractors, and major property decisions.",
  },
];

const SECTORS = [
  {
    name: "Sustainable Energy",
    body: "Delivery and advisory support for clean-energy projects and the teams building them.",
  },
  {
    name: "Construction",
    body: "Schedule, cost, and coordination discipline for projects in the built environment.",
  },
  {
    name: "Real Estate",
    body: "Owner-focused guidance across acquisition, development, and asset improvements.",
  },
  {
    name: "Technology",
    body: "Program structure and delivery rigor for software and infrastructure initiatives.",
  },
];

const CONTACT_EMAIL = "manager@micap.pro";
const CONTACT_PHONE = "(406) 426-9455";
const CONTACT_PHONE_HREF = "tel:+14064269455";

function Wordmark() {
  return (
    <a href="#top" className="flex items-baseline gap-2">
      <span className="font-display text-xl font-bold tracking-tightest text-ink">
        MICAP
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-subtle">
        LLC
      </span>
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />
        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 bg-grid-engineering bg-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <p className="animate-fade-in text-sm font-semibold uppercase tracking-widest text-accent">
          Project Management · Management Consulting
        </p>
        <h1 className="mt-4 max-w-3xl animate-fade-up font-display text-4xl font-bold tracking-tightest text-ink sm:text-6xl">
          Complex projects, delivered with discipline.
        </h1>
        <p className="mt-6 max-w-prose animate-fade-up text-lg leading-relaxed text-muted">
          Micap LLC is a bespoke, boutique consulting agency offering business
          development, optimization, and both portfolio and project management
          services throughout the sustainable energy, construction, real
          estate, and technology sectors.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Email {CONTACT_EMAIL}
          </a>
          <a
            href="#services"
            className="rounded-md border border-border bg-bg px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-subtle"
          >
            View services
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
          Services
        </h2>
        <p className="mt-4 max-w-prose text-muted">
          Professional project management and advisory services that help
          businesses, business owners, homeowners, and property owners achieve
          their goals.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sectors() {
  return (
    <section
      id="sectors"
      className="scroll-mt-16 border-y border-border bg-elevated py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
          Sectors
        </h2>
        <p className="mt-4 max-w-prose text-muted">
          Focused experience where capital projects and operations meet.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((sector) => (
            <div
              key={sector.name}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <div className="h-1 w-8 rounded bg-accent-2" />
              <h3 className="mt-4 font-display text-base font-semibold text-ink">
                {sector.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {sector.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:grid lg:grid-cols-3 lg:gap-12">
        <h2 className="font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
          About Micap
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-muted lg:col-span-2 lg:mt-0">
          <p>
            Micap is a boutique practice by design. Engagements are led
            directly by senior consultants — no hand-offs, no bench — so the
            judgment you hire is the judgment in the room.
          </p>
          <p>
            We work owner-side. Whether the initiative is a clean-energy
            build-out, a property development, or a technology program, our
            job is to protect your time, your budget, and your outcome — and
            to leave your team stronger than we found it.
          </p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-16 border-t border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
          Contact
        </h2>
        <p className="mt-4 max-w-prose text-muted">
          Tell us about your project. We typically respond within one business
          day.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-2xl">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-lg border border-border bg-bg p-6 transition-colors hover:border-accent"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle">
              Email
            </p>
            <p className="mt-2 font-medium text-accent">{CONTACT_EMAIL}</p>
          </a>
          <a
            href={CONTACT_PHONE_HREF}
            className="rounded-lg border border-border bg-bg p-6 transition-colors hover:border-accent"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle">
              Phone
            </p>
            <p className="mt-2 font-medium text-accent">{CONTACT_PHONE}</p>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-center">
        <Wordmark />
        <p className="text-sm text-subtle">
          © {new Date().getFullYear()} Micap LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main id="top">
      <Header />
      <Hero />
      <Services />
      <Sectors />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
