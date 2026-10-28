/**
 * Light rising off the product panel: a wide lilac glow behind its top edge,
 * with violet at the core and a warm peach rim, breathing slowly. Sits
 * inside the panel's wrapper, behind the panel and the copy above it. CSS
 * only; the global reduced-motion rule holds it still.
 *
 * `className` places it elsewhere (the closing CTA centres it behind its
 * copy); the parent needs `isolate` so -z-10 lands behind the content but
 * not behind the section's ground.
 */
export default function HeroGlow({
  className = "inset-x-[-6%] -top-24 h-72 sm:-top-32 sm:h-[24rem]",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 ${className}`}
    >
      <div className="absolute inset-0 blur-[70px]">
        <span className="absolute inset-x-[8%] top-[22%] h-[60%] rounded-[50%] bg-[#bdb4f8] opacity-80 [animation:seerix-glow_9s_ease-in-out_infinite_alternate]" />
        <span className="absolute inset-x-[30%] top-[34%] h-[42%] rounded-[50%] bg-[#8f84f0] opacity-70 [animation:seerix-glow_11s_ease-in-out_infinite_alternate-reverse]" />
        <span className="absolute left-[2%] top-[40%] h-[40%] w-[28%] rounded-[50%] bg-[#f6d9c6] opacity-70 [animation:seerix-wash-c_23s_ease-in-out_infinite_alternate]" />
        <span className="absolute right-[2%] top-[38%] h-[40%] w-[26%] rounded-[50%] bg-[#e7c9f2] opacity-80 [animation:seerix-wash-b_19s_ease-in-out_infinite_alternate]" />
      </div>
    </div>
  );
}
