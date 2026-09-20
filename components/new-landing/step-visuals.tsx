/**
 * The 3D constructions that fill the how-it-works panels, in the same CSS
 * perspective idiom as value-prop-visuals: real transforms on real elements
 * rather than images, built from front, side and cap faces.
 *
 * These sit on the dark card ground, so the palette runs the other way from
 * the value-prop set: light faces on shadow rather than ink on white. They
 * are static by intent -- no hover transforms -- so the only thing that moves
 * in the section is the panel swapping when a step is selected.
 *
 * Decorative: the step copy beside them carries the same meaning in prose.
 */

/* -------------------------------------------------------------------------
 * 01 Connect -- a key plate bridging two slabs.
 * One read-only grant spanning from Google's side to yours, lifted above the
 * ground so the single connection is the subject.
 * ---------------------------------------------------------------------- */

export function ConnectVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:900px]"
    >
      <div className="absolute inset-x-[12%] top-[18%] h-[62%] [transform-style:preserve-3d] [transform:rotateX(22deg)_rotateY(-18deg)]">
        {/* The two slabs the grant bridges. */}
        {[
          { left: "0%", tone: "bg-[#4a4a51]", side: "bg-[#2a2a30]" },
          { left: "58%", tone: "bg-[#36363B]", side: "bg-[#23232a]" },
        ].map((slab, i) => (
          <div
            key={i}
            className="absolute bottom-[14%] h-[34%] w-[42%] [transform-style:preserve-3d]"
            style={{ left: slab.left }}
          >
            <div
              className={`absolute inset-0 rounded-[6px] border border-white/[0.06] ${slab.tone}`}
            />
            <div
              className={`absolute inset-x-0 top-0 h-[14px] origin-top rounded-[3px] ${slab.side}`}
              style={{ transform: "rotateX(72deg)" }}
            />
          </div>
        ))}

        {/* The bridge itself, lifted toward the viewer. */}
        <div
          className="absolute bottom-[30%] left-1/2 h-[16%] w-[52%] -translate-x-1/2 rounded-[8px] border border-white/[0.14] bg-[#dcdddd] shadow-[0_30px_40px_-18px_rgba(0,0,0,0.75)]"
          style={{ transform: "translateX(-50%) translateZ(64px)" }}
        >
          <div className="flex h-full items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1c1c21]/70" />
            <span className="h-1.5 w-[34%] rounded-full bg-[#1c1c21]/45" />
          </div>
        </div>

        {/* Ground the slabs stand on. */}
        <div className="absolute inset-x-[-8%] bottom-[12%] h-px bg-white/[0.10]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 02 Study -- stacked layers being worked through.
 * Receding plates of decreasing opacity, so the continuous background pass
 * reads as depth through a site rather than a single snapshot.
 * ---------------------------------------------------------------------- */

export function StudyVisual() {
  const layers = [
    { z: 0, tone: "bg-[#2a2a30]", border: "border-white/[0.06]", rows: 2 },
    { z: 42, tone: "bg-[#36363B]", border: "border-white/[0.08]", rows: 3 },
    { z: 84, tone: "bg-[#4a4a51]", border: "border-white/[0.12]", rows: 3 },
    { z: 126, tone: "bg-[#dcdddd]", border: "border-white/20", rows: 4 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1000px]"
    >
      <div className="absolute inset-x-[16%] top-[16%] h-[66%] [transform-style:preserve-3d] [transform:rotateX(34deg)_rotateY(-16deg)]">
        {layers.map((layer, i) => (
          <div
            key={i}
            className={`absolute inset-x-0 top-[22%] h-[46%] rounded-[10px] border ${layer.border} ${layer.tone} shadow-[0_26px_36px_-22px_rgba(0,0,0,0.8)]`}
            style={{ transform: `translateZ(${layer.z}px)` }}
          >
            {/* Only the front plate carries detail; the rest read as mass. */}
            {i === layers.length - 1 && (
              <div className="flex h-full flex-col justify-center gap-2 px-4">
                {Array.from({ length: layer.rows }).map((_, r) => (
                  <span
                    key={r}
                    className={`h-1.5 rounded-full ${
                      r === 1 ? "w-[68%] bg-[#1c1c21]/70" : "w-[44%] bg-[#1c1c21]/25"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 03 Ask -- an answer plate standing on its evidence.
 * The diagnosis is lifted clear of the rows that produced it, which are set
 * back and down, so the citation relationship is spatial.
 * ---------------------------------------------------------------------- */

export function AskVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:900px]"
    >
      <div className="absolute inset-x-[14%] top-[16%] h-[66%] [transform-style:preserve-3d] [transform:rotateX(26deg)_rotateY(-14deg)]">
        {/* Evidence rows, lying back on the ground. */}
        <div
          className="absolute inset-x-0 bottom-[8%] flex flex-col gap-2.5"
          style={{ transform: "translateZ(0px)" }}
        >
          {[0, 1, 2].map((r) => (
            <span
              key={r}
              className="flex h-[26px] items-center gap-2 rounded-[6px] border border-white/[0.07] bg-[#2a2a30] px-3"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcdddd]/45" />
              <span
                className={`h-1.5 rounded-full bg-white/15 ${
                  r === 0 ? "w-[52%]" : r === 1 ? "w-[40%]" : "w-[32%]"
                }`}
              />
            </span>
          ))}
        </div>

        {/* The answer, standing clear of them. */}
        <div
          className="absolute inset-x-[6%] top-[4%] h-[34%] rounded-[10px] border border-white/20 bg-[#dcdddd] shadow-[0_34px_44px_-20px_rgba(0,0,0,0.8)]"
          style={{ transform: "translateZ(96px)" }}
        >
          <div className="flex h-full flex-col justify-center gap-2 px-4">
            <span className="h-2 w-[72%] rounded-full bg-[#1c1c21]/75" />
            <span className="h-2 w-[48%] rounded-full bg-[#1c1c21]/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
