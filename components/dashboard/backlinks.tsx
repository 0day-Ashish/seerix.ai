"use client";

import { useMemo, useState } from "react";

import {
  anchors,
  backlinkSnapshot as snap,
  backlinks,
  fmt,
  referringDomains,
  type Backlink,
} from "@/components/dashboard/data";
import { Card, DataTable, Kpi, PageTitle } from "@/components/dashboard/kit";

/* -------------------------------------------------------------------------
 * Backlinks: every link to the site from the latest capture. Presets across
 * the top, a filter bar, and the per-link table, in the shape of a classic
 * backlinks report.
 * ---------------------------------------------------------------------- */

const TODAY = Date.UTC(2026, 9, 13);
const PAGE = 20;

/** The staging app's four views, as Semrush-style preset cards. */
const PRESETS = [
  {
    key: "all",
    label: "All links",
    hint: "Every link in the latest capture",
    test: () => true,
  },
  {
    key: "new",
    label: "New",
    hint: "First seen since the last capture",
    test: (b: Backlink) => b.status === "new",
  },
  {
    key: "lost",
    label: "Lost",
    hint: "Gone since the last capture; restore these first",
    test: (b: Backlink) => b.status === "lost",
  },
  {
    key: "broken",
    label: "Broken",
    hint: "Live links to pages that 404 on your site; 301 to reclaim",
    test: (b: Backlink) => b.our_status != null && b.status !== "lost",
  },
] as const;
type PresetKey = (typeof PRESETS)[number]["key"];

const PLACEMENT = ["All", "Content", "Header", "Sidebar", "Footer"] as const;
const ATTRS = ["All", "Follow", "Nofollow", "Sponsored", "UGC"] as const;

type Extra = {
  type?: Backlink["link_type"];
  language?: string;
  mobile?: boolean;
};

const EXTRA_OPTIONS: {
  group: string;
  options: { label: string; set: Extra }[];
}[] = [
  {
    group: "Link type",
    options: (["Text", "Image"] as const).map((t) => ({
      label: t,
      set: { type: t },
    })),
  },
  {
    group: "Language",
    options: ["EN", "RU"].map((l) => ({ label: l, set: { language: l } })),
  },
  {
    group: "Page",
    options: [{ label: "Mobile friendly", set: { mobile: true } }],
  },
];

type SortKey =
  | "page_from_rank"
  | "external_links"
  | "internal_links"
  | "first_seen"
  | "last_seen";

const longDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** Recent sightings read as "3d ago"; anything older as a date. */
function seen(iso: string) {
  const days = Math.round(
    (TODAY - Date.parse(iso + "T00:00:00Z")) / 86_400_000,
  );
  if (days <= 0) return "Today";
  if (days <= 14) return `${days}d ago`;
  return longDate(iso);
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="ml-1 inline h-3.5 w-3.5 shrink-0 -translate-y-px"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 2.5h4v4M13.5 2.5L7.5 8.5M11.5 9.5v4h-9v-9h4" />
    </svg>
  );
}

function Url({ url }: { url: string }) {
  return (
    <a
      href={`https://${url}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="break-all font-body text-[13.5px] leading-[1.45] text-link hover:text-link-deep hover:underline hover:underline-offset-[3px]"
    >
      {url}
      <ExternalIcon />
    </a>
  );
}

function Chip({
  children,
  tone = "grey",
}: {
  children: React.ReactNode;
  tone?: "grey" | "lost" | "new";
}) {
  const styles = {
    grey: "bg-black/[0.05] text-zinc-600",
    lost: "bg-black/[0.05] text-signal-deep",
    new: "bg-black/[0.05] text-[#1f6b3a]",
  }[tone];
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 font-body text-[12px] ${styles}`}
    >
      {children}
    </span>
  );
}

