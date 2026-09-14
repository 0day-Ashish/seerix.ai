type SectionLabelProps = {
  /** Short eyebrow, e.g. "How it works". */
  name: string;
  /** Override the default tone, e.g. on an inverted panel. */
  className?: string;
};

/**
 * Quiet eyebrow above a section heading. Replaces the earlier sticky numbered
 * bar: it scrolls with its section, claims one line, and carries no rules or
 * background of its own so the surrounding whitespace does the separating.
 */
export default function SectionLabel({
  name,
  className = "text-zinc-400",
}: SectionLabelProps) {
  return (
    <p className={`font-body text-[13px] font-medium tracking-[0.02em] ${className}`}>
      {name}
    </p>
  );
}
