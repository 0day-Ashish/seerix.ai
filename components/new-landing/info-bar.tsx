"use client";

import Link from "next/link";
import { useState } from "react";

export default function InfoBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-3 font-display">
      <div className="relative flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#36363B]/10 px-12 py-1.5 text-center text-[13px] text-[#23232a] shadow-sm shadow-black/5">
        <p>
          Early access: design-partner seats open.{" "}
          <Link
            href="mailto:hello@seerix.ai"
            className="font-medium text-[#36363B] underline underline-offset-2 transition-colors hover:text-[#23232a]"
          >
            Get in touch
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-[#23232a]/70 transition-colors hover:bg-[#36363B]/10 hover:text-[#23232a]"
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
