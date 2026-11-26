import Link from "next/link";
import { CinematicHero } from "@/components/effects/CinematicHero";
import { DivisionField } from "@/components/effects/DivisionField";
import { Object3D } from "@/components/effects/Object3D";
import { InquiryBand } from "@/components/InquiryBand";
import { homeEffect, shapeForPractice } from "@/lib/effects";
import { pageMetadata } from "@/lib/metadata";
import { firmCapabilities, media, practices, whyMicap } from "@/lib/site";

export const metadata = pageMetadata({
  title:
    "Micap LLC — Consulting for software, business, construction, and real estate",
  description:
    "Micap LLC is a multinational business and technology consultancy. Five practices: fractional executive services, software, business, construction, and real estate, for enterprise clients.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <CinematicHero
        effect={homeEffect}
        eyebrow="Micap LLC"
        title={
          <>
            Five practices.
            <br />
            One standard of judgment.
          </>
        }
        lede="Micap is a multinational business and technology consultancy. Fractional executive services, software, business, construction, and real estate for enterprise clients, with our practice leads on the work."
        media={media.home}
      >
        <a
          href="#divisions"
          className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
        >
          The five divisions
        </a>
        <Link
          href="/contact/"
          className="inline-flex min-h-12 items-center border border-cream/30 px-5 text-sm font-semibold text-cream hover:border-cream"
        >
          Start a conversation
        </Link>
      </CinematicHero>

      <section
        id="divisions"
        className="scroll-mt-20 mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Five divisions.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            Each practice is a way into the same firm. Start with the decision
            you actually have.
          </p>
        </div>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[5.5rem]">
              <DivisionField />
            </div>
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:col-span-7 lg:grid-cols-1">
          {practices.map((practice) => {
            const poster = media[practice.media];
            const shape = shapeForPractice(practice.slug);
            return (
              <li
                key={practice.slug}
                data-division-shape={shape}
                data-division-index={practice.index}
                data-division-title={practice.title}
                className="group relative border border-line bg-panel"
              >
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
                  <div className="pointer-events-none absolute bottom-3 right-3 h-[4.5rem] w-[4.5rem] border border-cream/25 bg-ink/60">
                    <Object3D
                      shape={shape}
                      palette="micap"
                      particleCount={420}
                    />
                  </div>
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
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Why clients call Micap
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
              The practice
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              What the firm brings
            </h2>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
              Five practices in one firm: fractional executive services,
              software, business, construction, and real estate. The figures
              below describe the scale of work our consultants draw on. They
              are not a client roster.
            </p>
            <Link
              href="/about/"
              className="mt-8 inline-flex min-h-12 items-center border border-ink px-5 text-sm font-semibold text-ink hover:bg-ink hover:text-cream"
            >
              About the firm
            </Link>
          </div>
          <dl className="lg:col-span-7">
            {firmCapabilities.map((fact) => (
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
