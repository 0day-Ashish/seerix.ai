type BlockRevealProps = {
  children: string;
  className?: string;
};

/**
 * Renders a heading as plain text.
 *
 * This used to sweep a solid block across each line on scroll into view. Every
 * section heading on the site used it, so the same animation fired eight or
 * nine times down a single page and stopped reading as emphasis. The component
 * is kept as a passthrough rather than removed, so the call sites keep their
 * shape and a per-heading treatment can be reintroduced in one place.
 */
export function BlockReveal({ children, className = "" }: BlockRevealProps) {
  return <span className={`block ${className}`}>{children}</span>;
}

export default BlockReveal;
