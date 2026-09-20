import { BlockReveal } from "@/components/new-landing/block-reveal";
import Button, { ButtonArrow } from "@/components/new-landing/button";
import LightStreaks from "@/components/new-landing/light-streaks";

/** The three reassurances that sit under the lede, as a quiet inline run. */
const assurances = [
  "No per-question overage",
  "Read-only Search Console access",
  "Cancel anytime",
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
 * Opener for the pricing route. Mirrors the landing hero's streak field and
 * gradient so the two pages read as one site, but centres its column: there is
 * no product panel here to balance a left-aligned headline against.
 */
export default function PricingHero() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.07] bg-white px-6 pt-16 sm:pt-32">
      <LightStreaks count={64} />
      {/* Matches the landing hero: the field stays populated behind the
          headline and clears before the cards begin. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-60% to-white to-95%" />

      <div className="relative mx-auto max-w-3xl pb-16 text-center sm:pb-20">
        <h1 className="font-display text-[38px] font-medium leading-[1.07] tracking-[-0.035em] text-black sm:text-[52px]">
          <BlockReveal>Pricing that scales with what you run</BlockReveal>
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-[17px] leading-[1.6] text-zinc-500">
          Start on one site that matters. Move up when you are answering for a
          portfolio. You pay for the plan, never for the evidence behind an
          answer.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="#demo">
            See demo
            <ButtonArrow />
          </Button>
          <Button href="#compare" variant="secondary">
            Compare plans
          </Button>
        </div>

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
