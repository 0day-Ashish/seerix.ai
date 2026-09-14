"use client";

import Link from "next/link";
import { useState } from "react";

export default function InfoBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full border-b border-black/[0.06] bg-zinc-50/80 font-body">
      <div className="relative mx-auto flex min-h-9 max-w-6xl items-center justify-center gap-1.5 px-6 py-2 text-center text-[13px] text-zinc-500">
        <p>
          Early access: design-partner seats open.{" "}
          <Link
            href="mailto:hello@seerix.ai"
            className="text-black underline underline-offset-2 transition-colors hover:text-zinc-500"
          >
            Get in touch
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-6 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-black/[0.04] hover:text-black"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
