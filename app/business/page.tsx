import { PracticeView } from "@/components/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { practiceBySlug } from "@/lib/site";

const practice = practiceBySlug.business;

export const metadata = pageMetadata({
  title: practice.title,
  description: practice.description,
  path: "/business/",
});

export default function BusinessPage() {
  return <PracticeView practice={practice} />;
}
