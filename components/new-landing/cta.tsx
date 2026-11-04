import { BlockReveal } from "@/components/new-landing/block-reveal";
import WaitlistForm from "@/components/new-landing/waitlist-form";

/**
 * The close: the one ask again, the same field and button as the hero. No
 * demo, contact or "cancel anytime" here -- each promises a flow that does
 * not exist until launch.
 */
export default function Cta() {
  return (
    <section
      id="join"
      className="relative bg-ghost px-6 py-20 sm:py-24"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-extralight tracking-[-0.03em] text-black">
          <BlockReveal>Stop guessing why. Start knowing.</BlockReveal>
        </h2>

        <p className="mt-5 max-w-lg font-body text-[16px] leading-[1.6] text-zinc-600">
          Join the waitlist and your first diagnosis lands on day one of
          launch: sixteen months of your own history, read-only, every claim
          cited.
        </p>

        <div className="mt-9 w-full">
          <WaitlistForm
            className="mx-auto text-left"
            note="no spam · one email when we launch · revoke access anytime"
          />
        </div>
      </div>
    </section>
  );
}
