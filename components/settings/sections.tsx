"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Badge,
  Button,
  DemoNote,
  Input,
  Meter,
  PageHeader,
  Panel,
  Row,
  Select,
  Table,
  Textarea,
  Toggle,
} from "@/components/settings/ui";

/*
 * The fifteen settings pages. Everything here is front-end only: forms keep
 * local state and nothing is saved, and the figures are sample data, marked
 * as such on the page, until the app's backend is wired in.
 */

const timezones = [
  "(GMT+00:00) London",
  "(GMT+01:00) Berlin",
  "(GMT+05:30) Kolkata",
  "(GMT-05:00) New York",
  "(GMT-08:00) Los Angeles",
];
const markets = [
  "United States (en)",
  "United Kingdom (en)",
  "Germany (de)",
  "France (fr)",
  "India (en)",
  "Australia (en)",
];

/* --- Personal ----------------------------------------------------------- */

function Profile() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="How you appear to your team, and the details Seerix uses to reach you."
      />
      <Panel title="Your details" footer={<Button>Save changes</Button>}>
        <Row label="Photo" hint="Shown to your team.">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center bg-[#141416] font-display text-[18px] text-white">
              A
            </span>
            <Button variant="secondary">Upload</Button>
            <Button variant="ghost">Remove</Button>
          </div>
        </Row>
        <Row label="Full name">
          <Input defaultValue="Alex Mercer" />
        </Row>
        <Row
          label="Email"
          hint="From your Google sign-in; change it in your Google account."
        >
          <Input defaultValue="alex@acme.com" disabled />
        </Row>
        <Row label="Role" hint="Helps Seerix pitch answers at the right depth.">
          <Select
            options={[
              "SEO lead",
              "Founder",
              "Marketing",
              "Agency",
              "Developer",
              "Other",
            ]}
            defaultValue="SEO lead"
          />
        </Row>
        <Row label="Time zone" hint="Used for report delivery and alert times.">
          <Select options={timezones} defaultValue={timezones[0]} />
        </Row>
      </Panel>
      <Panel
        title="Delete account"
        description="Deletes your account and every project's data. This cannot be undone."
        tone="danger"
      >
        <div className="py-4">
          <Button variant="danger">Delete account</Button>
        </div>
      </Panel>
    </>
  );
}

function Notifications() {
  const groups: { title: string; items: [string, string, boolean][] }[] = [
    {
      title: "Reports",
      items: [
        ["Weekly report", "Every finding, ranked, in one email.", true],
        [
          "Monthly summary",
          "The month's movement and fixes, for stakeholders.",
          false,
        ],
      ],
    },
    {
      title: "Alerts",
      items: [
        [
          "Traffic drops",
          "When clicks fall sharply on a page you care about.",
          true,
        ],
        [
          "Ranking changes",
          "When a tracked query moves three or more positions.",
          true,
        ],
        [
          "Competitor moves",
          "When a competitor overtakes you on your queries.",
          true,
        ],
        ["Fix verified", "When Seerix confirms whether a fix worked.", true],
      ],
    },
    {
      title: "Product",
      items: [
        [
          "Product updates",
          "New diagnoses and features, from the changelog.",
          false,
        ],
        ["Tips", "Short guides on getting more from Seerix.", false],
      ],
    },
  ];
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Choose what Seerix tells you about, and when."
      />
      {groups.map((g) => (
        <Panel key={g.title} title={g.title}>
          {g.items.map(([label, hint, on]) => (
            <Row key={label} label={label} hint={hint}>
              <div className="flex justify-end">
                <Toggle defaultOn={on} label={label} />
              </div>
            </Row>
          ))}
        </Panel>
      ))}
      <Panel title="Delivery" footer={<Button>Save</Button>}>
        <Row label="Weekly report day">
          <Select
            options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
            defaultValue="Monday"
          />
        </Row>
        <Row label="Send to">
          <Input defaultValue="alex@acme.com" />
        </Row>
      </Panel>
    </>
  );
}

