import Link from "next/link";

import AgentWindow from "@/components/new-landing/agent-window";
import HeroActions, { SourceCycle } from "@/components/new-landing/hero-actions";

/**
 * The opener: an announcement strip under the nav, then one ruled frame
 * holding the headline on a dot grid and, beneath it, the product window on
 * the brand wash -- the job pills on top, the window running off the right
 * edge.
 */
export default function Hero() {
  return (
    <section className="bg-ghost">
      <p className="border-y border-black/[0.07] px-6 py-2.5 text-center font-body text-[13px] text-zinc-700 sm:text-[14px]">
        Introducing evidence-cited diagnoses{" "}
        <Link
          href="/pricing"
          className="whitespace-nowrap text-signal-deep hover:underline"
        >
          Read more &rarr;
        </Link>
      </p>

      <div className="px-4 pt-8 sm:px-6">
        <div className="mx-auto max-w-[82rem] overflow-hidden border border-black/[0.08]">
          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-14 md:px-16 md:py-16">
            {/* The dot grid, fading out toward the frame's edges. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_75%_80%_at_50%_45%,black_35%,transparent_95%)] [mask-image:radial-gradient(ellipse_75%_80%_at_50%_45%,black_35%,transparent_95%)]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(19,13,40,0.16) 1px, transparent 1.3px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "center",
              }}
            />

            <div className="relative flex flex-col items-center">
              <h1 className="max-w-5xl font-display text-[36px] font-light leading-[1.15] tracking-[-0.02em] text-zinc-900 sm:text-[48px] md:text-[60px] md:leading-[1.2]">
                The Search Console platform that explains why
              </h1>
              <p className="mt-4 font-body text-[16px] font-light text-zinc-600 sm:text-[18px]">
                Answers cited from <SourceCycle />
              </p>
              <div className="mt-8 w-full">
                <HeroActions />
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.08]">
            <AgentWindow />
          </div>
        </div>
      </div>
    </section>
  );
}
