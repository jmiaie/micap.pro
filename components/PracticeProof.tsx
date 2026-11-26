/**
 * Same four figures as the construction practice page.
 * Kept in this preview so the band does not edit lib/site.ts.
 */
export const practiceProof = [
  {
    value: "$3B",
    label: "Class A+ portfolio, as owner’s representative",
  },
  {
    value: "~$27M",
    label: "Capital programs a year",
  },
  {
    value: "3,600+",
    label: "Units in the program",
  },
  {
    value: "30",
    label: "Commercial assets",
  },
] as const;

const rise = [
  "motion-safe:animate-rise-2",
  "motion-safe:animate-rise-3",
  "motion-safe:animate-rise-4",
  "motion-safe:animate-rise-5",
] as const;

type Props = {
  layout: "tiles" | "stack";
};

export function PracticeProof({ layout }: Props) {
  return (
    <dl
      aria-label="Practice capability"
      className={
        layout === "tiles"
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
          : "flex flex-col gap-3"
      }
    >
      {practiceProof.map((item, index) => (
        <div
          key={item.value}
          className={`relative border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md ${
            index === 1
              ? "bg-[linear-gradient(155deg,rgba(140,42,8,0.55),rgba(32,12,4,0.48))]"
              : "bg-[rgba(48,18,6,0.46)]"
          } ${rise[index]} ${
            layout === "tiles"
              ? "flex min-h-[8.5rem] flex-col justify-between rounded-2xl p-4 sm:min-h-[9.25rem] sm:p-5"
              : "grid gap-2 rounded-2xl p-5 sm:grid-cols-12 sm:items-end sm:gap-6 sm:p-6"
          }`}
        >
          <span
            className="absolute right-4 top-3 font-sans text-sm text-white/40"
            aria-hidden="true"
          >
            *
          </span>
          <dt
            className={`font-sans font-medium leading-[1.05] tracking-[-0.03em] text-cream ${
              layout === "tiles"
                ? "text-[1.85rem] sm:text-[2rem]"
                : "text-[2.4rem] sm:col-span-4 sm:text-5xl"
            }`}
          >
            {item.value}
          </dt>
          <dd
            className={`text-sm leading-snug text-cream/80 ${
              layout === "tiles" ? "mt-6" : "sm:col-span-7 sm:mb-1"
            }`}
          >
            {item.label}
          </dd>
          <span
            className="absolute bottom-4 right-4 h-px w-3.5 bg-white/35"
            aria-hidden="true"
          />
        </div>
      ))}
    </dl>
  );
}
