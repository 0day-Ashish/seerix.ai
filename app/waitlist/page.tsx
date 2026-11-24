import type { Metadata } from "next";

import WaitlistPage from "@/components/waitlist/waitlist-page";

export const metadata: Metadata = {
  title: "Join the waitlist · Seerix",
  description:
    "Seerix opens to a small group of site owners, SEO consultants and agencies first. Leave your details and we will write once, the day it opens.",
};

/** The waitlist page: its own full screen, without the site's bar or footer. */
export default function Waitlist() {
  return <WaitlistPage />;
}
