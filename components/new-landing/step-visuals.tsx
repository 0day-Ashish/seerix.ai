/**
 * The three constructions that fill the how-it-works panels.
 *
 * These deliberately avoid the tilted-plate camera the features bento uses:
 * an earlier pass gave them the same rotateX plates on a dark ground and they
 * read as repeats of the tiles further down the page. So the forms here are
 * ones that section does not own -- a pipe between two standing blocks, a
 * board with a trace drawing across it, and a vertical tower at eye level.
 *
 * Nothing rotates. Each structure is fixed in space and what moves is the
 * data passing through it: packets along the pipe, a trace advancing across
 * the board. The form is the frame; the motion is the reading.
 *
 * Each scene runs a continuous ambient loop, declared as keyframes in
 * globals.css so the components stay server-rendered with no JS. There are no
 * hover transforms: the motion is the same whether or not a pointer is near
 * it, and the global prefers-reduced-motion rule switches every loop off.
 *
 * Decorative: the step copy beside them carries the same meaning in prose.
 */

/* -------------------------------------------------------------------------
 * 01 Connect -- a pipe running from Google's side into yours.
 * The structure never moves: two end blocks stood up in Z with a channel
 * between them. What is live is the traffic -- packets travelling the pipe
 * one way only, which is the read-only grant made visible.
 * ---------------------------------------------------------------------- */

