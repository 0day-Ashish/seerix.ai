"use server";

import { ROLES, SITE_COUNTS } from "@/lib/waitlist-options";

/** What the form renders back to the user after a submit attempt. */
export type WaitlistState = {
  status: "idle" | "success" | "error";
  /** Shown beneath the form on failure, or as the confirmation on success. */
  message?: string;
  /** Echoed back so a rejected submit does not wipe what was typed. */
  email?: string;
};

/** Deliberately permissive: shape only, since delivery is the real test. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a waitlist signup and hands it to the delivery step.
 *
 * Server Actions are reachable by direct POST, not just through the form, so
 * the address is re-validated here regardless of the input's own constraints.
 */
export async function joinWaitlist(
  _previous: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  // Bots fill every field they find; this one is hidden from real users.
  if (field(formData, "company_website")) {
    return { status: "success", message: "You're on the list." };
  }

  const email = field(formData, "email");

  if (!email) {
    return {
      status: "error",
      message: "Enter an email address to join.",
      email,
    };
  }

  if (!emailPattern.test(email)) {
    return {
      status: "error",
      message: "That does not look like an email address.",
      email,
    };
  }

  if (email.length > 254) {
    return { status: "error", message: "That address is too long.", email };
  }

  try {
    await recordWaitlistSignup(email);
  } catch {
    return {
      status: "error",
      message:
        "We could not save that just now. Email hello@seerix.ai and we will add you by hand.",
      email,
    };
  }

  return {
    status: "success",
    message: "You're on the list. We'll be in touch before launch.",
  };
}

type DetailField = "name" | "email" | "role" | "sites" | "consent";

export type WaitlistDetailsState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<DetailField, string>>;
  /** Echoed back so a rejected submit keeps what was typed. */
  values?: Partial<Record<Exclude<DetailField, "consent">, string>>;
};

/**
 * The waitlist page's fuller form: name, email, who
 * they are, how many sites they look after, and consent to the launch email.
 * Re-validated here, since an action can be reached by direct POST.
 */
export async function joinWaitlistWithDetails(
  _previous: WaitlistDetailsState,
  formData: FormData,
): Promise<WaitlistDetailsState> {
  if (field(formData, "company_website")) {
    return { status: "success", message: "You're on the list." };
  }

  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    role: field(formData, "role"),
    sites: field(formData, "sites"),
  };
  const consent = formData.get("consent") === "on";
  const errors: WaitlistDetailsState["errors"] = {};

  if (!values.name) errors.name = "Please tell us your name.";
  else if (values.name.length > 120) errors.name = "That name is too long.";
  if (!values.email) errors.email = "We need somewhere to write to you.";
  else if (!emailPattern.test(values.email) || values.email.length > 254)
    errors.email = "That does not look like an email address.";
  if (values.role && !(ROLES as readonly string[]).includes(values.role))
    errors.role = "Pick the closest one.";
  if (values.sites && !(SITE_COUNTS as readonly string[]).includes(values.sites))
    errors.sites = "Pick the closest one.";
  if (!consent) errors.consent = "Tick this so we can email you at launch.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "A few things need another look.",
      errors,
      values,
    };
  }

  try {
    await recordWaitlistSignup(values.email, {
      name: values.name,
      role: values.role,
      sites: values.sites,
    });
  } catch {
    return {
      status: "error",
      message:
        "We could not save that just now. Email hello@seerix.ai and we will add you by hand.",
      values,
    };
  }

  return {
    status: "success",
    message: "You're on the list. We'll write once, the day Seerix opens.",
  };
}

/**
 * Delivery step -- DELIBERATELY NOT WIRED UP.
 *
 * Nothing is persisted yet: signups are logged server-side and go no further,
 * so a real address entered in production is NOT stored anywhere. Replace the
 * body of this function with the destination (provider SDK, webhook or a
 * database insert) before this form is of any use.
 *
 * It is written as a throwing async step so the form's failure path is real:
 * when the replacement fails, the user is told rather than thanked.
 */
async function recordWaitlistSignup(
  email: string,
  details?: Record<string, string>,
): Promise<void> {
  console.info("[waitlist] signup received; no destination configured", {
    email,
    ...details,
    receivedAt: new Date().toISOString(),
  });
}
