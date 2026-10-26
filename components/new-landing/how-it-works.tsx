/* -------------------------------------------------------------------------
 * How it works: the signals Seerix reads, drawn as one graph.
 *
 * Six looping paths cross at the centre, where the mark sits; a label is
 * pinned to each, and dots ride the paths continuously so the whole field
 * reads as data flowing inward. One picture in place of three illustrated
 * steps -- the claim is that everything converges on one place, which a
 * graph states and a row of cards does not.
 *
 * Geometry is a fixed viewBox scaled by the browser, so the curves hold
 * their shape at any width. Dots are bound to the same path strings via
 * CSS `offset-path`, so a path and its dots cannot drift apart, and the
 * keyframe inherits the page's prefers-reduced-motion guard -- which an
 * SVG <animateMotion> would not.
 * ---------------------------------------------------------------------- */

import SeerixMark from "@/components/new-landing/seerix-mark";

/** The design space the graph is drawn in; it scales to fit. */
const W = 1144;
const H = 358;

/** The six crossing loops. */
const paths = [
  "M770.406 0.5C791.228 0.5 807.372 5.47482 819.89 14.4365C832.41 23.4002 841.346 36.3835 847.694 52.4746C860.401 84.6821 862.7 129.223 862.7 178.533C862.7 227.843 860.401 272.384 847.694 304.592C841.346 320.683 832.41 333.666 819.89 342.63C807.372 351.592 791.228 356.566 770.406 356.566C749.666 356.566 726.922 345.487 704.429 328.77C681.949 312.062 659.787 289.774 640.224 267.471C620.662 245.17 603.711 222.866 591.648 206.137C585.618 197.773 580.809 190.803 577.51 185.925C575.86 183.486 574.588 181.57 573.728 180.264C573.297 179.611 572.97 179.109 572.751 178.772C572.691 178.68 572.638 178.601 572.595 178.533C572.638 178.466 572.691 178.386 572.751 178.294C572.97 177.957 573.298 177.457 573.728 176.804C574.588 175.498 575.86 173.581 577.51 171.143C580.809 166.264 585.618 159.294 591.648 150.93C603.711 134.201 620.663 111.898 640.224 89.5967C659.787 67.293 681.948 45.0048 704.429 28.2969C726.922 11.5791 749.666 0.500167 770.406 0.5Z",
  "M635.773 0.5C642.187 0.5 647.284 5.25339 651.316 14.2344C655.341 23.1994 658.223 36.2134 660.27 52.3545C664.362 84.6264 665.1 129.229 665.1 178.533C665.1 227.838 664.362 272.441 660.27 304.713C658.223 320.854 655.341 333.867 651.316 342.832C647.284 351.813 642.187 356.566 635.773 356.566C634.236 356.566 632.62 355.928 630.928 354.661C629.235 353.394 627.494 351.518 625.72 349.1C622.172 344.263 618.543 337.328 614.93 328.973C607.705 312.266 600.579 289.975 594.289 267.664C588 245.358 582.55 223.049 578.672 206.316C576.733 197.95 575.188 190.979 574.127 186.099C573.596 183.659 573.187 181.741 572.91 180.435C572.772 179.781 572.666 179.281 572.596 178.943C572.56 178.775 572.534 178.646 572.517 178.561C572.515 178.551 572.513 178.542 572.511 178.533C572.513 178.525 572.515 178.516 572.517 178.506C572.534 178.42 572.56 178.292 572.596 178.123C572.666 177.786 572.772 177.285 572.91 176.632C573.187 175.325 573.596 173.408 574.127 170.968C575.188 166.088 576.733 159.116 578.672 150.75C582.55 134.017 588 111.709 594.289 89.4023C600.579 67.0917 607.705 44.801 614.93 28.0947C618.543 19.7387 622.171 12.8039 625.72 7.9668C627.494 5.5484 629.235 3.67273 630.928 2.40527C632.62 1.138 634.236 0.500041 635.773 0.5Z",
  "M961.728 0.5C1043.78 0.500013 1089.16 20.4672 1114.06 52.5977C1138.98 84.7587 1143.5 129.232 1143.5 178.533C1143.5 227.834 1138.98 272.308 1114.06 304.469C1089.16 336.599 1043.78 356.566 961.728 356.566C879.749 356.566 782.417 311.997 705.522 267.367C667.088 245.06 633.782 222.752 610.086 206.021C598.238 197.655 588.793 190.685 582.311 185.806C579.069 183.366 576.568 181.449 574.878 180.143C574.033 179.489 573.391 178.989 572.96 178.651C572.906 178.609 572.856 178.57 572.809 178.533C572.856 178.496 572.906 178.457 572.96 178.415C573.391 178.078 574.033 177.577 574.878 176.924C576.568 175.617 579.069 173.701 582.311 171.262C588.793 166.383 598.238 159.411 610.086 151.046C633.782 134.315 667.088 112.007 705.522 89.6992C782.417 45.0697 879.749 0.5 961.728 0.5Z",
  "M373.594 0.5C352.772 0.5 336.628 5.47482 324.11 14.4365C311.59 23.4002 302.654 36.3835 296.306 52.4746C283.599 84.6821 281.3 129.223 281.3 178.533C281.3 227.843 283.599 272.384 296.306 304.592C302.654 320.683 311.59 333.666 324.11 342.63C336.628 351.592 352.772 356.566 373.594 356.566C394.334 356.566 417.078 345.487 439.571 328.77C462.051 312.062 484.213 289.774 503.776 267.471C523.338 245.17 540.289 222.866 552.352 206.137C558.382 197.773 563.191 190.803 566.49 185.925C568.14 183.486 569.412 181.57 570.272 180.264C570.703 179.611 571.03 179.109 571.249 178.772C571.309 178.68 571.362 178.601 571.405 178.533C571.362 178.466 571.309 178.386 571.249 178.294C571.03 177.957 570.702 177.457 570.272 176.804C569.412 175.498 568.14 173.581 566.49 171.143C563.191 166.264 558.382 159.294 552.352 150.93C540.289 134.201 523.337 111.898 503.776 89.5967C484.213 67.293 462.052 45.0048 439.571 28.2969C417.078 11.5791 394.334 0.500167 373.594 0.5Z",
  "M508.227 0.5C501.813 0.5 496.716 5.25339 492.684 14.2344C488.659 23.1994 485.777 36.2134 483.73 52.3545C479.638 84.6264 478.9 129.229 478.9 178.533C478.9 227.838 479.638 272.441 483.73 304.713C485.777 320.854 488.659 333.867 492.684 342.832C496.716 351.813 501.813 356.566 508.227 356.566C509.764 356.566 511.38 355.928 513.072 354.661C514.765 353.394 516.506 351.518 518.28 349.1C521.828 344.263 525.457 337.328 529.07 328.973C536.295 312.266 543.421 289.975 549.711 267.664C556 245.358 561.45 223.049 565.328 206.316C567.267 197.95 568.812 190.979 569.873 186.099C570.404 183.659 570.813 181.741 571.09 180.435C571.228 179.781 571.334 179.281 571.404 178.943C571.44 178.775 571.466 178.646 571.483 178.561C571.485 178.551 571.487 178.542 571.489 178.533C571.487 178.525 571.485 178.516 571.483 178.506C571.466 178.42 571.44 178.292 571.404 178.123C571.334 177.786 571.228 177.285 571.09 176.632C570.813 175.325 570.404 173.408 569.873 170.968C568.812 166.088 567.267 159.116 565.328 150.75C561.45 134.017 556 111.709 549.711 89.4023C543.421 67.0917 536.295 44.801 529.07 28.0947C525.457 19.7387 521.829 12.8039 518.28 7.9668C516.506 5.5484 514.765 3.67273 513.072 2.40527C511.38 1.138 509.764 0.500041 508.227 0.5Z",
  "M182.272 0.5C100.217 0.500013 54.8392 20.4672 29.9395 52.5977C5.0161 84.7587 0.500008 129.232 0.5 178.533C0.5 227.834 5.01619 272.308 29.9395 304.469C54.8392 336.599 100.217 356.566 182.272 356.566C264.251 356.566 361.583 311.997 438.478 267.367C476.912 245.06 510.218 222.752 533.914 206.021C545.762 197.655 555.207 190.685 561.689 185.806C564.931 183.366 567.432 181.449 569.122 180.143C569.967 179.489 570.609 178.989 571.04 178.651C571.094 178.609 571.144 178.57 571.191 178.533C571.144 178.496 571.094 178.457 571.04 178.415C570.609 178.078 569.967 177.577 569.122 176.924C567.432 175.617 564.931 173.701 561.689 171.262C555.207 166.383 545.762 159.411 533.914 151.046C510.218 134.315 476.912 112.007 438.478 89.6992C361.583 45.0697 264.251 0.5 182.272 0.5Z",
];

