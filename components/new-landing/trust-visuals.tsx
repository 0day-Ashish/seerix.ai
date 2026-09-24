/**
 * The five fragments that sit between each trust card's heading and its body.
 *
 * Each one is a piece of the product's own UI, not an illustration of it: a
 * moderation log, a confidence readout, a tenancy table, a refused request, a
 * footnoted claim. They use real scope names, real dates and real figures, and
 * every figure is set in mono, as the site does everywhere else. Nothing here
 * moves. Decorative in the accessibility sense -- the card's prose carries the
 * same meaning -- so each is hidden from assistive tech.
 */

const mono = "font-mono text-[11px] tracking-[0.01em]";

function Tick() {
  return (
    <svg
      className="mt-[3px] h-3 w-3 shrink-0 text-[#4ade80]"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 6.5l2.3 2.3L9.5 3.8" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      className="mt-[3px] h-3 w-3 shrink-0 text-white/40"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  );
}

function Lock() {
  return (
    <svg
      className="h-3 w-3 shrink-0 text-white/50"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
    </svg>
  );
}

/* 01 -- Two candidate answers through the validator: one kept, one thrown. */
export function CitedOrRejected() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.09] px-3.5 py-2.5">
        <Tick />
        <div className="min-w-0">
          <p className="font-body text-[13px] leading-snug text-white/85">
            Rankings fell after the 2 Apr title rewrite.
          </p>
          <p className={`mt-1.5 flex flex-wrap gap-1.5 ${mono} text-white/45`}>
            <span className="rounded border border-white/[0.14] px-1.5 py-px">GSC</span>
            <span className="rounded border border-white/[0.14] px-1.5 py-px">SERP</span>
            <span className="rounded border border-white/[0.14] px-1.5 py-px">Crawl</span>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-white/[0.12] px-3.5 py-2.5">
        <Cross />
        <div className="min-w-0">
          <p className="font-body text-[13px] leading-snug text-white/40 line-through decoration-white/25">
            A competitor launched a paid campaign.
          </p>
          <p className={`mt-1.5 ${mono} text-white/35`}>
            no evidence row &middot; dropped before display
          </p>
        </div>
      </div>
    </div>
  );
}

/* 02 -- A confidence readout that is allowed to come back low. */
export function HonestConfidence() {
  const pips = [true, true, false, false, false];

  return (
    <div
      aria-hidden="true"
      className="rounded-lg border border-white/[0.09] px-3.5 py-3"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className={`${mono} uppercase tracking-[0.08em] text-white/40`}>
          Confidence
        </span>
        <span className={`${mono} text-[12px] text-white/85`}>Low</span>
      </div>

      <div className="mt-2.5 flex gap-1">
        {pips.map((lit, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              lit ? "bg-[#dcdddd]/80" : "bg-white/[0.10]"
            }`}
          />
        ))}
      </div>

      <dl className={`mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 ${mono} text-white/45`}>
        <dt>history</dt>
        <dd className="text-white/70">6 wk</dd>
        <dt>SERP snapshots</dt>
        <dd className="text-white/70">1</dd>
      </dl>

      <p className="mt-3 border-t border-white/[0.07] pt-2.5 font-body text-[13px] leading-snug text-white/60">
        Not enough to call it.{" "}
        <span className="text-white/85">Verdict: not yet.</span>
      </p>
    </div>
  );
}

/* 03 -- Tenancy: every account in its own box, nothing crossing between. */
export function PrivateByDesign() {
  const tenants = [
    { host: "acme.com", rows: "41,206" },
    { host: "borealis.io", rows: "8,930" },
  ];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-lg border border-white/[0.09]"
    >
      {tenants.map((tenant, i) => (
        <div
          key={tenant.host}
          className={`flex items-center gap-3 px-3.5 py-2.5 ${
            i > 0 ? "border-t border-white/[0.07]" : ""
          }`}
        >
          <Lock />
          <span className="font-body text-[13px] text-white/85">
            {tenant.host}
          </span>
          <span className={`ml-auto ${mono} text-white/45`}>
            {tenant.rows} rows &middot; AES-256
          </span>
        </div>
      ))}

      <div
        className={`flex flex-wrap gap-x-4 gap-y-1 border-t border-white/[0.07] bg-white/[0.03] px-3.5 py-2 ${mono} text-white/45`}
      >
        <span>
          cross-tenant reads <span className="text-white/75">0</span>
        </span>
        <span>
          training rows <span className="text-white/75">0</span>
        </span>
      </div>
    </div>
  );
}

/* 04 -- The request it will always refuse, and the scope that is why. */
export function NeverWrites() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <p className="max-w-[88%] self-end rounded-lg rounded-br-sm bg-white/[0.08] px-3 py-2 font-body text-[13px] leading-snug text-white/85">
        Apply the title fix to /pricing for me.
      </p>

      <div className="max-w-[94%] rounded-lg rounded-bl-sm border border-white/[0.09] px-3 py-2">
        <p className="font-body text-[13px] leading-snug text-white/70">
          I can&rsquo;t. My Google scope is read-only, so nothing I do reaches
          your account. Copy the suggestion across yourself.
        </p>
        <p className={`mt-2 ${mono} text-white/40`}>
          scope <span className="text-white/65">webmasters.readonly</span>
          <br />
          write <span className="text-white/65">not requested</span>
        </p>
      </div>
    </div>
  );
}

/* 05 -- A claim with its footnotes, and the rows the footnotes point at. */
export function Checkable() {
  const rows = [
    { n: 1, src: "GSC", detail: "clicks 2,940 → 1,823", when: "26 Mar – 9 Apr" },
    { n: 2, src: "Crawl", detail: "<title> changed", when: "2 Apr" },
  ];

  return (
    <div aria-hidden="true">
      <p className="font-body text-[14px] leading-snug text-white/85">
        Clicks fell 38% after 2 Apr
        <sup className={`ml-0.5 ${mono} text-white/50`}>1, 2</sup>
      </p>

      <div className="mt-3 border-t border-white/[0.09]">
        {rows.map((row) => (
          <div
            key={row.n}
            className={`grid grid-cols-[1rem_2.6rem_1fr_auto] items-baseline gap-x-2 border-b border-white/[0.06] py-2 ${mono}`}
          >
            <span className="text-white/40">{row.n}</span>
            <span className="text-white/75">{row.src}</span>
            <span className="truncate text-white/60">{row.detail}</span>
            <span className="text-white/35">{row.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
