import Link from "next/link";

type PlanCardProps = {
  name: string;
  price: string;
  cadence: string;
  subtitle: string;
  features: string[];
  cta: string;
  href: string;
  /** Sets the icon and the "everything in X, plus" lead-in. */
  index?: number;
  featured?: boolean;
};

/** Seal-style tick: a filled rosette, as the reference has it. */
function Check() {
  return (
    <svg
      className="mt-[2px] h-4 w-4 shrink-0 text-[#1c1c21]"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" />
      <path
        d="M4.8 8.2l2.1 2.1 4.3-4.4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One icon per plan, stepping up with the tier: a single box, stacked layers,
 * then a rising chart. Chosen by position rather than stored on the plan, so
 * the shared data stays a description of the offer and not of its artwork.
 */
function PlanIcon({ index }: { index: number }) {
  const paths = [
    // Starter: one box.
    <path
      key="box"
      d="M8 2.6l5 2.9v5.8L8 14.2 3 11.3V5.5l5-2.9zM3 5.5l5 2.9 5-2.9M8 8.4v5.8"
    />,
    // Growth: stacked layers.
    <path key="layers" d="M8 2.4l5.6 3-5.6 3-5.6-3 5.6-3zM2.4 8.4l5.6 3 5.6-3M2.4 11l5.6 3 5.6-3" />,
    // Agency: a rising chart.
    <path key="bars" d="M3.4 12.8V8.2M8 12.8V3.6M12.6 12.8V6.4" />,
  ];

  return (
    <svg
      className="h-[18px] w-[18px] text-[#1c1c21]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[index] ?? paths[0]}
    </svg>
  );
}

/**
 * One plan, on the dark ground the rest of the page's panels use.
 *
 * The head -- icon, name, price and call to action -- sits in its own raised
 * inner panel, and the feature list runs below it on the card itself. The
 * featured plan fills that inner panel with a grey wash and carries a
 * rotated tab off its top-right corner.
 */
export default function PlanCard({
  name,
  price,
  cadence,
  subtitle,
  features,
  cta,
  href,
  index = 0,
  featured = false,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-[20px] p-2.5 ${
        featured
          ? "bg-zinc-50 ring-1 ring-black/[0.12]"
          : "bg-white ring-1 ring-black/[0.07]"
      }`}
    >
      {/* Tab, rotated off the corner so it reads as applied to the card. */}
      {featured && (
        <span className="absolute -top-3 right-5 z-10 rotate-[8deg] rounded-md bg-[#36363B] px-2.5 py-1 font-body text-[11px] font-semibold text-white shadow-[0_6px_14px_rgba(0,0,0,0.35)]">
          Popular
        </span>
      )}

      {/* The head panel: everything down to the call to action. */}
      <div
        className={`relative overflow-hidden rounded-[14px] p-6 ${
          featured
            ? "bg-[linear-gradient(150deg,#ececed_0%,#c9c7ca_38%,#dcdddd_72%,#b0aeb1_100%)]"
            : "bg-zinc-100/70"
        }`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-[11px] ${
            featured ? "bg-white/85" : "bg-white ring-1 ring-black/[0.06]"
          }`}
        >
          <PlanIcon index={index} />
        </span>

        <h3
          className={`mt-7 font-display text-[24px] font-semibold tracking-[-0.03em] ${
            featured ? "text-[#1c1c21]" : "text-black"
          }`}
        >
          {name}
        </h3>
        <p
          className={`mt-1 font-body text-[14px] ${
            featured ? "text-[#1c1c21]/70" : "text-zinc-500"
          }`}
        >
          {subtitle}
        </p>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5">
          <span
            className={`font-display text-[36px] font-semibold leading-none tracking-[-0.035em] ${
              featured ? "text-[#1c1c21]" : "text-black"
            }`}
          >
            {price}
          </span>
          <span
            className={`font-body text-[14px] ${
              featured ? "text-[#1c1c21]/60" : "text-zinc-400"
            }`}
          >
            {cadence}
          </span>
        </p>

        <Link
          href={href}
          className="mt-7 flex h-12 w-full items-center justify-center rounded-[10px] bg-[#1c1c21] font-body text-[15px] font-medium text-white shadow-[0_2px_0_rgba(0,0,0,0.18)] transition-colors duration-200 hover:bg-[#36363B]"
        >
          {cta}
        </Link>
      </div>

      {/* Features, on the card itself rather than inside the head panel. */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-7">
        {index > 0 && (
          <p className="mb-5 font-body text-[14px] font-medium text-black">
            Everything in {index === 1 ? "Starter" : "Growth"}, plus
          </p>
        )}

        <ul className="flex flex-col gap-3.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check />
              <span className="font-body text-[14px] leading-[1.5] text-zinc-600">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