/** A joined row of square toggles: one choice at a time. */
function Segments<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex shrink-0 border border-black/[0.14] bg-white"
    >
      {options.map((o, i) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={`relative h-9 px-3 font-body text-[13.5px] transition-colors ${
              i > 0 ? "border-l border-black/[0.1]" : ""
            } ${
              on
                ? "bg-[#141416] text-white"
                : "text-zinc-700 hover:bg-black/[0.03] hover:text-black"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Th({
  label,
  sortKey,
  sort,
  onSort,
  className = "",
}: {
  label: string;
  sortKey?: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortKey && sort.key === sortKey;
  return (
    <th
      className={`border-b border-black/[0.08] px-4 py-3 text-left font-body text-[13px] font-medium text-black ${
        active ? "bg-black/[0.04]" : ""
      } ${className}`}
      aria-sort={
        active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
      }
    >
      {sortKey ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className="flex w-full items-center gap-1.5 text-left hover:text-black"
        >
          {label}
          <svg
            viewBox="0 0 16 16"
            className={`h-3.5 w-3.5 shrink-0 ${active ? "text-black" : "text-zinc-300"} ${
              active && sort.dir === "asc" ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M2.5 4.5h11M2.5 8h7.5M2.5 11.5h4" />
          </svg>
        </button>
      ) : (
        label
      )}
    </th>
  );
}

