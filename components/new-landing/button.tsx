import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * The site's two buttons, in one place: a squared-off pill with three
 * blurred colour fields drifting inside it, so the light in each button
 * never sits still. `primary` is ink with a faint glow; `secondary` is a
 * light gradient with a stronger one.
 */

/** Full class strings, so Tailwind can see every one. */
const glows = {
  primary: [
    "left-0 bg-[#bdb4f8]/30 [animation:seerix-glow-drift-1_8s_ease-in-out_infinite]",
    "left-1/2 bg-[#f6d9c6]/25 [animation:seerix-glow-drift-2_10s_ease-in-out_infinite]",
    "right-0 bg-[#8f84f0]/30 [animation:seerix-glow-drift-3_9s_ease-in-out_infinite]",
  ],
  secondary: [
    "left-0 bg-[#bdb4f8]/40 [animation:seerix-glow-drift-1_8s_ease-in-out_infinite]",
    "left-1/2 bg-[#f6d9c6]/45 [animation:seerix-glow-drift-2_10s_ease-in-out_infinite]",
    "right-0 bg-[#8f84f0]/35 [animation:seerix-glow-drift-3_9s_ease-in-out_infinite]",
  ],
};

export type ButtonVariant = keyof typeof glows;

/** The drifting fields; sits under the label inside any button. */
export function Glow({ variant = "primary" }: { variant?: ButtonVariant }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-clip rounded-[inherit]"
    >
      {glows[variant].map((g) => (
        <span
          key={g}
          className={`absolute -top-6 size-24 rounded-full blur-md ${g}`}
        />
      ))}
    </span>
  );
}

const base =
  "group relative inline-flex shrink-0 items-center justify-center overflow-clip rounded-md border font-body font-medium shadow-sm transition-all duration-150 hover:brightness-105 active:brightness-95 disabled:pointer-events-none disabled:opacity-60";

/**
 * One height everywhere. `compact` steps down below sm for placements that
 * sit beside smaller mobile type. Swapped rather than layered, because two
 * competing sizes in the same layer resolve by rule order.
 */
const sizes = {
  default: "h-10 px-6 text-[14px]",
  compact: "h-9 px-4 text-[13.5px] sm:h-10 sm:px-6 sm:text-[14px]",
  // The app's denser screens: dashboard, settings and the gap tools.
  app: "h-9 gap-2 px-3.5 text-[13px]",
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-signal-ink text-white",
  secondary:
    "border-black/[0.10] bg-gradient-to-b from-white to-black/[0.04] text-zinc-900",
};

/** The classes, for a `<button>` or anything that is not a link. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: keyof typeof sizes = "default",
) {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

/** Label wrapper: lifts the content above the glow. */
export function ButtonLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
    </span>
  );
}

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
};

export default function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Link {...props} className={`${buttonClass(variant, size)} ${className}`}>
      <Glow variant={variant} />
      <ButtonLabel>{children}</ButtonLabel>
    </Link>
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
