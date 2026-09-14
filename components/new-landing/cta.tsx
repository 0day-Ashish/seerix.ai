import Button, { ButtonArrow } from "@/components/new-landing/button";
import { BlockReveal } from "@/components/new-landing/block-reveal";

export default function Cta() {
  return (
    <section id="demo" className="bg-white px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
          <BlockReveal>Stop guessing why. Start knowing.</BlockReveal>
        </h2>

        <p className="mt-5 max-w-lg font-body text-[16px] leading-[1.6] text-zinc-500">
          Connect your Search Console and ask your first question. Works with
          Search Console alone &middot; No credit card &middot; Cancel anytime.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="#demo">
            See demo
            <ButtonArrow />
          </Button>
          <Button href="mailto:hello@seerix.ai" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
