import { ContactForm } from "@/components/ContactForm";
import { SplitHero } from "@/components/SplitHero";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact Micap LLC at ${CONTACT_EMAIL} about software, business, construction, or real estate consulting.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <SplitHero
        eyebrow="Contact"
        title="Start with the decision."
        lede="Write to the firm. A few sentences on the asset, the project, or the system — and the question you need answered — are enough to begin."
        mediaKey="contact"
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
        >
          {CONTACT_EMAIL}
        </a>
      </SplitHero>

      <section className="mx-auto grid max-w-page gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
            Write directly
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            The address is{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-brass"
            >
              {CONTACT_EMAIL}
            </a>
            . The form composes that email in your own mail app. The site does
            not store the message and does not use a third-party form service.
          </p>
          <h3 className="mt-10 font-display text-2xl font-medium text-ink">
            Useful to include
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>Which division the question belongs to, if you know.</li>
            <li>The asset, project, or system, in a sentence.</li>
            <li>The decision you have to make, and when.</li>
            <li>Where the asset or the team sits. We advise enterprise clients across markets.</li>
          </ul>
        </div>
        <div className="border border-line bg-panel p-6 sm:p-8 lg:col-span-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
