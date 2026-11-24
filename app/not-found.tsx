import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-page flex-col justify-center px-6 py-24 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-ink">
        This page is not on the site.
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
        The address may be out of date. The five divisions, the firm, and
        contact are linked below.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center bg-ink px-5 text-sm font-semibold text-cream"
        >
          Back to Micap
        </Link>
        <Link
          href="/contact/"
          className="inline-flex min-h-12 items-center border border-ink px-5 text-sm font-semibold text-ink"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
