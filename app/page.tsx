import Link from "next/link";
import { InquiryBand } from "@/components/InquiryBand";
import { SplitHero } from "@/components/SplitHero";
import { pageMetadata } from "@/lib/metadata";
import { founderFacts, media, practices, whyMicap } from "@/lib/site";

export const metadata = pageMetadata({
  title:
    "Micap LLC — Consulting for software, business, construction, and real estate",
  description:
    "Micap LLC is Jeffrey Milam’s consulting firm. Four divisions: software, business, construction, and real estate. Owner-side counsel, led directly.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <SplitHero
        eyebrow="Micap LLC"
        title={
          <>
            Four practices.
            <br />
            One standard of judgment.
          </>
        }
        lede="Micap is Jeffrey Milam’s consulting firm. Software, business, construction, and real estate — owner-side, and led by the person you hire."
        mediaKey="home"
      >
        <a
          href="#divisions"
          className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
        >
          The four divisions
        </a>
        <Link
          href="/contact/"
          className="inline-flex min-h-12 items-center border border-cream/30 px-5 text-sm font-semibold text-cream hover:border-cream"
        >
          Start a conversation
        </Link>
      </SplitHero>

      <section
        id="divisions"
        className="scroll-mt-20 mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Four divisions.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            Each practice is a way into the same firm. Start with the decision
            you actually have.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {practices.map((practice) => {
            const poster = media[practice.media];
            return (
              <li key={practice.slug} className="group relative border border-line bg-panel">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <img
                    src={poster.poster}
                    srcSet={poster.srcSet}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    alt=""
                    width={poster.width}
                    height={poster.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                    {practice.index}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink">
                    <Link
                      href={`/${practice.slug}/`}
                      className="after:absolute after:inset-0"
                    >
                      {practice.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
                    {practice.card}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-ink">
                    View the practice
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Why owners call Micap
          </h2>
          <ol className="mt-12 border-t border-line">
            {whyMicap.map((item) => (
              <li
                key={item.index}
                className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <p className="font-display text-2xl text-brass md:col-span-2">
                  {item.index}
                </p>
                <h3 className="font-display text-2xl font-medium text-ink md:col-span-3">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-muted md:col-span-7">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
              Founder
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Jeffrey Milam
            </h2>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
              Micap is organized around the work he has already done:
              construction management, capital programs, hands-on real estate,
              and software. The firm is the place those practices sit together.
            </p>
            <Link
              href="/about/"
              className="mt-8 inline-flex min-h-12 items-center border border-ink px-5 text-sm font-semibold text-ink hover:bg-ink hover:text-cream"
            >
              About the firm
            </Link>
          </div>
          <dl className="lg:col-span-7">
            {founderFacts.map((fact) => (
              <div key={fact.term} className="border-t border-line py-5">
                <dt className="text-sm font-semibold text-ink">{fact.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {fact.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <InquiryBand />
    </>
  );
}
