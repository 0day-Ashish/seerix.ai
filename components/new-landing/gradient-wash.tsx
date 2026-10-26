/* Fine film grain, drawn once as SVG turbulence and tiled. */
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** The colour fields, each drifting on its own loop so the wash never repeats in step. */
const blobs = [
  // Lilac, the brand fill, carrying most of the field.
  "-left-[15%] -top-[25%] h-[85%] w-[70%] bg-[#bdb4f8] [animation:seerix-wash-a_19s_ease-in-out_infinite_alternate]",
  // Violet for depth, kept off the centre so the content stays light.
  "-right-[20%] top-[5%] h-[75%] w-[60%] bg-[#8f84f0] opacity-80 [animation:seerix-wash-b_23s_ease-in-out_infinite_alternate]",
  // Warm peach: ties the wash back to the ivory page ground.
  "-bottom-[30%] -left-[10%] h-[80%] w-[60%] bg-[#f6d9c6] [animation:seerix-wash-c_27s_ease-in-out_infinite_alternate]",
  // Rose-lilac between them, so the hues blend rather than meet.
  "bottom-[-20%] right-[5%] h-[70%] w-[55%] bg-[#e7c9f2] [animation:seerix-wash-a_31s_ease-in-out_infinite_alternate-reverse]",
  // An ivory highlight that wanders, so the light moves as well as the colour.
  "left-[30%] top-[20%] h-[50%] w-[40%] bg-[#f7f6f2] opacity-70 [animation:seerix-wash-b_17s_ease-in-out_infinite_alternate-reverse]",
];

/**
 * The brand wash: a slow-moving gradient in the lilac theme, standing in for
 * the old static green image. Soft colour fields drift under one shared blur,
 * with a grain over the top so it reads as printed rather than as a flat CSS
 * gradient. CSS only, so it stays a server component, and the global
 * reduced-motion rule holds it still. Fills its nearest positioned parent.
 */
export default function GradientWash({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-[#d8d1fa] ${className}`}
    >
      {/* One blur over every field: cheaper than blurring each, and the
          fields bleed into each other the way a real gradient does. */}
      <div className="absolute inset-0 blur-[60px] saturate-[1.15]">
        {blobs.map((blob) => (
          <span
            key={blob}
            className={`absolute rounded-full will-change-transform ${blob}`}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{ backgroundImage: grain }}
      />
    </div>
  );
}
