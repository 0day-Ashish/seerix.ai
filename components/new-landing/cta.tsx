import Button, { ButtonArrow } from "@/components/new-landing/button";
import { BlockReveal } from "@/components/new-landing/block-reveal";
import ScanField from "@/components/new-landing/scan-field";

export default function Cta() {
  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-white px-6 py-24 sm:py-32"
    >
      {/* The scan field behind the closing line, fading out at every edge
          so it reads as ground rather than a panel. */}
      <div className="pointer-events-none absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]">
        <ScanField
          tone="light"
          cell={14}
          strength={0.12}
          findings={3}
          scanLine={false}
          sweep={8}
        />
      </div>
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
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
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
