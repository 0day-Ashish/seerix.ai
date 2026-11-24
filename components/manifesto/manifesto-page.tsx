"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import GradientWash from "@/components/new-landing/gradient-wash";

/*
 * The manifesto, after the tokensupply site's: Seerix as a dictionary entry,
 * then a narrow reading column whose paragraphs come into focus as they
 * scroll in, four beliefs with one word in italics, and an ending on a
 * full-screen lilac field. Dots beside the column mark your place. One face
 * throughout (Google Sans Flex), nothing bold.
 */

const entry = {
  word: "seerix",
  sound: "/ˈsɪə.rɪks/",
  kind: "noun",
  meaning: "An analyst that reads your search data",
  reveal: "and tells you why.",
};

const parts: { title: string; paragraphs: string[] }[] = [
  {
    title: "Search tools show you what. Nobody tells you why.",
    paragraphs: [
      "Every SEO tool we used could draw a chart. Clicks down 38 percent. Position 4 to 11. Fifteen charts, each one correct, and not one of them saying why.",
      "So the work fell to us. Export the rows, line up the dates, check the update calendar, then guess. Change three things at once and never learn which one mattered.",
      "The people who could answer it properly charged $200 an hour, came once, and left a PDF.",
    ],
  },
  {
    title: "The data was never the problem.",
    paragraphs: [
      "Google Search Console already holds sixteen months of your history. The answer to most ranking questions is in there, in rows nobody has time to read.",
      "What was missing was an analyst: someone who reads all of it, every day, rules causes out one by one, and only then says what happened.",
    ],
  },
  {
    title: "So we are building one.",
    paragraphs: [
      "Seerix connects read-only to your Search Console, crawls your pages, snapshots the results page, and answers in a sentence you can act on. It means:",
    ],
  },
];

const beliefs: { before: string; em: string; after: string; because: string }[] = [
  {
    before: "An answer is only as good as its ",
    em: "receipts",
    after: ".",
    because: "Every claim cites the rows it was built from, or it is not made.",
  },
  {
    before: "Ruling a cause out is as ",
    em: "useful",
    after: " as finding one.",
    because:
      "Demand, ranking and click-through are tested separately before anything is blamed.",
  },
  {
    before: "Confidence should be ",
    em: "earned",
    after: ", not performed.",
    because: "Thin evidence lowers the score, and Seerix says so out loud.",
  },
  {
    before: "Your data stays ",
    em: "yours",
    after: ".",
    because:
      "Read-only access, never sold, never shared, never used to train a model. Revoke it any time.",
  },
];

const close = {
  title: "What we want for you",
  paragraphs: [
    "Less time guessing. Fewer changes shipped on a hunch. A Monday morning where the question is what to fix, not what happened.",
    "We are launching soon. If that sounds like the analyst you wanted, the waitlist is one email.",
  ],
  sign: "The Seerix team",
};

const BODY =
  "text-pretty font-flex text-[18px] leading-[29px] tracking-[-0.005em] text-zinc-800 md:text-[20px] md:leading-[32px]";
const TITLE =
  "text-balance font-flex text-[20px] font-normal leading-7 tracking-[-0.02em] text-black md:text-[24px] md:leading-8";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** True once the element has scrolled into view (once). */
function useSeen<T extends Element>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, seen };
}

/** Comes into focus, from a soft blur, as it scrolls in. */
function focusClass(seen: boolean) {
  return `transition-[opacity,filter] duration-700 motion-reduce:transition-none ${EASE} ${
    seen
      ? "opacity-100 blur-none"
      : "opacity-15 blur-[5px] motion-reduce:opacity-100 motion-reduce:blur-none"
  }`;
}

function Para({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, seen } = useSeen<HTMLParagraphElement>();
  return (
    <p ref={ref} className={`${focusClass(seen)} ${className}`}>
      {children}
    </p>
  );
}