function downloadCsv(rows: Backlink[]) {
  const head = [
    "Page AS",
    "Source title",
    "Source URL",
    "External links",
    "Internal links",
    "Anchor",
    "Target URL",
    "Attribute",
    "Status",
    "First seen",
    "Last seen",
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    head,
    ...rows.map((b) => [
      b.page_from_rank,
      b.source_title,
      `https://${b.source_page_url}`,
      b.external_links,
      b.internal_links,
      b.anchor_text,
      `https://${b.target_url}`,
      b.attribute,
      b.status,
      b.first_seen,
      b.last_seen,
    ]),
  ]
    .map((r) => r.map(esc).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "arddev.in-backlinks.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Backlinks() {
  const [preset, setPreset] = useState<PresetKey>("all");
  const [placement, setPlacement] = useState<(typeof PLACEMENT)[number]>("All");
  const [attr, setAttr] = useState<(typeof ATTRS)[number]>("All");
  const [extra, setExtra] = useState<Extra>({});
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "page_from_rank",
    dir: "desc",
  });
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const reset = () => setPage(0);

  const rows = useMemo(() => {
    const p = PRESETS.find((x) => x.key === preset)!;
    const q = query.trim().toLowerCase();
    return backlinks
      .filter(p.test)
      .filter((b) => placement === "All" || b.semantic_location === placement)
      .filter((b) => attr === "All" || b.attribute === attr.toLowerCase())
      .filter((b) => !extra.type || b.link_type === extra.type)
      .filter((b) => !extra.language || b.language === extra.language)
      .filter((b) => !extra.mobile || b.mobile_friendly)
      .filter(
        (b) =>
          !q ||
          b.source_title.toLowerCase().includes(q) ||
          b.source_page_url.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        const c =
          typeof x === "number"
            ? x - (y as number)
            : String(x).localeCompare(String(y));
        return sort.dir === "asc" ? c : -c;
      });
  }, [preset, placement, attr, extra, query, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);
  const allPicked =
    shown.length > 0 && shown.every((b) => picked.has(b.source_page_url));

  const onSort = (key: SortKey) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));
    reset();
  };

  const extraChips = (
    Object.entries(extra) as [keyof Extra, Extra[keyof Extra]][]
  ).filter(([, v]) => v !== undefined);

  return (
    <div>
      <PageTitle
        title="Backlinks"
        description="Every link pointing at arddev.in, from the latest capture. Refreshed weekly."
      />

      {/* The snapshot, as in the staging app */}
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi
          label="Total backlinks"
          value={fmt(snap.backlinks_total)}
          sub={`+${snap.backlinks_new} new · −${snap.backlinks_lost} lost`}
        />
        <Kpi
          label="Referring domains"
          value={fmt(snap.referring_domains)}
          sub={`captured ${snap.captured_date}`}
        />
        <Kpi
          label="Dofollow / Nofollow"
          value={`${Math.round((snap.dofollow / snap.backlinks_total) * 100)}% / ${
            100 - Math.round((snap.dofollow / snap.backlinks_total) * 100)
          }%`}
          sub={`of ${snap.backlinks_total} tracked links`}
        />
        <Kpi
          label="Domain rank"
          value={String(snap.provider_rank)}
          sub="third-party index"
        />
        <div className="col-span-2 lg:col-span-1">
          <Kpi
            label="Referring pages"
            value={fmt(snap.referring_pages)}
            sub={`${snap.referring_ips} IPs · ${snap.referring_subnets} subnets`}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="mt-4 grid grid-cols-2 border border-black/[0.12] bg-white lg:grid-cols-4">
        {PRESETS.map((p, i) => {
          const on = p.key === preset;
          const n = backlinks.filter(p.test).length;
          return (
            <button
              key={p.key}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setPreset(p.key);
                reset();
              }}
              className={`relative px-5 py-4 text-left transition-colors ${
                i % 2 ? "border-l border-black/[0.08]" : ""
              } ${i > 1 ? "border-t border-black/[0.08] lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l" : ""
              } ${
                on
                  ? "bg-white shadow-[inset_0_-2px_0_#141416]"
                  : "bg-[#fbfaf9] hover:bg-white"
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span className="font-display text-[18px] text-black">
                  {p.label}
                </span>
                <span className="font-mono text-[15px] text-zinc-500">{n}</span>
              </span>
              <span className="mt-1 block font-body text-[13px] text-zinc-500">
                {p.hint}
              </span>
            </button>
          );
        })}
      </div>

      <section className="mt-5 min-w-0 border border-black/[0.12] bg-white">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] px-5 py-4">
          <h2 className="font-display text-[19px] text-black">
            Backlinks{" "}
            <span className="font-body text-[15px] text-zinc-400">
              {rows.length === 0
                ? "0"
                : `${page * PAGE + 1} – ${Math.min(rows.length, (page + 1) * PAGE)}`}{" "}
              ({rows.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                picked.size
                  ? rows.filter((b) => picked.has(b.source_page_url))
                  : rows,
              )
            }
            className="inline-flex h-9 items-center gap-2 border border-black/[0.16] bg-white px-3.5 font-body text-[13.5px] text-black hover:border-black/40"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10v3.5h11V10" />
            </svg>
            {picked.size ? `Export ${picked.size}` : "Export"}
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full sm:w-auto"
          >
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                reset();
              }}
              placeholder="Filter by title or URL"
              aria-label="Filter by title or URL"
              className="h-9 min-w-0 flex-1 border border-black/[0.16] bg-white px-3 font-body text-[13.5px] text-black placeholder:text-zinc-400 focus:border-black focus:outline-none sm:w-[300px] sm:flex-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-9 w-10 items-center justify-center border border-l-0 border-black/[0.16] bg-[#f7f6f4] text-zinc-600 hover:text-black"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3" />
              </svg>
            </button>
          </form>

          <div className="flex max-w-full gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Segments
              label="Placement"
              options={PLACEMENT}
              value={placement}
              onChange={(v) => {
                setPlacement(v);
                reset();
              }}
            />
            <Segments
              label="Link attribute"
              options={ATTRS}
              value={attr}
              onChange={(v) => {
                setAttr(v);
                reset();
              }}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="inline-flex h-9 items-center gap-1.5 px-2 font-body text-[13.5px] font-medium text-black hover:text-zinc-600"
            >
              <span className="text-[17px] leading-none">+</span> Add filter
            </button>
            {menu && (
              <>
                <button
                  type="button"
                  aria-label="Close filters"
                  className="fixed inset-0 z-20 cursor-default"
                  onClick={() => setMenu(false)}
                />
                <div className="absolute left-0 top-11 z-30 w-[280px] border border-black/[0.14] bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:left-auto sm:right-0 lg:left-0 lg:right-auto">
                  {EXTRA_OPTIONS.map((g) => (
                    <div key={g.group} className="mb-3 last:mb-0">
                      <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-zinc-500">
                        {g.group}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.options.map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => {
                              setExtra((e) => ({ ...e, ...o.set }));
                              setMenu(false);
                              reset();
                            }}
                            className="border border-black/[0.14] px-2.5 py-1 font-body text-[12.5px] text-black hover:border-black/40"
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {extraChips.map(([k, v]) => (
            <span
              key={k}
              className="inline-flex h-8 items-center gap-2 border border-black/[0.2] bg-white pl-2.5 pr-1 font-body text-[12.5px] text-black"
            >
              {k === "mobile" ? "Mobile friendly" : String(v)}
              <button
                type="button"
                aria-label={`Remove ${k} filter`}
                onClick={() => {
                  setExtra((e) => ({ ...e, [k]: undefined }));
                  reset();
                }}
                className="px-1 text-[15px] leading-none text-zinc-500 hover:text-black"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-black/[0.08]">
          <table className="w-full min-w-[1120px] border-collapse">
            <thead className="bg-[#f7f6f4]">
              <tr>
                <th className="w-12 border-b border-black/[0.08] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPicked}
                    onChange={() =>
                      setPicked((s) => {
                        const n = new Set(s);
                        shown.forEach((b) =>
                          allPicked
                            ? n.delete(b.source_page_url)
                            : n.add(b.source_page_url),
                        );
                        return n;
                      })
                    }
                    aria-label="Select all on this page"
                    className="h-4 w-4 accent-[#141416]"
                  />
                </th>
                <Th
                  label="Page AS"
                  sortKey="page_from_rank"
                  sort={sort}
                  onSort={onSort}
                  className="w-[110px]"
                />
                <Th
                  label="Source page Title and URL"
                  sort={sort}
                  onSort={onSort}
                />
                <Th
                  label="Ext. Links"
                  sortKey="external_links"
                  sort={sort}
                  onSort={onSort}
                  className="w-[104px]"
                />
                <Th
                  label="Int. Links"
                  sortKey="internal_links"
                  sort={sort}
                  onSort={onSort}
                  className="w-[100px]"
                />
                <Th label="Anchor and Target URL" sort={sort} onSort={onSort} />
                <Th
                  label="First Seen"
                  sortKey="first_seen"
                  sort={sort}
                  onSort={onSort}
                  className="w-[128px]"
                />
                <Th
                  label="Last Seen"
                  sortKey="last_seen"
                  sort={sort}
                  onSort={onSort}
                  className="w-[128px]"
                />
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => {
                const on = picked.has(b.source_page_url);
                const lost = b.status === "lost";
                return (
                  <tr
                    key={b.source_page_url}
                    className={`border-b border-black/[0.06] align-top last:border-b-0 ${
                      on ? "bg-black/[0.035]" : "hover:bg-black/[0.015]"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setPicked((s) => {
                            const n = new Set(s);
                            if (n.has(b.source_page_url))
                              n.delete(b.source_page_url);
                            else n.add(b.source_page_url);
                            return n;
                          })
                        }
                        aria-label={`Select ${b.source_title}`}
                        className="h-4 w-4 accent-[#141416]"
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] text-black">
                      <span className="mr-6">{b.page_from_rank}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-body text-[14px] leading-[1.45] text-black">
                        {b.source_title}
                      </p>
                      <div className="mt-0.5">
                        <Url url={b.source_page_url} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip>{b.language}</Chip>
                        {b.mobile_friendly && <Chip>Mobile friendly</Chip>}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[14px] text-black">
                      {b.external_links}
                    </td>
                    <td className="px-4 py-4 font-mono text-[14px] text-black">
                      {b.internal_links}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-body text-[14px] leading-[1.45] text-black">
                        {b.anchor_text}
                      </p>
                      <div className="mt-0.5">
                        <Url url={b.target_url} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip>{b.link_type}</Chip>
                        {b.attribute !== "follow" && (
                          <Chip>
                            {b.attribute === "ugc"
                              ? "UGC"
                              : b.attribute[0].toUpperCase() +
                                b.attribute.slice(1)}
                          </Chip>
                        )}
                        {lost ? (
                          <Chip tone="lost">Lost: {b.lost_reason}</Chip>
                        ) : (
                          b.semantic_location && (
                            <Chip>{b.semantic_location}</Chip>
                          )
                        )}
                        {b.status === "new" && <Chip tone="new">New</Chip>}
                        {b.our_status && !lost && (
                          <Chip tone="lost">
                            Broken: {b.our_status} on your site
                          </Chip>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-body text-[14px] text-black">
                      {longDate(b.first_seen)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-4 font-body text-[14px] ${
                        lost ? "text-signal-deep" : "text-black"
                      }`}
                    >
                      {lost ? longDate(b.last_seen) : seen(b.last_seen)}
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-14 text-center font-body text-[14px] text-zinc-400"
                  >
                    No backlinks match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] px-5 py-3 font-body text-[13px] text-zinc-500">
          <span>
            Page {page + 1} of {pages}
          </span>
          <div className="flex gap-1">
            {["Previous", "Next"].map((l, i) => {
              const target = i === 0 ? page - 1 : page + 1;
              return (
                <button
                  key={l}
                  type="button"
                  disabled={target < 0 || target >= pages}
                  onClick={() => setPage(target)}
                  className="h-8 border border-black/[0.14] px-3 text-black disabled:opacity-35"
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Secondary tables, as in the staging app */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card
          title="Top referring domains"
          hint="Strongest page per domain."
          flush
        >
          <DataTable
            minWidth={440}
            head={["Domain", "Rank", "Links", "Dofollow"]}
            align={["left", "right", "right", "right"]}
            rows={referringDomains.slice(0, 10).map((d) => [
              <span key="d" className="text-black">
                {d.domain}
              </span>,
              d.rank,
              d.links,
              d.dofollow,
            ])}
          />
        </Card>
        <Card
          title="Anchor mix"
          hint="Referring domains per anchor text."
          flush
        >
          <ul className="px-5 py-3">
            {anchors.slice(0, 10).map((a) => (
              <li
                key={a.anchor}
                className="grid grid-cols-[minmax(0,1fr)_88px_24px] items-center gap-3 py-1.5"
              >
                <span className="truncate font-body text-[13.5px] text-black">
                  {a.anchor}
                </span>
                <span className="h-1.5 bg-black/[0.06]">
                  <span
                    className="block h-full bg-[#36363b]"
                    style={{
                      width: `${(a.referring_domains / anchors[0].referring_domains) * 100}%`,
                    }}
                  />
                </span>
                <span className="text-right font-mono text-[12.5px] text-zinc-600">
                  {a.referring_domains}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card
          title="Broken (301 to reclaim)"
          hint="Live links pointing at pages that no longer exist on your site. Redirect each to its closest live page."
          flush
        >
          <DataTable
            minWidth={640}
            head={["From", "Pointed at", "Our status"]}
            rows={backlinks
              .filter((b) => b.our_status && b.status !== "lost")
              .map((b) => [
                <span key="f" className="break-all text-black">
                  {b.source_page_url}
                </span>,
                <span
                  key="t"
                  className="break-all font-mono text-[12.5px] text-black"
                >
                  {b.target_url.replace(/^arddev\.in/, "")}
                </span>,
                <span
                  key="s"
                  className="font-mono text-[12.5px] text-signal-deep"
                >
                  {b.our_status}
                </span>,
              ])}
          />
        </Card>
      </div>
    </div>
  );
}
