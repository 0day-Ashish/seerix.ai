import Button, { ButtonArrow } from "@/components/new-landing/button";
import { BlockReveal } from "@/components/new-landing/block-reveal";
import HeroGlow from "@/components/new-landing/hero-glow";

export default function Cta() {
  return (
    <section
      id="demo"
      className="relative isolate overflow-hidden bg-ghost px-6 py-24 sm:py-32"
    >
      {/* The hero's glow, closing the page as it opened: centred behind the
          closing line and its buttons, breathing slowly. */}
      <HeroGlow className="inset-x-[-10%] top-1/2 h-[17rem] -translate-y-1/2 sm:inset-x-[8%] sm:h-[19rem]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
          <BlockReveal>Stop guessing why. Start knowing.</BlockReveal>
        </h2>

        <p className="mt-5 max-w-lg font-body text-[16px] leading-[1.6] text-zinc-600">
          Connect your Search Console and ask your first question. Works with
          Search Console alone &middot; No credit card &middot; Cancel anytime.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="#demo">
            See demo
            <ButtonArrow />
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