/**
 * A label pinned to the graph. `path` says which curve it belongs to, and
 * the percentages place it in the design space.
 */
const labels: { text: string; x: number; y: number }[] = [
  { text: "commits", x: 4, y: 19 },
  { text: "tokens", x: 4, y: 81 },
  { text: "pull requests", x: 26, y: 50 },
  { text: "reviews", x: 73, y: 50 },
  { text: "deploys", x: 96, y: 19 },
  { text: "ai telemetry", x: 96, y: 81 },
];

/**
 * Dots are spread across the paths: each gets a few, set off at staggered
 * points so the field never pulses in unison.
 */
const dots = paths.flatMap((_, pathIndex) =>
  [0, 1, 2, 3, 4].map((n) => ({
    pathIndex,
    // Spread the start points, offset per path so the six do not march.
    delay: -(n * 4 + pathIndex * 1.7),
  })),
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ghost px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Heading left, lede right, as the reference sets them. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <p className="font-body text-[15px] text-signal-deep">
              One connection
            </p>
            <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.08] tracking-[-0.03em] text-black sm:text-[50px] lg:text-[56px]">
              Connect once.
              <br />
              Then just ask.
            </h2>
          </div>

          <p className="font-body text-[17px] leading-[1.6] text-zinc-600 lg:pt-10">
            Seerix reads your Search Console history, crawls your pages and
            tracks the results you compete in, then answers from all of it at
            once.
          </p>
        </div>

        {/* The graph. Decorative: every label is already named in the prose
            above, so nothing here is the only place a fact appears. */}
        <div
          aria-hidden="true"
          className="relative mt-16 hidden sm:mt-24 sm:block"
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full overflow-visible"
            fill="none"
          >
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-black/25"
              />
            ))}

            {dots.map((dot, i) => (
              <circle
                key={i}
                r="2"
                className="fill-signal [animation:seerix-travel-loop_22s_linear_infinite]"
                style={{
                  offsetPath: `path("${paths[dot.pathIndex]}")`,
                  animationDelay: `${dot.delay}s`,
                }}
              />
            ))}
          </svg>

          {/* Labels, placed as a share of the design space so they ride the
              curves at any width. */}
          {labels.map((l) => (
            <span
              key={l.text}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[13px] text-zinc-700 ring-1 ring-black/[0.08]"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
            >
              {l.text}
            </span>
          ))}

          {/* The centre: everything arrives here. */}
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-black/[0.08] lg:h-24 lg:w-24">
            <SeerixMark size={36} animated={false} />
          </span>
        </div>

        {/* Below sm the curves have no room: the signals stack as a list
            around the mark, as the reference does on a phone. */}
        <div className="mt-14 flex flex-col items-center gap-6 sm:hidden">
          <ul className="grid w-full grid-cols-2 gap-3">
            {labels.slice(0, 3).map((l) => (
              <li
                key={l.text}
                className="rounded-xl bg-zinc-100 px-2 py-3 text-center font-mono text-[13px] text-zinc-700 ring-1 ring-black/[0.08] last:col-span-2"
              >
                {l.text}
              </li>
            ))}
          </ul>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-black/[0.08]">
            <SeerixMark size={36} animated={false} />
          </span>
          <ul className="grid w-full grid-cols-2 gap-3">
            {labels.slice(3).map((l) => (
              <li
                key={l.text}
                className="rounded-xl bg-zinc-100 px-2 py-3 text-center font-mono text-[13px] text-zinc-700 ring-1 ring-black/[0.08] last:col-span-2"
              >
                {l.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