export function ConnectVisual() {
  const packets = [0, 1, 2, 3];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden [perspective:820px]"
    >
      <div
        // Nudged below centre: the angled base faces hang under the blocks,
        // so dead-centre reads as sitting high in the stage.
        className="relative mt-14 h-[112px] w-[240px] [transform-style:preserve-3d] lg:mt-20"
        style={{ transform: "rotateX(24deg)  rotateY(-26deg)" }}
      >
        {/* Source block, standing at the far end. */}
        <div
          className="absolute left-0 top-1/2 h-[66px] w-[46px] -translate-y-1/2 rounded-lg border border-white/[0.14] bg-[#36363B] [transform-style:preserve-3d]"
          style={{ transform: "translateY(-50%) translateZ(26px)" }}
        >
          <span className="absolute inset-x-0 -bottom-[10px] h-[20px] origin-top rounded-b-lg bg-[#23232a] [transform:rotateX(-78deg)]" />
          <span className="flex h-full flex-col justify-center gap-2 px-3">
            <span className="h-1.5 w-[70%] rounded-full bg-white/25" />
            <span className="h-1.5 w-[44%] rounded-full bg-white/12" />
          </span>
        </div>

        {/* The channel the traffic runs along. */}
        <div
          className="absolute left-[46px] right-[46px] top-1/2 h-[13px] -translate-y-1/2 overflow-hidden rounded-full border border-white/[0.10] bg-white/[0.05]"
          style={{ transform: "translateY(-50%) translateZ(26px)" }}
        >
          {packets.map((n) => (
            <span
              key={n}
              className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#dcdddd]"
              style={{
                animation: `seerix-packet 3.2s linear ${n * 0.8}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Destination block: Seerix's side, lit. */}
        <div
          className="absolute right-0 top-1/2 h-[66px] w-[46px] -translate-y-1/2 rounded-lg border border-white/25 bg-[#dcdddd] shadow-[0_20px_34px_-16px_rgba(0,0,0,0.9)] [transform-style:preserve-3d]"
          style={{ transform: "translateY(-50%) translateZ(26px)" }}
        >
          <span className="absolute inset-x-0 -bottom-[10px] h-[20px] origin-top rounded-b-lg bg-[#9a9a9e] [transform:rotateX(-78deg)]" />
          <span className="flex h-full flex-col justify-center gap-2 px-3">
            {[0, 1, 2].map((r) => (
              <span
                key={r}
                className="h-1.5 rounded-full bg-[#1c1c21]/60"
                style={{
                  width: r === 1 ? "70%" : "46%",
                  animation: `seerix-land 3.2s ease-out ${r * 0.26}s infinite`,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 02 Study -- a standing board with a trace drawing itself across it.
 * The board is fixed in space; the line advances, and a marker rides its
 * leading edge. Continuous background analysis as a reading being taken, not
 * as an object being turned.
 * ---------------------------------------------------------------------- */

export function StudyVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden [perspective:900px]"
    >
      <div
        className="relative h-[124px] w-[226px] [transform-style:preserve-3d]"
        style={{ transform: "rotateX(14deg) rotateY(-20deg)" }}
      >
        {/* The board face. */}
        <div className="absolute inset-0 rounded-xl border border-white/[0.12] bg-[#2a2a30]">
          {/* Grid the trace is read against. */}
          {[26, 52, 78].map((y) => (
            <span
              key={y}
              className="absolute inset-x-4 h-px bg-white/[0.06]"
              style={{ top: `${y}%` }}
            />
          ))}

          {/* The trace, drawing itself left to right on a loop. */}
          <svg
            viewBox="0 0 240 150"
            className="absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M18 104 L52 92 L86 98 L120 62 L154 74 L188 38 L222 46"
              stroke="#dcdddd"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                animation: "seerix-trace 6s ease-in-out infinite",
              }}
            />
          </svg>

          {/* Readout that ticks as the trace advances. */}
          <span className="absolute left-4 top-3 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#dcdddd]"
              style={{ animation: "seerix-land 2.1s ease-out infinite" }}
            />
            <span className="h-1.5 w-[54px] rounded-full bg-white/20" />
          </span>
        </div>

        {/* Side face, giving the board real thickness. */}
        <div
          className="absolute inset-y-0 right-0 w-[16px] origin-right rounded-r-xl border-y border-r border-white/[0.08] bg-[#1f1f25]"
          style={{ transform: "rotateY(74deg)" }}
        />

        {/* Base it stands on. */}
        <div
          className="absolute inset-x-6 -bottom-[13px] h-[13px] origin-top rounded-b-lg bg-[#23232a]"
          style={{ transform: "rotateX(-72deg)" }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 03 Ask -- a vertical tower seen at eye level.
 * Evidence stacked upward into a single conclusion at the top, drawn flat and
 * face-on: the camera is the opposite of the overhead plan above it and of
 * the tilted planes in the features bento.
 * ---------------------------------------------------------------------- */

export function AskVisual() {
  const courses = [
    { w: "86%", tone: "bg-white/[0.07]", label: "w-[38%]" },
    { w: "74%", tone: "bg-white/[0.10]", label: "w-[46%]" },
    { w: "62%", tone: "bg-white/[0.14]", label: "w-[34%]" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden px-10"
    >
      {/* The conclusion, capping the stack. */}
      <div className="flex w-[46%] flex-col gap-1.5 rounded-lg bg-[#dcdddd] px-3.5 py-2.5 shadow-[0_18px_30px_-16px_rgba(0,0,0,0.9)]">
        <span className="h-1.5 w-[78%] rounded-full bg-[#1c1c21]/75" />
        <span className="h-1.5 w-[46%] rounded-full bg-[#1c1c21]/35" />
      </div>

      {/* The join: the conclusion rests on what is below it. */}
      <span className="h-2.5 w-px bg-white/20" />

      {/* Evidence courses, widening toward the base. */}
      {courses.map((course, i) => (
        <div
          key={i}
          style={{
            width: course.w,
            // Staggered upward, so the stack settles course by course.
            animation: `seerix-course-rise 4.2s ease-in-out ${i * 0.35}s infinite`,
          }}
          className={`flex items-center gap-2.5 rounded-md border border-white/[0.07] px-3 py-[7px] ${course.tone}`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcdddd]/55" />
          <span className={`h-1.5 rounded-full bg-white/20 ${course.label}`} />
        </div>
      ))}

      {/* Base line the stack stands on. */}
      <span className="mt-0.5 h-px w-[88%] bg-white/[0.12]" />
    </div>
  );
}
