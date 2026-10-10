import type { Metadata } from "next";

import Chat from "@/components/dashboard/chat";

export const metadata: Metadata = { title: "Chat · Seerix" };

/** `?q=` carries a question handed over from an alert or another tab. */
export default async function ChatPage({
  searchParams,
}: PageProps<"/app/chat">) {
  const { q } = await searchParams;
  return <Chat ask={typeof q === "string" ? q : undefined} />;
}
