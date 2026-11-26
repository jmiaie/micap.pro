import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { practiceBySlug } from "@/lib/site";

const practice = practiceBySlug.construction;

const figures = [
  { value: "$3B+", label: "Class A+ portfolio, as owner’s representative" },
  { value: "$250M+", label: "Project size" },
  { value: "$25M+", label: "Annual spend" },
  { value: "3,600+", label: "Units in the program" },
  { value: "30+", label: "Commercial assets" },
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
            Scale of the work
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
            Owner’s-representative experience on a Class A+ portfolio of over
            $3 billion. Project size is over $250 million, with over $25
            million in annual spend. These figures describe practice
            capability. They are not a client roster.
          </p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
