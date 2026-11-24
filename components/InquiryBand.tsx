import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

type Props = {
  title?: string;
  body?: string;
};

export function InquiryBand({
  title = "Tell us what you are deciding.",
  body = "A short note is enough. It goes directly to Jeffrey Milam.",
}: Props) {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/80">{body}</p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Link
            href="/contact/"
            className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
          >
            Start a conversation
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm font-medium text-brass-soft hover:text-cream"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
