import SectionHeader from "@/components/new-landing/section-header";
import {
  compareGroups,
  plans,
  type Cell,
} from "@/components/pricing/plans";

function Tick() {
  return (
    <>
      <svg
        className="mx-auto h-4 w-4 text-black"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 8.5l3.5 3.5L13 5" />
      </svg>
      <span className="sr-only">Included</span>
    </>
  );
}

function Dash() {
  return (
    <>
      <span
        aria-hidden="true"
        className="mx-auto block h-px w-3.5 bg-zinc-300"
      />
      <span className="sr-only">Not included</span>
    </>
  );
}

function Value({ value }: { value: Cell }) {
  if (value === true) return <Tick />;
  if (value === false) return <Dash />;
  return (
    <span className="font-body text-[14px] leading-snug text-zinc-600">
      {value}
    </span>
  );
}

/**
 * The full feature matrix. The label column is pinned so a row stays readable
 * once the plan columns scroll sideways on a narrow screen, and the header row
 * sticks under the navbar so plan names survive a long group.
 */
export default function PricingCompare() {
  return (
    <section id="compare" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Compare"
          heading="What actually changes between plans."
          lede="Every plan gives you the same evidence-cited diagnoses. What changes is how many sites you run, how much Seerix looks at, and how much of it you can hand to someone else."
        />

        {/* Scrolls horizontally rather than letting the table set a min-width
            wider than the phone it is being read on. `contain: paint` is what
            keeps the 720px table from widening the document itself: the sticky
            header row otherwise escapes the scroll container and counts toward
            the page's scroll width, so the whole page pans sideways. */}
        <div className="mt-10 overflow-x-auto contain-[paint]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Feature comparison across the Starter, Growth and Agency plans
            </caption>

            <thead>
              {/* Not sticky: the scroll container needs `contain: paint` to
                  stop the wide table widening the page on a phone, and that
                  containing block is exactly what a sticky row cannot escape.
                  Readability comes from the repeated group headings instead. */}
              <tr className="bg-white">
                <th
                  scope="col"
                  className="w-[34%] border-b border-black/[0.12] bg-white px-4 py-4 font-body text-[13px] font-medium text-zinc-400"
                >
                  Features
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className="border-b border-black/[0.12] bg-white px-4 py-4 text-center"
                  >
                    <span className="block font-display text-[16px] font-medium tracking-[-0.02em] text-black">
                      {plan.name}
                    </span>
                    <span className="mt-0.5 block font-body text-[13px] text-zinc-400">
                      {plan.price}
                      {plan.cadence}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* One tbody per group: the group heading is a row of its own so
                it scrolls with the rows it labels. */}
            {compareGroups.map((group) => (
              <tbody key={group.name}>
                {/* The group heading re-states the plan names beside it. The
                    header row cannot be sticky here (see the note above), so
                    without this the columns lose their labels partway down a
                    22-row table. */}
                <tr>
                  <th
                    scope="colgroup"
                    className="px-4 pb-3 pt-9 text-left font-body text-[13px] font-medium tracking-[0.02em] text-zinc-400"
                  >
                    {group.name}
                  </th>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      aria-hidden="true"
                      className="px-4 pb-3 pt-9 text-center font-body text-[12px] text-zinc-300"
                    >
                      {plan.name}
                    </td>
                  ))}
                </tr>

                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-black/[0.07]">
                    <th
                      scope="row"
                      className="px-4 py-4 text-left font-normal align-top"
                    >
                      <span className="block font-body text-[15px] leading-snug text-black">
                        {row.label}
                      </span>
                      {row.hint && (
                        <span className="mt-1 block max-w-xs font-body text-[13px] leading-[1.5] text-zinc-400">
                          {row.hint}
                        </span>
                      )}
                    </th>

                    {plans.map((plan) => (
                      <td
                        key={plan.id}
                        className="px-4 py-4 text-center align-top"
                      >
                        <Value value={row.values[plan.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
