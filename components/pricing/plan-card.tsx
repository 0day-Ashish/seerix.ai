import Button, { ButtonArrow } from "@/components/new-landing/button";

type PlanCardProps = {
  name: string;
  price: string;
  cadence: string;
  subtitle: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

/** Filled tick, matching the reference's solid check rather than an outline. */
function Check() {
  return (
    <svg
      className="mt-[1px] h-3.5 w-3.5 shrink-0 text-black"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="14" height="14" rx="3" />
      <path
        d="M4.5 8.25l2.25 2.25L11.5 5.75"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One plan, in the shape both pricing surfaces use: a bordered header block
 * carrying the name and description, the price on its own ruled line, the
 * feature list, then a CTA whose label and price sit either side of a rule.
 *
 * The featured plan tints its body and insets the header in white, so the
 * emphasis comes from the fill rather than from a heavier border.
 */
export default function PlanCard({
  name,
  price,
  cadence,
  subtitle,
  features,
  cta,
  href,
  featured = false,
}: PlanCardProps) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-3 transition-colors duration-200 ${
        featured
          ? "border-black/[0.10] bg-zinc-50 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          : "border-black/[0.07] bg-white hover:border-black/[0.14]"
      }`}
    >
      {/* Header block: its own bordered panel inside the card. */}
      <div
        className={`rounded-xl border p-5 ${
          featured ? "border-black/[0.06] bg-white" : "border-black/[0.07]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[26px] font-semibold tracking-[-0.03em] text-black">
            {name}
          </h3>
          {featured && (
            <span className="shrink-0 rounded-full bg-black px-2.5 py-1 font-body text-[11px] font-medium text-white">
              Popular
            </span>
          )}
        </div>

        <p className="mt-2.5 font-body text-[14px] leading-[1.6] text-zinc-500">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-2 pt-6">
        {/* Price, over a rule that stops short of the card's width. */}
        <p className="flex flex-wrap items-baseline gap-x-1.5 border-b border-black/[0.10] pb-4">
          <span className="font-display text-[17px] font-medium text-black">
            $
          </span>
          <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.03em] text-black">
            {price.replace(/^\$/, "")}
          </span>
          <span className="font-body text-[13px] text-zinc-400">
            {cadence}
          </span>
        </p>

        <ul className="mt-6 flex flex-1 flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check />
              <span className="font-body text-[14px] leading-[1.55] text-zinc-600">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* The shared Button, so a plan's call to action carries the same
            raised treatment as the ones in the navbar and hero. The featured
            plan takes the primary fill; the rest sit secondary. */}
        <Button
          href={href}
          variant={featured ? "primary" : "secondary"}
          className="mt-8 w-full"
        >
          {cta}
          <ButtonArrow />
        </Button>
      </div>
    </div>
  );
}