/** The opening: Seerix as a dictionary entry, its meaning arriving last. */
function Entry() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className={`transition-[opacity,translate] duration-700 motion-reduce:transition-none ${EASE} ${
        on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <p className="font-flex text-[13px] leading-5 text-zinc-500 md:text-[14px]">
        Our manifesto
      </p>
      <h1 className="mt-10 font-flex text-[24px] leading-[34px] tracking-[-0.025em] text-black md:mt-14 md:text-[34px] md:leading-[44px] lg:text-[40px] lg:leading-[52px]">
        <span className="block">
          <span className="font-normal">{entry.word}</span>{" "}
          <span className="whitespace-nowrap font-normal tracking-[-0.01em] text-zinc-600">
            {entry.sound} <em className="italic">{entry.kind}</em>
          </span>
        </span>
        <span className="block font-normal">{entry.meaning}</span>
        <span
          className={`block font-normal transition-[opacity,filter] delay-[800ms] duration-[1400ms] motion-reduce:transition-none ${EASE} ${
            on ? "opacity-100 blur-none" : "opacity-0 blur-[14px]"
          }`}
        >
          {entry.reveal}
        </span>
      </h1>
    </div>
  );
}

function Belief({ b }: { b: (typeof beliefs)[number] }) {
  const { ref, seen } = useSeen<HTMLLIElement>();
  return (
    <li ref={ref} className={focusClass(seen)}>
      <p className="text-pretty font-flex text-[20px] leading-[30px] text-black md:text-[22px] md:leading-[32px]">
        {b.before}
        <em className="italic text-signal-deep">{b.em}</em>
        {b.after}
      </p>
      <p className="mt-1 text-pretty font-flex text-[16px] leading-[26px] text-zinc-500 md:text-[17px] md:leading-[27px]">
        {b.because}
      </p>
    </li>
  );
}

/** Which part sits at the middle of the screen, and whether the column is in view. */
function useReading(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const column = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const middle = { rootMargin: "-50% 0px -50% 0px" };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries)
        if (e.isIntersecting) setActive(refs.current.indexOf(e.target as HTMLElement));
    }, middle);
    refs.current.forEach((el) => el && io.observe(el));
    const wrap = new IntersectionObserver(([e]) => setShown(e.isIntersecting), middle);
    if (column.current) wrap.observe(column.current);
    return () => {
      io.disconnect();
      wrap.disconnect();
    };
  }, [count]);
  const mark = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el;
  };
  return { column, mark, active, shown };
}

export default function ManifestoPage() {
  const count = parts.length + 1;
  const { column, mark, active, shown } = useReading(count);
  const { ref: endRef, seen: endSeen } = useSeen<HTMLDivElement>(
    "0px 0px -20% 0px",
  );
  const field = useRef<HTMLDivElement>(null);
  const endSection = useRef<HTMLElement>(null);

  // The field, pinned behind the page: a glow along the bottom while you
  // read, drifting up a little as you go, then rising to fill the screen as
  // the ending scrolls in. Written straight to the style on each frame.
  useEffect(() => {
    let raf = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const frame = () => {
      raf = 0;
      const el = field.current;
      const end = endSection.current;
      if (!el || !end) return;
      const vh = window.innerHeight;
      const top = end.getBoundingClientRect().top;
      // 0 while the ending is below the screen, 1 once it fills it.
      const rise = clamp((vh - top) / vh);
      // How far through the reading column, for the slow drift.
      const read = clamp(window.scrollY / Math.max(1, end.offsetTop - vh));
      const base = 90 - 6 * read;
      el.style.transform = `translate3d(0, ${base * (1 - rise)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative font-flex">
      {/* The lilac field, fixed behind everything, faded at its top edge. */}
      <div
        ref={field}
        aria-hidden="true"
        // Positioned from script only: a Tailwind translate class would
        // stack with the transform written on scroll.
        style={{ transform: "translate3d(0, 90%, 0)" }}
        className="pointer-events-none fixed inset-0 z-0 will-change-transform [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_18%)] [mask-image:linear-gradient(to_bottom,transparent,black_18%)]"
      >
        <GradientWash />
      </div>
      <div className="relative z-10 px-6 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-[640px]">
          <Entry />

          <div ref={column} className="mt-24 md:mt-28">
            {parts.map((part, i) => (
              <section
                key={part.title}
                ref={mark(i)}
                aria-labelledby={`part-${i}`}
                className={i > 0 ? "mt-20 md:mt-28" : ""}
              >
                <h2 id={`part-${i}`} className={TITLE}>
                  {part.title}
                </h2>
                <div className={`${BODY} mt-6 flex flex-col gap-4 md:mt-8 md:gap-5`}>
                  {part.paragraphs.map((p) => (
                    <Para key={p}>{p}</Para>
                  ))}
                </div>
                {/* The last part ends on "It means:", and the beliefs follow. */}
                {i === parts.length - 1 && (
                  <ul className="mt-10 flex flex-col gap-7 md:mt-12 md:gap-8">
                    {beliefs.map((b) => (
                      <Belief key={b.em} b={b} />
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section
              ref={mark(parts.length)}
              aria-labelledby="part-close"
              className="mt-20 md:mt-28"
            >
              <h2 id="part-close" className={TITLE}>
                {close.title}
              </h2>
              <div className={`${BODY} mt-6 flex flex-col gap-4 md:mt-8 md:gap-5`}>
                {close.paragraphs.map((p) => (
                  <Para key={p}>{p}</Para>
                ))}
              </div>
              <Para className="mt-10 font-flex text-[15px] leading-6 text-zinc-500">
                {close.sign}
              </Para>
            </section>
          </div>
        </div>
      </div>

      {/* The ending: by now the field has risen to fill the screen, and the
          closing words come into focus on it. */}
      <section
        ref={endSection}
        aria-label="Join the waitlist"
        className="relative z-10 flex min-h-dvh items-center justify-center px-6"
      >
        <div
          ref={endRef}
          className={`flex flex-col items-center text-center ${focusClass(endSeen)}`}
        >
          <p className="font-display text-[48px] font-extralight leading-[1.05] tracking-[-0.035em] text-black sm:text-[72px]">
            Stop guessing why.
            <br />
            Start knowing.
          </p>
          <div className="mt-10">
            <Button href="/#waitlist">
              Join waitlist
              <ButtonArrow />
            </Button>
          </div>
        </div>
      </section>

      {/* A dot for each part beside the column, filled once you reach it. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-[calc(50%-320px-72px)] top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2.5 transition-opacity duration-500 lg:flex ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      >
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`h-[9px] w-[9px] rounded-full border transition-colors duration-300 ${
              i <= active ? "border-transparent bg-signal/50" : "border-black/25 bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
