"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  joinWaitlistWithDetails,
  type WaitlistDetailsState,
} from "@/app/waitlist/actions";
import { ButtonLabel, Glow, buttonClass } from "@/components/new-landing/button";
import SeerixMark from "@/components/new-landing/seerix-mark";
import { ROLES, SITE_COUNTS } from "@/lib/waitlist-options";

const initialState: WaitlistDetailsState = { status: "idle" };

const WELL =
  "h-12 w-full rounded-xl border border-black/[0.10] bg-white px-4 font-body text-[15px] text-black transition-colors duration-150 placeholder:text-zinc-400 hover:border-black/20 focus:border-black/40 focus:outline-none aria-[invalid=true]:border-signal-deep";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-body text-[14px] font-medium text-black">
          {label}
        </label>
        {optional && (
          <span className="font-body text-[13px] text-zinc-500">Optional</span>
        )}
      </span>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-body text-[13px] text-signal-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  id,
  options,
  defaultValue,
  error,
}: {
  id: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${WELL} cursor-pointer appearance-none pr-12`}
      >
        <option value="">Choose…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}

/**
 * The waitlist page, after Writ's: a soft colour field with the mark and one
 * line on the left, and the form on the right with a way back home. On a
 * phone the field becomes a short band above the form.
 */
export default function WaitlistPage() {
  const [state, action, pending] = useActionState(
    joinWaitlistWithDetails,
    initialState,
  );
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <div className="grid min-h-dvh bg-white lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
      {/* The field: lilac from one corner, peach from the other. */}
      <aside className="relative flex min-h-[15rem] items-center justify-center overflow-hidden bg-[#faf9f7] px-8 py-14 lg:sticky lg:top-0 lg:h-dvh">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#bdb4f8]/70 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full bg-[#f3cfae]/80 blur-[100px]"
        />
        <div className="relative flex flex-col items-center text-center">
          <SeerixMark size={64} animated={false} />
          <p className="mt-10 max-w-md text-balance font-display text-[34px] font-extralight leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
            Know why your rankings moved, with Seerix.
          </p>
        </div>
      </aside>

      <main className="flex flex-col px-6 pb-12 pt-8 sm:px-12 lg:h-dvh lg:overflow-y-auto lg:px-16 lg:pb-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2.5 font-body text-[15px] font-medium text-black transition-colors hover:text-zinc-600"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          Home
        </Link>

        <div className="mx-auto mt-10 w-full max-w-[460px] lg:mb-auto lg:mt-auto lg:py-8">
          {state.status === "success" ? (
            <div role="status">
              <h1 className="font-body text-[32px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
                You&rsquo;re on the list
              </h1>
              <p className="mt-3 font-body text-[15px] leading-[1.55] text-zinc-600">
                {state.message} Until then, the{" "}
                <Link
                  href="/manifesto"
                  className="text-black underline decoration-zinc-400 underline-offset-[3px] hover:decoration-black"
                >
                  manifesto
                </Link>{" "}
                says why we are building it.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-body text-[32px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
                Join the waitlist
              </h1>
              <p className="mt-3 font-body text-[15px] leading-[1.55] text-zinc-600">
                Seerix opens to a small group of site owners, SEO consultants
                and agencies first. Leave your details and we&rsquo;ll write
                once, the day it opens.
              </p>

              <form action={action} noValidate className="relative mt-7 flex flex-col gap-4">
                {state.status === "error" && state.message && !state.errors && (
                  <p
                    role="alert"
                    className="rounded-xl bg-signal-soft px-4 py-3 font-body text-[14px] text-signal-deep"
                  >
                    {state.message}
                  </p>
                )}

                <Field id="name" label="Full name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    defaultValue={values.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={WELL}
                  />
                </Field>

                <Field id="email" label="Work email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    defaultValue={values.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={WELL}
                  />
                </Field>


                <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
                  <Field id="role" label="You are" error={errors.role}>
                    <Select id="role" options={ROLES} defaultValue={values.role} error={errors.role} />
                  </Field>
                  <Field id="sites" label="Sites you look after" error={errors.sites}>
                    <Select
                      id="sites"
                      options={SITE_COUNTS}
                      defaultValue={values.sites}
                      error={errors.sites}
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-start gap-3.5">
                    <input
                      type="checkbox"
                      name="consent"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "consent-error" : undefined}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#5b4fd8]"
                    />
                    <span className="font-body text-[13.5px] leading-[1.5] text-zinc-600">
                      Seerix may email me about the waitlist and its launch. I
                      can unsubscribe at any time.
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="consent-error" className="pl-[30px] font-body text-[13px] text-signal-deep">
                      {errors.consent}
                    </p>
                  )}
                </div>

                {/* Honeypot: off-screen and skipped by tab order. */}
                <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="company_website">Company website</label>
                  <input
                    id="company_website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className={`${buttonClass("primary")} mt-1 h-12 w-full !rounded-full text-[15px]`}
                >
                  <Glow />
                  <ButtonLabel>{pending ? "Joining" : "Join the waitlist"}</ButtonLabel>
                </button>

                <p className="font-body text-[13px] leading-[1.55] text-zinc-500">
                  We use your details only to contact you about Seerix. We never
                  share or sell them. See our{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-black underline-offset-[3px] hover:underline"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
