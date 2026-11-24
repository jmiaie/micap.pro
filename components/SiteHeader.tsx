"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { practices } from "@/lib/site";

const links = [
  ...practices.map((practice) => ({
    href: `/${practice.slug}/`,
    label: practice.nav,
  })),
  { href: "/about/", label: "About" },
];

function isCurrent(pathname: string, href: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return path === href;
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-page items-center justify-between gap-4 px-6 sm:px-10">
        <Link href="/" className="flex items-baseline gap-2 rounded-sm">
          <span className="font-display text-[1.45rem] font-medium leading-none tracking-tight text-ink">
            Micap
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-faint">
            LLC
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`text-sm font-medium ${
                  current ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact/"
            className="inline-flex min-h-11 items-center bg-ink px-4 text-sm font-medium text-cream hover:bg-ink/90"
          >
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line px-3 text-sm font-medium text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id={panelId}
          className="border-t border-line bg-bg px-6 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {links.map((link) => {
              const current = isCurrent(pathname, link.href);
              return (
                <li key={link.href} className="border-b border-line">
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className="flex min-h-12 items-center font-display text-2xl font-medium text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-5">
              <Link
                href="/contact/"
                className="inline-flex min-h-12 items-center bg-ink px-5 text-sm font-medium text-cream"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
