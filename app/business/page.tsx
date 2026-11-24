import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { fractionalEngagements, practiceBySlug } from "@/lib/site";

const practice = practiceBySlug.business;

export const metadata = pageMetadata({
  title: "Business Consulting and Fractional Executive Services",
  description: practice.description,
  path: "/business/",
});

export default function BusinessPage() {
  return (
    <PracticeView practice={practice}>
      <section
        id="fractional-executive-services"
        className="scroll-mt-24 border-y border-line bg-bg"
      >
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
            Within the business practice
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Fractional Executive Services
          </h2>
          <p className="mt-4 max-w-prose font-medium leading-relaxed text-ink">
            Fractional C-suite leadership: CFO, COO, CTO, CAIO, CMO/GTM, and CXO.
          </p>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
            Our executives step into the seat and run it. The scope is a defined
            slice of leadership — finance, operations, technology, AI,
            go-to-market, or experience — for enterprise and growth-stage
            clients. The engagement has a cadence, a written brief, and an end.
          </p>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {fractionalEngagements.map((item) => (
              <li key={item.title} className="border-t border-line pt-6">
                <h3 className="font-display text-2xl font-medium text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PracticeView>
  );
}
