/** The choices the waitlist page offers. The server action accepts nothing
 *  else, so the two always agree. */
export const ROLES = [
  "Founder or marketer",
  "In-house SEO",
  "SEO consultant",
  "Agency",
  "Something else",
] as const;

export const SITE_COUNTS = ["1", "2 to 5", "6 to 20", "More than 20"] as const;
