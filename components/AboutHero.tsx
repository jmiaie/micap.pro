import { BlueprintStudy } from "@/components/effects/BlueprintStudy";
import { PracticeProof } from "@/components/PracticeProof";
import { CONTACT_EMAIL, media } from "@/lib/site";

/**
 * Dark ember field with one amber rake. The about ambient video stays off
 * so the hero does not stack a second motion layer on footage.
 */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative isolate overflow-hidden bg-[#120600] text-cream"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#2a0e06_0%,#120600_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_38%,rgba(255,138,31,0.5),rgba(255,61,0,0.16)_40%,transparent_68%)]" />
        <div
          className="absolute -left-[8%] -top-[35%] h-[170%] w-[72%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,138,31,0.04)_30%,rgba(255,214,170,0.62)_48%,rgba(255,80,16,0.22)_60%,transparent_78%)] blur-3xl motion-safe:animate-rake"
          style={{ transform: "translate3d(0, 0, 0) rotate(-18deg)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(98deg,rgba(10,4,0,0.94)_0%,rgba(12,4,0,0.82)_30%,rgba(16,6,0,0.42)_52%,rgba(16,6,0,0.08)_74%,transparent_100%)]" />
        <BlueprintStudy
          poster={media.about.poster}
          srcSet={media.about.srcSet}
          width={media.about.width}
          height={media.about.height}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-page flex-col justify-center px-6 py-16 sm:px-10 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-brass-soft motion-safe:animate-rise-1">
          The firm
        </p>
        <div
          className="mt-5 h-px w-12 bg-brass-soft motion-safe:animate-rise-1"
          aria-hidden="true"
        />
        <h1
          id="about-hero-title"
          className="mt-6 font-sans text-[clamp(2.35rem,6.2vw,5.35rem)] font-semibold leading-[0.92] tracking-[-0.035em] [text-shadow:0_6px_40px_rgba(0,0,0,0.45)] motion-safe:animate-rise-2"
        >
          We stay
          <br />
          with the
          <br />
          <em className="font-display text-[1.06em] font-normal italic tracking-[-0.02em]">
            engagement.
          </em>
        </h1>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-cream/80 sm:text-lg motion-safe:animate-rise-3">
          We advise clients who build, buy, and operate across markets. Five
          practices, one standard, and consultants who remain on the work.
        </p>
        <p className="mt-10 max-w-prose text-sm leading-relaxed text-cream/70 motion-safe:animate-rise-4">
          These figures describe practice capability. They are not a client
          roster.
        </p>
        <div className="mt-4">
          <PracticeProof layout="tiles" />
        </div>
        <p className="mt-8 motion-safe:animate-rise-5">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brass-soft underline decoration-brass-soft/40 underline-offset-4 hover:text-cream"
          >
            Write to {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
