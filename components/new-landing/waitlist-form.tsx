"use client";

import { useActionState } from "react";

import { joinWaitlist, type WaitlistState } from "@/app/waitlist/actions";

const initialState: WaitlistState = { status: "idle" };

/**
 * The hero's primary action: one field and one button, sharing a row on all
 * but the narrowest screens. State comes back from the Server Action rather
 * than living in the client, so a rejected submit keeps what was typed and the
 * same validation governs a direct POST.
 */
export default function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="inline-flex items-center gap-2.5 rounded-[10px] border border-black/[0.09] bg-white px-4 py-3 font-body text-[14px] text-black sm:text-[15px]"
      >
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8.5L6.5 12L13 4.5" />
        </svg>
        {state.message}
      </p>
    );
  }

  const invalid = state.status === "error";

  return (
    <form action={action} className="max-w-md">
      {/* Hidden from real users; bots fill it and are answered with a success
          that never reaches the delivery step. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@company.com"
            aria-invalid={invalid}
            aria-describedby={invalid ? "waitlist-error" : undefined}
            className={`h-10 w-full rounded-[10px] border bg-white px-3.5 font-body text-[14px] text-black transition-colors duration-200 placeholder:text-zinc-400 focus:outline-none sm:h-11 sm:text-[15px] ${
              invalid
                ? "border-black/[0.28] focus:border-black/[0.45]"
                : "border-black/[0.09] hover:border-black/[0.16] focus:border-black/[0.35]"
            }`}
          />
        </div>

        {/* Not the shared Button: that one is a Link, and this submits. The
            treatment is copied so the two still read as one system. */}
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-10 shrink-0 translate-y-0 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-4 font-body text-[14px] text-white transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#1c1c21,0_4px_10px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_5px_0_0_#1c1c21,0_9px_16px_rgba(0,0,0,0.22)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:px-5 sm:text-[15px]"
        >
          {pending ? "Joining..." : "Join waitlist"}
          {!pending && (
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
          )}
        </button>
      </div>

      {invalid && (
        <p
          id="waitlist-error"
          role="alert"
          className="mt-2 font-body text-[13px] text-black"
        >
          {state.message}
        </p>
      )}

      {!invalid && (
        <p className="mt-2.5 font-body text-[13px] text-zinc-400">
          No spam. One email when we launch.
        </p>
      )}
    </form>
  );
}
