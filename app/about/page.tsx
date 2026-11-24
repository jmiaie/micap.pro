import Link from "next/link";
import { InquiryBand } from "@/components/InquiryBand";
import { JsonLd } from "@/components/JsonLd";
import { SplitHero } from "@/components/SplitHero";
import { pageMetadata } from "@/lib/metadata";
import { founderFacts, practices } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Micap LLC and founder Jeffrey Milam. Construction management, capital programs, real estate, and software in one owner-side practice.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Jeffrey Milam",
          jobTitle: "Founder",
          worksFor: {
            "@type": "Organization",
            name: "Micap LLC",
            url: "https://micap.pro",
          },
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
          email: "jmilam@micap.pro",
          url: "https://micap.pro/about/",
        }}
      />
      <SplitHero
        eyebrow="The firm"
        title="The practice is the person you hire."
        lede="Micap LLC is Jeffrey Milam’s consulting firm. Four divisions, one owner-side standard, and no distance between the name on the engagement and the work."
        mediaKey="about"
      />

      <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink lg:col-span-4 sm:text-4xl">
            How the firm is organized
          </h2>
          <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted lg:col-span-8">
            <p>
              Micap is a single practice with four doors: software development
              and tech consulting, business consulting, construction
              consulting, and real estate consulting. The doors exist so an
              owner can start in the right place. The work often crosses them.
            </p>
            <p>
              Engagements are led by Jeffrey Milam. Software lab work and AI
              engineering sit with the sister firm,{" "}
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
              The record of the firm is the record of the founder. Education,
              the Equity Residential years, hands-on buying and selling, and
              the software stack are listed here because they are the
              experience the advice comes from. They are not a client list.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                Jeffrey Milam
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Founder, Micap LLC. Write to{" "}
                <a
                  className="font-medium text-brass"
                  href="mailto:jmilam@micap.pro"
                >
                  jmilam@micap.pro
                </a>
                .
              </p>
            </div>
            <dl className="lg:col-span-8">
              {founderFacts.map((fact) => (
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
          The four divisions
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
                <span className="mt-3 font-display text-2xl font-medium text-ink">
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
