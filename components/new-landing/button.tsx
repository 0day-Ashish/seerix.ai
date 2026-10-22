import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * The page's two button treatments, in one place -- previously each section
 * spelled the same long shadow stack out inline.
 */
const base =
  "inline-flex shrink-0 translate-y-0 items-center justify-center gap-2 rounded-xl font-body transition-all duration-150 ease-out";

/**
 * One height everywhere: nav and body buttons match. `compact` steps that down
 * below sm and restores it from sm up, for placements that sit beside smaller
 * mobile type. These are swapped rather than layered on top of `default`,
 * because two competing sizes in the same stylesheet layer resolve by rule
 * order rather than by which was passed last.
 */
const sizes = {
  default: "h-11 px-5 text-[15px]",
  compact: "h-10 px-4 text-[14px] sm:h-11 sm:px-5 sm:text-[15px]",
};

/**
 * Raised on a solid offset edge: the button lifts on hover and travels down
 * into its own shadow on press, so the depth reads as physical rather than
 * as a drop shadow.
 */
const variants = {
  // The brand mint, carried as a flat fill with a dark label -- the way the
  // mint is meant to be used. White on it reaches only 1.6:1; near-black
  // reaches 12.3:1. The solid press edge is the same hue darkened.
  primary:
    "bg-signal-bright text-signal-ink [box-shadow:0_3px_0_0_var(--color-signal-edge),0_4px_10px_rgba(10,10,11,0.14)] hover:-translate-y-0.5 hover:bg-signal-bright hover:[box-shadow:0_5px_0_0_var(--color-signal-edge),0_9px_16px_rgba(10,10,11,0.18)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_var(--color-signal-edge),0_2px_4px_rgba(10,10,11,0.12)]",
  secondary:
    "border border-black/[0.09] bg-white text-zinc-700 [box-shadow:0_3px_0_0_#e4e4e7,0_4px_10px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 hover:border-black/[0.16] hover:text-black hover:[box-shadow:0_5px_0_0_#e4e4e7,0_9px_16px_rgba(0,0,0,0.10)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#e4e4e7,0_2px_4px_rgba(0,0,0,0.07)]",
};

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export default function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <Link
      {...props}
      className={`group ${base} ${sizes[size]} ${variants[variant]} ${className}`}
    />
  );
}

/** Trailing chevron that nudges right on the parent button's hover. */
export function ButtonArrow() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5L10.5 8L6 12.5" />
    </svg>
  );
}
