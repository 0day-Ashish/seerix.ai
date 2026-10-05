import Image from "next/image";
import Link from "next/link";

/** Topics a message can be about; each jumps to the form. */
const topics = ["Demo", "Pricing", "Security", "Agencies", "Partnerships"];

/**
 * The contact page's opener: one promise, one line under it, and the topics
 * as a row of chips -- left-aligned, so the routes below carry the weight.
 */
export function ContactOpener() {
  return (
    <section className="bg-white px-6 pb-12 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <h1 className="heading-mark max-w-3xl font-display text-[40px] font-medium leading-[1.05] tracking-[-0.035em] text-black sm:text-[56px]">
          Talk to the people building Seerix
        </h1>
        <p className="mt-4 max-w-2xl font-body text-[18px] leading-[1.55] text-zinc-500 sm:text-[20px]">
          A person reads every message. Replies within one business day.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">
            Topics
          </span>
          {topics.map((label) => (
            <Link
              key={label}
              href="#form"
              className="border border-black/[0.12] px-2.5 py-1.5 font-mono text-[12px] text-zinc-700 transition-colors hover:border-black/40 hover:text-black"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

type Route = {
  label: string;
  title: string;
  reply: string;
  summary: string;
  cta: { label: string; href: string };
  goodFor: string[];
};

const routes: Route[] = [
  {
    label: "Sales",
    title: "See it on your site",
    reply: "Same day",
    summary:
      "A half-hour walkthrough on a property you connect, not a canned demo account.",
    cta: { label: "Book a demo", href: "#form" },
    goodFor: [
      "Whether Seerix fits your sites",
      "Which plan covers your portfolio",
      "A first diagnosis on real data",
    ],
  },
  {
    label: "Team",
    title: "Email us directly",
    reply: "< 1 business day",
    summary:
      "The same inbox the form lands in. Reply straight into a thread you already have open.",
    cta: { label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" },
    goodFor: [
      "Questions about a diagnosis",
      "Billing and plan changes",
      "Anything that doesn't fit a form",
    ],
  },
  {
    label: "Security",
    title: "Security and data",
    reply: "Documented",
    summary:
      "What Seerix reads, what it stores and how to revoke it. Most of it is already written down.",
    cta: { label: "Read the privacy policy", href: "/privacy" },
    goodFor: [
      "Google permissions and scopes",
      "Data retention and deletion",
      "Questions for your security review",
    ],
  },
];

function Check() {
  return (
    <svg
      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-black"
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
 * The ways to reach the team, framed as one ruled grid. Each column opens on
 * a tinted card -- the first on the brand image -- with how fast it answers,
 * then the way in, then what it is good for. Subgrid rows keep every part
 * level across the three.
 */
export function ContactRoutes() {
  return (
    <section className="bg-white px-6 pb-24">
      <h2 className="heading-mark mx-auto mb-10 max-w-7xl font-display text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[44px]">
        Other ways to reach us
      </h2>
      <div className="mx-auto grid max-w-7xl border border-black/[0.12] lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr]">
        {routes.map((route, index) => {
          const lit = index === 0;
          return (
            <article
              key={route.label}
              className={`flex flex-col p-4 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-0 ${
                index > 0
                  ? "border-t border-black/[0.12] lg:border-l lg:border-t-0"
                  : ""
              }`}
            >
              <div
                className={`relative min-h-[13rem] overflow-hidden p-6 ${
                  lit ? "bg-[#2a2a30] text-white" : "bg-[#f3f2ef] text-black"
                }`}
              >
                {lit && (
                  <>
                    <Image
                      src="/assets/pricing.png"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover [transform:scaleY(-1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c21]/85 via-[#1c1c21]/30 to-transparent" />
                  </>
                )}
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                        lit ? "text-white/80" : "text-zinc-500"
                      }`}
                    >
                      {route.label}
                    </p>
                    <p
                      className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
                        lit ? "text-white/80" : "text-zinc-500"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      {route.reply}
                    </p>
                  </div>
                  <p className="mt-auto pt-10 font-display text-[30px] font-medium leading-[1.05] tracking-[-0.03em]">
                    {route.title}
                  </p>
                  <p
                    className={`mt-3 max-w-sm font-body text-[14px] leading-[1.55] ${
                      lit ? "text-white/85" : "text-zinc-600"
                    }`}
                  >
                    {route.summary}
                  </p>
                </div>
              </div>

              <Link
                href={route.cta.href}
                className="mt-4 flex h-11 items-center justify-center bg-[#141416] font-body text-[15px] font-medium text-white transition-colors hover:bg-[#36363B]"
              >
                {route.cta.label}
              </Link>

              <div className="mt-6 border-t border-black/[0.08] pt-6">
                <p className="font-body text-[14px] text-zinc-500">Good for:</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {route.goodFor.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check />
                      <span className="font-body text-[16px] leading-[1.5] text-black">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** What happens after the form is sent, as ruled rows. */
const steps = [
  {
    n: "01",
    title: "It lands with a person",
    body: "Messages go to the team inbox, not a ticket queue or a sales sequence.",
  },
  {
    n: "02",
    title: "You get a straight answer",
    body: "Usually the same day, always within one business day.",
  },
  {
    n: "03",
    title: "If it helps, we show you",
    body: "A short call on a property you connect, read-only, on your own data.",
  },
];

/**
 * The form beside a framed account of what happens once it is sent, so the
 * ask and the promise sit side by side.
 */
export function ContactFormBlock({ form }: { form: React.ReactNode }) {
  return (
    <section id="form" className="scroll-mt-28 bg-white px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {form}
          <div className="flex flex-col border border-black/[0.12]">
            <p className="border-b border-black/[0.12] bg-zinc-50 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.1em] text-zinc-500">
              What happens next
            </p>
            {steps.map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2 border-b border-black/[0.08] px-6 py-6 last:border-b-0"
              >
                <span className="font-mono text-[13px] text-signal-deep">
                  {step.n}
                </span>
                <div>
                  <p className="font-display text-[19px] tracking-[-0.01em] text-black">
                    {step.title}
                  </p>
                  <p className="mt-1.5 font-body text-[15px] leading-[1.55] text-zinc-500">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-auto border-t border-black/[0.12] bg-zinc-50 px-6 py-5">
              <p className="font-body text-[14px] text-zinc-500">
                Prefer email?{" "}
                <a
                  href="mailto:hello@seerix.ai"
                  className="text-black underline underline-offset-4 hover:text-signal-deep"
                >
                  hello@seerix.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
