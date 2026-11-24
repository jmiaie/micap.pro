import Link from "next/link";
import { pillars, type PillarSlug } from "@/lib/insights/pillars";

export function PillarNav({ active }: { active: PillarSlug | "all" }) {
  const items: { href: string; label: string; id: PillarSlug | "all" }[] = [
    { href: "/insights/", label: "All notes", id: "all" },
    ...pillars.map((pillar) => ({
      href: `/insights/${pillar.slug}/`,
      label: pillar.title,
      id: pillar.slug,
    })),
  ];

  return (
    <nav aria-label="Pillars">
      <p className="text-xs font-semibold uppercase tracking-eyebrow text-faint">
        Pillars
      </p>
      <ul className="mt-4 border-t border-line">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id} className="border-b border-line">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-12 items-center py-2 text-sm font-medium ${
                  current ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
