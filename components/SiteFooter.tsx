import Link from "next/link";
import { CONTACT_EMAIL, practices } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto grid max-w-page gap-10 px-6 py-14 sm:px-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl font-medium tracking-tight text-ink">
            Micap
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A boutique multinational consultancy. Software, business,
            construction, and real estate for enterprise clients.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-faint">
            Divisions
          </p>
          <ul className="mt-4 space-y-2">
            {practices.map((practice) => (
              <li key={practice.slug}>
                <Link
                  href={`/${practice.slug}/`}
                  className="text-sm font-medium text-ink hover:text-brass"
                >
                  {practice.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-faint">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-ink hover:text-brass"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <Link href="/about/" className="font-medium text-ink hover:text-brass">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact/"
                className="font-medium text-ink hover:text-brass"
              >
                Start a conversation
              </Link>
            </li>
            <li>
              <a
                href="https://micap.ai"
                className="font-medium text-ink hover:text-brass"
                rel="noopener noreferrer"
                target="_blank"
              >
                Micap AI
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-6 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} Micap LLC. All rights reserved.</p>
          <p>micap.pro</p>
        </div>
      </div>
    </footer>
  );
}
