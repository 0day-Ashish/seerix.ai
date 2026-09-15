import { PixelHover } from "@/components/new-landing/pixel-hover";
import Button, { ButtonArrow } from "@/components/new-landing/button";
import SectionHeader from "@/components/new-landing/section-header";

type Step = {
  /** Step ordinal shown above the title. */
  step: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    step: "01",
    title: "Connect Search Console",
    body: "One read-only Google sign-in pulls sixteen months of clicks, impressions, and rankings history, the ground truth for everything Seerix tells you. Nothing in your Google account is ever modified.",
  },
  {
    step: "02",
    title: "Seerix studies your site",
    body: "It crawls your pages, maps internal links, tracks the SERPs you compete in, watches competitors move, and checks every Google algorithm update against your timeline, continuously, in the background.",
  },
  {
    step: "03",
    title: "Ask anything. Get receipts.",
    body: "Traffic drops, page problems, what to write next, title rewrites. Every answer is a diagnosis assembled from your data, with the evidence pinned to it and an honest confidence score.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="How it works"
          heading="Connect once. Then just ask."
        />

        {/* Separate cards rather than one ruled table: the gaps carry the
            separation, so no internal hairlines are needed. */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-xl border border-black/[0.07] bg-white p-7 transition-colors duration-200 hover:border-black/[0.14]"
            >
              <PixelHover />
              <div className="relative z-10">
                <span className="font-body text-[13px] text-zinc-400">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-[19px] font-medium tracking-[-0.02em] text-black">
                  {item.title}
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button href="#features" variant="secondary" className="mt-10">
          Explore features
          <ButtonArrow />
        </Button>
      </div>
    </section>
  );
}
