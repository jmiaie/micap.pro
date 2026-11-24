import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { practiceBySlug } from "@/lib/site";

const practice = practiceBySlug["real-estate"];

export const metadata = pageMetadata({
  title: practice.title,
  description: practice.description,
  path: "/real-estate/",
});

export default function RealEstatePage() {
  return (
    <PracticeView practice={practice}>
      <section className="border-y border-line">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Capital, acquisitions, value-add
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {[
            {
              title: "Capital",
              body: "What the work costs, when it has to be spent, and what can wait without damaging the asset.",
            },
            {
              title: "Acquisitions",
              body: "A read of basis and condition before the price becomes a plan you have to live with.",
            },
            {
              title: "Value-add",
              body: "Improvements scoped the way they will actually be built, including work done while a property is occupied.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-3xl font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>
    </PracticeView>
  );
}
