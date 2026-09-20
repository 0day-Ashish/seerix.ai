"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Next 16 passes `retry` (not the older `reset`)
 * to re-render the segment, so the recovery button calls that.
 *
 * Client Component by requirement: error boundaries cannot be server-rendered.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // No error reporting service is wired up yet; the console keeps the digest
    // reachable in the meantime.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="px-6 pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-[13px] font-medium tracking-[0.02em] text-zinc-400">
            Error
          </p>

          <h1 className="mt-4 max-w-2xl font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
            Something went wrong.
          </h1>

          <p className="mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-zinc-500">
            The page failed to load. Trying again often clears it; if it keeps
            happening, send us the reference below and we will look into it.
          </p>

          {/* The digest is the only handle support has on a production error,
              so it is surfaced rather than swallowed. */}
          {error.digest && (
            <p className="mt-6 font-mono text-[13px] text-zinc-400">
              Reference: {error.digest}
            </p>
          )}

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#36363B] px-5 py-2.5 font-body text-[15px] text-white transition-colors duration-200 hover:bg-[#55555d]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.12] px-5 py-2.5 font-body text-[15px] text-black transition-colors duration-200 hover:border-black/[0.3]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
