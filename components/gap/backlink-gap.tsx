"use client";

import { useMemo, useState } from "react";

import {
  backlinkRows,
  backlinkTab,
  domains,
  type BacklinkRow,
  type BacklinkTab,
} from "@/components/gap/data";
import {
  Dot,
  DomainBar,
  Pager,
  SortHeader,
  Tabs,
  domainColor,
} from "@/components/gap/kit";

const TABS = ["Best", "Weak", "Strong", "Shared", "Unique", "All"] as const;
const PAGE = 12;

type SortKey =
  | "domain"
  | "as"
  | "matches"
  | "arddev.in"
  | "pixelforge.dev"
  | "buildstack.io";

/** How many of the compared domains this referring domain links to. */
function matches(r: BacklinkRow) {
  return domains.filter((d) => r.links[d] > 0).length;
}

/** Authority score as Semrush shows it: number over a thin bar. */
function As({ value }: { value: number }) {
  return (
    <span className="inline-flex w-14 flex-col items-end gap-1">
      <span className="font-mono text-[13px] text-black">{value}</span>
      <span className="h-1 w-full bg-black/[0.08]">
        <span
          className="block h-full bg-[#141416]"
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}

/** Referring domains per compared domain, as horizontal bars. */
function ReferringChart() {
  const totals = domains.map(
    (d) => backlinkRows.filter((r) => r.links[d] > 0).length,
  );
  const links = domains.map((d) =>
    backlinkRows.reduce((n, r) => n + r.links[d], 0),
  );
  const max = Math.max(...totals);
  return (
    <div className="border border-black/[0.12] bg-white">
      <div className="border-b border-black/[0.08] px-5 py-4">
        <p className="font-display text-[16px] text-black">Referring domains</p>
        <p className="mt-0.5 font-body text-[12px] text-zinc-500">
          Unique domains linking to each site, in this set
        </p>
      </div>
      <div className="flex flex-col gap-4 px-5 py-5">
        {domains.map((d, i) => (
          <div key={d}>
            <div className="flex items-baseline justify-between gap-3 font-body text-[13px]">
              <span className="flex items-center gap-2 text-black">
                <Dot domain={d} />
                {d}
              </span>
              <span className="font-mono text-[12px] text-zinc-500">
                <span className="text-black">{totals[i]}</span> domains ·{" "}
                {links[i].toLocaleString("en-US")} links
              </span>
            </div>
            <div className="mt-2 h-3 bg-black/[0.05]">
              <div
                className="h-full"
                style={{
                  width: `${(totals[i] / max) * 100}%`,
                  background: domainColor[d],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Prospects({ rows }: { rows: BacklinkRow[] }) {
  return (
    <div className="flex flex-col border border-black/[0.12] bg-white">
      <div className="border-b border-black/[0.08] px-5 py-4">
        <p className="font-display text-[16px] text-black">Best prospects</p>
        <p className="mt-0.5 font-body text-[12px] text-zinc-500">
          Link to every competitor, but not to you
        </p>
      </div>
      {rows.slice(0, 5).map((r) => (
        <div
          key={r.domain}
          className="flex items-center justify-between gap-4 border-b border-black/[0.05] px-5 py-3 last:border-b-0"
        >
          <span className="truncate font-body text-[13px] text-signal-deep">
            {r.domain}
          </span>
          <span className="font-mono text-[12px] text-zinc-500">AS {r.as}</span>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="px-5 py-6 font-body text-[13px] text-zinc-400">
          None in this set.
        </p>
      )}
    </div>
  );
}

export default function BacklinkGap() {
  const [tab, setTab] = useState<BacklinkTab>("Best");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "as",
    dir: "desc",
  });
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const counts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((t) => [
          t,
          backlinkRows.filter((r) => backlinkTab(r, t)).length,
        ]),
      ) as Record<BacklinkTab, number>,
    [],
  );

  const rows = useMemo(() => {
    const val = (r: BacklinkRow): number | string =>
      sort.key === "domain"
        ? r.domain
        : sort.key === "as"
          ? r.as
          : sort.key === "matches"
            ? matches(r)
            : r.links[sort.key];
    return backlinkRows
      .filter(
        (r) =>
          backlinkTab(r, tab) && r.domain.includes(query.toLowerCase().trim()),
      )
      .sort((a, b) => {
        const x = val(a),
          y = val(b);
        const c =
          typeof x === "string"
            ? x.localeCompare(y as string)
            : (x as number) - (y as number);
        return sort.dir === "asc" ? c : -c;
      });
  }, [tab, query, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);
  const by = (key: SortKey) => () => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <DomainBar
        title="Backlink Gap"
        description="Find the sites that link to your competitors but not to you: your best link-building prospects."
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ReferringChart />
        <Prospects
          rows={backlinkRows
            .filter((r) => backlinkTab(r, "Best"))
            .sort((a, b) => b.as - a.as)}
        />
      </section>

      <section className="mt-8 border border-black/[0.12] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
          <p className="font-display text-[18px] text-black">
            All referring domains
          </p>
          <button
            type="button"
            className="border border-black/[0.14] px-3 py-1.5 font-body text-[13px] text-black hover:border-black/40"
          >
            Export
          </button>
        </div>
        <div className="mt-3">
          <Tabs
            tabs={TABS}
            counts={counts}
            value={tab}
            onChange={(t) => {
              setTab(t);
              setPage(0);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.08] p-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by domain"
            className="w-full border border-black/[0.14] px-3 py-2 font-body text-[13px] outline-none focus:border-black sm:w-64"
          />
          {["Authority Score", "Link type", "Matches"].map((f) => (
            <span
              key={f}
              className="border border-black/[0.14] px-3 py-2 font-body text-[13px] text-zinc-600"
            >
              {f} ▾
            </span>
          ))}
          {picked.size > 0 && (
            <span className="ml-auto font-body text-[13px] text-zinc-600">
              {picked.size} selected ·{" "}
              <button
                type="button"
                className="text-signal-deep hover:underline"
              >
                Add to outreach list
              </button>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.08] bg-[#f7f6f4]">
                <th className="w-10 px-4 py-3" />
                <th className="px-3 py-3 text-left">
                  <SortHeader
                    label="Referring domain"
                    active={sort.key === "domain"}
                    dir={sort.dir}
                    onClick={by("domain")}
                  />
                </th>
                <th className="px-3 py-3">
                  <SortHeader
                    label="AS"
                    active={sort.key === "as"}
                    dir={sort.dir}
                    onClick={by("as")}
                    align="right"
                  />
                </th>
                <th className="px-3 py-3">
                  <SortHeader
                    label="Matches"
                    active={sort.key === "matches"}
                    dir={sort.dir}
                    onClick={by("matches")}
                    align="right"
                  />
                </th>
                {domains.map((d) => (
                  <th key={d} className="px-3 py-3">
                    <SortHeader
                      label={d}
                      active={sort.key === d}
                      dir={sort.dir}
                      onClick={by(d)}
                      align="right"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const on = picked.has(r.domain);
                return (
                  <tr
                    key={r.domain}
                    className={`border-b border-black/[0.05] ${on ? "bg-signal-soft/60" : "hover:bg-black/[0.015]"}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setPicked((s) => {
                            const n = new Set(s);
                            if (n.has(r.domain)) n.delete(r.domain);
                            else n.add(r.domain);
                            return n;
                          })
                        }
                        aria-label={`Select ${r.domain}`}
                        className="h-4 w-4 accent-[#ff5a1f]"
                      />
                    </td>
                    <td className="px-3 py-3 font-body text-[13.5px] text-signal-deep">
                      {r.domain}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <As value={r.as} />
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[13px] text-black">
                      {matches(r)}/{domains.length}
                    </td>
                    {domains.map((d) => (
                      <td
                        key={d}
                        className="px-3 py-3 text-right font-mono text-[13px]"
                      >
                        {r.links[d] > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-black">
                            <Dot domain={d} />
                            {r.links[d]}
                          </span>
                        ) : (
                          <span className="text-zinc-300">0</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center font-body text-[14px] text-zinc-400"
                  >
                    No domains match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pager
          page={page}
          pages={pages}
          total={rows.length}
          size={PAGE}
          onPage={setPage}
        />
      </section>
    </div>
  );
}