function Affiliate() {
  const [copied, setCopied] = useState(false);
  const link = "https://seerix.ai/?ref=alex-mercer";
  return (
    <>
      <PageHeader
        title="Affiliate"
        description="Share Seerix with people who answer for search traffic."
      />
      <Panel title="Your referral link">
        <div className="flex flex-col gap-3 py-5 sm:flex-row">
          <Input readOnly value={link} className="font-mono text-[13px]" />
          <Button
            onClick={() => {
              navigator.clipboard?.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </Panel>
      <section className="mt-8 grid border border-black/[0.12] sm:grid-cols-3">
        {[
          ["Clicks", "0"],
          ["Sign-ups", "0"],
          ["Paying", "0"],
        ].map(([l, v], i) => (
          <div
            key={l}
            className={`p-6 ${i > 0 ? "border-t border-black/[0.12] sm:border-l sm:border-t-0" : ""}`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">
              {l}
            </p>
            <p className="mt-3 font-display text-[36px] tracking-[-0.03em] text-black">
              {v}
            </p>
          </div>
        ))}
      </section>
      <Panel title="How it works">
        <ol className="py-2">
          {[
            "Share your link with a team that runs search-driven sites.",
            "They sign up and connect Search Console.",
            "You see them here once they become a paying customer.",
          ].map((s, i) => (
            <li
              key={s}
              className="flex gap-4 border-b border-black/[0.06] py-4 last:border-b-0"
            >
              <span className="font-mono text-[13px] text-signal-deep">
                0{i + 1}
              </span>
              <span className="font-body text-[15px] text-zinc-700">{s}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}

function Learn() {
  const guides: [string, string, string, boolean][] = [
    [
      "Connect Search Console",
      "Grant read-only access and pick your properties.",
      "3 min",
      true,
    ],
    [
      "Read your first diagnosis",
      "What the answer, evidence and confidence mean.",
      "4 min",
      true,
    ],
    [
      "Work the fix list",
      "How impact × effort × confidence orders your fixes.",
      "5 min",
      false,
    ],
    [
      "Verify a fix",
      "Mark a fix done and let Seerix check it worked.",
      "3 min",
      false,
    ],
    [
      "Set up competitor tracking",
      "Add competitors and choose which queries to watch.",
      "4 min",
      false,
    ],
  ];
  const done = guides.filter((g) => g[3]).length;
  return (
    <>
      <PageHeader
        title="Learn"
        description="Short guides to getting the most from Seerix."
      />
      <Panel
        title="Getting started"
        description={`${done} of ${guides.length} complete`}
      >
        <div className="mb-2 mt-3 h-1.5 bg-black/[0.07]">
          <div
            className="h-full bg-signal"
            style={{ width: `${(done / guides.length) * 100}%` }}
          />
        </div>
        {guides.map(([title, body, time, complete]) => (
          <div
            key={title}
            className="flex items-center gap-4 border-b border-black/[0.06] py-4 last:border-b-0"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                complete
                  ? "border-signal bg-signal text-white"
                  : "border-black/[0.2]"
              }`}
            >
              {complete && (
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8.5l3.2 3.2L13 5" />
                </svg>
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block font-body text-[15px] ${complete ? "text-zinc-500 line-through" : "text-black"}`}
              >
                {title}
              </span>
              <span className="block font-body text-[13px] text-zinc-500">
                {body}
              </span>
            </span>
            <span className="shrink-0 font-mono text-[12px] text-zinc-400">
              {time}
            </span>
          </div>
        ))}
      </Panel>
    </>
  );
}

/* --- Project ------------------------------------------------------------ */

function Knowledge() {
  return (
    <>
      <PageHeader
        title="Knowledge"
        description="Context about acme.com that Seerix uses when it diagnoses. The more it knows, the sharper its answers."
      />
      <Panel title="About the business" footer={<Button>Save</Button>}>
        <Row label="What you sell" hint="One or two sentences.">
          <Textarea
            rows={3}
            defaultValue="Project management software for agencies, sold on monthly and annual plans."
          />
        </Row>
        <Row label="Primary market">
          <Select options={markets} defaultValue={markets[0]} />
        </Row>
        <Row
          label="Pages that matter most"
          hint="One URL per line. Seerix prioritises these."
        >
          <Textarea
            rows={4}
            defaultValue={"/pricing\n/integrations\n/signup"}
            className="font-mono text-[13px]"
          />
        </Row>
        <Row
          label="Brand terms"
          hint="Queries containing these count as branded."
        >
          <Input defaultValue="acme, acme pm, acmeapp" />
        </Row>
        <Row label="Competitors" hint="Domains to track in your SERPs.">
          <Textarea
            rows={3}
            defaultValue={"rivalpm.com\nboardly.io"}
            className="font-mono text-[13px]"
          />
        </Row>
      </Panel>
    </>
  );
}

/** Each integration's mark, from public/assets/integrations. */
const logos: Record<string, string> = {
  "Google Search Console": "/assets/integrations/search-console.svg",
  "Google Analytics 4": "/assets/integrations/google-analytics.svg",
  "Bing Webmaster Tools": "/assets/integrations/bing.svg",
  Slack: "/assets/integrations/slack.svg",
  "Looker Studio": "/assets/integrations/looker-studio.svg",
  Webhooks: "/assets/integrations/webhooks.svg",
};

function Integrations() {
  const items: [string, string, "connected" | "available" | "soon"][] = [
    [
      "Google Search Console",
      "Clicks, impressions and rankings history. Read-only.",
      "connected",
    ],
    [
      "Google Analytics 4",
      "Sessions and conversions alongside search traffic.",
      "available",
    ],
    ["Bing Webmaster Tools", "Search performance beyond Google.", "available"],
    ["Slack", "Alerts and the weekly report in a channel.", "available"],
    ["Looker Studio", "Pull diagnoses into your own dashboards.", "soon"],
    [
      "Webhooks",
      "Send findings to any endpoint. Set up in Developers.",
      "available",
    ],
  ];
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect the tools Seerix reads from and reports to."
      />
      <section className="mt-8 grid border border-black/[0.12] sm:grid-cols-2">
        {items.map(([name, body, state], i) => (
          <div
            key={name}
            className={`flex flex-col gap-4 p-6 ${i > 0 ? "border-t border-black/[0.12]" : ""} ${
              i === 1 ? "sm:border-t-0" : ""
            } ${i % 2 === 1 ? "sm:border-l" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center border border-black/[0.08] bg-white">
                {/* Plain <img>: tiny static SVGs gain nothing from the
                    image optimiser, which also refuses SVG by default. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logos[name]} alt={`${name} logo`} className="h-6 w-6 object-contain" />
              </span>
              {state === "connected" && <Badge tone="good">Connected</Badge>}
              {state === "soon" && <Badge>Soon</Badge>}
            </div>
            <div>
              <p className="font-body text-[16px] text-black">{name}</p>
              <p className="mt-1 font-body text-[14px] leading-[1.5] text-zinc-500">
                {body}
              </p>
            </div>
            <div className="mt-auto">
              {state === "connected" ? (
                <Button variant="secondary">Manage</Button>
              ) : state === "soon" ? (
                <Button variant="secondary" disabled className="opacity-50">
                  Coming soon
                </Button>
              ) : (
                <Button>Connect</Button>
              )}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function ExclusionLists() {
  const [rules, setRules] = useState([
    { value: "/blog/tag/*", kind: "URL pattern" },
    { value: "/staging/*", kind: "URL pattern" },
    { value: "acme login", kind: "Query" },
  ]);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState("URL pattern");
  return (
    <>
      <PageHeader
        title="Exclusion lists"
        description="Pages and queries Seerix leaves out of diagnoses, fix lists and reports."
      />
      <Panel title="Add an exclusion">
        <div className="flex flex-col gap-3 py-5 sm:flex-row">
          <Select
            options={["URL pattern", "Query"]}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="sm:w-44"
          />
          <Input
            placeholder={kind === "Query" ? "acme login" : "/blog/tag/*"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="font-mono text-[13px]"
          />
          <Button
            onClick={() => {
              if (!draft.trim()) return;
              setRules((r) => [...r, { value: draft.trim(), kind }]);
              setDraft("");
            }}
          >
            Add
          </Button>
        </div>
      </Panel>
      <Panel title="Excluded" description={`${rules.length} rules`}>
        <Table
          head={["Rule", "Type", ""]}
          rows={rules.map((r, i) => [
            <span key="v" className="font-mono text-[13px] text-black">
              {r.value}
            </span>,
            r.kind,
            <div key="x" className="text-right">
              <Button
                variant="ghost"
                onClick={() => setRules((all) => all.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>,
          ])}
        />
      </Panel>
    </>
  );
}

function Scheduled() {
  const jobs: [string, string, string, boolean][] = [
    ["Weekly report", "Mondays, 09:00", "Email · alex@acme.com", true],
    ["Site crawl", "Daily, 02:00", "acme.com · 5,000 pages", true],
    ["SERP snapshots", "Daily, 04:00", "312 tracked queries", true],
    ["Monthly summary", "1st of the month, 09:00", "Email · team", false],
  ];
  return (
    <>
      <PageHeader
        title="Scheduled"
        description="Recurring work Seerix runs for this project."
        action={<Button>New schedule</Button>}
      />
      <Panel title="Schedules">
        <Table
          head={["Job", "Runs", "Target", "On"]}
          rows={jobs.map(([job, when, target, on]) => [
            <span key="j" className="text-black">
              {job}
            </span>,
            <span key="w" className="font-mono text-[13px]">
              {when}
            </span>,
            target,
            <Toggle key="t" defaultOn={on} label={job} />,
          ])}
        />
      </Panel>
      <DemoNote />
    </>
  );
}

/* --- Organization ------------------------------------------------------- */

function Team() {
  const members: [string, string, string, string][] = [
    ["Alex Mercer", "alex@acme.com", "Owner", "Active"],
    ["Priya Nair", "priya@acme.com", "Admin", "Active"],
    ["Sam Okafor", "sam@acme.com", "Member", "Invited"],
  ];
  return (
    <>
      <PageHeader
        title="Team"
        description="People who can see this organization's projects."
      />
      <Panel title="Invite people" footer={<Button>Send invite</Button>}>
        <div className="flex flex-col gap-3 py-5 sm:flex-row">
          <Input placeholder="name@company.com" type="email" />
          <Select
            options={["Member", "Admin", "Viewer"]}
            defaultValue="Member"
            className="sm:w-40"
          />
        </div>
      </Panel>
      <Panel title="Members" description={`${members.length} people`}>
        <Table
          head={["Name", "Email", "Role", "Status"]}
          rows={members.map(([n, e, r, s]) => [
            <span key="n" className="flex items-center gap-3 text-black">
              <span className="flex h-7 w-7 items-center justify-center bg-[#141416] text-[12px] text-white">
                {n[0]}
              </span>
              {n}
            </span>,
            e,
            r,
            <Badge key="s" tone={s === "Active" ? "good" : "neutral"}>
              {s}
            </Badge>,
          ])}
        />
      </Panel>
      <DemoNote />
    </>
  );
}

function Projects() {
  const rows: [string, string, string, string][] = [
    ["acme.com", "sc-domain:acme.com", "United States (en)", "12 Mar 2026"],
    [
      "docs.acme.com",
      "https://docs.acme.com/",
      "United States (en)",
      "3 Apr 2026",
    ],
    ["acme.de", "sc-domain:acme.de", "Germany (de)", "18 May 2026"],
  ];
  return (
    <>
      <PageHeader
        title="Projects"
        description="Each project is one site with its own crawl, competitors and reports."
        action={<Button>New project</Button>}
      />
      <Panel title="Projects" description="3 of 5 sites on the Growth plan">
        <Table
          head={["Site", "Search Console property", "Market", "Created"]}
          rows={rows.map(([site, prop, market, created]) => [
            <span key="s" className="text-black">
              {site}
            </span>,
            <span key="p" className="font-mono text-[13px]">
              {prop}
            </span>,
            market,
            created,
          ])}
        />
      </Panel>
      <DemoNote />
    </>
  );
}

function Domains() {
  return (
    <>
      <PageHeader
        title="Domains"
        description="Domains your organization owns. Verified domains let teammates add their sites without a separate Google grant."
        action={<Button>Add domain</Button>}
      />
      <Panel title="Domains">
        <Table
          head={["Domain", "Status", "Added"]}
          rows={[
            [
              <span key="a" className="text-black">
                acme.com
              </span>,
              <Badge key="b" tone="good">
                Verified
              </Badge>,
              "12 Mar 2026",
            ],
            [
              <span key="a" className="text-black">
                acme.de
              </span>,
              <Badge key="b" tone="signal">
                Pending
              </Badge>,
              "18 May 2026",
            ],
          ]}
        />
      </Panel>
      <Panel
        title="Verify acme.de"
        description="Add this TXT record at your DNS provider. It can take up to an hour to be seen."
      >
        <div className="grid gap-3 py-5 sm:grid-cols-[6rem_minmax(0,1fr)]">
          {[
            ["Type", "TXT"],
            ["Host", "@"],
            ["Value", "seerix-verification=7f3c91e2b4a8"],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-zinc-500">
                {k}
              </span>
              <span className="break-all bg-[#f7f6f4] px-3 py-2 font-mono text-[13px] text-black">
                {v}
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <DemoNote />
    </>
  );
}

function Developers() {
  return (
    <>
      <PageHeader
        title="Developers"
        description="API keys and webhooks for building on Seerix."
        action={<Button>Create API key</Button>}
      />
      <Panel
        title="API keys"
        description="Keys act as your organization. Keep them secret."
      >
        <Table
          head={["Name", "Key", "Created", "Last used", ""]}
          rows={[
            [
              "Reporting script",
              <span key="k" className="font-mono text-[13px]">
                sk_live_••••••••3f9a
              </span>,
              "2 Aug 2026",
              "Today",
              <div key="r" className="text-right">
                <Button variant="ghost">Revoke</Button>
              </div>,
            ],
          ]}
        />
      </Panel>
      <Panel
        title="Webhooks"
        description="Seerix posts new findings and verified fixes to these URLs."
        footer={<Button>Add endpoint</Button>}
      >
        <Row label="Endpoint URL">
          <Input
            placeholder="https://example.com/seerix-webhook"
            className="font-mono text-[13px]"
          />
        </Row>
        <Row label="Events">
          <div className="flex flex-wrap gap-2">
            {["finding.created", "fix.verified", "report.ready"].map((e) => (
              <span
                key={e}
                className="border border-black/[0.14] px-2 py-1 font-mono text-[12px] text-zinc-700"
              >
                {e}
              </span>
            ))}
          </div>
        </Row>
      </Panel>
      <DemoNote />
    </>
  );
}

/* --- Billing ------------------------------------------------------------ */

function Billing() {
  return (
    <>
      <PageHeader
        title="Billing"
        description="Your plan, payment method and billing details."
      />
      <section className="mt-8 grid border border-black/[0.12] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="bg-[#141416] p-7 text-white">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
            Current plan
          </p>
          <p className="mt-3 flex items-baseline gap-2 font-display">
            <span className="text-[40px] tracking-[-0.03em]">Growth</span>
            <span className="text-[18px] text-white/60">$99/mo</span>
          </p>
          <p className="mt-2 font-body text-[14px] text-white/65">
            Renews on 1 Nov 2026. Month to month, cancel anytime.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center bg-signal px-4 font-body text-[14px] font-medium text-white hover:bg-signal-deep"
            >
              Change plan
            </Link>
            <button
              type="button"
              className="inline-flex h-10 items-center border border-white/25 px-4 font-body text-[14px] text-white hover:border-white/60"
            >
              Cancel plan
            </button>
          </div>
        </div>
        <div className="border-t border-black/[0.12] p-7 lg:border-l lg:border-t-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Included
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 font-body text-[15px] text-black">
            {[
              "5 sites",
              "500 AI questions a month",
              "5,000 pages crawled per site",
              "Competitor tracking",
            ].map((x) => (
              <li key={x} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Panel
        title="Payment method"
        footer={<Button variant="secondary">Update</Button>}
      >
        <div className="flex items-center gap-4 py-5">
          <span className="flex h-9 w-14 items-center justify-center border border-black/[0.14] font-mono text-[11px] text-zinc-600">
            VISA
          </span>
          <span className="font-body text-[15px] text-black">
            Visa ending 4242
          </span>
          <span className="font-body text-[14px] text-zinc-500">
            Expires 08/28
          </span>
        </div>
      </Panel>
      <Panel title="Billing details" footer={<Button>Save</Button>}>
        <Row label="Billing email" hint="Invoices are sent here.">
          <Input defaultValue="billing@acme.com" />
        </Row>
        <Row label="Company name">
          <Input defaultValue="Acme Inc." />
        </Row>
        <Row label="Tax ID" hint="Optional. Shown on invoices.">
          <Input placeholder="GB123456789" />
        </Row>
      </Panel>
      <DemoNote />
    </>
  );
}

function Invoices() {
  const rows: [string, string, string, string][] = [
    ["1 Oct 2026", "SRX-0007", "$99.00", "Paid"],
    ["1 Sep 2026", "SRX-0006", "$99.00", "Paid"],
    ["1 Aug 2026", "SRX-0005", "$99.00", "Paid"],
    ["1 Jul 2026", "SRX-0004", "$39.00", "Paid"],
  ];
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Every invoice for this organization."
      />
      <Panel title="History">
        <Table
          head={["Date", "Invoice", "Amount", "Status", ""]}
          rows={rows.map(([d, n, a, s]) => [
            d,
            <span key="n" className="font-mono text-[13px]">
              {n}
            </span>,
            <span key="a" className="text-black">
              {a}
            </span>,
            <Badge key="s" tone="good">
              {s}
            </Badge>,
            <div key="d" className="text-right">
              <Button variant="ghost">Download PDF</Button>
            </div>,
          ])}
        />
      </Panel>
      <DemoNote />
    </>
  );
}

function Usage() {
  const daily = [
    12, 18, 9, 22, 30, 14, 8, 25, 19, 27, 33, 16, 11, 24, 29, 21, 17, 26,
  ];
  const max = Math.max(...daily);
  return (
    <>
      <PageHeader
        title="Usage"
        description="This billing cycle, 1 Oct – 31 Oct 2026. Allowances reset on 1 Nov."
      />
      <Panel title="Allowances">
        <Meter label="AI questions" used={360} limit={500} />
        <Meter label="Pages crawled" used={3120} limit={5000} unit="per site" />
        <Meter
          label="Keywords enriched"
          used={1680}
          limit={2000}
          unit="per site"
        />
        <Meter label="SERP snapshots" used={214} limit={500} unit="per site" />
        <Meter label="Sites" used={3} limit={5} />
      </Panel>
      <Panel title="AI questions per day">
        <div className="flex h-40 items-end gap-1.5 py-5">
          {daily.map((v, i) => (
            <span
              key={i}
              title={`${v} questions`}
              style={{ height: `${(v / max) * 100}%` }}
              className={`flex-1 ${i === daily.length - 1 ? "bg-signal" : "bg-[#141416]/80"}`}
            />
          ))}
        </div>
        <p className="pb-4 font-body text-[13px] text-zinc-500">
          Background work (crawls, alerts, reports) never draws on the question
          allowance.
        </p>
      </Panel>
      <DemoNote />
    </>
  );
}

const sections: Record<string, () => React.ReactElement> = {
  profile: Profile,
  notifications: Notifications,
  affiliate: Affiliate,
  learn: Learn,
  knowledge: Knowledge,
  integrations: Integrations,
  "exclusion-lists": ExclusionLists,
  scheduled: Scheduled,
  team: Team,
  projects: Projects,
  domains: Domains,
  developers: Developers,
  billing: Billing,
  invoices: Invoices,
  usage: Usage,
};

/**
 * Renders one settings page by slug. The lookup happens here, on the client
 * side of the boundary: a server page importing the `sections` object itself
 * would receive a client reference, not the map, and find nothing in it.
 */
export default function SettingsSection({ slug }: { slug: string }) {
  const Section = sections[slug];
  return Section ? <Section /> : null;
}
