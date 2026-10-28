"use client";

import { useActionState, useState } from "react";

import { submitContact, type ContactState } from "@/app/contact/actions";

const sources = [
  "Search engine",
  "LinkedIn",
  "X / Twitter",
  "A friend or colleague",
  "Newsletter or podcast",
  "Other",
];

const initialState: ContactState = { status: "idle" };

/** One border treatment across text, select and area, on the grey panel. */
const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 font-body text-[16px] text-black transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-signal-bright/15";

function fieldClass(invalid: boolean) {
  return `${fieldBase} ${
    invalid
      ? "border-signal-bright focus:border-signal-bright"
      : "border-black/[0.12] hover:border-black/30 focus:border-signal-bright hover:focus:border-signal-bright"
  }`;
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-body text-[14px] font-medium text-black"
    >
      {children}
      {required && "*"}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="font-body text-[13px] text-signal-deep">
      {message}
    </p>
  );
}

/**
 * The contact form: a grey panel with mono labels, two fields to a row, and a
 * submit that stays muted until every required field has something in it.
 * State comes back from the Server Action rather than living in the client,
 * so a rejected submit keeps what was typed and the same validation governs a
 * direct POST.
 */
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);
  // Tracks only whether the required fields are filled, to wake the button.
  const [filled, setFilled] = useState<Record<string, boolean>>({});

  const panel =
    "rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-12";

  if (state.status === "success") {
    return (
      <div role="status" className={panel}>
        <h2 className="flex items-center gap-4 font-display text-[36px] tracking-[-0.03em] text-black">
          <span className="h-3 w-3 rounded-full bg-signal-bright" />
          Message sent
        </h2>
        <p className="mt-5 max-w-lg font-body text-[16px] leading-[1.65] text-zinc-600">
          {state.message} We reply within one business day. If it is urgent,
          mail{" "}
          <a
            href="mailto:hello@seerix.ai"
            className="text-black underline underline-offset-4"
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
  const required = ["firstName", "lastName", "company", "email", "source"];
  const ready = required.every(
    (n) => filled[n] ?? Boolean(values[n as keyof typeof values]),
  );

  const track = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement;
    if (required.includes(t.name)) {
      setFilled((f) => ({ ...f, [t.name]: t.value.trim() !== "" }));
    }
  };

  const describe = (name: keyof typeof errors) =>
    errors[name] ? `${name}-error` : undefined;

  return (
    <form
      action={action}
      noValidate
      onInput={track}
      onChange={track}
      className={`relative ${panel}`}
    >
      <h2 className="flex items-center gap-4 font-display text-[36px] tracking-[-0.03em] text-black sm:text-[42px]">
        <span
          aria-hidden="true"
          className="h-3 w-3 shrink-0 rounded-full bg-signal-bright"
        />
        Contact us
      </h2>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-signal-bright/40 bg-signal-soft px-4 py-3 font-body text-[14px] text-signal-deep"
        >
          {state.message}
        </p>
      )}

      <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {(
          [
            ["firstName", "First name", "First Name", "given-name", "text"],
            ["lastName", "Last name", "Last Name", "family-name", "text"],
            ["company", "Company", "Company", "organization", "text"],
            ["email", "Work email", "Work Email", "email", "email"],
          ] as const
        ).map(([name, label, placeholder, auto, type]) => (
          <div key={name} className="flex flex-col gap-3">
            <Label htmlFor={name} required>
              {label}
            </Label>
            <input
              id={name}
              name={name}
              type={type}
              autoComplete={auto}
              placeholder={placeholder}
              defaultValue={values[name]}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={describe(name)}
              className={fieldClass(Boolean(errors[name]))}
            />
            <FieldError id={`${name}-error`} message={errors[name]} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Label htmlFor="source" required>
          How did you find us
        </Label>
        <div className="relative">
          <select
            id="source"
            name="source"
            defaultValue={values.source ?? ""}
            aria-invalid={Boolean(errors.source)}
            aria-describedby={describe("source")}
            className={`${fieldClass(Boolean(errors.source))} cursor-pointer appearance-none pr-12 invalid:text-zinc-400`}
            required
          >
            <option value="" disabled>
              Select one...
            </option>
            {sources.map((s) => (
              <option key={s} value={s} className="text-black">
                {s}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-black"
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
        <FieldError id="source-error" message={errors.source} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Label htmlFor="message">How can we help?</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describe("message")}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
          placeholder="Tell us about your site, timeline, or any questions..."
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

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

      <button
        type="submit"
        disabled={pending}
        aria-disabled={!ready}
        // The homepage's raised primary button. Until the form is ready it
        // sits slightly dimmed.
        className={`group mt-10 inline-flex h-12 translate-y-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-7 font-body text-[16px] font-medium text-white transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#1c1c21,0_4px_10px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_5px_0_0_#1c1c21,0_9px_16px_rgba(0,0,0,0.22)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)] disabled:opacity-60 ${
          ready ? "opacity-100" : "opacity-75"
        }`}
      >
        {pending ? "Sending" : "Submit"}
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </button>
    </form>
  );
}
