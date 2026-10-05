import Image from "next/image";
import Link from "next/link";

/* -------------------------------------------------------------------------
 * Panel overlays: the product UI floating on each step's image.
 * ---------------------------------------------------------------------- */

/**
 * Points on a sphere for the first panel -- the history arriving as a globe
 * of data turning sideways. A Fibonacci lattice spreads them evenly; values
 * are rounded so server and client render the same markup.
 */
const DOTS = 360;
const points = Array.from({ length: DOTS }, (_, i) => {
  const lat = Math.asin(1 - (2 * (i + 0.5)) / DOTS);
  const lon = i * 137.508;
  return {
    lat: Math.round(((lat * 180) / Math.PI) * 100) / 100,
    lon: Math.round((lon % 360) * 100) / 100,
    s: [1, 1.5, 2][i % 3],
    o: Math.round((0.45 + ((i * 13) % 10) / 18) * 100) / 100,
  };
});

/** Step 01: sixteen months of Search Console data, arriving. */
function ConnectPanel() {
  const tags = [
    { label: "CLICKS", x: "54%", y: "24%" },
    { label: "IMPRESSIONS", x: "16%", y: "46%" },
    { label: "POSITIONS", x: "58%", y: "62%" },
    { label: "16 MONTHS", x: "12%", y: "78%" },
  ];
  return (
    <>
      {/* A globe of points turning sideways about its vertical axis while
          the labels hold still. The tilt sits on the outer layer and the
          spin on the inner one: the keyframe sets transform, which would
          otherwise overwrite the tilt. Points on the far side show through,
          which is what gives the turn its depth. */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:900px]">
        <div className="[transform-style:preserve-3d] [transform:rotateX(-14deg)_rotateZ(-8deg)]">
          <div
            className="relative h-0 w-0 [transform-style:preserve-3d]"
            style={{ animation: "seerix-spin-y 28s linear infinite" }}
          >
            {points.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: p.s,
                  height: p.s,
                  marginLeft: -p.s / 2,
                  marginTop: -p.s / 2,
                  opacity: p.o,
                  transform: `rotateY(${p.lon}deg) rotateX(${p.lat}deg) translateZ(150px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* The labels arrive one by one out of a blur, hold together, then
          clear and start again -- each on the same loop, staggered. */}
      {tags.map((t, i) => (
        <span
          key={t.label}
          className="absolute bg-[#141416] px-2.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-white"
          style={{
            left: t.x,
            top: t.y,
            animation: `seerix-blur-reveal 9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.7}s infinite both`,
          }}
        >
          {t.label}
        </span>
      ))}
    </>
  );
}

/** Step 02: a crawled page, with what changed on it highlighted. */
function StudyPanel() {
  const mark = " bg-signal-soft px-0.5 text-[#7a2a08]";
  return (
    <>
      <div className="absolute inset-x-[6%] top-[14%] bg-white p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-6">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-zinc-500">
          <span className="h-2 w-2 bg-signal" />3 CHANGES FOUND
        </p>
        <p className="mt-3 font-display text-[22px] tracking-[-0.02em] text-black">
          acme.com/pricing
        </p>
        <p className="mt-2 font-body text-[14px] leading-[1.75] text-zinc-500">
          <span className={mark}>Pricing &ndash; Acme</span> was the page title
          until 2 Apr. Plans start at $29 a month, with{" "}
          <span className={mark}>annual billing</span> now the default and the
          comparison table moved below the fold. Three internal links from the
          blog were <span className={mark}>removed</span> in the same release.
        </p>
      </div>
      <span className="absolute bottom-[7%] left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#141416] px-4 py-2.5 font-mono text-[12px] tracking-[0.12em] text-white">
        LAST CRAWL: 14 MIN AGO
      </span>
    </>
  );
}

/** Step 03: the question, and the structured diagnosis it returns. */
function AskPanel() {
  return (
    <>
      <div className="absolute inset-x-[6%] top-[8%] flex items-center bg-white px-4 py-3 font-body text-[14px] text-black">
        <span className="truncate">
          Why did /pricing lose traffic last week?
        </span>
        <span className="ml-0.5 inline-block h-4 w-[2px] shrink-0 animate-pulse bg-black" />
      </div>
      <pre className="absolute inset-x-[6%] bottom-[8%] top-[22%] overflow-hidden bg-black p-5 font-mono text-[12px] leading-[1.65] text-white/90">
        {`"diagnosis": {
  "cause": "title_rewrite",
  "changed": "2026-04-02",
  "ruled_out": [
    "core_update",
    "demand_drop"
  ],
  "evidence": [
    { "gsc": "clicks -38%" },
    { "serp": "position 4 -> 11" },
    { "crawl": "title changed" }
  ],
  `}
        <span className="text-signal">{`"confidence": 0.82`}</span>
        {`
}`}
      </pre>
    </>
  );
}

/* -------------------------------------------------------------------------
 * Content
 * ---------------------------------------------------------------------- */

type Step = {
  title: string;
  body: string;
  cta: { label: string; href: string };
  /** The image behind the panel's UI. */
  image: string;
  /** Extra classes on the image, e.g. to flip it. */
  imageClass?: string;
  panel: React.ReactNode;
};

const steps: Step[] = [
  {
    title: "The history your diagnosis needs",
    body: "One read-only sign-in pulls sixteen months of clicks, impressions and rankings, so the first answer lands on day one.",
    cta: { label: "Connect Search Console", href: "#demo" },
    image: "/assets/Silver mist-2048x1428.png",
    imageClass: "[transform:scaleX(-1)]",
    panel: <ConnectPanel />,
  },
  {
    title: "Your site, studied continuously",
    body: "Seerix crawls your pages, tracks the SERPs you compete in and flags what changed, while you do other work.",
    cta: { label: "See what it tracks", href: "#features" },
    image: "/assets/pricing.png",
    imageClass: "[transform:scaleY(-1)]",
    panel: <StudyPanel />,
  },
  {
    title: "A diagnosis, not a dashboard",
    body: "Ask in plain language and get a structured answer with the cause, the evidence and an honest confidence score.",
    cta: { label: "Ask your first question", href: "#demo" },
    image: "/assets/Silver mist-2048x1428.png",
    imageClass: "[transform:scaleY(-1)]",
    panel: <AskPanel />,
  },
];

/**
 * Facts, not testimonials: the row under the steps states three things the
 * product guarantees, in place of customer quotes Seerix doesn't have yet.
 */
const facts = [
  {
    label: "READ-ONLY",
    body: "Seerix never requests write access. Nothing in your Google account can be changed.",
  },
  {
    label: "16 MONTHS",
    body: "of Search Console history pulled on the first sign-in, so answers start with context.",
  },
  {
    label: "EVERY CLAIM CITED",
    body: "Answers that cite evidence that doesn't exist are rejected before you see them.",
  },
];

/**
 * Three steps as three panels, each a piece of the product on an image, with
 * its copy and a way in underneath. A row of guarantees closes the section.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[50px] lg:text-[56px]">
            Connect once. Then just ask.
          </h2>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {steps.map((step) => (
            <article key={step.title} className="flex min-w-0 flex-col">
              <div
                aria-hidden="true"
                className="relative aspect-[5/6] overflow-hidden bg-[#2a2a30]"
              >
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={`object-cover ${step.imageClass ?? ""}`}
                />
                {step.panel}
              </div>

              <h3 className="mt-8 font-display text-[24px] font-medium leading-snug tracking-[-0.02em] text-black">
                {step.title}
              </h3>
              <p className="mt-3 font-body text-[17px] leading-[1.6] text-zinc-500">
                {step.body}
              </p>
              <div className="mt-6 flex-1" />
              <Link
                href={step.cta.href}
                className="group inline-flex w-fit items-center gap-2 bg-zinc-100 px-5 py-3 font-body text-[16px] text-black transition-colors duration-200 hover:bg-zinc-200"
              >
                {step.cta.label}
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-8 lg:gap-10">
          {facts.map((fact) => (
            <div key={fact.label} className="border border-black/[0.12] p-6">
              <p className="flex items-center gap-2 font-mono text-[13px] tracking-[0.08em] text-black">
                <span className="h-2 w-2 bg-signal" />
                {fact.label}
              </p>
              <p className="mt-3 font-body text-[16px] leading-[1.55] text-zinc-600">
                {fact.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
