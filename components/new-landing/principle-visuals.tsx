/**
 * The three column visuals, drawn in plain SVG rather than shipped as images,
 * matching how hero-panel.tsx draws the product still. Each one depicts the
 * mechanism its column describes instead of standing in as a generic icon, and
 * all three share one 200x120 viewBox and grid so the row sits on a baseline.
 *
 * Decorative: the adjacent heading and paragraph carry the meaning, so each is
 * hidden from assistive tech.
 */

const viewBox = "0 0 200 120";
/* Capped so the 200-unit viewBox renders near 1:1 and the label type stays
   at its intended size instead of scaling up with the column. */
const svgClass = "h-auto w-full max-w-[220px] text-[#36363B]";

/**
 * Your own property feeding the answer directly, with the third-party index
 * sitting off to the side, unconnected. The missing arrow is the point.
 */
export function OwnDataVisual() {
  return (
    <svg
      viewBox={viewBox}
      className={svgClass}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id="pv-arrow-a"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 1L7 4L0 7Z" fill="currentColor" />
        </marker>
      </defs>

      {/* Search Console, the source of record */}
      <rect
        x="2"
        y="30"
        width="84"
        height="34"
        rx="6"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <text
        x="44"
        y="51"
        textAnchor="middle"
        fontSize="9.5"
        fill="currentColor"
        fillOpacity="0.75"
      >
        Search Console
      </text>

      <line
        x1="90"
        y1="47"
        x2="112"
        y2="47"
        stroke="currentColor"
        strokeOpacity="0.5"
        markerEnd="url(#pv-arrow-a)"
      />

      {/* The answer it produces */}
      <rect
        x="116"
        y="30"
        width="82"
        height="34"
        rx="6"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <text
        x="157"
        y="51"
        textAnchor="middle"
        fontSize="9.5"
        fill="currentColor"
        fillOpacity="0.75"
      >
        Your answer
      </text>

      {/* Third-party index: drawn, but deliberately joined to nothing */}
      <rect
        x="2"
        y="82"
        width="84"
        height="30"
        rx="6"
        strokeDasharray="3 3"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <text
        x="44"
        y="101"
        textAnchor="middle"
        fontSize="9"
        fill="currentColor"
        fillOpacity="0.35"
      >
        Third-party index
      </text>
    </svg>
  );
}

/**
 * The trade the column claims: four chart bars on the left give way to a single
 * written sentence on the right.
 */
export function AnswerVisual() {
  const bars = [30, 46, 38, 54];

  return (
    <svg
      viewBox={viewBox}
      className={svgClass}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id="pv-arrow-b"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 1L7 4L0 7Z" fill="currentColor" />
        </marker>
      </defs>

      {/* The dashboard being traded away, faded to match its status */}
      {bars.map((height, index) => (
        <rect
          key={index}
          x={6 + index * 17}
          y={78 - height}
          width="11"
          height={height}
          rx="2"
          fill="currentColor"
          fillOpacity="0.16"
        />
      ))}
      <line
        x1="4"
        y1="80"
        x2="76"
        y2="80"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <text
        x="40"
        y="96"
        textAnchor="middle"
        fontSize="10"
        fill="currentColor"
        fillOpacity="0.35"
      >
        Charts to read
      </text>

      <line
        x1="84"
        y1="52"
        x2="112"
        y2="52"
        stroke="currentColor"
        strokeOpacity="0.5"
        markerEnd="url(#pv-arrow-b)"
      />

      {/* The sentence you get instead: three ruled lines, last one short */}
      <rect
        x="116"
        y="26"
        width="64"
        height="52"
        rx="6"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <line
        x1="126"
        y1="42"
        x2="170"
        y2="42"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="126"
        y1="52"
        x2="170"
        y2="52"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="126"
        y1="62"
        x2="152"
        y2="62"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="148"
        y="96"
        textAnchor="middle"
        fontSize="10"
        fill="currentColor"
        fillOpacity="0.55"
      >
        One sentence
      </text>
    </svg>
  );
}

/**
 * A diagnosis with its sources pinned underneath and a confidence reading, the
 * same shape the real evidence rows take in the hero panel.
 */
export function EvidenceVisual() {
  const rows = [
    { label: "Search Console", y: 58 },
    { label: "SERP snapshot", y: 78 },
    { label: "Crawl", y: 98 },
  ];

  return (
    <svg
      viewBox="0 0 200 112"
      className={svgClass}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* The diagnosis */}
      <rect
        x="4"
        y="8"
        width="192"
        height="32"
        rx="6"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <text
        x="16"
        y="28"
        fontSize="11"
        fill="currentColor"
        fillOpacity="0.75"
      >
        Diagnosis
      </text>

      {/* Confidence reading, the honest part of the claim */}
      <rect
        x="132"
        y="16"
        width="52"
        height="16"
        rx="8"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <text
        x="158"
        y="27"
        textAnchor="middle"
        fontSize="9"
        fill="currentColor"
        fillOpacity="0.6"
      >
        Confidence
      </text>

      {/* Each source pinned to the diagnosis by its own elbow */}
      {rows.map((row) => (
        <g key={row.label}>
          <path
            d={`M14 40 V ${row.y - 4} H 24`}
            stroke="currentColor"
            strokeOpacity="0.25"
          />
          <circle
            cx="28"
            cy={row.y - 4}
            r="2.5"
            fill="currentColor"
            fillOpacity="0.45"
          />
          <text
            x="38"
            y={row.y}
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.55"
          >
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
