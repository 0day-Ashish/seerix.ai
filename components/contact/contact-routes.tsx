import type { ReactNode } from "react";

import Button from "@/components/new-landing/button";

/**
 * The contact page's body, after the tokensupply site's: a short
 * introduction beside the form, then the other ways to reach the team as
 * three open items rather than boxes.
 */

function Info() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25v3.5M8 5.25h.01" />
    </svg>
  );
}

/** The introduction, sticky beside the form on wide screens. */
export function ContactIntro({ form }: { form: ReactNode }) {
  return (
    <section className="bg-ghost px-6 pb-24 pt-16 md:pt-20 lg:pb-32">
      <div className="mx-auto grid max-w-[1088px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex max-w-[560px] flex-col items-start gap-5 lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-zinc-500">
            Contact
          </p>
          <h1 className="text-balance font-display text-[40px] font-extralight leading-[1.08] tracking-[-0.03em] text-black md:text-[52px]">
            Talk to the people building Seerix
          </h1>
          <p className="font-body text-[16px] leading-[1.6] text-zinc-600 md:text-[17px]">
            Questions about what Seerix can see, whether it fits your sites, or
            what a diagnosis looks like on your own data. A person reads every
            message.
          </p>
          <p className="font-body text-[15px] text-zinc-600">
            Or email us at{" "}
            <a
              href="mailto:hello@seerix.ai"
              className="text-signal-deep hover:underline"
            >
              hello@seerix.ai
            </a>
          </p>
          <p className="mt-4 flex gap-2.5 border-t border-black/[0.08] pt-5 font-body text-[14px] leading-[1.6] text-zinc-600">
            <Info />
            <span>
              <span className="font-medium text-black">
                Replies within one business day.
              </span>{" "}
              Usually the same day, from the team that builds it, not a ticket
              queue.
            </span>
          </p>
        </div>

        <div id="form" className="min-w-0 scroll-mt-28">
          {form}
        </div>
      </div>
    </section>
  );
}

/** One way to reach the team: its mark, a heading, one line and its action. */
function Way({
  icon,
  title,
  body,
  action,
}: {
  icon: string;
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* The icon alone, large, in the brand violet. */}
      <svg
        className="h-12 w-12 text-signal-deep"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={icon} />
      </svg>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-body text-[18px] font-medium text-black md:text-[21px]">
          {title}
        </h3>
        <p className="mx-auto max-w-[340px] text-pretty font-body text-[15px] leading-[1.6] text-zinc-600">
          {body}
        </p>
      </div>
      <div>{action}</div>
    </div>
  );
}

export function ContactRoutes() {
  return (
    <section aria-labelledby="other-ways" className="bg-ghost px-6 pb-24 lg:pb-32">
      <div className="mx-auto flex max-w-[1088px] flex-col gap-12">
        <h2
          id="other-ways"
          className="text-balance font-display text-[32px] font-extralight leading-[1.15] tracking-[-0.03em] text-black md:text-[44px]"
        >
          Other ways to reach us
        </h2>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          <Way
            icon="M2.5 4.5h11v8h-11zM2.5 5l5.5 4 5.5-4"
            title="Email the team"
            body="The same inbox the form lands in. Reply straight into a thread you already have open."
            action={
              <a
                href="mailto:hello@seerix.ai"
                className="font-body text-[15px] text-signal-deep hover:underline"
              >
                hello@seerix.ai
              </a>
            }
          />
          <Way
            icon="M8 1.75v3M8 11.25v3M3.6 3.6l2.1 2.1M10.3 10.3l2.1 2.1M1.75 8h3M11.25 8h3"
            title="Join the waitlist"
            body="Seerix is pre-launch. Leave your email and get one message, the day it opens."
            action={<Button href="/#waitlist">Join waitlist</Button>}
          />
          <Way
            icon="M8 1.75l5 2v3.75c0 3-2.2 5-5 6.25-2.8-1.25-5-3.25-5-6.25V3.75l5-2zM6 8l1.5 1.5L10.5 6.5"
            title="Security and data"
            body="What Seerix reads, what it stores and how to revoke it, already written down."
            action={<Button href="/privacy">Read the policy</Button>}
          />
        </div>
      </div>
    </section>
  );
}
