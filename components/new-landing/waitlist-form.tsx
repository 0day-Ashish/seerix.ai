"use client";

import { useActionState, useId } from "react";

import { joinWaitlist, type WaitlistState } from "@/app/waitlist/actions";
import {
  ButtonArrow,
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";

const initialState: WaitlistState = { status: "idle" };

/**
 * The page's one action: an email field and "Join waitlist", sharing a row on
 * all but the narrowest screens. Used in the hero and the closing section, so
 * its ids come from useId rather than being fixed. State comes back from the Server Action rather
 * than living in the client, so a rejected submit keeps what was typed and the
 * same validation governs a direct POST.
 */
export default function WaitlistForm({
  note = "no spam · one email when we launch · read-only Google access, revoke anytime",
  className = "",
}: {
  /** The mono line under the field. */
  note?: string;
  className?: string;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const trapId = `${uid}-trap`;

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="inline-flex items-center gap-2.5 rounded-xl border border-black/[0.09] bg-white px-4 py-3 font-body text-[14px] text-black sm:text-[15px]"
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
    <form action={action} className={`max-w-md ${className}`}>
      {/* Hidden from real users; bots fill it and are answered with a success
          that never reaches the delivery step. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0">
        <label htmlFor={trapId}>Company website</label>
        <input
          id={trapId}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex-1">
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@company.com"
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            className={`h-10 w-full rounded-xl border bg-white px-3.5 font-body text-[14px] text-black transition-colors duration-200 placeholder:text-zinc-400 focus:outline-none sm:h-11 sm:text-[15px] ${
              invalid
                ? "border-black/[0.28] focus:border-black/[0.45]"
                : "border-black/[0.09] hover:border-black/[0.16] focus:border-black/[0.35]"
            }`}
          />
        </div>

        {/* Not the shared Button, which is a Link: this submits. Same
            classes and glow, so the two read as one system. */}
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass("primary")} sm:h-11`}
        >
          <Glow variant="primary" />
          <ButtonLabel>
            {pending ? "Joining..." : "Join waitlist"}
            {!pending && <ButtonArrow />}
          </ButtonLabel>
        </button>
      </div>

      {invalid && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-body text-[13px] text-black"
        >
          {state.message}
        </p>
      )}

      {!invalid && (
        <p className="mt-2.5 font-mono text-[11.5px] tracking-[0.01em] text-zinc-500">
          {note}
        </p>
      )}
    </form>
  );
}
