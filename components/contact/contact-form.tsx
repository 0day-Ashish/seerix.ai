"use client";

import { useActionState } from "react";

import { submitContact, type ContactState } from "@/app/contact/actions";

const topics = [
  "Product question",
  "Pricing and plans",
  "Demo request",
  "Security and data",
  "Partnership",
  "Something else",
];

const initialState: ContactState = { status: "idle" };

/** Shared input chrome: one border treatment across text, select and area. */
const fieldBase =
  "w-full rounded-[10px] border bg-white px-3.5 py-3 font-body text-[15px] text-black transition-colors duration-200 placeholder:text-zinc-400 focus:outline-none";

function fieldClass(invalid: boolean) {
  return `${fieldBase} ${
    invalid
      ? "border-black/[0.28] focus:border-black/[0.45]"
      : "border-black/[0.09] hover:border-black/[0.16] focus:border-black/[0.35]"
  }`;
}

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-body text-[14px] font-medium text-black"
    >
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="font-body text-[13px] text-zinc-500">
      {message}
    </p>
  );
}

/**
 * The contact form proper. State comes back from the Server Action rather than
 * living in the client, so a rejected submit keeps what was typed and the same
 * validation governs a direct POST.
 */
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-black/[0.07] bg-white p-7"
      >
        <h2 className="font-display text-[19px] font-medium tracking-[-0.02em] text-black">
          Message sent
        </h2>
        <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
          {state.message} We reply within one business day, usually sooner. If
          it is urgent, mail{" "}
          <a
            href="mailto:hello@seerix.ai"
            className="text-black underline underline-offset-4 transition-colors duration-200 hover:text-zinc-500"
          >
            hello@seerix.ai
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form
      action={action}
      noValidate
      className="relative rounded-xl border border-black/[0.07] bg-white p-7"
    >
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mb-6 rounded-[10px] border border-black/[0.12] bg-zinc-50 px-3.5 py-3 font-body text-[14px] leading-[1.6] text-zinc-600"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass(Boolean(errors.name))}
            placeholder="Alex Mercer"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work email</Label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(Boolean(errors.email))}
            placeholder="alex@company.com"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Label htmlFor="topic">What is this about</Label>
        <select
          id="topic"
          name="topic"
          defaultValue={values.topic ?? ""}
          aria-invalid={Boolean(errors.topic)}
          aria-describedby={errors.topic ? "topic-error" : undefined}
          className={`${fieldClass(Boolean(errors.topic))} cursor-pointer`}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <FieldError id="topic-error" message={errors.topic} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
          placeholder="Tell us about your site, your market, and what you are trying to work out."
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot: off-screen and skipped by tab order, so only bots fill it. */}
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

      <div className="mt-7 flex flex-col gap-4 border-t border-black/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-[13px] leading-[1.6] text-zinc-400">
          We use what you send here to answer you, nothing else.
        </p>

        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-11 shrink-0 translate-y-0 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-5 font-body text-[15px] text-white transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#1c1c21,0_4px_10px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_5px_0_0_#1c1c21,0_9px_16px_rgba(0,0,0,0.22)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)] disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Sending" : "Send message"}
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
        </button>
      </div>
    </form>
  );
}
