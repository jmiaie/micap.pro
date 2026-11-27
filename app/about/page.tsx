import Link from "next/link";
import { InquiryBand } from "@/components/InquiryBand";
import { SplitHero } from "@/components/SplitHero";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL, firmCapabilities, practices } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Micap LLC is a multinational business and technology consultancy. Fractional executive services, software, business, construction, and real estate for enterprise clients.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <SplitHero
        eyebrow="The firm"
        title="A multinational business and technology consultancy for enterprise decisions."
        lede="Micap advises clients who build, buy, and operate across markets. Five practices, one standard, and consultants who stay with the engagement."
        mediaKey="about"
      />

      <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:col-span-4">
            How the firm is organized
          </h2>
          <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted lg:col-span-8">
            <p>
              Micap LLC is a multinational business and technology consultancy. We work with
              enterprise clients through five practices: fractional executive
              services, software development and tech consulting, business
              consulting, construction consulting, and real estate consulting.
              A client can start in
              one practice. The work often crosses them.
            </p>
            <p>
              Engagements are staffed with our consultants and practice leads.
              Software lab work and AI engineering sit with the sister firm,{" "}
              <a
                href="https://micap.ai"
                className="font-medium text-brass"
                rel="noopener noreferrer"
                target="_blank"
              >
                Micap AI
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              . Micap LLC is the consulting firm.
            </p>
            <p>
              We do not publish a client list or testimonials. The capability
              notes on this site describe the scale of work the practices draw
              on. They are not case studies and they are not a roster.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                Practice capability
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Write to{" "}
                <a
                  className="font-medium text-brass"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <dl className="lg:col-span-8">
              {firmCapabilities.map((fact) => (
                <div key={fact.term} className="border-t border-line py-5">
                  <dt className="text-sm font-semibold text-ink">{fact.term}</dt>
                  <dd className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                    {fact.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-20">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
          The five divisions
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {practices.map((practice) => (
            <li key={practice.slug}>
              <Link
                href={`/${practice.slug}/`}
                className="flex h-full flex-col border border-line p-6 hover:border-ink"
              >
                <span className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                  {practice.index}
                </span>
                <span className="mt-3 text-balance font-display text-2xl font-medium leading-tight text-ink">
                  {practice.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <InquiryBand />
    </>
  );
}
