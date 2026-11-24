import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { practiceBySlug } from "@/lib/site";

const practice = practiceBySlug.construction;

const figures = [
  { value: "$3B", label: "Class A+ portfolio, as owner’s representative" },
  { value: "~$27M", label: "Capital programs a year" },
  { value: "3,600+", label: "Units in the program" },
  { value: "30", label: "Commercial assets" },
];

export const metadata = pageMetadata({
  title: practice.title,
  description: practice.description,
  path: "/construction/",
});

export default function ConstructionPage() {
  return (
    <PracticeView practice={practice}>
      <section className="border-y border-line bg-bg">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Equity Residential, 2015–2019
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
            These figures describe Jeffrey Milam’s role as Technical Program
            Manager and Senior Construction Services Manager / CapEx Product
            Owner. They are historical. They are not Micap client results.
          </p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.value} className="border-t border-line pt-4">
                <dt className="font-display text-4xl font-medium text-ink">
                  {figure.value}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {figure.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PracticeView>
  );
}
