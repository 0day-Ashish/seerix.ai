import Button from "@/components/new-landing/button";


function Check() {
  return (
    <svg
      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-zinc-600"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

/**
 * How billing works, in one grey panel: the terms in three short lists. Every
 * line restates something the plans and FAQ already commit to.
 */
const columns = [
  {
    title: "Never billed",
    items: ["Crawls", "SERP snapshots", "Alerts", "The weekly report"],
  },
  {
    title: "Changing plans",
    items: [
      "Move up any time, prorated",
      "Move down at the next renewal",
      "Cancel anytime, no contract",
    ],
  },
  {
    title: "Your data",
    items: [
      "Read-only Google access",
      "Export your findings anytime",
      "Delete everything immediately",
    ],
  },
];

export function PricingBilling() {
  return (
    <section className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 frost rounded-[28px] p-8 sm:p-12 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-extralight tracking-[-0.03em] text-black">
            How billing works
          </h2>
          <p className="mt-4 max-w-sm font-body text-[16px] leading-[1.6] text-zinc-500">
            A flat monthly fee against the plan&rsquo;s allowances. A month that
            needs a lot of digging never turns into a surprise line item.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-body text-[15px] text-zinc-500">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {col.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check />
                  <span className="font-body text-[16px] leading-[1.45] text-black">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The closing line, centred, with the one action. */
export function PricingCloser() {
  return (
    <section className="relative bg-ghost px-6 py-20 text-center sm:py-24">
      <div className="relative">
        <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-extralight tracking-[-0.03em] text-black">
          SEO answers with receipts
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-[17px] leading-[1.6] text-zinc-500">
          Connect your Search Console and ask your first question. Plans from
          $39 a month.
        </p>
        <Button href="/#waitlist" className="mt-8 px-6 font-medium">
          Join waitlist
        </Button>
      </div>
    </section>
  );
}
