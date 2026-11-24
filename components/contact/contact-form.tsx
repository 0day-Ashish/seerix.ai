"use client";

import { useActionState } from "react";

import { submitContact, type ContactState } from "@/app/contact/actions";
import {
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";

const initialState: ContactState = { status: "idle" };

/** The fields' look, after the tokensupply form: a white well with a quiet
 *  rim and small corners, on the panel's soft grey. */
const WELL =
  "h-12 w-full rounded-md border border-black/[0.10] bg-white px-4 font-body text-[15px] text-black transition-colors duration-150 placeholder:text-zinc-400 hover:border-black/20 focus:border-black/40 focus:outline-none aria-[invalid=true]:border-signal-deep";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-[14px] text-zinc-800">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-body text-[13px] text-signal-deep">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The contact form, short, after the tokensupply site's: first and last name,
 * work email and company in two pairs, then anything we should know, and one
 * full-width button. State comes back from the Server Action, so a rejected
 * submit keeps what was typed and the same checks govern a direct POST.
 */
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl bg-[#ecebe7] p-6 md:p-8">
        <p className="flex items-center gap-3 font-body text-[20px] font-medium text-black">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" />
          Message sent
        </p>
        <p className="mt-3 max-w-lg font-body text-[15px] leading-[1.65] text-zinc-600">
          {state.message} We reply within one business day. If it is urgent,
          write to{" "}
          <a
            href="mailto:hello@seerix.ai"
            className="text-black underline decoration-zinc-400 underline-offset-[3px] hover:decoration-black"
          >
            hello@seerix.ai
          </a>
          .
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const describe = (name: keyof typeof errors) =>
    errors[name] ? `${name}-error` : undefined;

  return (
    <div className="rounded-xl bg-[#ecebe7] p-6 md:p-8">
      <form action={action} noValidate className="relative flex flex-col gap-6">
        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="rounded-md bg-signal-soft px-4 py-3 font-body text-[14px] text-signal-deep"
          >
            {state.message}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          <Field id="firstName" label="First name" error={errors.firstName}>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              placeholder="Alex"
              defaultValue={values.firstName}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={describe("firstName")}
              className={WELL}
            />
          </Field>
          <Field id="lastName" label="Last name" error={errors.lastName}>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              placeholder="Rivera"
              defaultValue={values.lastName}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={describe("lastName")}
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
              aria-describedby={describe("email")}
              className={WELL}
            />
          </Field>
          <Field id="company" label="Company" error={errors.company}>
            <input
              id="company"
              name="company"
              autoComplete="organization"
              placeholder="Your site or company"
              defaultValue={values.company}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={describe("company")}
              className={WELL}
            />
          </Field>
        </div>

        <Field id="message" label="Anything we should know?" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={4000}
            placeholder="The site or property, roughly when things changed, and what you have already tried."
            defaultValue={values.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message")}
            className={`${WELL} h-auto min-h-[140px] resize-y py-3.5 leading-6`}
          />
        </Field>

        {/* Honeypot: off-screen and skipped by tab order, so only bots fill it. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={pending}
            className={`${buttonClass("primary")} h-12 w-full text-[15px]`}
          >
            <Glow />
            <ButtonLabel>{pending ? "Sending" : "Send message"}</ButtonLabel>
          </button>
          <p className="font-body text-[13px] leading-[1.55] text-zinc-500">
            A person reads every message. We use your details only to reply; see
            the{" "}
            <a
              href="/privacy"
              className="text-zinc-800 underline decoration-zinc-400 underline-offset-[3px] hover:decoration-black"
            >
              privacy policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
