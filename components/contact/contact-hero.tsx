import { BlockReveal } from "@/components/new-landing/block-reveal";
import LightStreaks from "@/components/new-landing/light-streaks";

/** The three reassurances under the lede, matching the pricing hero's run. */
const assurances = [
  "Replies within one business day",
  "A person, not a ticket queue",
  "No sales sequence",
];

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="h-1 w-1 shrink-0 rounded-full bg-zinc-300"
    />
  );
}

/**
 * Opener for the contact route. Same streak field and gradient as the landing
 * and pricing heroes, centred like pricing: the form below carries the weight,
 * so the headline has nothing to balance against.
 */
export default function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.07] bg-white px-6 pt-16 sm:pt-32">
      <LightStreaks count={64} />
      {/* Field stays populated behind the headline and clears before the form. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-60% to-white to-95%" />

      <div className="relative mx-auto max-w-3xl pb-16 text-center sm:pb-20">
        <h1 className="font-display text-[38px] font-medium leading-[1.07] tracking-[-0.035em] text-black sm:text-[52px]">
          <BlockReveal>Talk to the people who built it</BlockReveal>
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-[17px] leading-[1.6] text-zinc-500">
          Questions about what Seerix can see, whether it fits your portfolio,
          or what a diagnosis actually looks like on your site. Ask, and you
          will get a straight answer.
        </p>

        <ul className="mt-8 flex flex-col items-center justify-center gap-y-2 font-body text-[14px] text-zinc-400 sm:flex-row sm:gap-x-4">
          {assurances.map((item, index) => (
            <li key={item} className="flex items-center gap-4">
              {index > 0 && <Dot />}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
