/**
 * The four visuals behind the "What Seerix does" bento.
 *
 * Built from layered DOM elements in CSS 3D rather than images or canvases:
 * four live WebGL contexts in one viewport is real cost, while transforms cost
 * nothing and render on the server. Each scene tilts further on hover through
 * the parent tile's `group`.
 *
 * Each tile deliberately uses a DIFFERENT form and camera -- a splitting fan,
 * an extruded bar chart, two facing boards, a fanned card stack. An earlier
 * pass gave all four the same plane style on one shared rotation, and they
 * collapsed into the same picture of tilted bars. The job each one describes
 * is a different shape, so the drawing is too.
 *
 * Decorative: each tile's heading and paragraph carry the meaning in prose.
 */

/* -------------------------------------------------------------------------
 * 01 Diagnose -- one figure splitting into three causes.
 * A head node with a sparkline, three branches fanning below it at different
 * angles. Reads as division, which is what the job does.
 * ---------------------------------------------------------------------- */

export function DiagnoseVisual() {
  const branches = [
    { rotate: -20, width: "w-[52%]", fill: "bg-[#36363B]/70", top: "52%", left: "6%" },
    { rotate: 0, width: "w-[44%]", fill: "bg-[#36363B]/45", top: "68%", left: "20%" },
    { rotate: 18, width: "w-[36%]", fill: "bg-[#36363B]/25", top: "82%", left: "34%" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1000px]"
    >
      <div className="absolute inset-x-[14%] top-[10%] h-[74%] [transform-style:preserve-3d] [transform:rotateX(32deg)] transition-transform duration-500 ease-out group-hover:[transform:rotateX(24deg)_translateZ(16px)]">
        {/* The drop being explained: one card, one falling sparkline. */}
        <div
          className="absolute left-[16%] top-0 h-[74px] w-[62%] rounded-xl border border-black/[0.09] bg-white shadow-[0_26px_40px_-22px_rgba(0,0,0,0.5)]"
          style={{ transform: "translateZ(70px)" }}
        >
          <div className="flex h-full flex-col justify-center gap-2.5 px-4">
            <span className="h-1.5 w-[40%] rounded-full bg-black/[0.14]" />
            <div className="flex items-end gap-[3px]">
              {[20, 24, 21, 26, 17, 11, 6, 4].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`flex-1 rounded-[2px] ${
                    i > 4 ? "bg-[#36363B]/75" : "bg-black/[0.10]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Three causes, each angled away from the node above. */}
        {branches.map((b, i) => (
          <div
            key={i}
            className={`absolute h-[26px] ${b.width} rounded-lg border border-black/[0.08] bg-white/90 shadow-[0_14px_22px_-14px_rgba(0,0,0,0.4)]`}
            style={{
              top: b.top,
              left: b.left,
              transform: `translateZ(${30 - i * 10}px) rotate(${b.rotate}deg)`,
            }}
          >
            <div className="flex h-full items-center px-3">
              <span className={`h-1.5 w-[70%] rounded-full ${b.fill}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 02 Prioritize -- an extruded bar chart.
 * Upright columns of descending height with visible side faces, so the
 * ranking is read as physical mass rather than as another list of rows.
 * ---------------------------------------------------------------------- */

export function PrioritizeVisual() {
  const bars = [
    { h: 100, tone: "bg-[#36363B]", side: "bg-[#23232a]" },
    { h: 74, tone: "bg-[#4a4a51]", side: "bg-[#36363B]" },
    { h: 52, tone: "bg-[#888084]", side: "bg-[#6d666a]" },
    { h: 34, tone: "bg-[#c9c7ca]", side: "bg-[#b0aeb1]" },
    { h: 20, tone: "bg-[#e0dfe1]", side: "bg-[#cdcbcf]" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:800px]"
    >
      <div className="absolute inset-x-[16%] top-[14%] h-[66%] [transform-style:preserve-3d] [transform:rotateX(16deg)_rotateY(-20deg)] transition-transform duration-500 ease-out group-hover:[transform:rotateX(12deg)_rotateY(-14deg)]">
        <div className="absolute bottom-0 flex h-full w-full items-end gap-[9%]">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="relative flex-1 [transform-style:preserve-3d]"
              style={{ height: `${bar.h}%` }}
            >
              {/* Front face */}
              <div className={`absolute inset-0 rounded-t-[3px] ${bar.tone}`} />
              {/* Side face, rotated out to give the column depth */}
              <div
                className={`absolute inset-y-0 right-0 w-[12px] origin-right rounded-t-[3px] ${bar.side}`}
                style={{ transform: "rotateY(72deg)" }}
              />
              {/* Cap */}
              <div
                className={`absolute inset-x-0 top-0 h-[12px] origin-top rounded-[2px] ${bar.side} opacity-80`}
                style={{ transform: "rotateX(70deg)" }}
              />
            </div>
          ))}
        </div>
        {/* Ground line the columns stand on */}
        <div className="absolute inset-x-[-6%] bottom-0 h-px bg-black/[0.12]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 03 Watch -- two facing boards with a result crossing between them.
 * Angled toward each other like an open book, so the gap between "before"
 * and "after" is the subject.
 * ---------------------------------------------------------------------- */

export function WatchVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:700px]"
    >
      {/* Fixed width rather than a percentage: this tile spans four columns,
          and a percentage-sized scene stretches the boards into bands that
          overflow the tile. The scene keeps its shape and centres instead. */}
      {/* Centred by margin rather than a translate, so the hover transform is
          free to carry depth alone -- overriding a centring translate here
          shifted the whole scene sideways on hover. */}
      <div className="absolute inset-x-0 top-[14%] mx-auto h-[64%] w-[300px] [transform-style:preserve-3d] transition-transform duration-500 ease-out group-hover:[transform:translateZ(14px)]">
        {/* Left board, hinged open toward the viewer. */}
        <div
          className="absolute left-0 top-0 h-full w-[44%] origin-right rounded-lg border border-black/[0.09] bg-white/95 shadow-[0_20px_30px_-20px_rgba(0,0,0,0.45)]"
          style={{ transform: "rotateY(26deg)" }}
        >
          <div className="flex h-full flex-col justify-center gap-3 px-3.5">
            {[0, 1, 2, 3].map((r) => (
              <span
                key={r}
                className={`h-1.5 rounded-full ${
                  r === 3 ? "w-[76%] bg-[#36363B]/70" : "w-[54%] bg-black/[0.10]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right board, mirrored. */}
        <div
          className="absolute right-0 top-0 h-full w-[44%] origin-left rounded-lg border border-black/[0.09] bg-white/95 shadow-[0_20px_30px_-20px_rgba(0,0,0,0.45)]"
          style={{ transform: "rotateY(-26deg)" }}
        >
          <div className="flex h-full flex-col justify-center gap-3 px-3.5">
            {[0, 1, 2, 3].map((r) => (
              <span
                key={r}
                className={`h-1.5 rounded-full ${
                  r === 0 ? "w-[76%] bg-[#36363B]/70" : "w-[54%] bg-black/[0.10]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* The result that climbed, lifted between the two boards. */}
        <div
          className="absolute left-1/2 top-[12%] h-[30px] w-[30%] -translate-x-1/2 rounded-lg bg-[#36363B] shadow-[0_22px_28px_-14px_rgba(0,0,0,0.55)]"
          style={{ transform: "translateX(-50%) translateZ(74px)" }}
        >
          <div className="flex h-full items-center justify-center gap-1.5">
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9.5V2.5M3 5.5L6 2.5L9 5.5" />
            </svg>
            <span className="h-1.5 w-[38%] rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 04 Create -- three variants fanned like dealt cards.
 * Rotated around a shared bottom origin rather than stacked in Z, so the
 * "three variants" reads as a spread of options.
 * ---------------------------------------------------------------------- */

export function CreateVisual() {
  const variants = [
    { rotate: -16, z: 0, tone: "bg-black/[0.10]", head: "w-[52%]" },
    { rotate: 0, z: 34, tone: "bg-black/[0.16]", head: "w-[62%]" },
    { rotate: 16, z: 68, tone: "bg-[#36363B]/70", head: "w-[70%]" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:900px]"
    >
      <div className="absolute inset-x-0 top-[12%] h-[70%] [transform-style:preserve-3d] [transform:rotateX(18deg)] transition-transform duration-500 ease-out group-hover:[transform:rotateX(12deg)_translateZ(14px)]">
        {variants.map((v, i) => (
          <div
            key={i}
            className="absolute bottom-0 left-1/2 h-[82%] w-[128px] origin-bottom rounded-xl border border-black/[0.09] bg-white shadow-[0_24px_34px_-20px_rgba(0,0,0,0.45)]"
            style={{
              transform: `translateX(-50%) rotate(${v.rotate}deg) translateZ(${v.z}px)`,
            }}
          >
            <div className="flex h-full flex-col gap-2 px-3.5 pt-4">
              <span className={`h-2 rounded-full ${v.tone} ${v.head}`} />
              <span className="h-1.5 w-[80%] rounded-full bg-black/[0.07]" />
              <span className="h-1.5 w-[66%] rounded-full bg-black/[0.07]" />
              <span className="mt-auto mb-4 h-1.5 w-[40%] rounded-full bg-black/[0.05]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
