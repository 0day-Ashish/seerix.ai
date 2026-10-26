import SeerixMark from "@/components/new-landing/seerix-mark";

/* -------------------------------------------------------------------------
 * The app chrome each product visual sits inside.
 *
 * The panels show a job being done; this puts them where the reader would
 * actually meet it -- the signed-in dashboard, that job's own page selected.
 * Mirrors `components/dashboard/shell`: pills on the page ground, a white
 * active pill, the signal mark beside it.
 *
 * Decorative: the copy beside each panel carries the same meaning in prose.
 * ---------------------------------------------------------------------- */

/** The sidebar, in the order the real app lists it. */
const nav = [
  { key: "overview", label: "Overview", d: "M2 13.5h12M4 11V8M8 11V3.5M12 11V6" },
  {
    key: "this-week",
    label: "This week",
    d: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  },
  { key: "chat", label: "Chat", d: "M2.5 3h11v8H7.5L4.5 13.5V11h-2z" },
  {
    key: "fix-list",
    label: "Fix list",
    d: "M6.5 4h7M6.5 8h7M6.5 12h7M2.5 4l1 1 1.5-2M2.5 8l1 1 1.5-2M2.5 12l1 1 1.5-2",
    count: 3,
  },
  {
    key: "rankings",
    label: "Rankings",
    d: "M2 12l4-4 3 3 5-6M10.5 5H14v3.5",
  },
  {
    key: "keywords",
    label: "Keywords",
    d: "M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3",
  },
] as const;

export type NavKey = (typeof nav)[number]["key"];

function Icon({ d }: { d: string }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

type AppFrameProps = {
  /** Which sidebar item reads as the current page. */
  active: NavKey;
  /** The page heading above the panel. */
  title: string;
  children: React.ReactNode;
};

export default function AppFrame({ active, title, children }: AppFrameProps) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f5f5f6] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.3)]"
    >
      <div className="flex">
        {/* Hidden on narrow screens, where the panel needs the width more
            than the chrome adds context. */}
        <aside className="hidden w-[150px] shrink-0 flex-col px-2.5 pb-4 pt-3.5 lg:flex">
          <span className="flex items-center gap-1.5 px-1.5">
            <SeerixMark size={16} animated={false} />
            <span className="wordmark text-[13.5px] font-semibold tracking-[-0.02em] text-zinc-900">
              seerix
            </span>
          </span>

          <span className="mt-3.5 flex h-7 items-center justify-center gap-1.5 rounded-full bg-signal-bright text-[11.5px] text-signal-ink">
            <Icon d="M8 3.5v9M3.5 8h9" />
            Ask Seerix
          </span>

          <nav className="mt-3.5 flex flex-col gap-0.5">
            {nav.map((n) => {
              const on = n.key === active;
              return (
                <span
                  key={n.key}
                  className={`flex items-center gap-2 rounded-full px-2 py-1.5 text-[11.5px] ${
                    on
                      ? "bg-white text-zinc-900 shadow-[0_0_0_1px_rgba(24,24,27,0.07)]"
                      : "text-zinc-500"
                  }`}
                >
                  <span className={on ? "text-signal" : "text-zinc-400"}>
                    <Icon d={n.d} />
                  </span>
                  {n.label}
                  {"count" in n && n.count ? (
                    <span className="ml-auto rounded-full bg-zinc-200/70 px-1 text-[9.5px] text-zinc-600">
                      {n.count}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </nav>
        </aside>

        {/* The page itself, in the white panel the app renders content into. */}
        <div className="min-w-0 flex-1 border-zinc-200 bg-white px-5 pb-6 pt-5 lg:rounded-l-2xl lg:border-l lg:border-t">
          <p className="font-display text-[16px] font-medium tracking-[-0.02em] text-zinc-900">
            {title}
          </p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
