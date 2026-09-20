"use server";

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
async function recordWaitlistSignup(email: string): Promise<void> {
  console.info("[waitlist] signup received; no destination configured", {
    email,
    receivedAt: new Date().toISOString(),
  });
}
