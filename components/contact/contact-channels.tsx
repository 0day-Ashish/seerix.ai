import Link from "next/link";

type Channel = {
  title: string;
  body: string;
  action: { label: string; href: string };
};

/**
 * The routes that are faster than the form. Listed beside it rather than under
 * it, so someone who already knows what they want never reads the form first.
 */
const channels: Channel[] = [
  {
    title: "Email us",
    body: "The same inbox the form lands in. Reply straight to a thread you already have open.",
    action: { label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" },
  },
  {
    title: "See it on your own data",
    body: "A walkthrough on a property you connect, not a canned demo site. Half an hour, no deck.",
    action: { label: "Book a demo", href: "/#demo" },
  },
  {
    title: "Security and data handling",
    body: "What Seerix reads, what it stores, and how to revoke it. Most of it is already written down.",
    action: { label: "Read the privacy policy", href: "/privacy" },
  },
];

function Arrow() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5L10.5 8L6 12.5" />
    </svg>
  );
}

export default function ContactChannels() {
  return (
    <div className="flex flex-col gap-4">
      {channels.map((channel) => (
        <div
          key={channel.title}
          className="rounded-xl border border-black/[0.07] bg-white p-6 transition-colors duration-200 hover:border-black/[0.14]"
        >
          <h2 className="font-display text-[17px] font-medium tracking-[-0.02em] text-black">
            {channel.title}
          </h2>
          <p className="mt-2 font-body text-[15px] leading-[1.65] text-zinc-500">
            {channel.body}
          </p>
          <Link
            href={channel.action.href}
            className="group mt-4 inline-flex items-center gap-2 font-body text-[15px] text-black transition-colors duration-200 hover:text-zinc-500"
          >
            {channel.action.label}
            <Arrow />
          </Link>
        </div>
      ))}
    </div>
  );
}
