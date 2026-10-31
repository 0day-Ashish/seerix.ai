import MultiLineChart from "@/components/dashboard/multi-line-chart";

/** 1 Oct to 26 Oct, one point a day. */
const days = Array.from({ length: 26 }, (_, i) => `${i + 1} Oct`);

/**
 * A daily series that passes through the given anchor values, spread evenly
 * across the month, with a gentle eased step between them -- sample data,
 * but shaped like the real thing rather than a straight ramp.
 */
function series(anchors: number[]) {
  const span = (days.length - 1) / (anchors.length - 1);
  return days.map((_, i) => {
    const k = Math.min(Math.floor(i / span), anchors.length - 2);
    const t = (i - k * span) / span;
    const e = t * t * (3 - 2 * t);
    return Math.round(anchors[k] + (anchors[k + 1] - anchors[k]) * e);
  });
}

const sites = [
  { name: "arddev.in", color: "#5b4fd8", values: series([41, 44, 47, 46, 50, 53]) },
  { name: "pixelforge.dev", color: "#b06a1f", values: series([58, 57, 55, 52, 50, 49]) },
  { name: "buildstack.io", color: "#2f7d5b", values: series([34, 35, 33, 32, 33, 31]) },
];

const you = sites[0].values;

/**
 * Find your gaps: the claim on the left, and on the right the visibility
 * readout that proves it -- your share of tracked keywords on page one,
 * against the sites competing for them, a line each over the month.
 */
export default function FindGaps() {
  return (
    // Keeps the old section's id: the nav, footer and job links point here.
    <section id="how-it-works" className="bg-ghost px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
        <h2 className="font-display text-[34px] font-light leading-[1.15] tracking-[-0.02em] text-zinc-900 sm:text-[44px]">
          Find your gaps
          <span className="block text-zinc-400">
            See where competitors take page one from you, keyword by keyword.
          </span>
        </h2>

        <div className="min-w-0 lg:pt-12">
          <p className="font-body text-[17px] font-medium text-zinc-900">
            Visibility score
          </p>
          <p className="mt-1 font-body text-[14px] text-zinc-500">
            Share of tracked keywords where you rank on page one
          </p>
          <div className="mt-6">
            <MultiLineChart
              percent
              unit="page-one visibility"
              labels={days}
              series={sites}
              headline={{
                value: `${you[you.length - 1]}%`,
                delta: `${you[you.length - 1] - you[0]} pp`,
                up: you[you.length - 1] >= you[0],
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
