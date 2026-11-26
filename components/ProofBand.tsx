import Link from "next/link";
import { PracticeProof } from "@/components/PracticeProof";

export function ProofBand() {
  return (
    <section
      aria-labelledby="proof-band-title"
      className="relative isolate overflow-hidden border-t border-white/10 bg-[#140700] text-cream"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_50%,rgba(255,138,31,0.28),transparent_58%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,150,50,0.1),transparent)]" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-page gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-4 motion-safe:animate-rise-1">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-brass-soft">
            Practice capability
          </p>
          <h2
            id="proof-band-title"
            className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl"
          >
            The scale we draw on
          </h2>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-cream/75">
            These figures describe practice capability. They are not a client
            roster.
          </p>
          <Link
            href="/construction/"
            className="mt-8 inline-flex min-h-12 items-center text-sm font-semibold text-brass-soft underline decoration-brass-soft/40 underline-offset-4 hover:text-cream"
          >
            Construction consulting
          </Link>
        </div>
        <div className="lg:col-span-8">
          <PracticeProof layout="stack" />
        </div>
      </div>
    </section>
  );
}
