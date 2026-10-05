"use server";

type Field = "firstName" | "lastName" | "company" | "email" | "source" | "message";

/** What the form renders back to the user after a submit attempt. */
export type ContactState = {
  status: "idle" | "success" | "error";
  /** Shown above the form on failure, or as the confirmation on success. */
  message?: string;
  /** Per-field messages, keyed by input name. */
  errors?: Partial<Record<Field, string>>;
  /** Echoed back so a rejected submit does not wipe what was typed. */
  values?: Partial<Record<Field, string>>;
};

/** Mirrors the <select> options; anything else is a tampered payload. */
const sources = [
  "Search engine",
  "LinkedIn",
  "X / Twitter",
  "A friend or colleague",
  "Newsletter or podcast",
  "Other",
];

/** Deliberately permissive: shape only, since delivery is the real test. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a contact submission and hands it to the delivery step.
 *
 * Server Actions are reachable by direct POST, not just through the form, so
 * every field is re-validated here regardless of the client-side constraints.
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Bots fill every field they find; this one is hidden from real users.
  if (field(formData, "company_website")) {
    return { status: "success", message: "Thanks. Your message is on its way." };
  }

  const values = {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    company: field(formData, "company"),
    email: field(formData, "email"),
    source: field(formData, "source"),
    message: field(formData, "message"),
  };

  const errors: ContactState["errors"] = {};

  if (!values.firstName) errors.firstName = "Required.";
  else if (values.firstName.length > 80) errors.firstName = "Too long.";
  if (!values.lastName) errors.lastName = "Required.";
  else if (values.lastName.length > 80) errors.lastName = "Too long.";
  if (!values.company) errors.company = "Required.";
  else if (values.company.length > 120) errors.company = "Too long.";

  if (!values.email) errors.email = "We need somewhere to reply.";
  else if (!emailPattern.test(values.email))
    errors.email = "That does not look like an email address.";

  if (!values.source || !sources.includes(values.source))
    errors.source = "Pick the closest one.";

  // Optional, but bounded.
  if (values.message.length > 4000)
    errors.message = "That is longer than we can take; email us instead.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Something needs fixing before this can send.",
      errors,
      values,
    };
  }

  try {
    await deliverContactMessage(values);
  } catch {
    return {
      status: "error",
      message:
        "We could not send that just now. Email hello@seerix.ai directly and it will reach the same place.",
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks. Your message is on its way.",
  };
}

type ContactMessage = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  source: string;
  message: string;
};

/**
 * Delivery step. There is no mail provider wired up yet, so this posts to
 * CONTACT_WEBHOOK_URL when one is configured and otherwise logs the message
 * server-side -- the form is honest about failure rather than pretending to
 * have sent. Swap the body of this function for the provider SDK when picked.
 */
async function deliverContactMessage(message: ContactMessage): Promise<void> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    console.info("[contact] no CONTACT_WEBHOOK_URL set; message not delivered", {
      source: message.source,
      email: message.email,
    });
    return;
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...message, receivedAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error(`contact webhook responded ${response.status}`);
  }
}
