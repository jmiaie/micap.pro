import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { practiceBySlug } from "@/lib/site";

const practice = practiceBySlug.software;

export const metadata = pageMetadata({
  title: practice.title,
  description: practice.description,
  path: "/software/",
});

export default function SoftwarePage() {
  return (
    <PracticeView practice={practice}>
      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-page gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass-soft">
              Sister firm
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Micap AI is the Software Lab.
            </h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-cream/80">
              Micap AI, at micap.ai, is the sister company and the AI
              engineering firm. Product builds, applied AI, and lab work live
              there. This division is the consulting side: what to build, how
              to structure it, and whether the plan in front of you is sound.
            </p>
          </div>
          <div className="lg:col-span-5">
            <a
              href="https://micap.ai"
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
            >
              Visit micap.ai
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-4 text-sm text-cream/70">
              Python, TypeScript, AWS, Terraform, Docker, Kubernetes,
              PostgreSQL.
            </p>
          </div>
        </div>
      </section>
    </PracticeView>
  );
}
